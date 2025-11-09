# Calendar View Component

A production-grade, fully interactive Calendar View component built with React, TypeScript, and Tailwind CSS. This component provides month and week views with comprehensive event management capabilities.

## Live Storybook

[Deploy your Storybook and add the link here]

## Installation

```bash
# Install dependencies
npm install

# Run Storybook
npm run storybook

# Run development server
npm run dev

# Build for production
npm run build
```

## Architecture

The Calendar View component is built with a modular architecture:

- **Components**: Reusable UI components organized by feature
  - `CalendarView`: Main component that orchestrates the calendar
  - `MonthView`: Month grid view with 42 cells
  - `WeekView`: Week view with time slots (00:00 - 23:00)
  - `CalendarCell`: Individual day cell in month view
  - `EventModal`: Modal for creating/editing events
  - **Primitives**: Base UI components (Button, Modal, Select)

- **Hooks**: Custom React hooks for state management
  - `useCalendar`: Manages calendar navigation and view state
  - `useEventManager`: Manages event modal state and operations

- **Utils**: Utility functions for date and event operations
  - `date.utils.ts`: Date manipulation and formatting
  - `event.utils.ts`: Event filtering, validation, and grouping

## Features

### Core Features

- [x] **Month View**: 42-cell grid showing complete weeks
- [x] **Week View**: 7-day layout with hourly time slots
- [x] **Event Management**: Create, edit, and delete events
- [x] **Event Modal**: Comprehensive form with validation
- [x] **Navigation**: Previous/Next month/week, Today button
- [x] **View Toggle**: Switch between month and week views
- [x] **Responsive Design**: Works on mobile, tablet, and desktop
- [x] **Keyboard Accessibility**: Full keyboard navigation support
- [x] **ARIA Labels**: Proper accessibility attributes
- [x] **Event Colors**: 8 preset colors for event categorization
- [x] **Event Categories**: Optional categorization system
- [x] **Overlapping Events**: Smart positioning in week view

### Month View Features

- Displays 42 cells (6 weeks × 7 days)
- Grayed out dates from adjacent months
- Highlights current day
- Shows up to 3 events per day with "+X more" indicator
- Click day cell to create event
- Click event to edit

### Week View Features

- 7-day horizontal layout
- Time slots from 00:00 to 23:00
- Events positioned based on start time
- Event height proportional to duration
- Handles overlapping events with side-by-side positioning
- Click time slot to create event at that time

### Event Management

- **Create Event**: Click empty cell or time slot
- **Edit Event**: Click existing event
- **Delete Event**: Delete button in edit modal
- **Validation**: Required fields, date validation, character limits
- **Color Picker**: 8 preset colors
- **Category Select**: Optional category dropdown

## Storybook Stories

The component includes the following Storybook stories:

1. **Default**: Current month with sample events
2. **Empty**: Empty calendar state
3. **Week View**: Week view with time slots
4. **With Many Events**: Calendar with 20+ events
5. **Interactive Demo**: Fully functional with controls
6. **Mobile View**: Responsive layout demonstration
7. **Accessibility**: Keyboard navigation demonstration

## Technologies

- **React** ^18.0.0 - Component framework
- **TypeScript** ^5.0.0 - Type-safe development
- **Tailwind CSS** ^3.0.0 - Utility-first styling
- **Vite** - Build tooling
- **Storybook** ^7.6.3 - Component documentation
- **date-fns** ^2.30.0 - Date manipulation
- **clsx** ^2.0.0 - Conditional class management

## Component API

### CalendarView Props

```typescript
interface CalendarViewProps {
  events: CalendarEvent[];
  onEventAdd: (event: CalendarEvent) => void;
  onEventUpdate: (id: string, updates: Partial<CalendarEvent>) => void;
  onEventDelete: (id: string) => void;
  initialView?: 'month' | 'week';
  initialDate?: Date;
}
```

### CalendarEvent Interface

```typescript
interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  color?: string;
  category?: string;
}
```

## Usage Example

```typescript
import { CalendarView } from './components/Calendar/CalendarView';
import { CalendarEvent } from './components/Calendar/CalendarView.types';

function App() {
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: 'evt-1',
      title: 'Team Standup',
      startDate: new Date(2024, 0, 15, 9, 0),
      endDate: new Date(2024, 0, 15, 9, 30),
      color: '#3b82f6',
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
    <CalendarView
      events={events}
      onEventAdd={handleEventAdd}
      onEventUpdate={handleEventUpdate}
      onEventDelete={handleEventDelete}
    />
  );
}
```

## Keyboard Navigation

- **Tab**: Move focus between interactive elements
- **Shift + Tab**: Move focus backwards
- **Enter / Space**: Activate focused element
- **Escape**: Close modal or cancel action
- **Arrow Keys**: Navigate grid cells (future enhancement)
- **Home / End**: Jump to first/last item (future enhancement)

## Accessibility

The component meets WCAG 2.1 AA standards:

- All interactive elements are keyboard accessible
- Proper ARIA labels and roles
- Focus indicators are clearly visible
- Color contrast meets 4.5:1 ratio
- Text is resizable up to 200% without loss of functionality

## Performance

- Uses React.memo() for expensive components
- Memoized calculations with useMemo
- Optimized event filtering and grouping
- Efficient date calculations

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Project Structure

```
calendar-component/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
├── .storybook/
│   ├── main.ts
│   └── preview.ts
└── src/
    ├── components/
    │   ├── Calendar/
    │   │   ├── CalendarView.tsx
    │   │   ├── CalendarView.stories.tsx
    │   │   ├── CalendarView.types.ts
    │   │   ├── MonthView.tsx
    │   │   ├── WeekView.tsx
    │   │   ├── CalendarCell.tsx
    │   │   └── EventModal.tsx
    │   └── primitives/
    │       ├── Button.tsx
    │       ├── Modal.tsx
    │       └── Select.tsx
    ├── hooks/
    │   ├── useCalendar.ts
    │   └── useEventManager.ts
    ├── utils/
    │   ├── date.utils.ts
    │   └── event.utils.ts
    └── styles/
        └── globals.css
```

## Development

### Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run Storybook
npm run storybook

# Build for production
npm run build
```

### Code Quality

- TypeScript strict mode enabled
- ESLint for code linting
- Prettier for code formatting (recommended)
- Comprehensive type definitions
- No `any` types used

## Known Limitations

1. **Drag and Drop**: Not yet implemented (future enhancement)
2. **Multi-select**: Not yet implemented (future enhancement)
3. **Recurring Events**: Not supported
4. **Event Reminders**: Not supported
5. **Local Storage**: Events are not persisted (can be added via props handlers)

## Future Enhancements

- [ ] Drag and drop events
- [ ] Multi-select date ranges
- [ ] Recurring events
- [ ] Event reminders
- [ ] LocalStorage persistence
- [ ] Dark mode
- [ ] Export/Import events
- [ ] Event search and filter
- [ ] Print view

## License

This project is part of a hiring assignment. All code remains the intellectual property of the developer.

## Contact

[Your email]

