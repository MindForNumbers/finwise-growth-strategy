import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Building2, Check, Landmark, ShieldCheck, Sparkles } from "lucide-react";

import { ProgressRail } from "@/components/onboarding/progress-rail";
import { SAMPLE } from "@/lib/finwise";
import { useOnboarding } from "@/lib/onboarding-context";

export const Route = createFileRoute("/connect")({
  head: () => ({
    meta: [
      { title: "Connect your data — FinWise" },
      {
        name: "description",
        content:
          "Import 1,402 sample transactions instantly, or connect your bank. Either way your forecast is seconds away.",
      },
      { property: "og:title", content: "Connect your data — FinWise" },
      {
        property: "og:description",
        content: "Start with pre-filled sample data and skip the setup entirely.",
      },
    ],
  }),
  component: ConnectScreen,
});

function ConnectScreen() {
  const navigate = useNavigate();
  const { setSynced } = useOnboarding();
  const [syncing, setSyncing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);

  useEffect(() => () => timers.current.forEach(clearInterval), []);

  const start = () => {
    if (syncing) return;
    setSyncing(true);
    const started = Date.now();
    const id = setInterval(() => {
      const p = Math.min((Date.now() - started) / 2400, 1);
      setProgress(p);
      if (p >= 1) {
        clearInterval(id);
        setSynced(true);
        setTimeout(() => navigate({ to: "/drivers" }), 550);
      }
    }, 40);
    timers.current.push(id);
  };

  const imported = Math.round(SAMPLE.transactions * Math.min(progress / 0.7, 1));
  const categorized = Math.round(
    SAMPLE.categorized * Math.max(0, Math.min((progress - 0.35) / 0.6, 1)),
  );
  const accounts = progress > 0.85 ? SAMPLE.accounts : progress > 0.5 ? 2 : progress > 0.2 ? 1 : 0;

  return (
    <div className="min-h-screen">
      <ProgressRail step={1} back="/" />
      <main className="mx-auto w-full max-w-xl px-5 pb-16 pt-12 sm:pt-20">
        <h1 className="text-[28px] font-semibold leading-tight tracking-tight sm:text-4xl">
          Let&apos;s get your numbers in.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          The fastest path to your runway forecast is our sample business — real-shaped data from a
          small coffee roastery.
        </p>

        {!syncing ? (
          <div className="mt-8 space-y-3">
            <button
              type="button"
              onClick={start}
              className="group flex w-full items-center gap-4 rounded-2xl border border-primary bg-primary p-5 text-left text-primary-foreground transition-all hover:opacity-95 active:scale-[0.99]"
            >
              <Sparkles strokeWidth={1.5} className="size-6 shrink-0" />
              <span>
                <span className="block text-[15px] font-medium">
                  Explore with pre-filled sample data
                </span>
                <span className="mt-0.5 block text-[13px] opacity-80">
                  Ready in about 3 seconds · Recommended
                </span>
              </span>
            </button>

            {[
              { icon: Landmark, label: "Connect a bank account", hint: "2–4 minutes · Plaid" },
              { icon: Building2, label: "Import from QuickBooks", hint: "5 minutes · OAuth" },
            ].map((o) => {
              const Icon = o.icon;
              return (
                <button
                  key={o.label}
                  type="button"
                  onClick={start}
                  className="flex w-full items-center gap-4 rounded-2xl border border-border bg-card p-5 text-left opacity-70 transition-all hover:opacity-100"
                >
                  <Icon strokeWidth={1.5} className="size-6 shrink-0 text-muted-foreground" />
                  <span>
                    <span className="block text-[15px] font-medium">{o.label}</span>
                    <span className="mt-0.5 block text-[13px] text-muted-foreground">{o.hint}</span>
                  </span>
                </button>
              );
            })}

            <p className="flex items-center justify-center gap-1.5 pt-2 text-[13px] text-muted-foreground">
              <ShieldCheck strokeWidth={1.5} className="size-4" />
              Read-only access. You can swap in real data later.
            </p>
          </div>
        ) : (
          <div className="mt-8 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.3)] backdrop-blur-2xl">
            <div className="flex items-baseline justify-between">
              <p className="text-[15px] font-medium">
                {progress >= 1 ? "Sync complete" : "Syncing sample business…"}
              </p>
              <span className="text-[13px] tabular-nums text-muted-foreground">
                {Math.round(progress * 100)}%
              </span>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
                style={{ width: `${progress * 100}%` }}
              />
            </div>

            <ul className="mt-6 space-y-3">
              <TallyRow
                done={imported >= SAMPLE.transactions}
                value={imported}
                label="transactions imported"
              />
              <TallyRow
                done={categorized >= SAMPLE.categorized}
                value={categorized}
                label="auto-categorized"
              />
              <TallyRow done={accounts >= SAMPLE.accounts} value={accounts} label="accounts linked" />
            </ul>
          </div>
        )}

        {!syncing && (
          <div className="mt-6 text-center">
            <Link to="/drivers" className="text-[13px] text-primary hover:underline">
              Skip for now
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

function TallyRow({ done, value, label }: { done: boolean; value: number; label: string }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className={
          "flex size-5 items-center justify-center rounded-full transition-colors " +
          (done ? "bg-primary" : "border border-border bg-muted")
        }
      >
        {done && <Check strokeWidth={3} className="size-3 text-primary-foreground" />}
      </span>
      <span className="text-[15px] tabular-nums">
        <span className="font-semibold">{value.toLocaleString("en-US")}</span>{" "}
        <span className="text-muted-foreground">{label}</span>
      </span>
    </li>
  );
}