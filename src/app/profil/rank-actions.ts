"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const RANK_TYPES = ["SAY", "EA", "SÖZ", "DİL", "TYT"];

// Koçun puan türü + Türkiye sıralamasını günceller (boş bırakılırsa temizler)
export async function updateCoachRank(
  rankType: string,
  rankValue: string
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const clearing = !rankType && !rankValue.trim();
  let type: string | null = null;
  let value: number | null = null;

  if (!clearing) {
    if (!RANK_TYPES.includes(rankType)) return { error: "Geçerli bir puan türü seç." };
    value = parseInt(rankValue.replace(/\D/g, ""), 10);
    if (!value || value < 1 || value > 3_000_000) return { error: "Geçerli bir sıralama gir (örn. 259)." };
    type = rankType;
  }

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("coaches")
    .update({ rank_type: type, rank_value: value })
    .eq("user_id", user.id)
    .select("id");
  if (error) return { error: "Kaydedilemedi: " + error.message };
  if (!data || data.length === 0) return { error: "Koç profili bulunamadı." };

  revalidatePath("/profil");
  revalidatePath("/koclar");
  revalidatePath(`/koclar/${data[0].id}`);
  return { ok: true };
}

// ÖSYM sonuç belgesi yükleme — GİZLİ bucket (yalnızca yönetici doğrulama için görür)
export async function uploadSonucBelgesi(
  formData: FormData
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const file = formData.get("belge") as File | null;
  if (!file || file.size === 0) return { error: "Dosya seçilmedi." };
  if (file.size > 10 * 1024 * 1024) return { error: "Dosya 10MB'den büyük olamaz." };
  const allowed: Record<string, string> = {
    "application/pdf": "pdf",
    "image/jpeg": "jpg",
    "image/png": "png",
  };
  const ext = allowed[file.type];
  if (!ext) return { error: "PDF, JPG veya PNG yükleyin." };

  const admin = createAdminClient();
  const path = `${user.id}/sonuc-belgesi.${ext}`;
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await admin.storage
    .from("belgeler")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { error: "Yükleme başarısız: " + upErr.message };

  const { data, error } = await admin
    .from("coaches")
    .update({ result_doc_path: path })
    .eq("user_id", user.id)
    .select("id");
  if (error) return { error: "Kaydedilemedi: " + error.message };
  if (!data || data.length === 0) return { error: "Koç profili bulunamadı." };

  revalidatePath("/profil");
  return { ok: true };
}
