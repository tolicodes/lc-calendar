import { fetchVenueDetails } from "./fetchFromEventbrite";
import { ExtractedEvent, Event, Location } from "./types";

function filterLiveEvents(events: Event[]): Event[] {
  console.log(events);
  return events.filter(event => event.status === 'live');
}

function fuzzyMatchLocation(eventName: string): Location {
  const locations = ['Dumbo', 'SoHo', 'Prospect Park'] as Location[];
  const eventNameLowerCase = eventName.toLowerCase();

  for (const location of locations) {
    if (eventNameLowerCase.includes(location.toLowerCase())) {
      return location; // Return the original case from the locations array
    }
  }
  return "Unknown Location"; // Default case if no match is found
}


export async function extractEventData(events: Event[]): Promise<ExtractedEvent[]> {
  const liveEvents = filterLiveEvents(events);
  const extractedEventsPromises = liveEvents.map(async (event) => {
    const venue = await fetchVenueDetails(event.venue_id);
    const eventType = event.name.text.toLowerCase().includes('big meet') ? 'Big Meet' : 'Study Pod';

    // Extracting location from eventName
    const location = fuzzyMatchLocation(event.name.text); // Use fuzzy match to extract location

    const venueAddress = `${venue.address.address_1}, ${venue.address.city}, ${venue.address.region}, ${venue.address.postal_code}, ${venue.address.country}`;

    // Parse the start and end times to Date objects
    const startTime = new Date(event.start.local);
    const endTime = new Date(event.end.local);

    // Extract day of the week
    const dayOfWeek = startTime.toLocaleDateString('en-US', { weekday: 'long' });

    function formatTimeRangeCustom(startTime: Date, endTime: Date): string {
      const formatHour = (date: Date, showAM: boolean) => {
        let hour = date.getHours();
        const amPm = hour >= 12 ? 'PM' : 'AM';
        hour = hour % 12;
        hour = hour === 0 ? 12 : hour; // Convert 0 to 12 for 12AM
        return `${hour}${showAM ? amPm: ''}`;
      };
    
      const formattedStartTime = formatHour(startTime, false);
      const formattedEndTime = formatHour(endTime, true);
    
      return `${formattedStartTime}-${formattedEndTime}`;
    }

    const shortTime = formatTimeRangeCustom(startTime, endTime);

    return {
      eventName: event.name.text,
      eventType: eventType as 'Study Pod' | 'Big Meet',
      location,
      url: event.url,
      start: event.start.local,
      end: event.end.local,
      venueName: venue.name,
      venueAddress,
      dayOfWeek,
      shortTime,
      waitlist: !event.ticket_availability.has_available_tickets
    };
  });

  return Promise.all(extractedEventsPromises);
}


