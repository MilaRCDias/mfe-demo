/** @type {import('next').NextConfig} */
import { NextFederationPlugin } from '@module-federation/nextjs-mf';


const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'onboarding',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {},
      extraOptions: {},
      exposes: {
        './login': './src/components/login/index.ts',
      },
      shared: {},
    };

    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));
    return config;
  },

};

export default nextConfig;
