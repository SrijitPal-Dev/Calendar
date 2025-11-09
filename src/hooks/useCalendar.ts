import { useState, useCallback } from 'react';
import { CalendarView } from '@/components/Calendar/CalendarView.types';
import { getNextMonth, getPreviousMonth, getNextWeek, getPreviousWeek } from '@/utils/date.utils';

export interface CalendarState {
  currentDate: Date;
  view: CalendarView;
  selectedDate: Date | null;
}

export const useCalendar = (initialDate: Date = new Date(), initialView: CalendarView = 'month') => {
  const [state, setState] = useState<CalendarState>({
    currentDate: initialDate,
    view: initialView,
    selectedDate: null,
  });

  const goToNextMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getNextMonth(prev.currentDate),
    }));
  }, []);

  const goToPreviousMonth = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getPreviousMonth(prev.currentDate),
    }));
  }, []);

  const goToNextWeek = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getNextWeek(prev.currentDate),
    }));
  }, []);

  const goToPreviousWeek = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: getPreviousWeek(prev.currentDate),
    }));
  }, []);

  const goToToday = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentDate: new Date(),
    }));
  }, []);

  const setView = useCallback((view: CalendarView) => {
    setState(prev => ({
      ...prev,
      view,
    }));
  }, []);

  const setSelectedDate = useCallback((date: Date | null) => {
    setState(prev => ({
      ...prev,
      selectedDate: date,
    }));
  }, []);

  const setCurrentDate = useCallback((date: Date) => {
    setState(prev => ({
      ...prev,
      currentDate: date,
    }));
  }, []);

  return {
    ...state,
    goToNextMonth,
    goToPreviousMonth,
    goToNextWeek,
    goToPreviousWeek,
    goToToday,
    setView,
    setSelectedDate,
    setCurrentDate,
  };
};

