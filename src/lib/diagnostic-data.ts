import type { Dimension } from "./types";

/* ── Intake framing (unscored) ──
 * Displayed before the scored questions; the answer anchors the read to one
 * use case and is echoed back above the verdict. Never scored, never stored.
 */

export const INTAKE_FRAMING = {
  heading: "One use case at a time",
  prompt: "Describe the use case: what the AI produces, and who receives it.",
  placeholder:
    "e.g. An assistant drafts responses to customer warranty queries, which agents send after review.",
  note: "This diagnostic reads one AI use case, not your organisation. If you have three use cases, run it three times.",
};

/* ── Question bank ──
 * IDs run 301-315. Option values: 0 = Clear, 1 = Caution, 2 = Exposed.
 * Full rationale and red-if conditions in ip/perimeter-diagnostic.md.
 */

export const DIMENSIONS: Dimension[] = [
  {
    id: "error-profile",
    name: "Error Profile",
    subtitle: "What does a wrong output look like here, and how often can you afford one?",
    questions: [
      {
        id: 301,
        text: "When this AI produces a wrong output, what will the error most likely look like?",
        options: [
          {
            value: 0,
            label: "It breaks visibly",
            description:
              "The output fails in a way anyone would notice: malformed, incomplete, obviously off.",
            example:
              "e.g. Generated code that does not compile; a summary that cuts off mid-sentence.",
          },
          {
            value: 1,
            label: "It is wrong but checkable",
            description:
              "The error is findable by someone who looks, with sources or ground truth available to check against.",
            example:
              "e.g. A figure in a draft report that can be traced back to the source document.",
          },
          {
            value: 2,
            label: "It is plausible and wrong",
            description:
              "The error reads exactly like a correct answer and survives a casual read.",
            example:
              "e.g. A confidently cited policy that does not exist; a legal authority that was never decided.",
          },
        ],
      },
      {
        id: 302,
        text: "How many wrong outputs can this use case absorb before the value case breaks?",
        options: [
          {
            value: 0,
            label: "Errors are part of the process",
            description:
              "Wrong outputs are expected, cheap, and absorbed by the workflow itself.",
            example: "e.g. Idea generation; first drafts the author rewrites anyway.",
          },
          {
            value: 1,
            label: "Occasional errors, if caught",
            description:
              "The workflow can absorb errors at a low rate provided they are found before the output ships.",
            example: "e.g. Research summaries reviewed before circulation.",
          },
          {
            value: 2,
            label: "One material error breaks it",
            description:
              "A single uncaught error damages the value case or creates liability.",
            example: "e.g. A regulatory submission; a customer-facing commitment.",
          },
        ],
      },
      {
        id: 303,
        text: "Does this output stand alone, or does it feed a chain of further steps?",
        options: [
          {
            value: 0,
            label: "It stands alone",
            description:
              "A human consumes the output directly and the chain ends there.",
            example: "e.g. A meeting summary read by the attendee.",
          },
          {
            value: 1,
            label: "One step downstream",
            description:
              "The output feeds a single further step where an error would propagate once.",
            example: "e.g. AI-extracted data a human pastes into a model.",
          },
          {
            value: 2,
            label: "It feeds a chain",
            description:
              "The output enters a multi-step process where errors compound and their origin becomes untraceable.",
            example:
              "e.g. Agent pipelines; extracted figures flowing into automated reporting.",
          },
        ],
      },
    ],
  },
  {
    id: "reversibility-detection",
    name: "Reversibility and Detection",
    subtitle: "Would you see the error at all, and could you take it back?",
    questions: [
      {
        id: 304,
        text: "If a wrong output ships, can it be recalled or corrected after the fact?",
        options: [
          {
            value: 0,
            label: "Fully and cheaply",
            description:
              "The output can be withdrawn or corrected before anyone acts on it.",
            example: "e.g. An internal draft; a report not yet circulated.",
          },
          {
            value: 1,
            label: "Correctable with effort",
            description:
              "Reversal is possible but requires notification, rework, or unwinding.",
            example: "e.g. A circulated analysis that needs a correction notice.",
          },
          {
            value: 2,
            label: "It cannot be withdrawn",
            description:
              "Once shipped, the output is published, filed, or relied upon.",
            example:
              "e.g. A court filing; a price quoted to a customer; a published statement.",
          },
        ],
      },
      {
        id: 305,
        text: "What does one uncorrected error cost, in money, standing, or obligation?",
        options: [
          {
            value: 0,
            label: "Negligible",
            description: "The cost is rework and mild embarrassment.",
            example: "e.g. Redoing a draft.",
          },
          {
            value: 1,
            label: "Bounded and absorbable",
            description:
              "A real cost the organisation can carry: rework at scale, an internal escalation, a discount.",
            example: "e.g. Reissuing a batch of customer letters.",
          },
          {
            value: 2,
            label: "Material",
            description:
              "Legal liability, regulatory exposure, reputational damage, or a precedent that binds future conduct.",
            example:
              "e.g. A tribunal ruling that the company is liable for what its chatbot invented.",
          },
        ],
      },
      {
        id: 306,
        text: "If this AI produced a wrong output tomorrow, how would you find out?",
        options: [
          {
            value: 0,
            label: "It announces itself",
            description:
              "Errors surface through the normal operation of the workflow: things break, numbers fail to reconcile, users complain immediately.",
            example: "e.g. Code that fails tests.",
          },
          {
            value: 1,
            label: "Review would catch most",
            description:
              "A named review step exists and the error shape is one review can see.",
            example: "e.g. A partner reads the memo before it goes out.",
          },
          {
            value: 2,
            label: "It would look like a right answer",
            description:
              "No mechanism would distinguish this error from a correct output until a third party acts on it.",
            example:
              "e.g. A plausible policy answer to a customer; a fabricated citation in a long document.",
          },
        ],
      },
    ],
  },
  {
    id: "blast-radius",
    name: "Blast Radius",
    subtitle: "Who relies on this output, and what attaches when it is wrong?",
    questions: [
      {
        id: 307,
        text: "Who acts on this output without independently re-deriving it?",
        options: [
          {
            value: 0,
            label: "The author only",
            description:
              "The person who prompted the AI is the only person who acts on the output, and they treat it as raw material.",
            example: "e.g. A researcher's own working notes.",
          },
          {
            value: 1,
            label: "Internal teams",
            description:
              "Colleagues act on the output, inside the organisation's own error-absorbing structures.",
            example: "e.g. A forecast used by the planning team.",
          },
          {
            value: 2,
            label: "Outsiders",
            description:
              "Customers, counterparties, regulators, or courts act on the output.",
            example:
              "e.g. A chatbot answer to a customer; figures in an investor document.",
          },
        ],
      },
      {
        id: 308,
        text: "What does the recipient believe about how much checking stands behind this output?",
        options: [
          {
            value: 0,
            label: "Known to be a draft",
            description:
              "Every recipient knows the output is unverified machine work.",
            example: "e.g. A document watermarked as an AI-generated first pass.",
          },
          {
            value: 1,
            label: "Assumed reviewed",
            description:
              "Recipients assume someone has checked it, and someone has.",
            example: "e.g. A summary circulated under a named analyst's ownership.",
          },
          {
            value: 2,
            label: "Treated as the organisation's word",
            description:
              "The recipient takes the output as an authoritative commitment, whether or not anyone verified it.",
            example:
              "e.g. Policy answers on a company website; terms quoted in a sales conversation.",
          },
        ],
      },
      {
        id: 309,
        text: "If the output is wrong and someone has acted on it, what follows for the organisation?",
        options: [
          {
            value: 0,
            label: "Rework",
            description: "The organisation redoes the work and moves on.",
            example: "e.g. Regenerating a flawed draft.",
          },
          {
            value: 1,
            label: "Escalation and cost",
            description:
              "Internal escalation, customer remediation, bounded financial cost.",
            example: "e.g. Compensating an order handled wrongly.",
          },
          {
            value: 2,
            label: "Liability",
            description:
              "Legal action, regulatory sanction, fiduciary breach, or precedent.",
            example:
              "e.g. Sanctions for a hallucinated authority in a filing; a tribunal ruling on a chatbot commitment.",
          },
        ],
      },
    ],
  },
  {
    id: "verification-economics",
    name: "Verification Economics",
    subtitle: "What does checking cost, against what generating saves?",
    questions: [
      {
        id: 310,
        text: "What does properly checking one unit of output take, compared with producing that unit by hand?",
        options: [
          {
            value: 0,
            label: "A fraction",
            description:
              "Verification is fast relative to hand production: scan, reconcile, done.",
            example: "e.g. Checking a formatted table against a source system.",
          },
          {
            value: 1,
            label: "A meaningful share",
            description:
              "Verification takes a substantial fraction of what hand production would have taken.",
            example: "e.g. Fact-checking a research summary line by line.",
          },
          {
            value: 2,
            label: "As slow as doing it",
            description:
              "Properly checking the output means substantially redoing the work.",
            example:
              "e.g. Verifying legal authorities in a drafted argument; reviewing generated code you did not write.",
          },
        ],
      },
      {
        id: 311,
        text: "Can you verify a sample of outputs, or must every single output be checked?",
        options: [
          {
            value: 0,
            label: "Spot-checks suffice",
            description:
              "Errors are homogeneous enough that a sample bounds the risk.",
            example: "e.g. Templated outputs with shared failure modes.",
          },
          {
            value: 1,
            label: "Risk-weighted sampling",
            description:
              "High-stakes outputs are checked in full, the rest sampled.",
            example: "e.g. Customer letters sampled, contract clauses always checked.",
          },
          {
            value: 2,
            label: "Every output, in full",
            description:
              "Each output carries independent risk and must be verified individually.",
            example: "e.g. Bespoke advice; filings; anything where one error breaks the case.",
          },
        ],
      },
      {
        id: 312,
        text: "When an error is found, who fixes it?",
        options: [
          {
            value: 0,
            label: "The tool, cheaply",
            description:
              "Regeneration is near-free and a junior operator can drive it.",
            example: "e.g. Re-prompting a draft.",
          },
          {
            value: 1,
            label: "The original author",
            description:
              "The person who owns the output fixes it at their normal cost.",
            example: "e.g. An analyst correcting their own AI-assisted report.",
          },
          {
            value: 2,
            label: "Scarce senior capacity",
            description:
              "Fixing errors requires the expertise the deployment was supposed to free up.",
            example:
              "e.g. Partners re-reviewing associate-checked AI output; senior engineers debugging generated systems.",
          },
        ],
      },
    ],
  },
  {
    id: "posture-readiness",
    name: "Posture Readiness",
    subtitle: "Can your organisation actually run the posture it is claiming?",
    questions: [
      {
        id: 313,
        text: "Does a detection mechanism exist for this use case, and has its catch rate been measured?",
        options: [
          {
            value: 0,
            label: "Named and measured",
            description:
              "A specific mechanism exists (parallel run, reconciliation, sampled audit, adversarial check) and its catch rate has been measured for this error shape.",
            example:
              "e.g. A parallel-run log comparing AI and human output over a defined period.",
          },
          {
            value: 1,
            label: "Named, unmeasured",
            description:
              "A review step exists and is followed, but nobody has measured what fraction of errors it actually catches.",
            example: "e.g. 'The manager reads everything before it goes out.'",
          },
          {
            value: 2,
            label: "'Someone will notice'",
            description:
              "No mechanism beyond the general vigilance of busy people.",
            example: "e.g. Outputs flowing to customers with no named check.",
          },
        ],
      },
      {
        id: 314,
        text: "When this output is wrong, who is accountable, by name?",
        options: [
          {
            value: 0,
            label: "A named owner",
            description:
              "One person with authority owns this use case's outputs and knows it.",
            example: "e.g. The head of service owns every chatbot commitment.",
          },
          {
            value: 1,
            label: "A team, diffusely",
            description:
              "Accountability sits with a function; no individual would recognise the error as theirs.",
            example: "e.g. 'That is the ops team's area.'",
          },
          {
            value: 2,
            label: "Nobody",
            description:
              "Accountability was never assigned; it will be discovered in the post-mortem.",
            example: "e.g. A tool adopted bottom-up with no owner.",
          },
        ],
      },
      {
        id: 315,
        text: "Could you reconstruct, after the fact, what the AI produced, what a human changed, and who approved it?",
        options: [
          {
            value: 0,
            label: "Full trail",
            description:
              "Generation, edits, and approval are logged and retrievable.",
            example: "e.g. Versioned outputs with named approvals.",
          },
          {
            value: 1,
            label: "Partial",
            description: "Some of the chain is reconstructable, with gaps.",
            example: "e.g. Final outputs stored, intermediate steps lost.",
          },
          {
            value: 2,
            label: "No trail",
            description:
              "Nobody could establish what the AI wrote and what a human passed.",
            example: "e.g. Outputs pasted into documents with no record.",
          },
        ],
      },
    ],
  },
];

export const ATTRIBUTION =
  "Developed by Aieutics from an adversarial stress-test of practitioner AI-deployment frameworks, corroborated against published verification-cost research, and patterns observed across corporate innovation programmes and consulting engagements.";
