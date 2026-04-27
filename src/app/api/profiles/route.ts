import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  return proxyToBackend(request, "/api/profiles");
}

export async function POST(request: NextRequest) {
  return proxyToBackend(request, "/api/profiles");
}
