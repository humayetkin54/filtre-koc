import { createClient, createAdminClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { PurchasedCoaches } from "./purchased-coaches";

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
  coaches: {
    name: string;
    university: string;
    avatar_initials: string;
    avatar_color: string;
    avatar_text_color: string;
    types: string[];
  };
}

export default async function RandevularimPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");

  const admin = createAdminClient();

  // Satın alınan koçlar
  const { data: purchases } = await admin
    .from("purchases")
    .select("coach_id")
    .eq("user_id", user.id)
    .eq("status", "active");

  const hasUnassignedPurchase = (purchases ?? []).some(p => !p.coach_id);
  const coachIds = [...new Set((purchases ?? []).map((p) => p.coach_id).filter(Boolean))];

  const purchasedCoaches = coachIds.length > 0
    ? (await supabase
        .from("coaches")
        .select("id, name, avatar_initials, avatar_color, avatar_text_color, availability_schedule")
        .in("id", coachIds)
      ).data ?? []
    : [];

  // Randevular
  const { data: appointments } = await supabase
    .from("appointments")
    .select(`
      id, date, time, note, status, created_at,
      coaches (name, university, avatar_initials, avatar_color, avatar_text_color, types)
    `)
    .eq("user_id", user.id)
    .order("date", { ascending: true });

  const upcoming = appointments?.filter((a) => a.status !== "cancelled" && new Date(a.date) >= new Date(new Date().toDateString())) ?? [];
  const past = appointments?.filter((a) => a.status !== "cancelled" && new Date(a.date) < new Date(new Date().toDateString())) ?? [];
  const cancelled = appointments?.filter((a) => a.status === "cancelled") ?? [];

  return (
    <div className="min-h-full bg-gray-50">
      <div className="border-b border-gray-100 bg-white px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#123A57]">Hesabım</p>
          <h1 className="mt-1 text-2xl font-bold text-gray-900">Randevularım</h1>
          <p className="mt-1 text-sm text-gray-500">{user.user_metadata?.full_name ?? user.email}</p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8 space-y-10">

        {/* Koçsuz satın alma uyarısı */}
        {hasUnassignedPurchase && (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-6 py-5 flex items-start gap-4">
            <span className="text-2xl">⚠️</span>
            <div className="flex-1">
              <p className="font-semibold text-amber-800">Koçunuz henüz atanmadı</p>
              <p className="text-sm text-amber-700 mt-1">
                Yöneticiniz size en kısa sürede bir koç atayacak. İsterseniz kendiniz de bir koç seçebilirsiniz.
              </p>
              <a
                href="/koclar"
                className="mt-3 inline-flex items-center gap-1.5 rounded-lg bg-amber-600 px-4 py-2 text-xs font-semibold text-white hover:bg-amber-700 transition"
              >
                Koç Seç →
              </a>
            </div>
          </div>
        )}

        {/* Satın alınan koçlar + randevu al */}
        {purchasedCoaches.length > 0 && (
          <PurchasedCoaches coaches={purchasedCoaches as Parameters<typeof PurchasedCoaches>[0]["coaches"]} />
        )}

        {/* Yaklaşan randevular */}
        <Section title="Yaklaşan" count={upcoming.length}>
          {upcoming.length === 0 ? (
            <Empty text="Yaklaşan randevunuz yok." />
          ) : (
            upcoming.map((a) => <AppointmentCard key={a.id} appointment={a as unknown as Appointment} />)
          )}
        </Section>

        {past.length > 0 && (
          <Section title="Geçmiş" count={past.length}>
            {past.map((a) => <AppointmentCard key={a.id} appointment={a as unknown as Appointment} muted />)}
          </Section>
        )}

        {cancelled.length > 0 && (
          <Section title="İptal" count={cancelled.length}>
            {cancelled.map((a) => <AppointmentCard key={a.id} appointment={a as unknown as Appointment} muted />)}
          </Section>
        )}
      </div>
    </div>
  );
}

function Section({ title, count, children }: { title: string; count: number; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wider">
        {title}
        <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs font-bold text-gray-600">{count}</span>
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

function AppointmentCard({ appointment: a, muted = false }: { appointment: Appointment; muted?: boolean }) {
  const status = statusConfig[a.status];
  const dateStr = new Date(a.date).toLocaleDateString("tr-TR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });

  return (
    <div className={`flex gap-4 rounded-2xl border bg-white p-5 transition-opacity ${muted ? "opacity-60" : ""}`}>
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-sm font-bold"
        style={{ backgroundColor: a.coaches.avatar_color, color: a.coaches.avatar_text_color }}
      >
        {a.coaches.avatar_initials}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="font-semibold text-gray-900">{a.coaches.name}</p>
            <p className="text-xs text-gray-500">{a.coaches.university}</p>
          </div>
          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}>
            {status.label}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600">
          <span>📅 {dateStr}</span>
          <span>🕐 {a.time}</span>
        </div>

        {a.note && <p className="mt-2 text-sm text-gray-400 italic">&ldquo;{a.note}&rdquo;</p>}

        <div className="mt-2 flex flex-wrap gap-1.5">
          {a.coaches.types.map((t) => (
            <span key={t} className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">{t}</span>
          ))}
        </div>
      </div>
    </div>
  );
}
