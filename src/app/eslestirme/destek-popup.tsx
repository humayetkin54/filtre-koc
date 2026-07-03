"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function DestekPopup() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("destek_popup_dismissed");
    if (!dismissed) setVisible(true);
  }, []);

  function dismiss() {
    localStorage.setItem("destek_popup_dismissed", "1");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-2xl overflow-hidden">

        {/* Üst gradient şerit */}
        <div className="h-1.5 w-full bg-gradient-to-r from-[#0E8FA3] to-[#123A57]" />

        <div className="px-7 py-8 text-center">

          {/* İkon */}
          <div className="mx-auto mb-5 w-16 h-16 rounded-full bg-[#eef9f9] flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={1.8} className="w-8 h-8">
              <circle cx="12" cy="12" r="10" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01" />
              <circle cx="12" cy="12" r="4" />
              <path strokeLinecap="round" d="M4.93 4.93l3.54 3.54M15.54 15.54l3.53 3.53M19.07 4.93l-3.53 3.54M8.46 15.54l-3.53 3.53" />
            </svg>
          </div>

          {/* Başlık */}
          <h2 className="text-xl font-bold text-[#1e293b] mb-3">
            Yeni Destek Merkezimiz Yayında! 🎉
          </h2>

          {/* Açıklama */}
          <p className="text-sm text-gray-500 leading-relaxed mb-5">
            Rekor Zeka deneyiminizi daha sorunsuz hale getirmek için{" "}
            <strong className="text-gray-700">Destek ve Hata Bildirim</strong>{" "}
            sistemimizi devreye aldık.
          </p>

          {/* Bilgi kutusu */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 text-left mb-4 text-sm text-gray-600 leading-relaxed">
            Teknik sorunlar, satın alma veya paket süresi ile ilgili tüm
            taleplerinizi artık tek bir merkezden iletebilir, süreçleri
            detaylı olarak takip edebilirsiniz.
          </div>

          {/* İpucu */}
          <div className="rounded-xl bg-[#eef9f9] border border-[#0E8FA3]/20 p-3.5 text-left mb-6 flex gap-3">
            <div className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-[#0E8FA3]/20 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={2.5} className="w-3 h-3">
                <circle cx="12" cy="12" r="10" />
                <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
              </svg>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Destek kaydı oluşturmak için sağ üst köşede veya menüde bulunan{" "}
              <Link href="/destek" onClick={dismiss} className="inline-flex items-center gap-1 mx-0.5 rounded-full bg-white border border-[#0E8FA3]/30 px-2 py-0.5 text-[#0E8FA3] font-semibold text-[11px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-3 h-3">
                  <circle cx="12" cy="12" r="10" />
                  <path strokeLinecap="round" d="M12 8v4m0 4h.01" />
                </svg>
                Destek Merkezi
              </Link>{" "}
              ikonuna tıklamanız yeterlidir. Uzman ekibimiz en kısa sürede
              size geri dönüş sağlayacaktır.
            </p>
          </div>

          {/* Buton */}
          <button
            onClick={dismiss}
            className="w-full rounded-xl bg-[#0E8FA3] px-6 py-3.5 text-sm font-bold text-white transition hover:bg-[#0c7689] flex items-center justify-center gap-2"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            Okudum, anladım
          </button>
        </div>
      </div>
    </div>
  );
}
