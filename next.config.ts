import type { NextConfig } from "next";

// No custom image config needed — the only <Image> usage (favicons in
// ItemList.tsx) renders with the `unoptimized` prop, which bypasses
// Next.js's image optimizer and domain allowlist entirely.
const nextConfig: NextConfig = {};

export default nextConfig;
