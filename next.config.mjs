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
    ],
  },
};

export default nextConfig;
