"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";

type Profile = {
  id?: string;
  name?: string;
  gender?: string;
  country_name?: string;
  age?: number;
  created_at?: string;
};

type ApiResponse = {
  data?: Profile[];
  total?: number;
  total_pages?: number;
};

type SessionUser = {
  role?: string;
};

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [gender, setGender] = useState("");
  const [country, setCountry] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const query = useMemo(() => {
    const params = new URLSearchParams();
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (gender) params.set("gender", gender);
    if (country) params.set("country", country);
    if (ageGroup) params.set("age_group", ageGroup);
    if (sortBy) params.set("sort_by", sortBy);
    if (order) params.set("order", order);
    return params.toString();
  }, [ageGroup, country, gender, limit, order, page, sortBy]);

  const loadProfiles = useCallback(async () => {
    setLoading(true);

    try {
      const [sessionResponse, profilesResponse] = await Promise.all([
        fetch("/api/auth/me", { credentials: "include" }),
        fetch(`/api/profiles?${query}`, { credentials: "include" }),
      ]);

      const session = (sessionResponse.ok ? (await sessionResponse.json()) : null) as SessionUser | null;
      const data = (await profilesResponse.json()) as ApiResponse;

      setUserRole(session?.role ?? null);
      setProfiles(Array.isArray(data.data) ? data.data : []);
      setTotal(typeof data.total === "number" ? data.total : 0);
      setTotalPages(typeof data.total_pages === "number" ? data.total_pages : 1);
    } catch {
      setUserRole(null);
      setProfiles([]);
      setTotal(0);
      setTotalPages(1);
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadProfiles();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadProfiles]);

  const isAdmin = userRole === "admin";

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Profiles</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Browse the directory</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Filters, pagination, and detail views stay in a clean white layout.
            </p>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <Link href="/profiles/new" className="rounded-full bg-zinc-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800">
                Create profile
              </Link>
            ) : (
              <span className="rounded-full border border-zinc-200 px-4 py-2 text-sm text-zinc-600">
                Read-only access
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
          <label className="text-sm text-zinc-600">
            Gender
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={gender}
              onChange={(event) => {
                setGender(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            Country
            <input
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={country}
              onChange={(event) => {
                setCountry(event.target.value);
                setPage(1);
              }}
              placeholder="NG"
            />
          </label>
          <label className="text-sm text-zinc-600">
            Age group
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={ageGroup}
              onChange={(event) => {
                setAgeGroup(event.target.value);
                setPage(1);
              }}
            >
              <option value="">All</option>
              <option value="child">Child</option>
              <option value="teen">Teen</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            Sort by
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value)}
            >
              <option value="created_at">Created</option>
              <option value="age">Age</option>
              <option value="name">Name</option>
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            Order
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={order}
              onChange={(event) => setOrder(event.target.value)}
            >
              <option value="desc">Desc</option>
              <option value="asc">Asc</option>
            </select>
          </label>
          <label className="text-sm text-zinc-600">
            Page size
            <select
              className="mt-1 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2"
              value={limit}
              onChange={(event) => {
                setLimit(Number(event.target.value));
                setPage(1);
              }}
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </label>
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Total profiles</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{loading ? "..." : total}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Current page</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{page}</div>
        </div>
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
          <div className="text-sm text-zinc-500">Pages</div>
          <div className="mt-2 text-3xl font-semibold text-zinc-950">{totalPages}</div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-sm text-zinc-600">Loading profiles…</div>
        ) : profiles.length === 0 ? (
          <div className="p-6 text-sm text-zinc-600">No profiles matched the current filters.</div>
        ) : (
          <table className="w-full border-separate border-spacing-0">
            <thead className="bg-zinc-50 text-left text-xs uppercase tracking-[0.18em] text-zinc-500">
              <tr>
                <th className="px-5 py-4 font-medium">Name</th>
                <th className="px-5 py-4 font-medium">Gender</th>
                <th className="px-5 py-4 font-medium">Country</th>
                <th className="px-5 py-4 font-medium">Age</th>
                <th className="px-5 py-4 font-medium">Created</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <tr key={profile.id ?? profile.name} className="border-t border-zinc-100">
                  <td className="px-5 py-4">
                    <Link href={`/profiles/${profile.id}`} className="font-medium text-zinc-950 hover:underline">
                      {profile.name ?? "—"}
                    </Link>
                  </td>
                  <td className="px-5 py-4 text-zinc-700">{profile.gender ?? "—"}</td>
                  <td className="px-5 py-4 text-zinc-700">{profile.country_name ?? "—"}</td>
                  <td className="px-5 py-4 text-zinc-700">{profile.age ?? "—"}</td>
                  <td className="px-5 py-4 text-zinc-700">
                    {profile.created_at ? new Date(profile.created_at).toLocaleDateString() : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between rounded-2xl border border-zinc-200 bg-white px-4 py-3 shadow-sm">
        <div className="text-sm text-zinc-600">
          Page {page} of {totalPages}
        </div>
        <div className="flex items-center gap-2">
          <button
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
            disabled={page <= 1}
            type="button"
          >
            Previous
          </button>
          <button
            className="rounded-full border border-zinc-300 px-4 py-2 text-sm text-zinc-900 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => setPage((currentPage) => Math.min(totalPages, currentPage + 1))}
            disabled={page >= totalPages}
            type="button"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
