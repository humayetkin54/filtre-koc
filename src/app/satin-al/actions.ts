"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";

export async function savePurchase(data: {
  coachId: string;
  coachName: string;
  category: string;
  plan: string;
  price: number;
  period: string;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = createAdminClient();

  await admin.from("purchases").insert({
    user_id: user?.id ?? null,
    student_email: user?.email ?? null,
    student_name: user?.user_metadata?.full_name ?? null,
    coach_id: data.coachId || null,
    coach_name: data.coachName || null,
    category: data.category,
    plan: data.plan,
    price: data.price,
    period: data.period,
    status: "active",
  });
}
