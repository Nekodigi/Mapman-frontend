import withPWAInit from "next-pwa";
// import runtimeCaching from "next-pwa/cache";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    unoptimized: true,
    domains: [
      "localhost",
      "mapman-frontend.vercel.app",
      "lh3.googleusercontent.com",
      "maps.googleapis.com",
      "upcdn.io",
    ],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    config.resolve.alias.canvas = false;
    config.resolve.alias.encoding = false;
    return config;
  },
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
  // runtimeCaching,
  // buildExcludes: [/middleware-manifest.json$/],
  fallbacks: {
    document: "/offline",
  },
});

export default withPWA(nextConfig);
