# Team Dashboard App

This is the Dashboard application, here are the micro-frontends of the Dashboard domain, such as the `dashboard`

All micro-frontends will be expose through the Module-Federation to be available as a remote application to the Container App.


## Quick start

To start only the Dashboard application, change directory from the root:

```bash
$ cd apps/dashboard
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
│   ├── components/
|   |       ├── dashboard/
|   |   |   ├── dashboard.tsx
|   |   |   ├── dashboard.module.css
|   |   |   ├── dashboard.spec.tsx
|   |   |   └── index.ts
│   ├── mfe/
│   ├── pages/
│   └── styles/
├── next.config.mjs
├── package.json
└── public/
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

- **mfe**: The folder with the micro-frontend to be export as a remote application.


###### Component Naming: kebab

File naming should follow kebab-case convention.


- **next.config.mjs**: Next.js configuration for server and build phases.
Here is where our micro-frontend Module-Federation configuration is. 
The Container App setup is different from the remote applications since it consumes the other apps. 


## Module-Federation and Next.config.mjs

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


## Creating or modifying a micro-frontend

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

### Creating a new micro-frontend

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
