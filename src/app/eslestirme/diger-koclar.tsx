"use client";

const TYPE_COLORS: Record<string, string> = {
  YKS: "bg-blue-50 text-blue-700",
  LGS: "bg-emerald-50 text-emerald-700",
  KPSS: "bg-orange-50 text-orange-700",
  "KPSS/AGS": "bg-orange-50 text-orange-700",
  PDR: "bg-purple-50 text-purple-700",
};

const AVAILABILITY_BADGE: Record<string, { label: string; cls: string }> = {
  open:  { label: "Müsait",    cls: "bg-emerald-50 text-emerald-700" },
  low:   { label: "Az yer",    cls: "bg-amber-50 text-amber-700" },
  full:  { label: "Dolu",      cls: "bg-red-50 text-red-600" },
};

type Coach = {
  id: string;
  name: string;
  university: string;
  department: string;
  types: string[];
  availability: string;
  current_students: number;
  max_students: number;
  rating: number;
  rating_count: number;
  avatar_initials: string;
  avatar_color: string;
  score: number;
};

export default function DigerKoclar({ coaches, freeLeft }: { coaches: Coach[]; freeLeft: number }) {
  function handleBook() {
    alert("Randevu sistemi yakında aktif olacak!");
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {coaches.map((c) => {
        const isFull = c.availability === "full" || (c.max_students > 0 && c.current_students >= c.max_students);
        const avail = AVAILABILITY_BADGE[c.availability] ?? AVAILABILITY_BADGE.open;

        return (
          <div key={c.id} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm flex flex-col gap-4 hover:-translate-y-0.5 hover:shadow-md transition-all">
            {/* Üst satır: avatar + isim + availability */}
            <div className="flex items-start gap-3">
              <div
                className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-bold text-white"
                style={{ background: c.avatar_color || "#123A57" }}
              >
                {c.avatar_initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-[#1e293b] text-sm truncate">{c.name}</span>
                  <span className={`flex-shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${avail.cls}`}>
                    {avail.label}
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-0.5 truncate">
                  {[c.university, c.department].filter(Boolean).join(" · ")}
                </div>
              </div>
            </div>

            {/* Rating */}
            {c.rating > 0 && (
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <span className="text-amber-400">★</span>
                <span className="font-semibold text-gray-700">{c.rating.toFixed(1)}</span>
                <span>· {c.rating_count} yorum</span>
              </div>
            )}

            {/* Types rozetleri */}
            {c.types && c.types.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {c.types.map((t) => (
                  <span
                    key={t}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TYPE_COLORS[t] ?? "bg-gray-100 text-gray-600"}`}
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            {/* Kontenjan */}
            <div className="text-xs text-gray-400">
              {c.max_students - c.current_students > 0
                ? `${c.max_students - c.current_students} boş kontenjan`
                : "Kontenjan dolu"}
            </div>

            {/* Buton */}
            <button
              onClick={handleBook}
              disabled={isFull || freeLeft === 0}
              className={`mt-auto w-full rounded-xl border-2 px-4 py-2.5 text-sm font-semibold transition-all ${
                isFull || freeLeft === 0
                  ? "border-gray-200 text-gray-400 cursor-not-allowed"
                  : "border-[#0E8FA3] text-[#0E8FA3] hover:bg-[#0E8FA3] hover:text-white"
              }`}
            >
              {isFull ? "Kontenjan Dolu" : freeLeft === 0 ? "Hak Tükendi" : "Ücretsiz Tanışma"}
            </button>
          </div>
        );
      })}
    </div>
  );
}
