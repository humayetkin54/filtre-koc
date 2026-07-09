import { createClient, createAdminClient } from "@/lib/supabase/server";
import { DenemeForm } from "./deneme-form";
import { ResultsTabs } from "./results-tabs";

export default async function DenemePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: results } = await admin
    .from("deneme_results")
    .select("*")
    .eq("student_id", user!.id)
    .order("exam_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">📝 Deneme Sonuçları</h1>
          <p className="text-sm text-gray-500">Deneme sınavı netlerini girerek gelişimini takip et.</p>
        </div>
        <a
          href="/ogrenci-paneli/ai-analiz/yukle"
          className="rounded-xl border-2 border-[#0E8FA3] px-4 py-2.5 text-sm font-bold text-[#0E8FA3] hover:bg-[#eef9f9] transition"
        >
          📸 Deneme Sınavı Sorularını Çek
        </a>
      </div>

      {/* Sonuç ekle */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">Yeni Sonuç Ekle</h2>
        <DenemeForm />
      </div>

      {/* Sonuçlar — sınav türü sekmeleri, grafik ve kayıtlar */}
      <ResultsTabs results={results ?? []} />
    </div>
  );
}
