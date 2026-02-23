import * as THREE from 'three'

/**
 * Edge outline utility for React Three Fiber.
 *
 * Adds wireframe-style edge lines to every mesh in a scene, producing
 * the "hand-drawn outline" look commonly paired with toon/cel shading
 * (e.g. planetono.space).
 *
 * Usage with R3F:
 *   import { addOutlines } from '@/lib/edge-outlines'
 *
 *   function Model() {
 *     const { scene } = useGLTF('/models/character.glb')
 *     useMemo(() => {
 *       applyToonShading(scene)
 *       addOutlines(scene)
 *     }, [scene])
 *     return <primitive object={scene} />
 *   }
 */

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

export interface OutlineOptions {
  /**
   * CSS-style colour string for the outline.
   * @default '#000000'
   */
  color?: string

  /**
   * Angle threshold in degrees. An edge is only drawn when the angle
   * between adjacent faces exceeds this value. Lower values produce more
   * lines (more detail), higher values produce fewer (cleaner look).
   * @default 15
   */
  thresholdAngle?: number

  /**
   * Width of the outline lines.  Note: on most GPUs, WebGL line width is
   * clamped to 1.0 regardless of the value set here. For thicker outlines,
   * consider a post-processing approach (e.g. @react-three/postprocessing
   * Outline effect).
   * @default 1
   */
  lineWidth?: number

  /**
   * Whether the outline should render on top of (depthTest false) or
   * respect depth. Setting to false avoids outlines being hidden by
   * geometry in front of them, which can look better on complex models.
   * @default true
   */
  depthTest?: boolean
}

// Internal marker so we can identify lines we added.
const OUTLINE_USER_DATA_KEY = '__toonOutline'

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/**
 * Traverses `scene` and adds edge-outline LineSegments to every Mesh.
 *
 * The outlines are added as children of each mesh so they inherit
 * transforms automatically.
 *
 * @param scene          - A THREE.Group (typically from useGLTF)
 * @param color          - Outline colour (CSS string). Default `'#000000'`
 * @param thresholdAngle - Edge angle threshold in degrees. Default `15`
 */
export function addOutlines(
  scene: THREE.Group,
  color?: string,
  thresholdAngle?: number,
): void
export function addOutlines(
  scene: THREE.Group,
  options?: OutlineOptions,
): void
export function addOutlines(
  scene: THREE.Group,
  colorOrOptions?: string | OutlineOptions,
  thresholdAngle?: number,
): void {
  // Normalise overloaded arguments
  let opts: OutlineOptions
  if (typeof colorOrOptions === 'string') {
    opts = { color: colorOrOptions, thresholdAngle }
  } else {
    opts = colorOrOptions ?? {}
  }

  const {
    color = '#000000',
    thresholdAngle: threshold = 15,
    lineWidth = 1,
    depthTest = true,
  } = opts

  const lineMaterial = new THREE.LineBasicMaterial({
    color: new THREE.Color(color),
    linewidth: lineWidth,
    depthTest,
  })

  scene.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) return
    const mesh = child as THREE.Mesh

    // Skip if outlines have already been added to this mesh.
    if (
      mesh.children.some(
        (c) => c.userData[OUTLINE_USER_DATA_KEY] === true,
      )
    ) {
      return
    }

    const geometry = mesh.geometry
    if (!geometry) return

    // EdgesGeometry extracts edges where adjacent face normals differ by
    // more than `thresholdAngle` degrees. This gives clean, deliberate
    // outlines rather than every single triangle edge.
    const edgesGeometry = new THREE.EdgesGeometry(geometry, threshold)
    const lineSegments = new THREE.LineSegments(
      edgesGeometry,
      lineMaterial.clone(), // clone so per-mesh disposal is safe
    )

    // Tag so we can find / remove them later.
    lineSegments.userData[OUTLINE_USER_DATA_KEY] = true
    lineSegments.name = `${mesh.name || 'mesh'}_outline`

    // Outlines should not cast or receive shadows.
    lineSegments.castShadow = false
    lineSegments.receiveShadow = false

    // Render outlines after the mesh to reduce z-fighting.
    lineSegments.renderOrder = mesh.renderOrder + 1

    mesh.add(lineSegments)
  })
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

/**
 * Removes all outline LineSegments previously added by `addOutlines`.
 * Properly disposes geometry and material GPU resources.
 */
export function removeOutlines(scene: THREE.Group): void {
  const toRemove: { parent: THREE.Object3D; child: THREE.Object3D }[] = []

  scene.traverse((child) => {
    if (child.userData[OUTLINE_USER_DATA_KEY] === true) {
      toRemove.push({ parent: child.parent!, child })
    }
  })

  for (const { parent, child } of toRemove) {
    parent.remove(child)

    if (child instanceof THREE.LineSegments) {
      child.geometry.dispose()
      if (child.material instanceof THREE.Material) {
        child.material.dispose()
      }
    }
  }
}

/**
 * Updates the colour of every existing outline in the scene.
 * Useful for theming / dark-mode toggling.
 */
export function updateOutlineColor(
  scene: THREE.Group,
  color: string,
): void {
  const newColor = new THREE.Color(color)

  scene.traverse((child) => {
    if (
      child.userData[OUTLINE_USER_DATA_KEY] === true &&
      child instanceof THREE.LineSegments
    ) {
      const mat = child.material as THREE.LineBasicMaterial
      mat.color.copy(newColor)
    }
  })
}

/**
 * Sets visibility of all outlines in the scene.
 */
export function setOutlineVisibility(
  scene: THREE.Group,
  visible: boolean,
): void {
  scene.traverse((child) => {
    if (child.userData[OUTLINE_USER_DATA_KEY] === true) {
      child.visible = visible
    }
  })
}
