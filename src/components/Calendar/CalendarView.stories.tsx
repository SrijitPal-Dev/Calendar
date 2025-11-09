import type { Meta, StoryObj } from '@storybook/react';
import { CalendarView } from './CalendarView';
import { CalendarEvent } from './CalendarView.types';
import { useState } from 'react';

const meta: Meta<typeof CalendarView> = {
  title: 'Components/CalendarView',
  component: CalendarView,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CalendarView>;

// Sample events data
const sampleEvents: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Team Standup',
    description: 'Daily sync with the team',
    startDate: new Date(2024, 0, 15, 9, 0),
    endDate: new Date(2024, 0, 15, 9, 30),
    color: '#3b82f6',
    category: 'Meeting',
  },
  {
    id: 'evt-2',
    title: 'Design Review',
    description: 'Review new component designs',
    startDate: new Date(2024, 0, 15, 14, 0),
    endDate: new Date(2024, 0, 15, 15, 30),
    color: '#10b981',
    category: 'Design',
  },
  {
    id: 'evt-3',
    title: 'Client Presentation',
    startDate: new Date(2024, 0, 16, 10, 0),
    endDate: new Date(2024, 0, 16, 11, 30),
    color: '#f59e0b',
    category: 'Meeting',
  },
  {
    id: 'evt-4',
    title: 'Development Sprint',
    description: 'Sprint planning and task assignment',
    startDate: new Date(2024, 0, 17, 9, 0),
    endDate: new Date(2024, 0, 17, 17, 0),
    color: '#8b5cf6',
    category: 'Work',
  },
];

// Generate many events for large dataset story
const generateManyEvents = (): CalendarEvent[] => {
  const events: CalendarEvent[] = [];
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
  const categories = ['Meeting', 'Work', 'Personal', 'Design', 'Development'];
  
  for (let i = 0; i < 25; i++) {
    const day = Math.floor(i / 5) + 1;
    const hour = 9 + (i % 8);
    events.push({
      id: `evt-large-${i}`,
      title: `Event ${i + 1}`,
      description: `Description for event ${i + 1}`,
      startDate: new Date(2024, 0, day, hour, 0),
      endDate: new Date(2024, 0, day, hour + 1, 0),
      color: colors[i % colors.length],
      category: categories[i % categories.length],
    });
  }
  
  return events;
};

// Interactive wrapper component
const InteractiveCalendar = (args: any) => {
  const [events, setEvents] = useState<CalendarEvent[]>(args.events || []);

  const handleEventAdd = (event: CalendarEvent) => {
    setEvents(prev => [...prev, event]);
  };

  const handleEventUpdate = (id: string, updates: Partial<CalendarEvent>) => {
    setEvents(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e))
    );
  };

  const handleEventDelete = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
  };

  return (
    <div style={{ height: '100vh', padding: '20px' }}>
      <CalendarView
        {...args}
        events={events}
        onEventAdd={handleEventAdd}
        onEventUpdate={handleEventUpdate}
        onEventDelete={handleEventDelete}
      />
    </div>
  );
};

export const Default: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: sampleEvents,
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
};

export const Empty: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: [],
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
};

export const WeekView: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: sampleEvents,
    initialView: 'week',
    initialDate: new Date(2024, 0, 15),
  },
};

export const WithManyEvents: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: generateManyEvents(),
    initialView: 'month',
    initialDate: new Date(2024, 0, 15),
  },
};

export const InteractiveDemo: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: sampleEvents,
    initialView: 'month',
    initialDate: new Date(),
  },
};

export const MobileView: Story = {
  render: (args) => (
    <div style={{ width: '375px', height: '667px', margin: '0 auto', border: '1px solid #ccc' }}>
      <InteractiveCalendar {...args} />
    </div>
  ),
  args: {
    events: sampleEvents,
    initialView: 'month',
    initialDate: new Date(),
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const Accessibility: Story = {
  render: (args) => <InteractiveCalendar {...args} />,
  args: {
    events: sampleEvents,
    initialView: 'month',
    initialDate: new Date(),
  },
  parameters: {
    docs: {
      description: {
        story: 'Use keyboard navigation: Tab to navigate, Enter/Space to select, Arrow keys to move between dates, Escape to close modals.',
      },
    },
  },
};

