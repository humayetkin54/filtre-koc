"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { callGeminiWithImages, type GeminiImage } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

const EXAM_LABELS: Record<string, string> = {
  TYT: "TYT (Temel Yeterlilik Testi)",
  SAY: "AYT Sayısal",
  EA: "AYT Eşit Ağırlık",
  SOZ: "AYT Sözel",
  DIL: "YDT Yabancı Dil",
};

interface ScanQuestion {
  ders: string;
  konu: string;
  sonuc: "dogru" | "yanlis";
}

function extractJson(raw: string): string {
  let s = raw.trim();
  const first = s.indexOf("{");
  const last = s.lastIndexOf("}");
  if (first >= 0 && last > first) s = s.slice(first, last + 1);
  return s;
}

async function getUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");
  return user;
}

/* 1) Tarama kaydı başlat */
export async function startExamScan(examName: string, examDate: string, photoCount: number) {
  const user = await getUser();
  const admin = createAdminClient();

  if (!examName || !examDate) return { error: "Sınav türü ve tarih zorunlu." };
  if (photoCount < 1 || photoCount > 41) return { error: "1-41 arası fotoğraf yükleyebilirsin." };

  const { data: purchase } = await admin
    .from("purchases")
    .select("coach_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  const { data: scan, error } = await admin
    .from("exam_scans")
    .insert({
      student_id: user.id,
      coach_id: purchase?.coach_id ?? null,
      exam_name: examName,
      exam_date: examDate,
      status: "analyzing",
      photo_count: photoCount,
      questions: [],
    })
    .select("id")
    .single();

  if (error || !scan) return { error: "Kayıt oluşturulamadı: " + (error?.message ?? "") };
  return { id: scan.id as string };
}

/* 2) Fotoğraf grubunu analiz et (10'arlı gruplar — Vercel 4.5MB limiti) */
export async function analyzeScanBatch(scanId: string, formData: FormData) {
  const user = await getUser();
  const admin = createAdminClient();

  const { data: scan } = await admin
    .from("exam_scans")
    .select("id, exam_name, questions, status")
    .eq("id", scanId)
    .eq("student_id", user.id)
    .maybeSingle();
  if (!scan || !["analyzing", "error"].includes(scan.status)) return { error: "Geçersiz tarama kaydı." };

  const files = (formData.getAll("photos") as File[]).filter((f) => f && f.size > 0);
  if (files.length === 0) return { error: "Fotoğraf eksik." };

  const images: GeminiImage[] = [];
  for (const f of files) {
    const buf = Buffer.from(await f.arrayBuffer());
    images.push({ mimeType: f.type || "image/jpeg", base64: buf.toString("base64") });
  }

  const prompt = `Sen Türkiye YKS sınav sistemine hakim bir eğitim analiz uzmanısın.

Bu fotoğraflar bir öğrencinin çözdüğü ${EXAM_LABELS[scan.exam_name] ?? scan.exam_name} deneme sınavı kitapçığının sayfalarına ait. Öğrenci doğru yaptığı soruların yanına + (artı), yanlış yaptığı soruların yanına - (eksi) işareti koymuş. İşaretsiz soruları dahil etme.

Her işaretli soru için: ait olduğu dersi, konusunu ve işaretini (+/-) tespit et.

Yanıtı SADECE şu JSON formatında ver:
{"sorular": [{"ders": "Matematik", "konu": "Problemler", "sonuc": "dogru"}, ...]}

Kurallar:
- "sonuc" sadece "dogru" (+ işaretli) veya "yanlis" (- işaretli) olabilir.
- Ders adları: Türkçe, Matematik, Geometri, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Felsefe, Din Kültürü, Edebiyat, Yabancı Dil gibi standart adlar kullan.
- Bu sayfalarda işaretli soru yoksa {"sorular": []} döndür.`;

  try {
    const raw = await callGeminiWithImages(images, prompt);
    const parsed = JSON.parse(extractJson(raw)) as { sorular?: ScanQuestion[] };
    const newQuestions = Array.isArray(parsed.sorular) ? parsed.sorular : [];

    // Mevcut sorulara ekle
    const existing = (scan.questions ?? []) as ScanQuestion[];
    await admin
      .from("exam_scans")
      .update({ questions: [...existing, ...newQuestions] })
      .eq("id", scanId);

    return { ok: true, count: newQuestions.length };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    // Kaydı 'error' yapma — istemci aynı grubu yeniden deneyecek
    return { error: "Analiz hatası: " + msg, retriable: true };
  }
}

/* 3) Tüm gruplar bitince: analiz paragrafı + program önerisi üret */
export async function finalizeExamScan(scanId: string) {
  const user = await getUser();
  const admin = createAdminClient();

  const { data: scan } = await admin
    .from("exam_scans")
    .select("id, exam_name, questions, status")
    .eq("id", scanId)
    .eq("student_id", user.id)
    .maybeSingle();
  // 'error' durumundan da yeniden denenebilsin (geçici Gemini hatası sonrası)
  if (!scan || !["analyzing", "error"].includes(scan.status)) return { error: "Geçersiz tarama kaydı." };

  const questions = (scan.questions ?? []) as ScanQuestion[];
  if (questions.length === 0) {
    await admin
      .from("exam_scans")
      .update({ status: "error", error_message: "Fotoğraflarda işaretli soru tespit edilemedi. + / - işaretlerinin net göründüğünden emin olun." })
      .eq("id", scanId);
    revalidatePath("/ogrenci-paneli/ai-analiz");
    return { error: "İşaretli soru bulunamadı. + / - işaretlerinin net göründüğünden emin olun." };
  }

  // Ders/konu özetini metin olarak hazırla
  const summary: Record<string, Record<string, { d: number; y: number }>> = {};
  for (const q of questions) {
    const t = ((summary[q.ders] ??= {})[q.konu] ??= { d: 0, y: 0 });
    if (q.sonuc === "dogru") t.d++; else t.y++;
  }
  const summaryText = Object.entries(summary)
    .map(([ders, konular]) =>
      `${ders}:\n` + Object.entries(konular).map(([k, v]) => `  - ${k}: ${v.d} doğru, ${v.y} yanlış`).join("\n")
    )
    .join("\n");

  const prompt = `Sen Türkiye YKS sınav sistemine hakim bir eğitim koçusun.

Bir öğrencinin ${EXAM_LABELS[scan.exam_name] ?? scan.exam_name} deneme sınavı sonuçları ders ve konu bazında şöyle:

${summaryText}

Görevin:
1. Yanlış yapılan konulara odaklanan, öğrenciye hitap eden (sen dili) motive edici bir analiz paragrafı yaz (en fazla 150 kelime). Eksik ders ve konuları açıkça belirt.
2. Eksik konulara ağırlık veren, gerçekçi bir haftalık çalışma programı öner.

Yanıtı SADECE şu JSON formatında ver:
{"analiz": "paragraf", "haftalik_program": [{"gun": 1, "saat": "16:00", "ders": "Matematik", "konu": "Problemler"}, ...]}

Kurallar:
- "gun": 1=Pazartesi ... 6=Cumartesi, 0=Pazar. "saat": "08:00"-"20:00" arası tam saat.
- Programda en az 8, en fazla 20 blok olsun; yanlışı çok olan konulara daha fazla blok ayır.`;

  try {
    const raw = await callGeminiWithImages([], prompt);
    const parsed = JSON.parse(extractJson(raw)) as {
      analiz?: string;
      haftalik_program?: { gun: number; saat: string; ders: string; konu: string }[];
    };

    await admin
      .from("exam_scans")
      .update({
        status: "done",
        analysis_text: parsed.analiz ?? "",
        program_suggestion: parsed.haftalik_program ?? [],
        error_message: null,
      })
      .eq("id", scanId);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    await admin.from("exam_scans").update({ status: "error", error_message: msg }).eq("id", scanId);
    revalidatePath("/ogrenci-paneli/ai-analiz");
    return { error: "Analiz özeti üretilemedi: " + msg };
  }

  revalidatePath("/ogrenci-paneli/ai-analiz");
  return { ok: true };
}

export async function deleteExamScan(id: string) {
  const user = await getUser();
  const admin = createAdminClient();
  await admin.from("exam_scans").delete().eq("id", id).eq("student_id", user.id);
  revalidatePath("/ogrenci-paneli/ai-analiz");
}
