/** @type {import('next').NextConfig} */
import { NextFederationPlugin } from '@module-federation/nextjs-mf';


const nextConfig = {

  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'mfe-onboarding',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {},
      extraOptions: {},
      exposes: {},
      shared: {},
    };
    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));
    return config;
  },

};

export default nextConfig;
