import type { Metadata } from "next";
import "./globals.css";

import { siteConfig } from "@/constants/site";

export const metadata: Metadata = {
  title: {
    default: "Utkarsh — interactive portfolio",
    template: "%s — Utkarsh",
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
  openGraph: {
    type: "website",
    siteName: "Utkarsh",
    title: "Utkarsh — interactive portfolio",
    description: siteConfig.description,
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
