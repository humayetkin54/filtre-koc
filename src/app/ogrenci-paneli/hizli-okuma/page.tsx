import Link from "next/link";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { hizliOkumaAccess } from "@/lib/hizli-okuma-access";
import { HizliOkumaClient } from "./hizli-okuma-client";

export const metadata = { title: "Hızlı Okuma | Rekor Zeka" };

export default async function HizliOkumaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = createAdminClient();
  const { data: purchases } = await admin
    .from("purchases")
    .select("plan, category, created_at")
    .eq("user_id", user!.id)
    .eq("status", "active");

  const access = hizliOkumaAccess(purchases ?? []);

  // Kalıcı test geçmişi (cihazdan bağımsız; localStorage yalnızca yedek)
  const { data: sessionRows } = await admin
    .from("reading_sessions")
    .select("wpm, comprehension, effective_wpm, passage_title, created_at")
    .eq("user_id", user!.id)
    .order("created_at", { ascending: true })
    .limit(100);

  const initialHistory = (sessionRows ?? []).map((r) => ({
    date: r.created_at as string,
    wpm: r.wpm as number,
    comprehension: r.comprehension as number,
    effectiveWpm: r.effective_wpm as number,
    title: (r.passage_title as string) ?? "",
  }));

  // Erişim yok → kilit ekranı
  if (!access.allowed) {
    const msg =
      access.reason === "expired"
        ? "Hızlı Okuma erişim süren doldu. Kaldığın yerden devam etmek için erişimini yenileyebilirsin."
        : "Mevcut paketinde Hızlı Okuma eğitimi bulunmuyor. 3 aylık ve üzeri koçluk paketlerine dahildir; dilersen yalnızca Hızlı Okuma paketini de alabilirsin.";
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-gray-200 bg-white p-10 text-center">
        <div className="text-5xl">🔒</div>
        <h1 className="mt-4 text-xl font-bold text-gray-900">Hızlı Okuma Kilitli</h1>
        <p className="mt-2 text-sm leading-relaxed text-gray-500">{msg}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            href="/hizli-okuma"
            className="rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#0c7d8f]"
          >
            👁️ Hızlı Okuma Paketi (30 gün)
          </Link>
          <Link
            href="/paketler"
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50"
          >
            Koçluk Paketlerini Gör
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Sınırlı erişimde kalan süre bandı */}
      {!access.unlimited && access.daysLeft !== null && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${
            access.daysLeft <= 5
              ? "border-amber-200 bg-amber-50 text-amber-700"
              : "border-[#d5f2f5] bg-[#eef9f9] text-[#0E8FA3]"
          }`}
        >
          ⏳ Hızlı Okuma erişiminde <strong className="mx-1">{access.daysLeft} gün</strong> kaldı.
          {access.daysLeft <= 5 && (
            <Link href="/hizli-okuma" className="ml-auto underline underline-offset-2">
              Uzat →
            </Link>
          )}
        </div>
      )}
      <HizliOkumaClient initialHistory={initialHistory} />
    </div>
  );
}
