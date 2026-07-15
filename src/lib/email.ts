// E-posta gönderimi — iki sağlayıcı destekli:
// EMAIL_PROVIDER=brevo  → Brevo (günde 300 ücretsiz)
// EMAIL_PROVIDER=sender → Sender.net (ayda 15.000 ücretsiz)
// Anahtar tanımlı değilse sessizce atlar — akışı bozmaz

interface EmailRecipient {
  email: string;
  name?: string;
}

interface SendArgs {
  to: EmailRecipient[];
  subject: string;
  html: string;
}

export async function sendEmail(args: SendArgs): Promise<{ ok: boolean; skipped?: boolean }> {
  const provider = process.env.EMAIL_PROVIDER ?? "brevo";
  const senderEmail = process.env.EMAIL_SENDER;

  const validTo = args.to.filter((t) => t.email && t.email.includes("@"));
  if (validTo.length === 0) return { ok: false, skipped: true };

  if (!senderEmail) {
    console.warn("[email] EMAIL_SENDER tanımsız — e-posta atlandı");
    return { ok: false, skipped: true };
  }

  if (provider === "sender") {
    return sendViaSender(validTo, args.subject, args.html, senderEmail);
  }
  return sendViaBrevo(validTo, args.subject, args.html, senderEmail);
}

export function appointmentEmailHtml({
  recipientName,
  otherPartyLabel,
  otherPartyName,
  dateStr,
  time,
  meetingLink,
}: {
  recipientName: string;
  otherPartyLabel: string; // "Koçunuz" | "Öğrenciniz"
  otherPartyName: string;
  dateStr: string;
  time: string;
  meetingLink: string;
}) {
  return `
  <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;background:#f8fafc;border-radius:16px">
    <h2 style="color:#123A57;margin:0 0 4px">🎉 Randevunuz Onaylandı</h2>
    <p style="color:#475569;font-size:14px;margin:0 0 20px">Merhaba ${recipientName},</p>
    <div style="background:#ffffff;border-radius:12px;padding:20px;border:1px solid #e2e8f0">
      <p style="margin:0 0 8px;color:#334155;font-size:14px"><strong>${otherPartyLabel}:</strong> ${otherPartyName}</p>
      <p style="margin:0 0 8px;color:#334155;font-size:14px"><strong>📅 Tarih:</strong> ${dateStr}</p>
      <p style="margin:0 0 16px;color:#334155;font-size:14px"><strong>🕐 Saat:</strong> ${time}</p>
      <a href="${meetingLink}" style="display:inline-block;background:#0E8FA3;color:#ffffff;text-decoration:none;font-weight:bold;padding:12px 24px;border-radius:10px;font-size:14px">
        🎥 Görüşmeye Bağlan
      </a>
      <p style="margin:14px 0 0;color:#94a3b8;font-size:12px">
        Randevu saatinde yukarıdaki bağlantıya tıklamanız yeterli — uygulama kurmanıza gerek yok, tarayıcıda açılır.
      </p>
    </div>
    <p style="color:#94a3b8;font-size:12px;margin:16px 0 0">Rekor Zeka · rekorzeka.com koçluk platformu</p>
  </div>`;
}

/* ── Brevo ── */
async function sendViaBrevo(
  to: EmailRecipient[],
  subject: string,
  html: string,
  senderEmail: string
): Promise<{ ok: boolean; skipped?: boolean }> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[email] BREVO_API_KEY tanımsız — e-posta atlandı");
    return { ok: false, skipped: true };
  }

  try {
    const res = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({
        sender: { email: senderEmail, name: "Rekor Zeka" },
        replyTo: { email: senderEmail, name: "Rekor Zeka" },
        to,
        subject,
        htmlContent: html,
        // Düz metin alternatifi — spam skorunu düşürür
        textContent: html.replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim(),
      }),
      signal: AbortSignal.timeout(15_000),
    });

    if (!res.ok) {
      console.error("[email] Brevo hatası:", res.status, (await res.text()).slice(0, 300));
      return { ok: false };
    }
    return { ok: true };
  } catch (e) {
    console.error("[email] gönderim hatası:", e instanceof Error ? e.message : e);
    return { ok: false };
  }
}

/* ── Sender.net ── */
async function sendViaSender(
  to: EmailRecipient[],
  subject: string,
  html: string,
  senderEmail: string
): Promise<{ ok: boolean; skipped?: boolean }> {
  const apiKey = process.env.SENDER_API_KEY;
  if (!apiKey) {
    console.warn("[email] SENDER_API_KEY tanımsız — e-posta atlandı");
    return { ok: false, skipped: true };
  }

  let allOk = true;
  // Sender API alıcı başına tek istek ister
  for (const recipient of to) {
    try {
      const res = await fetch("https://api.sender.net/v2/message/send", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          from: { email: senderEmail, name: "Rekor Zeka" },
          to: { email: recipient.email, name: recipient.name ?? "" },
          subject,
          html,
        }),
        signal: AbortSignal.timeout(15_000),
      });

      if (!res.ok) {
        console.error("[email] Sender hatası:", res.status, (await res.text()).slice(0, 300));
        allOk = false;
      }
    } catch (e) {
      console.error("[email] gönderim hatası:", e instanceof Error ? e.message : e);
      allOk = false;
    }
  }

  return { ok: allOk };
}