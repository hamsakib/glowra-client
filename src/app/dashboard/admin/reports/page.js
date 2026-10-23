"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DashboardHeader, StatCard } from "@/components/dashboard/DashboardShell";
import { RevenueBarChart, StatusPieChart, TrendLineChart } from "@/components/dashboard/LazyCharts";
import { Card, CardHeader } from "@/components/ui/Card";
import { Select } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";
import { api } from "@/lib/api";
import { formatNumber, formatPrice } from "@/lib/format";

export default function ReportsPage() {
  const [months, setMonths] = useState(6);
  const { data, isLoading } = useQuery({ queryKey: ["stats", "admin", months], queryFn: () => api(`/stats/admin?months=${months}`) });
  const totals = data?.monthly.reduce((acc, m) => ({ revenue: acc.revenue + m.revenue, orders: acc.orders + m.orders, users: acc.users + m.newUsers }), { revenue: 0, orders: 0, users: 0 });

  return (
    <>
      <DashboardHeader
        title="Reports"
        description="Sales performance computed from orders in the database."
        action={
          <Select aria-label="Report period" value={months} onChange={(e) => setMonths(Number(e.target.value))} className="w-44">
            <option value={3}>Last 3 months</option>
            <option value={6}>Last 6 months</option>
            <option value={12}>Last 12 months</option>
          </Select>
        }
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Revenue in period" value={totals && formatPrice(totals.revenue)} loading={isLoading} />
        <StatCard label="Orders in period" value={totals && formatNumber(totals.orders)} tone="secondary" loading={isLoading} />
        <StatCard label="New customers" value={totals && formatNumber(totals.users)} tone="accent" loading={isLoading} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <Card>
          <CardHeader title="Revenue by category" description="All time, excluding cancelled orders" />
          <div className="p-4 sm:p-6">{data ? <RevenueBarChart data={data.revenueByCategory} xKey="name" /> : <div className="skeleton h-[280px]" />}</div>
        </Card>
        <Card>
          <CardHeader title="Revenue trend" description={`Last ${months} months`} />
          <div className="p-4 sm:p-6">{data ? <TrendLineChart data={data.monthly} lines={[{ key: "revenue", label: "Revenue", money: true }]} /> : <div className="skeleton h-[280px]" />}</div>
        </Card>
        <Card>
          <CardHeader title="Units sold by category" />
          <div className="p-4 sm:p-6">{data ? <StatusPieChart data={data.revenueByCategory.map((c) => ({ name: c.name, value: c.units }))} colorByStatus={false} /> : <div className="skeleton h-[280px]" />}</div>
        </Card>
        <Card>
          <CardHeader title="Top 5 products" description="By units sold" />
          <div className="p-4 sm:p-6">
            <Table
              caption="Top products"
              rowKey="id"
              loading={isLoading}
              rows={data?.topProducts || []}
              columns={[
                { key: "title", header: "Product", render: (p) => <span className="line-clamp-1 font-medium">{p.title}</span> },
                { key: "units", header: "Units" },
                { key: "revenue", header: "Revenue", render: (p) => formatPrice(p.revenue) },
              ]}
            />
          </div>
        </Card>
      </div>
    </>
  );
}
