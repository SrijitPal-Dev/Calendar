import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import { CalendarEvent } from './CalendarView.types';
import { isCurrentMonth, format } from '@/utils/date.utils';
import { getEventsForDate } from '@/utils/event.utils';

export interface CalendarCellProps {
  date: Date;
  events: CalendarEvent[];
  currentMonth: Date;
  isToday: boolean;
  isSelected: boolean;
  onClick: (date: Date) => void;
  onEventClick: (event: CalendarEvent) => void;
}

export const CalendarCell: React.FC<CalendarCellProps> = React.memo(({
  date,
  events,
  currentMonth,
  isToday,
  isSelected,
  onClick,
  onEventClick,
}) => {
  const dayEvents = useMemo(() => getEventsForDate(events, date), [events, date]);
  const isCurrentMonthDate = useMemo(() => isCurrentMonth(date, currentMonth), [date, currentMonth]);
  const dayNumber = useMemo(() => format(date, 'd'), [date]);

  const handleClick = useCallback(() => {
    onClick(date);
  }, [date, onClick]);

  const handleEventClick = useCallback((e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
  }, [handleClick]);

  const eventCount = dayEvents.length;
  const displayEvents = dayEvents.slice(0, 3);
  const remainingCount = eventCount - 3;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={`${format(date, 'MMMM d, yyyy')}. ${eventCount} event${eventCount !== 1 ? 's' : ''}.`}
      aria-pressed={isSelected}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={clsx(
        'border border-neutral-200 h-32 p-2 transition-colors cursor-pointer',
        'hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:z-10',
        !isCurrentMonthDate && 'bg-neutral-50 text-neutral-400',
        isSelected && 'ring-2 ring-primary-500 z-10'
      )}
    >
      <div className="flex justify-between items-start mb-1">
        <span
          className={clsx(
            'text-sm font-medium',
            isToday && 'w-6 h-6 bg-primary-500 rounded-full text-white text-xs flex items-center justify-center',
            !isToday && !isCurrentMonthDate && 'text-neutral-400',
            !isToday && isCurrentMonthDate && 'text-neutral-900'
          )}
        >
          {dayNumber}
        </span>
      </div>
      <div className="space-y-1 overflow-hidden">
        {displayEvents.map(event => (
          <div
            key={event.id}
            onClick={(e) => handleEventClick(e, event)}
            className="text-xs px-2 py-1 rounded truncate cursor-pointer hover:opacity-80 transition-opacity"
            style={{
              backgroundColor: event.color || '#3b82f6',
              color: '#ffffff',
            }}
            title={event.title}
          >
            {event.title}
          </div>
        ))}
        {remainingCount > 0 && (
          <button
            onClick={handleClick}
            className="text-xs text-primary-600 hover:underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
          >
            +{remainingCount} more
          </button>
        )}
      </div>
    </div>
  );
});

CalendarCell.displayName = 'CalendarCell';

