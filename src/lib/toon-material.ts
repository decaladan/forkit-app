import * as THREE from 'three'

/**
 * Toon shading utility for React Three Fiber.
 *
 * Loads a threeTone gradient map and provides helpers to convert any
 * GLTF scene (or arbitrary Group) to MeshToonMaterial with hard-edged
 * cel-shading, inspired by planetono.space.
 *
 * Usage with R3F:
 *   import { applyToonShading } from '@/lib/toon-material'
 *
 *   function Model() {
 *     const { scene } = useGLTF('/models/character.glb')
 *     useMemo(() => applyToonShading(scene), [scene])
 *     return <primitive object={scene} />
 *   }
 */

// ---------------------------------------------------------------------------
// Gradient map singleton (loaded once, shared across all toon materials)
// ---------------------------------------------------------------------------

let _gradientMap: THREE.Texture | null = null

/**
 * Returns the shared threeTone gradient map texture.
 * Created programmatically via DataTexture to avoid file-loading issues.
 *
 * NearestFilter is critical -- it prevents interpolation between the
 * three discrete colour bands and produces the hard shadow edges that
 * define cel/toon shading.
 */
export function getGradientMap(): THREE.DataTexture {
  if (_gradientMap) return _gradientMap as THREE.DataTexture

  // 3-step gradient: shadow / mid / highlight (RGBA format)
  const colors = new Uint8Array([
    60, 60, 60, 255,      // shadow band
    140, 140, 140, 255,   // mid band
    210, 210, 210, 255,   // highlight band
  ])

  const texture = new THREE.DataTexture(colors, 3, 1, THREE.RGBAFormat)
  texture.minFilter = THREE.NearestFilter
  texture.magFilter = THREE.NearestFilter
  texture.generateMipmaps = false
  texture.needsUpdate = true

  _gradientMap = texture
  return texture
}

// ---------------------------------------------------------------------------
// Material conversion
// ---------------------------------------------------------------------------

/**
 * Determines a representative colour from an existing material.
 *
 * Priority:
 *  1. `material.color` (MeshStandardMaterial, MeshPhongMaterial, etc.)
 *  2. White fallback
 */
function extractColor(material: THREE.Material): THREE.Color {
  if ('color' in material && (material as THREE.MeshStandardMaterial).color) {
    return (material as THREE.MeshStandardMaterial).color.clone()
  }
  return new THREE.Color(0xffffff)
}

/**
 * Extracts the diffuse map from the original material if one exists.
 */
function extractMap(material: THREE.Material): THREE.Texture | null {
  if ('map' in material && (material as THREE.MeshStandardMaterial).map) {
    return (material as THREE.MeshStandardMaterial).map
  }
  return null
}

/**
 * Creates a MeshToonMaterial that mirrors the visual intent of the
 * supplied source material (colour + optional diffuse map) while
 * applying the threeTone gradient map for cel-shading.
 */
export function createToonMaterial(
  sourceMaterial: THREE.Material,
): THREE.MeshToonMaterial {
  const color = extractColor(sourceMaterial)
  const map = extractMap(sourceMaterial)
  const gradientMap = getGradientMap()

  const toonMat = new THREE.MeshToonMaterial({
    color,
    gradientMap,
    ...(map ? { map } : {}),
  })

  // Preserve common properties the artist may have set.
  toonMat.side = sourceMaterial.side
  toonMat.transparent = sourceMaterial.transparent
  toonMat.opacity = sourceMaterial.opacity
  toonMat.name = sourceMaterial.name ? `${sourceMaterial.name}_toon` : 'toon'

  return toonMat
}

// ---------------------------------------------------------------------------
// Scene traversal
// ---------------------------------------------------------------------------

/**
 * Walks every mesh in `scene` and replaces its material(s) with
 * MeshToonMaterial equivalents that use the shared threeTone gradient map.
 *
 * - Handles both single materials and material arrays.
 * - Disposes original materials to free GPU memory.
 * - Skips meshes that are already using MeshToonMaterial.
 *
 * @param scene - A THREE.Group, typically from useGLTF().scene
 */
export function applyToonShading(scene: THREE.Group): void {
  const gradientMap = getGradientMap()

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return

    const mesh = child as THREE.Mesh

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map((mat) => {
        if (mat instanceof THREE.MeshToonMaterial) return mat
        const toon = createToonMaterial(mat)
        mat.dispose()
        return toon
      })
    } else {
      if (mesh.material instanceof THREE.MeshToonMaterial) return
      const original = mesh.material
      mesh.material = createToonMaterial(original)
      original.dispose()
    }
  })

  // Ensure the gradient map is fully ready (defensive; the TextureLoader
  // callback may not have fired yet on very fast traversals).
  gradientMap.needsUpdate = true
}

/**
 * Reverts toon-shaded meshes back to MeshStandardMaterial (useful for
 * toggling the effect at runtime).  The gradient map is NOT disposed
 * because it may be reused.
 */
export function removeToonShading(scene: THREE.Group): void {
  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const mesh = child as THREE.Mesh

    const replaceSingle = (mat: THREE.Material): THREE.MeshStandardMaterial => {
      const color = extractColor(mat)
      const map = extractMap(mat)
      const std = new THREE.MeshStandardMaterial({
        color,
        ...(map ? { map } : {}),
      })
      std.side = mat.side
      std.transparent = mat.transparent
      std.opacity = mat.opacity
      mat.dispose()
      return std
    }

    if (Array.isArray(mesh.material)) {
      mesh.material = mesh.material.map(replaceSingle)
    } else if (mesh.material instanceof THREE.MeshToonMaterial) {
      mesh.material = replaceSingle(mesh.material)
    }
  })
}

/**
 * Disposes the cached gradient map texture. Call this during cleanup
 * (e.g. when the R3F Canvas unmounts) to free GPU resources.
 */
export function disposeGradientMap(): void {
  if (_gradientMap) {
    _gradientMap.dispose()
    _gradientMap = null
  }
}
