"use client";

import { useState, useEffect, useCallback } from "react";

/** Fetch + increment like count for a single recipe */
export function useLikes(recipeId: string) {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Load count + check if user already liked (localStorage)
  useEffect(() => {
    const liked = localStorage.getItem(`liked:${recipeId}`) === "1";
    setHasLiked(liked);

    fetch(`/api/likes/${recipeId}`)
      .then((r) => r.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, [recipeId]);

  const toggleLike = useCallback(async () => {
    if (hasLiked) return; // one like per user per recipe

    setHasLiked(true);
    setCount((c) => c + 1);
    localStorage.setItem(`liked:${recipeId}`, "1");

    try {
      const res = await fetch(`/api/likes/${recipeId}`, { method: "POST" });
      const data = await res.json();
      setCount(data.count);
    } catch {
      // Optimistic update already applied
    }
  }, [recipeId, hasLiked]);

  return { count, hasLiked, toggleLike };
}
