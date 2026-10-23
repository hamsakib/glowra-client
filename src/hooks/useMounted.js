"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True after hydration. Use for UI that depends on client-only values (theme, storage). */
export function useMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
