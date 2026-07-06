import { createClient, createAdminClient } from "@/lib/supabase/server";
import { saveGoal } from "../actions";

export default async function HedeflerPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  const { data: goal } = await admin
    .from("goals")
    .select("*")
    .eq("student_id", user!.id)
    .maybeSingle();

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h1 className="text-xl font-bold text-gray-900 mb-1">🎯 Hedeflerim</h1>
        <p className="text-sm text-gray-500">Hedef üniversiteni, bölümünü ve sınav hedefini belirle.</p>
      </div>

      {goal && (
        <div className="rounded-2xl bg-gradient-to-br from-[#123A57] to-[#0E8FA3] p-6 text-white">
          <p className="text-xs font-semibold text-white/60 uppercase tracking-widest mb-3">Mevcut Hedefin</p>
          <div className="grid grid-cols-2 gap-4">
            {goal.target_university && (
              <div>
                <p className="text-xs text-white/50">Üniversite</p>
                <p className="font-bold text-lg leading-tight">{goal.target_university}</p>
              </div>
            )}
            {goal.target_department && (
              <div>
                <p className="text-xs text-white/50">Bölüm</p>
                <p className="font-bold text-lg leading-tight">{goal.target_department}</p>
              </div>
            )}
            {goal.target_exam && (
              <div>
                <p className="text-xs text-white/50">Sınav</p>
                <p className="font-bold">{goal.target_exam}</p>
              </div>
            )}
            {goal.target_score && (
              <div>
                <p className="text-xs text-white/50">Hedef Net</p>
                <p className="font-bold">{goal.target_score}</p>
              </div>
            )}
          </div>
          {goal.notes && (
            <p className="mt-4 text-sm text-white/70 border-t border-white/10 pt-4">{goal.notes}</p>
          )}
        </div>
      )}

      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="text-sm font-bold text-gray-700 mb-4">{goal ? "Hedefini Güncelle" : "Hedef Belirle"}</h2>
        <form action={saveGoal} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hedef Üniversite</label>
              <input
                type="text"
                name="target_university"
                defaultValue={goal?.target_university ?? ""}
                placeholder="Örn: İTÜ, ODTÜ, Boğaziçi"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hedef Bölüm</label>
              <input
                type="text"
                name="target_department"
                defaultValue={goal?.target_department ?? ""}
                placeholder="Örn: Bilgisayar Mühendisliği"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hedef Sınav</label>
              <select
                name="target_exam"
                defaultValue={goal?.target_exam ?? ""}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
              >
                <option value="">Seç</option>
                {["TYT", "AYT (Sayısal)", "AYT (Sözel)", "AYT (Eşit Ağırlık)", "LGS", "KPSS"].map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5">Hedef Net Sayısı</label>
              <input
                type="number"
                name="target_score"
                defaultValue={goal?.target_score ?? ""}
                placeholder="Örn: 120"
                min="0"
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3]"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Notlar (isteğe bağlı)</label>
            <textarea
              name="notes"
              defaultValue={goal?.notes ?? ""}
              rows={3}
              placeholder="Hedefine dair eklemek istediğin bir şey var mı?"
              className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#0E8FA3] resize-none"
            />
          </div>
          <button
            type="submit"
            className="rounded-xl bg-[#0E8FA3] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#0c7689] transition"
          >
            {goal ? "Güncelle" : "Kaydet"}
          </button>
        </form>
      </div>
    </div>
  );
}
