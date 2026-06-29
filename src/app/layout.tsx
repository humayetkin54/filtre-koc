import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { createClient } from "@/lib/supabase/server";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rekor Zeka",
  description: "Hedefinize uygun koçu bulun ve koçluğa başlayın.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const ADMIN_EMAILS = ["enes2oo8@hotmail.com", "akifdemir54@icloud.com"];
  const isAdmin = !!user && ADMIN_EMAILS.includes((user.email ?? "").toLowerCase());

  let isCoach = false;
  let unseenCount = 0;
  if (user) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .maybeSingle();
    isCoach = !!coach;

    if (coach) {
      const { count } = await supabase
        .from("appointments")
        .select("id", { count: "exact", head: true })
        .eq("coach_id", coach.id)
        .eq("seen_by_coach", false);
      unseenCount = count ?? 0;
    }
  }

  return (
    <html
      lang="tr"
      className={`${poppins.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <Navbar user={user} isCoach={isCoach} unseenCount={unseenCount} isAdmin={isAdmin} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
      </body>
    </html>
  );
}
