import { createClient, createAdminClient } from "@/lib/supabase/server";
import { toggleHomework } from "../actions";

export default async function OdevlerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: homework } = await admin
    .from("homework")
    .select("*")
    .eq("student_id", user!.id)
    .order("created_at", { ascending: false });

  const pending = (homework ?? []).filter(h => h.status === "pending");
  const completed = (homework ?? []).filter(h => h.status === "completed");

  function fmtDate(d: string) {
    return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
  }

  function isOverdue(d: string | null) {
    if (!d) return false;
    return new Date(d) < new Date(new Date().toDateString());
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">✅ Ödevlerim</h1>
        <p className="text-sm text-gray-500">Koçunun verdiği ödevleri tamamla ve işaretle.</p>
        <div className="mt-4 flex gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-amber-600">{pending.length}</p>
            <p className="text-xs text-gray-400">Bekliyor</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-emerald-600">{completed.length}</p>
            <p className="text-xs text-gray-400">Tamamlandı</p>
          </div>
        </div>
      </div>

      {(homework ?? []).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-4xl mb-3">📋</p>
          <p className="font-semibold text-gray-700">Henüz ödev yok</p>
          <p className="text-sm text-gray-400 mt-1">Koçun ödev verdiğinde burada görünecek.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {[...pending, ...completed].map(hw => (
            <div key={hw.id} className={`rounded-2xl border bg-white p-5 flex items-start gap-4 transition-opacity ${hw.status === "completed" ? "opacity-60" : ""}`}>
              <form action={toggleHomework.bind(null, hw.id, hw.status)}>
                <button
                  type="submit"
                  className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                    hw.status === "completed"
                      ? "border-emerald-400 bg-emerald-400 text-white"
                      : "border-gray-300 hover:border-[#0E8FA3]"
                  }`}
                >
                  {hw.status === "completed" && (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-3 h-3">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              </form>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-gray-900 ${hw.status === "completed" ? "line-through" : ""}`}>{hw.title}</p>
                {hw.description && <p className="text-sm text-gray-500 mt-0.5">{hw.description}</p>}
                {hw.due_date && (
                  <p className={`mt-1.5 text-xs font-medium ${isOverdue(hw.due_date) && hw.status !== "completed" ? "text-red-500" : "text-gray-400"}`}>
                    {isOverdue(hw.due_date) && hw.status !== "completed" ? "⚠ " : "📅 "}
                    Son teslim: {fmtDate(hw.due_date)}
                  </p>
                )}
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${
                hw.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
              }`}>
                {hw.status === "completed" ? "Tamamlandı" : "Bekliyor"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
