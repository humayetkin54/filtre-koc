// Google Gemini API — REST üzerinden görsel + metin analizi
// Birincil model yoğun/emekliyse sıradaki modele otomatik geçer

const MODEL_CHAIN = [
  process.env.GEMINI_MODEL ?? "gemini-flash-latest",
  "gemini-3.1-flash-lite",
  "gemini-2.0-flash",
];

export interface GeminiImage {
  mimeType: string;
  base64: string;
}

export async function callGeminiWithImages(
  images: GeminiImage[],
  prompt: string
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY tanımlı değil");

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

  let lastError = "";
  for (const model of MODEL_CHAIN) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
    let res: Response;
    try {
      res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        // Tek modelde 75 sn'den fazla bekleme — sıradakine geç
        signal: AbortSignal.timeout(75_000),
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
