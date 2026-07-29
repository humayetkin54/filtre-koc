import { redirect } from "next/navigation";

// Koç browse (vitrin) kaldırıldı — öğrenci koçunu eşleşmeden sonra panelde görür.
// Doğrudan URL ile gelenler ücretsiz ön görüşmeye yönlendirilir.
// (Bireysel koç profilleri /koclar/[id] paylaşım için erişilebilir kalır.)
export default function KoclarPage() {
  redirect("/on-gorusme");
}
