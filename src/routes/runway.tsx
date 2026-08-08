import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, CheckCircle2, RotateCcw, TrendingDown } from "lucide-react";

import { ProgressRail } from "@/components/onboarding/progress-rail";
import { AppleSlider } from "@/components/onboarding/apple-slider";
import { RunwayChart } from "@/components/onboarding/runway-chart";
import { INDUSTRIES, SAMPLE, money, project, type Industry } from "@/lib/finwise";
import { useOnboarding } from "@/lib/onboarding-context";

export const Route = createFileRoute("/runway")({
  head: () => ({
    meta: [
      { title: "Your 30-day cash runway — FinWise" },
      {
        name: "description",
        content:
          "A live 30/60/90-day cash position forecast with scenario testing and plain-English recommendations.",
      },
      { property: "og:title", content: "Your 30-day cash runway — FinWise" },
      {
        property: "og:description",
        content: "Drag one slider to stress-test your cash position across 90 days.",
      },
    ],
  }),
  component: RunwayScreen,
});

function RunwayScreen() {
  const { overhead, reset, industry } = useOnboarding();
  const [deltaPct, setDeltaPct] = useState(0);
  const p = project(overhead, deltaPct / 100);

  const tone =
    p.health === "healthy"
      ? { text: "text-[var(--color-positive)]", bg: "bg-[var(--color-positive)]/10", label: "Healthy" }
      : p.health === "at-risk"
        ? { text: "text-[var(--color-caution)]", bg: "bg-[var(--color-caution)]/12", label: "At risk" }
        : { text: "text-[var(--color-negative)]", bg: "bg-[var(--color-negative)]/10", label: "Shortfall ahead" };

  return (
    <div className="min-h-screen">
      <ProgressRail step={3} back="/drivers" />
      <main className="mx-auto w-full max-w-3xl px-5 pb-20 pt-8 sm:pt-12">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-[13px] text-muted-foreground">{SAMPLE.company}</p>
            <h1 className="mt-1 text-[26px] font-semibold tracking-tight sm:text-3xl">
              Your cash runway
            </h1>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[13px] font-medium ${tone.bg} ${tone.text}`}
          >
            {p.health === "healthy" ? (
              <CheckCircle2 strokeWidth={1.75} className="size-4" />
            ) : (
              <AlertTriangle strokeWidth={1.75} className="size-4" />
            )}
            {tone.label}
          </span>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.4)]">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] uppercase tracking-wide text-muted-foreground">
                Days of cash left
              </p>
              <p className={`mt-1 text-6xl font-semibold tracking-tight tabular-nums ${tone.text}`}>
                {p.runwayDays === null ? "90+" : p.runwayDays}
              </p>
            </div>
            <p className="text-right text-[13px] leading-relaxed text-muted-foreground">
              Opening balance
              <span className="block text-[15px] font-medium text-foreground tabular-nums">
                {money(SAMPLE.openingBalance)}
              </span>
            </p>
          </div>

          <div className="mt-4">
            <RunwayChart projection={p} />
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[30, 60, 90].map((d) => {
              const v = p.balanceAt(d);
              return (
                <div key={d} className="rounded-2xl bg-accent p-3.5">
                  <p className="text-[12px] text-muted-foreground">Day {d}</p>
                  <p
                    className={
                      "mt-1 text-[17px] font-semibold tabular-nums " +
                      (v < 0 ? "text-[var(--color-negative)]" : "text-foreground")
                    }
                  >
                    {money(v)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-2 text-[15px] font-medium">
              <TrendingDown strokeWidth={1.5} className="size-4 text-muted-foreground" />
              Scenario: revenue change
            </p>
            <span className="text-[15px] font-semibold tabular-nums text-primary">
              {deltaPct > 0 ? "+" : ""}
              {deltaPct}%
            </span>
          </div>
          <div className="mt-5">
            <AppleSlider
              label="Revenue change scenario"
              value={deltaPct}
              onChange={setDeltaPct}
              min={-30}
              max={20}
              step={1}
            />
            <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
              <span>-30%</span>
              <span>Today</span>
              <span>+20%</span>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {[-10, 0, 10].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setDeltaPct(v)}
                className={
                  "rounded-full border px-3 py-1.5 text-[13px] transition-colors " +
                  (deltaPct === v
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:bg-accent")
                }
              >
                {v === 0 ? "Baseline" : `${v > 0 ? "+" : ""}${v}% revenue`}
              </button>
            ))}
          </div>
        </div>

        <div className={`mt-5 rounded-3xl p-6 ${tone.bg}`}>
          <p className={`flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide ${tone.text}`}>
            {p.health === "healthy" ? (
              <CheckCircle2 strokeWidth={1.75} className="size-4" />
            ) : (
              <AlertTriangle strokeWidth={1.75} className="size-4" />
            )}
            Insight
          </p>
          <p className="mt-2 text-[16px] leading-relaxed">{insight(p, deltaPct, industry)}</p>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link
            to="/"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw strokeWidth={1.5} className="size-3.5" />
            Restart the flow
          </Link>
          <Link to="/drivers" className="text-primary hover:underline">
            Adjust overhead
          </Link>
        </div>
      </main>
    </div>
  );
}

function insight(p: ReturnType<typeof project>, deltaPct: number, industry: Industry) {
  const rec = INDUSTRIES[industry].recommendation;
  const drop = deltaPct < 0 ? `A ${Math.abs(deltaPct)}% revenue drop` : null;
  if (p.shortfallWeek !== null) {
    return `Warning: ${drop ?? "Your current run rate"} creates a cash shortfall by Week ${p.shortfallWeek}. Recommendation: ${rec}`;
  }
  if (deltaPct < 0) {
    return `You absorb a ${Math.abs(deltaPct)}% revenue drop and still stay above zero for 90 days, ending at ${money(p.balanceAt(90))}. Recommendation: hold ${money(Math.max(p.netDaily * 30, 0))} back as a buffer — and if it tightens, ${rec.charAt(0).toLowerCase() + rec.slice(1)}`;
  }
  if (deltaPct > 0) {
    return `At +${deltaPct}% revenue you end day 90 with ${money(p.balanceAt(90))}. Recommendation: that surplus covers roughly one additional part-time roaster without touching your reserve.`;
  }
  return `You stay cash-positive across all 90 days, ending at ${money(p.balanceAt(90))}. Recommendation: drag the scenario slider to -10% to see where the first pressure point appears.`;
}