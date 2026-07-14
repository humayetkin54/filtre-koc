"use client";

import { useRef, useState, useTransition } from "react";
import { uploadProfilePhoto, removeProfilePhoto } from "./photo-actions";

// Seçilen görseli tarayıcıda kare kırpıp 512px'e küçültür (JPEG) — telefon fotoğrafları sorunsuz yüklenir
async function toSquareJpeg(file: File): Promise<Blob> {
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise<HTMLImageElement>((res, rej) => {
      const i = new Image();
      i.onload = () => res(i);
      i.onerror = () => rej(new Error("Görsel okunamadı"));
      i.src = url;
    });
    const side = Math.min(img.width, img.height);
    const sx = (img.width - side) / 2;
    const sy = (img.height - side) / 2;
    const canvas = document.createElement("canvas");
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, sx, sy, side, side, 0, 0, 512, 512);
    return await new Promise<Blob>((res, rej) =>
      canvas.toBlob((b) => (b ? res(b) : rej(new Error("Dönüştürülemedi"))), "image/jpeg", 0.85)
    );
  } finally {
    URL.revokeObjectURL(url);
  }
}

export function ProfilePhotoCard({
  currentUrl,
  initials,
}: {
  currentUrl: string | null;
  initials: string;
}) {
  const [url, setUrl] = useState(currentUrl);
  const [err, setErr] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const inputRef = useRef<HTMLInputElement>(null);

  function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setErr(null);
    startTransition(async () => {
      try {
        const blob = await toSquareJpeg(file);
        const fd = new FormData();
        fd.append("photo", new File([blob], "avatar.jpg", { type: "image/jpeg" }));
        const res = await uploadProfilePhoto(fd);
        if (res?.error) setErr(res.error);
        else if (res?.url) setUrl(res.url);
      } catch {
        setErr("Bu görsel işlenemedi — JPG veya PNG bir fotoğraf deneyin.");
      }
    });
  }

  function onRemove() {
    if (pending) return;
    setErr(null);
    startTransition(async () => {
      const res = await removeProfilePhoto();
      if (res?.error) setErr(res.error);
      else setUrl(null);
    });
  }

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="font-semibold text-gray-900">Profil Fotoğrafı</h2>
      <p className="mt-1 text-sm text-gray-500">
        Koçsan fotoğrafın koç kartında ve profil sayfanda görünür.
      </p>

      <div className="mt-4 flex items-center gap-5">
        {/* Önizleme */}
        <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#123A57] text-2xl font-bold text-white ring-4 ring-gray-100">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Profil fotoğrafı" className="h-full w-full object-cover" />
          ) : (
            initials
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={pending}
            className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0c7d8f] disabled:opacity-50"
          >
            {pending ? "Yükleniyor…" : url ? "Fotoğrafı Değiştir" : "Fotoğraf Yükle"}
          </button>
          {url && (
            <button
              type="button"
              onClick={onRemove}
              disabled={pending}
              className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
            >
              Kaldır
            </button>
          )}
        </div>
      </div>

      <input ref={inputRef} type="file" accept="image/*" onChange={onPick} className="hidden" />
      {err && <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{err}</p>}
      <p className="mt-3 text-xs text-gray-400">JPG/PNG/WebP · otomatik kare kırpılır · en fazla 5MB</p>
    </div>
  );
}
