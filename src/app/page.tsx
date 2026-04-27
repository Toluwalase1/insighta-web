import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-20 lg:flex-row lg:items-center lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.25em] text-zinc-500">
            Insighta web portal
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-950 sm:text-5xl">
            Browse profiles, inspect insights, and manage access from one clean dashboard.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-600">
            A simple white interface for login, profile browsing, search, and account access.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="rounded-full bg-zinc-950 px-5 py-3 text-sm font-medium text-white transition hover:bg-zinc-800">
              Continue with GitHub
            </Link>
            <Link href="/dashboard" className="rounded-full border border-zinc-300 px-5 py-3 text-sm font-medium text-zinc-900 transition hover:border-zinc-400">
              View dashboard
            </Link>
          </div>
        </div>

        <div className="grid w-full max-w-md gap-4">
          {[
            ["HTTP-only auth", "Backend-set cookies keep tokens out of JavaScript."],
            ["Role-aware UI", "Admins see create actions, analysts stay read-only."],
            ["Profiles tools", "Filters, pagination, search, and detail views stay simple."],
          ].map(([title, text]) => (
            <div key={title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="font-medium text-zinc-950">{title}</div>
              <div className="mt-2 text-sm leading-6 text-zinc-600">{text}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
