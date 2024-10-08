import { differenceInCalendarDays } from 'date-fns';
import { format } from 'date-fns';

export const formatDateToISO8601 = (date: Date): string => {
  return format(date, "yyyy-MM-dd'T'HH:mm'Z'");
};

export const validateDateRange = (startDate: Date, endDate: Date): boolean => {
  const diff = differenceInCalendarDays(endDate, startDate);
  return diff <= 14;
};
