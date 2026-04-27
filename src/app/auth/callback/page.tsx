"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const nextPath = searchParams.get("next") ?? "/dashboard";
    router.replace(nextPath);
  }, [router, searchParams]);

  return (
    <div className="mx-auto flex min-h-[50vh] max-w-xl items-center justify-center px-6 text-center text-zinc-600">
      Finishing sign in...
    </div>
  );
}
