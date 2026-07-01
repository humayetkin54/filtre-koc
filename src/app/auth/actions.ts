"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/giris?error=${encodeURIComponent(error.message)}`);
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
