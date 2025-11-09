import React, { useCallback, useMemo } from 'react';
import { CalendarViewProps } from './CalendarView.types';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';
import { EventModal } from './EventModal';
import { useCalendar } from '@/hooks/useCalendar';
import { useEventManager } from '@/hooks/useEventManager';
import { getMonthName, getYear } from '@/utils/date.utils';
import { Button } from '@/components/primitives/Button';

export const CalendarView: React.FC<CalendarViewProps> = ({
  events,
  onEventAdd,
  onEventUpdate,
  onEventDelete,
  initialView = 'month',
  initialDate = new Date(),
}) => {
  const calendar = useCalendar(initialDate, initialView);
  const eventManager = useEventManager(events, onEventAdd, onEventUpdate, onEventDelete);

  const handleDateClick = useCallback((date: Date) => {
    calendar.setSelectedDate(date);
    eventManager.openCreateModal(date);
  }, [calendar, eventManager]);

  const handleEventClick = useCallback((event: import('./CalendarView.types').CalendarEvent) => {
    eventManager.openEditModal(event);
  }, [eventManager]);

  const handleTimeSlotClick = useCallback((date: Date, time: Date) => {
    calendar.setSelectedDate(date);
    eventManager.openCreateModal(time);
  }, [calendar, eventManager]);

  const handleNavigation = useCallback((direction: 'prev' | 'next') => {
    if (calendar.view === 'month') {
      if (direction === 'prev') {
        calendar.goToPreviousMonth();
      } else {
        calendar.goToNextMonth();
      }
    } else {
      if (direction === 'prev') {
        calendar.goToPreviousWeek();
      } else {
        calendar.goToNextWeek();
      }
    }
  }, [calendar]);

  const monthYearDisplay = useMemo(() => {
    return `${getMonthName(calendar.currentDate)} ${getYear(calendar.currentDate)}`;
  }, [calendar.currentDate]);

  const handleViewToggle = useCallback((view: 'month' | 'week') => {
    calendar.setView(view);
  }, [calendar]);

  return (
    <div className="w-full h-full flex flex-col bg-white rounded-lg shadow-card">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold text-neutral-900">{monthYearDisplay}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('prev')}
              aria-label={`Previous ${calendar.view}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={calendar.goToToday}
              aria-label="Go to today"
            >
              Today
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleNavigation('next')}
              aria-label={`Next ${calendar.view}`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={calendar.view === 'month' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleViewToggle('month')}
            aria-label="Switch to month view"
          >
            Month
          </Button>
          <Button
            variant={calendar.view === 'week' ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => handleViewToggle('week')}
            aria-label="Switch to week view"
          >
            Week
          </Button>
        </div>
      </div>

      {/* Calendar Content */}
      <div className="flex-1 overflow-auto p-4">
        {calendar.view === 'month' ? (
          <MonthView
            currentDate={calendar.currentDate}
            events={events}
            selectedDate={calendar.selectedDate}
            onDateClick={handleDateClick}
            onEventClick={handleEventClick}
          />
        ) : (
          <WeekView
            currentDate={calendar.currentDate}
            events={events}
            onEventClick={handleEventClick}
            onTimeSlotClick={handleTimeSlotClick}
          />
        )}
      </div>

      {/* Event Modal */}
      <EventModal
        isOpen={eventManager.isModalOpen}
        onClose={eventManager.closeModal}
        event={eventManager.editingEvent}
        initialDate={eventManager.selectedDate || undefined}
        onSave={eventManager.addEvent}
        onUpdate={eventManager.updateEvent}
        onDelete={eventManager.deleteEvent}
      />
    </div>
  );
};

