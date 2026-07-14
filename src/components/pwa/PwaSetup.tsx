"use client";

import { useEffect, useState } from "react";

const DISMISS_KEY = "rz_pwa_dismissed";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PwaSetup() {
  const [installEvt, setInstallEvt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    // Service worker kaydı
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (localStorage.getItem(DISMISS_KEY)) return;

    // Zaten uygulama olarak açıksa hiçbir şey gösterme
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-expect-error iOS Safari'ye özgü alan
      window.navigator.standalone === true;
    if (standalone) return;

    // Android/Chrome: kurulum olayını yakala
    const onPrompt = (e: Event) => {
      e.preventDefault();
      setInstallEvt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", onPrompt);

    // iOS Safari: yönerge ipucu
    const isIos = /iphone|ipad|ipod/i.test(window.navigator.userAgent);
    if (isIos) setShowIosHint(true);

    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setInstallEvt(null);
    setShowIosHint(false);
  }

  async function install() {
    if (!installEvt) return;
    await installEvt.prompt();
    dismiss();
  }

  if (!installEvt && !showIosHint) return null;

  return (
    <div className="fixed inset-x-3 bottom-3 z-[90] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-gray-200 bg-white p-3 shadow-2xl">
      <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-[#eef9f9] text-xl">📲</span>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-gray-900">Rekor Zeka&apos;yı yükle</p>
        <p className="text-xs text-gray-500">
          {installEvt
            ? "Ana ekranına ekle, uygulama gibi kullan."
            : "Safari'de Paylaş menüsünden “Ana Ekrana Ekle” de."}
        </p>
      </div>
      {installEvt && (
        <button
          type="button"
          onClick={install}
          className="rounded-xl bg-[#0E8FA3] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c7d8f]"
        >
          Yükle
        </button>
      )}
      <button
        type="button"
        onClick={dismiss}
        aria-label="Kapat"
        className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-gray-400 hover:bg-gray-100"
      >
        ✕
      </button>
    </div>
  );
}
