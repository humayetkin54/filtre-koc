import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { updateAppointmentStatus } from "./actions";
import { AvailabilityEditor } from "./availability-editor";

const statusConfig = {
  pending: { label: "Bekliyor", className: "bg-amber-50 text-amber-700 ring-amber-500/25" },
  confirmed: { label: "Onaylandı", className: "bg-emerald-50 text-emerald-700 ring-emerald-500/25" },
  cancelled: { label: "İptal", className: "bg-red-50 text-red-700 ring-red-500/25" },
} as const;

type AppointmentStatus = keyof typeof statusConfig;

interface Appointment {
  id: string;
  date: string;
  time: string;
  note: string | null;
  status: AppointmentStatus;
  created_at: string;
  user_id: string;
  student_name: string | null;
  student_email: string | null;
  meeting_link: string | null;
}

export default async function KocPaneliPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/koc-giris");

  // Koç kaydı ve onay kontrolü
  const { data: coach } = await supabase
    .from("coaches")
    .select("id, name, status, avatar_initials, avatar_color, avatar_text_color, availability_schedule")
    .eq("user_id", user.id)
    .single();

  if (!coach) redirect("/koc-giris");
  if (coach.status === "pending") {
    return (
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md text-center">
          <div className="text-4xl mb-4">⏳</div>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Başvurunuz inceleniyor</h1>
          <p className="text-gray-500 text-sm">
            Hesabınız onaylandığında size e-posta ile bildirim göndereceğiz.
            En kısa sürede dönüş yapacağız.
          </p>
        </div>
      </div>
    );
  }

  const admin = createAdminClient();
  const { data: appointments } = await admin
    .from("appointments")
    .select("id, date, time, note, status, created_at, user_id, student_name, student_email, meeting_link")
    .eq("coach_id", coach.id)
    .order("date", { ascending: true });

  const appts = (appointments ?? []) as Appointment[];

  await admin
    .from("appointments")
    .update({ seen_by_coach: true })
    .eq("coach_id", coach.id)
    .eq("seen_by_coach", false);

  const upcoming = appts.filter(
    (a) => a.status !== "cancelled" && new Date(a.date) >= new Date(new Date().toDateString())
  );
  const past = appts.filter(
    (a) => a.status !== "cancelled" && new Date(a.date) < new Date(new Date().toDateString())
  );
  const pending = appts.filter((a) => a.status === "pending");

  return (
    <div className="min-h-full bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl flex items-center gap-4">
          <div
            className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl text-lg font-bold"
            style={{ backgroundColor: coach.avatar_color, color: coach.avatar_text_color }}
          >
            {coach.avatar_initials}
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">
              Koç Paneli
            </p>
            <h1 className="text-2xl font-bold text-gray-900">{coach.name}</h1>
          </div>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Toplam", value: appts.length },
            { label: "Yaklaşan", value: upcoming.length },
            { label: "Onay Bekleyen", value: pending.length },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-gray-200 bg-white p-5 text-center">
              <p className="text-3xl font-bold text-gray-900">{s.value}</p>
              <p className="mt-1 text-xs text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Müsaitlik Takvimi */}
        <div className="mb-10 rounded-2xl border border-gray-200 bg-white p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-xl bg-[#eef9f9] flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="#0E8FA3" strokeWidth={2} className="w-5 h-5">
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <path strokeLinecap="round" d="M16 2v4M8 2v4M3 10h18" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-gray-900">Müsaitlik Takvimi</h2>
              <p className="text-xs text-gray-500">Öğrencilerin randevu alabileceği gün ve saatleri belirleyin</p>
            </div>
          </div>
          <AvailabilityEditor
            coachId={coach.id}
            initial={(coach.availability_schedule as Record<string, string[]>) ?? {}}
          />
        </div>

        <div className="space-y-10">
          {/* Onay bekleyenler */}
          {pending.length > 0 && (
            <Section title="Onay Bekleyen" count={pending.length} highlight>
              {pending.map((a) => (
                <AppointmentCard key={a.id} appointment={a} showActions />
              ))}
            </Section>
          )}

          {/* Yaklaşan */}
          <Section title="Yaklaşan" count={upcoming.filter(a => a.status !== "pending").length}>
            {upcoming.filter(a => a.status !== "pending").length === 0 ? (
              <Empty text="Yaklaşan onaylı randevunuz yok." />
            ) : (
              upcoming
                .filter((a) => a.status !== "pending")
                .map((a) => <AppointmentCard key={a.id} appointment={a} showActions />)
            )}
          </Section>

          {/* Geçmiş */}
          {past.length > 0 && (
            <Section title="Geçmiş" count={past.length}>
              {past.map((a) => <AppointmentCard key={a.id} appointment={a} muted />)}
            </Section>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({
  title, count, children, highlight = false,
}: {
  title: string; count: number; children: React.ReactNode; highlight?: boolean;
}) {
  return (
    <div>
      <h2 className={`mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${highlight ? "text-amber-600" : "text-gray-500"}`}>
        {title}
        <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${highlight ? "bg-amber-100 text-amber-700" : "bg-gray-200 text-gray-600"}`}>
          {count}
        </span>
      </h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-10 text-center">
      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}

function AppointmentCard({
  appointment: a,
  muted = false,
  showActions = false,
}: {
  appointment: Appointment;
  muted?: boolean;
  showActions?: boolean;
}) {
  const status = statusConfig[a.status];
  const dateStr = new Date(a.date).toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  const confirmAction = updateAppointmentStatus.bind(null, a.id, "confirmed");
  const cancelAction = updateAppointmentStatus.bind(null, a.id, "cancelled");

  return (
    <div className={`rounded-2xl border bg-white p-5 transition-opacity ${muted ? "opacity-60" : ""}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-gray-900">
            {a.student_name ?? "Öğrenci"}
          </p>
          {a.student_email && (
            <p className="text-xs text-gray-500">{a.student_email}</p>
          )}
        </div>
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}>
          {status.label}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-gray-600">
        <span>📅 {dateStr}</span>
        <span>🕐 {a.time}</span>
      </div>

      {a.note && (
        <p className="mt-2 text-sm text-gray-400 italic">&ldquo;{a.note}&rdquo;</p>
      )}

      {showActions && a.status === "pending" && (
        <div className="mt-4 flex gap-2">
          <form action={confirmAction}>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-600"
            >
              Onayla
            </button>
          </form>
          <form action={cancelAction}>
            <button
              type="submit"
              className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              İptal et
            </button>
          </form>
        </div>
      )}

      {showActions && a.status === "confirmed" && (
        <div className="mt-4 flex flex-wrap gap-2">
          {a.meeting_link && (
            <a
              href={a.meeting_link}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg bg-[#0E8FA3] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#0c7689]"
            >
              🎥 Görüşmeye Bağlan
            </a>
          )}
          <form action={cancelAction}>
            <button
              type="submit"
              className="rounded-lg bg-red-50 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
            >
              İptal et
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
