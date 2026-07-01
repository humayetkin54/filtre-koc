import Link from "next/link";
import Image from "next/image";
import KayitForm from "./kayit-form";

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
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">
              Hesap oluştur
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Zaten hesabın var mı?{" "}
              <Link
                href="/giris"
                className="font-medium text-[#123A57] hover:underline"
              >
                Giriş yap
              </Link>
            </p>
          </div>

          <StatusMessage searchParams={searchParams} />
          <KayitForm />

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
