import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/dom/Providers";

/**
 * PROJECT NEXUS // GLOBAL LAYOUT
 * Responsibility: Sets metadata and mounts global DOM wrappers/Providers.
 * Defines the high-level HTML shell.
 */

export const metadata: Metadata = {
  title: "MAHISHMATI // Baahubali: The Interactive Epic",
  description:
    "Explore the royal courts, strategic battlefronts, and legends of the Mahishmati Kingdom in this interactive digital experience.",
  openGraph: {
    title: "MAHISHMATI // Baahubali: The Interactive Epic",
    description:
      "Explore the royal courts, strategic battlefronts, and legends of the Mahishmati Kingdom in this interactive digital experience.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MAHISHMATI // Baahubali: The Interactive Epic",
    description:
      "Explore the royal courts, strategic battlefronts, and legends of the Mahishmati Kingdom in this interactive digital experience.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full w-full">
      <body className="min-h-screen w-screen antialiased font-[family-name:var(--font-inter)] bg-[#0a0a0f]">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
