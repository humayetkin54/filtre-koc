"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const SEEN_KEY = "rz_ai_welcome_seen";

export function WelcomeModal() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Daha önce görülmediyse göster
    if (typeof window !== "undefined" && !localStorage.getItem(SEEN_KEY)) {
      const t = setTimeout(() => setOpen(true), 600);
      return () => clearTimeout(t);
    }
  }, []);

  function close() {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
  }

  function goChat() {
    localStorage.setItem(SEEN_KEY, "1");
    setOpen(false);
    router.push("/ogrenci-paneli/ai-asistan");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={close}>
      <div
        className="relative w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={close} className="absolute right-5 top-5 text-gray-300 hover:text-gray-500 text-xl">×</button>

        <div className="flex flex-col items-center text-center">
          <div className="mb-4 h-20 w-20 rounded-full bg-gradient-to-br from-[#123A57] to-[#0E8FA3] flex items-center justify-center text-3xl shadow-lg">
            🤖
          </div>
          <h2 className="text-2xl font-bold text-gray-900">
            AI Asistan ile <span className="text-[#0E8FA3]">Tanış!</span>
          </h2>
          <p className="mt-2 text-sm text-gray-500">Aklında ne var? Sor, hemen çözsün.</p>
          <span className="mt-3 rounded-full bg-[#eef9f9] px-4 py-1.5 text-xs font-bold text-[#0E8FA3]">
            ✨ Her Gün Ücretsiz Kullanım Hakkı!
          </span>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { icon: "📷", title: "Görselden Soru Çözümü", desc: "Çözemediğin sorunun fotoğrafını çek, sana adım adım mantığını anlatsın." },
            { icon: "📅", title: "Sana Özel Planlama", desc: "Eksiklerine göre kişiselleştirilmiş haftalık çalışma programları hazırlat." },
            { icon: "💜", title: "Motivasyon ve Destek", desc: "Sınav stresini yönetmek istediğinde empatik bir koç gibi seni dinlesin." },
          ].map((f) => (
            <div key={f.title} className="flex gap-3">
              <span className="text-xl">{f.icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{f.title}</p>
                <p className="text-xs text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={goChat}
          className="mt-7 w-full rounded-2xl bg-[#123A57] py-3.5 text-sm font-bold text-white hover:bg-[#0d2a40] transition flex items-center justify-center gap-2"
        >
          Hemen Sohbet Et →
        </button>
      </div>
    </div>
  );
}
