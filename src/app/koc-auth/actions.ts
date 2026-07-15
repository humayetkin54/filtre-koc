"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { ADMIN_EMAILS } from "@/lib/admins";
import { sendEmail } from "@/lib/email";

import { KOC_FORM_URL } from "@/lib/koc-form";

const VALID_TYPES = ["YKS", "LGS", "KPSS/AGS", "DGS", "PDR"];

function readTypes(formData: FormData): string[] {
  return formData.getAll("types").map(String).filter((t) => VALID_TYPES.includes(t));
}

function kocFormEmailHtml(name: string) {
  const first = name.split(/\s+/)[0] || "Koç Adayı";
  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">
    <div style="max-width:540px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,#123A57,#0E8FA3);padding:26px 28px;">
        <p style="margin:0;color:rgba(255,255,255,.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Rekor Zeka · Koç Başvurusu</p>
        <h1 style="margin:8px 0 0;color:#fff;font-size:22px;">Başvurun alındı, ${first}! 🎉</h1>
      </div>
      <div style="padding:26px 28px;">
        <p style="margin:0;font-size:15px;color:#374151;line-height:1.6;">
          Rekor Zeka koç kadrosuna başvurun bize ulaştı. Değerlendirmeyi hızlandırmak için
          <strong>2 dakikalık bilgi formunu</strong> doldurman gerekiyor — derecen, deneyimin ve
          müsaitliğin hakkında birkaç soru içeriyor.
        </p>
        <div style="text-align:center;margin:26px 0;">
          <a href="${KOC_FORM_URL}" style="background:#E2600F;color:#fff;text-decoration:none;font-weight:700;font-size:15px;padding:14px 30px;border-radius:12px;display:inline-block;">📋 Bilgi Formunu Doldur</a>
        </div>
        <p style="margin:0;font-size:13px;color:#6b7280;line-height:1.6;">
          Buton çalışmazsa bu bağlantıyı kullan: <a href="${KOC_FORM_URL}" style="color:#0E8FA3;">${KOC_FORM_URL}</a><br><br>
          Form + başvurun birlikte değerlendirilir; onaylandığında e-posta adresinle (veya Google hesabınla)
          giriş yapıp koç paneline erişebileceksin.
        </p>
      </div>
      <div style="padding:14px 28px;background:#f9fafb;border-top:1px solid #f3f4f6;">
        <p style="margin:0;font-size:11px;color:#9ca3af;">Rekor Zeka · PDR ve yapay zeka destekli sınav koçluğu platformu · rekorzeka.com</p>
      </div>
    </div>
  </div>`;
}

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

  if (coach.status !== "approved") {
    // Reddedilmiş/kaldırılmış koç: koç paneline giremez ama hesabı kilitlenmez
    await supabase.auth.signOut();
    redirect(`/koc-giris?error=${encodeURIComponent("Koç başvurunuz onaylanmadı. Dilersen öğrenci girişinden siteyi kullanmaya devam edebilirsin.")}`);
  }

  redirect("/koc-paneli");
}

// Google ile giren koç adayı: hesap var, koç bilgileri eksik → coaches kaydı oluşturur (pending)
export async function completeCoachApplication(
  formData: FormData
): Promise<{ ok?: true; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum bulunamadı. Lütfen tekrar giriş yapın." };

  const university = ((formData.get("university") as string) || "").trim();
  const department = ((formData.get("department") as string) || "").trim();
  const bio = ((formData.get("bio") as string) || "").trim();
  const types = readTypes(formData);
  if (!university || !department) return { error: "Üniversite ve bölüm zorunludur." };
  if (types.length === 0) return { error: "En az bir koçluk alanı seçmelisin." };

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("coaches")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (existing) return { error: "Bu hesap için zaten bir koç başvurusu var." };

  const name = ((user.user_metadata?.full_name as string) || user.email || "Koç").trim();
  const initials = name
    .split(/\s+/)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const { error: insertError } = await admin.from("coaches").insert({
    user_id: user.id,
    name,
    university,
    department,
    bio: bio || null,
    status: "pending",
    avatar_initials: initials,
    avatar_color: "#123A57",
    avatar_text_color: "#ffffff",
    types,
    rating: 0,
    rating_count: 0,
    net_increase: "+0",
    price: 0,
    availability: "open",
    max_students: 10,
    current_students: 0,
  });
  if (insertError) return { error: "Başvuru kaydedilemedi: " + insertError.message };

  // Bilgi formu e-postası (bilgi@rekorzeka.com üzerinden)
  await sendEmail({
    to: [{ email: user.email!, name }],
    subject: "Rekor Zeka koç başvurun alındı - bilgi formu",
    html: kocFormEmailHtml(name),
  });

  // Politika: onay bekleyen koç oturumda kalmaz
  await supabase.auth.signOut();
  return { ok: true };
}

export async function coachSignUp(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const university = formData.get("university") as string;
  const department = formData.get("department") as string;
  const bio = formData.get("bio") as string;
  const types = readTypes(formData);

  if (types.length === 0) {
    redirect(`/koc-kayit?error=${encodeURIComponent("En az bir koçluk alanı seçmelisin.")}`);
  }

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
      types,
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
    } else {
      // Bilgi formu e-postası (bilgi@rekorzeka.com üzerinden)
      await sendEmail({
        to: [{ email, name }],
        subject: "Rekor Zeka koç başvurun alındı - bilgi formu",
        html: kocFormEmailHtml(name),
      });
    }
  }

  redirect("/koc-kayit?success=1");
}
