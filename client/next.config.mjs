/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite qualquer hostname
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
