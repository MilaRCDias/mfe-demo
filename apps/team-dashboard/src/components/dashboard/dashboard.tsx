import React, { useState, useEffect } from 'react';
import DateRangePicker from '../date-picker/date-picker';
import Chart from '../chart/chart';
import { fetchCarbonIntensity } from '@/services/fetch-carbon-intensity';
import { subDays } from 'date-fns';
import { formatDateToISO8601 } from '../date-picker/date-picker.helper';
import styles from './dashboard.module.css';

type ChartSeries = {
  label: string;
  data: { date: Date; value: number }[];
};

const Dashboard: React.FC = () => {
  const now = new Date();
  const initialStartDate = subDays(now, 2);

  const [dateRange, setDateRange] = useState<[string, string]>([
    formatDateToISO8601(initialStartDate),
    formatDateToISO8601(now),
  ]);

  const [chartData, setChartData] = useState<ChartSeries[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [from, to] = dateRange;
        const response = await fetchCarbonIntensity(from, to);

        if (!response) {
          setChartData([]);
          return;
        }

        const forecastData = response.data.map((d: any) => ({
          date: new Date(d.from),
          value: d.intensity.forecast,
        }));

        const actualData = response.data.map((d: any) => ({
          date: new Date(d.from),
          value: d.intensity.actual,
        }));

        setChartData([
          { label: 'Forecast', data: forecastData },
          { label: 'Actual', data: actualData },
        ]);
      } catch (err) {
        setError('Error fetching carbon intensity data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dateRange]);

  const handleDateRangeChange = (range: [string, string]) => {
    setDateRange(range);
  };

  return (
    <section className={styles.container}>
      <h1>Carbon Intensity Dashboard</h1>

      <DateRangePicker onDateChange={handleDateRangeChange} />

      <div>
        {error && <p className={styles.error}>{error}</p>}
        {loading ? (
          <p className={styles['empty-state']}>Loading chart data...</p>
        ) : chartData.length > 0 ? (
          <Chart data={chartData} />
        ) : (
          <p className={styles['empty-state']}>No data available.</p>
        )}
      </div>
    </section>
  );
};

export default Dashboard;
