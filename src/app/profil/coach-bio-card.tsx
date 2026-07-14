"use client";

import { useState, useTransition } from "react";
import { updateCoachBio } from "./bio-actions";

const MAX = 1200;

export function CoachBioCard({ initialBio }: { initialBio: string | null }) {
  const [bio, setBio] = useState(initialBio ?? "");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function save() {
    if (pending) return;
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await updateCoachBio(bio);
      if (res?.error) setErr(res.error);
      else setMsg("Biyografin kaydedildi — koç profilinde yayında. ✅");
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Biyografi</h2>
      <p className="mt-1 text-sm text-gray-500">
        Kendini öğrencilere ve velilere tanıt — bu metin koç profilindeki &quot;Hakkında&quot; bölümünde görünür.
        Deneyimini, uzmanlık alanlarını ve çalışma tarzını anlatabilirsin.
      </p>

      <textarea
        value={bio}
        onChange={(e) => setBio(e.target.value.slice(0, MAX))}
        rows={6}
        placeholder="Örn: 5 yıldır YKS öğrencileriyle çalışıyorum. Boğaziçi Üniversitesi mezunuyum; öğrencilerimle haftalık birebir görüşmeler yapar, deneme analizleriyle kişiye özel program hazırlarım…"
        className="mt-4 w-full rounded-xl border border-gray-200 px-4 py-3 text-sm leading-relaxed text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
      />
      <div className="mt-1 text-right text-xs text-gray-400">
        {bio.length}/{MAX}
      </div>

      {err && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      {msg && <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</p>}

      <button
        type="button"
        onClick={save}
        disabled={pending}
        className="mt-3 rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:opacity-50"
      >
        {pending ? "Kaydediliyor…" : "Biyografiyi Kaydet"}
      </button>
    </div>
  );
}
