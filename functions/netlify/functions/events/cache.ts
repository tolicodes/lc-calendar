import { createClient } from 'redis';
import { redisToken } from '../../../../config/credentials';
import { eventbriteOrganizerId } from '../../../../config/config';
import { extractEventData } from './extractEvent';
import { fetchEvents } from './fetchEvents';

const EVENTS_CACHE_KEY = 'EVENTS_CACHE_KEY';
const EVENTS_LAST_FETCH_KEY = 'EVENTS_LAST_FETCH_KEY';

const client = createClient({
    password: redisToken,
    socket: {
        host: 'redis-19840.c284.us-east1-2.gce.cloud.redislabs.com',
        port: 19840
    }
});

client.on('error', (err) => console.log('Redis Client Error', err));

async function isStale() {
    const lastFetchTimeStr = await client.get(EVENTS_LAST_FETCH_KEY);
    const currentTime = Date.now();

    return !(lastFetchTimeStr && currentTime - parseInt(lastFetchTimeStr) < 900000); // 15 minutes = 900000 milliseconds
}

export async function fetchFromCache(): Promise<any> {
    try {
        await client.connect();
        const data = await client.get(EVENTS_CACHE_KEY);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error('Fetching from cache error:', error);
        throw error;
    }
}

export async function fetchToCache() {
    await client.connect();

    if (await isStale()) {
        try {
            const events = await fetchEvents(eventbriteOrganizerId);
            const extractedData = await extractEventData(events);
            const currentTime = Date.now();

            await client.set(EVENTS_CACHE_KEY, JSON.stringify(extractedData), {
                EX: 60 * 15 // Set data to expire in 15 minutes
            });
            await client.set(EVENTS_LAST_FETCH_KEY, currentTime.toString());

            return extractedData;
        } catch (error) {
            console.error('Writing to cache error:', error);
            throw error;
        }
    }
}
