import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { INDUSTRIES, NORTH_STARS, type Industry, type NorthStar } from "./finwise";

const makeDefaultSidequests = (): Record<NorthStar, boolean[]> => ({
  growth: NORTH_STARS.growth.sidequests.map(() => false),
  risk: NORTH_STARS.risk.sidequests.map(() => false),
  capital: NORTH_STARS.capital.sidequests.map(() => false),
});


interface OnboardingState {
  goal: string;
  setGoal: (g: string) => void;
  industry: Industry;
  setIndustry: (i: Industry) => void;
  overhead: number;
  setOverhead: (n: number) => void;
  northStar: NorthStar | null;
  setNorthStar: (n: NorthStar) => void;
  synced: boolean;
  setSynced: (b: boolean) => void;
  completedSidequests: Record<NorthStar, boolean[]>;
  toggleSidequest: (ns: NorthStar, index: number) => void;
  reset: () => void;
}

const Ctx = createContext<OnboardingState | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [goal, setGoal] = useState("cashflow");
  const [industry, setIndustryState] = useState<Industry>("default");
  const [overhead, setOverhead] = useState(INDUSTRIES.default.overhead);
  const [synced, setSynced] = useState(false);
  const [northStar, setNorthStar] = useState<NorthStar | null>(null);
  const [completedSidequests, setCompletedSidequests] =
    useState<Record<NorthStar, boolean[]>>(makeDefaultSidequests);

  const setIndustry = (i: Industry) => {
    setIndustryState(i);
    setOverhead(INDUSTRIES[i].overhead);
  };

  const toggleSidequest = (ns: NorthStar, index: number) => {
    setCompletedSidequests((prev) => {
      const next = { ...prev, [ns]: [...prev[ns]] };
      next[ns][index] = !next[ns][index];
      return next;
    });
  };

  const value = useMemo(
    () => ({
      goal,
      setGoal,
      industry,
      setIndustry,
      overhead,
      setOverhead,
      northStar,
      setNorthStar,
      synced,
      setSynced,
      completedSidequests,
      toggleSidequest,
      reset: () => {
        setGoal("cashflow");
        setIndustryState("default");
        setOverhead(INDUSTRIES.default.overhead);
        setSynced(false);
        setNorthStar(null);
        setCompletedSidequests(makeDefaultSidequests());
      },
    }),
    [goal, industry, overhead, synced, northStar, completedSidequests],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useOnboarding() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useOnboarding must be used inside OnboardingProvider");
  return ctx;
}
