// AI Asistan sabitleri (server action dosyasından ayrı — "use server" yalnızca fonksiyon export edebilir)
export const DAILY_LIMIT = 20; // varsayılan (plan bilinmezse)

// Paket kademesine göre günlük AI soru hakkı
export const PLAN_AI_LIMITS: Record<string, number> = {
  "1 Aylık": 10,
  "3 Aylık": 20,
  "6 Aylık": 30,
  "Sınava Kadar": 50,
  // Eski plan adları (mevcut satın alımlar)
  "Aylık": 20,
  "Yıllık": 50,
};

export function planAiLimit(plan?: string | null): number {
  return (plan && PLAN_AI_LIMITS[plan]) || DAILY_LIMIT;
}
