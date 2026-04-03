/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['rss-parser', '@supabase/supabase-js'],
  },
}

module.exports = nextConfig
