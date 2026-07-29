import type { TelemetryMetric } from "@/types/portfolio";

interface TelemetryGaugeProps {
  metric: TelemetryMetric;
}

export function TelemetryGauge({ metric }: TelemetryGaugeProps) {
  const fillClass = metric.value >= 96 ? "is-max" : metric.value >= 92 ? "is-strong" : "is-steady";

  return (
    <div className="telemetry-gauge">
      <div className="telemetry-gauge__topline">
        <span>{metric.label}</span>
        <strong>
          {metric.value}
          {metric.suffix}
        </strong>
      </div>
      <div className="telemetry-gauge__track" aria-hidden="true">
        <i className={`telemetry-gauge__fill ${fillClass}`} />
      </div>
    </div>
  );
}
