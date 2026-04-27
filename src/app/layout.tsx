import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Insighta Web",
  description: "Insighta web portal for profile browsing and account access.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white text-zinc-900">
        <header className="border-b border-zinc-200 bg-white">
          <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
            <Link className="text-sm font-semibold tracking-wide text-zinc-950" href="/">
              Insighta
            </Link>
            <div className="flex items-center gap-5 text-sm text-zinc-600">
              <Link href="/dashboard" className="transition hover:text-zinc-950">Dashboard</Link>
              <Link href="/profiles" className="transition hover:text-zinc-950">Profiles</Link>
              <Link href="/search" className="transition hover:text-zinc-950">Search</Link>
              <Link href="/account" className="transition hover:text-zinc-950">Account</Link>
            </div>
          </nav>
        </header>
        <main className="flex-1 bg-white">{children}</main>
      </body>
    </html>
  );
}
