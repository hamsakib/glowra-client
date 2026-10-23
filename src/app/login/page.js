import { Suspense } from "react";
import { LoginForm } from "@/components/forms/AuthForms";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = { title: "Log in", robots: { index: false } };

export default function LoginPage() {
  return (
    <AuthShell title="Welcome back" description="Log in to track orders, manage listings and write reviews.">
      <Suspense>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
