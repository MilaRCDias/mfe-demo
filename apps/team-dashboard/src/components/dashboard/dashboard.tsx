import React, { useEffect, useState } from 'react';
import Chart from './chart/chart';

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/get-data');
        const data = await response.json();
        console.log('data', data);
        setData(data.recipes);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Data</h1>
      <ul>
        {data?.map((recipe) => <li key={recipe.id}>{recipe.name}</li>)}
        <Chart></Chart>
      </ul>
    </div>
  );
};

export default Dashboard;
