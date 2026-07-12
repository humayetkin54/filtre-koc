// Google Gemini API — REST üzerinden görsel + metin analizi
// Birincil model yoğun/emekliyse sıradaki modele otomatik geçer

// Test edilmiş, hızlı model ilk sırada; yoğunluk durumunda sıradakine geçilir
const MODEL_CHAIN = [
  process.env.GEMINI_MODEL ?? "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
  "gemini-flash-latest",
];

export interface GeminiImage {
  mimeType: string;
  base64: string;
}

// Çok turlu sohbet mesajı (DB rolü 'assistant' → Gemini 'model')
export interface ChatTurn {
  role: "user" | "model";
  text: string;
  image?: GeminiImage;
}

export async function callGeminiWithImages(
  images: GeminiImage[],
  prompt: string
): Promise<string> {
  const body = JSON.stringify({
    contents: [
      {
        parts: [
          ...images.map((img) => ({
            inline_data: { mime_type: img.mimeType, data: img.base64 },
          })),
          { text: prompt },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
    },
  });
  return geminiGenerate(body);
}

// Sohbet asistanı — geçmiş + isteğe bağlı görsel, düz metin yanıt
export async function callGeminiChat(
  history: ChatTurn[],
  systemInstruction: string
): Promise<string> {
  const body = JSON.stringify({
    systemInstruction: { parts: [{ text: systemInstruction }] },
    contents: history.map((m) => ({
      role: m.role,
      parts: [
        ...(m.image
          ? [{ inline_data: { mime_type: m.image.mimeType, data: m.image.base64 } }]
          : []),
        { text: m.text },
      ],
    })),
    generationConfig: { maxOutputTokens: 4096 },
  });
  return geminiGenerate(body);
}

async function geminiGenerate(body: string): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY tanımlı değil");

  let lastError = "";
  // Vercel fonksiyon süre limitine (60 sn olabilir) takılmamak için toplam bütçe: 45 sn
  const deadline = Date.now() + 45_000;
  for (const model of MODEL_CHAIN) {
    const remaining = deadline - Date.now();
    if (remaining < 8_000) break; // kalan süre yetmez — istemci yeniden denesin

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(Math.min(30_000, remaining)),
      });
    } catch (e) {
      lastError = `${model}: zaman aşımı / bağlantı hatası (${e instanceof Error ? e.message : ""})`;
      continue; // sıradaki modeli dene
    }

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts
        ?.map((p: { text?: string }) => p.text ?? "")
        .join("");
      if (!text) throw new Error("Gemini boş yanıt döndürdü");
      return text;
    }

    const errText = await res.text();
    lastError = `${model} (${res.status}): ${errText.slice(0, 200)}`;

    // 404 (model kalktı), 429 (kota), 500, 503 (yoğunluk) → sıradaki modeli dene
    if (![404, 429, 500, 503].includes(res.status)) break;
  }

  throw new Error(`Gemini API hatası — ${lastError}`);
}
