"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "motion/react";
import { useRef, useEffect, type ReactNode, type HTMLAttributes } from "react";

interface MagneticProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Strength ratio applied to cursor distance. Default 0.25. */
  strength?: number;
  /** Engage magnetic pull within this radius (px) of element center. Default 120. */
  proximity?: number;
}

export function Magnetic({ children, strength = 0.25, proximity = 120, className, ...rest }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

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
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > proximity) {
          x.set(0); y.set(0);
          return;
        }
        const pull = (1 - dist / proximity) * strength;
        x.set(Math.max(-6, Math.min(6, dx * pull)));
        y.set(Math.max(-6, Math.min(6, dy * pull)));
      });
    };
    const onLeave = () => { x.set(0); y.set(0); };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, strength, proximity, x, y]);

  if (reduced) return <div ref={ref} className={className} {...rest}>{children}</div>;

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} className={className} {...rest}>
      {children}
    </motion.div>
  );
}
