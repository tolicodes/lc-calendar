import { extractEventData } from "./extractEvent";
import { fetchEvents } from "./fetchFromEventbrite";
import {eventbriteOrganizerId} from './config';
import {writeFile} from 'fs/promises';


async function initializeEventProcessing(organizerId: string) {
  try {
      const events = await fetchEvents(organizerId);
      const extractedData = await extractEventData(events);

      await writeFile('events.json', JSON.stringify(extractedData));

      // console.log("Extracted Event Data:", extractedData);
  } catch (error) {
      console.error(`An error occurred during event processing: ${error}`);
  }
}

(async () => {
  initializeEventProcessing(eventbriteOrganizerId)
})();