import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { deleteIntroRequest, updateCoachStatus } from "./actions";
import { PurchasesTable } from "./purchases-table";

import { ADMIN_EMAILS } from "@/lib/admins";

interface Coach {
  id: string;
  name: string;
  university: string | null;
  department: string | null;
  types: string[] | null;
  status: string;
  created_at: string;
  avatar_initials: string;
  avatar_color: string;
  avatar_text_color: string;
}

interface IntroRequest {
  id: string; name: string; grade: string; area: string; phone: string; created_at: string;
}
interface Purchase {
  id: string;
  student_email: string | null;
  student_name: string | null;
  coach_name: string | null;
  category: string | null;
  plan: string | null;
  price: number | null;
  period: string | null;
  status: string;
  created_at: string;
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) redirect("/koc-giris");

  const admin = createAdminClient();
  const [{ data: requests }, { data: purchases, error: purchasesError }, { data: coaches }] = await Promise.all([
    admin.from("intro_requests").select("id, name, grade, area, phone, created_at").order("created_at", { ascending: false }),
    admin.from("purchases").select("id, student_email, student_name, coach_name, coach_id, category, plan, price, period, status, created_at").order("created_at", { ascending: false }),
    admin.from("coaches").select("id, name, university, department, types, status, created_at, avatar_initials, avatar_color, avatar_text_color").order("created_at", { ascending: false }),
  ]);

  if (purchasesError) console.error("[Admin] purchases sorgu hatası:", purchasesError.message);

  const list = (requests ?? []) as IntroRequest[];
  const sales = (purchases ?? []) as Purchase[];
  const allCoaches = (coaches ?? []) as Coach[];
  const pendingCoaches = allCoaches.filter(c => c.status === "pending");
  const approvedCoaches = allCoaches.filter(c => c.status === "approved");

  const totalRevenue = sales.filter(p => p.status === "active").reduce((s, p) => s + (p.price ?? 0), 0);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">Admin Paneli</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Yönetim</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* ── SATIN ALANLAR ── */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              💳 Satın Alanlar
              <span className="rounded-full bg-[#123A57] px-2.5 py-0.5 text-xs font-bold text-white">
                {sales.length}
              </span>
            </h2>
            <div className="text-right">
              <p className="text-xs text-gray-400">Toplam Ciro</p>
              <p className="text-xl font-bold text-[#0E8FA3]">
                {totalRevenue.toLocaleString("tr-TR")} ₺
              </p>
            </div>
          </div>

          {/* Özet kartları */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Toplam Satış", value: sales.length },
              { label: "Aktif Paket", value: sales.filter(p => p.status === "active").length },
              { label: "Benzersiz Öğrenci", value: new Set(sales.map(p => p.student_email)).size },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
                <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                <p className="mt-1 text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {purchasesError ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-6 py-6">
              <p className="text-sm font-semibold text-red-700 mb-1">⚠ Tablo bulunamadı</p>
              <p className="text-xs text-red-600 font-mono">{purchasesError.message}</p>
              <p className="mt-3 text-xs text-red-500">
                Supabase SQL Editor&apos;da şu komutu çalıştırın:
              </p>
              <pre className="mt-2 rounded-lg bg-red-100 p-3 text-[11px] text-red-800 overflow-x-auto whitespace-pre-wrap">{`CREATE TABLE IF NOT EXISTS purchases (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  student_email TEXT,
  student_name TEXT,
  coach_id TEXT,
  coach_name TEXT,
  category TEXT,
  plan TEXT,
  price INTEGER,
  period TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}</pre>
            </div>
          ) : sales.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-gray-400">Henüz satın alma kaydı yok.</p>
            </div>
          ) : sales.length > 0 ? (
            <PurchasesTable
              sales={sales as Parameters<typeof PurchasesTable>[0]["sales"]}
              coaches={allCoaches.filter(c => c.status === "approved") as Parameters<typeof PurchasesTable>[0]["coaches"]}
            />
          ) : null}
        </section>

        {/* ── ÖN GÖRÜŞME TALEPLERİ ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            📋 Ön Görüşme Talepleri
            <span className="rounded-full bg-gray-200 px-2.5 py-0.5 text-xs font-bold text-gray-600">
              {list.length}
            </span>
          </h2>

          {list.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
              <p className="text-sm text-gray-400">Henüz görüşme talebi yok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {list.map((r) => (
                <div key={r.id} className="rounded-2xl border border-gray-200 bg-white p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{r.name}</p>
                      <p className="text-sm text-gray-500">{r.phone}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-gray-400">{fmt(r.created_at)}</span>
                      <form action={deleteIntroRequest.bind(null, r.id)}>
                        <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100">
                          Sil
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">{r.grade}</span>
                    <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">{r.area}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
