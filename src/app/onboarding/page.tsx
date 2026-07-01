import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import OnboardingForm from "./onboarding-form";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/giris");
  if (user.user_metadata?.onboarding_completed) redirect("/koclar");

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#eef3f5] to-[#cfe9e6] flex items-center justify-center px-4 py-12">
      <OnboardingForm />
    </div>
  );
}
