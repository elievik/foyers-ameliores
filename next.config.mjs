import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://foyers-ameliores.onrender.com";
const apiURLObj = new URL(API_URL);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ["192.168.0.101", "192.168.0.102", "localhost", "127.0.0.1"],
  turbopack: {
    root: __dirname,
  },
  experimental: {
    turbopackFileSystemCacheForDev: false,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${API_URL}/api/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${API_URL}/static/:path*`,
      },
    ];
  },
  images: {
    // Le proxy d'optimisation d'images de Next.js a un timeout court, et le
    // stockage Supabase répond parfois en 5-12s, ce qui fait échouer
    // l'affichage. On sert les images directement depuis leur origine.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
      {
        protocol: "https",
        hostname: "bpujrgwsnynydxmmkvab.supabase.co",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "8000",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "8000",
      },
      {
        protocol: apiURLObj.protocol.replace(':', ''),
        hostname: apiURLObj.hostname,
        port: apiURLObj.port || '',
      },
    ],
  },
};

export default nextConfig;
