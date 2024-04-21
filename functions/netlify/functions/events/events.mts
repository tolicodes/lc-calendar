import { Config, Context } from "@netlify/functions";
import { fetchToCache } from "./cache";


export default async (req: Request, context: Context) => {
  const data = await fetchToCache();

  return new Response(JSON.stringify(data))
};

export const config: Config = {
  path: "/events"
};