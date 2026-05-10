/** @type {import('next').NextConfig} */
const nextConfig = {
  // react-pdf + pdfjs-dist: see https://github.com/wojtekmaj/react-pdf#nextjs
  swcMinify: false,
  // pdfjs-dist 5.4+ also breaks with webpack eval-* devtools in dev
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.devtool = "cheap-module-source-map";
    }
    return config;
  },
  transpilePackages: ["react-pdf", "pdfjs-dist"],
  // Không dùng optimizePackageImports cho MUI: với Next 14 + MUI v9 dễ gãy
  // ("createSvgIcon is not a function", "createProxy is not a function").
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      { protocol: "https", hostname: "utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "**.utfs.io", pathname: "/**" },
      { protocol: "https", hostname: "ufs.sh", pathname: "/**" },
      /* UploadThing: file CDN dạng https://<id>.ufs.sh/f/... */
      { protocol: "https", hostname: "**.ufs.sh", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      { protocol: "https", hostname: "placehold.co", pathname: "/**" },
    ],
  },
};

export default nextConfig;
