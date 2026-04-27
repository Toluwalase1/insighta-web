"use client";
import React from "react";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col justify-center px-6">
      <div className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Login</p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950">Continue with GitHub</h1>
        <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-600">
          Use the backend OAuth flow. Tokens stay in HTTP-only cookies, not localStorage.
        </p>
        <form className="mt-7" action="/api/auth/github" method="get">
          <button
            className="inline-flex items-center justify-center rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800"
            type="submit"
          >
            Continue with GitHub
          </button>
        </form>
        <div className="mt-6 text-xs text-zinc-500">
          After login, the backend should redirect you back into the app.
        </div>
        <div className="mt-8">
          <Link href="/auth/callback" className="text-sm text-zinc-700 underline underline-offset-4">
            Open callback landing page
          </Link>
        </div>
      </div>
    </div>
  );
}
