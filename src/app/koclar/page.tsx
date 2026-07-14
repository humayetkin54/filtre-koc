import { createClient, createAdminClient } from "@/lib/supabase/server";
import { CoachList } from "./coach-list";
import type { Coach, FilterType } from "./types";

export default async function KoclarPage({
  searchParams,
}: {
  searchParams: Promise<{ tip?: string }>;
}) {
  const { tip } = await searchParams;
  const initialTip = ["YKS", "LGS", "KPSS/AGS", "DGS", "PDR"].includes(tip ?? "")
    ? (tip as FilterType)
    : undefined;

  const supabase = await createClient();
  const admin = createAdminClient();

  const [{ data: coaches, error }, { data: { user } }] = await Promise.all([
    supabase.from("coaches").select("*").eq("status", "approved").order("rating", { ascending: false }),
    supabase.auth.getUser(),
  ]);

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p className="font-semibold text-red-800">Koçlar yüklenirken bir hata oluştu.</p>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!coaches?.length) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
          <div className="text-4xl">🎓</div>
          <p className="mt-3 text-lg font-semibold text-zinc-900">Eylül dönemi koç kadromuz hazırlanıyor</p>
          <p className="mt-2 text-sm text-zinc-500">
            Doğrulanmış koçlarımız çok yakında burada. Bu arada ücretsiz ön görüşmeyle yerini ayırtabilirsin.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="/on-gorusme" className="btn-primary px-6 py-2.5 text-sm font-bold">Ücretsiz Ön Görüşme</a>
            <a href="/koc-kayit" className="rounded-xl border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">
              Koç Olmak İstiyorum
            </a>
          </div>
        </div>
      </div>
    );
  }

  // Kullanıcının aktif satın alımları — hangi koç ID'lerini satın almış?
  let purchasedCoachIds: string[] = [];
  let hasPurchase = false;
  if (user) {
    const { data: purchases, count } = await admin
      .from("purchases")
      .select("coach_id", { count: "exact" })
      .eq("user_id", user.id)
      .eq("status", "active");
    purchasedCoachIds = (purchases ?? []).map((p: { coach_id: string }) => p.coach_id).filter(Boolean);
    hasPurchase = (count ?? 0) > 0; // coach_id null olsa bile satın alma varsa true
  }

  return (
    <CoachList
      coaches={coaches as Coach[]}
      purchasedCoachIds={purchasedCoachIds}
      hasPurchase={hasPurchase}
      initialTip={initialTip}
    />
  );
}
