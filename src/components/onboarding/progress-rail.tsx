import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

const STEPS = ["/", "/connect", "/drivers", "/runway", "/stress-test"] as const;

export function ProgressRail({ step, back }: { step: number; back?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border/60 bg-background/70 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-5xl items-center gap-4 px-5">
        <div className="flex w-20 items-center">
          {back ? (
            <Link
              to={back}
              className="-ml-1 inline-flex items-center gap-0.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              <ChevronLeft strokeWidth={1.5} className="size-4" />
              Back
            </Link>
          ) : (
            <span className="text-[15px] font-semibold tracking-tight">FinWise</span>
          )}
        </div>
        <div className="flex flex-1 items-center justify-center gap-1.5">
          {STEPS.map((s, i) => (
            <span
              key={s}
              className={
                "h-1.5 rounded-full transition-all duration-500 " +
                (i === step
                  ? "w-7 bg-primary"
                  : i < step
                    ? "w-1.5 bg-primary/45"
                    : "w-1.5 bg-border")
              }
            />
          ))}
        </div>
        <div className="w-20 text-right text-xs text-muted-foreground tabular-nums">
          {step + 1} of {STEPS.length}
        </div>
      </div>
    </header>
  );
}