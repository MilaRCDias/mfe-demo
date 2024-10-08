import Login from '@/components/login/login';
import Head from 'next/head';
import styles from '@/styles/home.module.css';

export default function Home() {
  return (
    <>
      <Head>
        <title>Team Onboarding Micro-frontend</title>
        <meta name='description' content='Micro-frontend team dashboard' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div>
        <main className={styles.home}>
          <h1>This is a Micro-frontend remote application</h1>
          <h3>
            Here you can render your component to visualize only, this page will not be expose as
            component
          </h3>
          <Login />
        </main>
      </div>
    </>
  );
}
