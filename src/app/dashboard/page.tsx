"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Profile = {
  gender?: string;
  country_name?: string;
};

type DashboardResponse = {
  total?: number;
  data?: Profile[];
};

type SessionUser = {
  role?: string;
};

export default function DashboardPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    try {
      const [sessionResponse, profilesResponse] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }),
        fetch("/api/profiles?limit=20&page=1", { credentials: "include" }),
      ]);

      const session = (sessionResponse.ok ? (await sessionResponse.json()) : null) as SessionUser | null;
      const data = (await profilesResponse.json()) as DashboardResponse;

      setRole(session?.role ?? null);
      setTotal(typeof data.total === "number" ? data.total : null);
      setProfiles(Array.isArray(data.data) ? data.data : []);
    } catch {
      setRole(null);
      setTotal(null);
      setProfiles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadDashboard();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadDashboard]);

  const counts = useMemo(() => {
    const genderCounts: Record<string, number> = {};
    const countryCounts: Record<string, number> = {};

    for (const profile of profiles) {
      const gender = profile.gender ?? "unknown";
      const country = profile.country_name ?? "unknown";
      genderCounts[gender] = (genderCounts[gender] ?? 0) + 1;
      countryCounts[country] = (countryCounts[country] ?? 0) + 1;
    }

    return { genderCounts, countryCounts };
  }, [profiles]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Dashboard</p>
        <div className="mt-3 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Profile overview</h1>
            <p className="mt-2 text-sm text-zinc-600">A lightweight summary of the current directory data.</p>
          </div>
          <span className="inline-flex w-fit rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-700">
            {role === "admin" ? "Admin access" : "Analyst access"}
          </span>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Total profiles</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{loading ? "..." : total ?? "n/a"}</div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Gender breakdown</div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            {Object.entries(counts.genderCounts).length === 0 ? (
              <div>No sample data yet.</div>
            ) : (
              Object.entries(counts.genderCounts).map(([gender, count]) => (
                <div key={gender} className="flex items-center justify-between gap-4">
                  <span>{gender}</span>
                  <span>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Country breakdown</div>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            {Object.entries(counts.countryCounts).length === 0 ? (
              <div>No sample data yet.</div>
            ) : (
              Object.entries(counts.countryCounts).slice(0, 4).map(([country, count]) => (
                <div key={country} className="flex items-center justify-between gap-4">
                  <span>{country}</span>
                  <span>{count}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/profiles" className="rounded-full  px-5 py-3 text-sm font-medium text-white transition border border-black">
          Open profiles
        </Link>
        <Link href="/search" className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-400">
          Search profiles
        </Link>
      </div>
    </div>
  );
}
