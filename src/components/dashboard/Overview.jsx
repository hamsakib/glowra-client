"use client";

import { Banknote, Package, ShoppingCart, Star, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { StatusBadge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { useAuthed } from "@/hooks/queries";
import { useAuth } from "@/hooks/useAuth";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { DashboardHeader, StatCard } from "./DashboardShell";
import { RevenueBarChart, StatusPieChart, TrendLineChart } from "./LazyCharts";

function AdminOverview() {
  const { data, isLoading } = useAuthed(["stats", "admin"], "/stats/admin");
  const c = data?.cards;
  return (
    <>
      <DashboardHeader title="Store overview" description="Live numbers from the database. Revenue excludes cancelled orders." action={<Button href="/dashboard/admin/reports" variant="outline">Full reports</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total revenue" value={c && formatPrice(c.revenue)} hint={c && `Avg. order ${formatPrice(c.averageOrder)}`} icon={Banknote} loading={isLoading} />
        <StatCard label="Total orders" value={c && formatNumber(c.totalOrders)} icon={ShoppingCart} tone="secondary" loading={isLoading} />
        <StatCard label="Total products" value={c && formatNumber(c.totalProducts)} hint={c && `${c.totalCategories} categories`} icon={Package} tone="accent" loading={isLoading} />
        <StatCard label="Total users" value={c && formatNumber(c.totalUsers)} hint={c && `${c.newMessages} unread message${c.newMessages === 1 ? "" : "s"}`} icon={Users} loading={isLoading} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader title="Monthly revenue" description="Last 6 months" />
          <div className="p-4 sm:p-6">{data && <RevenueBarChart data={data.monthly} />}{isLoading && <div className="skeleton h-[280px]" />}</div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Orders by status" description="All time" />
          <div className="p-4 sm:p-6">{data && <StatusPieChart data={data.ordersByStatus} />}{isLoading && <div className="skeleton h-[280px]" />}</div>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader title="Orders & new customers" description="Last 6 months" />
          <div className="p-4 sm:p-6">
            {data && <TrendLineChart data={data.monthly} lines={[{ key: "orders", label: "Orders" }, { key: "newUsers", label: "New users" }]} />}
            {isLoading && <div className="skeleton h-[280px]" />}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Recent orders" action={<Link href="/dashboard/admin/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>} />
          <ul className="divide-y divide-border">
            {(data?.recentOrders || []).map((o) => (
              <li key={o._id} className="flex items-center justify-between gap-3 px-6 py-3 text-sm">
                <div className="min-w-0">
                  <p className="font-semibold">{o.orderNumber}</p>
                  <p className="truncate text-xs text-muted-fg">{o.user?.name} · {formatDate(o.createdAt)}</p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-semibold">{formatPrice(o.total)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </>
  );
}

function UserOverview() {
  const { user } = useAuth();
  const { data, isLoading } = useAuthed(["stats", "me"], "/stats/me");
  const orders = useAuthed(["my-orders", "recent"], "/orders/mine?limit=5");
  const c = data?.cards;
  return (
    <>
      <DashboardHeader title={`Hi, ${user.name.split(" ")[0]}`} description="Here's what's happening with your orders and listings." action={<Button href="/explore">Shop products</Button>} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Orders placed" value={c && formatNumber(c.orders)} icon={ShoppingCart} loading={isLoading} />
        <StatCard label="Total spent" value={c && formatPrice(c.spent)} icon={Banknote} tone="secondary" loading={isLoading} />
        <StatCard label="My listings" value={c && formatNumber(c.listings)} hint={c && `${c.unitsSold} units sold`} icon={Package} tone="accent" loading={isLoading} />
        <StatCard label="Reviews written" value={c && formatNumber(c.reviews)} icon={Star} loading={isLoading} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-5">
        <Card className="xl:col-span-3">
          <CardHeader title="Monthly spending" description="Last 6 months, excluding cancelled orders" />
          <div className="p-4 sm:p-6">
            {data && <TrendLineChart data={data.monthly} lines={[{ key: "spent", label: "Spent", money: true }]} />}
            {isLoading && <div className="skeleton h-[280px]" />}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="What you buy" description="Units by category" />
          <div className="p-4 sm:p-6">
            {data?.categories?.length ? <StatusPieChart data={data.categories} colorByStatus={false} /> : !isLoading && <EmptyState icon={TrendingUp} title="No purchases yet" />}
            {isLoading && <div className="skeleton h-[280px]" />}
          </div>
        </Card>
        <Card className="xl:col-span-3">
          <CardHeader title="Order status" description="All your orders" />
          <div className="p-4 sm:p-6">
            {data?.ordersByStatus?.length ? <RevenueBarChart data={data.ordersByStatus.map((s) => ({ month: s.name, revenue: s.value }))} /> : !isLoading && <EmptyState title="No orders yet" />}
          </div>
        </Card>
        <Card className="xl:col-span-2">
          <CardHeader title="Recent orders" action={<Link href="/dashboard/orders" className="text-sm font-semibold text-primary hover:underline">View all</Link>} />
          {orders.data?.items?.length === 0 ? (
            <EmptyState title="No orders yet" action={<Button href="/explore" size="sm">Start shopping</Button>} />
          ) : (
            <ul className="divide-y divide-border">
              {(orders.data?.items || []).map((o) => (
                <li key={o._id} className="flex items-center justify-between gap-3 px-6 py-3 text-sm">
                  <div>
                    <p className="font-semibold">{o.orderNumber}</p>
                    <p className="text-xs text-muted-fg">{formatDate(o.createdAt)} · {o.items.length} item{o.items.length > 1 ? "s" : ""}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-semibold">{formatPrice(o.total)}</span>
                    <StatusBadge status={o.status} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </>
  );
}

export function Overview() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminOverview /> : <UserOverview />;
}

