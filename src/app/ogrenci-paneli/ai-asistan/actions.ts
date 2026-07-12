"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { callGeminiChat, type ChatTurn } from "@/lib/gemini";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export const DAILY_LIMIT = 5;

const SYSTEM_PROMPT = `Sen "Rekor Zeka AI Asistan"sın — Türkiye'deki YKS, LGS ve KPSS öğrencilerine yardımcı olan samimi, motive edici bir sınav koçu asistanısın.

Görevlerin:
1. SORU ÇÖZÜMÜ: Öğrenci bir sorunun fotoğrafını veya metnini gönderirse, cevabı doğrudan vermek yerine ADIM ADIM mantığını açıkla. Önce soruyu anla, sonra çözüm yolunu adımlara böl, doğru cevabı gerekçesiyle belirt. Öğrenci öğrensin diye öğretici ol.
2. ÇALIŞMA PLANI: Öğrencinin eksiklerine göre pratik, gerçekçi çalışma önerileri ver.
3. MOTİVASYON: Sınav kaygısı, motivasyon düşüklüğü gibi durumlarda empatik, destekleyici bir koç gibi dinle ve yönlendir.

Kurallar:
- Türkçe, sıcak ve anlaşılır bir dille yaz.
- Cevapları başlık ve maddelerle düzenli sun.
- Konu dışı (sınav/eğitim/motivasyon dışı) isteklerde nazikçe odağı derslere çek.
- Kısa ve öz ol, gereksiz uzatma.`;

async function getStudent() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/giris");
  return user;
}

// Bugün kaç mesaj gönderilmiş (limit kontrolü)
export async function getDailyUsage(studentId: string): Promise<number> {
  const admin = createAdminClient();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const { count } = await admin
    .from("ai_messages")
    .select("id", { count: "exact", head: true })
    .eq("student_id", studentId)
    .eq("role", "user")
    .gte("created_at", startOfDay.toISOString());

  return count ?? 0;
}

export async function createChat(): Promise<{ id: string }> {
  const user = await getStudent();
  const admin = createAdminClient();
  const { data } = await admin
    .from("ai_chats")
    .insert({ student_id: user.id, title: "Yeni Sohbet" })
    .select("id")
    .single();
  revalidatePath("/ogrenci-paneli/ai-asistan");
  return { id: data!.id };
}

export async function deleteChat(chatId: string) {
  const user = await getStudent();
  const admin = createAdminClient();
  await admin.from("ai_messages").delete().eq("chat_id", chatId).eq("student_id", user.id);
  await admin.from("ai_chats").delete().eq("id", chatId).eq("student_id", user.id);
  revalidatePath("/ogrenci-paneli/ai-asistan");
}

export async function sendChatMessage(formData: FormData): Promise<
  { error: string } | { ok: true; chatId: string; reply: string; remaining: number }
> {
  const user = await getStudent();
  const admin = createAdminClient();

  // Günlük limit
  const used = await getDailyUsage(user.id);
  if (used >= DAILY_LIMIT) {
    return { error: `Günlük ${DAILY_LIMIT} mesaj hakkını doldurdun. Yarın tekrar deneyebilirsin.` };
  }

  const text = ((formData.get("message") as string) || "").trim();
  const imageFile = formData.get("image") as File | null;
  const hasImage = imageFile && imageFile.size > 0;
  if (!text && !hasImage) return { error: "Bir mesaj yaz veya fotoğraf ekle." };

  let chatId = (formData.get("chat_id") as string) || "";

  // Sohbet yoksa oluştur
  if (!chatId) {
    const { data } = await admin
      .from("ai_chats")
      .insert({ student_id: user.id, title: (text || "Görsel soru").slice(0, 40) })
      .select("id")
      .single();
    chatId = data!.id;
  }

  // Görsel hazırla
  let image: { mimeType: string; base64: string } | undefined;
  if (hasImage) {
    if (imageFile!.size > 5 * 1024 * 1024) return { error: "Fotoğraf 5MB'dan küçük olmalı." };
    const buf = Buffer.from(await imageFile!.arrayBuffer());
    image = { mimeType: imageFile!.type || "image/jpeg", base64: buf.toString("base64") };
  }

  // Önceki mesajları çek (bağlam), son 20
  const { data: prev } = await admin
    .from("ai_messages")
    .select("role, content")
    .eq("chat_id", chatId)
    .order("created_at", { ascending: true })
    .limit(20);

  const history: ChatTurn[] = (prev ?? []).map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    text: m.content,
  }));
  history.push({
    role: "user",
    text: text || "Bu sorunun çözümünü adım adım açıklar mısın?",
    image,
  });

  // Kullanıcı mesajını kaydet
  await admin.from("ai_messages").insert({
    chat_id: chatId,
    student_id: user.id,
    role: "user",
    content: text || (hasImage ? "📷 Görsel soru gönderildi" : ""),
    has_image: !!hasImage,
  });

  // Gemini yanıtı
  let reply: string;
  try {
    reply = await callGeminiChat(history, SYSTEM_PROMPT);
  } catch (e) {
    reply = "Üzgünüm, şu an yanıt veremiyorum. Birazdan tekrar dener misin?";
    console.error("[ai-asistan] Gemini hatası:", e instanceof Error ? e.message : e);
  }

  await admin.from("ai_messages").insert({
    chat_id: chatId,
    student_id: user.id,
    role: "assistant",
    content: reply,
  });

  // İlk mesajsa sohbet başlığını güncelle
  if (history.length <= 1 && text) {
    await admin.from("ai_chats").update({ title: text.slice(0, 40) }).eq("id", chatId);
  }

  revalidatePath("/ogrenci-paneli/ai-asistan");
  return { ok: true, chatId, reply, remaining: Math.max(0, DAILY_LIMIT - used - 1) };
}
