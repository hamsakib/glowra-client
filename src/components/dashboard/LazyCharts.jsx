"use client";

import dynamic from "next/dynamic";

// Recharts is ~100 kB; load it only on dashboard pages that draw charts.
const loading = () => <div className="skeleton h-[280px] w-full" />;

export const RevenueBarChart = dynamic(() => import("./Charts").then((m) => m.RevenueBarChart), { ssr: false, loading });
export const TrendLineChart = dynamic(() => import("./Charts").then((m) => m.TrendLineChart), { ssr: false, loading });
export const StatusPieChart = dynamic(() => import("./Charts").then((m) => m.StatusPieChart), { ssr: false, loading });
