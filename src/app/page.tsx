"use client";

import Image from "next/image";
import Link from "next/link";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col relative bg-[#0a0a0a] text-white overflow-hidden">
      {/* Video background */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          playsInline
          loop
          className="w-full h-full object-cover opacity-50"
        >
          <source src={`${basePath}/hero-bg.mp4`} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/40" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6 md:px-12">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Image
            src={`${basePath}/aieutics_transparentbg_logo.png`}
            alt="Aieutics"
            width={80}
            height={80}
            className="h-20 w-auto brightness-0 invert"
          />
          <span className="font-[family-name:var(--font-body)] text-sm text-white/50 italic hidden sm:inline">
            See further. Think deeper. Break through.
          </span>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10 flex-1 flex items-center justify-center px-6 py-16 md:py-24">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white animate-text-focus-in">
            One AI use case.
            <br />
            <span className="text-[var(--color-orange)]">
              One deployment decision.
            </span>
          </h1>

          <p className="font-[family-name:var(--font-body)] text-lg md:text-xl text-white leading-relaxed mb-4">
            Deploy, deploy with a gate, or keep it human: with the verification
            cost priced in.
          </p>
          <p className="font-[family-name:var(--font-body)] text-sm md:text-base text-white/70 leading-relaxed mb-10 max-w-xl mx-auto">
            A per-use-case assessment across five dimensions: error profile,
            reversibility and detection, blast radius, verification economics,
            and posture readiness. Returns a posture verdict, a verification
            budget, and a named perimeter type a buyer can defend to a board.
            No maturity score. No 1-to-5 level.
          </p>

          <Link
            href="/diagnostic"
            className="inline-block bg-[var(--color-orange)] text-white font-[family-name:var(--font-heading)] font-bold text-lg px-12 py-4 rounded-xl shadow-[0_0_15px_rgba(255,95,31,0.2)] hover:shadow-[0_0_30px_rgba(255,95,31,0.3)] hover:scale-[1.02] transition-all duration-300"
          >
            Start the diagnostic
          </Link>
          <p className="font-[family-name:var(--font-body)] text-sm text-white/40 mt-4">
            Takes 15-20 minutes. One use case at a time. Nothing leaves your
            browser.
          </p>

          {/* Verdict cards */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            {[
              {
                label: "Deploy",
                desc: "The error economics hold. Sampled checks keep the line.",
              },
              {
                label: "Deploy with a gate",
                desc: "The value case survives only if a measured gate catches what it claims to catch.",
              },
              {
                label: "Keep it human",
                desc: "Verification and compensation consume the saving. The work stays human for now.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="border border-white/12 rounded-xl p-3 hover:border-[var(--color-orange)] hover:shadow-[0_0_20px_rgba(255,95,31,0.1)] transition-all duration-300 bg-black/35 backdrop-blur-md"
              >
                <p className="font-[family-name:var(--font-heading)] text-xs font-bold uppercase tracking-wider text-[var(--color-orange)] mb-1">
                  {v.label}
                </p>
                <p className="font-[family-name:var(--font-body)] text-xs text-white/55">
                  {v.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-6 border-t border-white/8">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          <Image
            src={`${basePath}/aieutics_transparentbg_logo.png`}
            alt="Aieutics"
            width={24}
            height={24}
            className="h-6 w-auto opacity-30 brightness-0 invert"
          />
          <p className="font-[family-name:var(--font-body)] text-xs text-white/35 text-center">
            Built by{" "}
            <a
              href="https://www.aieutics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              Aieutics
            </a>{" "}
            from two decades of practice across strategy consulting, executive
            coaching, and digital transformation. These diagnostics are starting
            points. If your results raise questions,{" "}
            <a
              href="https://www.aieutics.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white/60 transition-colors"
            >
              let&apos;s talk
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
