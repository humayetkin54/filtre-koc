"use client";

import { useState, useRef, useEffect, useTransition } from "react";
import { useRouter } from "next/navigation";
import { sendChatMessage, createChat, deleteChat } from "./actions";

interface ChatItem {
  id: string;
  title: string;
  created_at: string;
}
interface Message {
  id: string;
  role: string;
  content: string;
  has_image: boolean;
}

export function ChatUI({
  chats,
  activeChatId,
  initialMessages,
  remaining,
  dailyLimit,
}: {
  chats: ChatItem[];
  activeChatId: string | null;
  initialMessages: Message[];
  remaining: number;
  dailyLimit: number;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [left, setLeft] = useState(remaining);
  const [input, setInput] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => setMessages(initialMessages), [initialMessages]);
  useEffect(() => setLeft(remaining), [remaining]);
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isPending]);

  function pickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setPhoto(f);
    setPhotoPreview(URL.createObjectURL(f));
    setError(null);
  }

  function send() {
    const text = input.trim();
    if (!text && !photo) return;
    if (left <= 0) {
      setError(`Günlük mesaj limitiniz doldu (${dailyLimit}/${dailyLimit}). Hakkınız yarın yenilenecek.`);
      return;
    }
    setError(null);

    // İyimser: kullanıcı mesajını hemen göster
    const optimistic: Message = {
      id: "temp-" + Date.now(),
      role: "user",
      content: text || "📷 Görsel soru gönderildi",
      has_image: !!photo,
    };
    setMessages((m) => [...m, optimistic]);

    const fd = new FormData();
    fd.set("message", text);
    if (activeChatId) fd.set("chat_id", activeChatId);
    if (photo) fd.set("image", photo);

    setInput("");
    setPhoto(null);
    setPhotoPreview(null);

    startTransition(async () => {
      const res = await sendChatMessage(fd);
      if ("error" in res) {
        setError(res.error);
        setMessages((m) => m.filter((x) => x.id !== optimistic.id));
        return;
      }
      setLeft(res.remaining);
      // Yeni sohbet oluştuysa URL'yi güncelle; değilse mesajları tazele
      if (!activeChatId) {
        router.push(`/ogrenci-paneli/ai-asistan?chat=${res.chatId}`);
      } else {
        router.refresh();
      }
    });
  }

  function newChat() {
    startTransition(async () => {
      const { id } = await createChat();
      router.push(`/ogrenci-paneli/ai-asistan?chat=${id}`);
    });
  }

  function removeChat(id: string) {
    startTransition(async () => {
      await deleteChat(id);
      router.push("/ogrenci-paneli/ai-asistan");
    });
  }

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      {/* Sohbet listesi */}
      <aside className={`${sidebarOpen ? "flex" : "hidden"} lg:flex w-64 shrink-0 flex-col rounded-2xl border border-gray-200 bg-white p-3`}>
        <button
          onClick={newChat}
          disabled={isPending}
          className="mb-3 rounded-xl bg-[#123A57] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0d2a40] transition disabled:opacity-50"
        >
          + Yeni Sohbet
        </button>
        <p className="px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">Geçmiş</p>
        <div className="flex-1 overflow-y-auto space-y-1">
          {chats.length === 0 ? (
            <p className="px-2 py-4 text-xs text-gray-400">Henüz sohbet yok.</p>
          ) : (
            chats.map((c) => (
              <div
                key={c.id}
                className={`group flex items-center gap-2 rounded-xl px-3 py-2 cursor-pointer transition ${
                  c.id === activeChatId ? "bg-[#eef9f9]" : "hover:bg-gray-50"
                }`}
                onClick={() => router.push(`/ogrenci-paneli/ai-asistan?chat=${c.id}`)}
              >
                <span className="text-sm">💬</span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-700">{c.title}</p>
                  <p className="text-[10px] text-gray-400">
                    {new Date(c.created_at).toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}
                  </p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); removeChat(c.id); }}
                  className="hidden group-hover:block text-xs text-red-300 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* Sohbet alanı */}
      <div className="flex flex-1 flex-col rounded-2xl border border-gray-200 bg-white overflow-hidden">
        {/* Başlık */}
        <div className="flex items-center justify-between border-b border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <button onClick={() => setSidebarOpen((s) => !s)} className="lg:hidden text-gray-400">☰</button>
            <span className="text-lg">🤖</span>
            <h1 className="font-bold text-gray-900">Rekor Zeka AI Asistan</h1>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-bold text-blue-600">BETA</span>
          </div>
          <span className={`rounded-full px-3 py-1 text-xs font-bold ${left > 0 ? "bg-[#eef9f9] text-[#0E8FA3]" : "bg-red-50 text-red-500"}`}>
            Kalan: {left}/{dailyLimit}
          </span>
        </div>

        {/* Mesajlar */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center px-6">
              <div className="mb-4 h-16 w-16 rounded-full bg-gradient-to-br from-[#123A57] to-[#0E8FA3] flex items-center justify-center text-2xl">🤖</div>
              <h2 className="text-lg font-bold text-gray-900">Merhaba! Ben AI Asistanın</h2>
              <p className="mt-1 text-sm text-gray-500 max-w-sm">
                Çözemediğin sorunun fotoğrafını çek, çalışma planı iste ya da sınav kaygın hakkında konuş. Sana yardımcı olayım!
              </p>
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {["📷 Bu soruyu çöz", "📅 Haftalık plan öner", "💪 Motivasyona ihtiyacım var"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setInput(s.replace(/^[^\s]+\s/, ""))}
                    className="rounded-full border border-gray-200 px-3 py-1.5 text-xs text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3] transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div key={m.id} className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    isUser ? "bg-[#0E8FA3] text-white rounded-br-sm" : "bg-gray-50 text-gray-800 rounded-bl-sm border border-gray-100"
                  }`}>
                    {m.has_image && isUser && <p className="mb-1 text-xs opacity-80">📷 Görsel eklendi</p>}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{m.content}</p>
                  </div>
                </div>
              );
            })
          )}
          {isPending && (
            <div className="flex justify-start">
              <div className="rounded-2xl bg-gray-50 border border-gray-100 px-4 py-3">
                <span className="flex gap-1">
                  <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="h-2 w-2 rounded-full bg-gray-300 animate-bounce" style={{ animationDelay: "300ms" }} />
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Girdi */}
        <div className="border-t border-gray-100 p-3">
          {left <= 0 && (
            <div className="mb-2 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-800">
              <span className="text-base">⏳</span>
              Günlük mesaj limitiniz doldu ({dailyLimit}/{dailyLimit}). Hakkınız yarın yenilenecek.
            </div>
          )}
          {error && <p className="mb-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600">{error}</p>}
          {photoPreview && (
            <div className="mb-2 flex items-center gap-2">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photoPreview} alt="soru" className="h-14 w-14 rounded-lg border border-gray-200 object-cover" />
              <button onClick={() => { setPhoto(null); setPhotoPreview(null); }} className="text-xs text-red-400 hover:text-red-600">Kaldır</button>
            </div>
          )}
          <div className="flex items-end gap-2">
            <label className="flex h-10 w-10 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-gray-200 text-gray-400 hover:border-[#0E8FA3] hover:text-[#0E8FA3] transition">
              📎
              <input type="file" accept="image/*" onChange={pickPhoto} className="hidden" />
            </label>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
              rows={1}
              placeholder="AI Asistan'a bir şey sor..."
              disabled={isPending || left <= 0}
              className="flex-1 resize-none rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] disabled:bg-gray-50"
            />
            <button
              onClick={send}
              disabled={isPending || left <= 0 || (!input.trim() && !photo)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#0E8FA3] text-white hover:bg-[#0c7689] transition disabled:opacity-40"
            >
              ↑
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
