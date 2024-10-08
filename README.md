# Monorepo Micro-frontend App Architecture

This application demonstrates a micro-frontend architecture, consisting of two remote applications integrated into a single container application that hosts both. Each application developed using **Next.js** and shared their code using **Module Federation**.


## What's inside?

- [Quick start](#quick-start)
- [Architecture Overview](./documentation/arquitecture-overview.md)
- [Testing Strategy](./documentation/developer-guide.md/#testing)
- [Developer Guide](./documentation/developer-guide.md)
- [Mentoring and Onboarding](./documentation/onboarding-mentoring.md)
- [Stakeholder Communication](./documentation/stakeholder-communication.md)



## Quick start
To set up the repository initially and get a baseline working, follow these steps:

1. Clone the repository
```bash
$ git clone git@github.com:MilaRCDias/mfe-demo.git
```

2. Install all package dependencies using yarn

run command:

```bash
$ yarn
```


3. To develop all apps and packages, run the following command:

```bash
$ yarn dev
```

4. To build all apps and packages, run the following command:

```bash
$ yarn build && yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the container app.




## Folder structure and ports

Each app has its folder inside the `apps` folder. Each app folder contains the actual application (e.g. `container`, `team-dashboard`, `team-onboarding`).

Different port numbers are used to host applications. The following table shows which teams own which application.

| Port   | Team                    | Responsibility                                    |
| ------ | ----------------------- | ------------------------------------------------- |
| `3000` | Container Application     |                        |
| `3001` | Team Dashboard           | dashboard                            |
| `3002` | Team Onboarding            | register, login, navigation          |


All shared reusable UI components, utils, configs, and data context are in the `packages` folder. (TBD)


## Deployment

(TBD) All application will be deployed automatic when merge to main branch from a approved Pull Request. The github action will include verifying which app had changes made in the Pull Request and will deploy only that specific app. The CI/CD setup with Netlify is on progress, in the Pull Request [#6](https://github.com/MilaRCDias/mfe-demo/pull/6).


### Monorepo 

For practicity this demo project is using a mono-repository structure. This decision was made based on the questions "what problem am I trying to solve" and "what are the requirements", this decision can vary according to projects size, preference of CI/CD setup, amont other things. 
