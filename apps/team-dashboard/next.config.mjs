/** @type {import('next').NextConfig} */
import { NextFederationPlugin } from '@module-federation/nextjs-mf';


const nextConfig = {

  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'dashboard',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {},
      extraOptions: {},
      exposes: {
        './dashboard': './src/components/dashboard/index.ts',
      },
      shared: {},
    };
    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));
    return config;
  },

};

export default nextConfig;
