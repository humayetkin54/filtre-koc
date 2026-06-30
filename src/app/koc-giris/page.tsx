import Link from "next/link";
import Image from "next/image";
import { coachSignIn } from "@/app/koc-auth/actions";

export default function KocGirisPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4"
      style={{ background: 'linear-gradient(135deg, #1a1040 0%, #0e0e14 100%)' }}
    >
      <div className="w-full max-w-md">
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              Koç Paneli
            </div>
            <h1 className="mt-3 text-xl font-semibold text-white">
              Koç girişi
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Koç hesabın yok mu?{" "}
              <Link
                href="/koc-kayit"
                className="font-medium text-purple-300 hover:underline"
              >
                Başvur
              </Link>
            </p>
          </div>

          <ErrorMessage searchParams={searchParams} />

          <form action={coachSignIn} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="ada@ornek.com"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-300">
                Şifre
              </label>
              <input
                type="password"
                name="password"
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Giriş yap
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Öğrenci hesabıyla mı giriş yapacaksın?{" "}
            <Link href="/giris" className="text-gray-400 hover:underline">
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
    <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
      {msg}
    </div>
  );
}
