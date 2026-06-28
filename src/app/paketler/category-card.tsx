"use client";

import { useState } from "react";
import { categories } from "./data";

export function CategoryCard() {
  const [catIdx, setCatIdx] = useState(0);
  const [planIdx, setPlanIdx] = useState(0);
  const cat = categories[catIdx];
  const plan = cat.plans[planIdx];

  function selectCategory(i: number) {
    setCatIdx(i);
    setPlanIdx(0);
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl">
        {/* Category tabs */}
        <div className="mb-8 grid grid-cols-3 gap-3">
          {categories.map((c, i) => (
            <button
              key={c.tag}
              type="button"
              onClick={() => selectCategory(i)}
              className={`rounded-xl border px-4 py-2.5 text-sm font-bold transition-colors ${
                i === catIdx
                  ? "border-[#3a4cff] bg-[#3a4cff] text-white shadow-sm"
                  : "border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {c.tag}
            </button>
          ))}
        </div>

        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            {cat.title}
          </h2>
        </div>

        {/* Plan tabs */}
        <div className="mx-auto mb-6 flex w-fit rounded-xl bg-gray-100 p-1">
          {cat.plans.map((p, i) => (
            <button
              key={p.name}
              type="button"
              onClick={() => setPlanIdx(i)}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-colors ${
                i === planIdx
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {p.name}
            </button>
          ))}
        </div>

        <div
          className={`relative flex flex-col rounded-2xl border p-8 ${
            plan.highlight
              ? "border-[#3a4cff] bg-[#3a4cff] text-white shadow-2xl shadow-[#3a4cff]/20"
              : "border-gray-200 bg-white"
          }`}
        >
          {plan.highlight && (
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-amber-400 px-4 py-1 text-xs font-bold text-amber-900">
              Avantajlı
            </span>
          )}
          <div>
            <h3 className={`text-lg font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
              {plan.name}
            </h3>
            <div className="mt-4">
              <span className={`text-4xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
                {plan.price.toLocaleString("tr-TR")} ₺
              </span>
              <span className={`text-sm ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
                {" "}{plan.period}
              </span>
            </div>
          </div>

          <ul className="mt-6 flex-1 space-y-3">
            {plan.features.map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <span className={`mt-0.5 font-bold ${plan.highlight ? "text-white" : "text-emerald-500"}`}>
                  ✓
                </span>
                <span className={plan.highlight ? "text-white/90" : "text-gray-700"}>
                  {f}
                </span>
              </li>
            ))}
          </ul>

          <a
            href="/koclar"
            className={`mt-8 block rounded-xl px-6 py-3 text-center text-sm font-bold transition-all hover:-translate-y-0.5 ${
              plan.highlight
                ? "bg-white text-[#3a4cff] hover:shadow-lg"
                : "bg-[#3a4cff] text-white hover:bg-[#2f3fd4]"
            }`}
          >
            Koç seç →
          </a>
        </div>
      </div>
    </section>
  );
}
