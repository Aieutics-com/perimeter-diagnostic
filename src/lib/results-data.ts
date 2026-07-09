import type {
  BudgetBand,
  PatternInterpretation,
  PerimeterType,
  Verdict,
} from "./types";
import type { GateProvision } from "./scoring";

/* ── Verdict labels: verdict-first, one line each ── */

export const VERDICT_COPY: Record<Verdict, { headline: string; line: string }> = {
  deploy: {
    headline: "Deploy",
    line: "The error economics hold. Keep the sampling check you named, and retake this diagnostic if the audience for the output changes.",
  },
  "deploy-with-gate": {
    headline: "Deploy with a gate",
    line: "The value case survives only if the gate catches what it claims to catch. Name the mechanism, measure the catch rate, then scale.",
  },
  "human-only": {
    headline: "Keep it human",
    line: "At this error cost, verification and compensation consume the saving. Keep the work human until the economics or the controls change.",
  },
};

/* ── Verification budget bands ── */

/** Shown beneath the band on the results page so the buyer can defend the
 * number to a board from this page alone. */
export const BUDGET_EVIDENCE_LINE =
  "Anchored to measured rework in AI-assisted knowledge work (roughly 37% of time saved, Workday, 2026). Band boundaries are working judgements pending a published break-even.";

export const BUDGET_COPY: Record<
  BudgetBand,
  { label: string; range: string; line: string }
> = {
  marginal: {
    label: "Marginal",
    range: "under 20% of the promised saving",
    line: "Reserve under a fifth of the promised saving for verification and compensation before you count it.",
  },
  material: {
    label: "Material",
    range: "20-50% of the promised saving",
    line: "Reserve between a fifth and half of the promised saving for verification and compensation. Measured rework in knowledge work sits in this band.",
  },
  heavy: {
    label: "Heavy",
    range: "50-100% of the promised saving",
    line: "Most of the promised saving will be spent checking and fixing. The case is thinner than the business case says.",
  },
  prohibitive: {
    label: "Prohibitive",
    range: "at or above 100% of the promised saving",
    line: "The checking costs more than the saving. That is the whole answer.",
  },
};

/* ── Perimeter types: named postures, not levels ── */

export const PERIMETER_TYPE_COPY: Record<
  PerimeterType,
  { label: string; meaning: string }
> = {
  "open-ground": {
    label: "Open ground",
    meaning:
      "Errors are cheap, visible, and self-correcting; sampled checks hold the line.",
  },
  "assistive-review-gated": {
    label: "Assistive, review-gated",
    meaning:
      "The value case survives only if a measured review catches what it claims to catch.",
  },
  "specialised-hitl": {
    label: "Specialised, human-in-the-loop",
    meaning:
      "The stakes demand a domain expert inside the loop, with accountability and a trail.",
  },
  "inverted-economics": {
    label: "Inverted economics",
    meaning:
      "The verification and compensation bill meets or exceeds the saving.",
  },
  "unbounded-exposure": {
    label: "Unbounded exposure",
    meaning:
      "Outsiders rely on outputs whose errors are invisible or irrecoverable.",
  },
  "unprovisioned-gate": {
    label: "Unprovisioned gate",
    meaning:
      "A gate is required and none exists. Provision a detection mechanism, measure its catch rate, and retake this diagnostic.",
  },
};

/* ── Veto routing: names the dimension that drove a Human-only verdict ── */

export const VETO_COPY: Record<string, string> = {
  "prohibitive-budget":
    "Verification Economics drove this verdict. The reserve required for checking and compensation meets or exceeds the promised saving, so the deployment cannot pay for itself at this error cost.",
  "exposure-pair":
    "Blast Radius and Reversibility and Detection drove this verdict together. People outside the organisation act on this output, and its errors are the kind that cannot be seen or taken back.",
  "no-detection-mechanism":
    "Posture Readiness drove this verdict. This use case needs a gate and no detection mechanism exists beyond the vigilance of busy people. This Human-only is provisional: provision a mechanism, measure its catch rate, and retake the diagnostic.",
};

/* ── Gate provisioning: what to build before scaling a gated deployment ── */

export const GATE_PROVISION_COPY: Record<GateProvision, string> = {
  "measure-catch-rate":
    "Your review step exists but its catch rate has never been measured. Run a parallel check against human output for a defined period and get the number before you scale.",
  "assign-owner":
    "Accountability for wrong outputs is diffuse or unassigned. Name one owner with authority before the first error arrives, not after.",
  "build-trail":
    "The generation-review-approval chain is not fully reconstructable. Build the trail now; you will need it for learning, and possibly for a regulator.",
  "gate-ready":
    "Your detection mechanism, ownership, and audit trail are in place. Hold the gate as volume grows: the failure mode is quiet relaxation, not sudden removal.",
};

/* ── Per-dimension reflections: two sentences, shown on amber or red ── */

export const DIMENSION_REFLECTIONS: Record<string, string> = {
  "error-profile":
    "The question is not how accurate the model is. It is what one uncaught error costs in this use case, at this frequency, in this chain: an accuracy figure without an error shape is a comfort, not a control.",
  "reversibility-detection":
    "Reversibility, cost, and detection are three different properties, and the deployment decision needs all three. The error to fear is not the expensive one; it is the one you will never see until someone outside the organisation shows it to you.",
  "blast-radius":
    "A use case does not carry its own stakes. The stakes are set by the people who rely on the output and by what a court or regulator will attach to it, and the cheapest-looking use case in the portfolio is often the one with an outsider on the end of it.",
  "verification-economics":
    "A deployment that saves time in generation and spends it in verification has not created value; it has relocated it, usually upward, to the most expensive people in the building. Price the checking before you bank the saving.",
  "posture-readiness":
    "A gate you have not measured is a gate you are imagining. The organisations that get hurt are rarely the ones that skipped review; they are the ones that had a review step and never asked what it catches.",
};

