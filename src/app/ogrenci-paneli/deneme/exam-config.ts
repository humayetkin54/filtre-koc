// 2025 YKS katsayıları (ÖSYM sınav sonrası açıklanan değerler)
export interface ExamField {
  key: string;
  label: string;
  max: number; // soru sayısı
  coef: number; // 2025 katsayısı
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
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.2 },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.27 },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.39 },
      { key: "fen", label: "Fen", max: 20, coef: 1.07 },
      { key: "mat", label: "Matematik (AYT)", max: 40, coef: 2.89 },
      { key: "fizik", label: "Fizik", max: 14, coef: 2.46 },
      { key: "kimya", label: "Kimya", max: 13, coef: 2.53 },
      { key: "biyoloji", label: "Biyoloji", max: 13, coef: 2.61 },
    ],
  },
  EA: {
    label: "AYT Eşit Ağırlık (EA)",
    base: 129.34,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.19 },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.26 },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.38 },
      { key: "fen", label: "Fen", max: 20, coef: 1.07 },
      { key: "mat", label: "Matematik (AYT)", max: 40, coef: 2.88 },
      { key: "edebiyat", label: "Edebiyat", max: 24, coef: 2.94 },
      { key: "tarih1", label: "Tarih-1", max: 10, coef: 2.53 },
      { key: "cog1", label: "Coğrafya-1", max: 6, coef: 2.85 },
    ],
  },
  SOZ: {
    label: "AYT Sözel (SÖZ)",
    base: 129.61,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.13 },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.19 },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.31 },
      { key: "fen", label: "Fen", max: 20, coef: 1.01 },
      { key: "edebiyat", label: "Edebiyat", max: 24, coef: 2.79 },
      { key: "tarih1", label: "Tarih-1", max: 10, coef: 2.39 },
      { key: "cog1", label: "Coğrafya-1", max: 6, coef: 2.7 },
      { key: "tarih2", label: "Tarih-2", max: 11, coef: 3.8 },
      { key: "cog2", label: "Coğrafya-2", max: 11, coef: 2.47 },
      { key: "felsefe", label: "Felsefe Grubu", max: 12, coef: 3.76 },
      { key: "dkab", label: "DKAB", max: 6, coef: 2.36 },
    ],
  },
  DIL: {
    label: "YDT Dil (DİL)",
    base: 105.92,
    fields: [
      { key: "turkce", label: "Türkçe", max: 40, coef: 1.53 },
      { key: "sosyal", label: "Sosyal", max: 20, coef: 1.62 },
      { key: "tmat", label: "T. Matematik", max: 40, coef: 1.77 },
      { key: "fen", label: "Fen", max: 20, coef: 1.37 },
      { key: "dil", label: "Yabancı Dil", max: 80, coef: 2.6 },
    ],
  },
};

export function calculateScore(examType: string, nets: Record<string, number>): number | null {
  const config = EXAM_CONFIGS[examType];
  if (!config) return null;
  const sum = config.fields.reduce((acc, f) => acc + (nets[f.key] ?? 0) * f.coef, 0);
  return Math.round((config.base + sum) * 100) / 100;
}
