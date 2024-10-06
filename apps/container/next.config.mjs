/** @type {import('next').NextConfig} */
import { NextFederationPlugin } from '@module-federation/nextjs-mf';

const MODULE_PATHS = {
  dashboard: 'dashboard',
}

const LOCAL_OVERRIDES = {
  dashboard :{
    localPort: '3001'
  }
}

const getModuleFederationRemotes = (isServer, overrides = {}) => {
  return Object.keys(MODULE_PATHS).reduce((remotes, moduleKey) => {
    const { localPort } = overrides[moduleKey] || {};
    const modulePath = localPort || MODULE_PATHS[moduleKey];
    const baseUrl = process.env.LOCAL_BASE_URL || process.env.MF_REMOTE_BASE_URL; // Deployed url

    console.log('remote:', isServer,`${[moduleKey]}:${moduleKey}@${baseUrl}${modulePath}`);

    return {
      ...remotes,
      [moduleKey]: `${moduleKey}@${baseUrl}${modulePath}/_next/static/${
        isServer ? 'ssr' : 'chunks'
      }/remoteEntry.js`,
    };
  }, {});
};

const nextConfig = {

  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'container',
      filename: 'static/chunks/remoteEntry.js',
      remotes: getModuleFederationRemotes(config.isServer, LOCAL_OVERRIDES ),
      extraOptions: {},
      exposes: {},
      shared: {},
    };
    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));
    return config;
  },

};

export default nextConfig;
