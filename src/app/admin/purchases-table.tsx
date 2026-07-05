"use client";

import { useState } from "react";
import { cancelPurchase } from "./actions";
import { CoachChangeModal } from "./coach-change-modal";

interface Purchase {
  id: string;
  student_email: string | null;
  student_name: string | null;
  coach_name: string | null;
  coach_id: string | null;
  category: string | null;
  plan: string | null;
  price: number | null;
  period: string | null;
  status: string;
  created_at: string;
}

interface Coach {
  id: string;
  name: string;
  university: string | null;
  department: string | null;
  types: string[] | null;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function PurchasesTable({ sales, coaches }: { sales: Purchase[]; coaches: Coach[] }) {
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [modalPurchase, setModalPurchase] = useState<Purchase | null>(null);

  async function handleCancel(p: Purchase) {
    if (!confirm(`${p.student_name ?? "Öğrenci"} adlı öğrencinin satışı iptal edilsin mi?`)) return;
    setCancellingId(p.id);
    await cancelPurchase(p.id);
    setCancellingId(null);
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              {["Öğrenci", "Koç", "Paket", "Tutar", "Durum", "Tarih", "İşlem"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {sales.map((p) => (
              <tr key={p.id} className={`transition-colors ${p.status === "cancelled" ? "opacity-50 bg-gray-50/50" : "hover:bg-gray-50/50"}`}>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-900 whitespace-nowrap">{p.student_name ?? "—"}</p>
                  <p className="text-xs text-gray-400">{p.student_email}</p>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {p.coach_name ?? <span className="text-gray-300 italic text-xs">Atanmamış</span>}
                </td>
                <td className="px-4 py-3">
                  <p className="font-medium text-gray-800 whitespace-nowrap">{p.category} · {p.plan}</p>
                  <p className="text-xs text-gray-400">{p.period}</p>
                </td>
                <td className="px-4 py-3 font-bold text-[#123A57] whitespace-nowrap">
                  {p.price ? p.price.toLocaleString("tr-TR") + " ₺" : "—"}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${
                    p.status === "active" ? "bg-emerald-50 text-emerald-700"
                    : p.status === "cancelled" ? "bg-red-50 text-red-600"
                    : "bg-gray-100 text-gray-500"
                  }`}>
                    {p.status === "active" ? "Aktif" : p.status === "cancelled" ? "İptal" : p.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                  {fmt(p.created_at)}
                </td>
                <td className="px-4 py-3">
                  {p.status !== "cancelled" && (
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => setModalPurchase(p)}
                        className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                      >
                        Koç Değiştir
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCancel(p)}
                        disabled={cancellingId === p.id}
                        className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50 whitespace-nowrap"
                      >
                        {cancellingId === p.id ? "..." : "İptal Et"}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalPurchase && (
        <CoachChangeModal
          purchase={modalPurchase}
          coaches={coaches}
          onClose={() => setModalPurchase(null)}
        />
      )}
    </>
  );
}
