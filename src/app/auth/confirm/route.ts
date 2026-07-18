import { createClient } from "@/lib/supabase/server";
import { postAuthRedirect } from "@/app/auth/post-auth-redirect";
import { NextResponse } from "next/server";
import type { EmailOtpType } from "@supabase/supabase-js";

// Mail şablonlarındaki token_hash'li linkler buraya düşer:
//   /auth/confirm?token_hash={{ .TokenHash }}&type=recovery|signup|email_change&next=...
// PKCE code akışının aksine token_hash HERHANGİ bir tarayıcı/cihazdan doğrulanabilir
// (sıfırlama talebinin yapıldığı tarayıcıya bağımlı değil).
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const flow = searchParams.get("flow");
  const next = searchParams.get("next") ?? "/";

  if (token_hash && type) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.verifyOtp({ type, token_hash });
    if (!error) {
      // Şifre sıfırlama: rol yönlendirmelerine girmeden doğrudan şifre ekranına
      if (type === "recovery" || next === "/sifre-sifirla") {
        return NextResponse.redirect(`${origin}/sifre-sifirla`);
      }
      return postAuthRedirect({ user: data.user, supabase, origin, flow, next });
    }
  }

  // Geçersiz/süresi dolmuş link
  if (type === "recovery") {
    // sifre-sifirla oturumsuz gelince "bağlantı geçersiz + yeni bağlantı iste" ekranını gösterir
    return NextResponse.redirect(`${origin}/sifre-sifirla`);
  }
  return NextResponse.redirect(`${origin}/giris?error=link_expired`);
}
