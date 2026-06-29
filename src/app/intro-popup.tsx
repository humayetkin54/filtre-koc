"use client";

import { useEffect, useState } from "react";

export function IntroPopup() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("intro-popup-seen")) return;
    const timer = setTimeout(() => setOpen(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  function close() {
    setOpen(false);
    sessionStorage.setItem("intro-popup-seen", "1");
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4"
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="relative w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Kapat"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-4xl">
          🧠
        </div>

        <h2 className="text-xl font-bold text-gray-900">
          Ücretsiz uzman görüşmesi ister misin?
        </h2>
        <p className="mt-3 text-sm text-gray-500 leading-relaxed">
          PDR koordinatörlerimizle 30 dakikalık ücretsiz ön görüşme yap, hedefini ve çalışma planını birlikte belirleyelim.
        </p>

        <a
          href="/on-gorusme"
          onClick={close}
          className="btn-primary mt-6 w-full py-3.5"
        >
          Tıkla, hemen görüş →
        </a>
      </div>
    </div>
  );
}
