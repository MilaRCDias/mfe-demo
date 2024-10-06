import Head from 'next/head';
import Login from '@/mfe-modules/login';

export default function Home() {
  return (
    <>
      <Head>
        <title>Container App</title>
        <meta name='description' content='Website of the project' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <h1>Container App</h1>
        <Login />
      </div>
    </>
  );
}
