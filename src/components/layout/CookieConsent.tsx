"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CONSENT_EVENT, clearConsent, readConsent, setConsent } from "@/lib/consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(readConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white/95 px-4 py-4 shadow-[0_-4px_24px_rgba(0,0,0,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-gray-600">
          Platformun çalışması için zorunlu çerezleri kullanıyoruz. Bunun dışında, reklam
          performansımızı ölçmek için <strong className="text-gray-800">pazarlama çerezleri</strong>{" "}
          (Meta Pixel) kullanmak istiyoruz. Bunlar yalnızca onay verirsen çalışır.{" "}
          <Link href="/gizlilik" className="font-semibold text-[#0E8FA3] underline underline-offset-2">
            Detaylar
          </Link>
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("rejected")}
            className="rounded-xl border border-gray-200 px-4 py-2.5 text-xs font-semibold text-gray-600 transition hover:bg-gray-50"
          >
            Sadece zorunlu
          </button>
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#0b7a8c]"
          >
            Kabul et
          </button>
        </div>
      </div>
    </div>
  );
}

/** Footer'a konur — kullanıcı rızasını sonradan değiştirebilsin diye (KVKK: rıza geri alınabilir). */
export function CookiePreferencesButton({ className = "" }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => {
        clearConsent();
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      }}
      className={className}
      title="Çerez seçimini yeniden yap"
    >
      Çerez tercihleri
    </button>
  );
}
