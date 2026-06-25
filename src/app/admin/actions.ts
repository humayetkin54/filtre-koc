"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

const ADMIN_EMAILS = ["enes2oo8@hotmail.com"];

export async function deleteIntroRequest(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user || !ADMIN_EMAILS.includes((user.email ?? "").toLowerCase())) return;

  const admin = createAdminClient();
  await admin.from("intro_requests").delete().eq("id", id);

  revalidatePath("/admin");
}
