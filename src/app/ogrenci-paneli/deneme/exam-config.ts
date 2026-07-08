// 2025 YKS katsayıları (ÖSYM sınav sonrası açıklanan değerler)
export interface ExamField {
  key: string;
  label: string;
  max: number; // soru sayısı
  coef: number; // 2025 katsayısı
  group?: "TYT" | "AYT" | "YDT"; // AYT/DİL sınavlarında bölüm ayrımı
}

export interface ExamConfig {
  label: string;
  base: number; // başlangıç (taban) puanı
  fields: ExamField[];
}

export const EXAM_CONFIGS: Record<string, ExamConfig> = {
  TYT: {
    label: "TYT",
    base: 145.47,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 2.83 },
      { key: "sosyal", label: "Sosyal Bilimler", max: 20, coef: 2.99 },
      { key: "tmat", label: "Temel Matematik", max: 40, coef: 3.28 },
      { key: "fen", label: "Fen Bilimleri", max: 20, coef: 2.53 },
    ],
  },
  SAY: {
    label: "AYT Sayısal (SAY)",
    base: 132.87,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.2, group: "TYT" },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.27, group: "TYT" },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.39, group: "TYT" },
      { key: "fen", label: "Fen", max: 20, coef: 1.07, group: "TYT" },
      { key: "mat", label: "Matematik", max: 40, coef: 2.89, group: "AYT" },
      { key: "fizik", label: "Fizik", max: 14, coef: 2.46, group: "AYT" },
      { key: "kimya", label: "Kimya", max: 13, coef: 2.53, group: "AYT" },
      { key: "biyoloji", label: "Biyoloji", max: 13, coef: 2.61, group: "AYT" },
    ],
  },
  EA: {
    label: "AYT Eşit Ağırlık (EA)",
    base: 129.34,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.19, group: "TYT" },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.26, group: "TYT" },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.38, group: "TYT" },
      { key: "fen", label: "Fen", max: 20, coef: 1.07, group: "TYT" },
      { key: "mat", label: "Matematik", max: 40, coef: 2.88, group: "AYT" },
      { key: "edebiyat", label: "Edebiyat", max: 24, coef: 2.94, group: "AYT" },
      { key: "tarih1", label: "Tarih-1", max: 10, coef: 2.53, group: "AYT" },
      { key: "cog1", label: "Coğrafya-1", max: 6, coef: 2.85, group: "AYT" },
    ],
  },
  SOZ: {
    label: "AYT Sözel (SÖZ)",
    base: 129.61,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.13, group: "TYT" },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.19, group: "TYT" },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.31, group: "TYT" },
      { key: "fen", label: "Fen", max: 20, coef: 1.01, group: "TYT" },
      { key: "edebiyat", label: "Edebiyat", max: 24, coef: 2.79, group: "AYT" },
      { key: "tarih1", label: "Tarih-1", max: 10, coef: 2.39, group: "AYT" },
      { key: "cog1", label: "Coğrafya-1", max: 6, coef: 2.7, group: "AYT" },
      { key: "tarih2", label: "Tarih-2", max: 11, coef: 3.8, group: "AYT" },
      { key: "cog2", label: "Coğrafya-2", max: 11, coef: 2.47, group: "AYT" },
      { key: "felsefe", label: "Felsefe Grubu", max: 12, coef: 3.76, group: "AYT" },
      { key: "dkab", label: "DKAB", max: 6, coef: 2.36, group: "AYT" },
    ],
  },
  DIL: {
    label: "YDT Dil (DİL)",
    base: 105.92,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.53, group: "TYT" },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.62, group: "TYT" },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.77, group: "TYT" },
      { key: "fen", label: "Fen", max: 20, coef: 1.37, group: "TYT" },
      { key: "dil", label: "Yabancı Dil", max: 80, coef: 2.6, group: "YDT" },
    ],
  },
};

export function calculateScore(examType: string, nets: Record<string, number>): number | null {
  const config = EXAM_CONFIGS[examType];
  if (!config) return null;
  const sum = config.fields.reduce((acc, f) => acc + (nets[f.key] ?? 0) * f.coef, 0);
  return Math.round((config.base + sum) * 100) / 100;
}
