"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { plans, categories } from "./data";

export function PlansGrid() {
  const [catIdx, setCatIdx] = useState(0);
  const cat = categories[catIdx];
  const searchParams = useSearchParams();
  const coachId = searchParams.get("coach_id") ?? "";
  const coachName = searchParams.get("coach_name") ?? "";

  function checkoutUrl(planName: string, price: number, period: string) {
    return `/satin-al?category=${encodeURIComponent(cat.tag)}&plan=${encodeURIComponent(planName)}&price=${price}&period=${encodeURIComponent(period)}${
      coachId ? `&coach_id=${coachId}&coach_name=${encodeURIComponent(coachName)}` : ""
    }`;
  }

  return (
    <div>
      {/* Kategori sekmeleri */}
      <div className="mx-auto mb-10 flex w-fit flex-wrap justify-center rounded-2xl bg-gray-100 p-1.5">
        {categories.map((c, i) => (
          <button
            key={c.tag}
            type="button"
            onClick={() => setCatIdx(i)}
            className={`rounded-xl px-5 py-2.5 text-sm font-bold transition-colors ${
              i === catIdx ? "bg-[#123A57] text-white shadow" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            {c.title}
          </button>
        ))}
      </div>

      {/* 4 plan kartı */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <div
            key={p.name}
            className={`relative flex flex-col rounded-2xl border p-6 ${
              p.popular
                ? "border-[#123A57] bg-[#123A57] text-white shadow-2xl shadow-[#123A57]/25 xl:-mt-3"
                : "border-gray-200 bg-white"
            }`}
          >
            {p.popular && (
              <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#E2600F] px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-white shadow">
                Sınav Odaklı · En Popüler
              </span>
            )}

            {/* Başlık + fiyat */}
            <div className="text-center">
              <h3 className={`text-lg font-bold ${p.popular ? "text-white" : "text-gray-900"}`}>{p.name}</h3>
              <div className="mt-3 h-5">
                {p.listPrice && (
                  <span className={`text-base line-through ${p.popular ? "text-white/50" : "text-gray-400"}`}>
                    {p.listPrice.toLocaleString("tr-TR")} ₺
                  </span>
                )}
              </div>
              <div className="mt-0.5">
                <span className={`text-4xl font-bold tracking-tight ${p.popular ? "text-white" : "text-[#123A57]"}`}>
                  {p.price.toLocaleString("tr-TR")}
                </span>
                <span className={`text-xl font-bold ${p.popular ? "text-white" : "text-[#123A57]"}`}> ₺</span>
              </div>
              <div className="mt-2 h-6">
                {p.discount && (
                  <span className={`rounded-full px-3 py-1 text-xs font-bold ${
                    p.popular ? "bg-emerald-400/20 text-emerald-300" : "bg-emerald-50 text-emerald-600"
                  }`}>
                    {p.discount}
                  </span>
                )}
              </div>
              <p className={`mt-1.5 text-xs ${p.popular ? "text-white/60" : "text-gray-400"}`}>{p.note}</p>
            </div>

            {/* Kademeye özel avantajlar */}
            <div className="mt-5 space-y-2">
              {p.extras.map((e) => (
                <div
                  key={e.text}
                  className={`flex items-start gap-2 rounded-xl px-3 py-2 text-xs font-semibold ${
                    p.popular ? "bg-white/10 text-white" : "bg-[#eef9f9] text-[#0E8FA3]"
                  }`}
                >
                  <span>{e.icon}</span>
                  <span>{e.text}</span>
                </div>
              ))}
            </div>

            {/* Çekirdek özellikler */}
            <ul className={`mt-4 flex-1 space-y-2 border-t pt-4 ${p.popular ? "border-white/10" : "border-gray-100"}`}>
              {cat.core.map((f) => (
                <li key={f.text} className="flex items-start gap-2 text-[13px]">
                  <span className="mt-0.5 text-sm">{f.icon}</span>
                  <span className={p.popular ? "text-white/90" : "text-gray-600"}>{f.text}</span>
                </li>
              ))}
            </ul>

            <a
              href={checkoutUrl(p.name, p.price, p.period)}
              className={
                p.popular
                  ? "mt-6 block rounded-xl bg-white px-6 py-3.5 text-center text-sm font-bold text-[#123A57] transition-all hover:-translate-y-0.5 hover:shadow-lg"
                  : "btn-primary mt-6 block w-full py-3.5 text-center text-sm font-bold hover:-translate-y-0.5"
              }
            >
              Hemen Satın Al →
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
