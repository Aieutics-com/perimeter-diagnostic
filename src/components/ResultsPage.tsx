"use client";

import { useMemo } from "react";
import {
  computeVerdict,
  getGateProvisions,
  getRedCount,
} from "@/lib/scoring";
import {
  BUDGET_COPY,
  BUDGET_EVIDENCE_LINE,
  CTA_COPY,
  GATE_PROVISION_COPY,
  PERIMETER_TYPE_COPY,
  RESULTS_COPY,
  VERDICT_COPY,
  VETO_COPY,
} from "@/lib/results-data";
import type { Answers } from "@/lib/types";
import PerimeterRadar from "./PerimeterRadar";
import DimensionCard from "./DimensionCard";

interface ResultsPageProps {
  answers: Answers;
  useCase: string;
  onRestart: () => void;
}

export default function ResultsPage({
  answers,
  useCase,
  onRestart,
}: ResultsPageProps) {
  const result = useMemo(() => computeVerdict(answers), [answers]);
  const verdict = VERDICT_COPY[result.verdict];
  const budget = BUDGET_COPY[result.budgetBand];
  const perimeter = PERIMETER_TYPE_COPY[result.perimeterType];
  const provisions =
    result.verdict === "deploy-with-gate" ? getGateProvisions(answers) : [];
  const greenCount = result.dimensionResults.filter(
    (r) => r.status === "green"
  ).length;
  const amberCount = result.dimensionResults.filter(
    (r) => r.status === "amber"
  ).length;
  const redCount = getRedCount(result.dimensionResults);

  return (
    <div>
      {/* Headline */}
      <div className="mb-10 text-center">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          {RESULTS_COPY.eyebrow}
        </p>
        {useCase && (
          <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] italic max-w-xl mx-auto mb-3">
            &ldquo;{useCase}&rdquo;
          </p>
        )}
        <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl font-bold mb-3">
          {verdict.headline}
        </h2>
        <p className="font-[family-name:var(--font-body)] text-base text-[var(--color-grey)] max-w-xl mx-auto mb-4">
          {verdict.line}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-green)] text-white">
            {greenCount} green
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-amber)] text-white">
            {amberCount} amber
          </span>
          <span className="font-[family-name:var(--font-mono)] text-xs px-3 py-1 rounded-full bg-[var(--color-red)] text-white">
            {redCount} red
          </span>
        </div>
      </div>

      {/* Verification budget */}
      <section className="mb-6 rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          {RESULTS_COPY.budgetHeading}
        </p>
        <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">
          {budget.label}{" "}
          <span className="font-[family-name:var(--font-body)] text-sm font-normal text-[var(--color-grey)]">
            ({budget.range})
          </span>
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-1">
          {budget.line}
        </p>
        <p className="font-[family-name:var(--font-body)] text-xs leading-relaxed mt-2 text-[var(--color-grey)]">
          {BUDGET_EVIDENCE_LINE}
        </p>
      </section>

      {/* Perimeter type */}
      <section className="mb-10 rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-2">
          {RESULTS_COPY.perimeterHeading}
        </p>
        <p className="font-[family-name:var(--font-heading)] text-2xl font-bold">
          {perimeter.label}
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-1">
          {perimeter.meaning}
        </p>
      </section>

      {/* Radar */}
      <section className="mb-12">
        <PerimeterRadar results={result.dimensionResults} />
      </section>

      {/* Dimension cards */}
      <section className="mb-12">
        <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4">
          Verdicts by dimension
        </h3>
        <div className="space-y-4">
          {result.dimensionResults.map((r, i) => (
            <DimensionCard key={r.dimension.id} result={r} index={i} />
          ))}
        </div>
      </section>

      {/* Patterns */}
      {result.patterns.length > 0 && (
        <section className="mb-12">
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-bold mb-4">
            Patterns detected
          </h3>
          <div className="space-y-4">
            {result.patterns.map((p) => (
              <div
                key={p.id}
                className="rounded-xl border border-[var(--color-red)] bg-[var(--color-warm-bg)] p-5"
              >
                <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-red)] mb-2">
                  {p.label}
                </p>
                <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed">
                  {p.diagnosis}
                </p>
                <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-2 font-bold">
                  {p.recommendation}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Routing */}
      <section className="mb-12 rounded-xl border border-[var(--color-grey-light)] bg-[var(--color-white)] p-5">
        <p className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-widest text-[var(--color-grey)] mb-2">
          {RESULTS_COPY.routingHeading}
        </p>
        {result.vetoedBy ? (
          <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed">
            {VETO_COPY[result.vetoedBy]}
          </p>
        ) : provisions.length > 0 ? (
          <ul className="space-y-2 list-disc pl-5">
            {provisions.map((p) => (
              <li
                key={p}
                className="font-[family-name:var(--font-body)] text-sm leading-relaxed"
              >
                {GATE_PROVISION_COPY[p]}
              </li>
            ))}
          </ul>
        ) : (
          <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed">
            {verdict.line}
          </p>
        )}
      </section>

      {/* CTA */}
      <section className="mb-12 rounded-xl bg-[var(--color-foreground)] text-white p-6">
        <p className="font-[family-name:var(--font-heading)] text-base font-bold mb-2">
          {CTA_COPY.heading}
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed whitespace-pre-line text-white/80">
          {CTA_COPY.body}
        </p>
        <p className="font-[family-name:var(--font-body)] text-sm leading-relaxed mt-3 text-[var(--color-orange)]">
          {CTA_COPY.callout}
        </p>
      </section>

      <div className="text-center no-print">
        <button
          onClick={onRestart}
          type="button"
          className="font-[family-name:var(--font-heading)] text-sm font-bold border border-[var(--color-grey-light)] text-[var(--color-grey)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)] px-8 py-3 rounded-xl transition-all cursor-pointer"
        >
          Assess another use case
        </button>
      </div>
    </div>
  );
}
