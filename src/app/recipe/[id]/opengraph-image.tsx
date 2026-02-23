import { ImageResponse } from "next/og";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { getChef } from "@/lib/chefs";

export const runtime = "edge";
export const alt = "ForkIt Recipe";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://forkit-app.vercel.app").trim();

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const recipe = SEED_RECIPES.find((r) => r.id === id);

  if (!recipe) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#080808",
            color: "#fff",
            fontSize: 48,
            fontWeight: 900,
          }}
        >
          FORK IT
        </div>
      ),
      { ...size }
    );
  }

  const chef = getChef(recipe.winningChef);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: "#ffc737",
          position: "relative",
        }}
      >
        {/* Dish image — left half */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_URL}/images/dishes/${recipe.id}.jpg`}
            alt={recipe.name}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </div>

        {/* Content — right half */}
        <div
          style={{
            width: "50%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "48px 48px 48px 40px",
          }}
        >
          {/* FORK IT brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 24,
            }}
          >
            <div
              style={{
                background: "#fff",
                border: "4px solid #000",
                borderRadius: 12,
                padding: "6px 16px",
                fontSize: 20,
                fontWeight: 900,
                color: "#000",
                letterSpacing: "-0.02em",
              }}
            >
              FORK IT
            </div>
          </div>

          {/* Recipe name */}
          <div
            style={{
              fontSize: 42,
              fontWeight: 900,
              color: "#000",
              lineHeight: 1.1,
              marginBottom: 16,
              display: "flex",
            }}
          >
            {recipe.name}
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 18,
              color: "rgba(0,0,0,0.65)",
              lineHeight: 1.4,
              marginBottom: 28,
              display: "flex",
            }}
          >
            {recipe.tagline}
          </div>

          {/* Stats row */}
          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            {/* Chef pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "#fff",
                border: "3px solid #000",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 16,
                fontWeight: 700,
                color: "#000",
              }}
            >
              <span>{chef.emoji}</span>
              <span>{chef.name}</span>
            </div>

            {/* Calories pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#fff",
                border: "3px solid #000",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 16,
                fontWeight: 700,
                color: "#000",
              }}
            >
              {recipe.nutrition.calories} cal
            </div>

            {/* Time pill */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                background: "#fff",
                border: "3px solid #000",
                borderRadius: 999,
                padding: "6px 14px",
                fontSize: 16,
                fontWeight: 700,
                color: "#000",
              }}
            >
              {recipe.stats.totalMinutes} min
            </div>
          </div>
        </div>

        {/* Comic-style black border at the bottom of the image */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "#000",
            display: "flex",
          }}
        />

        {/* Divider between image and content */}
        <div
          style={{
            position: "absolute",
            top: 0,
            bottom: 0,
            left: "50%",
            width: 6,
            background: "#000",
            display: "flex",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
