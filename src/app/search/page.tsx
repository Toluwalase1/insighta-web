"use client";
import React, { useState } from "react";
import Link from "next/link";

type SearchResult = {
  id?: string;
  name?: string;
  country_name?: string;
  age?: number;
};

export default function SearchPage() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  async function doSearch(e?: React.FormEvent) {
    e?.preventDefault();
    setLoading(true);
    try {
      const res = await fetch(`/api/profiles/search?q=${encodeURIComponent(q)}`, { credentials: "include" });
      const data = await res.json();
      setResults(Array.isArray(data.data) ? data.data : data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Search</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Natural language lookup</h1>
        <form onSubmit={doSearch} className="mt-5 flex gap-2">
          <input
            className="flex-1 rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-400"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search profiles, e.g. women in Nigeria aged 30"
          />
          <button className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800" type="submit">
            Search
          </button>
        </form>

        <div className="mt-6 rounded-2xl border border-zinc-200 bg-zinc-50">
          {loading ? (
            <div className="p-5 text-sm text-zinc-600">Searching…</div>
          ) : results.length === 0 ? (
            <div className="p-5 text-sm text-zinc-600">Run a search to see matching profiles.</div>
          ) : (
            results.map((result) => (
              <div key={result.id ?? result.name} className="border-b border-zinc-200 px-5 py-4 last:border-b-0">
                <Link href={`/profiles/${result.id}`} className="font-medium text-zinc-950 hover:underline">
                  {result.name}
                </Link>
                <div className="mt-1 text-sm text-zinc-600">
                  {result.country_name ?? "—"} {result.age ? `• ${result.age}` : ""}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
