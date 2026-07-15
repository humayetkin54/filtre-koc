import Link from "next/link";
import Image from "next/image";
import KocKayitForm from "./koc-kayit-form";
import { KOC_FORM_URL } from "@/lib/koc-form";
import { GoogleButton } from "@/components/auth/google-button";

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
          <KocKayitForm />
          <GoogleButton flow="koc" />

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
      <div className="mb-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-300">
        <p className="font-semibold">Başvurun alındı! 🎉 Son adım: 2 dakikalık bilgi formunu doldur.</p>
        <a
          href={KOC_FORM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 block rounded-xl bg-[#E2600F] px-4 py-3 text-center text-sm font-bold text-white transition hover:bg-[#c2530d]"
        >
          📋 Bilgi Formunu Doldur
        </a>
        <p className="mt-3 text-xs text-emerald-200/70">
          Formun bağlantısını e-postana da gönderdik (bilgi@rekorzeka.com) — görünmüyorsa Spam/Gereksiz
          klasörünü kontrol edip &quot;Spam değil&quot; olarak işaretle. Form + başvurun birlikte
          değerlendirilecek; onaylandığında sana dönüş yapacağız.
        </p>
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
