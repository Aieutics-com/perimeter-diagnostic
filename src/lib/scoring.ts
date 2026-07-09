import { DIMENSIONS } from "./diagnostic-data";
import { PATTERN_INTERPRETATIONS } from "./results-data";
import type {
  Answers,
  BudgetBand,
  Dimension,
  DimensionResult,
  PerimeterType,
  Status,
  Verdict,
  VerdictResult,
} from "./types";

/* ── Per-dimension aggregation ──
 * Exposure 0-6 per dimension. Green 0-1, amber 2-3, red 4-6.
 * There is deliberately no aggregate total across dimensions: summing would
 * rebuild the ordinal scale this instrument replaces (see design-decisions,
 * departure 2). The dimensions decompose severity; the gate decides.
 */

export function getDimensionStatus(exposure: number): Status {
  if (exposure <= 1) return "green";
  if (exposure <= 3) return "amber";
  return "red";
}

export function scoreDimension(
  dimension: Dimension,
  answers: Answers
): DimensionResult {
  const exposure = dimension.questions.reduce(
    (sum, q) => sum + (answers[q.id] ?? 0),
    0
  );
  const maxExposure = dimension.questions.length * 2;
  return {
    dimension,
    exposure,
    maxExposure,
    status: getDimensionStatus(exposure),
    safetyMargin: maxExposure - exposure,
  };
}

export function scoreAll(answers: Answers): DimensionResult[] {
  return DIMENSIONS.map((d) => scoreDimension(d, answers));
}

function resultFor(results: DimensionResult[], id: string): DimensionResult {
  const r = results.find((x) => x.dimension.id === id);
  if (!r) throw new Error(`Unknown dimension: ${id}`);
  return r;
}

/* ── Verification budget ──
 * Base band from the Verification Economics exposure (0-6); one-band
 * escalator when Q301 is Exposed (plausible-but-wrong errors defeat cheap
 * review, so the checking bill is structurally higher than the workflow
 * suggests). Band boundaries are working judgements pending a published
 * per-industry break-even; see ip/perimeter-diagnostic.md §5.
 */

const BAND_ORDER: BudgetBand[] = ["marginal", "material", "heavy", "prohibitive"];

export function getBudgetBand(results: DimensionResult[], answers: Answers): BudgetBand {
  const v = resultFor(results, "verification-economics").exposure;
  let index: number;
  if (v <= 1) index = 0;
  else if (v <= 3) index = 1;
  else if (v <= 5) index = 2;
  else index = 3;

  if (answers[301] === 2) index = Math.min(index + 1, 3);
  return BAND_ORDER[index];
}

/* ── Verdict: two-stage gate ──
 * Stage 1 vetoes, in order. Stage 2 posture. See ip/perimeter-diagnostic.md §5.
 */

export function computeVerdict(answers: Answers): VerdictResult {
  const results = scoreAll(answers);
  const budgetBand = getBudgetBand(results, answers);

  const errorProfile = resultFor(results, "error-profile");
  const revDetect = resultFor(results, "reversibility-detection");
  const blastRadius = resultFor(results, "blast-radius");
  const verification = resultFor(results, "verification-economics");
  const anyRed = results.some((r) => r.status === "red");

  const base = { budgetBand, dimensionResults: results };

  /* Stage 1 — vetoes */

  // V1: the Meda thesis as a hard rule — checking costs more than the saving.
  if (budgetBand === "prohibitive") {
    return finalise({
      ...base,
      verdict: "human-only",
      perimeterType: "inverted-economics",
      vetoedBy: "prohibitive-budget",
    }, answers);
  }

  // V2: outsiders rely on outputs whose errors are invisible or irrecoverable.
  if (blastRadius.status === "red" && revDetect.status === "red") {
    return finalise({
      ...base,
      verdict: "human-only",
      perimeterType: "unbounded-exposure",
      vetoedBy: "exposure-pair",
    }, answers);
  }

  // V3: a gate is required and none exists. Deploy-with-gate is unavailable
  // when the buyer cannot name a detection mechanism (Q313 Exposed).
  if (answers[313] === 2 && anyRed) {
    return finalise({
      ...base,
      verdict: "human-only",
      perimeterType: "unprovisioned-gate",
      vetoedBy: "no-detection-mechanism",
    }, answers);
  }

  /* Stage 2 — posture */

  const deployClean =
    !anyRed &&
    budgetBand === "marginal" &&
    answers[306] !== 2 && // errors are detectable
    answers[307] !== 2; // no outsider acts on the output unchecked

  if (deployClean) {
    return finalise({ ...base, verdict: "deploy", perimeterType: "open-ground" }, answers);
  }

  const stakesExposure = blastRadius.exposure + revDetect.exposure;
  const economicsExposure = errorProfile.exposure + verification.exposure;
  const perimeterType: PerimeterType =
    stakesExposure > economicsExposure ? "specialised-hitl" : "assistive-review-gated";

  return finalise({ ...base, verdict: "deploy-with-gate", perimeterType }, answers);
}

function finalise(
  partial: Omit<VerdictResult, "patterns">,
  answers: Answers
): VerdictResult {
  const patterns = PATTERN_INTERPRETATIONS.filter((p) =>
    p.condition(partial.dimensionResults, answers)
  ).slice(0, 2);
  return { ...partial, patterns };
}

/* ── Routing ──
 * Deploy-with-gate: name the detection axis to provision, from the Posture
 * Readiness answers. Human-only: the veto driver is already named in
 * vetoedBy; results-data maps it to copy.
 */

export type GateProvision = "measure-catch-rate" | "assign-owner" | "build-trail" | "gate-ready";

export function getGateProvisions(answers: Answers): GateProvision[] {
  const provisions: GateProvision[] = [];
  if (answers[313] === 1) provisions.push("measure-catch-rate");
  if ((answers[314] ?? 0) >= 1) provisions.push("assign-owner");
  if ((answers[315] ?? 0) >= 1) provisions.push("build-trail");
  return provisions.length > 0 ? provisions : ["gate-ready"];
}

export function getRedCount(results: DimensionResult[]): number {
  return results.filter((r) => r.status === "red").length;
}

export function isComplete(answers: Answers): boolean {
  return DIMENSIONS.every((d) => d.questions.every((q) => answers[q.id] !== undefined));
}
