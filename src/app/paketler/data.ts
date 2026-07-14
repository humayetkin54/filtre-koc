// Paket modeli: süre bazlı 4 kademe (1/3/6 ay + Sınava Kadar) × sınav kategorisi.
// Fiyat çıpası: aylık 4.500 ₺; uzun paketlerde artan indirim.

export type Plan = {
  name: string;
  price: number;
  listPrice: number | null; // üstü çizili liste fiyatı
  discount: string | null;
  period: string; // satin-al'a giden dönem etiketi
  note: string; // fiyat altı küçük not
  popular: boolean;
  extras: { icon: string; text: string }[]; // kademeye özel avantajlar (vurgulu)
};

export const plans: Plan[] = [
  {
    name: "1 Aylık",
    price: 4500,
    listPrice: null,
    discount: null,
    period: "/ay",
    note: "Aylık yenilenir",
    popular: false,
    extras: [
      { icon: "🤖", text: "AI Asistan: günlük 10 soru ücretsiz" },
    ],
  },
  {
    name: "3 Aylık",
    price: 11999,
    listPrice: 13500,
    discount: "%11 indirim",
    period: "/3 ay",
    note: "Ayda ~4.000 ₺'ye denk gelir",
    popular: false,
    extras: [
      { icon: "🤖", text: "AI Asistan: günlük 20 soru ücretsiz" },
      { icon: "👁️", text: "Hızlı Okuma 1 ay ücretsiz" },
    ],
  },
  {
    name: "6 Aylık",
    price: 21999,
    listPrice: 27000,
    discount: "%19 indirim",
    period: "/6 ay",
    note: "Ayda ~3.667 ₺'ye denk gelir",
    popular: false,
    extras: [
      { icon: "🤖", text: "AI Asistan: günlük 30 soru ücretsiz" },
      { icon: "👁️", text: "Hızlı Okuma 2 ay ücretsiz" },
    ],
  },
  {
    name: "Sınava Kadar",
    price: 37500,
    listPrice: 49500,
    discount: "%24 indirim",
    period: "/sınava kadar",
    note: "12 aya varan taksit imkânı",
    popular: true,
    extras: [
      { icon: "🤖", text: "AI Asistan: günlük 50 soru ücretsiz" },
      { icon: "👁️", text: "Hızlı Okuma sınava kadar ücretsiz" },
      { icon: "🎓", text: "Tercih danışmanlığı" },
    ],
  },
];

export const categories = [
  {
    tag: "YKS",
    title: "YKS Koçluğu",
    core: [
      { icon: "🎥", text: "Haftada 1 online görüşme" },
      { icon: "whatsapp", text: "Günlük iletişim — sınırsız WhatsApp desteği" },
      { icon: "📨", text: "Koçunla mesajlaşabilme" },
      { icon: "📅", text: "Sana özel haftalık program" },
      { icon: "🎓", text: "Psikolojik Danışman veya Derece Koçu" },
      { icon: "📸", text: "Deneme AI Analiz (kitapçık fotoğrafından)" },
      { icon: "📊", text: "Net takibi & gelişim grafikleri" },
      { icon: "👨‍👩‍👧", text: "Veli Takip Sistemi" },
      { icon: "🔄", text: "Koç değişikliği hakkı" },
    ],
  },
  {
    tag: "LGS",
    title: "LGS Koçluğu",
    core: [
      { icon: "🧠", text: "Psikolojik Danışman ile süreç takibi" },
      { icon: "🎥", text: "Her hafta online görüşme" },
      { icon: "whatsapp", text: "Günlük iletişim — sınırsız WhatsApp desteği" },
      { icon: "📅", text: "Sana özel günlük/haftalık program" },
      { icon: "🗓️", text: "İki haftada bir veli görüşmesi" },
      { icon: "📸", text: "Deneme AI Analiz (kitapçık fotoğrafından)" },
      { icon: "📊", text: "Net takibi & gelişim grafikleri" },
      { icon: "👨‍👩‍👧", text: "Veli Takip Sistemi" },
      { icon: "🔄", text: "Koç değişikliği hakkı" },
    ],
  },
  {
    tag: "MEB AGS",
    title: "MEB AGS Koçluğu",
    core: [
      { icon: "🧠", text: "Psikolojik Danışman tarafından süreç takibi" },
      { icon: "🎥", text: "Haftada 1 online görüşme" },
      { icon: "whatsapp", text: "Günlük iletişim — sınırsız WhatsApp desteği" },
      { icon: "📨", text: "Koçunla mesajlaşabilme" },
      { icon: "📅", text: "Sana özel haftalık program" },
      { icon: "📚", text: "Seviyeye uygun kaynak önerileri" },
      { icon: "📊", text: "Net takibi & gelişim grafikleri" },
      { icon: "🔄", text: "Koç değişikliği hakkı" },
    ],
  },
];

export const guarantees = [
  "7 gün koşulsuz iade garantisi",
  "Koç değiştirme hakkı",
  "Doğrulanmış koçlar",
];

// Paket karşılaştırma tablosu — values sırası plans[] ile aynı (1/3/6 ay, Sınava Kadar)
export const comparison: { feature: string; values: (string | boolean)[] }[] = [
  { feature: "Sınırsız WhatsApp Desteği", values: [true, true, true, true] },
  { feature: "Canlı Görüşme", values: ["Haftada 1", "Haftada 1", "Haftada 1", "Haftada 1"] },
  { feature: "Kişiye Özel Çalışma Programı", values: [true, true, true, true] },
  { feature: "Deneme AI Analiz (kitapçık fotoğrafı)", values: [true, true, true, true] },
  { feature: "Net Takibi & Gelişim Grafikleri", values: [true, true, true, true] },
  { feature: "Veli Takip Sistemi", values: [true, true, true, true] },
  { feature: "RekorZeka AI Asistan", values: ["Günlük 10 soru", "Günlük 20 soru", "Günlük 30 soru", "Günlük 50 soru"] },
  { feature: "Hızlı Okuma Eğitimi", values: [false, "1 ay", "2 ay", "Sınava kadar"] },
  { feature: "Tercih Danışmanlığı", values: [false, false, false, true] },
  { feature: "Koç Değişikliği Hakkı", values: [true, true, true, true] },
];

export const comparisonPriceRow: string[] = ["4.500 ₺", "~4.000 ₺", "~3.667 ₺", "En Kârlı"];
