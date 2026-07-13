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
      "Haftada 1 online görüşme",
      "Günlük iletişim — sınırsız WhatsApp desteği",
      "Koçunla mesajlaşabilme",
      "Sana özel haftalık program",
      "Psikolojik Danışman veya Derece Koçu",
      "Deneme AI Analiz (kitapçık fotoğrafından)",
      "Net takibi & gelişim grafikleri",
      "Veli Takip Sistemi",
      "Koç değişikliği hakkı",
    ],
  },
  {
    tag: "LGS",
    title: "LGS Koçluğu",
    core: [
      "Psikolojik Danışman ile süreç takibi",
      "Her hafta online görüşme",
      "Günlük iletişim — sınırsız WhatsApp desteği",
      "Sana özel günlük/haftalık program",
      "İki haftada bir veli görüşmesi",
      "Deneme AI Analiz (kitapçık fotoğrafından)",
      "Net takibi & gelişim grafikleri",
      "Veli Takip Sistemi",
      "Koç değişikliği hakkı",
    ],
  },
  {
    tag: "MEB AGS",
    title: "MEB AGS Koçluğu",
    core: [
      "Psikolojik Danışman tarafından süreç takibi",
      "Haftada 1 online görüşme",
      "Günlük iletişim — sınırsız WhatsApp desteği",
      "Koçunla mesajlaşabilme",
      "Sana özel haftalık program",
      "Seviyeye uygun kaynak önerileri",
      "Net takibi & gelişim grafikleri",
      "Koç değişikliği hakkı",
    ],
  },
];

export const guarantees = [
  "14 gün iade garantisi",
  "Koç değiştirme hakkı",
  "Doğrulanmış koçlar",
  "Aylık performans puanı",
];
