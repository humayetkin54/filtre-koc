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
        to,
        subject,
        htmlContent: html,
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