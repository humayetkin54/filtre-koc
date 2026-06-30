import Link from "next/link";
import Image from "next/image";
import { coachSignUp } from "@/app/koc-auth/actions";

export default function KocKayitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  return (
    <div
      className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12"
      style={{ background: 'linear-gradient(135deg, #1a1040 0%, #0e0e14 100%)' }}
    >
      <div className="w-full max-w-lg">
        <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-500/20 px-3 py-1 text-xs font-semibold text-purple-300">
              Koç Başvurusu
            </div>
            <h1 className="mt-3 text-xl font-semibold text-white">
              Koç olarak katıl
            </h1>
            <p className="mt-1 text-sm text-gray-400">
              Başvurun incelendikten sonra aktif edilecek.
            </p>
          </div>

          <StatusMessage searchParams={searchParams} />

          <form action={coachSignUp} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  autoComplete="name"
                  placeholder="Ada Yılmaz"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Üniversite
                </label>
                <input
                  type="text"
                  name="university"
                  required
                  placeholder="ODTÜ"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Bölüm
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  placeholder="Tıp Fakültesi"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Şifre
                </label>
                <input
                  type="password"
                  name="password"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  placeholder="En az 6 karakter"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-300">
                  Kendini kısaca tanıt{" "}
                  <span className="text-gray-500 font-normal">(opsiyonel)</span>
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Hangi sınavlara hazırladın, kaç yıllık deneyimin var..."
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
            >
              Başvur
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-500">
            Zaten koç hesabın var mı?{" "}
            <Link href="/koc-giris" className="text-gray-400 hover:underline">
              Giriş yap
            </Link>
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
      <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
        Başvurunuz alındı! E-postanıza doğrulama bağlantısı gönderdik. Onay sürecini tamamladıktan sonra size dönüş yapacağız.
      </div>
    );
  }

  if (params.error) {
    const messages: Record<string, string> = {
      "User already registered": "Bu e-posta adresi zaten kayıtlı.",
    };
    const msg = messages[params.error] ?? params.error;
    return (
      <div className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
        {msg}
      </div>
    );
  }

  return null;
}
