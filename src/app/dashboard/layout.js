import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/DashboardShell";

export const metadata = { title: "Dashboard", robots: { index: false } };

export default function DashboardLayout({ children }) {
  return (
    <Suspense>
      <DashboardShell>{children}</DashboardShell>
    </Suspense>
  );
}
