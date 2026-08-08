export const SAMPLE = {
  company: "FinWise Co. — Northgate Coffee Roasters",
  openingBalance: 13600,
  transactions: 1402,
  categorized: 1350,
  accounts: 3,
  monthlyRevenue: 48500,
  defaultOverhead: 18400,
  topCategories: [
    { name: "Payroll", amount: 29200 },
    { name: "Inventory & COGS", amount: 12850 },
    { name: "Software", amount: 3120 },
    { name: "Rent & Utilities", amount: 5400 },
  ],
};

export type Health = "healthy" | "at-risk" | "shortfall";

export type Industry = "ecommerce" | "agency" | "services" | "default";

export const INDUSTRIES: Record<
  Industry,
  { id: Industry; label: string; overhead: number; syncLine: string; recommendation: string }
> = {
  ecommerce: {
    id: "ecommerce",
    label: "E-commerce",
    overhead: 28000,
    syncLine: "Syncing… 3 inventory vendors detected.",
    recommendation: "Reduce inventory reorder volume.",
  },
  agency: {
    id: "agency",
    label: "Digital Agency",
    overhead: 15000,
    syncLine: "Syncing… 4 recurring software subscriptions detected.",
    recommendation: "Reduce software spend.",
  },
  services: {
    id: "services",
    label: "Professional Services",
    overhead: 8000,
    syncLine: "Syncing… 1,350 transactions auto-categorized.",
    recommendation: "Delay contractor payouts.",
  },
  default: {
    id: "default",
    label: "Sample Business",
    overhead: 15000,
    syncLine: "Syncing… 1,350 transactions auto-categorized.",
    recommendation: "Delay contractor payouts.",
  },
};

export interface Projection {
  series: { day: number; balance: number }[];
  runwayDays: number | null;
  balanceAt: (day: number) => number;
  health: Health;
  netDaily: number;
  breakEvenDaily: number;
  shortfallWeek: number | null;
}

// Deterministic weekly seasonality so the curve reads like real business data.
const WEEKDAY_FACTOR = [0.72, 0.94, 1.02, 1.08, 1.24, 1.31, 0.69];

export function project(overhead: number, revenueDelta: number): Projection {
  const dailyRevenue = ((SAMPLE.monthlyRevenue * (1 + revenueDelta)) / 30);
  const dailyExpense = overhead / 30;
  const series: { day: number; balance: number }[] = [];
  let balance = SAMPLE.openingBalance;
  let runwayDays: number | null = null;

  series.push({ day: 0, balance });
  for (let day = 1; day <= 90; day++) {
    const inflow = dailyRevenue * (WEEKDAY_FACTOR[day % 7] ?? 1);
    // Payroll lands on the 1st and 15th of each 30-day cycle.
    const payrollDay = day % 30 === 8 || day % 30 === 22;
    const outflow = dailyExpense + (payrollDay ? 14600 : 0);
    balance = balance + inflow - outflow;
    series.push({ day, balance });
    if (runwayDays === null && balance < 0) runwayDays = day;
  }

  const netDaily = dailyRevenue - dailyExpense - (2 * 14600) / 30;
  const health: Health =
    runwayDays === null ? (netDaily > 0 ? "healthy" : "at-risk") : runwayDays <= 45 ? "shortfall" : "at-risk";

  return {
    series,
    runwayDays,
    balanceAt: (day) => series[Math.min(Math.max(day, 0), 90)]?.balance ?? 0,
    health,
    netDaily,
    breakEvenDaily: (overhead + 2 * 14600) / 30,
    shortfallWeek: runwayDays === null ? null : Math.max(1, Math.ceil(runwayDays / 7)),
  };
}

export const money = (n: number, decimals = 0) =>
  (n < 0 ? "-$" : "$") +
  Math.abs(n).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });