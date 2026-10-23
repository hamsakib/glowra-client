"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatNumber, formatPrice } from "@/lib/format";

// Chart colours read the design tokens, so they follow light/dark mode.
const SERIES = ["var(--primary)", "var(--secondary)", "var(--accent)", "var(--muted-fg)", "var(--danger)"];
const STATUS_COLORS = { pending: "var(--accent)", confirmed: "var(--primary)", shipped: "#6366f1", delivered: "var(--secondary)", cancelled: "var(--danger)" };

const axis = { stroke: "var(--muted-fg)", fontSize: 12, tickLine: false, axisLine: false };
const tooltipStyle = {
  contentStyle: { background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 12, color: "var(--fg)", fontSize: 13 },
  labelStyle: { color: "var(--fg)", fontWeight: 600 },
  cursor: { fill: "var(--muted)", opacity: 0.6 },
};

const money = (v) => (v >= 1000 ? `৳${Math.round(v / 1000)}k` : `৳${v}`);

export function RevenueBarChart({ data, dataKey = "revenue", xKey = "month", height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey={xKey} {...axis} interval={0} tick={{ fontSize: 11 }} />
        <YAxis {...axis} tickFormatter={money} width={56} />
        <Tooltip {...tooltipStyle} formatter={(v) => [formatPrice(v), "Revenue"]} />
        <Bar dataKey={dataKey} fill="var(--primary)" radius={[8, 8, 0, 0]} maxBarSize={44} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function TrendLineChart({ data, lines, height = 280 }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
        <CartesianGrid vertical={false} stroke="var(--border)" />
        <XAxis dataKey="month" {...axis} />
        <YAxis {...axis} allowDecimals={false} tickFormatter={(v) => (lines.some((l) => l.money) ? money(v) : formatNumber(v))} />
        <Tooltip {...tooltipStyle} cursor={{ stroke: "var(--border)" }} formatter={(v, name) => [lines.find((l) => l.label === name)?.money ? formatPrice(v) : formatNumber(v), name]} />
        <Legend wrapperStyle={{ fontSize: 12 }} />
        {lines.map((l, i) => (
          <Line key={l.key} type="monotone" dataKey={l.key} name={l.label} stroke={SERIES[i]} strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function StatusPieChart({ data, height = 280, colorByStatus = true }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie data={data} dataKey="value" nameKey="name" innerRadius="55%" outerRadius="80%" paddingAngle={2} stroke="var(--surface)" strokeWidth={2}>
          {data.map((d, i) => (
            <Cell key={d.name} fill={colorByStatus ? STATUS_COLORS[d.name] || SERIES[i % SERIES.length] : SERIES[i % SERIES.length]} />
          ))}
        </Pie>
        <Tooltip {...tooltipStyle} formatter={(v, n) => [`${v} (${Math.round((v / total) * 100)}%)`, n]} />
        <Legend wrapperStyle={{ fontSize: 12, textTransform: "capitalize" }} />
      </PieChart>
    </ResponsiveContainer>
  );
}
