import dynamic from 'next/dynamic';
import { LoadingMfe } from '@/components/loading';

const DashboardMfe = dynamic(import('dashboard/dashboard'), {
  loading: () => <LoadingMfe />,
  ssr: false,
});

const Dashboard = () => {
  return <DashboardMfe />;
};

export default Dashboard;
