import { createClient } from "@/lib/supabase/server";
import { CoachList } from "./coach-list";
import type { Coach } from "./types";

export default async function KoclarPage() {
  const supabase = await createClient();
  const { data: coaches, error } = await supabase
    .from("coaches")
    .select("*")
    .order("rating", { ascending: false });

  if (error) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 px-6 py-8 text-center">
          <p
            className="font-semibold text-red-800"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Koçlar yüklenirken bir hata oluştu.
          </p>
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!coaches?.length) {
    return (
      <div className="flex min-h-full items-center justify-center bg-zinc-50 px-4">
        <div className="max-w-md rounded-2xl border border-zinc-200 bg-white px-6 py-16 text-center">
          <p
            className="text-lg font-semibold text-zinc-900"
            style={{ fontFamily: "var(--font-sora)" }}
          >
            Henüz kayıtlı koç bulunmuyor.
          </p>
          <p className="mt-2 text-sm text-zinc-500">
            Yakında yeni koçlar eklenecek.
          </p>
        </div>
      </div>
    );
  }

  return <CoachList coaches={coaches as Coach[]} />;
}
