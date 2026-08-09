import type { Metadata } from "next";
import Script from "next/script";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { Analytics } from "@vercel/analytics/next";
import { PwaSetup } from "@/components/pwa/PwaSetup";
import { createClient, createAdminClient } from "@/lib/supabase/server";
import { ADMIN_EMAILS } from "@/lib/admins";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.rekorzeka.com"),
  title: {
    default: "Rekor Zeka — PDR Destekli Online YKS & LGS Koçluğu",
    template: "%s | Rekor Zeka",
  },
  description:
    "Derece yapmış koçlar, PDR uzmanları ve yapay zeka destekli araçlarla online YKS, LGS ve KPSS koçluğu. AI deneme analizi, hızlı okuma eğitimi ve veli takip sistemi tek platformda.",
  keywords: [
    "YKS koçluğu",
    "LGS koçluğu",
    "online koçluk",
    "sınav koçluğu",
    "TYT net artırma",
    "hızlı okuma",
    "sınav kaygısı",
    "PDR desteği",
    "öğrenci koçu",
  ],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "Rekor Zeka",
    title: "Rekor Zeka — PDR Destekli Online YKS & LGS Koçluğu",
    description:
      "Derece yapmış koçlar, PDR uzmanları ve yapay zeka destekli araçlarla online sınav koçluğu.",
    images: [{ url: "/logo.png", width: 512, height: 512, alt: "Rekor Zeka" }],
  },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: "Rekor Zeka",
    statusBarStyle: "default",
  },
};

export const viewport = {
  themeColor: "#123A57",
};

// Arama motorları için kuruluş şeması
const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: "Rekor Zeka",
  url: "https://www.rekorzeka.com",
  logo: "https://www.rekorzeka.com/logo.png",
  description:
    "PDR destekli, yapay zeka araçlarıyla güçlendirilmiş online YKS, LGS ve KPSS koçluk platformu.",
  email: "bilgi@rekorzeka.com",
  areaServed: "TR",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();


  const isAdmin = !!user && ADMIN_EMAILS.includes((user.email ?? "").toLowerCase());

  let isCoach = false;
  let unseenCount = 0;
  let hasPurchase = false;
  if (user) {
    const { data: coach } = await supabase
      .from("coaches")
      .select("id")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .maybeSingle();
    isCoach = !!coach;

    const admin = createAdminClient();
    const { count: purchaseCount } = await admin
      .from("purchases")
      .select("id", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "active");
    hasPurchase = (purchaseCount ?? 0) > 0;

    if (coach) {
      const { count } = await admin
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
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }} />
        <PwaSetup />
        <Script
          type="module"
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.esm.js"
          strategy="afterInteractive"
        />
        <Script
          noModule
          src="https://unpkg.com/ionicons@7.1.0/dist/ionicons/ionicons.js"
          strategy="afterInteractive"
        />
        <Navbar user={user} isCoach={isCoach} unseenCount={unseenCount} isAdmin={isAdmin} hasPurchase={hasPurchase} />
        <main className="flex-1">{children}</main>
        <Footer />
        <WhatsAppButton />
        <MetaPixel />
        <CookieConsent />
        {/* Cerezsiz, kisi tanimlamayan ziyaretci olcumu — riza bandi gerektirmez */}
        <Analytics />
      </body>
    </html>
  );
}
