import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { setDocVerified, updateCoachStatus } from "../actions";

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

function fmt(date: string) {
  return new Date(date).toLocaleDateString("tr-TR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

export default async function TaleplerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) redirect("/koc-giris");

  const admin = createAdminClient();
  const { data: coaches } = await admin
    .from("coaches")
    .select("id, name, university, department, types, status, created_at, avatar_initials, avatar_color, avatar_text_color, rank_type, rank_value, result_doc_path, doc_verified")
    .order("created_at", { ascending: false });

  const allCoaches = (coaches ?? []) as Coach[];
  const pendingCoaches = allCoaches.filter(c => c.status === "pending");

  // Sonuç belgeleri gizli bucket'ta — yönetici için 1 saatlik imzalı link üret
  const docLinks: Record<string, string> = {};
  for (const c of allCoaches as (Coach & { result_doc_path?: string | null })[]) {
    if (c.result_doc_path) {
      const { data: signed } = await admin.storage
        .from("belgeler")
        .createSignedUrl(c.result_doc_path, 3600);
      if (signed?.signedUrl) docLinks[c.id] = signed.signedUrl;
    }
  }
  const approvedCoaches = allCoaches.filter(c => c.status === "approved");

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">Admin Paneli</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Talepler</h1>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* Bekleyen Başvurular */}
        <section>
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
                    <div className="mt-1.5 flex flex-wrap items-center gap-2">
                      {(c as Coach & { rank_type?: string | null; rank_value?: number | null }).rank_type &&
                        (c as Coach & { rank_value?: number | null }).rank_value ? (
                        <span className="rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
                          🏆 {(c as Coach & { rank_type?: string }).rank_type} - {((c as Coach & { rank_value?: number }).rank_value ?? 0).toLocaleString("tr-TR")}
                        </span>
                      ) : null}
                      {docLinks[c.id] ? (
                        <>
                          <a href={docLinks[c.id]} target="_blank" rel="noopener noreferrer"
                            className="rounded-full bg-[#eef9f9] px-2.5 py-0.5 text-[11px] font-bold text-[#0E8FA3] hover:underline">
                            📄 Sonuç belgesini görüntüle
                          </a>
                          {(c as Coach & { doc_verified?: boolean }).doc_verified ? (
                            <form action={setDocVerified.bind(null, c.id, false)}>
                              <button type="submit" className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-600 hover:bg-emerald-100">
                                🛡️ Doğrulandı ✓ (geri al)
                              </button>
                            </form>
                          ) : (
                            <form action={setDocVerified.bind(null, c.id, true)}>
                              <button type="submit" className="rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 hover:bg-amber-100">
                                Belgeyi Doğrula
                              </button>
                            </form>
                          )}
                        </>
                      ) : (
                        <span className="text-[11px] text-gray-400">Belge yüklenmemiş</span>
                      )}
                    </div>
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

        {/* Onaylı Koçlar */}
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
                  <div className="flex shrink-0 items-center gap-2">
                    {docLinks[c.id] && (
                      <a href={docLinks[c.id]} target="_blank" rel="noopener noreferrer"
                        className="rounded-lg bg-[#eef9f9] px-3 py-1.5 text-xs font-semibold text-[#0E8FA3] hover:underline">
                        📄 Belge
                      </a>
                    )}
                    {docLinks[c.id] && ((c as Coach & { doc_verified?: boolean }).doc_verified ? (
                      <form action={setDocVerified.bind(null, c.id, false)}>
                        <button type="submit" className="rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-100 transition">
                          🛡️ Doğrulandı ✓
                        </button>
                      </form>
                    ) : (
                      <form action={setDocVerified.bind(null, c.id, true)}>
                        <button type="submit" className="rounded-lg bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition">
                          Doğrula
                        </button>
                      </form>
                    ))}
                    <form action={updateCoachStatus.bind(null, c.id, "rejected")}>
                      <button type="submit" className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100 transition">
                        Kaldır
                      </button>
                    </form>
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
