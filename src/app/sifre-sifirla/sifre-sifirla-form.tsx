"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export function SifreSifirlaForm() {
  const [ready, setReady] = useState<"checking" | "ok" | "no-session">("checking");
  const [pw1, setPw1] = useState("");
  const [pw2, setPw2] = useState("");
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Sıfırlama bağlantısı geçerliyse kullanıcı oturumlu gelir
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setReady(data.user ? "ok" : "no-session");
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setErr(null);
    if (pw1.length < 6) return setErr("Şifre en az 6 karakter olmalı.");
    if (pw1 !== pw2) return setErr("Şifreler birbiriyle uyuşmuyor.");

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password: pw1 });
    setLoading(false);
    if (error) setErr("Şifre güncellenemedi: " + error.message);
    else setDone(true);
  }

  if (ready === "checking") {
    return <p className="text-center text-sm text-gray-400">Bağlantı doğrulanıyor…</p>;
  }

  if (ready === "no-session") {
    return (
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-4 text-sm text-amber-700">
        <p className="font-semibold">Bağlantı geçersiz veya süresi dolmuş ⏳</p>
        <p className="mt-1">
          Şifre sıfırlama bağlantıları güvenlik nedeniyle kısa süre geçerlidir.
        </p>
        <Link
          href="/sifre-unuttum"
          className="mt-3 inline-block rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]"
        >
          Yeni bağlantı iste
        </Link>
      </div>
    );
  }

  if (done) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-center text-sm text-emerald-700">
        <p className="font-semibold">Şifren güncellendi! ✅</p>
        <p className="mt-1">Artık yeni şifrenle giriş yapabilirsin — şu an oturumun da açık.</p>
        <Link
          href="/"
          className="mt-3 inline-block rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]"
        >
          Ana Sayfaya Git
        </Link>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20";

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Yeni şifre</label>
        <input
          type="password"
          value={pw1}
          onChange={(e) => setPw1(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          className={inputCls}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Yeni şifre (tekrar)</label>
        <input
          type="password"
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="Aynı şifreyi tekrar yaz"
          className={inputCls}
        />
      </div>
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
        {loading ? "Güncelleniyor…" : "Şifreyi Güncelle"}
      </button>
    </form>
  );
}
