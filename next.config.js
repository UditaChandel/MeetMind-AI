/* @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        serverActions: true
    },

    images: {
        domains: []
    },

    reactStrictMode: true
};

module.exports = nextConfig;