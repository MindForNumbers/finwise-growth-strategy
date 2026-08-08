import type { Projection } from "@/lib/finwise";
import { money } from "@/lib/finwise";

const W = 720;
const H = 260;
const PAD = { top: 18, right: 16, bottom: 26, left: 16 };

export function RunwayChart({ projection }: { projection: Projection }) {
  const values = projection.series.map((p) => p.balance);
  const max = Math.max(...values, 5000);
  const min = Math.min(...values, -5000);
  const x = (day: number) => PAD.left + (day / 90) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + ((max - v) / (max - min || 1)) * (H - PAD.top - PAD.bottom);

  const line = projection.series.map((p) => `${x(p.day)},${y(p.balance)}`).join(" ");
  const area = `${x(0)},${y(min)} ${line} ${x(90)},${y(min)}`;
  const zeroY = y(0);
  const tone =
    projection.health === "healthy"
      ? "var(--color-positive)"
      : projection.health === "at-risk"
        ? "var(--color-caution)"
        : "var(--color-negative)";

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-56 w-full sm:h-64"
      role="img"
      aria-label="Projected cash balance over 90 days"
    >
      <defs>
        <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={tone} stopOpacity="0.22" />
          <stop offset="100%" stopColor={tone} stopOpacity="0" />
        </linearGradient>
      </defs>

      {[30, 60, 90].map((d) => (
        <g key={d}>
          <line
            x1={x(d)}
            x2={x(d)}
            y1={PAD.top}
            y2={H - PAD.bottom}
            stroke="var(--color-border)"
            strokeDasharray="3 5"
          />
          <text
            x={x(d)}
            y={H - 8}
            textAnchor="middle"
            className="fill-[var(--color-muted-foreground)] text-[11px]"
          >
            Day {d}
          </text>
        </g>
      ))}

      {min < 0 && (
        <line
          x1={PAD.left}
          x2={W - PAD.right}
          y1={zeroY}
          y2={zeroY}
          stroke="var(--color-negative)"
          strokeOpacity="0.45"
          strokeWidth="1"
        />
      )}

      <polygon points={area} fill="url(#fill)" style={{ transition: "all 220ms ease-out" }} />
      <polyline
        points={line}
        fill="none"
        stroke={tone}
        strokeWidth="2.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        style={{ transition: "all 220ms ease-out" }}
      />

      {projection.runwayDays !== null && (
        <g>
          <circle cx={x(projection.runwayDays)} cy={zeroY} r="5" fill="var(--color-negative)" />
          <text
            x={Math.min(x(projection.runwayDays) + 10, W - 120)}
            y={zeroY - 10}
            className="fill-[var(--color-negative)] text-[11px] font-medium"
          >
            Shortfall · day {projection.runwayDays}
          </text>
        </g>
      )}

      <text x={PAD.left} y={PAD.top - 4} className="fill-[var(--color-muted-foreground)] text-[11px]">
        {money(max)}
      </text>
    </svg>
  );
}