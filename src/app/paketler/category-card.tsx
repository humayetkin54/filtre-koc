"use client";

import { useState } from "react";
import type { categories } from "./data";

export function CategoryCard({ cat }: { cat: (typeof categories)[number] }) {
  const [planIdx, setPlanIdx] = useState(0);
  const plan = cat.plans[planIdx];

  return (
    <div className="flex flex-col">
      <div className="mb-4 text-center">
        <span className="inline-flex items-center rounded-full bg-blue-50 px-4 py-1.5 text-sm font-bold text-blue-700">
          {cat.tag}
        </span>
        <h2 className="mt-2 text-lg font-bold tracking-tight text-gray-900">
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
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
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
        className={`relative flex flex-1 flex-col rounded-2xl border p-6 ${
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
          <h3 className={`text-base font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
            {plan.name}
          </h3>
          <div className="mt-3">
            <span className={`text-3xl font-bold ${plan.highlight ? "text-white" : "text-gray-900"}`}>
              {plan.price.toLocaleString("tr-TR")} ₺
            </span>
            <span className={`text-xs ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
              {" "}{plan.period}
            </span>
          </div>
        </div>

        <ul className="mt-5 flex-1 space-y-2.5">
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
          className={
            plan.highlight
              ? "mt-6 block rounded-xl bg-white px-6 py-3 text-center text-sm font-bold text-[#3a4cff] transition-all hover:-translate-y-0.5 hover:shadow-lg"
              : "btn-primary mt-6 w-full text-sm hover:-translate-y-0.5"
          }
        >
          Koç seç →
        </a>
      </div>
    </div>
  );
}
