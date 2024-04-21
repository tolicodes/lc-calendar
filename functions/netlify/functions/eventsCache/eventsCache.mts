import { Config, Context } from "@netlify/functions";
import { fetchFromCache } from "../events/cache";
export default async (req: Request, context: Context) => {
    const data = await fetchFromCache()

    return new Response(JSON.stringify(data));
};

export const config: Config = {
    path: "/cache"
};

