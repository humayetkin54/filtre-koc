"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Öğrenci, aktif paketindeki koçunu değerlendirir (1 öğrenci = 1 koça 1 yorum; tekrar gönderim günceller).
export async function submitCoachReview(
  rating: number,
  comment: string
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const r = Math.round(rating);
  if (r < 1 || r > 5) return { error: "Puan 1-5 arasında olmalı." };
  const text = comment.trim().slice(0, 600);

  const admin = createAdminClient();
  const { data: purchase } = await admin
    .from("purchases")
    .select("coach_id, coach_name")
    .eq("user_id", user.id)
    .eq("status", "active")
    .not("coach_id", "is", null)
    .limit(1)
    .maybeSingle();

  if (!purchase?.coach_id) return { error: "Aktif bir koçunuz bulunamadı." };

  // Gizlilik: "Elif N." biçiminde isim
  const fullName = ((user.user_metadata?.full_name as string | undefined) ?? "Öğrenci").trim();
  const parts = fullName.split(/\s+/);
  const displayName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];

  const { error } = await admin
    .from("coach_reviews")
    .upsert(
      {
        coach_id: purchase.coach_id,
        student_id: user.id,
        student_name: displayName,
        rating: r,
        comment: text || null,
      },
      { onConflict: "coach_id,student_id" }
    );
  if (error) {
    return { error: "Değerlendirme kaydedilemedi. (Veritabanı tablosu kurulu olmayabilir.)" };
  }

  // Koçun ortalama puanını ve yorum sayısını gerçek verilerden yeniden hesapla
  const { data: all } = await admin
    .from("coach_reviews")
    .select("rating")
    .eq("coach_id", purchase.coach_id);
  if (all && all.length > 0) {
    const avg = all.reduce((s, x) => s + x.rating, 0) / all.length;
    await admin
      .from("coaches")
      .update({ rating: Math.round(avg * 10) / 10, rating_count: all.length })
      .eq("id", purchase.coach_id);
  }

  revalidatePath("/ogrenci-paneli");
  revalidatePath(`/koclar/${purchase.coach_id}`);
  revalidatePath("/koclar");
  return { ok: true };
}
