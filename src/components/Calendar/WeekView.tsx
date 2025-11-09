import React, { useMemo, useCallback } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { getWeekDates, getEventPosition, formatTime, format, isSameDayDate } from '@/utils/date.utils';
import { getEventsForDay, groupOverlappingEvents, sortEventsByStartTime } from '@/utils/event.utils';

export interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onTimeSlotClick: (date: Date, time: Date) => void;
}

const TIME_SLOT_HEIGHT = 60; // pixels per hour
const HOURS = Array.from({ length: 24 }, (_, i) => i);

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onEventClick,
  onTimeSlotClick,
}) => {
  const weekDates = useMemo(() => getWeekDates(currentDate), [currentDate]);
  const today = useMemo(() => new Date(), []);

  const handleTimeSlotClick = useCallback((date: Date, hour: number) => {
    const time = new Date(date);
    time.setHours(hour, 0, 0, 0);
    onTimeSlotClick(date, time);
  }, [onTimeSlotClick]);

  const handleEventClick = useCallback((e: React.MouseEvent, event: CalendarEvent) => {
    e.stopPropagation();
    onEventClick(event);
  }, [onEventClick]);

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-[800px]">
        {/* Day headers */}
        <div className="grid grid-cols-8 border-b border-neutral-200 sticky top-0 bg-white z-10">
          <div className="p-2 border-r border-neutral-200"></div>
          {weekDates.map(date => {
            const isToday = isSameDayDate(date, today);
            const headerClassName = `p-2 text-center border-r border-neutral-200 ${isToday ? 'bg-primary-50' : ''}`;
            const dayNumberClassName = `text-lg font-semibold ${isToday ? 'text-primary-600' : 'text-neutral-900'}`;
            return (
              <div
                key={date.getTime()}
                className={headerClassName}
              >
                <div className="text-sm font-medium text-neutral-700">
                  {format(date, 'EEE')}
                </div>
                <div className={dayNumberClassName}>
                  {format(date, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* Time grid */}
        <div className="grid grid-cols-8">
          {/* Time column */}
          <div className="border-r border-neutral-200">
            {HOURS.map(hour => (
              <div
                key={hour}
                className="h-[60px] border-b border-neutral-100 text-xs text-neutral-500 px-2 pt-1"
              >
                {formatTime(new Date(2000, 0, 1, hour, 0))}
              </div>
            ))}
          </div>

          {/* Day columns */}
          {weekDates.map(date => {
            const dayEvents = getEventsForDay(events, date);
            const sortedEvents = sortEventsByStartTime(dayEvents);
            const eventGroups = groupOverlappingEvents(sortedEvents);

            return (
              <div
                key={date.getTime()}
                className="border-r border-neutral-200 relative"
              >
                {/* Time slots */}
                {HOURS.map(hour => (
                  <div
                    key={hour}
                    className="h-[60px] border-b border-neutral-100 hover:bg-neutral-50 cursor-pointer transition-colors"
                    onClick={() => handleTimeSlotClick(date, hour)}
                    role="button"
                    tabIndex={0}
                    aria-label={`${format(date, 'MMMM d, yyyy')} at ${formatTime(new Date(2000, 0, 1, hour, 0))}`}
                  />
                ))}

                {/* Events */}
                {eventGroups.map((group, groupIndex) => {
                  const groupWidth = 100 / eventGroups.length;
                  const leftOffset = (groupIndex * groupWidth);
                  
                  return group.map((event, eventIndex) => {
                    const eventStart = new Date(event.startDate);
                    const eventEnd = new Date(event.endDate);
                    const { top, height } = getEventPosition(eventStart, eventEnd, date, TIME_SLOT_HEIGHT);
                    const eventWidth = groupWidth / group.length;
                    const eventLeft = leftOffset + (eventIndex * eventWidth);

                    return (
                      <div
                        key={event.id}
                        onClick={(e) => handleEventClick(e, event)}
                        className="absolute text-xs p-1 rounded cursor-pointer hover:opacity-90 transition-opacity overflow-hidden"
                        style={{
                          top: `${top}px`,
                          left: `${eventLeft}%`,
                          width: `${eventWidth}%`,
                          height: `${height}px`,
                          backgroundColor: event.color || '#3b82f6',
                          color: '#ffffff',
                          minHeight: '20px',
                        }}
                        title={`${event.title} - ${formatTime(eventStart)} - ${formatTime(eventEnd)}`}
                      >
                        <div className="font-medium truncate">{event.title}</div>
                        <div className="truncate opacity-90">{formatTime(eventStart)} - {formatTime(eventEnd)}</div>
                      </div>
                    );
                  });
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

