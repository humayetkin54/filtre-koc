"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { savePurchase } from "./actions";

type Step = "ozet" | "kart" | "onay";

function StepIndicator({ current }: { current: Step }) {
  const steps: { id: Step; label: string }[] = [
    { id: "ozet", label: "Sipariş Özeti" },
    { id: "kart", label: "Ödeme" },
    { id: "onay", label: "Onay" },
  ];
  const idx = steps.findIndex((s) => s.id === current);

  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {steps.map((s, i) => (
        <div key={s.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                i < idx
                  ? "bg-[#0E8FA3] text-white"
                  : i === idx
                  ? "bg-[#123A57] text-white ring-4 ring-[#123A57]/20"
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {i < idx ? "✓" : i + 1}
            </div>
            <span className={`mt-1.5 text-xs font-medium ${i === idx ? "text-[#123A57]" : "text-gray-400"}`}>
              {s.label}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={`w-16 h-0.5 mb-5 mx-1 ${i < idx ? "bg-[#0E8FA3]" : "bg-gray-200"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

function formatCard(v: string) {
  return v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();
}
function formatExpiry(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 4);
  return d.length > 2 ? d.slice(0, 2) + "/" + d.slice(2) : d;
}

const inputCls = "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20";

export default function CheckoutFlow() {
  const sp = useSearchParams();
  const category  = sp.get("category") ?? "";
  const plan      = sp.get("plan") ?? "";
  const price     = Number(sp.get("price") ?? 0);
  const period    = sp.get("period") ?? "";
  const coachName = sp.get("coach_name") ?? "";

  const [step, setStep] = useState<Step>("ozet");
  const [card, setCard]     = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  function validateCard() {
    const e: Record<string, string> = {};
    if (card.number.replace(/\s/g, "").length < 16) e.number = "Geçerli bir kart numarası girin.";
    if (!card.name.trim()) e.name = "Kart üzerindeki isim zorunludur.";
    if (card.expiry.length < 5) e.expiry = "Geçerli bir son kullanma tarihi girin.";
    if (card.cvv.length < 3) e.cvv = "CVV en az 3 haneli olmalıdır.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handlePay() {
    if (!validateCard()) return;
    setLoading(true);
    setTimeout(async () => {
      await savePurchase({
        coachId: sp.get("coach_id") ?? "",
        coachName: coachName,
        category,
        plan,
        price,
        period,
      });
      setLoading(false);
      setStep("onay");
    }, 1800);
  }

  return (
    <div className="max-w-lg mx-auto">
      {/* Başlık */}
      <div className="text-center mb-8">
        <Link href="/paketler" className="text-xs text-[#0E8FA3] hover:underline">← Paketlere dön</Link>
        <h1 className="mt-3 text-2xl font-bold text-[#1e293b]">Satın Al</h1>
      </div>

      <StepIndicator current={step} />

      {/* ── ADIM 1: Sipariş Özeti ── */}
      {step === "ozet" && (
        <div className="rounded-2xl bg-white shadow-sm p-8 space-y-6">
          <h2 className="font-bold text-lg text-[#1e293b]">Siparişinizi inceleyin</h2>

          {coachName && (
            <div className="rounded-xl bg-[#eef9f9] border border-[#0E8FA3]/20 p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#123A57] flex items-center justify-center text-white font-bold text-sm">
                {coachName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
              </div>
              <div>
                <p className="text-xs text-gray-400">Seçilen Koç</p>
                <p className="font-semibold text-[#1e293b]">{coachName}</p>
              </div>
            </div>
          )}

          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Paket</span>
              <span className="font-semibold text-gray-900">{category} Koçluğu</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Plan</span>
              <span className="font-semibold text-gray-900">{plan}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Süre</span>
              <span className="font-semibold text-gray-900">{period}</span>
            </div>
            <div className="border-t border-gray-100 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">Toplam</span>
              <span className="font-bold text-xl text-[#123A57]">{price.toLocaleString("tr-TR")} ₺</span>
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-100 p-4 space-y-1.5">
            {["14 gün iade garantisi", "Koç değiştirme hakkı", "Doğrulanmış koç"].map((g) => (
              <div key={g} className="flex items-center gap-2 text-xs text-gray-500">
                <span className="text-emerald-500 font-bold">✓</span> {g}
              </div>
            ))}
          </div>

          <button
            onClick={() => setStep("kart")}
            className="btn-primary w-full py-3 text-sm"
          >
            Ödemeye Geç →
          </button>
        </div>
      )}

      {/* ── ADIM 2: Kart Bilgileri ── */}
      {step === "kart" && (
        <div className="rounded-2xl bg-white shadow-sm p-8 space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-lg text-[#1e293b]">Kart Bilgileri</h2>
            <div className="flex gap-1.5 text-xl">💳</div>
          </div>

          {/* Mini sipariş özeti */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex justify-between items-center text-sm">
            <span className="text-gray-500">{category} · {plan}</span>
            <span className="font-bold text-[#123A57]">{price.toLocaleString("tr-TR")} ₺</span>
          </div>

          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Kart Numarası</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="0000 0000 0000 0000"
                className={inputCls}
                value={card.number}
                onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })}
                maxLength={19}
              />
              {errors.number && <p className="mt-1 text-xs text-red-500">{errors.number}</p>}
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">Kart Üzerindeki İsim</label>
              <input
                type="text"
                placeholder="AD SOYAD"
                className={inputCls}
                value={card.name}
                onChange={(e) => setCard({ ...card, name: e.target.value.toUpperCase() })}
              />
              {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">Son Kullanma</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="AA/YY"
                  className={inputCls}
                  value={card.expiry}
                  onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })}
                  maxLength={5}
                />
                {errors.expiry && <p className="mt-1 text-xs text-red-500">{errors.expiry}</p>}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">CVV</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="•••"
                  className={inputCls}
                  value={card.cvv}
                  onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) })}
                  maxLength={4}
                />
                {errors.cvv && <p className="mt-1 text-xs text-red-500">{errors.cvv}</p>}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 rounded-xl px-4 py-3">
            <span>🔒</span>
            <span>256-bit SSL şifreleme ile güvende. Kart bilgileriniz saklanmaz.</span>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setStep("ozet")}
              className="rounded-xl border-2 border-gray-200 px-5 py-3 text-sm font-medium text-gray-600 hover:border-gray-300 transition"
            >
              Geri
            </button>
            <button
              type="button"
              onClick={handlePay}
              disabled={loading}
              className="btn-primary flex-1 py-3 text-sm disabled:opacity-60"
            >
              {loading ? "İşleniyor..." : `${price.toLocaleString("tr-TR")} ₺ Öde →`}
            </button>
          </div>
        </div>
      )}

      {/* ── ADIM 3: Onay ── */}
      {step === "onay" && (
        <div className="rounded-2xl bg-white shadow-sm p-10 text-center space-y-5">
          <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-3xl">
            ✓
          </div>
          <h2 className="text-xl font-bold text-[#1e293b]">Ödeme Tamamlandı!</h2>
          <p className="text-sm text-gray-500 max-w-xs mx-auto">
            {coachName ? (
              <><span className="font-semibold text-[#123A57]">{coachName}</span> ile <span className="font-semibold">{category} {plan}</span> paketiniz aktif edildi.</>
            ) : (
              <><span className="font-semibold">{category} {plan}</span> paketiniz aktif edildi.</>
            )}
          </p>
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 text-sm text-gray-700 font-semibold">
            {price.toLocaleString("tr-TR")} ₺ · {period}
          </div>
          <p className="text-xs text-gray-400">
            Fatura e-postanıza gönderildi. Koçunuz en kısa sürede iletişime geçecek.
          </p>
          <Link href="/koclar" className="btn-primary inline-block px-8 py-3 text-sm">
            Koçlara Dön →
          </Link>
        </div>
      )}
    </div>
  );
}
