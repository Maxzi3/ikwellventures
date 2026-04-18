// app/api/debug/route.ts
export async function GET() {
  return Response.json({
    uri: process.env.MONGODB_URI ? "SET" : "NOT SET",
    preview: process.env.MONGODB_URI?.slice(0, 30) + "...",
  });
}
