"use client";

import { DIMENSION_REFLECTIONS } from "@/lib/results-data";
import type { DimensionResult, Status } from "@/lib/types";

const statusPill = (s: Status) => {
  switch (s) {
    case "green":
      return "bg-[var(--color-green)] text-white";
    case "amber":
      return "bg-[var(--color-amber)] text-white";
    case "red":
      return "bg-[var(--color-red)] text-white";
  }
};

const statusLabel = (s: Status) => {
  switch (s) {
    case "green":
      return "Green";
    case "amber":
      return "Amber";
    case "red":
      return "Red";
  }
};

export default function DimensionCard({
  result,
  index,
}: {
  result: DimensionResult;
  index: number;
}) {
  const { dimension, status, safetyMargin, maxExposure } = result;

  return (
    <div className="rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
      <div className="flex items-start justify-between gap-4 mb-2">
        <div>
          <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] uppercase tracking-widest">
            Dimension {index + 1}
          </p>
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold">
            {dimension.name}
          </h3>
        </div>
        <span
          className={`flex-shrink-0 font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full ${statusPill(status)}`}
        >
          {statusLabel(status)}
        </span>
      </div>

      <p className="font-[family-name:var(--font-mono)] text-xs text-[var(--color-grey)] mb-2">
        Safety margin {safetyMargin}/{maxExposure}
      </p>

      {status !== "green" && (
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed text-[var(--color-grey)]">
          {DIMENSION_REFLECTIONS[dimension.id]}
        </p>
      )}
    </div>
  );
}
