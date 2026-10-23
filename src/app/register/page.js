import { Suspense } from "react";
import { RegisterForm } from "@/components/forms/AuthForms";
import { AuthShell } from "@/components/layout/AuthShell";

export const metadata = { title: "Create an account", robots: { index: false } };

export default function RegisterPage() {
  return (
    <AuthShell title="Create your account" description="Free to join. Order with cash on delivery, save your details and sell your own products.">
      <Suspense>
        <RegisterForm />
      </Suspense>
    </AuthShell>
  );
}
