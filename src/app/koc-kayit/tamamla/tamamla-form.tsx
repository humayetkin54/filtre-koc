"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { completeCoachApplication } from "@/app/koc-auth/actions";

const inputCls =
  "w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-[#0E8FA3] focus:ring-2 focus:ring-[#0E8FA3]/30";

export function TamamlaForm() {
  const [done, setDone] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    setErr(null);
    startTransition(async () => {
      const res = await completeCoachApplication(fd);
      if (res?.error) setErr(res.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="mt-6 rounded-xl border border-emerald-400/30 bg-emerald-400/10 p-5 text-center">
        <div className="text-3xl">🎉</div>
        <p className="mt-2 font-semibold text-emerald-300">Başvurun alındı!</p>
        <p className="mt-1 text-sm text-gray-300">
          Ekibimiz başvurunu inceleyecek; onaylandığında Google hesabınla giriş yapıp koç paneline
          ulaşabileceksin.
        </p>
        <Link href="/" className="mt-4 inline-block rounded-xl bg-white px-6 py-2.5 text-sm font-bold text-[#123A57]">
          Ana Sayfaya Dön
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Üniversite *</label>
        <input type="text" name="university" required placeholder="Örn: Boğaziçi Üniversitesi" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Bölüm *</label>
        <input type="text" name="department" required placeholder="Örn: Rehberlik ve Psikolojik Danışmanlık" className={inputCls} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-300">Kendini kısaca tanıt</label>
        <textarea name="bio" rows={4} placeholder="Deneyimin, derecen, öğrencilerle çalışma tarzın…" className={inputCls} />
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3">
        <input type="checkbox" required className="mt-1 h-4 w-4 accent-[#E2600F]" />
        <span className="text-sm font-semibold text-red-400">
          Mailine gelen Google Forms bilgi formunu doldurmayı unutma!
        </span>
      </label>
      {err && <p className="rounded-lg bg-red-500/15 px-3 py-2 text-xs text-red-300">{err}</p>}
      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-[#0E8FA3] py-3 text-sm font-bold text-white transition hover:bg-[#0c7d8f] disabled:opacity-60"
      >
        {pending ? "Gönderiliyor…" : "Başvuruyu Tamamla"}
      </button>
    </form>
  );
}
