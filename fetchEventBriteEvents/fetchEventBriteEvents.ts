import { extractEventData } from './extractEvent';
import { fetchEvents } from './fetchFromEventbrite';
import { eventbriteOrganizerId } from './config';


import { createClient } from 'redis';

const EVENTS_CACHE_KEY: string = 'EVENTS_CACHE_KEY';
const EVENTS_LAST_FETCH_KEY: string = 'EVENTS_LAST_FETCH_KEY';

const client = createClient({
    password: 'zjcs24SrBaCujmsjO6L1MLgvHqY1blvb',
    socket: {
        host: 'redis-19840.c284.us-east1-2.gce.cloud.redislabs.com',
        port: 19840
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

// Types for our cache data to ensure type safety
interface CacheData {
    lastFetchKey: string;
    cacheKey: string;
}

async function fetchWithCache(): Promise<any> {
    await client.connect();
    
    try {
        const lastFetchTimeStr: string | null = await client.get(EVENTS_LAST_FETCH_KEY);
        const currentTime: number = Date.now();
        
        if (lastFetchTimeStr && currentTime - parseInt(lastFetchTimeStr) < 900000) { // 15 minutes = 900000 milliseconds
            // Fetch from cache
            const cachedDataStr: string | null = await client.get(EVENTS_CACHE_KEY);
            if (cachedDataStr) {
                return JSON.parse(cachedDataStr); // Return cached data if available
            }
        }
        
        const events = await fetchEvents(eventbriteOrganizerId);
        const extractedData = await extractEventData(events);

        // Update cache
        await client.set(EVENTS_CACHE_KEY, JSON.stringify(extractedData), {
            EX: 60 * 15, // Set data to expire in 15 minutes
        });
        await client.set(EVENTS_LAST_FETCH_KEY, currentTime.toString()); // Update the last fetch time
        
        return extractedData;
    } catch (error) {
        console.error('Error in fetchWithCache:', error);
        throw error; // Rethrow or handle as needed
    } finally {
        await client.disconnect();
    }
}

export const handler = async() => {
    try {
        const data = await fetchWithCache()
        return {
            statusCode: 200,
            body: JSON.stringify(data)
        };
    } catch {
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Internal Server Error' })
        };
    }
};


