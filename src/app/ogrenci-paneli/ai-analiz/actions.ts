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

interface ScanResult {
  sorular: ScanQuestion[];
  analiz: string;
  haftalik_program: { gun: number; saat: string; ders: string; konu: string }[];
}

export async function analyzeExamScan(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");

  const admin = createAdminClient();

  const examName = formData.get("exam_name") as string;
  const examDate = formData.get("exam_date") as string;
  const files = formData.getAll("photos") as File[];

  if (!examName || !examDate) return { error: "Sınav türü ve tarih zorunlu." };
  const validFiles = files.filter((f) => f && f.size > 0);
  if (validFiles.length === 0) return { error: "En az 1 fotoğraf yükleyin." };
  if (validFiles.length > 41) return { error: "En fazla 41 fotoğraf yüklenebilir." };

  // Fotoğrafları base64'e çevir
  const images: GeminiImage[] = [];
  for (const f of validFiles) {
    if (f.size > 8 * 1024 * 1024) return { error: `${f.name} 8MB'dan büyük. Daha küçük fotoğraf yükleyin.` };
    const buf = Buffer.from(await f.arrayBuffer());
    images.push({ mimeType: f.type || "image/jpeg", base64: buf.toString("base64") });
  }

  // Koç bilgisi
  const { data: purchase } = await admin
    .from("purchases")
    .select("coach_id")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle();

  // Kayıt oluştur (analyzing durumunda)
  const { data: scan, error: insertErr } = await admin
    .from("exam_scans")
    .insert({
      student_id: user.id,
      coach_id: purchase?.coach_id ?? null,
      exam_name: examName,
      exam_date: examDate,
      status: "analyzing",
      photo_count: validFiles.length,
    })
    .select("id")
    .single();

  if (insertErr || !scan) return { error: "Kayıt oluşturulamadı: " + (insertErr?.message ?? "") };

  const prompt = `Sen Türkiye YKS sınav sistemine hakim bir eğitim analiz uzmanısın.

Bu fotoğraflar bir öğrencinin çözdüğü ${EXAM_LABELS[examName] ?? examName} deneme sınavı kitapçığına ait. Öğrenci doğru yaptığı soruların yanına + (artı), yanlış yaptığı soruların yanına - (eksi) işareti koymuş. İşaretsiz sorular boş bırakılmıştır, onları dahil etme.

Görevin:
1. Her işaretli soruyu incele: hangi derse ait, hangi konudan ve + mı - mi işaretlenmiş tespit et.
2. Yanlış yapılan konulara odaklanan, öğrenciye hitap eden (sen dili) motive edici bir analiz paragrafı yaz (en fazla 150 kelime). Eksik ders ve konuları açıkça belirt.
3. Eksik konulara ağırlık veren, gerçekçi bir haftalık çalışma programı öner.

Yanıtı SADECE şu JSON formatında ver:
{
  "sorular": [{"ders": "Matematik", "konu": "Problemler", "sonuc": "dogru"}, ...],
  "analiz": "paragraf metni",
  "haftalik_program": [{"gun": 1, "saat": "16:00", "ders": "Matematik", "konu": "Problemler"}, ...]
}

Kurallar:
- "sonuc" alanı sadece "dogru" veya "yanlis" olabilir.
- "gun" alanı: 1=Pazartesi, 2=Salı, 3=Çarşamba, 4=Perşembe, 5=Cuma, 6=Cumartesi, 0=Pazar.
- "saat" alanı "08:00" ile "20:00" arası tam saat olmalı (örn "16:00").
- Haftalık programda en az 8, en fazla 20 ders bloğu olsun; yanlış yapılan konulara daha fazla blok ayır.
- Ders adları: Türkçe, Matematik, Geometri, Fizik, Kimya, Biyoloji, Tarih, Coğrafya, Felsefe, Din Kültürü, Edebiyat, Yabancı Dil gibi standart adlar kullan.`;

  try {
    const raw = await callGeminiWithImages(images, prompt);

    // JSON'u ayıkla (code fence olasılığına karşı)
    let jsonStr = raw.trim();
    const first = jsonStr.indexOf("{");
    const last = jsonStr.lastIndexOf("}");
    if (first >= 0 && last > first) jsonStr = jsonStr.slice(first, last + 1);
    const result: ScanResult = JSON.parse(jsonStr);

    if (!Array.isArray(result.sorular) || result.sorular.length === 0) {
      throw new Error("Fotoğraflarda işaretli soru tespit edilemedi. + / - işaretlerinin net göründüğünden emin olun.");
    }

    await admin
      .from("exam_scans")
      .update({
        status: "done",
        questions: result.sorular,
        analysis_text: result.analiz,
        program_suggestion: result.haftalik_program ?? [],
      })
      .eq("id", scan.id);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Bilinmeyen hata";
    await admin
      .from("exam_scans")
      .update({ status: "error", error_message: msg })
      .eq("id", scan.id);
    revalidatePath("/ogrenci-paneli/ai-analiz");
    return { error: "Analiz başarısız: " + msg };
  }

  revalidatePath("/ogrenci-paneli/ai-analiz");
  redirect(`/ogrenci-paneli/ai-analiz?scan=${scan.id}`);
}

export async function deleteExamScan(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const admin = createAdminClient();
  await admin.from("exam_scans").delete().eq("id", id).eq("student_id", user.id);
  revalidatePath("/ogrenci-paneli/ai-analiz");
}
