import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { ArrowRight, Check, Info } from "lucide-react";

import { ProgressRail } from "@/components/onboarding/progress-rail";
import { AppleSlider } from "@/components/onboarding/apple-slider";
import { INDUSTRIES, NORTH_STARS, SAMPLE, money, project, type NorthStar } from "@/lib/finwise";
import { useOnboarding } from "@/lib/onboarding-context";

export const Route = createFileRoute("/drivers")({
  head: () => ({
    meta: [
      { title: "Set your monthly overhead — FinWise" },
      {
        name: "description",
        content:
          "Confirm one number — your estimated monthly overhead — and FinWise contextualizes your entire cash flow forecast.",
      },
      { property: "og:title", content: "Set your monthly overhead — FinWise" },
      {
        property: "og:description",
        content: "One slider is all it takes to contextualize your forecast.",
      },
    ],
  }),
  component: DriversScreen,
});

function DriversScreen() {
  const { overhead, setOverhead, industry, northStar, setNorthStar } = useOnboarding();
  const navigate = useNavigate();
  const breakEven = project(overhead, 0).breakEvenDaily;

  return (
    <div className="min-h-screen">
      <ProgressRail step={2} back="/connect" />
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-12 sm:pt-20">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">
          One number and we&apos;re done.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          We estimated your overhead from the imported ledger. Nudge it if it looks off.
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-card p-6 shadow-[0_20px_50px_-35px_rgba(0,0,0,0.4)] sm:p-8">
          <div className="flex items-baseline justify-between">
            <p className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
              Estimated monthly overhead
            </p>
            <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
              Pre-filled · {INDUSTRIES[industry].label}
            </span>
          </div>
          <p className="mt-2 text-5xl font-semibold tracking-tight tabular-nums">
            {money(overhead)}
          </p>

          <div className="mt-7">
            <AppleSlider
              label="Estimated monthly overhead"
              value={overhead}
              onChange={setOverhead}
              min={6000}
              max={40000}
              step={100}
            />
            <div className="mt-2 flex justify-between text-[12px] tabular-nums text-muted-foreground">
              <span>$6,000</span>
              <span>$40,000</span>
            </div>
          </div>

          <div className="mt-7 rounded-2xl bg-accent p-4">
            <p className="text-[15px] leading-relaxed">
              At {money(overhead)}/month overhead, your business needs to generate{" "}
              <span className="font-semibold text-primary tabular-nums">
                {money(breakEven)}/day
              </span>{" "}
              to break even.
            </p>
            <p className="mt-1.5 flex items-start gap-1.5 text-[13px] text-muted-foreground">
              <Info strokeWidth={1.5} className="mt-0.5 size-3.5 shrink-0" />
              Includes semi-monthly payroll of {money(14600)} detected in your{" "}
              {SAMPLE.transactions.toLocaleString("en-US")} transactions.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate({ to: "/runway" })}
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
        >
          Generate my 30-day runway
          <ArrowRight strokeWidth={2} className="size-4" />
        </button>
          className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
        >
          Generate my 30-day runway
          <ArrowRight strokeWidth={2} className="size-4" />
        </button>
        <div className="mt-4 text-center">
          <Link to="/runway" className="text-[13px] text-primary hover:underline">
            Skip — use our estimate
          </Link>
        </div>
      </main>
    </div>
  );
}