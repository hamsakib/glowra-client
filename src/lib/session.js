/**
 * The JWT lives in a first-party cookie so that src/proxy.js can redirect signed-out
 * visitors before a protected page renders. The API never trusts this cookie: every
 * request still sends the token as a Bearer header and the server verifies it.
 */
export const TOKEN_COOKIE = "glowra_token";

export function decodeToken(token) {
  try {
    const payload = token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    return JSON.parse(atob(payload.padEnd(payload.length + ((4 - (payload.length % 4)) % 4), "=")));
  } catch {
    return null;
  }
}

export function isExpired(payload) {
  return !payload?.exp || payload.exp * 1000 <= Date.now();
}

export function getToken() {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${TOKEN_COOKIE}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

export function saveSession(token) {
  const payload = decodeToken(token);
  const maxAge = payload?.exp ? Math.max(0, payload.exp - Math.floor(Date.now() / 1000)) : 86400;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${TOKEN_COOKIE}=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function clearSession() {
  document.cookie = `${TOKEN_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
