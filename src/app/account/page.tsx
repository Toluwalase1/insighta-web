"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type SessionUser = {
  username?: string;
  name?: string;
  email?: string;
  role?: string;
};

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  const loadAccount = useCallback(async () => {
    setLoading(true);

    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (!response.ok) {
        setUser(null);
        return;
      }

      const data = (await response.json()) as SessionUser;
      setUser(data);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadAccount();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadAccount]);

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Account</h1>

        <div className="mt-4">
          {loading ? (
            <div className="text-sm text-zinc-600">Loading…</div>
          ) : user ? (
            <div className="space-y-3 text-sm text-zinc-700">
              <div>
                <span className="font-medium text-zinc-950">Username:</span> {user.username ?? user.name ?? "—"}
              </div>
              <div>
                <span className="font-medium text-zinc-950">Email:</span> {user.email ?? "—"}
              </div>
              <div>
                <span className="font-medium text-zinc-950">Role:</span> {user.role ?? "analyst"}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-zinc-700">
                  {user.role === "admin" ? "Admin" : "Analyst"}
                </span>
                <button
                  className="rounded-full border border-zinc-300 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:border-zinc-400"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
                    router.push("/login");
                  }}
                  type="button"
                >
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <div className="text-zinc-600">
              Not signed in. <Link className="text-zinc-950 underline underline-offset-4" href="/login">Sign in</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
