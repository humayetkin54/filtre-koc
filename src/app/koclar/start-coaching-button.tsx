"use client";

import { startCoaching } from "./actions";
import { useTransition } from "react";

export function StartCoachingButton({ coachId, coachName }: { coachId: string; coachName: string }) {
  const [pending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => startTransition(() => startCoaching(coachId, coachName))}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#123A57] to-[#0E8FA3] px-4 py-3 text-sm font-bold text-white transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {pending ? (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )}
      {pending ? "Yönlendiriliyor..." : "Koçluk Başlat"}
    </button>
  );
}
