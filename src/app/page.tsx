"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForkItStore } from "@/lib/store";
import { SEED_RECIPES } from "@/data/seed-recipes";
import { getChef, CHEF_LIST } from "@/lib/chefs";
import { useT, useLang, getLocalizedRecipe } from "@/lib/i18n";

function DishCarousel() {
  const lang = useLang();

  // Pick 10 random real recipes for the carousel
  const dishes = useMemo(() => {
    const shuffled = [...SEED_RECIPES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 10);
  }, []);

  // Double the dishes for seamless infinite loop
  const doubled = [...dishes, ...dishes];

  return (
    <div className="carousel-wrapper">
      <div className="carousel-track">
        {doubled.map((recipe, i) => {
          const chef = getChef(recipe.winningChef);
          const localizedRecipe = getLocalizedRecipe(recipe, lang);
          return (
            <Link key={i} href={`/recipe/${recipe.id}`} className="dish-card" draggable={false}>
              {/* Dish image area */}
              <div className="dish-card-image" style={{ background: '#000' }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={`/images/dishes/${recipe.id}.jpg`}
                  alt={localizedRecipe.name}
                  className="w-full h-full object-cover"
                  draggable={false}
                />
              </div>
              {/* Info section */}
              <div className="dish-card-info">
                <h3 className="dish-card-name">{localizedRecipe.name}</h3>
                <p className="dish-card-desc">{localizedRecipe.tagline}</p>
              </div>
              {/* Chef avatar — bottom right of card */}
              <div className="dish-card-avatar" style={{ borderColor: chef.color }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={chef.image} alt={chef.name} className="dish-card-avatar-img" draggable={false} />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default function Home() {
  const router = useRouter();
  const {
    setCurrentRecipe,
    setScreen,
    incrementDailyCount,
    history,
  } = useForkItStore();
  const t = useT();

  useEffect(() => {
    setScreen("home");
  }, [setScreen]);

  const pickRecipe = useCallback(() => {
    const recentIds = history
      .slice(0, SEED_RECIPES.length - 1)
      .map((h) => h.recipeId);
    const available = SEED_RECIPES.filter((r) => !recentIds.includes(r.id));
    const pool = available.length > 0 ? available : SEED_RECIPES;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [history]);

  const handleForkIt = useCallback(() => {
    const recipe = pickRecipe();
    setCurrentRecipe(recipe);
    setScreen("debate");
    incrementDailyCount();
    router.push("/debate");
  }, [pickRecipe, setCurrentRecipe, setScreen, incrementDailyCount, router]);

  return (
    <div className="home-screen">
      {/* Sunburst background */}
      <div className="sunburst" />

      {/* Title */}
      <h1 className="forkit-title">FORK IT</h1>

      {/* Subtitle */}
      <p className="forkit-subtitle">{t.home.subtitle}</p>

      {/* Chefs in a row */}
      <div className="chefs-row">
        {CHEF_LIST.map((chef) => (
          <div key={chef.name} className="chef-slot">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={chef.image} alt={chef.name} className="chef-img" />
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button className="arcade-btn" onClick={handleForkIt}>
        <span className="arcade-btn-shadow" />
        <span className="arcade-btn-edge" />
        <span className="arcade-btn-front">FORK IT!</span>
      </button>

      {/* Tagline */}
      <p className="home-tagline">
        {t.home.tagline}
      </p>

      {/* Dish carousel */}
      <DishCarousel />
    </div>
  );
}
