import { createClient, createAdminClient } from "@/lib/supabase/server";
import { sendMessage } from "../actions";

export default async function MesajlarPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: purchase } = await admin
    .from("purchases")
    .select("coach_id, coach_name")
    .eq("user_id", user!.id)
    .eq("status", "active")
    .not("coach_id", "is", null)
    .maybeSingle();

  const { data: messages } = purchase
    ? await admin
        .from("messages")
        .select("*")
        .eq("student_id", user!.id)
        .order("created_at", { ascending: true })
    : { data: [] };

  // Mark coach messages as read
  if (purchase && (messages ?? []).some(m => m.sender_role === "coach" && !m.read_at)) {
    await admin
      .from("messages")
      .update({ read_at: new Date().toISOString() })
      .eq("student_id", user!.id)
      .eq("sender_role", "coach")
      .is("read_at", null);
  }

  function fmtTime(d: string) {
    const date = new Date(d);
    const today = new Date();
    const isToday = date.toDateString() === today.toDateString();
    if (isToday) return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" }) + " " + date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
  }

  if (!purchase) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h1 className="text-xl font-bold text-gray-900 mb-1">💬 Mesajlaşma</h1>
          <p className="text-sm text-gray-500">Koçunla doğrudan iletişim kur.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-semibold text-gray-700">Henüz koçun atanmamış</p>
          <p className="text-sm text-gray-400 mt-1">Koçun atandıktan sonra mesajlaşabilirsin.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">💬 Mesajlaşma</h1>
        <p className="text-sm text-gray-500">
          Koçun: <span className="font-semibold text-[#0E8FA3]">{purchase.coach_name}</span>
        </p>
      </div>

      {/* Mesaj listesi */}
      <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden flex flex-col" style={{ minHeight: 400 }}>
        <div className="flex-1 p-4 space-y-3 overflow-y-auto" style={{ maxHeight: 480 }}>
          {(messages ?? []).length === 0 ? (
            <div className="flex items-center justify-center h-full py-16 text-center">
              <div>
                <p className="text-3xl mb-2">✉️</p>
                <p className="text-sm text-gray-400">Henüz mesaj yok. Koçuna ilk mesajı gönder!</p>
              </div>
            </div>
          ) : (
            (messages ?? []).map(msg => {
              const isStudent = msg.sender_role === "student";
              return (
                <div key={msg.id} className={`flex ${isStudent ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    isStudent
                      ? "bg-[#0E8FA3] text-white rounded-br-sm"
                      : "bg-gray-100 text-gray-900 rounded-bl-sm"
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                    <p className={`mt-1 text-[10px] ${isStudent ? "text-white/60" : "text-gray-400"}`}>
                      {fmtTime(msg.created_at)}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mesaj gönder */}
        <div className="border-t border-gray-100 p-4">
          <form action={sendMessage} className="flex gap-3">
            <textarea
              name="content"
              required
              rows={2}
              placeholder="Koçuna mesaj yaz..."
              className="flex-1 rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] resize-none"
            />
            <button
              type="submit"
              className="self-end rounded-xl bg-[#0E8FA3] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition flex items-center gap-1.5"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
              Gönder
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
