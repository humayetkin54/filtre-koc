import { Suspense } from "react";
import CheckoutFlow from "./checkout-flow";

export default function SatinAlPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <Suspense fallback={<div className="text-center text-gray-400 mt-20">Yükleniyor...</div>}>
        <CheckoutFlow />
      </Suspense>
    </div>
  );
}
