"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const name = formData.get("name") as string | null;
  const email = formData.get("email") as string | null;
  const password = formData.get("password") as string | null;

  const updates: Record<string, unknown> = {};

  if (name) updates.data = { full_name: name };
  if (email && email !== user.email) updates.email = email;
  if (password && password.length >= 6) updates.password = password;

  if (Object.keys(updates).length === 0) {
    redirect("/profil?error=Değişiklik yapılmadı.");
  }

  const { error } = await supabase.auth.updateUser(updates);

  if (error) {
    redirect(`/profil?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/profil?success=1");
}
