"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

// Profil fotoğrafı yükle — öğrenci: user_metadata.avatar_url; koçsa coaches.avatar_url da güncellenir.
export async function uploadProfilePhoto(
  formData: FormData
): Promise<{ ok?: true; url?: string; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const file = formData.get("photo") as File | null;
  if (!file || file.size === 0) return { error: "Dosya seçilmedi." };
  if (file.size > MAX_BYTES) return { error: "Fotoğraf 5MB'den büyük olamaz." };
  if (!ALLOWED.includes(file.type)) return { error: "JPG, PNG veya WebP formatında yükleyin." };

  const ext = file.type === "image/png" ? "png" : file.type === "image/webp" ? "webp" : "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const admin = createAdminClient();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const { error: upErr } = await admin.storage
    .from("avatars")
    .upload(path, bytes, { contentType: file.type, upsert: true });
  if (upErr) return { error: `Yükleme başarısız: ${upErr.message}` };

  const { data: pub } = admin.storage.from("avatars").getPublicUrl(path);
  const url = `${pub.publicUrl}?v=${Date.now()}`; // tarayıcı önbelleğini kır

  await supabase.auth.updateUser({ data: { avatar_url: url } });
  // Koçsa profil fotoğrafını koç kartlarına da yansıt (kolon yoksa sessizce geçer)
  await admin.from("coaches").update({ avatar_url: url }).eq("user_id", user.id);

  revalidatePath("/profil");
  revalidatePath("/koclar");
  return { ok: true, url };
}

export async function removeProfilePhoto(): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const admin = createAdminClient();
  await admin.storage
    .from("avatars")
    .remove([`${user.id}/avatar.jpg`, `${user.id}/avatar.png`, `${user.id}/avatar.webp`]);
  await supabase.auth.updateUser({ data: { avatar_url: null } });
  await admin.from("coaches").update({ avatar_url: null }).eq("user_id", user.id);

  revalidatePath("/profil");
  revalidatePath("/koclar");
  return { ok: true };
}
