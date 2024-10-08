import dynamic from 'next/dynamic';
import { LoadingMfe } from '@/components/loading';

const LoginMfe = dynamic(import('onboarding/login'), {
  loading: () => <LoadingMfe />,
  ssr: false,
});

const Login = () => {
  return <LoginMfe />;
};

export default Login;
