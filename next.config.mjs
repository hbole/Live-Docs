import {withSentryConfig} from '@sentry/nextjs';
// import type { NextConfig } from "next";

const nextConfig = {
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true
    },
    images: {
        remotePatterns: [{ protocol: 'https', hostname: 'img.clerk.com' }]
    }
};

// export default nextConfig;

export default withSentryConfig(nextConfig, {
    org: "harshit-l60",
    project: "live-docs",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
    traceSampleRate: 0,
});