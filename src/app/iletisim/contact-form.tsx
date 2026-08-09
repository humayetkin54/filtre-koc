"use client";

import { useRef, useState, useTransition } from "react";
import { submitContactMessage } from "./actions";

const INPUT_CLASS =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const fd = new FormData(formRef.current!);
    setError("");
    startTransition(async () => {
      const result = await submitContactMessage(fd);
      if (result?.error) setError(result.error);
      else setDone(true);
    });
  }

  if (done) {
    return (
      <div className="mt-8 rounded-2xl bg-emerald-50 px-6 py-10 text-center">
        <p className="mb-3 text-3xl">✓</p>
        <p className="font-semibold text-emerald-800">Mesajın ulaştı!</p>
        <p className="mt-2 text-sm text-emerald-600">
          En kısa sürede e-posta ile dönüş yapacağız.
        </p>
      </div>
    );
  }

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="mt-8 space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Adınız</label>
        <input type="text" name="name" required placeholder="Ada Yılmaz" className={INPUT_CLASS} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">E-posta</label>
        <input type="email" name="email" required placeholder="ada@ornek.com" className={INPUT_CLASS} />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Konu</label>
        <select name="subject" className={INPUT_CLASS}>
          <option value="">Seçin...</option>
          <option>Koç eşleştirme</option>
          <option>Fiyatlandırma</option>
          <option>Teknik sorun</option>
          <option>Diğer</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Mesajınız</label>
        <textarea
          rows={4}
          name="message"
          required
          placeholder="Mesajınızı yazın..."
          className={`${INPUT_CLASS} resize-none`}
        />
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          ⚠️ {error}
        </div>
      )}

      <button type="submit" disabled={isPending} className="btn-primary w-full py-3 disabled:opacity-60">
        {isPending ? "Gönderiliyor..." : "Gönder"}
      </button>
    </form>
  );
}
