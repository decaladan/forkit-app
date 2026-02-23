"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForkItStore } from "@/lib/store";
import { DebateViewer } from "@/components/DebateViewer";

export default function DebatePage() {
  const router = useRouter();
  const { currentRecipe, screen } = useForkItStore();

  // If no recipe is loaded, redirect to home
  useEffect(() => {
    if (!currentRecipe) {
      router.replace("/");
    }
  }, [currentRecipe, router]);

  // When the debate ends, navigate to the recipe reveal
  useEffect(() => {
    if (screen === "reveal" && currentRecipe) {
      router.replace(`/recipe/${currentRecipe.id}?reveal=1`);
    }
  }, [screen, router, currentRecipe]);

  if (!currentRecipe) {
    return (
      <div className="fixed inset-0 bg-bg flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-forkit-red border-t-transparent animate-spin" />
      </div>
    );
  }

  return <DebateViewer />;
}
