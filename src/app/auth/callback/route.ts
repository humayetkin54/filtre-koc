import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // Veli hesabı: öğrenci onboarding'ine girmeden veli paneline
      if (data.user?.user_metadata?.grade === "Veli") {
        return NextResponse.redirect(`${origin}/veli-paneli`);
      }
      const onboardingDone = data.user?.user_metadata?.onboarding_completed;
      const destination = onboardingDone ? next : "/onboarding";
      return NextResponse.redirect(`${origin}${destination}`);
    }
  }

  return NextResponse.redirect(`${origin}/giris?error=callback`);
}