/* ── Patterns: diagnoses paired with specific recommendations ── */

export const PATTERN_INTERPRETATIONS: PatternInterpretation[] = [
  {
    id: "verification-cost-inversion",
    label: "Verification-cost inversion",
    diagnosis:
      "The model is accurate enough; the checking is what kills the case. The promised saving is being repaid as rework and review time, the pattern measured at roughly 37% of time saved in knowledge work.",
    recommendation:
      "Re-price the use case with verification on the balance sheet before any deployment decision. If the priced case still clears, deploy with sampled verification and measure the actual rework rate for one quarter.",
    condition: (results) => {
      const v = results.find((r) => r.dimension.id === "verification-economics");
      const e = results.find((r) => r.dimension.id === "error-profile");
      return v?.status === "red" && e?.status === "green";
    },
  },
  {
    id: "detection-blind-spot",
    label: "Detection blind spot",
    diagnosis:
      "The classic middle-ground leak: the team believes accuracy protects it and calls casual review a gate. Plausible-but-wrong output survives exactly this review.",
    recommendation:
      "Provision a real detection mechanism and measure its catch rate against this use case's error shape: a parallel run against human output is the cheapest honest test. Do not scale volume until the rate is known.",
    condition: (results, answers) => {
      const d = results.find((r) => r.dimension.id === "posture-readiness");
      const e = results.find((r) => r.dimension.id === "error-profile");
      return (
        d?.status === "red" &&
        (e?.status === "green" || e?.status === "amber") &&
        (answers[306] ?? 0) >= 1
      );
    },
  },
  {
    id: "misplaced-no-fly",
    label: "Misplaced no-fly",
    diagnosis:
      "The domain reads as forbidden, but this specific system is narrow, validated, detected, and owned. A category-level prohibition is blocking a use case whose controls are real.",
    recommendation:
      "Assess the system on its measured detection and accountability, not its domain category. Treat any technology-level prohibition as a time-stamped observation to re-test, and document the control evidence in the language the regulator uses.",
    // High stakes (blast radius red) with real controls: measured detection
    // mechanism (Q313 Clear), posture green, and reversibility-detection held
    // below red. Regulated domains rarely reach green on rev-detect because
    // the cost-of-error question stays high; requiring green would stop this
    // pattern firing on exactly the FDA-radiology shape it exists to catch.
    condition: (results, answers) => {
      const b = results.find((r) => r.dimension.id === "blast-radius");
      const rd = results.find((r) => r.dimension.id === "reversibility-detection");
      const d = results.find((r) => r.dimension.id === "posture-readiness");
      return (
        b?.status === "red" &&
        rd?.status !== "red" &&
        d?.status === "green" &&
        answers[313] === 0
      );
    },
  },
  {
    id: "blast-radius-creep",
    label: "Blast-radius creep",
    diagnosis:
      "The use case looks low-stakes from inside the workflow, but an outsider acts on its output. This is the Air Canada shape: a support task carrying commitment-grade liability nobody priced.",
    recommendation:
      "Map who outside the organisation relies on this output and what they would reasonably assume about its authority. Route that map through legal review before deployment, and mark machine outputs as unverified wherever an outsider sees them.",
    // The creep shape is unpriced exposure: outsider reliance without the
    // control posture to match. An organisation with green readiness and a
    // measured gate is not creeping; it is the misplaced-no-fly shape above.
    condition: (results) => {
      const b = results.find((r) => r.dimension.id === "blast-radius");
      const e = results.find((r) => r.dimension.id === "error-profile");
      const d = results.find((r) => r.dimension.id === "posture-readiness");
      return (
        b?.status === "red" &&
        (e?.status === "green" || e?.status === "amber") &&
        d?.status !== "green"
      );
    },
  },
];

/* ── Shared page copy ── */

export const RESULTS_COPY = {
  eyebrow: "Diagnostic complete",
  budgetHeading: "Verification budget",
  perimeterHeading: "Perimeter type",
  routingHeading: "Before you act on this",
  radarCaption:
    "Safety margin per dimension, 0-6. A larger shape means more room before this use case's error economics bite.",
};

export const CTA_COPY = {
  heading: "What This Diagnostic Doesn't Tell You",
  body: `This tool tells you what posture one AI use case can carry and what fraction of its promised saving the checking will consume. It does not tell you how to build the gate, price the reserve into your business case, or defend the verdict in your governance forum: that depends on your organisation, your regulator, and what the output touches.

A verdict on one use case is also not a verdict on your portfolio. The use case next to this one may carry a different error shape, a different audience, and a different answer.`,
  callout:
    "If your verdict came back gated or human-only and the business case was already approved, that gap is worth a structured conversation before the first error arrives.",
  contact: {
    name: "Alexandra N.",
    title: "Founder, Aieutics",
    subtitle: "Executive coaching & strategic transformation",
    website: "aieutics.com",
    email: "hello@aieutics.com",
  },
};
