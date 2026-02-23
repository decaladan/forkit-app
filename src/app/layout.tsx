import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Poppins } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { HtmlLangSetter } from "@/components/HtmlLangSetter";
import { NavigationWrapper } from "@/components/NavigationWrapper";

const BASE_URL = (process.env.NEXT_PUBLIC_BASE_URL || "https://forkit-app.vercel.app").trim();

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  variable: "--font-display",
  weight: ["400", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "ForkIt — What the fuck do I eat?",
    template: "%s — ForkIt",
  },
  description:
    "Tap the button. Watch 5 AI chefs argue. Get a brand-new recipe invented just for you in 30 seconds. 136 unique recipes with full nutrition, ingredients, and smart swaps.",
  keywords: [
    "recipes",
    "AI chef",
    "cooking",
    "meal ideas",
    "recipe generator",
    "quick recipes",
    "healthy recipes",
    "budget meals",
    "high protein",
    "comfort food",
  ],
  applicationName: "ForkIt",
  category: "food",
  creator: "Dimatica",
  openGraph: {
    title: "ForkIt — What the fuck do I eat?",
    description: "5 AI chefs fight over your dinner. One wins. You eat.",
    type: "website",
    siteName: "ForkIt",
    locale: "en_US",
    images: [
      {
        url: "/images/forkit-og.jpg",
        width: 1200,
        height: 630,
        alt: "ForkIt — AI Chefs. Wacky Dishes.",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ForkIt — What the fuck do I eat?",
    description: "5 AI chefs fight over your dinner. One wins. You eat.",
    images: [
      {
        url: "/images/forkit-og.jpg",
        width: 1200,
        height: 630,
        alt: "ForkIt — AI Chefs. Wacky Dishes.",
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#ffc737",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ForkIt",
    url: BASE_URL,
    description:
      "5 AI chefs fight over your dinner. One wins. You eat. 136 unique recipes with full nutrition, ingredients, and smart swaps.",
  };

  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${poppins.variable} antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <HtmlLangSetter />
        <NavigationWrapper />
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
