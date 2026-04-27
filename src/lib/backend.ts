import { NextRequest, NextResponse } from "next/server";

function getBackendOrigin() {
  const origin = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!origin) {
    throw new Error("Missing BACKEND_URL. Set it to your backend base URL.");
  }

  return origin.replace(/\/$/, "");
}

function copyResponseHeaders(source: Response) {
  const headers = new Headers(source.headers);
  headers.delete("content-encoding");
  headers.delete("content-length");
  headers.delete("connection");
  headers.delete("keep-alive");
  headers.delete("proxy-authenticate");
  headers.delete("proxy-authorization");
  headers.delete("te");
  headers.delete("trailers");
  headers.delete("transfer-encoding");
  headers.delete("upgrade");
  return headers;
}

export async function proxyToBackend(
  request: NextRequest,
  backendPath: string,
): Promise<NextResponse> {
  const backendUrl = new URL(`${getBackendOrigin()}${backendPath}${request.nextUrl.search}`);
  const headers = new Headers(request.headers);
  headers.delete("host");
  headers.delete("content-length");

  const body = request.method === "GET" || request.method === "HEAD"
    ? undefined
    : await request.arrayBuffer();

  const response = await fetch(backendUrl, {
    method: request.method,
    headers,
    body,
    redirect: "manual",
  });

  const proxied = new NextResponse(response.body, {
    status: response.status,
    headers: copyResponseHeaders(response),
  });

  const getSetCookie = (response.headers as Headers & { getSetCookie?: () => string[] }).getSetCookie;
  const setCookies = getSetCookie ? getSetCookie.call(response.headers) : [];

  for (const cookie of setCookies) {
    proxied.headers.append("set-cookie", cookie);
  }

  return proxied;
}
