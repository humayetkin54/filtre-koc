import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { deleteIntroRequest } from "./actions";

const ADMIN_EMAILS = ["enes2oo8@hotmail.com", "akifdemir54@icloud.com"];

interface IntroRequest {
  id: string;
  name: string;
  grade: string;
  area: string;
  phone: string;
  created_at: string;
}

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) {
    redirect("/koc-giris");
  }

  const admin = createAdminClient();
  const { data: requests } = await admin
    .from("intro_requests")
    .select("id, name, grade, area, phone, created_at")
    .order("created_at", { ascending: false });

  const list = (requests ?? []) as IntroRequest[];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">
            Admin Paneli
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Ön Görüşme Talepleri</h1>
          <p className="mt-1 text-sm text-gray-500">
            {list.length} talep
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
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
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString("tr-TR", {
                        day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
                      })}
                    </span>
                    <form action={deleteIntroRequest.bind(null, r.id)}>
                      <button
                        type="submit"
                        className="rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Talebi sil
                      </button>
                    </form>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                    {r.grade}
                  </span>
                  <span className="rounded-full bg-purple-50 px-2.5 py-0.5 text-xs font-medium text-purple-700">
                    {r.area}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
