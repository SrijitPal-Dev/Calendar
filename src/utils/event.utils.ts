import { CalendarEvent } from '@/components/Calendar/CalendarView.types';
import { isSameDayDate, eventsOverlap } from './date.utils';

/**
 * Gets events for a specific date
 */
export const getEventsForDate = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventEnd = new Date(event.endDate);
    const checkDate = new Date(date);
    
    // Check if the event spans the date
    return (
      isSameDayDate(eventStart, checkDate) ||
      isSameDayDate(eventEnd, checkDate) ||
      (eventStart <= checkDate && eventEnd >= checkDate)
    );
  });
};

/**
 * Gets events for a specific day in week view
 */
export const getEventsForDay = (events: CalendarEvent[], date: Date): CalendarEvent[] => {
  return events.filter(event => {
    const eventStart = new Date(event.startDate);
    const eventStartDate = new Date(eventStart.getFullYear(), eventStart.getMonth(), eventStart.getDate());
    const checkDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    
    return isSameDayDate(eventStartDate, checkDate);
  });
};

/**
 * Groups overlapping events for week view layout
 */
export const groupOverlappingEvents = (events: CalendarEvent[]): CalendarEvent[][] => {
  const groups: CalendarEvent[][] = [];
  const processed = new Set<string>();
  
  events.forEach(event => {
    if (processed.has(event.id)) return;
    
    const group: CalendarEvent[] = [event];
    processed.add(event.id);
    
    events.forEach(otherEvent => {
      if (processed.has(otherEvent.id)) return;
      
      // Check if this event overlaps with any event in the current group
      const overlaps = group.some(groupEvent => 
        eventsOverlap(
          { startDate: new Date(groupEvent.startDate), endDate: new Date(groupEvent.endDate) },
          { startDate: new Date(otherEvent.startDate), endDate: new Date(otherEvent.endDate) }
        )
      );
      
      if (overlaps) {
        group.push(otherEvent);
        processed.add(otherEvent.id);
      }
    });
    
    groups.push(group);
  });
  
  return groups;
};

/**
 * Sorts events by start time
 */
export const sortEventsByStartTime = (events: CalendarEvent[]): CalendarEvent[] => {
  return [...events].sort((a, b) => {
    const aStart = new Date(a.startDate).getTime();
    const bStart = new Date(b.startDate).getTime();
    return aStart - bStart;
  });
};

/**
 * Validates an event
 */
export const validateEvent = (event: Partial<CalendarEvent>): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!event.title || event.title.trim().length === 0) {
    errors.push('Title is required');
  }
  
  if (event.title && event.title.length > 100) {
    errors.push('Title must be 100 characters or less');
  }
  
  if (event.description && event.description.length > 500) {
    errors.push('Description must be 500 characters or less');
  }
  
  if (!event.startDate) {
    errors.push('Start date is required');
  }
  
  if (!event.endDate) {
    errors.push('End date is required');
  }
  
  if (event.startDate && event.endDate) {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    
    if (end <= start) {
      errors.push('End date must be after start date');
    }
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Creates a new event with default values
 */
export const createEmptyEvent = (date?: Date): Omit<CalendarEvent, 'id'> => {
  const baseDate = date || new Date();
  const startDate = new Date(baseDate);
  startDate.setHours(9, 0, 0, 0);
  
  const endDate = new Date(startDate);
  endDate.setHours(10, 0, 0, 0);
  
  return {
    title: '',
    description: '',
    startDate,
    endDate,
    color: '#3b82f6',
    category: '',
  };
};

/**
 * Generates a unique event ID
 */
export const generateEventId = (): string => {
  return `evt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

