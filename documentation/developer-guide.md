# Developers Guide

A guide to the engineering team.

## Table of Content


1. [Project Structure](#project-structure) 
1. [Micro-frontend architecture](architecture-overview.md)
1. [Remote Application](#remote-application-module-federation-and-nextconfigmjs)
1. [Container Application](#container-application-module-federation-and-nextconfigmjs)
1. [Modifying a Micro-frontend](#modifying-a-micro-frontend)
1. [Creating a Micro-frontend](#creating-a-new-micro-frontend)
1. [Remote Application Structure](../apps/team-dashboard/README.md)
1. [Container Application Structure](../apps/container/README.md)
1. [Environment Variable](#environment-variables)
1. [Testing](#testing)
1. [Pull Request Guidelines](#pull-request-guidelines)
1. [Commit messages](#commit-messages)
1. [Respect earns Respect](#-respect-earns-respect)



## Project structure

Overview:

```bash
mfe-demo/
│
├── apps/ 
│   ├── team-onboarding/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── src/
├── team-dashboard/
│   │   ├── next.config.js
│   │   ├── package.json
│   │   └── src/
│   └── container/
│       ├── next.config.js
│       ├── package.json
│       └── src/
│
├── packages/   
│   ├── ui/   // shared UI components TBD
│   │   ├── package.json
│   │   └── src/
│
├── turbo.json
└── package.json
```

**The Apps folder:**
All folder inside the Apps folder's is a frontend standalone application.

To run a specific frontend application without turborepo, change directory to the application you wish and run `yarn dev`.

Example: 
To run the `team-dashboard` application, run the command from the root folder: 

```bash
$ cd apps/team-dashboard
$ yarn dev
```


###### Monorepo with Turbo

You can start all applications at once, just run in the root folder. To develop all apps and packages, run the following command:

```bash
$ yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the container app.

Open [http://localhost:3001](http://localhost:3001) with your browser to see the team-dashboard app.

Open [http://localhost:3002](http://localhost:3002) with your browser to see the team-onboarding app.


If you never worked with a monorepo structure, read fisrt [onboarding](./onboarding-mentoring.md) documentation.



## Micro-frontend with Module Federation

First make sure that you are [onboard](onboarding-mentoring.md) and  familiar with the [Micro-frontend architecture](architecture-overview.md)



### Remote Application: Module-Federation and Next.config.mjs

For a remote application it's only neccessary to expose the path of the component needed, in the Module-federation `exposes` property. The exposes property is used to define the modules or components from the local application that can be shared and used by other remote applications. Essentially, it allows your micro-frontend or host application to "expose" specific modules so that other applications can import and use them as if they were local modules.


```bash
const nextConfig = {

  webpack: (config) => {
    const moduleFederationConfig = {
      name: 'dashboard',
      filename: 'static/chunks/remoteEntry.js',
      remotes: {},
      extraOptions: {},
      exposes: {
       './dashboard': './src/mfe/dashboard.js',
      },
      shared: { react: { singleton: true }, 'react-dom': { singleton: true } },
    };
    config.plugins.push(new NextFederationPlugin(moduleFederationConfig));

    return config;
  },
};
```

This part of the nextConfig function integrates Module Federation into the Next.js build pipeline.
- name: Specifies the container name (in this case, 'dashboard').
- remotes: This field is populated when the current application is consuming remote apps.
- shared: The react and react-dom libraries are set to be shared as singletons across all micro-frontends to prevent multiple versions of React from being loaded.


## Modifying a micro-frontend

First make sure you are in the right domain to find the micro-frontend module you need or to create one in the meaningful place.

### Modifying the remote name

Case you want to modify the name that the micro-frontend is exposed as, change it in the `next.config.mjs`:

```bash
 exposes: {
        './newName': './src/mfe/dashboard.ts',
      },
```      

Keep it in mind that it will need to match the name in the Container App where it is being consumed as a remote application.

### Modifying the logic or visuals

To make any sorts of change in the code base of the compoenent, follow best practice guidelines of react development. If the code change modifies only the logic or visual design - UI - just save it and commit your changes normally, no Module-federation change is needed.

## Creating a new micro-frontend

To create a new micro-frontend module or component, follow the folder structure and development best practice as a react component.

- Follow the application folder [structure](#application-structure) and file naming convention.

- To be able to view the micro-frontend component you are developing in the page you can import it in the homepage index under the `pages` or create a new page to it. Run `yarn dev` and you be able to see it in `http://localhost:3001`

- Export the module from within the **`mfe`** folder:

```bash
import Chart from '../component/chart';

export default function Dashboard() {
  return (
    <>
    <h1>Dashboard</h1>
    <div className={styles.chart}>
    <Chart />
    </div>
  )
}
```
Or if it's a simple component, just use a default export: 

```bash
export { default } from '../components/dashboard';
```


- To expose you new created component, add it to the `next.config.mjs` in the `exposes` property, the name that you want it do have and the path to the new component.

```bash
 exposes: {
        './my-component': './src/mfe/my-component.ts',
      },
```      



### Container Application: Module-Federation and Next.config.mjs

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

# Testing

No new feature without testing, we should follow Test-Driven Development (TDD) strategy.

## Unit Testing

Unit tests for components that have a specific logic and utility functions.

- Purpose: Verify individual components and functions work as expected in isolation.

- Tool: Jest + Testing Library

- Approach:
    Use TDD by first writing unit tests for the component’s functionality.
    Focus on small, isolated units like React components, utility functions, and hooks.
    Ensure tests cover the primary logic, edge cases, and output rendering.

## Integration Testing

Integration tests for components that don't have any logic.

- Purpose: Test how different parts of the system (components, hooks, services) work together.

- Tool: Jest + Testing Library

- Approach:

    In a TDD process, start by writing integration tests that define how multiple components or modules should work together.
    Focus on data flow between components, state changes, or API calls and how the app reacts.

## E2E tests

Add data-testid to all of your components, so that E2E can be easily written.

- Purpose: Ensure the entire application works correctly from a user’s perspective.

- Tool: Playwrigth (Jest is used mainly for unit/integration, while Playwrigth is preferred for E2E)

- Approach:

    Define high-level user flows using TDD (e.g., logging in, navigating to a page, performing actions).
    Start with a failing E2E test, then develop the feature to meet user flow expectations.
    Ensure tests cover critical paths, user interaction, and expected outcomes.

## Environment variables

- Follow the `.env.example` to create `.env.development` and `.env.production`
- When adding new environment variable, make sure to prefix client variables with `NEXT_PUBLIC_`.
- ❗NEVER add server secrets as public client variables.
- Always make sure to add newly created variables names to `.env.example`



## Pull Request Guidelines

- The `main` branch is basically a snapshot of the latest stable version. All development must be done in dedicated branches.
- Make sure that Github Actions checks are green
- It is good to have multiple small commits while working on the PR. We'll let GitHub squash it automatically before the merge.
- If you add a new feature:
  - Add the test case that accompanies it.
  - Provide a compelling reason to add this feature.
- If you correct an error:
  - Provide a detailed description of the error in the PR. Favorite live demo.
  - Add the appropriate test coverage, if applicable.


## Commit messages

This repo uses [conventional commits](https://www.conventionalcommits.org/en/v1.0.0/). This is enforced using [commitLint](https://commitlint.js.org/#/). The configuration lives in the `commitlint.config.js` file in the root of the project. To pass lint, a commit message MUST follow the following format:

```
<type>[optional scope]: <description> <Jira ticket number>

[optional body]

[optional footer(s)]
```

Type can be one of the following:

`fix`, `feat`, `BREAKING CHANGE`, `build`, `chore`, `ci`, `docs`, `style`, `refactor`, `perf`, `test`



## 👏 Respect earns Respect

- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members
