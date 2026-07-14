import { Suspense } from "react";
import Link from "next/link";
import CheckoutFlow from "./checkout-flow";
import { SALES_ACTIVE } from "@/lib/launch";

export default function SatinAlPage() {
  // Lansman öncesi: ödeme akışı kapalı — tüm yollar ön görüşmeye çıkar
  if (!SALES_ACTIVE) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-10 text-center">
          <div className="text-5xl">🎉</div>
          <h1 className="mt-4 text-xl font-bold text-gray-900">Eylül Dönemi Erken Kayıt</h1>
          <p className="mt-2 text-sm leading-relaxed text-gray-500">
            Kayıtlar şu an <strong>ücretsiz ön görüşmeyle</strong> alınıyor. 30 dakikalık görüşmede
            hedefini birlikte belirliyor, sana en uygun koçu ve paketi öneriyoruz — yerini ayırtmak
            için görüşme planlaman yeterli.
          </p>
          <Link
            href="/on-gorusme"
            className="btn-primary mt-6 inline-block px-8 py-3.5 text-sm font-bold"
          >
            Ücretsiz Ön Görüşme Planla →
          </Link>
          <p className="mt-4 text-xs text-gray-400">Sorularınız için: bilgi@rekorzeka.com</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="text-center text-gray-400 mt-20">Yükleniyor...</div>}>
        <CheckoutFlow />
      </Suspense>
    </div>
  );
}
