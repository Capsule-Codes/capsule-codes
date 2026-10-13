/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Supabase Storage originals are optimized (resized, AVIF/WebP) by the
    // Next/Vercel image optimizer. Keep `lib/image-src.ts` in sync with this list.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    formats: ["image/avif", "image/webp"],
    // Uploaded files are content-hashed (cover-<hash>.webp), so cache them long.
    minimumCacheTTL: 60 * 60 * 24 * 30,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
}

export default nextConfig
