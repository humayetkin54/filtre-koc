"use client";

import { useState, useTransition } from "react";
import { submitCoachReview } from "./review-actions";

export function CoachReviewCard({
  coachName,
  existing,
}: {
  coachName: string;
  existing: { rating: number; comment: string | null } | null;
}) {
  const [rating, setRating] = useState(existing?.rating ?? 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function submit() {
    if (rating < 1 || pending) return;
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await submitCoachReview(rating, comment);
      if (res?.error) setErr(res.error);
      else setMsg(existing ? "Değerlendirmen güncellendi. Teşekkürler! 🙏" : "Değerlendirmen kaydedildi. Teşekkürler! 🙏");
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5">
      <h2 className="text-sm font-bold text-gray-700">
        ⭐ Koçunu Değerlendir
        <span className="ml-2 font-medium text-gray-400">({coachName})</span>
      </h2>
      <p className="mt-1 text-xs text-gray-400">
        Puanın ve yorumun koçunun profilinde adının kısaltılmış hâliyle yayınlanır; istediğin zaman güncelleyebilirsin.
      </p>

      {/* Yıldızlar */}
      <div className="mt-4 flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setRating(n)}
            onMouseEnter={() => setHover(n)}
            onMouseLeave={() => setHover(0)}
            className={`text-3xl transition-transform hover:scale-110 ${
              n <= (hover || rating) ? "text-amber-400" : "text-gray-200"
            }`}
            aria-label={`${n} yıldız`}
          >
            ★
          </button>
        ))}
        {rating > 0 && <span className="ml-2 text-sm font-bold text-gray-700">{rating}/5</span>}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        maxLength={600}
        rows={3}
        placeholder="Deneyimini birkaç cümleyle anlat (isteğe bağlı)…"
        className="mt-3 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
      />

      {err && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      {msg && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</p>}

      <button
        type="button"
        onClick={submit}
        disabled={rating < 1 || pending}
        className="mt-3 rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:cursor-not-allowed disabled:opacity-40"
      >
        {pending ? "Kaydediliyor…" : existing ? "Değerlendirmemi Güncelle" : "Değerlendirmeyi Gönder"}
      </button>
    </div>
  );
}
