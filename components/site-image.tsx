import Image, { type ImageProps } from "next/image";
import { canOptimizeImage } from "@/lib/image-src";

/**
 * `next/image` that falls back to the original file for sources the optimizer
 * is not configured for (see `canOptimizeImage`), instead of throwing.
 */
export function SiteImage({ src, alt, ...props }: ImageProps & { alt: string }) {
  const unoptimized = typeof src !== "string" ? undefined : !canOptimizeImage(src);
  // eslint-disable-next-line jsx-a11y/alt-text
  return <Image src={src} alt={alt} unoptimized={unoptimized} {...props} />;
}
