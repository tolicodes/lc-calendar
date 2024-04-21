

import { eventbriteToken } from '../../../../config/credentials';
import { VenueDetails, Event } from './types';

export async function fetchFromEventbrite<T>(endpoint: string): Promise<T> {
    const url = `https://www.eventbriteapi.com/v3/${endpoint}`;
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${eventbriteToken}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        const errorBody = await response.json();
        const errorMessage = errorBody.error_description || "Unknown error occurred";
        throw new Error(`Eventbrite API request failed: ${response.status} - ${errorMessage}`);
    }

    return response.json();
}


// Fetches venue details by venue ID
export async function fetchVenueDetails(venueId: string): Promise<VenueDetails> {
    return fetchFromEventbrite<VenueDetails>(`venues/${venueId}/`);
}

// Fetches events for a specific organizer
export async function fetchEvents(organizerId: string): Promise<Event[]> {
    const { events } = await fetchFromEventbrite<{ events: Event[] }>(`organizations/${organizerId}/events/?expand=ticket_availability`);

    return events;
}
