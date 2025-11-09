import React, { useMemo } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { CalendarCell } from './CalendarCell';
import { getCalendarGrid, isSameDayDate } from '@/utils/date.utils';

export interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  selectedDate,
  onDateClick,
  onEventClick,
}) => {
  const calendarGrid = useMemo(() => getCalendarGrid(currentDate), [currentDate]);
  const today = useMemo(() => new Date(), []);

  return (
    <div className="w-full">
      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-neutral-200">
        {DAYS_OF_WEEK.map(day => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-neutral-700"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarGrid.map((date, index) => {
          const isToday = isSameDayDate(date, today);
          const isSelected = selectedDate ? isSameDayDate(date, selectedDate) : false;

          return (
            <CalendarCell
              key={`${date.getTime()}-${index}`}
              date={date}
              events={events}
              currentMonth={currentDate}
              isToday={isToday}
              isSelected={isSelected}
              onClick={onDateClick}
              onEventClick={onEventClick}
            />
          );
        })}
      </div>
    </div>
  );
};

