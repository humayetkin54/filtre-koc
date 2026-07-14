import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { TamamlaForm } from "./tamamla-form";

export const metadata = { title: "Koç Başvurunu Tamamla | Rekor Zeka" };

// Google ile giriş yapan koç adayı buraya düşer: üniversite/bölüm/bio tamamlar.
export default async function KocKayitTamamlaPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/koc-giris");

  const admin = createAdminClient();
  const { data: coachRow } = await admin
    .from("coaches")
    .select("status")
    .eq("user_id", user.id)
    .maybeSingle();
  if (coachRow) {
    redirect(coachRow.status === "approved" ? "/koc-paneli" : "/koc-giris");
  }

  const name = (user.user_metadata?.full_name as string) ?? user.email ?? "";

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ background: "linear-gradient(135deg, #0e0e14 0%, #1a1040 100%)" }}
    >
      <div
        className="w-full max-w-md rounded-2xl p-8"
        style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.12)" }}
      >
        <h1 className="text-xl font-semibold text-white">Son bir adım, {name.split(" ")[0]} 👋</h1>
        <p className="mt-2 text-sm text-gray-400">
          Google hesabınla giriş yaptın. Koç başvurunu tamamlamak için birkaç bilgiye ihtiyacımız var —
          başvurun incelendikten sonra sana dönüş yapacağız.
        </p>
        <TamamlaForm />
      </div>
    </div>
  );
}
