import { 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval,
  isSameDay,
  isSameMonth,
  format,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  startOfDay,
  differenceInMinutes,
} from 'date-fns';

/**
 * Calculates the number of days between two dates
 * @param start - Start date
 * @param end - End date
 * @returns Number of days (can be negative if end is before start)
 */
export const daysBetween = (start: Date, end: Date): number => {
  const msPerDay = 1000 * 60 * 60 * 24;
  const startMs = start.getTime();
  const endMs = end.getTime();
  return Math.floor((endMs - startMs) / msPerDay);
};

/**
 * Checks if two dates fall on the same day (ignores time)
 */
export const isSameDayDate = (date1: Date, date2: Date): boolean => {
  return isSameDay(date1, date2);
};

/**
 * Gets all days in a month
 */
export const getDaysInMonth = (date: Date): Date[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  return eachDayOfInterval({ start, end });
};

/**
 * Gets the calendar grid (42 cells for month view)
 */
export const getCalendarGrid = (date: Date): Date[] => {
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
  
  return eachDayOfInterval({ start: calendarStart, end: calendarEnd });
};

/**
 * Checks if a date is in the current month
 */
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

/**
 * Gets the week view dates (7 days starting from the week containing the date)
 */
export const getWeekDates = (date: Date): Date[] => {
  const weekStart = startOfWeek(date, { weekStartsOn: 0 });
  const weekEnd = endOfWeek(date, { weekStartsOn: 0 });
  return eachDayOfInterval({ start: weekStart, end: weekEnd });
};

/**
 * Formats a date to display format
 */
export const formatDateDisplay = (date: Date, formatStr: string = 'MMM d, yyyy'): string => {
  return format(date, formatStr);
};

/**
 * Gets the next month
 */
export const getNextMonth = (date: Date): Date => {
  return addMonths(date, 1);
};

/**
 * Gets the previous month
 */
export const getPreviousMonth = (date: Date): Date => {
  return subMonths(date, 1);
};

/**
 * Gets the next week
 */
export const getNextWeek = (date: Date): Date => {
  return addWeeks(date, 1);
};

/**
 * Gets the previous week
 */
export const getPreviousWeek = (date: Date): Date => {
  return subWeeks(date, 1);
};

/**
 * Gets time slots for week view (00:00 - 23:00)
 */
export const getTimeSlots = (intervalMinutes: number = 60): Date[] => {
  const slots: Date[] = [];
  const baseDate = new Date();
  baseDate.setHours(0, 0, 0, 0);
  
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const slot = new Date(baseDate);
      slot.setHours(hour, minute, 0, 0);
      slots.push(slot);
    }
  }
  
  return slots;
};

/**
 * Gets the position and height of an event in week view
 */
export const getEventPosition = (
  eventStart: Date,
  eventEnd: Date,
  dayStart: Date,
  slotHeight: number = 60
): { top: number; height: number } => {
  const dayStartTime = startOfDay(dayStart);
  const eventStartTime = eventStart;
  const eventEndTime = eventEnd;
  
  const minutesFromStart = differenceInMinutes(eventStartTime, dayStartTime);
  const durationMinutes = differenceInMinutes(eventEndTime, eventStartTime);
  
  const top = (minutesFromStart / 60) * slotHeight;
  const height = Math.max((durationMinutes / 60) * slotHeight, 20);
  
  return { top, height };
};

/**
 * Formats time for display
 */
export const formatTime = (date: Date): string => {
  return format(date, 'HH:mm');
};

/**
 * Formats date and time for display
 */
export const formatDateTime = (date: Date): string => {
  return format(date, 'MMM d, yyyy HH:mm');
};

/**
 * Checks if an event overlaps with another event
 */
export const eventsOverlap = (event1: { startDate: Date; endDate: Date }, event2: { startDate: Date; endDate: Date }): boolean => {
  // Two events overlap if event1 starts before event2 ends AND event1 ends after event2 starts
  return (
    event1.startDate < event2.endDate &&
    event1.endDate > event2.startDate
  );
};

/**
 * Gets the day name abbreviation
 */
export const getDayName = (date: Date): string => {
  return format(date, 'EEE');
};

/**
 * Gets the month name
 */
export const getMonthName = (date: Date): string => {
  return format(date, 'MMMM');
};

/**
 * Gets the year
 */
export const getYear = (date: Date): number => {
  return date.getFullYear();
};

// Re-export format from date-fns for convenience
export { format } from 'date-fns';

