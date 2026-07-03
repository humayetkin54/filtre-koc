"use client";

import { useState } from "react";

const KONULAR = [
  "Satın alma / Ödeme",
  "Paket iptali / İade",
  "Koç değişikliği",
  "Hesap / Şifre sorunu",
  "Randevu sorunu",
  "Hata bildirimi",
  "Diğer",
];

const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/20";

export default function DestekForm({ userEmail, userName }: { userEmail: string; userName: string }) {
  const [form, setForm] = useState({ name: userName, email: userEmail, konu: "", mesaj: "" });
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    setDone(true);
  }

  if (done) {
    return (
      <div className="text-center py-10 space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">✓</div>
        <h3 className="font-bold text-lg text-[#1e293b]">Talebiniz Alındı!</h3>
        <p className="text-sm text-gray-500 max-w-xs mx-auto">
          <strong>{form.konu}</strong> konusundaki talebiniz iletildi.
          En kısa sürede <strong>{form.email}</strong> adresine dönüş yapacağız.
        </p>
        <div className="inline-flex items-center gap-2 rounded-full bg-[#eef9f9] border border-[#0E8FA3]/20 px-4 py-2 text-xs text-[#0E8FA3] font-semibold">
          ⏱ Yanıt süresi: 2–4 saat (hafta içi)
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">Ad Soyad</label>
          <input
            type="text"
            required
            className={inputCls}
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-700">E-posta</label>
          <input
            type="email"
            required
            className={inputCls}
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Konu</label>
        <select
          required
          className={inputCls}
          value={form.konu}
          onChange={(e) => setForm({ ...form, konu: e.target.value })}
        >
          <option value="">Konu seçin</option>
          {KONULAR.map((k) => <option key={k} value={k}>{k}</option>)}
        </select>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Mesajınız</label>
        <textarea
          required
          rows={5}
          placeholder="Sorununuzu veya talebinizi detaylıca açıklayın..."
          className={`${inputCls} resize-none`}
          value={form.mesaj}
          onChange={(e) => setForm({ ...form, mesaj: e.target.value })}
        />
      </div>

      <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-xs text-gray-500">
        <span>🔒</span>
        <span>Mesajınız yalnızca destek ekibimiz tarafından görüntülenir.</span>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="btn-primary w-full py-3 text-sm disabled:opacity-60"
      >
        {loading ? "Gönderiliyor..." : "Talebi Gönder →"}
      </button>
    </form>
  );
}
