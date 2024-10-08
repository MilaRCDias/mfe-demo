# Monorepo Micro-frontend App Architecture

This application demonstrates a micro-frontend architecture, consisting of two remote applications integrated into a single container application that hosts both.



## What's inside?

- [Quick start](#quick-start)
- [Architecture Overview](./documentation/arquitecture-overview.md)
- Testing Strategy
- [Developer Guide](./documentation/developer-guide.md)
- Mentoring and Onboarding
- Stakeholder Communication



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


### Monorepo 

For practicity this demo project is using a mono-repository structure. This decision was made based on the questions "what problem am I trying to solve" and "what are the requirements", this decision can vary according to projects size, preference of CI/CD setup, amont other things. 

