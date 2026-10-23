"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { api } from "@/lib/api";
import { clearSession, decodeToken, getToken, isExpired, saveSession } from "@/lib/session";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | authenticated | guest
  const [expiresAt, setExpiresAt] = useState(null);
  const router = useRouter();
  const queryClient = useQueryClient();

  const finishLogout = useCallback(
    (message) => {
      clearSession();
      setUser(null);
      setExpiresAt(null);
      setStatus("guest");
      queryClient.clear();
      if (message) toast.info(message);
    },
    [queryClient],
  );

  // Restore the session from the cookie on first load (the cookie only exists in the browser).
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const token = getToken();
    const payload = token && decodeToken(token);
    if (!token || isExpired(payload)) {
      if (token) clearSession();
      setStatus("guest");
      return;
    }
    setExpiresAt(payload.exp * 1000);
    api("/auth/me", { token })
      .then(({ user: me }) => {
        setUser(me);
        setStatus("authenticated");
      })
      .catch(() => finishLogout());
  }, [finishLogout]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Token expiration handling: sign out the moment the JWT expires.
  useEffect(() => {
    if (!expiresAt) return;
    const ms = expiresAt - Date.now();
    if (ms <= 0) return;
    const timer = setTimeout(() => {
      finishLogout("Your session expired. Please log in again.");
      router.push("/login?expired=1");
    }, Math.min(ms, 2 ** 31 - 1));
    return () => clearTimeout(timer);
  }, [expiresAt, finishLogout, router]);

  const startSession = useCallback((token, me) => {
    saveSession(token);
    setExpiresAt(decodeToken(token)?.exp * 1000);
    setUser(me);
    setStatus("authenticated");
  }, []);

  const login = useCallback(
    async (credentials) => {
      const { token, user: me } = await api("/auth/login", { method: "POST", body: credentials, auth: false });
      startSession(token, me);
      return me;
    },
    [startSession],
  );

  const register = useCallback(
    async (data) => {
      const { token, user: me } = await api("/auth/register", { method: "POST", body: data, auth: false });
      startSession(token, me);
      return me;
    },
    [startSession],
  );

  const logout = useCallback(() => {
    finishLogout("You have been logged out.");
    router.push("/");
    router.refresh();
  }, [finishLogout, router]);

  const value = useMemo(
    () => ({
      user,
      status,
      isAdmin: user?.role === "admin",
      isAuthenticated: status === "authenticated",
      login,
      register,
      logout,
      setUser,
    }),
    [user, status, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
