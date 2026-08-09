"use server";

import { sendEmail } from "@/lib/email";

const NOTIFY_EMAIL = "bilgi@rekorzeka.com";

// Kullanıcı girdisini HTML gövdesine gömmeden önce kaçır — mesaj alanı serbest metin
function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function submitContactMessage(formData: FormData) {
  const name = ((formData.get("name") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim();
  const subject = ((formData.get("subject") as string) ?? "").trim();
  const message = ((formData.get("message") as string) ?? "").trim();

  if (!name || !email || !message) {
    return { error: "Ad, e-posta ve mesaj alanları zorunlu." };
  }
  if (!email.includes("@") || email.length > 200) {
    return { error: "Geçerli bir e-posta adresi gir." };
  }
  if (message.length > 5000) {
    return { error: "Mesaj çok uzun (en fazla 5000 karakter)." };
  }

  const konu = subject || "Belirtilmedi";
  const res = await sendEmail({
    to: [{ email: NOTIFY_EMAIL }],
    // Yanıtla dendiğinde doğrudan ziyaretçiye gitsin
    replyTo: { email, name },
    subject: `İletişim formu: ${konu} — ${name}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:16px">
        <h2 style="color:#123A57;margin:0 0 16px">📬 Yeni iletişim mesajı</h2>
        <div style="background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e2e8f0">
          <p style="margin:0 0 8px;color:#334155;font-size:14px"><strong>Ad Soyad:</strong> ${esc(name)}</p>
          <p style="margin:0 0 8px;color:#334155;font-size:14px"><strong>E-posta:</strong> ${esc(email)}</p>
          <p style="margin:0 0 16px;color:#334155;font-size:14px"><strong>Konu:</strong> ${esc(konu)}</p>
          <p style="margin:0 0 8px;color:#64748b;font-size:12px;font-weight:bold">MESAJ</p>
          <p style="margin:0;color:#334155;font-size:14px;line-height:1.6;white-space:pre-wrap">${esc(message)}</p>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">Bu maili yanıtlarsan doğrudan gönderene ulaşır.</p>
      </div>`,
  });

  // sendEmail anahtar yoksa sessizce atlar — kullanıcıya "gitti" demeyelim
  if (!res.ok) {
    return { error: "Mesaj gönderilemedi. Lütfen bilgi@rekorzeka.com adresine yazın." };
  }

  return { success: true };
}
