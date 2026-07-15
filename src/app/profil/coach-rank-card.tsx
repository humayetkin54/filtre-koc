"use client";

import { useRef, useState, useTransition } from "react";
import { updateCoachRank, uploadSonucBelgesi } from "./rank-actions";

const RANK_TYPES = ["SAY", "EA", "SÖZ", "DİL", "TYT"];

export function CoachRankCard({
  initialType,
  initialValue,
  hasDoc,
}: {
  initialType: string | null;
  initialValue: number | null;
  hasDoc: boolean;
}) {
  const [rankType, setRankType] = useState(initialType ?? "");
  const [rankValue, setRankValue] = useState(initialValue ? String(initialValue) : "");
  const [docUploaded, setDocUploaded] = useState(hasDoc);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  function saveRank() {
    if (pending) return;
    setMsg(null);
    setErr(null);
    startTransition(async () => {
      const res = await updateCoachRank(rankType, rankValue);
      if (res?.error) setErr(res.error);
      else setMsg("Sıralaman kaydedildi — koç kartında rozet olarak görünüyor. 🏆");
    });
  }

  function onPickDoc(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || pending) return;
    setMsg(null);
    setErr(null);
    const fd = new FormData();
    fd.append("belge", file);
    startTransition(async () => {
      const res = await uploadSonucBelgesi(fd);
      if (res?.error) setErr(res.error);
      else {
        setDocUploaded(true);
        setMsg("Sonuç belgen yüklendi — ekibimiz ÖSYM kontrol koduyla doğrulayacak. ✅");
      }
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Sınav Derecen &amp; Sonuç Belgesi</h2>
      <p className="mt-1 text-sm text-gray-500">
        Sıralaman koç kartında 🏆 rozeti olarak görünür — güven kazandırır. Sonuç belgen ise
        <strong> yalnızca doğrulama için yöneticiye</strong> görünür, profilde yayınlanmaz.
      </p>

      {/* Sıralama */}
      <div className="mt-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Puan Türü</label>
          <select
            value={rankType}
            onChange={(e) => setRankType(e.target.value)}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#0E8FA3]"
          >
            <option value="">Seç…</option>
            {RANK_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold text-gray-500">Türkiye Sıralaman</label>
          <input
            type="text"
            inputMode="numeric"
            value={rankValue}
            onChange={(e) => setRankValue(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="Örn: 259"
            className="w-36 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-[#0E8FA3]"
          />
        </div>
        <button
          type="button"
          onClick={saveRank}
          disabled={pending}
          className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:opacity-50"
        >
          Kaydet
        </button>
        {rankType && rankValue && (
          <span className="rounded-full border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-bold text-amber-700">
            🏆 {rankType} - {Number(rankValue.replace(/\D/g, "") || 0).toLocaleString("tr-TR")}
          </span>
        )}
      </div>

      {/* Belge */}
      <div className="mt-5 border-t border-gray-100 pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={pending}
            className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            📄 {docUploaded ? "Sonuç Belgesini Değiştir" : "ÖSYM Sonuç Belgesi Yükle"}
          </button>
          {docUploaded && (
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
              ✓ Belge yüklendi
            </span>
          )}
        </div>
        <input ref={fileRef} type="file" accept="application/pdf,image/jpeg,image/png" onChange={onPickDoc} className="hidden" />
        <p className="mt-2 text-xs text-gray-400">
          ÖSYM Aday İşlemleri&apos;nden indirdiğin <strong>kontrol kodlu</strong> sonuç belgesi (PDF/JPG/PNG, en fazla 10MB).
        </p>
      </div>

      {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      {msg && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">{msg}</p>}
    </div>
  );
}
