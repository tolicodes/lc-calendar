// netlify/functions/src/hello.ts
export const handler = async function(event: any, context: any) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from Netlify Functions and TypeScript!" })
    };
};
