import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata = { title: "Veli Paneli | Rekor Zeka" };

// Veli paneli — öğrencinin gelişimini SALT-OKUNUR gösterir.
// Erişim: öğrenci, veli e-postasını profilinden eklemiş VE veli takibi açık olmalı.
export default async function VeliPaneliPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();
  const { data: links } = await admin
    .from("veli_links")
    .select("student_id")
    .eq("parent_email", (user.email ?? "").toLowerCase());

  if (!links || links.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-5xl">👨‍👩‍👧</div>
        <h1 className="mt-4 text-2xl font-bold text-gray-900">Veli Paneli</h1>
        <p className="mt-2 text-gray-500">
          Bu hesaba bağlı bir öğrenci bulunamadı. Öğrencinizin, profil sayfasındaki
          <strong> Veli Takip Sistemi</strong> bölümünden e-posta adresinizi (<span className="font-mono text-sm">{user.email}</span>) eklemesi gerekiyor.
        </p>
      </div>
    );
  }

  // Öğrenci verilerini topla
  const students = await Promise.all(
    links.map(async (l) => {
      const { data: sUser } = await admin.auth.admin.getUserById(l.student_id);
      const enabled = sUser?.user?.user_metadata?.veli_takip_enabled === true;
      const name = (sUser?.user?.user_metadata?.full_name as string | undefined) ?? sUser?.user?.email ?? "Öğrenci";
      if (!enabled) return { id: l.student_id, name, enabled: false as const };

      const [{ data: purchases }, { data: denemes }, { data: homework }, { data: goals }] = await Promise.all([
        admin.from("purchases").select("coach_name, category, plan").eq("user_id", l.student_id).eq("status", "active"),
        admin.from("deneme_results").select("exam_name, exam_date, net_total").eq("student_id", l.student_id).order("exam_date", { ascending: false }).limit(5),
        admin.from("homework").select("id, status").eq("student_id", l.student_id),
        admin.from("goals").select("target_university, target_department").eq("student_id", l.student_id).maybeSingle(),
      ]);

      return {
        id: l.student_id,
        name,
        enabled: true as const,
        purchase: purchases?.[0],
        denemes: denemes ?? [],
        pendingHw: (homework ?? []).filter((h) => h.status === "pending").length,
        totalHw: (homework ?? []).length,
        goals,
      };
    })
  );

  return (
    <div className="min-h-full bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#123A57] to-[#0E8FA3] px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Rekor Zeka</p>
          <h1 className="mt-1 text-3xl font-bold text-white">Veli Paneli 👨‍👩‍👧</h1>
          <p className="mt-2 text-sm text-white/70">
            Öğrencinizin çalışma sürecini buradan takip edebilirsiniz. Bu panel salt görüntülemedir.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {students.map((s) => (
          <section key={s.id} className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900">🎓 {s.name}</h2>

            {!s.enabled ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-700">
                Öğrenciniz veli takibini şu anda kapalı tutuyor. Görüntülemek için öğrencinizin
                profilindeki Veli Takip Sistemi anahtarını açması gerekiyor.
              </div>
            ) : (
              <>
                {/* Özet kartlar */}
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Koç & Paket</p>
                    <p className="mt-1 font-bold text-gray-900">{s.purchase?.coach_name ?? "—"}</p>
                    <p className="text-xs text-gray-400">{s.purchase ? `${s.purchase.category} · ${s.purchase.plan}` : "Aktif paket yok"}</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Ödevler</p>
                    <p className="mt-1 font-bold text-gray-900">{s.pendingHw} bekliyor</p>
                    <p className="text-xs text-gray-400">{s.totalHw} toplam ödev</p>
                  </div>
                  <div className="rounded-2xl border border-gray-200 bg-white p-5">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Hedef</p>
                    <p className="mt-1 truncate font-bold text-gray-900">{s.goals?.target_university ?? "Belirlenmedi"}</p>
                    <p className="truncate text-xs text-gray-400">{s.goals?.target_department ?? ""}</p>
                  </div>
                </div>

                {/* Son denemeler */}
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <p className="mb-3 text-sm font-bold text-gray-700">Son Denemeler</p>
                  {s.denemes.length === 0 ? (
                    <p className="text-sm text-gray-400">Henüz deneme sonucu girilmemiş.</p>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400">
                            <th className="pb-2 pr-4 font-semibold">Tarih</th>
                            <th className="pb-2 pr-4 font-semibold">Sınav</th>
                            <th className="pb-2 font-semibold">Toplam Net</th>
                          </tr>
                        </thead>
                        <tbody>
                          {s.denemes.map((d, i) => (
                            <tr key={i} className="border-b border-gray-50 last:border-0">
                              <td className="py-2.5 pr-4 text-gray-600">
                                {new Date(d.exam_date).toLocaleDateString("tr-TR", { day: "2-digit", month: "short", year: "numeric" })}
                              </td>
                              <td className="py-2.5 pr-4">
                                <span className="rounded-full bg-[#eef9f9] px-2.5 py-0.5 text-xs font-bold text-[#0E8FA3]">{d.exam_name}</span>
                              </td>
                              <td className="py-2.5 font-bold text-gray-900">
                                {d.net_total != null ? d.net_total.toFixed(1) : "—"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </section>
        ))}

        <p className="text-center text-xs text-gray-400">
          Sorularınız için <a href="mailto:bilgi@rekorzeka.com" className="text-[#0E8FA3] hover:underline">bilgi@rekorzeka.com</a>
        </p>
      </div>
    </div>
  );
}
