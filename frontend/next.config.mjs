/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: '/api/v1/:path*',
                destination: 'http://127.0.0.1:8000/api/v1/:path*',
            },
            {
                source: '/api/health',
                destination: 'http://127.0.0.1:8000/api/health',
            },
            {
                source: '/api/debug/:path*',
                destination: 'http://127.0.0.1:8000/api/debug/:path*',
            },
        ]
    },
};

export default nextConfig;
