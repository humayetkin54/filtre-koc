import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const { pathname, searchParams, origin } = request.nextUrl;
  const code = searchParams.get("code");
  const errorCode = searchParams.get("error_code");

  // Süresi dolmuş veya geçersiz link → giriş sayfasına yönlendir
  if (errorCode) {
    return NextResponse.redirect(`${origin}/giris?error=link_expired`);
  }

  // Supabase mail doğrulama kodunu callback route'a yönlendir
  if (code && pathname !== "/auth/callback") {
    return NextResponse.redirect(`${origin}/auth/callback?code=${code}`);
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Oturumu tazele
  await supabase.auth.getUser();

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
