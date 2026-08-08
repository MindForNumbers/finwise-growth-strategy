import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { ArrowRight, Check, FileText, LineChart, Receipt, Users } from "lucide-react";

import { ProgressRail } from "@/components/onboarding/progress-rail";
import { INDUSTRIES, type Industry } from "@/lib/finwise";
import { useOnboarding } from "@/lib/onboarding-context";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Set up your workspace — FinWise" },
      {
        name: "description",
        content:
          "Pick one financial goal and FinWise hides everything else, so your trial starts focused on cash flow.",
      },
      { property: "og:title", content: "Set up your workspace — FinWise" },
      {
        property: "og:description",
        content: "Pick one goal and FinWise configures your workspace around it.",
      },
    ],
  }),
  component: IntentScreen,
});

const GOALS = [
  {
    id: "cashflow",
    icon: LineChart,
    title: "Forecast cash flow",
    hint: "See your 30-day runway",
    recommended: true,
  },
  { id: "expenses", icon: Receipt, title: "Track expenses", hint: "Categorize spend" },
  { id: "payroll", icon: Users, title: "Plan payroll", hint: "Cover the next cycle" },
  { id: "invoices", icon: FileText, title: "Invoice faster", hint: "Get paid sooner" },
];

function IntentScreen() {
  const { goal, setGoal, industry, setIndustry } = useOnboarding();
  const [configured, setConfigured] = useState(false);
  const navigate = useNavigate();

  const chooseIndustry = (id: Industry) => {
    setIndustry(id);
    setConfigured(true);
    toast.success(`Personalized for ${INDUSTRIES[id].label}.`, {
      description: "Loading your workspace…",
    });
    setTimeout(() => navigate({ to: "/connect" }), 650);
  };

  const select = (id: string, title: string) => {
    setGoal(id);
    setConfigured(true);
    toast.success(`Configured your workspace for ${title}.`, {
      description: "We've hidden everything else.",
    });
  };

  const active = GOALS.find((g) => g.id === goal) ?? GOALS[0]!;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ProgressRail step={0} />
      <WorkspaceSkeleton visible={configured} label={active.title} />

      <main className="relative z-10 mx-auto w-full max-w-2xl px-5 pb-16 pt-12 sm:pt-20">
        <div
          className={
            "rounded-3xl p-1 transition-all duration-700 " +
            (configured
              ? "border border-border/70 bg-card/70 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)] backdrop-blur-2xl"
              : "border border-transparent")
          }
        >
          <div className="p-5 sm:p-7">
            <p className="text-sm text-muted-foreground">Welcome to FinWise, Maya</p>
            <h1 className="mt-2 text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">
              What should FinWise do first?
            </h1>
            <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
              Pick one. We&apos;ll hide every module that doesn&apos;t serve it — you can turn them
              back on any time.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-2">
              {GOALS.map((g) => {
                const Icon = g.icon;
                const selected = goal === g.id;
                return (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => select(g.id, g.title)}
                    className={
                      "group relative flex items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 " +
                      (selected
                        ? "border-primary bg-primary/[0.06] shadow-[0_0_0_3px_color-mix(in_oklab,var(--color-primary)_12%,transparent)]"
                        : "border-border bg-card hover:border-foreground/20 hover:bg-accent")
                    }
                  >
                    <Icon
                      strokeWidth={1.5}
                      className={
                        "mt-0.5 size-5 shrink-0 " +
                        (selected ? "text-primary" : "text-muted-foreground")
                      }
                    />
                    <span className="min-w-0">
                      <span className="block text-[15px] font-medium">{g.title}</span>
                      <span className="mt-0.5 block text-[13px] text-muted-foreground">
                        {g.hint}
                      </span>
                    </span>
                    {g.recommended && !selected && (
                      <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        Popular
                      </span>
                    )}
                    {selected && (
                      <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-primary">
                        <Check strokeWidth={2.5} className="size-3 text-primary-foreground" />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: "/connect" })}
              className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-medium text-primary-foreground transition-all hover:opacity-90 active:scale-[0.99]"
            >
              Continue
              <ArrowRight strokeWidth={2} className="size-4" />
            </button>
            <div className="mt-9">
              <p className="text-[13px] font-medium uppercase tracking-wide text-muted-foreground">
                What kind of business are you?
              </p>
              <p className="mt-1.5 text-[13px] text-muted-foreground">
                We&apos;ll pre-fill your overhead and vendor data to match.
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {(["ecommerce", "agency", "services"] as Industry[]).map((id) => {
                  const selected = industry === id;
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => chooseIndustry(id)}
                      className={
                        "rounded-2xl border p-4 text-left text-[15px] font-medium transition-all duration-200 active:scale-[0.99] " +
                        (selected
                          ? "border-primary bg-primary/[0.06] text-primary"
                          : "border-border bg-card hover:border-foreground/20 hover:bg-accent")
                      }
                    >
                      {INDUSTRIES[id].label}
                      <span className="mt-0.5 block text-[13px] font-normal text-muted-foreground">
                        Overhead ≈ ${INDUSTRIES[id].overhead.toLocaleString("en-US")}/mo
                      </span>
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => chooseIndustry("default")}
                className="mt-4 w-full text-center text-[13px] text-primary hover:underline"
              >
                Skip for now (Use Default)
              </button>
            </div>
            <p className="mt-5 text-center text-[13px] text-muted-foreground">
              Free 14-day trial · No card required
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

function WorkspaceSkeleton({ visible, label }: { visible: boolean; label: string }) {
  return (
    <div
      aria-hidden
      className={
        "pointer-events-none absolute inset-0 transition-opacity duration-700 " +
        (visible ? "opacity-100 blur-[3px]" : "opacity-0")
      }
    >
      <div className="mx-auto max-w-5xl px-5 pt-20">
        <div className="h-6 w-52 rounded-full bg-muted" />
        <div className="mt-2 h-4 w-32 rounded-full bg-muted/70" />
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-24 rounded-2xl border border-border bg-card" />
          ))}
        </div>
        <div className="mt-3 h-64 rounded-3xl border border-border bg-card p-6">
          <div className="h-4 w-40 rounded-full bg-muted" />
          <div className="mt-6 h-40 rounded-2xl bg-gradient-to-t from-primary/15 to-transparent" />
        </div>
        <p className="mt-3 text-center text-xs text-muted-foreground">{label} workspace</p>
      </div>
    </div>
  );
}
