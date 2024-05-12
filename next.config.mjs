import withPWAInit from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  images: {
    domains: [
      "localhost",
      "mapman-frontend.vercel.app",
      "lh3.googleusercontent.com",
      "maps.googleapis.com",
      "upcdn.io",
    ],
  },
};

const withPWA = withPWAInit({
  dest: "public",
  register: true,
  skipWaiting: true,
});

export default withPWA(nextConfig);
