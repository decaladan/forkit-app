import type { MetadataRoute } from "next";
import { SEED_RECIPES } from "@/data/seed-recipes";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://forkit-app.vercel.app").trim();

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
  ];

  const recipePages: MetadataRoute.Sitemap = SEED_RECIPES.map((recipe) => ({
    url: `${BASE_URL}/recipe/${recipe.id}`,
    lastModified: new Date(recipe.createdAt),
    changeFrequency: "monthly" as const,
    priority: 0.8,
    images: [`${BASE_URL}/images/dishes/${recipe.id}.jpg`],
  }));

  return [...staticPages, ...recipePages];
}
