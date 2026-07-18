import Link from "next/link";
import Image from "next/image";
import { SifreSifirlaForm } from "./sifre-sifirla-form";

export const metadata = { title: "Yeni Şifre Belirle" };

export default function SifreSifirlaPage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[#0e0e14] px-4">
      <div className="w-full max-w-md">
        <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="mb-8 text-center">
            <Link href="/" className="inline-flex items-center justify-center rounded-xl bg-white px-4 py-2 shadow-sm">
              <Image src="/logo-navbar.png" alt="Rekor Zeka" width={1316} height={1183} className="h-9 w-auto" />
            </Link>
            <h1 className="mt-4 text-xl font-semibold text-gray-900">Yeni şifreni belirle</h1>
            <p className="mt-1 text-sm text-gray-500">
              Hesabın için yeni bir şifre oluştur.
            </p>
          </div>

          <SifreSifirlaForm />
        </div>
      </div>
    </div>
  );
}
