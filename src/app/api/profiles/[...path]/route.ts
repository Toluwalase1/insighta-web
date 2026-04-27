import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend";

export const runtime = "nodejs";

async function handle(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> | { path: string[] } },
) {
  const params = await Promise.resolve(context.params);
  return proxyToBackend(request, `/api/profiles/${params.path.join("/")}`);
}

export async function GET(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  return handle(request, context);
}

export async function POST(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  return handle(request, context);
}

export async function PUT(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  return handle(request, context);
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  return handle(request, context);
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  return handle(request, context);
}
