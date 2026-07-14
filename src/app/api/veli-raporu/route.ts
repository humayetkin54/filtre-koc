import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { sendEmail } from "@/lib/email";

export const maxDuration = 60;

// Haftalık veli raporu — Vercel Cron her pazartesi çağırır (vercel.json).
// Güvenlik: Authorization: Bearer CRON_SECRET (Vercel otomatik ekler) veya ?secret= (manuel test).
// ?dry=1 → e-posta GÖNDERMEZ, kimlere ne gideceğini listeler.

type Deneme = { exam_name: string; exam_date: string; net_total: number | null };

function trFmt(d: string | Date) {
  return new Date(d).toLocaleDateString("tr-TR", { day: "numeric", month: "long" });
}

function raporHtml(opts: {
  studentName: string;
  rangeStr: string;
  coachName: string | null;
  planStr: string | null;
  weekDenemeler: { d: Deneme; diff: number | null }[];
  pendingHw: number;
  totalHw: number;
  goal: string | null;
}) {
  const teal = "#0E8FA3";
  const navy = "#123A57";

  const denemeRows =
    opts.weekDenemeler.length === 0
      ? `<tr><td style="padding:10px 14px;color:#6b7280;font-size:14px;">Bu hafta deneme sonucu girilmedi. Yeni sonuçlar girildiğinde bir sonraki raporda göreceksiniz.</td></tr>`
      : opts.weekDenemeler
          .map(({ d, diff }) => {
            const trend =
              diff === null
                ? ""
                : diff >= 0
                ? `<span style="color:#059669;font-weight:700;"> ▲ +${diff.toFixed(1)}</span>`
                : `<span style="color:#dc2626;font-weight:700;"> ▼ ${diff.toFixed(1)}</span>`;
            return `<tr>
              <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:14px;color:#374151;">${trFmt(d.exam_date)}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:14px;"><span style="background:#eef9f9;color:${teal};font-weight:700;padding:2px 10px;border-radius:99px;font-size:12px;">${d.exam_name}</span></td>
              <td style="padding:10px 14px;border-bottom:1px solid #f3f4f6;font-size:14px;font-weight:700;color:${navy};">${d.net_total != null ? d.net_total.toFixed(1) + " net" : "—"}${trend}</td>
            </tr>`;
          })
          .join("");

  return `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f3f4f6;padding:24px;">
    <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;">
      <div style="background:linear-gradient(135deg,${navy},${teal});padding:28px 28px 22px;">
        <p style="margin:0;color:rgba(255,255,255,0.7);font-size:11px;letter-spacing:2px;text-transform:uppercase;font-weight:700;">Rekor Zeka · Haftalık Veli Raporu</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;">🎓 ${opts.studentName}</h1>
        <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:13px;">${opts.rangeStr}</p>
      </div>

      <div style="padding:24px 28px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:18px;">
          <tr>
            <td style="padding:10px 14px;background:#f9fafb;border-radius:10px 0 0 10px;font-size:13px;color:#6b7280;">Koç</td>
            <td style="padding:10px 14px;background:#f9fafb;font-size:13px;font-weight:700;color:${navy};">${opts.coachName ?? "—"}</td>
            <td style="padding:10px 14px;background:#f9fafb;border-radius:0 10px 10px 0;font-size:12px;color:#9ca3af;">${opts.planStr ?? ""}</td>
          </tr>
        </table>

        <h2 style="margin:0 0 8px;font-size:15px;color:${navy};">📝 Bu Haftaki Denemeler</h2>
        <table style="width:100%;border-collapse:collapse;background:#ffffff;border:1px solid #f3f4f6;border-radius:10px;">
          ${denemeRows}
        </table>

        <h2 style="margin:20px 0 8px;font-size:15px;color:${navy};">✅ Ödev Durumu</h2>
        <p style="margin:0;font-size:14px;color:#374151;">
          <strong style="color:${opts.pendingHw > 0 ? "#d97706" : "#059669"};">${opts.pendingHw} ödev bekliyor</strong>
          · toplam ${opts.totalHw} ödev
        </p>

        ${opts.goal ? `<h2 style="margin:20px 0 8px;font-size:15px;color:${navy};">🎯 Hedef</h2><p style="margin:0;font-size:14px;color:#374151;">${opts.goal}</p>` : ""}

        <div style="text-align:center;margin:26px 0 6px;">
          <a href="https://www.rekorzeka.com/veli-paneli" style="background:${teal};color:#ffffff;text-decoration:none;font-weight:700;font-size:14px;padding:12px 28px;border-radius:10px;display:inline-block;">Veli Panelini Aç →</a>
        </div>
      </div>

      <div style="padding:16px 28px;background:#f9fafb;border-top:1px solid #f3f4f6;">
        <p style="margin:0;font-size:11px;color:#9ca3af;line-height:1.5;">
          Bu raporu, öğrencinizin Veli Takip Sistemi'nde size izin vermesi sayesinde alıyorsunuz.
          Almak istemiyorsanız öğrenciniz profilinden veli takibini kapatabilir veya sizi listeden kaldırabilir.
          Sorularınız için: bilgi@rekorzeka.com
        </p>
      </div>
    </div>
  </div>`;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  const qSecret = url.searchParams.get("secret");
  if (!secret || (auth !== `Bearer ${secret}` && qSecret !== secret)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const dry = url.searchParams.get("dry") === "1";

  const admin = createAdminClient();
  const { data: links, error } = await admin.from("veli_links").select("student_id, parent_email");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!links || links.length === 0) return NextResponse.json({ sent: 0, note: "veli yok" });

  // Öğrenciye göre grupla
  const byStudent = new Map<string, string[]>();
  for (const l of links) {
    const arr = byStudent.get(l.student_id) ?? [];
    arr.push(l.parent_email);
    byStudent.set(l.student_id, arr);
  }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const rangeStr = `${trFmt(weekAgo)} – ${trFmt(new Date())}`;
  const results: { student: string; parents: string[]; status: string }[] = [];
  let sent = 0;

  for (const [studentId, parents] of byStudent) {
    const { data: u } = await admin.auth.admin.getUserById(studentId);
    const meta = u?.user?.user_metadata;
    const studentName = (meta?.full_name as string | undefined) ?? u?.user?.email ?? "Öğrenci";

    if (meta?.veli_takip_enabled !== true) {
      results.push({ student: studentName, parents, status: "takip kapalı — atlandı" });
      continue;
    }

    const [{ data: purchases }, { data: denemeler }, { data: homework }, { data: goals }] = await Promise.all([
      admin.from("purchases").select("coach_name, category, plan").eq("user_id", studentId).eq("status", "active").limit(1),
      admin.from("deneme_results").select("exam_name, exam_date, net_total").eq("student_id", studentId).order("exam_date", { ascending: false }).limit(20),
      admin.from("homework").select("id, status").eq("student_id", studentId),
      admin.from("goals").select("target_university, target_department").eq("student_id", studentId).maybeSingle(),
    ]);

    const all = (denemeler ?? []) as Deneme[];
    const week = all.filter((d) => new Date(d.exam_date) >= weekAgo);
    // Trend: aynı sınav türündeki bir önceki denemeye göre fark
    const weekWithDiff = week.map((d) => {
      const prev = all.find((p) => p.exam_name === d.exam_name && p.exam_date < d.exam_date);
      const diff = prev && prev.net_total != null && d.net_total != null ? d.net_total - prev.net_total : null;
      return { d, diff };
    });

    const purchase = purchases?.[0];
    const html = raporHtml({
      studentName,
      rangeStr,
      coachName: purchase?.coach_name ?? null,
      planStr: purchase ? `${purchase.category} · ${purchase.plan}` : null,
      weekDenemeler: weekWithDiff,
      pendingHw: (homework ?? []).filter((h) => h.status === "pending").length,
      totalHw: (homework ?? []).length,
      goal: goals?.target_university
        ? `${goals.target_university}${goals.target_department ? " — " + goals.target_department : ""}`
        : null,
    });

    if (dry) {
      results.push({ student: studentName, parents, status: `DRY (${week.length} deneme, gönderilmedi)` });
      continue;
    }

    for (const parentEmail of parents) {
      const r = await sendEmail({
        to: [{ email: parentEmail }],
        subject: `📊 ${studentName} — Haftalık Gelişim Raporu (${rangeStr})`,
        html,
      });
      if (r.ok) sent++;
    }
    results.push({ student: studentName, parents, status: "gönderildi" });
  }

  return NextResponse.json({ sent, dry, results });
}
