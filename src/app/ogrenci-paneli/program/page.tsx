import { createClient, createAdminClient } from "@/lib/supabase/server";

const DAYS = [
  { key: 1, label: "Pazartesi" }, { key: 2, label: "Salı" }, { key: 3, label: "Çarşamba" },
  { key: 4, label: "Perşembe" }, { key: 5, label: "Cuma" }, { key: 6, label: "Cumartesi" }, { key: 0, label: "Pazar" },
];

const SLOTS = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00","20:00"];

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

export default async function ProgramPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: schedule } = await admin
    .from("study_schedule")
    .select("*")
    .eq("student_id", user!.id);

  const grid: Record<string, Record<string, { subject: string; topic: string | null }>> = {};
  for (const item of schedule ?? []) {
    if (!grid[item.day_of_week]) grid[item.day_of_week] = {};
    grid[item.day_of_week][item.time_slot] = { subject: item.subject, topic: item.topic };
  }

  const hasData = Object.keys(grid).length > 0;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">📅 Haftalık Ders Programı</h1>
        <p className="text-sm text-gray-500">Koçun tarafından hazırlanan haftalık çalışma planın.</p>
      </div>

      {!hasData ? (
        <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
          <p className="text-4xl mb-3">📅</p>
          <p className="font-semibold text-gray-700">Henüz ders programı oluşturulmadı</p>
          <p className="text-sm text-gray-400 mt-1">Koçun ders programını oluşturduğunda burada görünecek.</p>
        </div>
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
                  <tr key={slot} className="hover:bg-gray-50/30">
                    <td className="px-3 py-2 text-gray-400 font-mono">{slot}</td>
                    {DAYS.map(d => {
                      const cell = grid[d.key]?.[slot];
                      const colorClass = cell ? (SUBJECT_COLORS[cell.subject] ?? "bg-teal-100 text-teal-800 border-teal-200") : "";
                      return (
                        <td key={d.key} className="px-1.5 py-1.5 text-center">
                          {cell ? (
                            <div className={`rounded-lg border px-2 py-1.5 ${colorClass}`}>
                              <p className="font-bold text-[11px] leading-tight">{cell.subject}</p>
                              {cell.topic && <p className="text-[10px] opacity-75 truncate max-w-[80px]">{cell.topic}</p>}
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
        </div>
      )}

      {/* Renk Açıklaması */}
      {hasData && (
        <div className="rounded-2xl border border-gray-200 bg-white p-4">
          <p className="text-xs font-semibold text-gray-500 mb-3">Dersler</p>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SUBJECT_COLORS).map(([subj, cls]) => (
              <span key={subj} className={`rounded-lg border px-2.5 py-1 text-xs font-semibold ${cls}`}>{subj}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
