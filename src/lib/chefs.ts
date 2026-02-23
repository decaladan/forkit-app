import type { Chef } from "./types";

export const CHEFS: Record<string, Chef> = {
  "max-flavour": {
    id: "max-flavour",
    name: "Max Flavour",
    emoji: "🔥",
    color: "#FF6B35",
    image: "/images/chefs/max-flavour.png",
    personality: "Bold, aggressive, lives for heat and spice. If it doesn't make your taste buds scream, why bother?",
    catchphrase: "More heat. Always more heat.",
  },
  "maximum-junk": {
    id: "maximum-junk",
    name: "Max Junk",
    emoji: "🧀",
    color: "#FFD600",
    image: "/images/chefs/maximum-junk.png",
    personality: "Gleeful, unapologetic comfort food maximalist. Cheese on everything. Deep-fry the rest.",
    catchphrase: "Add more cheese. Actually, double it.",
  },
  "the-optimizer": {
    id: "the-optimizer",
    name: "The Optimizer",
    emoji: "🧪",
    color: "#00C853",
    image: "/images/chefs/the-optimizer.png",
    personality: "Clinical, precise, data-driven. Measures nutrient density per calorie. If it doesn't optimize your body, why eat it?",
    catchphrase: "Nutrient density per calorie. That's the only metric.",
  },
  "budget-king": {
    id: "budget-king",
    name: "Budget King",
    emoji: "💰",
    color: "#26A69A",
    image: "/images/chefs/budget-king.png",
    personality: "Penny-pincher extraordinaire. Can make magic from pantry scraps. Knows the price of everything.",
    catchphrase: "That's $12 for something you can make for $2.",
  },
  "speed-demon": {
    id: "speed-demon",
    name: "Speed Demon",
    emoji: "⚡",
    color: "#AB47BC",
    image: "/images/chefs/speed-demon.png",
    personality: "Impatient genius. 15-minute meals or bust. Hates complexity. Time is the only ingredient that matters.",
    catchphrase: "If it takes longer than a TikTok scroll, I'm out.",
  },
  "coach-bulk": {
    id: "coach-bulk",
    name: "Coach Bulk",
    emoji: "🏋️",
    color: "#0D47A1",
    image: "/images/chefs/coach-bulk.png",
    personality: "Encouraging, knowledgeable, protein-obsessed coach. 30g protein per meal minimum. Makes gains accessible and delicious.",
    catchphrase: "Feed the muscle, fuel the day.",
  },
};

export const CHEF_LIST = Object.values(CHEFS);

export function getChef(id: string): Chef {
  return CHEFS[id] ?? CHEFS["max-flavour"];
}
