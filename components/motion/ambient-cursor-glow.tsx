"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

export function AmbientCursorGlow() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();
  const reduced = useReducedMotion();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 50, damping: 14, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 50, damping: 14, mass: 0.6 });

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || reduced) return;
    if (resolvedTheme !== "dark") return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        x.set(e.clientX);
        y.set(e.clientY);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mounted, reduced, resolvedTheme, x, y]);

  if (!mounted || reduced || resolvedTheme !== "dark") return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x: sx, y: sy,
        translateX: "-50%", translateY: "-50%",
        width: 400, height: 400,
        background: "radial-gradient(circle, oklch(0.6 0.18 200 / 0.08), transparent 60%)",
        filter: "blur(60px)",
      }}
      className="pointer-events-none fixed left-0 top-0 z-0"
    />
  );
}
