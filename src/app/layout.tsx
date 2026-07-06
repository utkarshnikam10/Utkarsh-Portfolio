import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/dom/Providers";

/**
 * PROJECT NEXUS // GLOBAL LAYOUT
 * Responsibility: Sets metadata and mounts global DOM wrappers/Providers.
 * Defines the high-level HTML shell.
 */

export const metadata: Metadata = {
  title: "PROJECT NEXUS // The Living Mind",
  description:
    "An interactive digital headquarters mapping an engineering journey through spatial, brutalist structures.",
  openGraph: {
    title: "PROJECT NEXUS // The Living Mind",
    description:
      "An interactive digital headquarters mapping an engineering journey through spatial, brutalist structures.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PROJECT NEXUS // The Living Mind",
    description:
      "An interactive digital headquarters mapping an engineering journey through spatial, brutalist structures.",
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
