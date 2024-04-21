import React from 'react';
import Day, {locationColorMapping} from './Day';
import { CalendarProps } from './types';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;

type DayOfWeek = typeof daysOfWeek[number];


const locationDayMapping: Record<DayOfWeek, keyof typeof locationColorMapping> = {
  'Mon': '',
  'Tue': 'SoHo',
  'Wed': 'SoHo',
  'Thu': 'SoHo',
  'Fri': 'Prospect Park',
  'Sun': 'Big Meet',
  'Sat': ''
}

const Calendar: React.FC<CalendarProps> = ({ year, month, events }) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayWeekday = firstDayOfMonth.getDay();

  // Create an array representing each cell of the calendar grid (empty or with a day)
  const emptyDaysAtStart = Array(firstDayWeekday).fill(null);
  const daysOfMonth = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const calendarDays = [...emptyDaysAtStart, ...daysOfMonth];

  const rows = [];
  while (calendarDays.length) rows.push(calendarDays.splice(0, 7));

  const handleDayClick = (url: string) => {
    window.location.href = url;
  };

  return (
    <table style={{ width: '100%', tableLayout: 'fixed' }}>
      <thead>
        <tr>
          {daysOfWeek.map(day => (
            <th key={day} style={{ textAlign: 'center', padding: '10px', backgroundColor: 'lightgray' }}>
              {day}

              <div>
                {locationDayMapping[day]}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((week, index) => (
          <tr key={index}>
            {week.map((day, dayIndex) => (
              <td key={dayIndex} style={{ border: '1px solid black',  verticalAlign: 'top' }}>
                {day ? (
                  <Day
                    date={day}
                    events={events.filter(event => {
                      const eventDate = new Date(event.dateStart);
                      return eventDate.getDate() === day.getDate() &&
                             eventDate.getMonth() === day.getMonth() &&
                             eventDate.getFullYear() === day.getFullYear();
                    })}
                    onDayClick={handleDayClick}
                  />
                ) : null}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Calendar;
