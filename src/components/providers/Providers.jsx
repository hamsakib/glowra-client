"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState } from "react";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuth";
import { CartProvider } from "@/hooks/useCart";

export function Providers({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: (count, err) => err?.status !== 401 && err?.status !== 403 && err?.status !== 404 && count < 2,
          },
        },
      }),
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster richColors closeButton position="top-right" toastOptions={{ className: "!rounded-xl" }} />
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
