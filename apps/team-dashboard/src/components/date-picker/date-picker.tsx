import React, { useState } from 'react';
import DatePicker from 'react-multi-date-picker';
import { DateObject } from 'react-multi-date-picker';
import { formatDateToISO8601, validateDateRange } from './date-picker.helper';
import { addDays } from 'date-fns';
import styles from './date-picker.module.css';

interface DateRangePickerProps {
  onDateChange: (range: [string, string]) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ onDateChange }) => {
  const [values, setValues] = useState<[DateObject, DateObject]>([
    new DateObject().subtract(4, 'days'),
    new DateObject().subtract(1, 'days'),
  ]);
  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (newValues: [DateObject, DateObject]) => {
    if (newValues[0] && newValues[1]) {
      const startDate = newValues[0].toDate();
      const endDate = newValues[1].toDate();

      if (validateDateRange(startDate, endDate)) {
        setValues(newValues);
        setError(null);

        onDateChange([formatDateToISO8601(startDate), formatDateToISO8601(endDate)]);
      } else {
        setError('The selected date range cannot exceed 14 days.');
        const end = addDays(startDate, 13);
        const newEndDate = new DateObject(end);
        setValues([newValues[0], newEndDate]);
      }
    }
  };

  return (
    <div className={styles.date}>
      <DatePicker
        id='banana'
        //style={{width:'200px'}}

        value={values}
        onChange={handleDateChange}
        range
        rangeHover
        maxDate={new DateObject()}
      />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
};

export default DateRangePicker;
