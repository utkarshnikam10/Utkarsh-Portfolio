"use client";

import { AnimatePresence, motion } from "framer-motion";

import { TelemetryGauge } from "@/components/ui/TelemetryGauge";
import { CAMPAIGNS } from "@/constants/portfolio";
import type { Campaign, CampaignId } from "@/types/portfolio";

interface CampaignsSectionProps {
  campaign: Campaign;
  onSelect: (id: CampaignId) => void;
}

function DevicePreview({ campaign }: { campaign: Campaign }) {
  return (
    <div className={`device-preview device-preview--${campaign.device}`} aria-hidden="true">
      <div className="device-preview__laptop">
        <div className="device-preview__notch" />
        <div className={`device-preview__screen device-preview__screen--${campaign.theme}`}>
          <span />
          <i />
          <b />
          <em />
        </div>
      </div>
      {campaign.device !== "laptop" ? (
        <div className="device-preview__mobile">
          <div className={`device-preview__screen device-preview__screen--${campaign.theme}`}>
            <span />
            <i />
            <b />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function CampaignsSection({ campaign, onSelect }: CampaignsSectionProps) {
  return (
    <section
      className="campaigns-section section-shell"
      id="campaigns"
      aria-labelledby="campaigns-title"
    >
      <div className="section-heading section-heading--compact">
        <p className="telemetry-label">03 // CAMPAIGNS</p>
        <div>
          <h2 id="campaigns-title">
            Selected work,
            <br />
            <em>with a point of view.</em>
          </h2>
          <p>
            Case-study fragments from product systems built to hold attention, data, and momentum at
            the same time.
          </p>
        </div>
      </div>

      <div className="campaign-tabs" role="tablist" aria-label="Select a campaign">
        {CAMPAIGNS.map((item) => (
          <button
            aria-selected={item.id === campaign.id}
            className={item.id === campaign.id ? "is-active" : ""}
            key={item.id}
            onClick={() => onSelect(item.id)}
            role="tab"
            type="button"
          >
            <span>{item.index}</span>
            {item.title}
          </button>
        ))}
      </div>

      <div className="campaign-bento">
        <AnimatePresence mode="wait">
          <motion.article
            className="campaign-feature"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -18 }}
            key={campaign.id}
            transition={{ duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="campaign-feature__copy">
              <div className="campaign-feature__topline">
                <span>{campaign.index}</span>
                <span>{campaign.category}</span>
                <span>{campaign.year}</span>
              </div>
              <h3>{campaign.title}</h3>
              <p>{campaign.description}</p>
              <span className="campaign-feature__detail">{campaign.detail}</span>
            </div>
            <DevicePreview campaign={campaign} />
          </motion.article>
        </AnimatePresence>

        <aside className="campaign-metrics" aria-label="Live campaign telemetry">
          <p className="telemetry-label">LIVE SYSTEM READOUT</p>
          <div>
            {campaign.metrics.map((metric) => (
              <TelemetryGauge key={metric.label} metric={metric} />
            ))}
          </div>
          <p className="campaign-metrics__note">
            Signals recalculate with each campaign selection.
          </p>
        </aside>

        <article className="campaign-notes">
          <span className="campaign-notes__index">/ FIELD NOTE</span>
          <p>
            Less visual noise. More directional feedback. Each component has an explicit job in the
            product&apos;s larger argument.
          </p>
          <span>OBSERVATION 03 — 2026</span>
        </article>
      </div>
    </section>
  );
}
