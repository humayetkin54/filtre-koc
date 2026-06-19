import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateProfile } from "./actions";

export default async function ProfilPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const params = await searchParams;

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3a4cff]">
            Hesabım
          </p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Profil</h1>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">

        {/* Avatar */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#3a4cff]/10 text-2xl font-bold text-[#3a4cff]">
              {(user.user_metadata?.full_name as string)?.[0]?.toUpperCase() ??
                user.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-900">
                {user.user_metadata?.full_name ?? "—"}
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                Kayıt: {new Date(user.created_at).toLocaleDateString("tr-TR")}
              </p>
            </div>
          </div>
        </div>

        {/* Bilgileri güncelle */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 font-semibold text-gray-900">Bilgilerimi güncelle</h2>

          {params.success && (
            <div className="mb-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              Bilgileriniz güncellendi.
            </div>
          )}
          {params.error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {params.error}
            </div>
          )}

          <form action={updateProfile} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Ad Soyad
              </label>
              <input
                type="text"
                name="name"
                defaultValue={user.user_metadata?.full_name ?? ""}
                placeholder="Ada Yılmaz"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                E-posta
              </label>
              <input
                type="email"
                name="email"
                defaultValue={user.email ?? ""}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-[#3a4cff] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#2f3fd4]"
            >
              Kaydet
            </button>
          </form>
        </div>

        {/* Şifre değiştir */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="mb-5 font-semibold text-gray-900">Şifre değiştir</h2>
          <form action={updateProfile} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-gray-700">
                Yeni şifre
              </label>
              <input
                type="password"
                name="password"
                minLength={6}
                placeholder="En az 6 karakter"
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#3a4cff] focus:ring-2 focus:ring-[#3a4cff]/20"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Şifreyi güncelle
            </button>
          </form>
        </div>

        {/* Hesap bilgileri */}
        <div className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
          <h2 className="mb-4 text-sm font-semibold text-gray-500">Hesap bilgileri</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-400">Kullanıcı ID</dt>
              <dd className="font-mono text-xs text-gray-500">{user.id.slice(0, 8)}…</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">E-posta doğrulama</dt>
              <dd className={user.email_confirmed_at ? "text-emerald-600 font-medium" : "text-amber-600"}>
                {user.email_confirmed_at ? "Doğrulandı" : "Bekliyor"}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-400">Son giriş</dt>
              <dd className="text-gray-600">
                {new Date(user.last_sign_in_at ?? user.created_at).toLocaleDateString("tr-TR", {
                  day: "numeric", month: "long", year: "numeric",
                })}
              </dd>
            </div>
          </dl>
        </div>

      </div>
    </div>
  );
}
