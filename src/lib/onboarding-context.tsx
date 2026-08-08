import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { SAMPLE } from "./finwise";

interface OnboardingState {
  goal: string;
  setGoal: (g: string) => void;
  overhead: number;
  setOverhead: (n: number) => void;
  synced: boolean;
  setSynced: (b: boolean) => void;
  reset: () => void;
}

const Ctx = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState("cashflow");
  const [overhead, setOverhead] = useState(SAMPLE.defaultOverhead);
  const [synced, setSynced] = useState(false);

  const value = useMemo(
    () => ({
      goal,
      setGoal,
      overhead,
      setOverhead,
      synced,
      setSynced,
      reset: () => {
        setGoal("cashflow");
        setOverhead(SAMPLE.defaultOverhead);
        setSynced(false);
      },
    }),
    [goal, overhead, synced],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}