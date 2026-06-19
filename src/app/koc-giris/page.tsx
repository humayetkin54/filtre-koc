import Link from "next/link";
import { coachSignIn } from "@/app/koc-auth/actions";

export default function KocGirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-[#3a4cff]">
              FiltrEkoç
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Koç Paneli
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">
              Koç girişi
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Koç hesabın yok mu?{" "}
              <Link
                href="/koc-kayit"
                className="font-medium text-[#3a4cff] hover:underline"
              >
                Başvur
              </Link>
            </p>
          </div>

          <ErrorMessage searchParams={searchParams} />

          <form action={coachSignIn} className="space-y-4">
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
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-[#3a4cff] px-6 py-3 font-semibold text-white transition hover:bg-[#2f3fd4]"
            >
              Giriş yap
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Öğrenci hesabıyla mı giriş yapacaksın?{" "}
            <Link href="/giris" className="text-gray-500 hover:underline">
              Öğrenci girişi
            </Link>
          </p>
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
    "Invalid login credentials": "E-posta veya şifre hatalı.",
  };

  const msg = messages[params.error] ?? params.error;

  return (
    <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {msg}
    </div>
  );
}
