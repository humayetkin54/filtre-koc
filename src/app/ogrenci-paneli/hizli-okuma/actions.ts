"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export type SessionRow = {
  date: string; // ISO
  wpm: number;
  comprehension: number;
  effectiveWpm: number;
  title: string;
  passageId?: string | null;
};

async function currentUserId() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

// Tek bir test sonucunu kalıcı kaydet (localStorage yedeği client'ta kalır).
export async function saveReadingSession(r: SessionRow) {
  const userId = await currentUserId();
  if (!userId) return { ok: false as const, error: "no-session" };

  const admin = createAdminClient();
  const { error } = await admin.from("reading_sessions").insert({
    user_id: userId,
    wpm: Math.round(r.wpm),
    comprehension: Math.round(r.comprehension),
    effective_wpm: Math.round(r.effectiveWpm),
    passage_id: r.passageId ?? null,
    passage_title: r.title,
    created_at: r.date,
  });

  if (error && error.code !== "23505") {
    return { ok: false as const, error: error.message };
  }
  return { ok: true as const };
}

// Eski kullanıcıların localStorage geçmişini tek seferde DB'ye taşır.
export async function backfillReadingSessions(rows: SessionRow[]) {
  const userId = await currentUserId();
  if (!userId) return { ok: false as const, error: "no-session" };
  if (!rows.length) return { ok: true as const, inserted: 0 };

  const admin = createAdminClient();
  const payload = rows.slice(-50).map((r) => ({
    user_id: userId,
    wpm: Math.round(r.wpm),
    comprehension: Math.round(r.comprehension),
    effective_wpm: Math.round(r.effectiveWpm),
    passage_id: r.passageId ?? null,
    passage_title: r.title,
    created_at: r.date,
  }));

  // Aynı satır varsa unique index sayesinde çakışır — yoksay.
  const { error } = await admin
    .from("reading_sessions")
    .upsert(payload, { onConflict: "user_id,created_at", ignoreDuplicates: true });

  if (error) return { ok: false as const, error: error.message };
  return { ok: true as const, inserted: payload.length };
}

// Bir egzersiz turu tamamlandığında çağrılır (rozet sayacının kalıcı karşılığı).
// value: Schulte gibi süre/skor taşıyan egzersizlerde ölçüm (ms). Diğerlerinde boş.
export async function logReadingExercise(kind: string, value?: number) {
  const userId = await currentUserId();
  if (!userId) return { ok: false as const };

  const admin = createAdminClient();
  await admin
    .from("reading_exercises")
    .insert({ user_id: userId, kind, value: value ?? null });
  return { ok: true as const };
}
