"use client";

import { useState, useTransition } from "react";
import { ResultsTabs } from "@/app/ogrenci-paneli/deneme/results-tabs";
import { sendMessageAsCoach } from "@/app/ogrenci-paneli/actions";
import {
  addScheduleEntry,
  deleteScheduleEntry,
  addHomework,
  deleteHomework,
  saveCoachNote,
  deleteCoachNote,
  updateAppointmentStatus,
  markStudentMessagesRead,
  applyAiProgram,
} from "../../actions";

/* ── Tipler ── */
interface DenemeResult {
  id: string;
  exam_date: string;
  exam_name: string;
  net_total: number | null;
  obp: number | null;
  tyt_score: number | null;
  nets: Record<string, number> | null;
  notes: string | null;
}

interface ScheduleEntry {
  id: string;
  day_of_week: number;
  time_slot: string;
  subject: string;
  topic: string | null;
}

interface HomeworkItem {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  status: string;
  created_at: string;
}

interface MessageItem {
  id: string;
  sender_role: string;
  content: string;
  created_at: string;
}

interface AppointmentItem {
  id: string;
  date: string;
  time: string;
  status: string;
  note: string | null;
  meeting_link?: string | null;
}

interface CoachNote {
  id: string;
  content: string;
  created_at: string;
}

interface AiScan {
  id: string;
  exam_name: string;
  exam_date: string;
  analysis_text: string | null;
  program_suggestion: { gun: number; saat: string; ders: string; konu: string }[] | null;
}

const DAYS = [
  { key: 1, label: "Pazartesi" }, { key: 2, label: "Salı" }, { key: 3, label: "Çarşamba" },
  { key: 4, label: "Perşembe" }, { key: 5, label: "Cuma" }, { key: 6, label: "Cumartesi" }, { key: 0, label: "Pazar" },
];
const SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];
const SUBJECTS = ["Matematik", "Geometri", "Türkçe", "Edebiyat", "Fizik", "Kimya", "Biyoloji", "Tarih", "Coğrafya", "Felsefe", "Din Kültürü", "Yabancı Dil", "Tekrar", "Deneme"];

const SUBJECT_COLORS: Record<string, string> = {
  "Matematik": "bg-blue-100 text-blue-800 border-blue-200",
  "Türkçe": "bg-red-100 text-red-800 border-red-200",
  "Fizik": "bg-purple-100 text-purple-800 border-purple-200",
  "Kimya": "bg-green-100 text-green-800 border-green-200",
  "Biyoloji": "bg-emerald-100 text-emerald-800 border-emerald-200",
  "Tarih": "bg-amber-100 text-amber-800 border-amber-200",
  "Coğrafya": "bg-orange-100 text-orange-800 border-orange-200",
  "Geometri": "bg-indigo-100 text-indigo-800 border-indigo-200",
};

interface ReadingSession {
  wpm: number;
  comprehension: number;
  effectiveWpm: number;
  title: string;
  date: string;
}

const TABS = [
  { key: "deneme", label: "📝 Denemeler" },
  { key: "program", label: "📅 Ders Programı" },
  { key: "odev", label: "✅ Ödevler" },
  { key: "hizliokuma", label: "👁️ Hızlı Okuma" },
  { key: "mesaj", label: "💬 Mesajlar" },
  { key: "randevu", label: "🗓 Randevular" },
  { key: "not", label: "🔒 Notlarım" },
] as const;

