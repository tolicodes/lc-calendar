import { Config, Context } from "@netlify/functions";
import { fetchToCache } from "./cache";


export default async (req: Request, context: Context) => {
  try {
    const data = await fetchToCache();
    return new Response(JSON.stringify(data))
  }  catch (error) {
    console.log(error)
    return new Response("An error occurred while fetching data", { status: 200 })
  }

};

export const config: Config = {
  path: "/events"
};