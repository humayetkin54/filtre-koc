// Hızlı Okuma rozet (oyunlaştırma) tanımları.
// Rozetler localStorage'daki test geçmişi + egzersiz sayaçlarından anlık hesaplanır.

export type ExerciseKind = "takistoskop" | "golgeleme" | "blok" | "schulte";
export type ExerciseStats = Record<ExerciseKind, number>;

export type BadgeInput = {
  history: { wpm: number; comprehension: number; effectiveWpm: number }[];
  stats: ExerciseStats;
  schulteBest: number | null;
};

export type Badge = {
  id: string;
  icon: string;
  title: string;
  desc: string;
  earned: (x: BadgeInput) => boolean;
};

const totalExercises = (s: ExerciseStats) =>
  s.takistoskop + s.golgeleme + s.blok + s.schulte;

export const BADGES: Badge[] = [
  // --- Hız testi rozetleri ---
  { id: "ilk-adim", icon: "🚀", title: "İlk Adım", desc: "İlk hız testini tamamla", earned: (x) => x.history.length >= 1 },
  { id: "azimli", icon: "📚", title: "Azimli Okur", desc: "5 hız testi tamamla", earned: (x) => x.history.length >= 5 },
  { id: "antrenman", icon: "🏋️", title: "Antrenman Canavarı", desc: "15 hız testi tamamla", earned: (x) => x.history.length >= 15 },
  { id: "keskin", icon: "🎯", title: "Keskin Zihin", desc: "Bir testte %100 anlama yakala", earned: (x) => x.history.some((h) => h.comprehension === 100) },
  { id: "anlayan", icon: "🧠", title: "Anlayan Okur", desc: "5 testte %75+ anlama yakala", earned: (x) => x.history.filter((h) => h.comprehension >= 75).length >= 5 },
  { id: "hiz-ciragi", icon: "⚡", title: "Hız Çırağı", desc: "200+ WPM hıza ulaş", earned: (x) => x.history.some((h) => h.wpm >= 200) },
  { id: "hiz-ustasi", icon: "🔥", title: "Hız Ustası", desc: "300+ WPM hıza ulaş", earned: (x) => x.history.some((h) => h.wpm >= 300) },
  { id: "isik-hizi", icon: "🚄", title: "Işık Hızı", desc: "400+ WPM hıza ulaş", earned: (x) => x.history.some((h) => h.wpm >= 400) },
  { id: "etkili", icon: "💎", title: "Etkili Okur", desc: "250+ etkili hıza ulaş (hız × anlama)", earned: (x) => x.history.some((h) => h.effectiveWpm >= 250) },
  {
    id: "yukselis", icon: "📈", title: "Yükselişte", desc: "Etkili hızını ilk testine göre %20 artır",
    earned: (x) => {
      if (x.history.length < 2) return false;
      const first = x.history[0].effectiveWpm;
      if (first <= 0) return false;
      return Math.max(...x.history.map((h) => h.effectiveWpm)) >= first * 1.2;
    },
  },
  // --- Egzersiz rozetleri ---
  { id: "goz-cimnastigi", icon: "👁️", title: "Göz Cimnastiği", desc: "İlk takistoskop turunu bitir", earned: (x) => x.stats.takistoskop >= 1 },
  { id: "ritim", icon: "🎼", title: "Ritim Tutturan", desc: "İlk gölgeleme turunu bitir", earned: (x) => x.stats.golgeleme >= 1 },
  { id: "blok-ustasi", icon: "🔲", title: "Blok Ustası", desc: "İlk blok okuma turunu bitir", earned: (x) => x.stats.blok >= 1 },
  { id: "tablo-avcisi", icon: "🔢", title: "Tablo Avcısı", desc: "İlk Schulte tablosunu bitir", earned: (x) => x.stats.schulte >= 1 },
  { id: "hizli-bakis", icon: "⏱️", title: "Hızlı Bakış", desc: "Schulte tablosunu 40 saniyenin altında bitir", earned: (x) => x.schulteBest != null && x.schulteBest < 40 },
  { id: "kartal-gozu", icon: "🦅", title: "Kartal Gözü", desc: "Schulte tablosunu 25 saniyenin altında bitir", earned: (x) => x.schulteBest != null && x.schulteBest < 25 },
  { id: "tam-takim", icon: "🏆", title: "Tam Takım", desc: "Her egzersiz türünü en az 1 kez tamamla", earned: (x) => x.stats.takistoskop >= 1 && x.stats.golgeleme >= 1 && x.stats.blok >= 1 && x.stats.schulte >= 1 },
  { id: "sadik-sporcu", icon: "🌟", title: "Sadık Sporcu", desc: "Toplam 20 egzersiz turu tamamla", earned: (x) => totalExercises(x.stats) >= 20 },
];
