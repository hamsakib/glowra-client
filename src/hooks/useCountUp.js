"use client";

import { useEffect, useState } from "react";

/** Animates a number from 0 to `target` with an ease-out curve. Respects reduced-motion. */
export function useCountUp(target, { duration = 1200, decimals = 0 } = {}) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!target) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setValue(target);
      return;
    }
    let frame;
    const start = performance.now();
    const factor = 10 ** decimals;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - (1 - t) ** 3;
      setValue(Math.round(target * eased * factor) / factor);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration, decimals]);
  return value;
}
