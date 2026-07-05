import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateCoachStatus } from "../actions";

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
    .select("id, name, university, department, types, status, created_at, avatar_initials, avatar_color, avatar_text_color")
    .order("created_at", { ascending: false });

  const allCoaches = (coaches ?? []) as Coach[];
  const pendingCoaches = allCoaches.filter(c => c.status === "pending");
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

      </div>
    </div>
  );
}
