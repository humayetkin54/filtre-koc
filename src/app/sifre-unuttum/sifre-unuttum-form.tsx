"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function SifreUnuttumForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (loading || !email.trim()) return;
    setLoading(true);
    setErr(null);

    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/auth/callback?next=/sifre-sifirla`,
    });

    setLoading(false);
    if (error) setErr("Bağlantı gönderilemedi: " + error.message);
    else setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-700">
        <p className="font-semibold">Bağlantı gönderildi! 📬</p>
        <p className="mt-1">
          <strong>{email}</strong> adresine şifre sıfırlama bağlantısı gönderdik. Gelen kutunu
          (ve <strong>Spam/Gereksiz</strong> klasörünü) kontrol et — bağlantıya tıklayıp yeni
          şifreni belirleyebilirsin.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">E-posta</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
          placeholder="ada@ornek.com"
          className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
        />
      </div>
      {err && <p className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-60">
        {loading ? "Gönderiliyor…" : "Sıfırlama Bağlantısı Gönder"}
      </button>
    </form>
  );
}