export function StudentTabs({
  studentId,
  denemeler,
  schedule,
  homework,
  messages,
  appointments,
  coachNotes,
  unreadMessages = 0,
  aiScan = null,
  readingSessions = [],
}: {
  studentId: string;
  denemeler: DenemeResult[];
  schedule: ScheduleEntry[];
  homework: HomeworkItem[];
  messages: MessageItem[];
  appointments: AppointmentItem[];
  coachNotes: CoachNote[];
  unreadMessages?: number;
  aiScan?: AiScan | null;
  readingSessions?: ReadingSession[];
}) {
  const [tab, setTabState] = useState<string>("deneme");
  const [isPending, startTransition] = useTransition();
  const [noteText, setNoteText] = useState("");
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [unreadHidden, setUnreadHidden] = useState(false);
  const unreadCount = unreadHidden ? 0 : unreadMessages;

  function setTab(key: string) {
    setTabState(key);
    if (key === "mesaj" && unreadCount > 0) {
      setUnreadHidden(true);
      startTransition(() => markStudentMessagesRead(studentId));
    }
  }

  const grid: Record<number, Record<string, ScheduleEntry>> = {};
  for (const e of schedule) {
    if (!grid[e.day_of_week]) grid[e.day_of_week] = {};
    grid[e.day_of_week][e.time_slot] = e;
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" });
  }
  function fmtTime(d: string) {
    const date = new Date(d);
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + " " +
      date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  const pendingHw = homework.filter(h => h.status === "pending");
  const completedHw = homework.filter(h => h.status === "completed");

  return (
    <div className="space-y-4">
      {/* Sekmeler */}
      <div className="flex flex-wrap gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => setTab(t.key)}
            className={`relative rounded-xl px-4 py-2 text-sm font-bold transition ${
              tab === t.key
                ? "bg-[#123A57] text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-[#0E8FA3] hover:text-[#0E8FA3]"
            }`}
          >
            {t.label}
            {t.key === "mesaj" && unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── DENEMELER ── */}
      {tab === "deneme" && (
        denemeler.length === 0 ? (
          <Empty text="Öğrenci henüz deneme sonucu girmemiş." />
        ) : (
          <ResultsTabs results={denemeler} readOnly />
        )
      )}

      {/* ── DERS PROGRAMI ── */}
      {tab === "program" && (
        <div className="space-y-4">
          {/* AI program önerisi */}
          {aiScan && (aiScan.program_suggestion ?? []).length > 0 && (
            <div className="rounded-2xl border-2 border-[#0E8FA3]/30 bg-[#eef9f9] p-5">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                <h3 className="text-sm font-bold text-[#123A57]">
                  🤖 AI Program Önerisi
                  <span className="ml-2 font-normal text-xs text-gray-500">
                    ({new Date(aiScan.exam_date).toLocaleDateString("tr-TR")} tarihli {aiScan.exam_name} denemesinden)
                  </span>
                </h3>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => {
                    if (confirm("Mevcut program silinip AI önerisi uygulanacak. Onaylıyor musun?")) {
                      startTransition(() => applyAiProgram(aiScan.id, studentId));
                    }
                  }}
                  className="rounded-xl bg-[#0E8FA3] px-4 py-2 text-xs font-bold text-white hover:bg-[#0c7689] transition disabled:opacity-50"
                >
                  {isPending ? "Uygulanıyor..." : "✓ Programa Uygula"}
                </button>
              </div>
              {aiScan.analysis_text && (
                <p className="text-xs text-gray-600 mb-3 italic">&ldquo;{aiScan.analysis_text}&rdquo;</p>
              )}
              <div className="flex flex-wrap gap-1.5">
                {(aiScan.program_suggestion ?? []).map((p, i) => (
                  <span key={i} className="rounded-lg bg-white border border-[#0E8FA3]/20 px-2 py-1 text-[11px] text-gray-700">
                    <span className="font-bold">{DAYS.find(d => d.key === p.gun)?.label ?? p.gun}</span> {p.saat} · {p.ders}
                    {p.konu && <span className="text-gray-400"> ({p.konu})</span>}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Yeni ders ekle */}
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Programa Ders Ekle</h3>
            <form
              action={(fd) => startTransition(() => addScheduleEntry(fd))}
              className="grid grid-cols-2 sm:grid-cols-5 gap-3 items-end"
            >
              <input type="hidden" name="student_id" value={studentId} />
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Gün</label>
                <select name="day_of_week" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]">
                  {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Saat</label>
                <select name="time_slot" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]">
                  {SLOTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Ders</label>
                <select name="subject" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]">
                  {SUBJECTS.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Konu (isteğe bağlı)</label>
                <input type="text" name="topic" placeholder="Örn: Türev" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
              </div>
              <button
                type="submit"
                disabled={isPending}
                className="rounded-xl bg-[#0E8FA3] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition disabled:opacity-50"
              >
                Ekle
              </button>
            </form>
          </div>

          {/* Haftalık grid */}
          {schedule.length === 0 ? (
            <Empty text="Henüz program oluşturulmadı. Yukarıdan ders ekleyerek başla." />
          ) : (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="border-b border-gray-100 bg-gray-50">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold text-gray-400 w-16">Saat</th>
                      {DAYS.map(d => (
                        <th key={d.key} className="px-3 py-3 text-center font-semibold text-gray-600">{d.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {SLOTS.map(slot => (
                      <tr key={slot}>
                        <td className="px-3 py-2 text-gray-400 font-mono">{slot}</td>
                        {DAYS.map(d => {
                          const cell = grid[d.key]?.[slot];
                          const colorClass = cell ? (SUBJECT_COLORS[cell.subject] ?? "bg-teal-100 text-teal-800 border-teal-200") : "";
                          return (
                            <td key={d.key} className="px-1.5 py-1.5 text-center">
                              {cell ? (
                                <div className={`group relative rounded-lg border px-2 py-1.5 ${colorClass}`}>
                                  <p className="font-bold text-[11px] leading-tight">{cell.subject}</p>
                                  {cell.topic && <p className="text-[10px] opacity-75 truncate max-w-[80px]">{cell.topic}</p>}
                                  <button
                                    type="button"
                                    disabled={isPending}
                                    onClick={() => startTransition(() => deleteScheduleEntry(cell.id, studentId))}
                                    className="absolute -top-1.5 -right-1.5 hidden group-hover:flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold"
                                    title="Kaldır"
                                  >
                                    ×
                                  </button>
                                </div>
                              ) : (
                                <div className="h-9" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="px-4 py-2 text-[11px] text-gray-400 border-t border-gray-50">Bir dersi kaldırmak için üzerine gel ve × işaretine tıkla.</p>
            </div>
          )}
        </div>
      )}

      {/* ── ÖDEVLER ── */}
      {tab === "odev" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <h3 className="text-sm font-bold text-gray-700 mb-3">Yeni Ödev Ver</h3>
            <form action={(fd) => startTransition(() => addHomework(fd))} className="space-y-3">
              <input type="hidden" name="student_id" value={studentId} />
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Başlık</label>
                  <input type="text" name="title" required placeholder="Örn: 50 paragraf sorusu çöz" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">Son Teslim</label>
                  <input type="date" name="due_date" className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">Açıklama (isteğe bağlı)</label>
                <textarea name="description" rows={2} placeholder="Detay ekle..." className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] resize-none" />
              </div>
              <button type="submit" disabled={isPending} className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition disabled:opacity-50">
                Ödevi Ver
              </button>
            </form>
          </div>

          {homework.length === 0 ? (
            <Empty text="Henüz ödev verilmedi." />
          ) : (
            <div className="space-y-2">
              {[...pendingHw, ...completedHw].map(hw => {
                const overdue = hw.due_date && hw.status !== "completed" && new Date(hw.due_date) < new Date(new Date().toDateString());
                return (
                  <div key={hw.id} className={`flex items-start gap-3 rounded-2xl border bg-white p-4 ${hw.status === "completed" ? "opacity-60" : ""}`}>
                    <span className={`mt-0.5 text-lg ${hw.status === "completed" ? "" : "grayscale"}`}>
                      {hw.status === "completed" ? "✅" : "⬜"}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold text-gray-900 ${hw.status === "completed" ? "line-through" : ""}`}>{hw.title}</p>
                      {hw.description && <p className="text-xs text-gray-500 mt-0.5">{hw.description}</p>}
                      {hw.due_date && (
                        <p className={`mt-1 text-[11px] font-medium ${overdue ? "text-red-500" : "text-gray-400"}`}>
                          {overdue ? "⚠ Gecikti — " : "📅 "}Son teslim: {fmtDate(hw.due_date)}
                        </p>
                      )}
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                      hw.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                    }`}>
                      {hw.status === "completed" ? "Tamamlandı" : "Bekliyor"}
                    </span>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => startTransition(() => deleteHomework(hw.id, studentId))}
                      className="shrink-0 text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ── MESAJLAR ── */}
      {tab === "mesaj" && (
        <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
          <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 480 }}>
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full py-16 text-center">
                <p className="text-sm text-gray-400">Henüz mesaj yok. İlk mesajı gönder!</p>
              </div>
            ) : (
              messages.map(msg => {
                const isCoachMsg = msg.sender_role === "coach";
                return (
                  <div key={msg.id} className={`flex ${isCoachMsg ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                      isCoachMsg ? "bg-[#123A57] text-white rounded-br-sm" : "bg-gray-100 text-gray-900 rounded-bl-sm"
                    }`}>
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      <p className={`mt-1 text-[10px] ${isCoachMsg ? "text-white/60" : "text-gray-400"}`}>
                        {fmtTime(msg.created_at)}
                      </p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <div className="border-t border-gray-100 p-4">
            <form action={(fd) => startTransition(() => sendMessageAsCoach(fd))} className="flex gap-3">
              <input type="hidden" name="student_id" value={studentId} />
              <textarea
                name="content"
                required
                rows={2}
                placeholder="Öğrencine mesaj yaz..."
                className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] resize-none"
              />
              <button
                type="submit"
                disabled={isPending}
                className="self-end rounded-xl bg-[#123A57] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0d2a40] transition disabled:opacity-50"
              >
                Gönder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── RANDEVULAR ── */}
      {tab === "randevu" && (
        appointments.length === 0 ? (
          <Empty text="Bu öğrenciyle randevu yok." />
        ) : (
          <div className="space-y-2">
            {appointments.map(a => {
              const isPast = new Date(a.date) < new Date(new Date().toDateString());
              const statusStyle =
                a.status === "confirmed" ? "bg-emerald-50 text-emerald-700"
                : a.status === "cancelled" ? "bg-red-50 text-red-600"
                : "bg-amber-50 text-amber-700";
              const statusLabel =
                a.status === "confirmed" ? "Onaylandı" : a.status === "cancelled" ? "İptal" : "Bekliyor";
              return (
                <div key={a.id} className={`flex flex-wrap items-center gap-3 rounded-2xl border bg-white p-4 ${isPast || a.status === "cancelled" ? "opacity-60" : ""}`}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">📅 {fmtDate(a.date)} · 🕐 {a.time}</p>
                    {a.note && <p className="text-xs text-gray-400 italic mt-0.5">&ldquo;{a.note}&rdquo;</p>}
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${statusStyle}`}>{statusLabel}</span>
                  {a.status === "confirmed" && !isPast && a.meeting_link && (
                    <a
                      href={a.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-lg bg-[#0E8FA3] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#0c7689] transition"
                    >
                      🎥 Bağlan
                    </a>
                  )}
                  {a.status === "pending" && !isPast && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => startTransition(() => updateAppointmentStatus(a.id, "confirmed"))}
                        className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-600 transition disabled:opacity-50"
                      >
                        Onayla
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => startTransition(() => updateAppointmentStatus(a.id, "cancelled"))}
                        className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-200 transition disabled:opacity-50"
                      >
                        İptal
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )
      )}

      {/* ── KOÇ NOTLARI ── */}
      {tab === "not" && (
        <div className="space-y-4">
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <h3 className="text-sm font-bold text-gray-700">
                {selectedNoteId ? "Not Detayı" : "Yeni Not"}
              </h3>
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[10px] font-semibold text-gray-500">
                🔒 Sadece sen görürsün
              </span>
              {selectedNoteId && (
                <button
                  type="button"
                  onClick={() => { setSelectedNoteId(null); setNoteText(""); }}
                  className="ml-auto rounded-lg bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600 hover:bg-gray-200 transition"
                >
                  + Yeni Not Yaz
                </button>
              )}
            </div>
            <form
              action={(fd) => startTransition(async () => {
                await saveCoachNote(fd);
                setNoteText("");
                setSelectedNoteId(null);
              })}
              className="space-y-3"
            >
              <input type="hidden" name="student_id" value={studentId} />
              <textarea
                name="content"
                rows={6}
                value={noteText}
                onChange={(e) => { setNoteText(e.target.value); setSelectedNoteId(null); }}
                placeholder="Öğrenci hakkında notların... (velisiyle görüşme, motivasyon durumu, dikkat edilecekler)"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] resize-none"
              />
              <button
                type="submit"
                disabled={isPending || !noteText.trim()}
                className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition disabled:opacity-50"
              >
                {isPending ? "Kaydediliyor..." : "Notu Kaydet"}
              </button>
            </form>
          </div>

          {/* Kayıtlı notlar listesi */}
          {coachNotes.length > 0 && (
            <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
              <p className="px-5 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide border-b border-gray-100 bg-gray-50/50">
                Kayıtlı Notlar ({coachNotes.length})
              </p>
              <div className="divide-y divide-gray-50">
                {coachNotes.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-center gap-3 px-5 py-3 cursor-pointer transition-colors ${
                      selectedNoteId === n.id ? "bg-[#eef9f9]" : "hover:bg-gray-50"
                    }`}
                    onClick={() => { setSelectedNoteId(n.id); setNoteText(n.content); }}
                  >
                    <span className="shrink-0 text-[11px] font-semibold text-gray-400 whitespace-nowrap">
                      {new Date(n.created_at).toLocaleDateString("tr-TR", { day: "2-digit", month: "2-digit", year: "numeric" })}{" "}
                      {new Date(n.created_at).toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <p className="flex-1 min-w-0 truncate text-sm text-gray-700">{n.content}</p>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={(e) => {
                        e.stopPropagation();
                        startTransition(() => deleteCoachNote(n.id, studentId));
                        if (selectedNoteId === n.id) { setSelectedNoteId(null); setNoteText(""); }
                      }}
                      className="shrink-0 text-xs text-red-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── HIZLI OKUMA ── */}
      {tab === "hizliokuma" && <HizliOkumaPanel sessions={readingSessions} />}
    </div>
  );
}

function HizliOkumaPanel({ sessions }: { sessions: ReadingSession[] }) {
  if (sessions.length === 0) {
    return <Empty text="Öğrenci henüz Hızlı Okuma testi çözmemiş. Sonuçlar geldikçe gelişimi burada görünür." />;
  }

  const last = sessions[sessions.length - 1];
  const first = sessions[0];
  const bestWpm = Math.max(...sessions.map((s) => s.wpm));
  const bestEff = Math.max(...sessions.map((s) => s.effectiveWpm));
  const wpmDelta = last.wpm - first.wpm;

  // Basit SVG çizgi grafiği (etkili hız)
  const W = 640, H = 180, pad = 30;
  const xs = sessions.length > 1 ? sessions.map((_, i) => pad + (i * (W - 2 * pad)) / (sessions.length - 1)) : [W / 2];
  const maxV = Math.max(...sessions.map((s) => s.effectiveWpm), 100);
  const ys = sessions.map((s) => H - pad - ((s.effectiveWpm / maxV) * (H - 2 * pad)));
  const path = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");

  return (
    <div className="space-y-4">
      {/* Özet kartlar */}
      <div className="grid gap-3 sm:grid-cols-4">
        <MiniStat label="Son Okuma Hızı" value={`${last.wpm}`} unit="WPM" color="#0E8FA3" />
        <MiniStat label="Son Anlama" value={`%${last.comprehension}`} unit="doğru oranı" color="#123A57" />
        <MiniStat label="En İyi Etkili Hız" value={`${bestEff}`} unit="WPM" color="#E2600F" />
        <MiniStat
          label="İlk teste göre"
          value={`${wpmDelta >= 0 ? "+" : ""}${wpmDelta}`}
          unit="WPM değişim"
          color={wpmDelta >= 0 ? "#059669" : "#dc2626"}
        />
      </div>

      {/* Grafik */}
      <div className="rounded-2xl border border-gray-200 bg-white p-5">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-sm font-bold text-gray-700">Etkili Hız Gelişimi</h3>
          <span className="text-xs text-gray-400">{sessions.length} test · en yüksek ham hız {bestWpm} WPM</span>
        </div>
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
          <line x1={pad} y1={H - pad} x2={W - pad} y2={H - pad} stroke="#e5e7eb" />
          <path d={path} fill="none" stroke="#E2600F" strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
          {xs.map((x, i) => (
            <circle key={i} cx={x} cy={ys[i]} r={3.5} fill="#E2600F" />
          ))}
        </svg>
      </div>

      {/* Son testler tablosu */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden">
        <p className="border-b border-gray-100 bg-gray-50/50 px-5 py-3 text-xs font-bold uppercase tracking-wide text-gray-500">
          Test Geçmişi
        </p>
        <div className="divide-y divide-gray-50">
          {[...sessions].reverse().slice(0, 12).map((s, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3 text-sm">
              <span className="w-24 shrink-0 text-[11px] font-semibold text-gray-400">
                {new Date(s.date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "2-digit" })}
              </span>
              <span className="flex-1 min-w-0 truncate text-gray-600">{s.title || "—"}</span>
              <span className="shrink-0 font-semibold text-[#0E8FA3]">{s.wpm} WPM</span>
              <span className="w-16 shrink-0 text-right text-gray-500">%{s.comprehension}</span>
              <span className="w-24 shrink-0 text-right font-bold text-[#E2600F]">{s.effectiveWpm} etkili</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value, unit, color }: { label: string; value: string; unit: string; color: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">{label}</p>
      <p className="mt-1 text-2xl font-bold" style={{ color }}>{value}</p>
      <p className="text-[11px] text-gray-400">{unit}</p>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-14 text-center">
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
