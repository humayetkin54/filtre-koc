"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// Koç biyografisini günceller (yalnızca kendi coaches kaydı)
export async function updateCoachBio(bio: string): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı." };

  const text = bio.trim().slice(0, 1200);

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("coaches")
    .update({ bio: text || null })
    .eq("user_id", user.id)
    .select("id");

  if (error) return { error: "Kaydedilemedi: " + error.message };
  if (!data || data.length === 0) return { error: "Bu hesaba bağlı bir koç profili bulunamadı." };

  revalidatePath("/profil");
  revalidatePath(`/koclar/${data[0].id}`);
  revalidatePath("/koclar");
  return { ok: true };
}
