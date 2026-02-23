"use client";

import { useState, useEffect, useCallback } from "react";

/** Like counter with toggle support — syncs with server */
export function useLikes(recipeId: string) {
  const [count, setCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  useEffect(() => {
    setHasLiked(localStorage.getItem(`liked:${recipeId}`) === "1");

    fetch(`/api/likes/${recipeId}`)
      .then((r) => r.json())
      .then((data) => setCount(data.count))
      .catch(() => {});
  }, [recipeId]);

  const toggleLike = useCallback(async () => {
    const willLike = !hasLiked;

    // Optimistic update
    setHasLiked(willLike);
    setCount((c) => Math.max(0, willLike ? c + 1 : c - 1));

    if (willLike) {
      localStorage.setItem(`liked:${recipeId}`, "1");
    } else {
      localStorage.removeItem(`liked:${recipeId}`);
    }

    try {
      const res = await fetch(`/api/likes/${recipeId}`, {
        method: willLike ? "POST" : "DELETE",
      });
      const data = await res.json();
      setCount(data.count);
    } catch {
      // Optimistic update already applied
    }
  }, [recipeId, hasLiked]);

  return { count, hasLiked, toggleLike };
}
