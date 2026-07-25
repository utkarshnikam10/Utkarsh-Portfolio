import type { Metadata } from "next";
import { Syne, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { portfolioData } from "../data/portfolio";
import { ThemeProvider } from "../context/ThemeContext";
import { ShaderProvider } from "../context/ShaderContext";
import { EditorialFrame } from "../components/ui/EditorialFrame";
import { MagneticPointer } from "../components/ui/MagneticPointer";
import { SmoothScroll } from "../components/ui/SmoothScroll";
import { Analytics } from "@vercel/analytics/react";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const { profile } = portfolioData;

export const metadata: Metadata = {
  title: `${profile.name} — ${profile.title}`,
  description: profile.bio,
  keywords: [
    "Utkarsh",
    "Creative Engineer",
    "WebGL Architect",
    "Three.js Developer",
    "Next.js Portfolio",
    "Real-time Shaders",
    "Frontend Architecture",
  ],
  authors: [{ name: profile.name, url: "https://utkarsh.dev" }],
  creator: profile.name,
  metadataBase: new URL("https://utkarsh.dev"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://utkarsh.dev",
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    siteName: "The Obsidian Monolith",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.title}`,
    description: profile.bio,
    creator: "@utkarsh",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    workLocation: profile.location,
    description: profile.bio,
    url: "https://utkarsh.dev",
    sameAs: [profile.github, profile.linkedin],
  };

  return (
    <html lang="en" className="h-full antialiased dark" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${syne.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} min-h-full flex flex-col bg-[#030305] text-white selection:bg-[#ffff23] selection:text-black font-sans antialiased`}
        suppressHydrationWarning
      >
        <ThemeProvider>
          <ShaderProvider>
            {/* Ultra-Minimalist Editorial Border Frame */}
            <EditorialFrame />

            {/* Tactical Magnetic Pointer */}
            <MagneticPointer />

            <SmoothScroll>{children}</SmoothScroll>
            <Analytics />
          </ShaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
