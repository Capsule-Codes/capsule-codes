"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useRef, type ReactNode } from "react";

interface ParallaxConstellationProps {
  children: ReactNode;
  className?: string;
}

export function ParallaxConstellation({ children, className }: ParallaxConstellationProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 14 });
  const sy = useSpring(y, { stiffness: 60, damping: 14 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px * -24);
    y.set(py * -24);
  };

  return (
    <motion.div ref={ref} onMouseMove={onMove} className={className}>
      <motion.div style={{ x: sx, y: sy }}>{children}</motion.div>
    </motion.div>
  );
}
