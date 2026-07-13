"use client";

import { useState, useTransition } from "react";
import { setVeliTakip, addParent, removeParent } from "./actions";

type ParentLink = { id: string; parent_email: string };

export function VeliTakipToggle({
  initial,
  hasPackage,
  parents,
}: {
  initial: boolean;
  hasPackage: boolean;
  parents: ParentLink[];
}) {
  const [on, setOn] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  function toggle() {
    if (!hasPackage || pending) return;
    const next = !on;
    setOn(next); // iyimser
    setErr(null);
    setMsg(null);
    startTransition(async () => {
      const res = await setVeliTakip(next);
      if (res?.error) {
        setOn(!next); // geri al
        setErr(res.error);
      }
    });
  }

  function handleAdd() {
    if (!email.trim() || pending) return;
    setErr(null);
    setMsg(null);
    startTransition(async () => {
      const res = await addParent(email);
      if (res?.error) setErr(res.error);
      else {
        setEmail("");
        setMsg("Veli eklendi. Veliniz bu e-postayla siteye kayıt olup giriş yaptığında sizi takip edebilecek.");
      }
    });
  }

  function handleRemove(id: string) {
    if (pending) return;
    setErr(null);
    setMsg(null);
    startTransition(async () => {
      const res = await removeParent(id);
      if (res?.error) setErr(res.error);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="flex items-center gap-2 font-semibold text-gray-900">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={2} className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 2l7 4v6c0 5-3.5 8-7 10-3.5-2-7-5-7-10V6l7-4z" />
            </svg>
            Veli Takip Sistemi
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Eğitim durumunuzun veliniz tarafından takip edilmesine izin verin.
          </p>
        </div>

        {/* Anahtar */}
        <button
          type="button"
          role="switch"
          aria-checked={on}
          disabled={!hasPackage || pending}
          onClick={toggle}
          className={`relative mt-0.5 inline-flex h-6 w-11 flex-shrink-0 items-center rounded-full transition-colors ${
            on ? "bg-[#0E8FA3]" : "bg-gray-300"
          } ${!hasPackage ? "cursor-not-allowed opacity-40" : "cursor-pointer"}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

      {!hasPackage && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <span className="mt-0.5">⚠️</span>
          <p>Veli Takip Sistemini kullanabilmek için aktif bir koçluk veya hızlı okuma paketiniz olmalıdır.</p>
        </div>
      )}

      {err && (
        <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">
          {err}
        </div>
      )}
      {msg && (
        <div className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm text-emerald-700">
          {msg}
        </div>
      )}

      {/* Veli listesi + ekleme (anahtar açıkken) */}
      {hasPackage && on && (
        <div className="mt-5 space-y-3 border-t border-gray-100 pt-5">
          <p className="text-sm font-semibold text-gray-700">Velilerim ({parents.length}/2)</p>

          {parents.length === 0 && (
            <p className="text-sm text-gray-400">Henüz veli eklemediniz.</p>
          )}
          {parents.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-2.5">
              <span className="truncate text-sm text-gray-700">👤 {p.parent_email}</span>
              <button
                type="button"
                onClick={() => handleRemove(p.id)}
                disabled={pending}
                className="ml-3 flex-shrink-0 text-xs font-semibold text-red-500 hover:text-red-700 disabled:opacity-40"
              >
                Kaldır
              </button>
            </div>
          ))}

          {parents.length < 2 && (
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="veli@ornek.com"
                className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20"
              />
              <button
                type="button"
                onClick={handleAdd}
                disabled={pending || !email.trim()}
                className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:opacity-40"
              >
                Veli Ekle
              </button>
            </div>
          )}

          <p className="text-xs text-gray-400">
            Veliniz bu e-postayla siteye üye olup giriş yaptığında Veli Paneli&apos;nden gelişiminizi görür.
            Erişimi dilediğiniz zaman anahtardan kapatabilir veya veliyi kaldırabilirsiniz.
          </p>
        </div>
      )}
    </div>
  );
}
