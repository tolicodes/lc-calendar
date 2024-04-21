// types.ts
export interface EventData {
    dateStart: string;
    dateEnd: string;
    location: "SoHo" | "Prospect Park" | "Big Meet";
    url: string;
  }
  
  export interface DayProps {
    date: Date;
    events: EventData[];
    onDayClick: (url: string) => void;
  }
  
  export interface CalendarProps {
    year: number;
    month: number;
    events: EventData[];
  }
  