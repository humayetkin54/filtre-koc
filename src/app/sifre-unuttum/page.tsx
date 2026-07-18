import Link from "next/link";
import Image from "next/image";
import { SifreUnuttumForm } from "./sifre-unuttum-form";

export const metadata = { title: "Şifremi Unuttum" };

export default function SifreUnuttumPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0e0e14] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">Şifremi unuttum</h1>
            <p className="mt-1 text-sm text-gray-500">
              E-posta adresini yaz; sana şifre sıfırlama bağlantısı gönderelim.
            </p>
          </div>

          <SifreUnuttumForm />

          <p className="mt-6 text-center text-sm text-gray-500">
            Şifreni hatırladın mı?{" "}
            <Link href="/giris" className="font-medium text-[#123A57] hover:underline">
              Giriş yap
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
