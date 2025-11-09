import { useState, useCallback } from 'react';
import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { createEmptyEvent, generateEventId, validateEvent } from '@/utils/event.utils';

export interface EventManagerState {
  isModalOpen: boolean;
  editingEvent: CalendarEvent | null;
  selectedDate: Date | null;
}

export const useEventManager = (
  events: CalendarEvent[],
  onEventAdd?: (event: CalendarEvent) => void,
  onEventUpdate?: (id: string, updates: Partial<CalendarEvent>) => void,
  onEventDelete?: (id: string) => void
) => {
  const [state, setState] = useState<EventManagerState>({
    isModalOpen: false,
    editingEvent: null,
    selectedDate: null,
  });

  const openCreateModal = useCallback((date?: Date) => {
    const emptyEvent = createEmptyEvent(date);
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      editingEvent: null,
      selectedDate: date || null,
    }));
    return emptyEvent;
  }, []);

  const openEditModal = useCallback((event: CalendarEvent) => {
    setState(prev => ({
      ...prev,
      isModalOpen: true,
      editingEvent: event,
      selectedDate: null,
    }));
  }, []);

  const closeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      editingEvent: null,
      selectedDate: null,
    }));
  }, []);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    const validation = validateEvent(eventData);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    const newEvent: CalendarEvent = {
      ...eventData,
      id: generateEventId(),
    };

    setState(prev => ({
      ...prev,
      isModalOpen: false,
      editingEvent: null,
      selectedDate: null,
    }));

    onEventAdd?.(newEvent);
    return { success: true, errors: [] };
  }, [onEventAdd]);

  const updateEvent = useCallback((id: string, updates: Partial<CalendarEvent>) => {
    const existingEvent = events.find(e => e.id === id);
    if (!existingEvent) {
      return { success: false, errors: ['Event not found'] };
    }

    const updatedEvent = { ...existingEvent, ...updates };
    const validation = validateEvent(updatedEvent);
    if (!validation.valid) {
      return { success: false, errors: validation.errors };
    }

    setState(prev => ({
      ...prev,
      isModalOpen: false,
      editingEvent: null,
    }));

    onEventUpdate?.(id, updates);
    return { success: true, errors: [] };
  }, [events, onEventUpdate]);

  const deleteEvent = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      isModalOpen: false,
      editingEvent: null,
    }));

    onEventDelete?.(id);
  }, [onEventDelete]);

  return {
    isModalOpen: state.isModalOpen,
    editingEvent: state.editingEvent,
    selectedDate: state.selectedDate,
    openCreateModal,
    openEditModal,
    closeModal,
    addEvent,
    updateEvent,
    deleteEvent,
  };
};

