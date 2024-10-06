import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>Team Dashboard Micro-frontend</title>
        <meta name="description" content="Micro-frontend team dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <main>
          <h1>This is a Micro-frontend remote application</h1>
          <h3>Here you can render your component to visualize only, this page will not be expose as component</h3>
        </main>
      </div>
    </>
  );
}
