"use client";

import { useCallback, useMemo, useState } from "react";

import { CAMPAIGNS, UTKARSH } from "@/constants/portfolio";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { AscentSection } from "@/sections/AscentSection";
import { CampaignsSection } from "@/sections/CampaignsSection";
import { CodexSection } from "@/sections/CodexSection";
import { ContactSection } from "@/sections/ContactSection";
import { HeroSection } from "@/sections/HeroSection";
import { IngressSequence } from "@/sections/IngressSequence";
import { SiteHeader } from "@/sections/SiteHeader";
import type { CampaignId } from "@/types/portfolio";

export function PortfolioExperience() {
  const [isReady, setIsReady] = useState(false);
  const [campaignId, setCampaignId] = useState<CampaignId>("nexus-os");
  const campaign = useMemo(
    () => CAMPAIGNS.find((item) => item.id === campaignId) ?? CAMPAIGNS[0],
    [campaignId]
  );
  const finishIngress = useCallback(() => setIsReady(true), []);

  useSmoothScroll();

  return (
    <main className={`portfolio-experience theme-${campaign.theme} ${isReady ? "is-ready" : ""}`}>
      <IngressSequence onComplete={finishIngress} />
      <SiteHeader />
      <HeroSection />
      <CodexSection />
      <CampaignsSection campaign={campaign} onSelect={setCampaignId} />
      <AscentSection />
      <ContactSection />
      <footer className="site-footer">
        <span>UTKARSH // INDEPENDENT PRACTICE</span>
        <a href={`mailto:${UTKARSH.email}`}>{UTKARSH.email}</a>
        <span>© 2026</span>
      </footer>
    </main>
  );
}
