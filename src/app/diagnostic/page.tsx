"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { DIMENSIONS, INTAKE_FRAMING } from "@/lib/diagnostic-data";
import { isComplete } from "@/lib/scoring";
import type { Answers, Exposure } from "@/lib/types";
import OptionCard from "@/components/OptionCard";
import ProgressBar from "@/components/ProgressBar";
import ResultsPage from "@/components/ResultsPage";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const TOTAL_STEPS = DIMENSIONS.length + 1; // intake + 5 dimensions

export default function DiagnosticPage() {
  const [step, setStep] = useState(0); // 0 = intake, 1..5 = dimensions, 6 = results
  const [useCase, setUseCase] = useState("");
  const [answers, setAnswers] = useState<Answers>({});

  const showResults = step > DIMENSIONS.length;
  const dimension =
    step >= 1 && step <= DIMENSIONS.length ? DIMENSIONS[step - 1] : null;

  const canAdvance =
    step === 0
      ? useCase.trim().length > 0
      : dimension
        ? dimension.questions.every((q) => answers[q.id] !== undefined)
        : false;

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-6 py-4 md:px-12">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <Link href="/" className="hover:opacity-70 transition-opacity">
            <Image
              src={`${basePath}/aieutics_transparentbg_logo.png`}
              alt="Aieutics"
              width={72}
              height={72}
              className="h-[4.5rem] w-auto"
            />
          </Link>
          <span className="font-[family-name:var(--font-heading)] text-xs text-[var(--color-grey)]">
            Perimeter Diagnostic
          </span>
        </div>
      </header>

      <main className="flex-1 px-6 pb-16">
        <div className="max-w-3xl mx-auto">
          {!showResults && (
            <div className="mb-8 no-print">
              <ProgressBar
                total={TOTAL_STEPS}
                current={step}
                labels={[
                  { name: "Use case", count: 1 },
                  { name: "Dimensions", count: DIMENSIONS.length },
                ]}
              />
            </div>
          )}

          {step === 0 && (
            <section>
              <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-3">
                {INTAKE_FRAMING.heading}
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold mb-2">
                {INTAKE_FRAMING.prompt}
              </h2>
              <p className="font-[family-name:var(--font-body)] text-sm text-[var(--color-grey)] leading-relaxed mb-6">
                {INTAKE_FRAMING.note}
              </p>
              <textarea
                value={useCase}
                onChange={(e) => setUseCase(e.target.value)}
                placeholder={INTAKE_FRAMING.placeholder}
                rows={3}
                className="w-full rounded-xl border-2 border-[var(--color-grey-light)] bg-[var(--color-white)] p-5 font-[family-name:var(--font-body)] text-sm leading-relaxed focus:outline-none focus:border-[var(--color-orange)]"
              />
            </section>
          )}

          {dimension && (
            <section>
              <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-widest text-[var(--color-orange)] mb-3">
                {dimension.name}
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold mb-8">
                {dimension.subtitle}
              </h2>
              <div className="space-y-10">
                {dimension.questions.map((q) => (
                  <div key={q.id}>
                    <p className="font-[family-name:var(--font-heading)] text-base font-bold mb-4">
                      {q.text}
                    </p>
                    <div className="space-y-3">
                      {q.options.map((opt) => (
                        <OptionCard
                          key={opt.value}
                          label={opt.label}
                          description={opt.description}
                          example={opt.example}
                          selected={answers[q.id] === opt.value}
                          onSelect={() =>
                            setAnswers((a) => ({
                              ...a,
                              [q.id]: opt.value as Exposure,
                            }))
                          }
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {showResults && isComplete(answers) && (
            <ResultsPage
              answers={answers}
              useCase={useCase}
              onRestart={() => {
                setAnswers({});
                setUseCase("");
                setStep(0);
              }}
            />
          )}

          {!showResults && (
            <div className="flex items-center justify-between mt-10 pt-6 border-t border-[var(--color-grey-light)] no-print">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className={`font-[family-name:var(--font-heading)] text-sm font-bold px-8 py-3 rounded-xl transition-all duration-200 cursor-pointer ${
                  step === 0
                    ? "text-[var(--color-grey-light)] cursor-not-allowed"
                    : "border border-[var(--color-grey-light)] text-[var(--color-grey)] hover:border-[var(--color-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                Back
              </button>
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={!canAdvance}
                className={`font-[family-name:var(--font-heading)] text-sm font-bold px-10 py-3 rounded-xl transition-all duration-300 cursor-pointer ${
                  canAdvance
                    ? "bg-[var(--color-orange)] text-white shadow-[0_0_15px_rgba(255,95,31,0.2)] hover:shadow-[0_0_30px_rgba(255,95,31,0.3)] hover:scale-[1.02]"
                    : "bg-[var(--color-grey-light)] text-[var(--color-grey)] cursor-not-allowed"
                }`}
              >
                {step === DIMENSIONS.length ? "See results" : "Next"}
              </button>
            </div>
          )}
        </div>
      </main>

      <footer className="px-6 py-4 border-t border-[var(--color-grey-light)]">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2">
          <Image
            src={`${basePath}/aieutics_transparentbg_logo.png`}
            alt="Aieutics"
            width={20}
            height={20}
            className="h-5 w-auto opacity-40"
          />
          <p className="font-[family-name:var(--font-body)] text-xs text-[var(--color-grey)] text-center">
            Built by <a href="https://www.aieutics.com">Aieutics</a> from two
            decades of practice across strategy consulting, executive coaching,
            and digital transformation. These diagnostics are starting points.
            If your results raise questions,{" "}
            <a href="https://www.aieutics.com">let&apos;s talk</a>.
          </p>
        </div>
      </footer>
    </div>
  );
}
