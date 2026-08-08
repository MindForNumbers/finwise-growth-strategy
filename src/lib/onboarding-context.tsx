import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INDUSTRIES, type Industry } from "./finwise";

interface OnboardingState {
  goal: string;
  setGoal: (g: string) => void;
  industry: Industry;
  setIndustry: (i: Industry) => void;
  overhead: number;
  setOverhead: (n: number) => void;
  synced: boolean;
  setSynced: (b: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState("cashflow");
  const [industry, setIndustryState] = useState<Industry>("default");
  const [overhead, setOverhead] = useState(INDUSTRIES.default.overhead);
  const [synced, setSynced] = useState(false);

  const setIndustry = (i: Industry) => {
    setIndustryState(i);
    setOverhead(INDUSTRIES[i].overhead);
  };

  const value = useMemo(
    () => ({
      goal,
      setGoal,
      industry,
      setIndustry,
      overhead,
      setOverhead,
      synced,
      setSynced,
      reset: () => {
        setGoal("cashflow");
        setIndustryState("default");
        setOverhead(INDUSTRIES.default.overhead);
        setSynced(false);
      },
    }),
    [goal, industry, overhead, synced],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}