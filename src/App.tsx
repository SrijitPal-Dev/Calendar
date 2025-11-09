import { useState } from 'react';
import { CalendarView } from './components/Calendar/CalendarView';
import { CalendarEvent } from './components/Calendar/CalendarView.types';

function App() {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt-1',
      title: 'Team Standup',
      description: 'Daily sync with the team',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
      color: '#3b82f6',
      category: 'Meeting',
    },
    {
      id: 'evt-2',
      title: 'Design Review',
      description: 'Review new component designs',
      startDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 0),
      endDate: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 15, 30),
      color: '#10b981',
      category: 'Design',
    },
  ]);

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
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-7xl mx-auto h-[calc(100vh-2rem)]">
        <CalendarView
          events={events}
          onEventAdd={handleEventAdd}
          onEventUpdate={handleEventUpdate}
          onEventDelete={handleEventDelete}
        />
      </div>
    </div>
  );
}

export default App;

