"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { ADMIN_EMAILS } from "@/lib/admins";

export async function coachSignIn(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/koc-giris?error=${encodeURIComponent(error.message)}`);
  }

  if (ADMIN_EMAILS.includes(email.toLowerCase())) {
    redirect("/admin");
  }

  // Koç kaydı ve onay kontrolü
  const { data: coach } = await supabase
    .from("coaches")
    .select("id, status")
    .eq("user_id", data.user.id)
    .single();

  if (!coach) {
    await supabase.auth.signOut();
    redirect(`/koc-giris?error=${encodeURIComponent("Bu hesap bir koç hesabı değil.")}`);
  }

  if (coach.status === "pending") {
    await supabase.auth.signOut();
    redirect(`/koc-giris?error=${encodeURIComponent("Hesabınız henüz onaylanmadı. En kısa sürede dönüş yapacağız.")}`);
  }

  redirect("/koc-paneli");
}

export async function coachSignUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const university = formData.get("university") as string;
  const department = formData.get("department") as string;
  const bio = formData.get("bio") as string;

  const admin = createAdminClient();

  // E-posta onayı olmadan kullanıcı oluştur (admin zaten onaylıyor)
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: name, role: "coach" },
  });

  if (error) {
    redirect(`/koc-kayit?error=${encodeURIComponent(error.message)}`);
  }

  if (data.user) {
    const initials = name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    const { error: insertError } = await admin.from("coaches").insert({
      user_id: data.user.id,
      name,
      university,
      department,
      bio: bio || null,
      status: "pending",
      avatar_initials: initials,
      avatar_color: "#123A57",
      avatar_text_color: "#ffffff",
      types: [],
      rating: 0,
      rating_count: 0,
      net_increase: "+0",
      price: 0,
      availability: "open",
      max_students: 10,
      current_students: 0,
    });

    if (insertError) {
      console.error("[coachSignUp] Coach insert hatası:", insertError.message);
    }
  }

  redirect("/koc-kayit?success=1");
}
