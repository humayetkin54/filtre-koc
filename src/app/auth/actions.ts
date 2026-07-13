"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/giris?error=${encodeURIComponent(error.message)}`);
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user?.user_metadata?.onboarding_completed) {
    redirect("/onboarding");
  }

  const admin = createAdminClient();
  const { count } = await admin
    .from("purchases")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user!.id)
    .eq("status", "active");

  if ((count ?? 0) > 0) {
    redirect("/ogrenci/anasayfa");
  }

  // Veli mi? Bir öğrenci bu e-postayı veli olarak eklediyse veli paneline git
  const { count: parentCount } = await admin
    .from("veli_links")
    .select("id", { count: "exact", head: true })
    .eq("parent_email", (user!.email ?? "").toLowerCase());
  if ((parentCount ?? 0) > 0) {
    redirect("/veli-paneli");
  }

  redirect("/koclar");
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const grade = formData.get("grade") as string;
  const exam_type = formData.get("exam_type") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: name, grade, exam_type },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.rekorzeka.com"}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/kayit?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/kayit?success=1");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
