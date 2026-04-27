"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";

type Profile = {
  name?: string;
  age?: number;
  country_name?: string;
  gender?: string;
};

type ProfileResponse = {
  data?: Profile | Profile[];
} & Profile;

export default function ProfileDetailPage() {
  const params = useParams<{ id: string }>();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    if (!id) {
      setProfile(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const directResponse = await fetch(`/api/profiles/${id}`, { credentials: "include" });
      if (directResponse.ok) {
        const data = (await directResponse.json()) as ProfileResponse;
        const normalizedProfile = Array.isArray(data.data) ? data.data[0] : data.data ?? data;
        setProfile(normalizedProfile ?? null);
        return;
      }

      const fallbackResponse = await fetch(`/api/profiles?id=${id}`, { credentials: "include" });
      if (!fallbackResponse.ok) {
        setProfile(null);
        return;
      }

      const fallbackData = (await fallbackResponse.json()) as ProfileResponse;
      const normalizedProfile = Array.isArray(fallbackData.data) ? fallbackData.data[0] : fallbackData.data ?? fallbackData;
      setProfile(normalizedProfile ?? null);
    } catch {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      void loadProfile();
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [loadProfile]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-950">Profile</h1>

        {loading ? (
          <div className="mt-4 text-sm text-zinc-600">Loading…</div>
        ) : profile ? (
          <div className="mt-5 space-y-3 text-sm text-zinc-700">
            <div>
              <span className="font-medium text-zinc-950">Name:</span> {profile.name ?? "—"}
            </div>
            <div>
              <span className="font-medium text-zinc-950">Age:</span> {profile.age ?? "—"}
            </div>
            <div>
              <span className="font-medium text-zinc-950">Country:</span> {profile.country_name ?? "—"}
            </div>
            <div>
              <span className="font-medium text-zinc-950">Gender:</span> {profile.gender ?? "—"}
            </div>
            <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-xs text-zinc-700">
              <pre className="overflow-auto">{JSON.stringify(profile, null, 2)}</pre>
            </div>
          </div>
        ) : (
          <div className="mt-4 text-sm text-zinc-600">
            Profile not found or the backend does not expose a direct lookup endpoint.
          </div>
        )}
      </div>
    </div>
  );
}
