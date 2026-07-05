import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { deleteIntroRequest, updateCoachStatus } from "./actions";

const ADMIN_EMAILS = ["enes2oo8@hotmail.com", "akifdemir54@icloud.com"];

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
    admin.from("purchases").select("id, student_email, student_name, coach_name, category, plan, price, period, status, created_at").order("created_at", { ascending: false }),
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
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100 bg-gray-50">
                  <tr>
                    {["Öğrenci", "Koç", "Paket", "Tutar", "Durum", "Tarih"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {sales.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{p.student_name ?? "—"}</p>
                        <p className="text-xs text-gray-400">{p.student_email}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{p.coach_name ?? "—"}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-800">{p.category} · {p.plan}</p>
                        <p className="text-xs text-gray-400">{p.period}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-[#123A57]">
                        {p.price ? p.price.toLocaleString("tr-TR") + " ₺" : "—"}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          p.status === "active"
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          {p.status === "active" ? "Aktif" : p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-400 whitespace-nowrap">
                        {fmt(p.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </section>

        {/* ── KOÇ BAŞVURULARI ── */}
        <section id="talepler">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            ⏳ Bekleyen Koç Başvuruları
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-bold text-amber-700">
              {pendingCoaches.length}
            </span>
          </h2>
          {pendingCoaches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-8 text-center">
              <p className="text-sm text-gray-400">Bekleyen başvuru yok.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pendingCoaches.map((c) => (
                <div key={c.id} className="flex items-center gap-4 rounded-2xl border border-amber-100 bg-white p-5">
                  <div
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: c.avatar_color, color: c.avatar_text_color }}
                  >
                    {c.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900">{c.name}</p>
                    <p className="text-xs text-gray-500">
                      {[c.university, c.department].filter(Boolean).join(" · ")}
                    </p>
                    {c.types && c.types.length > 0 && (
                      <div className="mt-1 flex flex-wrap gap-1">
                        {c.types.map(t => (
                          <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-700">{t}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 shrink-0">{fmt(c.created_at)}</p>
                  <div className="flex gap-2 shrink-0">
                    <form action={updateCoachStatus.bind(null, c.id, "approved")}>
                      <button type="submit" className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600 transition">
                        Onayla
                      </button>
                    </form>
                    <form action={updateCoachStatus.bind(null, c.id, "rejected")}>
                      <button type="submit" className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                        Reddet
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* ── ONAYLANMIŞ KOÇLAR ── */}
        <section>
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
            ✅ Onaylı Koçlar
            <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
              {approvedCoaches.length}
            </span>
          </h2>
          {approvedCoaches.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-8 text-center">
              <p className="text-sm text-gray-400">Henüz onaylı koç yok.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {approvedCoaches.map((c) => (
                <div key={c.id} className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold"
                    style={{ backgroundColor: c.avatar_color, color: c.avatar_text_color }}
                  >
                    {c.avatar_initials}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 text-sm">{c.name}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {[c.university, c.department].filter(Boolean).join(" · ")}
                    </p>
                  </div>
                  <form action={updateCoachStatus.bind(null, c.id, "rejected")}>
                    <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                      Kaldır
                    </button>
                  </form>
                </div>
              ))}
            </div>
          )}
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
