// App.tsx
import React from 'react';
import Calendar from './Calendar';
import { EventData } from './types';

const App: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth();

  // Sample event data, this should be fetched from a server or static file in a real app
  const events: EventData[] = [
    {
      dateStart: '2024-04-15T19:00:00',
      dateEnd: '2024-04-15T20:00:00',
      location: 'SoHo',
      url: 'https://example.com/event1'
    },
    {
      dateStart: '2024-04-20T19:00:00',
      dateEnd: '2024-04-20T20:00:00',
      location: 'Prospect Park',
      url: 'https://example.com/event2'
    },
    {
      dateStart: '2024-04-25T19:00:00',
      dateEnd: '2024-04-25T20:00:00',
      location: 'Big Meet',
      url: 'https://example.com/event3'
    }
  ];

  return (
    <div>
      <Calendar year={currentYear} month={currentMonth} events={events} />
    </div>
  );
};

export default App;
