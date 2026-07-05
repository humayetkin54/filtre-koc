"use client";

import { useState } from "react";
import { BookingModal } from "./booking-modal";

interface Coach {
  id: string;
  name: string;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
  availability_schedule: Record<string, string[]>;
}

export function PurchasedCoaches({ coaches }: { coaches: Coach[] }) {
  const [selected, setSelected] = useState<Coach | null>(null);

  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-[#123A57] uppercase tracking-wider">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Koçlarım
        <span className="rounded-full bg-[#123A57] px-2 py-0.5 text-xs font-bold text-white">{coaches.length}</span>
      </h2>

      <div className="space-y-3">
        {coaches.map((coach) => (
          <div
            key={coach.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 bg-white p-4"
          >
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
            >
              {coach.avatar_initials}
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900">{coach.name}</p>
              <p className="text-xs text-gray-500">Aktif koçluk paketi</p>
            </div>

            <button
              type="button"
              onClick={() => setSelected(coach)}
              className="flex-shrink-0 rounded-xl bg-[#0E8FA3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c7689]"
            >
              Randevu Al
            </button>
          </div>
        ))}
      </div>

      {selected && (
        <BookingModal coach={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
