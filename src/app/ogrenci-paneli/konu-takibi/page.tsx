import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { CURRICULUM, TOPIC_STATUSES, statusMeta } from "@/lib/curriculum";

// Öğrenci için SALT-OKUNUR görünüm — işaretlemeyi yalnızca koç yapar.
export default async function KonuTakibimPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();
  const { data: rows } = await admin
    .from("topic_progress")
    .select("subject_key, topic, status, solved_count, resources")
    .eq("student_id", user.id);

  const map = new Map<string, { status: string; solved_count: number; resources: string | null }>();
  for (const r of rows ?? []) map.set(`${r.subject_key}||${r.topic}`, r);

  const counts: Record<string, number> = { baslanmadi: 0, devam: 0, bitti: 0, tekrar: 0 };
  let total = 0;
  let solved = 0;
  for (const s of CURRICULUM) {
    for (const t of s.topics) {
      total++;
      const r = map.get(`${s.key}||${t}`);
      const st = r?.status ?? "baslanmadi";
      counts[st] = (counts[st] ?? 0) + 1;
      solved += r?.solved_count ?? 0;
    }
  }
  const pct = total ? Math.round((counts.bitti / total) * 100) : 0;
  const hicIsaretYok = (rows ?? []).length === 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">📚 Konu Takibim</h1>
        <p className="text-sm text-gray-500">
          Koçunun işaretlediği konu durumları, çözdüğün soru sayısı ve kullandığın kaynaklar.
        </p>
      </div>

      {hicIsaretYok ? (
        <div className="rounded-2xl border border-gray-200 bg-white py-16 text-center">
          <p className="mb-2 text-3xl">📚</p>
          <p className="font-semibold text-gray-700">Henüz konu işaretlenmemiş</p>
          <p className="mt-1 text-sm text-gray-500">
            Koçun konuları işaretledikçe ilerlemen burada görünecek.
          </p>
        </div>
      ) : (
        <>
          <div className="rounded-2xl border border-gray-200 bg-white p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-sm font-bold text-gray-900">Müfredat İlerlemen</p>
                <p className="text-xs text-gray-500">
                  {counts.bitti} / {total} konu bitti · toplam {solved.toLocaleString("tr-TR")} soru
                </p>
              </div>
              <p className="text-2xl font-bold text-[#0E8FA3]">%{pct}</p>
            </div>
            <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div className="h-full rounded-full bg-[#0E8FA3]" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {TOPIC_STATUSES.map((s) => (
                <span
                  key={s.key}
                  className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.label}: {counts[s.key] ?? 0}
                </span>
              ))}
            </div>
          </div>

          {CURRICULUM.map((s) => {
            // Yalnızca koçun dokunduğu konuları göster — 300 satırlık boş liste işe yaramaz
            const isaretli = s.topics
              .map((t) => ({ t, r: map.get(`${s.key}||${t}`) }))
              .filter((x) => x.r);
            if (isaretli.length === 0) return null;
            return (
              <div key={s.key} className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
                <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-3">
                  <span className="text-lg">{s.icon}</span>
                  <p className="text-sm font-bold text-gray-900">
                    {s.label}
                    <span className="ml-1 rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">
                      {s.group}
                    </span>
                  </p>
                </div>
                <div className="divide-y divide-gray-100">
                  {isaretli.map(({ t, r }) => {
                    const meta = statusMeta(r!.status);
                    return (
                      <div key={t} className="flex flex-wrap items-center gap-3 px-5 py-2.5">
                        <p className="min-w-[160px] flex-1 text-sm text-gray-800">{t}</p>
                        <span
                          className="rounded-lg px-2.5 py-1 text-[11px] font-bold"
                          style={{ background: meta.bg, color: meta.color }}
                        >
                          {meta.label}
                        </span>
                        {r!.solved_count > 0 && (
                          <span className="text-xs text-gray-500">{r!.solved_count} soru</span>
                        )}
                        {r!.resources && (
                          <span className="rounded-md bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {r!.resources}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
