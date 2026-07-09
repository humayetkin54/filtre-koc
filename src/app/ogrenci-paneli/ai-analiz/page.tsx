import { createClient, createAdminClient } from "@/lib/supabase/server";
import Link from "next/link";
import { AnalizView } from "./analiz-view";

export default async function AiAnalizPage({
  searchParams,
}: {
  searchParams: Promise<{ scan?: string }>;
}) {
  const { scan: selectedScanId } = await searchParams;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: scans } = await admin
    .from("exam_scans")
    .select("*")
    .eq("student_id", user!.id)
    .order("exam_date", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900 mb-1">🤖 AI Analiz</h1>
          <p className="text-sm text-gray-500">
            Fotoğraflarını yüklediğin denemelerin yapay zekâ analizleri.
          </p>
        </div>
        <Link
          href="/ogrenci-paneli/ai-analiz/yukle"
          className="rounded-xl bg-[#0E8FA3] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition"
        >
          📸 Yeni Deneme Yükle
        </Link>
      </div>

      <AnalizView scans={scans ?? []} initialScanId={selectedScanId ?? null} />
    </div>
  );
}
