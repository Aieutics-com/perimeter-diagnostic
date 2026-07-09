/* ── Answer scale: graded trichotomy ──
 * Departure from the binary portfolio standard, documented in
 * ip/perimeter-diagnostic-design-decisions.md (departure 1).
 * 0 = Clear, 1 = Caution, 2 = Exposed.
 */

export type Exposure = 0 | 1 | 2;

export interface ExposureOption {
  value: Exposure;
  label: string;
  description: string;
  example?: string;
}

export interface ExposureQuestion {
  id: number;
  text: string;
  hint?: string;
  options: ExposureOption[];
}

export interface Dimension {
  id: string;
  name: string;
  subtitle: string;
  questions: ExposureQuestion[];
}

/* ── Scoring ── */

export type Status = "green" | "amber" | "red";

export interface DimensionResult {
  dimension: Dimension;
  exposure: number; // 0-6, sum of the three answers
  maxExposure: number; // 6
  status: Status;
  safetyMargin: number; // 6 - exposure, for radar display
}

export type Answers = Record<number, Exposure | undefined>;

/* ── Verdict ── */

export type Verdict = "deploy" | "deploy-with-gate" | "human-only";

export type PerimeterType =
  | "open-ground"
  | "assistive-review-gated"
  | "specialised-hitl"
  | "inverted-economics"
  | "unbounded-exposure"
  | "unprovisioned-gate";

export type BudgetBand = "marginal" | "material" | "heavy" | "prohibitive";

export interface PatternInterpretation {
  id: string;
  label: string;
  diagnosis: string;
  recommendation: string;
  condition: (results: DimensionResult[], answers: Answers) => boolean;
}

export interface VerdictResult {
  verdict: Verdict;
  perimeterType: PerimeterType;
  budgetBand: BudgetBand;
  /** Set when a Stage 1 veto decided the verdict: names the rule that fired. */
  vetoedBy?: "prohibitive-budget" | "exposure-pair" | "no-detection-mechanism";
  dimensionResults: DimensionResult[];
  patterns: PatternInterpretation[];
}
