import Link from "next/link";
import Image from "next/image";
import { signIn } from "@/app/auth/actions";
import { GoogleButton } from "@/components/auth/google-button";

export default function GirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0e0e14] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Giriş yap
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Hesabın yok mu?{" "}
              <Link
                href="/kayit"
                className="font-medium text-[#123A57] hover:underline"
              >
                Ücretsiz kaydol
              </Link>
            </p>
          </div>

          <ErrorMessage searchParams={searchParams} />

          <form action={signIn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="ada@ornek.com"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Giriş yap
            </button>
          </form>
          <GoogleButton flow="ogrenci" />
        </div>
      </div>
    </div>
  );
}

async function ErrorMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const params = await searchParams;
  if (!params.error) return null;

  const messages: Record<string, string> = {
    callback: "Giriş sırasında bir hata oluştu. Tekrar deneyin.",
    link_expired: "Doğrulama linkinin süresi dolmuş. Lütfen tekrar kayıt olun.",
    "Invalid login credentials": "E-posta veya şifre hatalı.",
  };

  const msg = messages[params.error] ?? params.error;

  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {msg}
    </div>
  );
}
