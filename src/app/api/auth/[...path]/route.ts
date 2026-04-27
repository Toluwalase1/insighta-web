import { NextRequest } from "next/server";
import { proxyToBackend } from "@/lib/backend";

export const runtime = "nodejs";

function resolveAuthPath(segments: string[]) {
  if (segments[0] === "github" && segments[1] === "callback") {
    return "/auth/github/callback";
  }

  if (segments[0] === "github") {
    return "/auth/github";
  }

  if (segments[0] === "logout") {
    return "/auth/logout";
  }

  if (segments[0] === "refresh") {
    return "/auth/refresh";
  }

  if (segments[0] === "me") {
    return "/api/auth/me";
  }

  return `/auth/${segments.join("/")}`;
}

async function handle(request: NextRequest, context: { params: Promise<{ path: string[] }> | { path: string[] } }) {
  const params = await Promise.resolve(context.params);
  return proxyToBackend(request, resolveAuthPath(params.path));
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
