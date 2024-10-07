# Container App 

This is the Container app that acts as the main application that serves as the entry point for the entire application. It is responsible for rendering the initial UI and for orchestrating the integration of multiple micro-frontends.

The Container app is composed of many micro-frontends that provide functionality and services to the end-users. It has the responsibility of loading and communicating with the micro-frontends, handling routing and providing a consistent UI experience.


## Quick start

To start only the container application, you need to take in consideration that this app is hosting the remote applications, if you start the container app with the other they will not be render in the page.

```bash
$ cd apps/container
```

To start develop mode: 

```bash
$ yarn dev
```

To build the app: 

```bash
$ yarn build && yarn start
```


## Application structure

Follow the folder structure to add more files to the project.

```bash
container/
├── src/
│   ├── mfe-modules/
│   │   ├── Login/
|   |   |   └── index.tsx
│   │   └── mfe-types.d.ts
│   ├── components/
│   ├── pages/
│   └── styles/
├── next.config.mjs
├── package.json
└── public/
```

- **mfe-modules**: import the micro-frontend components inside this folder.

```bash
import dynamic from 'next/dynamic';
import { LoadingMfe } from '../loading';

const LoginMfe = dynamic(import('onboarding/login'), {
  loading: () => <LoadingMfe />,
  ssr: false,
});

const Login = () => {
  return <LoginMfe />;
};

export default Login;
```

- **mfe-types.d.ts**: Declare the module type for the imported micro-frontend.

```bash
declare module 'onboarding/login' {
  import { ComponentType } from 'react';
  const Login: ComponentType;
  export default Login;
}
```

- **pages**: Next.js pages router. Adding a new file here to create a new page view in the application.
See Next.js page router official docs for more information.

- **styles**: Global style sheet.

- **components**: Folder with react page components. All components that compose a page view. Design your component re-usable and modular. Have in consideration HTML semantics, accessibility, tests and mobile first development. 

A component folder should have the structure, as example:

```bash
|- button  
      |- button.tsx        // the component
      |- button.spec.ts   // component test
      |- button.*.ts   // custom file if needed such as component specific helpers or constants
      |- button.module.css // style file
```


### Component Naming: kebab

File naming should follow kebab-case convention.


- **next.config.mjs**: Next.js configuration for server and build phases.
Here is where our micro-frontend Module-Federation configuration is. 
The Container App setup is different from the remote applications since it consumes the other apps. 


## Module-Federation and Next.config.mjs

The code bellow defines a dynamic setup for Module Federation, allowing the seamless integration of remote micro-frontend modules. It automatically generates the correct URLs for the remote micro-frontends based on environment variables and local overrides, making the configuration scalable and flexible. (This function is only needed in a Container application that hosts or consumes other remote application.) 


```bash
const getModuleFederationRemotes = (isServer, overrides = {}) => {
  return Object.keys(MODULE_PATHS).reduce((remotes, moduleKey) => {
    const { localPort } = overrides[moduleKey] || {};
    const modulePath = localPort || MODULE_PATHS[moduleKey];
    const baseUrl = process.env.LOCAL_BASE_URL || process.env.MF_REMOTE_BASE_URL; 

    return {
      ...remotes,
      [moduleKey]: `${moduleKey}@${baseUrl}${modulePath}/_next/static/${
        isServer ? 'ssr' : 'chunks'
      }/remoteEntry.js`,
    };
  }, {});
};
```
 - `LOCAL_BASE_URL` variable can be found in the .env.example. Make sure to add it to your `.env.local` file

 - `MF_REMOTE_BASE_URL` is the deployed URL base path variable can be found in the .env.example. Make sure to add it to your `.env.production` file. (deploy TBD)



```bash
const MODULE_PATHS = {
  dashboard: 'dashboard',
  onboarding: 'onboarding'
}
```

To Override the deploy URL and work with the local remote application, add the local port as bellow:

```bash
const LOCAL_OVERRIDES = {
  dashboard :{
    localPort: '3001'
  },
  onboarding:{
    localPort: '3002'
  }
}
```

The function can be called in the webpack plugin from Module-Federation, in the `remote` property as ` remotes: getModuleFederationRemotes(config.isServer, LOCAL_OVERRIDES),`

This part of the nextConfig function integrates Module Federation into the Next.js build pipeline.

```bash
const nextConfig = {

  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'container',
      filename: 'static/chunks/remoteEntry.js',
      remotes: getModuleFederationRemotes(config.isServer, LOCAL_OVERRIDES),
      extraOptions: {},
      exposes: {},
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    };
    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));

    return config;
  },
};
```

- name: Specifies the container name (in this case, 'container').
- remotes: This field is populated by the getModuleFederationRemotes function, dynamically generating the URLs of remote micro-frontends based on whether it is server-side (ssr) or client-side (chunks).
- shared: The react and react-dom libraries are set to be shared as singletons across all micro-frontends to prevent multiple versions of React from being loaded.




