"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = ["enes2oo8@hotmail.com", "akifdemir54@icloud.com"];

export async function cancelPurchase(purchaseId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) return;

  const admin = createAdminClient();
  await admin.from("purchases").update({ status: "cancelled" }).eq("id", purchaseId);
  revalidatePath("/admin");
}

export async function changePurchaseCoach(purchaseId: string, coachId: string, coachName: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) return;

  const admin = createAdminClient();
  await admin.from("purchases").update({ coach_id: coachId, coach_name: coachName }).eq("id", purchaseId);
  revalidatePath("/admin");
}

export async function updateCoachStatus(coachId: string, status: "approved" | "rejected") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) return;

  const admin = createAdminClient();
  await admin.from("coaches").update({ status }).eq("id", coachId);
  revalidatePath("/admin");
  revalidatePath("/koclar");
}

export async function deleteIntroRequest(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) return;

  const admin = createAdminClient();
  await admin.from("intro_requests").delete().eq("id", id);

  revalidatePath("/admin");
}
