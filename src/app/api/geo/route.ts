import { NextRequest, NextResponse } from "next/server";

// Spanish-speaking countries (ISO 3166-1 alpha-2)
const SPANISH_COUNTRIES = new Set([
  "ES", // Spain
  "MX", // Mexico
  "AR", // Argentina
  "CO", // Colombia
  "PE", // Peru
  "VE", // Venezuela
  "CL", // Chile
  "EC", // Ecuador
  "GT", // Guatemala
  "CU", // Cuba
  "BO", // Bolivia
  "DO", // Dominican Republic
  "HN", // Honduras
  "PY", // Paraguay
  "SV", // El Salvador
  "NI", // Nicaragua
  "CR", // Costa Rica
  "PA", // Panama
  "UY", // Uruguay
  "PR", // Puerto Rico
  "GQ", // Equatorial Guinea
]);

// GET /api/geo — returns suggested language based on Vercel geo headers
export async function GET(req: NextRequest) {
  const country = req.headers.get("x-vercel-ip-country") || "";
  const lang = SPANISH_COUNTRIES.has(country) ? "es" : "en";
  return NextResponse.json({ lang, country });
}
