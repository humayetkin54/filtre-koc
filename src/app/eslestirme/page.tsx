import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import EslestirmeClient from "./eslestirme-client";
import DigerKoclar from "./diger-koclar";
import DestekPopup from "./destek-popup";

type Coach = {
  id: string;
  name: string;
  university: string;
  department: string;
  types: string[];
  availability: string;
  current_students: number;
  max_students: number;
  rating: number;
  rating_count: number;
  avatar_initials: string;
  avatar_color: string;
  bio: string;
};

function calcScore(coach: Coach, meta: Record<string, string>): number {
  let score = 0;
  const targetUni = (meta.target ?? "").toLowerCase();
  const coachUni = (coach.university ?? "").toLowerCase();
  const coachDept = (coach.department ?? "").toLowerCase();
  if (targetUni && coachUni && targetUni.includes(coachUni.split(" ")[0])) score += 35;
  else if (targetUni && coachDept && targetUni.includes(coachDept.split(" ")[0])) score += 20;
  else score += 10;

  const examType = (meta.exam_type ?? "").toLowerCase();
  const coachTypes = (coach.types ?? []).map((t: string) => t.toLowerCase());
  if (examType && coachTypes.some((t) => examType.includes(t) || t.includes(examType.split(" ")[0]))) score += 25;
  else score += 8;

  const available = (coach.max_students ?? 10) - (coach.current_students ?? 0);
  if (available >= 3) score += 20;
  else if (available >= 1) score += 12;

  const rating = coach.rating ?? 0;
  if (rating >= 4.8) score += 15;
  else if (rating >= 4.5) score += 10;
  else if (rating >= 4.0) score += 6;
  else score += 3;

  const anxiety = meta.anxiety_level ?? "";
  if ((anxiety === "Orta" || anxiety === "Yoğun") && coachTypes.some((t) => t.includes("pdr"))) score += 5;
  else score += 2;

  return Math.min(score, 99);
}

export default async function EslestirmePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");
  if (!user.user_metadata?.onboarding_completed) redirect("/onboarding");

  const admin = createAdminClient();
  const { data: coaches } = await admin
    .from("coaches")
    .select("id, name, university, department, types, availability, current_students, max_students, rating, rating_count, avatar_initials, avatar_color, bio")
    .eq("status", "approved");

  const meta = user.user_metadata as Record<string, string>;
  const coachList: Coach[] = coaches ?? [];

  const scored = coachList
    .map((c) => ({ ...c, score: calcScore(c, meta) }))
    .sort((a, b) => b.score - a.score);

  const top = scored[0] ?? null;
  const rest = scored.slice(1);

  const { count: usedSlots } = await supabase
    .from("appointments")
    .select("id", { count: "exact", head: true })
    .eq("student_email", user.email ?? "")
    .eq("is_intro", true);

  const freeLeft = Math.max(0, 3 - (usedSlots ?? 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3f5] to-[#cfe9e6]">
      <DestekPopup />
      <div className="px-4 py-12">
        <div className="max-w-lg mx-auto space-y-6">

          {/* Üst bildirim */}
          <div className="rounded-2xl bg-white shadow-sm p-6 text-center">
            <div className="text-3xl mb-3">🎯</div>
            <h1 className="text-xl font-bold text-[#1e293b] mb-1">Profilin analiz edildi!</h1>
            <p className="text-sm text-gray-500 mb-5">Sana özel koç eşleştirmesi tamamlandı.</p>
            <div className="flex items-center justify-center gap-2 mb-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shadow-md transition-all ${
                    i < freeLeft
                      ? "bg-[#0E8FA3] text-white scale-110"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {i < freeLeft ? "✦" : "○"}
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              {freeLeft > 0 ? (
                <><span className="font-semibold text-[#0E8FA3]">{freeLeft} ücretsiz görüşme</span> hakkın mevcut</>
              ) : "Ücretsiz görüşme haklarını kullandın."}
            </p>
          </div>

          {/* En uyumlu koç */}
          {top ? (
            <EslestirmeClient coach={top} score={top.score} freeLeft={freeLeft} userMeta={meta} />
          ) : (
            <div className="rounded-2xl bg-white shadow-sm p-8 text-center text-gray-500">
              Henüz aktif koç bulunamadı. Kısa süre içinde koçlar eklenecek.
            </div>
          )}

          {/* Diğer koçlara git butonu */}
          <div className="text-center">
            <a
              href="#diger-koclar"
              className="inline-flex items-center gap-2 rounded-xl border-2 border-[#0E8FA3] px-6 py-3 text-sm font-semibold text-[#0E8FA3] transition hover:bg-[#0E8FA3] hover:text-white"
            >
              Diğer koçlara göz at ↓
            </a>
          </div>
        </div>
      </div>

      {/* Diğer koçlar grid */}
      <div id="diger-koclar" className="bg-white px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase text-[#0E8FA3] mb-2">Tüm Koçlar</p>
          <h2 className="text-3xl font-bold text-[#1e293b] mb-2">Diğer koçlarımız</h2>
          <p className="text-gray-500 text-sm mb-10">Sana en uygun koçu seçmek için tüm profillerimizi incele.</p>
          {rest.length > 0 ? (
            <DigerKoclar coaches={rest} freeLeft={freeLeft} />
          ) : (
            <p className="text-gray-400 text-sm">Şu an başka koç bulunmuyor.</p>
          )}
        </div>
      </div>
    </div>
  );
}
