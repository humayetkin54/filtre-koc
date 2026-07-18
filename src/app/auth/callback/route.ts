import { createClient } from "@/lib/supabase/server";
import { postAuthRedirect } from "@/app/auth/post-auth-redirect";
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
      return postAuthRedirect({ user: data.user, supabase, origin, flow, next });
    }
  }

  return NextResponse.redirect(`${origin}/giris?error=callback`);
}
