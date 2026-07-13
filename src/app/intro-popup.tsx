"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

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
      <div className="relative w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
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

        {/* Site ikonu en üstte */}
        <Image
          src="/logo.png"
          alt="Rekor Zeka"
          width={200}
          height={200}
          className="mx-auto mb-4 h-20 w-20 object-contain"
        />

        <span className="inline-block rounded-full bg-[#123A57] px-5 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
          Erken Kayıt Fırsatı
        </span>

        <h2 className="mt-4 text-2xl font-bold leading-snug text-gray-900 sm:text-3xl">
          2027 Kontenjanlarımız Açıldı!
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-gray-500">
          Sınırlı sayıdaki kontenjanlarda yerini ayırt, Rekor Zeka&apos;nın profesyonel
          koçlarıyla hedeflerine bir adım önde başla.
        </p>

        <a
          href="/paketler"
          onClick={close}
          className="mt-6 block w-full rounded-xl bg-[#0E8FA3] py-3.5 text-base font-bold text-white transition-colors hover:bg-[#0c7d8f]"
        >
          Paketleri İncele
        </a>
      </div>
    </div>
  );
}
