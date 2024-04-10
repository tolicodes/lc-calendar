
  
  export interface EventStartEnd {
    local: string;
  }
  
  export  interface VenueAddress {
    address_1: string;
    city: string;
    postal_code: string;
    region: string;
    country: string;
  }
  

  
  export interface VenueDetails {
    name: string;
    address: VenueAddress;
  }

  export type Location = 'Dumbo' | 'SoHo' | 'Prospect Park' | 'Unknown Location';

  
  export interface ExtractedEvent {
    eventName: string;
    eventType: 'Study Pod' | 'Big Meet';
    url: string;
    start: string;
    end: string;
    venueName: string;
    venueAddress: string;
    location: Location;
    dayOfWeek: string;  
    shortTime: string;   
    waitlist: boolean;
  }

  
  export interface EventStartEnd {
    local: string;
  }
  
  export interface EventName {
    text: string;
    html: string;
  }
  
  export interface Event {
    name: EventName;
    url: string;
    start: EventStartEnd;
    end: EventStartEnd;
    status: string;
    venue_id: string;

    ticket_availability: {
      has_available_tickets: boolean;
    }
  }
  