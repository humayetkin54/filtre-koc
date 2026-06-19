import Link from "next/link";
import { coachSignUp } from "@/app/koc-auth/actions";

export default function KocKayitPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; success?: string }>;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4 py-12">
      <div className="w-full max-w-lg">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="text-2xl font-bold text-[#3a4cff]">
              FiltrEkoç
            </Link>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">
              Koç Başvurusu
            </div>
            <h1 className="mt-3 text-xl font-semibold text-gray-900">
              Koç olarak katıl
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Başvurun incelendikten sonra aktif edilecek.
            </p>
          </div>

          <StatusMessage searchParams={searchParams} />

          <form action={coachSignUp} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
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
                  Üniversite
                </label>
                <input
                  type="text"
                  name="university"
                  required
                  placeholder="ODTÜ"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Bölüm
                </label>
                <input
                  type="text"
                  name="department"
                  required
                  placeholder="Tıp Fakültesi"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
                />
              </div>
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
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
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Kendini kısaca tanıt{" "}
                  <span className="text-gray-400 font-normal">(opsiyonel)</span>
                </label>
                <textarea
                  name="bio"
                  rows={3}
                  placeholder="Hangi sınavlara hazırladın, kaç yıllık deneyimin var..."
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20 resize-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-xl bg-[#3a4cff] px-6 py-3 font-semibold text-white transition hover:bg-[#2f3fd4]"
            >
              Başvur
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            Zaten koç hesabın var mı?{" "}
            <Link href="/koc-giris" className="text-gray-500 hover:underline">
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
      <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
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
      <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        {msg}
      </div>
    );
  }

  return null;
}
