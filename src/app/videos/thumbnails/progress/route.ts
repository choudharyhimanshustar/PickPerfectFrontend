import { NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  console.log("GET handler called");
  const { search } = new URL(req.url);
  const targetUrl = `${BACKEND_URL}/videos/thumbnails/progress${search}`;

  const backendRes = await fetch(targetUrl, {
    headers: {
      cookie: req.headers.get("cookie") ?? "",
      accept: "text/event-stream",
    },
  });

  return new Response(backendRes.body, {
    status: backendRes.status,
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache",
      "x-accel-buffering": "no",
      connection: "keep-alive",
    },
  });
}
