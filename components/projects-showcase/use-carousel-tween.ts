import { useCallback, useEffect } from "react";
import type { CarouselApi } from "@/components/ui/carousel";

const TWEEN_FACTOR = 1.2;
const MIN_SCALE = 0.82;
const MIN_OPACITY = 0.38;

function within(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function useCarouselTween(
  api: CarouselApi | undefined,
  loop: boolean,
): void {
  const apply = useCallback(
    (emblaApi: NonNullable<CarouselApi>) => {
      const engine = emblaApi.internalEngine();
      const scrollProgress = emblaApi.scrollProgress();
      const snapList = emblaApi.scrollSnapList();
      const nodes = emblaApi.slideNodes();

      nodes.forEach((node, index) => {
        const snap = snapList[index] ?? snapList[snapList.length - 1] ?? 0;
        let diffToTarget = snap - scrollProgress;

        if (loop) {
          engine.slideLooper.loopPoints.forEach((loopItem) => {
            const target = loopItem.target();
            if (index === loopItem.index && target !== 0) {
              const sign = Math.sign(target);
              if (sign === -1) {
                diffToTarget = snap - (1 + scrollProgress);
              }
              if (sign === 1) {
                diffToTarget = snap + (1 - scrollProgress);
              }
            }
          });
        }

        const tween = within(1 - Math.abs(diffToTarget * TWEEN_FACTOR), 0, 1);
        const scale = MIN_SCALE + (1 - MIN_SCALE) * tween;
        const opacity = MIN_OPACITY + (1 - MIN_OPACITY) * tween;

        node.style.transform = `scale(${scale.toFixed(3)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.zIndex = String(Math.round(tween * 10));
      });
    },
    [loop],
  );

  useEffect(() => {
    if (!api) return;
    apply(api);
    api.on("scroll", apply);
    api.on("reInit", apply);
    api.on("slideFocus", apply);
    return () => {
      api.off("scroll", apply);
      api.off("reInit", apply);
      api.off("slideFocus", apply);
    };
  }, [api, apply]);
}
