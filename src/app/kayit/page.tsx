import Link from "next/link";
import { signUp } from "@/app/auth/actions";

export default function KayitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0e0e14] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-[#3a4cff]">
              Rekor Zeka
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Hesap oluştur
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Zaten hesabın var mı?{" "}
              <Link
                href="/giris"
                className="font-medium text-[#3a4cff] hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </div>

          <StatusMessage searchParams={searchParams} />

          <form action={signUp} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                required
                autoComplete="name"
                placeholder="Ada Yılmaz"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
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
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
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
                minLength={6}
                autoComplete="new-password"
                placeholder="En az 6 karakter"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
            <button
              type="submit"
              className="btn-primary w-full py-3"
            >
              Kayıt ol
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-gray-400">
            Kayıt olarak{" "}
            <span className="underline">kullanım koşullarını</span> kabul
            etmiş olursunuz.
          </p>
        </div>
      </div>
    </div>
  );
}

async function StatusMessage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  const params = await searchParams;

  if (params.success) {
    return (
      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
        Hesabınız oluşturuldu! E-postanıza doğrulama bağlantısı gönderdik.
      </div>
    );
  }

  if (params.error) {
    const messages: Record<string, string> = {
      "User already registered": "Bu e-posta adresi zaten kayıtlı.",
    };
    const msg = messages[params.error] ?? params.error;
    return (
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {msg}
      </div>
    );
  }

  return null;
}
