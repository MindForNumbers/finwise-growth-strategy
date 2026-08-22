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

        <div className="mt-8 rounded-3xl surface-card p-6 sm:p-8">
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

        <section className="mt-8" aria-label="Quarterly north star">
          <h2 className="text-[19px] font-semibold tracking-tight">
            Select Your Quarterly North Star
          </h2>
          <p className="mt-1.5 text-[13px] text-muted-foreground">
            Your dashboard adapts to this goal. You can change it any time.
          </p>
          <div className="mt-4 grid gap-3">
            {(Object.keys(NORTH_STARS) as NorthStar[]).map((id) => {
              const ns = NORTH_STARS[id];
              const selected = northStar === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setNorthStar(id)}
                  aria-pressed={selected}
                  className={
                    "flex items-center gap-3 rounded-2xl border p-4 text-left backdrop-blur-xl transition-all duration-200 active:scale-[0.99] " +
                    (selected
                      ? "border-primary bg-primary/[0.06] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]"
                      : "border-border bg-card/70 hover:border-foreground/20 hover:bg-accent")
                  }
                >
                  <span className="min-w-0">
                    <span className="block text-[15px] font-medium">
                      {ns.title}{" "}
                      <span className="font-normal text-muted-foreground">({ns.target})</span>
                    </span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">
                      {ns.hint}
                    </span>
                  </span>
                  {selected && (
                    <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                      <Check strokeWidth={2.5} className="size-3 text-primary-foreground" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        <button
          type="button"
          onClick={() => navigate({ to: "/runway" })}
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