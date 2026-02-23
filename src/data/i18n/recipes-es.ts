import type { RecipeTranslation } from "@/lib/i18n/types";
import { recipesEs1 } from "./recipes-es-1";
import { recipesEs2 } from "./recipes-es-2";
import { recipesEs3 } from "./recipes-es-3";
import { recipesEs4 } from "./recipes-es-4";
import { recipesEs5 } from "./recipes-es-5";
import { recipesEs6 } from "./recipes-es-6";
import { recipesEs7 } from "./recipes-es-7";

// Spanish translations for all 136 recipes (merged from 7 chunk files)
export const recipesEs: Record<string, RecipeTranslation> = {
  ...recipesEs1, // r001-r020
  ...recipesEs2, // r021-r040
  ...recipesEs3, // r041-r060
  ...recipesEs4, // r061-r080
  ...recipesEs5, // r081-r100
  ...recipesEs6, // r101-r120
  ...recipesEs7, // r121-r136
};
