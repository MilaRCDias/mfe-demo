import React, { useMemo } from 'react';
import { AxisOptions, Chart as ChartLib } from 'react-charts';
import styles from './chart.module.css';

type ChartDataPoint = {
  date: Date;
  value: number;
};

type Series = {
  label: string;
  data: ChartDataPoint[];
};

interface ChartProps {
  data: Series[];
}

const Chart: React.FC<ChartProps> = ({ data }) => {
  const primaryAxis = useMemo(
    (): AxisOptions<ChartDataPoint> => ({
      getValue: (datum) => datum.date,
    }),
    [],
  );

  const secondaryAxes = useMemo(
    (): AxisOptions<ChartDataPoint>[] => [
      {
        getValue: (datum) => datum.value,
      },
    ],
    [],
  );

  return (
    <div className={styles.chart}>
      <ChartLib
        data-testid='react-charts'
        options={{
          data,
          primaryAxis,
          secondaryAxes,
        }}
      />
    </div>
  );
};

export default Chart;
