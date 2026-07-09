// Google Gemini API — REST üzerinden görsel + metin analizi
// Model: gemini-2.5-flash (ücretsiz katman: ~günde 1500 istek)

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-2.5-flash";

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

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API hatası (${res.status}): ${errText.slice(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Gemini boş yanıt döndürdü");
  return text;
}
