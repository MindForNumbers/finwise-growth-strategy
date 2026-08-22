import { useState } from "react";
import { Info } from "lucide-react";
import * as HoverCardPrimitive from "@radix-ui/react-hover-card";

export interface ModelInfo {
  title: string;
  sections: { label: string; body: string }[];
}

export const MODEL_INFO: Record<"macro" | "baseline", ModelInfo> = {
  macro: {
    title: "Macro Threat Stress-Test",
    sections: [
      {
        label: "Purpose",
        body: "Simulates a 20% drop in revenue to test baseline resilience over a 12-month period.",
      },
      {
        label: "Risk Exposure",
        body: "Identifies exactly which month you will breach your minimum cash buffer in a market downturn.",
      },
      {
        label: "Action Matrix",
        body: "Watch the red dotted line—if it dips below the gray baseline, capital intervention is required.",
      },
    ],
  },
  baseline: {
    title: "Baseline Cash Runway",
    sections: [
      {
        label: "Purpose",
        body: "Projects default cash trajectory using a 30-day historical baseline of operating accounts.",
      },
      {
        label: "Critical Thresholds",
        body: 'Calculates the exact "Zero Cash Date" assuming zero changes to current revenue velocity.',
      },
      {
        label: "Action Matrix",
        body: "Ensure all recent high-value vendor invoices are categorized to maintain projection integrity.",
      },
    ],
  },
};

export function ModelInfoPopover({ model }: { model: keyof typeof MODEL_INFO }) {
  const [open, setOpen] = useState(false);
  const info = MODEL_INFO[model];

  return (
    <HoverCardPrimitive.Root open={open} onOpenChange={setOpen} openDelay={80} closeDelay={120}>
      <HoverCardPrimitive.Trigger asChild>
        <button
          type="button"
          aria-label={`About ${info.title}`}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex size-6 items-center justify-center rounded-full text-muted-foreground/70 transition-colors hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
        >
          <Info strokeWidth={1.5} className="size-4" />
        </button>
      </HoverCardPrimitive.Trigger>
      <HoverCardPrimitive.Portal>
        <HoverCardPrimitive.Content
          side="bottom"
          align="start"
          sideOffset={8}
          collisionPadding={16}
          className="z-50 w-[320px] origin-[var(--radix-hover-card-content-transform-origin)] animate-in fade-in-0 zoom-in-95 rounded-2xl border border-white/10 bg-[oklch(0.19_0.01_260/0.88)] p-4 text-[oklch(0.98_0_0)] shadow-[0_30px_70px_-30px_oklch(0_0_0/0.75)] backdrop-blur-2xl duration-150"
        >
          <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/45">
            Model brief
          </p>
          <p className="mt-1 text-[15px] font-semibold tracking-[-0.01em]">{info.title}</p>
          <div className="mt-3 space-y-3">
            {info.sections.map((s) => (
              <div key={s.label}>
                <p className="text-[10.5px] font-semibold uppercase tracking-[0.14em] text-white/45">
                  {s.label}
                </p>
                <p className="mt-1 text-[13px] leading-relaxed text-white/90">{s.body}</p>
              </div>
            ))}
          </div>
        </HoverCardPrimitive.Content>
      </HoverCardPrimitive.Portal>
    </HoverCardPrimitive.Root>
  );
}
