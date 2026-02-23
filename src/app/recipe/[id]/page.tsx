import type { Metadata } from "next";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { getChef } from "@/lib/chefs";
import RecipePageClient from "./RecipePageClient";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://forkit-app.vercel.app";

interface RecipePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { id } = await params;
  const recipe = SEED_RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return { title: "Recipe Not Found" };
  }

  const chef = getChef(recipe.winningChef);
  const description = `${recipe.tagline} Created by ${chef.name}. ${recipe.stats.totalMinutes} min · ${recipe.nutrition.calories} cal · ${recipe.stats.servings} servings`;

  return {
    title: recipe.name,
    description,
    keywords: [
      recipe.name,
      chef.name,
      recipe.stats.difficulty,
      `${recipe.stats.totalMinutes} minute recipe`,
      "AI recipe",
    ],
    openGraph: {
      title: recipe.name,
      description: `${recipe.tagline} — invented by ${chef.name}`,
      type: "article",
      images: [
        {
          url: `/recipe/${id}/opengraph-image`,
          width: 1200,
          height: 630,
          alt: recipe.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: recipe.name,
      description: `${recipe.tagline} — invented by ${chef.name}`,
      images: [`/recipe/${id}/opengraph-image`],
    },
    alternates: {
      canonical: `/recipe/${id}`,
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { id } = await params;
  const recipe = SEED_RECIPES.find((r) => r.id === id);

  // JSON-LD structured data for Google Recipe rich results
  const recipeJsonLd = recipe
    ? {
        "@context": "https://schema.org",
        "@type": "Recipe",
        name: recipe.name,
        description: recipe.tagline,
        image: [`${BASE_URL}/images/dishes/${recipe.id}.jpg`],
        author: {
          "@type": "Person",
          name: getChef(recipe.winningChef).name,
        },
        datePublished: recipe.createdAt,
        prepTime: `PT${recipe.stats.prepMinutes}M`,
        cookTime: `PT${recipe.stats.cookMinutes}M`,
        totalTime: `PT${recipe.stats.totalMinutes}M`,
        recipeYield: `${recipe.stats.servings} servings`,
        recipeCategory: "dinner",
        keywords: `AI recipe, ${getChef(recipe.winningChef).name}, ${recipe.stats.difficulty}`,
        nutrition: {
          "@type": "NutritionInformation",
          calories: `${recipe.nutrition.calories} calories`,
          proteinContent: `${recipe.nutrition.protein}g`,
          carbohydrateContent: `${recipe.nutrition.carbs}g`,
          fatContent: `${recipe.nutrition.fat}g`,
          fiberContent: `${recipe.nutrition.fiber}g`,
        },
        recipeIngredient: recipe.ingredients.map(
          (ing) => `${ing.amount} ${ing.unit} ${ing.name}`
        ),
        recipeInstructions: recipe.steps.map((step) => ({
          "@type": "HowToStep",
          position: step.number,
          text: step.instruction,
        })),
      }
    : null;

  return (
    <>
      {recipeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(recipeJsonLd).replace(/</g, "\\u003c"),
          }}
        />
      )}
      <RecipePageClient id={id} />
    </>
  );
}
