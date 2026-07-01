"use client";

import Link from "next/link";

type Coach = {
  id: string;
  name: string;
  university: string;
  department: string;
  types: string[];
  rating: number;
  rating_count: number;
  avatar_initials: string;
  avatar_color: string;
  max_students: number;
  current_students: number;
};

export default function EslestirmeClient({
  coach,
  score,
  freeLeft,
  userMeta,
}: {
  coach: Coach;
  score: number;
  freeLeft: number;
  userMeta: Record<string, string>;
}) {
  const available = (coach.max_students ?? 10) - (coach.current_students ?? 0);
  const targetUni = userMeta.target ?? "";

  const reasons: string[] = [];
  if (targetUni && coach.university && targetUni.toLowerCase().includes(coach.university.toLowerCase().split(" ")[0]))
    reasons.push(`Hedeflediğin ${coach.university} mezunu`);
  if (coach.department) reasons.push(`${coach.department} branş uzmanı`);
  if (available > 0) reasons.push(`Şu an ${available} boş kontenjanı var`);
  reasons.push("Benzer profilli öğrencilerle deneyimli");

  // Renk bandı skora göre
  const scoreColor = score >= 85 ? "#16a34a" : score >= 70 ? "#0E8FA3" : "#E2600F";

  return (
    <div className="rounded-2xl bg-white shadow-sm overflow-hidden">
      {/* Üst banner */}
      <div className="px-6 pt-5 pb-4 border-b border-gray-100">
        <p className="text-xs font-semibold tracking-widest uppercase text-gray-400 mb-1">Senin için en uygun koç</p>

        <div className="flex items-center justify-between gap-4 mt-3">
          {/* Avatar + isim */}
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: coach.avatar_color || "#123A57" }}
            >
              {coach.avatar_initials}
            </div>
            <div>
              <div className="font-bold text-[#1e293b] text-base">{coach.name}</div>
              <div className="text-xs text-gray-500 mt-0.5">
                {coach.university && `${coach.university}`}
                {coach.department && ` · ${coach.department}`}
              </div>
              {coach.rating > 0 && (
                <div className="text-xs text-gray-400 mt-0.5">
                  ⭐ {coach.rating.toFixed(1)} · {coach.rating_count} yorum
                </div>
              )}
            </div>
          </div>

          {/* Uyum skoru */}
          <div className="flex-shrink-0 text-right">
            <div
              className="text-3xl font-black leading-none"
              style={{ color: scoreColor }}
            >
              %{score}
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5 font-medium">uyum</div>
          </div>
        </div>
      </div>

      {/* Neden bu koç */}
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">Neden bu koç?</p>
        <ul className="space-y-2">
          {reasons.map((r) => (
            <li key={r} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="text-[#0E8FA3] font-bold mt-0.5">✓</span>
              {r}
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="px-6 py-5">
        {freeLeft > 0 ? (
          <Link
            href={`/koclar/${coach.id}`}
            className="btn-primary w-full py-3 text-sm"
          >
            Ücretsiz Görüşme Planla →
          </Link>
        ) : (
          <Link
            href={`/koclar/${coach.id}`}
            className="btn-primary w-full py-3 text-sm"
          >
            Koç Profilini İncele →
          </Link>
        )}
        <p className="text-center text-xs text-gray-400 mt-2">
          {freeLeft > 0 ? `${freeLeft} ücretsiz görüşme hakkından biri kullanılır` : "Paket satın alarak devam edebilirsin"}
        </p>
      </div>
    </div>
  );
}
