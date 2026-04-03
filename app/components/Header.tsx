import Image from "next/image";
import { formatDateTime } from "@/app/lib/formatting";
import { RefreshButton } from "./RefreshButton";

interface HeaderProps {
  brandName: string;
  bio: string;
  location: string;
  githubUrl: string;
  portfolioUrl?: string;
  linkedinUrl?: string;
  avatarUrl: string;
  updatedAt: string;
  stale: boolean;
}

export function Header({
  brandName,
  bio,
  location,
  githubUrl,
  portfolioUrl,
  linkedinUrl,
  avatarUrl,
  updatedAt,
  stale,
}: HeaderProps) {
  return (
    <header className="relative overflow-hidden rounded-3xl border border-white/15 bg-slate-900/55 p-6 shadow-[0_20px_55px_rgba(15,23,42,0.55)] backdrop-blur-xl sm:p-8">
      <div className="pointer-events-none absolute -left-8 -top-8 h-40 w-40 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 right-0 h-44 w-44 rounded-full bg-emerald-500/15 blur-3xl" />

      <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-4">
          <Image
            src={avatarUrl}
            alt={`${brandName} avatar`}
            width={72}
            height={72}
            className="rounded-2xl border border-white/20"
            priority
          />
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-sky-200/80">Portfolio Analytics Hub</p>
            <h1 className="mt-1 text-3xl font-semibold text-slate-100 md:text-4xl">{brandName}</h1>
            <p className="mt-2 max-w-xl text-slate-300">{bio}</p>
            <p className="mt-2 text-sm text-slate-400">{location}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-300">
              <a className="rounded-full border border-white/20 px-3 py-1.5 hover:border-sky-300" href={githubUrl} target="_blank" rel="noreferrer">
                GitHub
              </a>
              {portfolioUrl ? (
                <a
                  className="rounded-full border border-white/20 px-3 py-1.5 hover:border-sky-300"
                  href={portfolioUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  Portfolio
                </a>
              ) : null}
              {linkedinUrl ? (
                <a
                  className="rounded-full border border-white/20 px-3 py-1.5 hover:border-sky-300"
                  href={linkedinUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  LinkedIn
                </a>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 md:items-end">
          <RefreshButton />
          <p className="text-xs text-slate-400">Last updated: {formatDateTime(updatedAt)}</p>
          {stale ? (
            <span className="inline-flex w-fit rounded-full border border-amber-300/50 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
              Outdated cache (API limited)
            </span>
          ) : null}
        </div>
      </div>
    </header>
  );
}
