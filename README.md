# Perimeter Diagnostic

Per-use-case AI-deployment assessment. Outputs a deployment posture (Deploy / Deploy-with-gate / Human-only), a verification budget band, and a named perimeter type. No ordinal levels.

Design doc: `~/Vaults/Aieutics/aieutics-vault/ip/perimeter-diagnostic.md`
Design decisions: `~/Vaults/Aieutics/aieutics-vault/ip/perimeter-diagnostic-design-decisions.md`
Product sheet: `~/Vaults/Aieutics/aieutics-vault/ip/product-sheets/perimeter-diagnostic-product-sheet.md`

## State of this scaffold

**Done (the IP — not stubs):**

- `src/lib/types.ts` — graded trichotomy type system (Exposure 0/1/2), verdict, perimeter type, budget band, pattern types. Extends the AI Classification option pattern with the POC scoring shape; departures documented in the design-decisions doc.
- `src/lib/diagnostic-data.ts` — complete question bank: 15 questions (Q301–315) across 5 dimensions, three graded options each with label, description, example; unscored intake framing field.
- `src/lib/scoring.ts` — per-dimension aggregation (green 0–1 / amber 2–3 / red 4–6), verification budget band with plausible-error escalator, two-stage verdict gate (three vetoes, then posture), pattern matching, gate-provisioning routing. Deliberately no aggregate total score.
- `src/lib/results-data.ts` — verdict labels, budget band copy, six perimeter types, veto routing copy, gate provisioning copy, per-dimension reflections, four pattern narratives with recommendations, CTA copy.

**Done (shell — portfolio standard direction, adapted from `moats-diagnostic`, the canonical scaffold):**

- `src/app/globals.css` — canonical tokens per `interactive-tool.md`.
- `src/app/layout.tsx` — fonts (Libre Baskerville, Almarai, IBM Plex Mono), metadata.
- `src/app/page.tsx` — dark-hero landing in the moats pattern: video background, inverted logo, strapline, three-verdict explainer cards.
- `src/app/diagnostic/page.tsx` — wizard (intake field → 5 dimension steps → results) using extracted components.
- `src/app/diagnostic-demo/page.tsx` — demo bypass route (portfolio convention).
- `src/components/` — `OptionCard`, `ProgressBar` (segmented, mono caption, phase labels), `PerimeterRadar` (Recharts, safety-margin 0–6, `isAnimationActive={false}`), `DimensionCard` (status pill, margin, reflection), `ResultsPage` (verdict-first: headline → composition pills → budget → perimeter type → radar → dimension cards → patterns → routing → CTA → restart).
- `public/` — `aieutics_transparentbg_logo.png`, `hero-bg.mp4` (shared brand assets, copied from moats-diagnostic).
- `package.json`, `tsconfig.json`, `next.config.ts` (static export, `basePath` + `NEXT_PUBLIC_BASE_PATH` under GitHub Actions), `postcss.config.mjs`.

**Pending:**

- Deployment — GitHub Pages workflow, hub card on `aieutics-com.github.io`, hub tier table update.
- Tests (vitest) for `scoring.ts` — the gate logic is pure functions.
- Question-bank calibration against real client use cases (see design-decisions open items).

## Wizard flow

1. Intake framing (free text, unscored, echoed on results)
2–6. Five dimensions, three questions each, option cards
7. Results: verdict → budget band → perimeter type → radar (safety margin) → dimension cards with reflections → patterns → routing → restart
