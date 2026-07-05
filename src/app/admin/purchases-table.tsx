"use client";

import { useState } from "react";
import { cancelPurchase, changePurchaseCoach } from "./actions";

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
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export function PurchasesTable({ sales, coaches }: { sales: Purchase[]; coaches: Coach[] }) {
  const [changingId, setChangingId] = useState<string | null>(null);
  const [selectedCoach, setSelectedCoach] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleCancel(id: string) {
    if (!confirm("Bu satışı iptal etmek istediğinize emin misiniz?")) return;
    setLoading(true);
    await cancelPurchase(id);
    setLoading(false);
  }

  async function handleCoachChange(purchaseId: string) {
    if (!selectedCoach) return;
    const coach = coaches.find(c => c.id === selectedCoach);
    if (!coach) return;
    setLoading(true);
    await changePurchaseCoach(purchaseId, coach.id, coach.name);
    setChangingId(null);
    setSelectedCoach("");
    setLoading(false);
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
      <table className="w-full text-sm">
        <thead className="border-b border-gray-100 bg-gray-50">
          <tr>
            {["Öğrenci", "Koç", "Paket", "Tutar", "Durum", "Tarih", "İşlem"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {sales.map((p) => (
            <tr key={p.id} className={`transition-colors ${p.status === "cancelled" ? "opacity-50" : "hover:bg-gray-50/50"}`}>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-900">{p.student_name ?? "—"}</p>
                <p className="text-xs text-gray-400">{p.student_email}</p>
              </td>
              <td className="px-4 py-3">
                {changingId === p.id ? (
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedCoach}
                      onChange={e => setSelectedCoach(e.target.value)}
                      className="rounded-lg border border-gray-200 px-2 py-1 text-xs text-gray-800 outline-none focus:border-[#0E8FA3]"
                    >
                      <option value="">Koç seç...</option>
                      {coaches.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                    <button
                      onClick={() => handleCoachChange(p.id)}
                      disabled={!selectedCoach || loading}
                      className="rounded-lg bg-[#0E8FA3] px-2 py-1 text-[10px] font-semibold text-white disabled:opacity-50"
                    >
                      Kaydet
                    </button>
                    <button
                      onClick={() => { setChangingId(null); setSelectedCoach(""); }}
                      className="rounded-lg bg-gray-100 px-2 py-1 text-[10px] font-semibold text-gray-600"
                    >
                      İptal
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-600">{p.coach_name ?? "—"}</span>
                )}
              </td>
              <td className="px-4 py-3">
                <p className="font-medium text-gray-800">{p.category} · {p.plan}</p>
                <p className="text-xs text-gray-400">{p.period}</p>
              </td>
              <td className="px-4 py-3 font-bold text-[#123A57]">
                {p.price ? p.price.toLocaleString("tr-TR") + " ₺" : "—"}
              </td>
              <td className="px-4 py-3">
                <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
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
                      onClick={() => { setChangingId(p.id); setSelectedCoach(p.coach_id ?? ""); }}
                      className="rounded-lg bg-blue-50 px-2.5 py-1.5 text-[10px] font-semibold text-blue-700 hover:bg-blue-100 transition whitespace-nowrap"
                    >
                      Koç Değiştir
                    </button>
                    <button
                      onClick={() => handleCancel(p.id)}
                      disabled={loading}
                      className="rounded-lg bg-red-50 px-2.5 py-1.5 text-[10px] font-semibold text-red-600 hover:bg-red-100 transition disabled:opacity-50 whitespace-nowrap"
                    >
                      İptal Et
                    </button>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
