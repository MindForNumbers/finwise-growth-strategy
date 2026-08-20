import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  AlertTriangle,
  ArrowUp,
  Check,
  CheckCircle2,
  Receipt,
  RotateCcw,
  TrendingDown,
  Wallet,
} from "lucide-react";


import { ProgressRail } from "@/components/onboarding/progress-rail";
import { AppleSlider } from "@/components/onboarding/apple-slider";
import { RunwayChart } from "@/components/onboarding/runway-chart";
import { INDUSTRIES, NORTH_STARS, SAMPLE, money, project, type Industry } from "@/lib/finwise";
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
  const { overhead, reset, industry, northStar } = useOnboarding();
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
      <ProgressRail step={4} back="/drivers" />
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

        <GoalCascade />

        {/* Daily engagement layer */}
        <section className="mt-5 space-y-5" aria-label="Daily cash activity">
          <VelocityTicker />
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <ReceivablesRadar />
            <CapitalOptimizer />
          </div>
        </section>

        <div className="my-6 h-px bg-border" />

        <div className="rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.4)]">
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

          <Link
            to="/stress-test"
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-[16px] font-semibold text-primary-foreground shadow-[0_10px_30px_-12px_var(--color-primary)] transition-transform hover:brightness-105 active:scale-[0.985]"
          >
            Enable Weekly Stress Test 🛡️
          </Link>
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
          <p className="mt-2 text-[16px] leading-relaxed">
            {insight(p, deltaPct, industry)}
            {northStar ? ` ${NORTH_STARS[northStar].focus}` : ""}
          </p>
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

function GoalCascade() {
  const { northStar } = useOnboarding();
  const active = northStar ?? "risk";
  const config = NORTH_STARS[active];
  const [completed, setCompleted] = useState<boolean[]>(
    new Array(config.sidequests.length).fill(false),
  );
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCompleted(new Array(config.sidequests.length).fill(false));
  }, [active]);

  useEffect(() => {
    const timer = setTimeout(() => setProgress(70), 50);
    return () => clearTimeout(timer);
  }, []);

  const toggle = (index: number) => {
    setCompleted((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  return (
    <section className="mt-6 space-y-5" aria-label="Goal cascade">
      <div className="rounded-3xl border border-border bg-card p-6">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          🎯 Q3 North Star
        </p>
        <h2 className="mt-1 text-[22px] font-semibold tracking-tight">
          {config.title} — {config.target}
        </h2>
        <div className="mt-5">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-accent">
            <div
              className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[12px] text-muted-foreground">
            <span className="font-medium text-foreground">70% complete</span>
            <span>{config.hint}</span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
          ⚡ Today&apos;s Recommended Sidequests
        </p>
        <ul className="mt-4 space-y-2">
          {config.sidequests.map((quest, i) => {
            const isDone = completed[i];
            return (
              <li key={i}>
                <button
                  type="button"
                  onClick={() => toggle(i)}
                  className="group flex w-full items-start gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-accent/50"
                >
                  <span
                    className={
                      "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border transition-all duration-200 " +
                      (isDone
                        ? "border-primary bg-primary text-primary-foreground scale-110"
                        : "border-border bg-transparent text-transparent group-hover:border-primary/50")
                    }
                    aria-hidden="true"
                  >
                    <CheckCircle2 className="size-4" />
                  </span>
                  <span className="flex-1">
                    <span
                      className={
                        "block text-[15px] leading-snug transition-colors " +
                        (isDone ? "text-muted-foreground line-through" : "text-foreground")
                      }
                    >
                      {quest.text}
                    </span>
                    <span className="mt-1 block text-[12px] font-medium text-primary">
                      {isDone ? "Completed ✓" : `Reward: ${quest.reward}`}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

function VelocityTicker() {
  return (
    <div className="rounded-3xl border border-border bg-card p-6 sm:p-7">
      <p className="text-[13px] text-muted-foreground">Today&apos;s Net Cash Velocity</p>
      <div className="mt-2 flex items-baseline gap-2">
        <span className="text-[42px] font-semibold tracking-tight text-[var(--color-positive)] sm:text-[56px]">
          +$1,240.00
        </span>
        <ArrowUp
          strokeWidth={2.5}
          className="size-6 text-[var(--color-positive)] sm:size-7"
          aria-hidden="true"
        />
      </div>
      <p className="mt-2 text-[13px] text-muted-foreground">
        Settled overnight: <span className="font-medium text-foreground">+$1,800</span>
        <span className="mx-2 text-border">|</span>
        Auto-drafted: <span className="font-medium text-foreground">-$560</span>
      </p>
    </div>
  );
}

function ReceivablesRadar() {
  const steps = ["Sent", "Approved", "Cleared", "Landed"];
  const activeIndex = 2; // Cleared

  return (
    <div className="rounded-3xl border border-border bg-card p-5">
      <div className="flex items-center gap-2">
        <Receipt strokeWidth={1.5} className="size-4 text-muted-foreground" />
        <p className="text-[13px] font-medium text-muted-foreground">Inbound receivables</p>
      </div>
      <p className="mt-3 text-[15px] leading-snug">
        Invoice <span className="font-semibold">#402</span> ({money(4500)}) cleared client bank. Landing by{" "}
        <span className="font-medium">2:00 PM</span> today.
      </p>
      <div className="mt-4 flex items-center gap-2" aria-label="Receivables progress">
        {steps.map((label, i) => {
          const isActive = i === activeIndex;
          const isPast = i < activeIndex;
          return (
            <div key={label} className="flex-1">
              <div
                className={
                  "h-2 rounded-full transition-all duration-300 " +
                  (isActive
                    ? "bg-[var(--color-positive)] shadow-[0_0_16px_color-mix(in_oklab,var(--color-positive)_55%,transparent)]"
                    : isPast
                      ? "bg-foreground/30"
                      : "bg-border")
                }
              />
              <p
                className={
                  "mt-1.5 text-[11px] font-medium " +
                  (isActive ? "text-[var(--color-positive)]" : "text-muted-foreground")
                }
              >
                {label}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CapitalOptimizer() {
  const [transferred, setTransferred] = useState(false);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-5 backdrop-blur-xl">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_0%_0%,var(--color-positive)_0%,transparent_35%)] opacity-[0.08]" />
      <div className="flex items-center gap-2">
        <Wallet strokeWidth={1.5} className="size-4 text-muted-foreground" />
        <p className="text-[13px] font-medium text-muted-foreground">Capital Optimization</p>
      </div>
      <p className="mt-3 text-[15px] leading-snug">
        You have <span className="font-semibold">$15,000</span> in idle float this week.{" "}
        {!transferred ? (
          <>
            Transfer it to your high-yield sweep account to generate an estimated{" "}
            <span className="font-semibold">$60</span> by Friday.
          </>
        ) : (
          <span className="inline-flex items-center gap-1.5 font-semibold text-[var(--color-positive)]">
            <CheckCircle2 strokeWidth={2} className="size-4" />
            Transferred & Earning
          </span>
        )}
      </p>
      {!transferred && (
        <button
          type="button"
          onClick={() => setTransferred(true)}
          className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground shadow-[0_8px_20px_-12px_var(--color-primary)] transition-transform hover:brightness-105 active:scale-[0.985]"
        >
          1-Tap Transfer
        </button>
      )}
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
