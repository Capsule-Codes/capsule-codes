"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, useEffect, type ReactNode } from "react";

interface ParallaxConstellationProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxConstellation({ children, className }: ParallaxConstellationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 14 });
  const sy = useSpring(y, { stiffness: 60, damping: 14 });

  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        x.set(px * -24);
        y.set(py * -24);
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, x, y]);

  if (reduced) return <div ref={ref} className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </div>
  );
}
