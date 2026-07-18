import { createClient, createAdminClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admins";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const flow = searchParams.get("flow"); // "koc" → koç akışı
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Şifre sıfırlama akışı: rol yönlendirmelerine girmeden doğrudan şifre ekranına
      if (next === "/sifre-sifirla") {
        return NextResponse.redirect(`${origin}/sifre-sifirla`);
      }

      const user = data.user;
      const email = (user?.email ?? "").toLowerCase();
      const admin = createAdminClient();

      // Admin → yönetim paneli
      if (ADMIN_EMAILS.includes(email)) {
        return NextResponse.redirect(`${origin}/admin`);
      }

      // Koç kaydı var mı?
      const { data: coachRow } = await admin
        .from("coaches")
        .select("status")
        .eq("user_id", user!.id)
        .maybeSingle();

      if (coachRow) {
        if (coachRow.status === "approved") {
          return NextResponse.redirect(`${origin}/koc-paneli`);
        }
        if (coachRow.status === "pending") {
          // Onay bekleyen koç: mevcut politika — oturum kapatılır
          await supabase.auth.signOut();
          return NextResponse.redirect(
            `${origin}/koc-giris?error=${encodeURIComponent("Hesabınız henüz onaylanmadı. En kısa sürede dönüş yapacağız.")}`
          );
        }
        // Reddedilmiş/kaldırılmış koç kaydı hesabı KİLİTLEMEZ — normal kullanıcı akışına devam
      }

      // Koç akışından geldi ama koç kaydı yok → bilgi tamamlama
      if (flow === "koc") {
        return NextResponse.redirect(`${origin}/koc-kayit/tamamla`);
      }

      // Veli hesabı (kayıtta seçilmiş)
      if (user?.user_metadata?.grade === "Veli") {
        return NextResponse.redirect(`${origin}/veli-paneli`);
      }

      // Bir öğrenci bu e-postayı veli olarak eklediyse → veli paneli
      const { count: parentCount } = await admin
        .from("veli_links")
        .select("id", { count: "exact", head: true })
        .eq("parent_email", email);
      if ((parentCount ?? 0) > 0) {
        return NextResponse.redirect(`${origin}/veli-paneli`);
      }

      // Öğrenci: onboarding tamam değilse oraya
      if (!user?.user_metadata?.onboarding_completed) {
        return NextResponse.redirect(`${origin}/onboarding`);
      }

      // Aktif paketli öğrenci → öğrenci anasayfası
      const { count } = await admin
        .from("purchases")
        .select("id", { count: "exact", head: true })
        .eq("user_id", user!.id)
        .eq("status", "active");
      if ((count ?? 0) > 0) {
        return NextResponse.redirect(`${origin}/ogrenci/anasayfa`);
      }

      return NextResponse.redirect(`${origin}${next === "/" ? "/koclar" : next}`);
    }
  }

  return NextResponse.redirect(`${origin}/giris?error=callback`);
}
