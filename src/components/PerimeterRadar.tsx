"use client";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import type { DimensionResult } from "@/lib/types";

const SHORT_NAMES: Record<string, string> = {
  "error-profile": "Error profile",
  "reversibility-detection": "Reversibility",
  "blast-radius": "Blast radius",
  "verification-economics": "Verification",
  "posture-readiness": "Readiness",
};

export default function PerimeterRadar({
  results,
}: {
  results: DimensionResult[];
}) {
  const data = results.map((r) => ({
    dimension: SHORT_NAMES[r.dimension.id] ?? r.dimension.name,
    value: r.safetyMargin,
  }));

  return (
    <div className="w-full h-80 md:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="75%">
          <PolarGrid stroke="#e5e5e5" />
          <PolarAngleAxis
            dataKey="dimension"
            tick={{
              fontSize: 12,
              fill: "#1a1a1a",
              fontFamily: "var(--font-heading)",
            }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 6]}
            tickCount={4}
            tick={{ fontSize: 10, fill: "#6b6b6b" }}
            axisLine={false}
            type="number"
          />
          <Radar
            name="Safety margin"
            dataKey="value"
            stroke="#FF5F1F"
            fill="#FF5F1F"
            fillOpacity={0.35}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
      <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] text-center mt-2">
        Safety margin per dimension, 0&ndash;6. A larger shape means more room
        before this use case&apos;s error economics bite.
      </p>
    </div>
  );
}
