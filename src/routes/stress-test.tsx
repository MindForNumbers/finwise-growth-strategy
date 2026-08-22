import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { AlertTriangle, RotateCcw, ShieldCheck, Waves } from "lucide-react";

import { ProgressRail } from "@/components/onboarding/progress-rail";
import { AppleSlider } from "@/components/onboarding/apple-slider";
import { RunwayChart } from "@/components/onboarding/runway-chart";
import { INDUSTRIES, SAMPLE, money, project } from "@/lib/finwise";
import { useOnboarding } from "@/lib/onboarding-context";

export const Route = createFileRoute("/stress-test")({
  head: () => ({
    meta: [
      { title: "Weekly stress test — FinWise" },
      {
        name: "description",
        content:
          "Simulate new market threats against your cash runway and confirm your buffer still holds across 90 days.",
      },
      { property: "og:title", content: "Weekly stress test — FinWise" },
      {
        property: "og:description",
        content: "See how a new market variable moves your cash runway — and how much buffer survives.",
      },
    ],
  }),
  component: StressTestScreen,
});

const BASE_COGS = 32;
const BASE_LABOR = 25;

function StressTestScreen() {
  const { overhead, industry, reset } = useOnboarding();
  const [impact, setImpact] = useState(0);
  const [cogs, setCogs] = useState(BASE_COGS);
  const [labor, setLabor] = useState(BASE_LABOR);
  const [tested, setTested] = useState(false);

  // Operational ratios convert directly into monthly overhead relief/pressure.
  const monthlyDelta =
    ((BASE_COGS - cogs) / 100) * SAMPLE.monthlyRevenue +
    ((BASE_LABOR - labor) / 100) * SAMPLE.monthlyRevenue;
  const adjustedOverhead = Math.max(0, overhead - monthlyDelta);

  const baseline = project(overhead, impact / 100);
  const p = project(adjustedOverhead, impact / 100);
  const remaining = p.runwayDays === null ? 90 : p.runwayDays;

  const baseDays = baseline.runwayDays ?? 90;
  const newDays = p.runwayDays ?? 90;
  const dayShift = newDays - baseDays;

  return (
    <div className="min-h-screen">
      <ProgressRail step={4} back="/runway" />
      <main className="mx-auto w-full max-w-5xl px-5 pb-20 pt-8 sm:pt-12">

        <div
          key={tested ? "protected" : "decayed"}
          className={
            "inline-flex animate-in fade-in zoom-in-95 items-center gap-2 rounded-full px-3.5 py-1.5 text-[13px] font-medium duration-500 " +
            (tested
              ? "bg-primary text-primary-foreground shadow-[0_8px_24px_-12px_var(--color-primary)]"
              : "bg-[var(--color-caution)]/12 text-[var(--color-caution)]")
          }
        >
          {tested ? (
            <>
              <ShieldCheck strokeWidth={1.75} className="size-4" />
              🛡️ Runway Visibility: 100% Protected
            </>
          ) : (
            <>
              <AlertTriangle strokeWidth={1.75} className="size-4" />
              ⚠️ Visibility Decayed: New Market Variables
            </>
          )}
        </div>

        <p className="mt-4 text-[13px] text-muted-foreground">
          One week later · {INDUSTRIES[industry].label}
        </p>
        <h1 className="mt-1 text-[27px] font-semibold tracking-[-0.035em] text-gradient sm:text-[34px]">
          Weekly stress test
        </h1>

        <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <div className="relative rounded-3xl surface-card p-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-[13px] uppercase tracking-wide text-muted-foreground">
                  Days of cash left
                </p>
                <p className="mt-1 text-6xl font-semibold tracking-tight tabular-nums">
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

            <div
              aria-hidden={tested}
              className={
                "pointer-events-none absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-700 ease-out " +
                (tested ? "opacity-0" : "opacity-100")
              }
            >
              <div className="max-w-md rounded-3xl border border-white/50 bg-background/55 p-6 text-center shadow-[0_30px_60px_-30px_rgba(0,0,0,0.45)] backdrop-blur-2xl">
                <p className="flex items-center justify-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-[var(--color-caution)]">
                  <Waves strokeWidth={1.75} className="size-4" />
                  Threat detected
                </p>
                <p className="mt-2 text-[16px] leading-relaxed">{INDUSTRIES[industry].threat}</p>
              </div>
            </div>
          </div>

          <div className="rounded-3xl surface-card p-6">
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Operational controls
            </p>
            <p className="mt-1 text-[13px] text-muted-foreground">
              {INDUSTRIES[industry].label} · unit economics
            </p>

            <div className="mt-6 space-y-7">
              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium">Target COGS %</p>
                  <span className="text-[15px] font-semibold tabular-nums text-primary">{cogs}%</span>
                </div>
                <div className="mt-4">
                  <AppleSlider
                    label="Target COGS percent"
                    value={cogs}
                    onChange={(v) => {
                      setCogs(v);
                      setTested(true);
                    }}
                    min={20}
                    max={40}
                    step={1}
                  />
                  <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
                    <span>20%</span>
                    <span>40%</span>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium">Labor Ratio %</p>
                  <span className="text-[15px] font-semibold tabular-nums text-primary">{labor}%</span>
                </div>
                <div className="mt-4">
                  <AppleSlider
                    label="Labor ratio percent"
                    value={labor}
                    onChange={(v) => {
                      setLabor(v);
                      setTested(true);
                    }}
                    min={15}
                    max={35}
                    step={1}
                  />
                  <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
                    <span>15%</span>
                    <span>35%</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-border pt-6">
                <div className="flex items-center justify-between">
                  <p className="text-[15px] font-medium">Market impact</p>
                  <span className="text-[15px] font-semibold tabular-nums text-primary">
                    {impact > 0 ? "+" : ""}
                    {impact}%
                  </span>
                </div>
                <div className="mt-4">
                  <AppleSlider
                    label="Simulate market impact"
                    value={impact}
                    onChange={(v) => {
                      setImpact(v);
                      setTested(true);
                    }}
                    min={-25}
                    max={10}
                    step={1}
                  />
                  <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
                    <span>-25%</span>
                    <span>Today</span>
                    <span>+10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl surface-card p-6">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
            Operational impact
          </p>
          <p className="mt-2 text-[17px] font-semibold leading-relaxed tracking-[-0.01em] sm:text-[19px]">
            {monthlyDelta === 0
              ? `System Impact: Holding a ${cogs}% COGS target and ${labor}% labor ratio keeps monthly liquidity flat at baseline.`
              : monthlyDelta > 0
                ? `System Impact: Hitting a ${cogs}% COGS target and ${labor}% labor ratio recovers ${money(monthlyDelta)} in monthly liquidity, extending the Zero Cash Date by ${Math.abs(dayShift)} days.`
                : `System Impact: Running a ${cogs}% COGS target and ${labor}% labor ratio consumes ${money(Math.abs(monthlyDelta))} in monthly liquidity, pulling the Zero Cash Date forward by ${Math.abs(dayShift)} days.`}
          </p>
          <p className="mt-2 text-[13px] text-muted-foreground tabular-nums">
            Adjusted monthly overhead {money(adjustedOverhead)} · baseline {money(overhead)}
          </p>
        </div>


        {tested && (
          <div className="mt-5 animate-in fade-in slide-in-from-bottom-2 rounded-3xl bg-primary/8 p-6 duration-500">
            <p className="flex items-center gap-2 text-[13px] font-semibold uppercase tracking-wide text-primary">
              <ShieldCheck strokeWidth={1.75} className="size-4" />
              Stress test result
            </p>
            <p className="mt-2 text-[16px] leading-relaxed">
              {p.runwayDays === null
                ? `Status: Safe. Your cash buffer absorbs this market shift with 90+ days of runway remaining, ending at ${money(p.balanceAt(90))}.`
                : `Status: Watch. Your buffer absorbs the shift for ${remaining} days before it runs thin. Recommendation: ${INDUSTRIES[industry].recommendation}`}
            </p>
          </div>
        )}

        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[13px]">
          <Link
            to="/"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <RotateCcw strokeWidth={1.5} className="size-3.5" />
            Restart the flow
          </Link>
          <Link to="/runway" className="text-primary hover:underline">
            Back to runway
          </Link>
        </div>
      </main>
    </div>
  );
}