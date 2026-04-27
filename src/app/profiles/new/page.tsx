"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewProfilePage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setRole(data?.role ?? null))
      .catch(() => setRole(null));
  }, []);

  async function submitForm(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/profiles", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        throw new Error(error?.message ?? "Could not create profile.");
      }

      const data = await response.json();
      setMessage("Profile created successfully.");
      const profileId = data?.data?.id ?? data?.id;
      if (profileId) {
        router.push(`/profiles/${profileId}`);
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not create profile.");
    } finally {
      setLoading(false);
    }
  }

  if (role && role !== "admin") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-950">Create profile</h1>
          <p className="mt-2 text-sm text-zinc-600">Only admins can create profiles.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-950">Create profile</h1>
        <p className="mt-2 text-sm text-zinc-600">The backend handles enrichment and persistence.</p>

        <form className="mt-6 space-y-4" onSubmit={submitForm}>
          <label className="block text-sm text-zinc-600">
            Name
            <input
              className="mt-1 w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-zinc-950 outline-none ring-0 transition focus:border-zinc-400"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Harriet Tubman"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create profile"}
          </button>
        </form>

        {message ? <p className="mt-4 text-sm text-zinc-600">{message}</p> : null}
      </div>
    </div>
  );
}
