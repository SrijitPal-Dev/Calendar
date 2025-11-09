import React, { useState, useEffect, useCallback } from 'react';
import { CalendarEvent } from './CalendarView.types';
import { Modal } from '@/components/primitives/Modal';
import { Button } from '@/components/primitives/Button';
import { Select } from '@/components/primitives/Select';
import { format, formatTime } from '@/utils/date.utils';

export interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  event: CalendarEvent | null;
  initialDate?: Date;
  onSave: (event: Omit<CalendarEvent, 'id'>) => { success: boolean; errors: string[] };
  onUpdate?: (id: string, updates: Partial<CalendarEvent>) => { success: boolean; errors: string[] };
  onDelete?: (id: string) => void;
}

const COLOR_OPTIONS = [
  { value: '#3b82f6', label: 'Blue' },
  { value: '#10b981', label: 'Green' },
  { value: '#f59e0b', label: 'Orange' },
  { value: '#ef4444', label: 'Red' },
  { value: '#8b5cf6', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#84cc16', label: 'Lime' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'No category' },
  { value: 'Meeting', label: 'Meeting' },
  { value: 'Work', label: 'Work' },
  { value: 'Personal', label: 'Personal' },
  { value: 'Design', label: 'Design' },
  { value: 'Development', label: 'Development' },
];

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  event,
  initialDate,
  onSave,
  onUpdate,
  onDelete,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endDate, setEndDate] = useState('');
  const [endTime, setEndTime] = useState('');
  const [color, setColor] = useState('#3b82f6');
  const [category, setCategory] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      if (event) {
        // Editing existing event
        setTitle(event.title);
        setDescription(event.description || '');
        setStartDate(format(new Date(event.startDate), 'yyyy-MM-dd'));
        setStartTime(formatTime(new Date(event.startDate)));
        setEndDate(format(new Date(event.endDate), 'yyyy-MM-dd'));
        setEndTime(formatTime(new Date(event.endDate)));
        setColor(event.color || '#3b82f6');
        setCategory(event.category || '');
      } else if (initialDate) {
        // Creating new event with initial date
        const date = new Date(initialDate);
        setStartDate(format(date, 'yyyy-MM-dd'));
        setEndDate(format(date, 'yyyy-MM-dd'));
        // Use the time from initialDate if it has one, otherwise default to 9:00
        const hasTime = date.getHours() !== 0 || date.getMinutes() !== 0;
        if (hasTime) {
          setStartTime(formatTime(date));
          const end = new Date(date);
          end.setHours(end.getHours() + 1);
          setEndTime(formatTime(end));
        } else {
          setStartTime('09:00');
          setEndTime('10:00');
        }
        setTitle('');
        setDescription('');
        setColor('#3b82f6');
        setCategory('');
      } else {
        // Creating new event without initial date
        const now = new Date();
        setStartDate(format(now, 'yyyy-MM-dd'));
        setEndDate(format(now, 'yyyy-MM-dd'));
        setStartTime(formatTime(now));
        const end = new Date(now);
        end.setHours(end.getHours() + 1);
        setEndTime(formatTime(end));
        setTitle('');
        setDescription('');
        setColor('#3b82f6');
        setCategory('');
      }
      setErrors([]);
    }
  }, [isOpen, event, initialDate]);

  const handleSave = useCallback(() => {
    const startDateTime = new Date(`${startDate}T${startTime}`);
    const endDateTime = new Date(`${endDate}T${endTime}`);

    const eventData: Omit<CalendarEvent, 'id'> = {
      title: title.trim(),
      description: description.trim(),
      startDate: startDateTime,
      endDate: endDateTime,
      color,
      category: category || undefined,
    };

    if (event && onUpdate) {
      const result = onUpdate(event.id, eventData);
      if (result.success) {
        onClose();
      } else {
        setErrors(result.errors);
      }
    } else {
      const result = onSave(eventData);
      if (result.success) {
        onClose();
      } else {
        setErrors(result.errors);
      }
    }
  }, [title, description, startDate, startTime, endDate, endTime, color, category, event, onSave, onUpdate, onClose]);

  const handleDelete = useCallback(() => {
    if (event && onDelete && window.confirm('Are you sure you want to delete this event?')) {
      onDelete(event.id);
      onClose();
    }
  }, [event, onDelete, onClose]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={event ? 'Edit Event' : 'Create Event'}
      description={event ? 'Update event details below' : 'Fill in the event details below'}
      size="md"
    >
      <div className="space-y-4">
        {/* Errors */}
        {errors.length > 0 && (
          <div className="p-3 bg-error-50 border border-error-200 rounded-lg">
            <ul className="list-disc list-inside text-sm text-error-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="event-title" className="block text-sm font-medium text-neutral-700 mb-1">
            Title <span className="text-error-500">*</span>
          </label>
          <input
            id="event-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event title"
            aria-required="true"
          />
          <div className="text-xs text-neutral-500 mt-1">{title.length}/100</div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="event-description" className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            id="event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={500}
            rows={3}
            className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Event description"
          />
          <div className="text-xs text-neutral-500 mt-1">{description.length}/500</div>
        </div>

        {/* Start Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-start-date" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Date <span className="text-error-500">*</span>
            </label>
            <input
              id="event-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="event-start-time" className="block text-sm font-medium text-neutral-700 mb-1">
              Start Time <span className="text-error-500">*</span>
            </label>
            <input
              id="event-start-time"
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-required="true"
            />
          </div>
        </div>

        {/* End Date/Time */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="event-end-date" className="block text-sm font-medium text-neutral-700 mb-1">
              End Date <span className="text-error-500">*</span>
            </label>
            <input
              id="event-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-required="true"
            />
          </div>
          <div>
            <label htmlFor="event-end-time" className="block text-sm font-medium text-neutral-700 mb-1">
              End Time <span className="text-error-500">*</span>
            </label>
            <input
              id="event-end-time"
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              aria-required="true"
            />
          </div>
        </div>

        {/* Color */}
        <div>
          <label htmlFor="event-color" className="block text-sm font-medium text-neutral-700 mb-1">
            Color
          </label>
          <Select
            options={COLOR_OPTIONS}
            value={color}
            onChange={setColor}
            aria-label="Event color"
          />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="event-category" className="block text-sm font-medium text-neutral-700 mb-1">
            Category
          </label>
          <Select
            options={CATEGORY_OPTIONS}
            value={category}
            onChange={setCategory}
            aria-label="Event category"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
          <div>
            {event && onDelete && (
              <Button
                variant="danger"
                size="md"
                onClick={handleDelete}
              >
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="md"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
            >
              {event ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

