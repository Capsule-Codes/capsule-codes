"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect } from "react";
import { useTheme } from "next-themes";

export function AmbientCursorGlow() {
  const { resolvedTheme } = useTheme();
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const sx = useSpring(x, { stiffness: 50, damping: 14, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 50, damping: 14, mass: 0.6 });

  useEffect(() => {
    if (resolvedTheme !== "dark") return;
    const onMove = (e: MouseEvent) => { x.set(e.clientX); y.set(e.clientY); };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [resolvedTheme, x, y]);

  if (resolvedTheme !== "dark") return null;

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
