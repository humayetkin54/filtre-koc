"use client";

import { useState } from "react";
import { signUp } from "@/app/auth/actions";

const EXAM_OPTIONS: Record<string, { value: string; label: string }[]> = {
  lgs: [{ value: "LGS", label: "LGS" }],
  yks: [{ value: "YKS (TYT/AYT)", label: "YKS (TYT/AYT)" }],
  yks_kpss: [
    { value: "YKS (TYT/AYT)", label: "YKS (TYT/AYT)" },
    { value: "KPSS/AGS", label: "KPSS/AGS" },
  ],
};

function getExamGroup(grade: string) {
  if (["5. Sınıf", "6. Sınıf", "7. Sınıf", "8. Sınıf (LGS)"].includes(grade)) return "lgs";
  if (["9. Sınıf", "10. Sınıf", "11. Sınıf"].includes(grade)) return "yks";
  if (["12. Sınıf (YKS)", "Mezun"].includes(grade)) return "yks_kpss";
  return null;
}

const selectClass =
  "w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[#123A57] focus:ring-2 focus:ring-[#123A57]/20";

export default function KayitForm() {
  const [grade, setGrade] = useState("");

  const examGroup = getExamGroup(grade);
  const examOptions = examGroup ? EXAM_OPTIONS[examGroup] : [];

  return (
    <form action={signUp} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Ad Soyad</label>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Ada Yılmaz"
          className={selectClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">E-posta</label>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="ada@ornek.com"
          className={selectClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Şifre</label>
        <input
          type="password"
          name="password"
          required
          minLength={6}
          autoComplete="new-password"
          placeholder="En az 6 karakter"
          className={selectClass}
        />
      </div>
      <div>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">Sınıf</label>
        <select
          name="grade"
          required
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          className={selectClass}
        >
          <option value="">Sınıfını seç</option>
          <option value="5. Sınıf">5. Sınıf</option>
          <option value="6. Sınıf">6. Sınıf</option>
          <option value="7. Sınıf">7. Sınıf</option>
          <option value="8. Sınıf (LGS)">8. Sınıf (LGS)</option>
          <option value="9. Sınıf">9. Sınıf</option>
          <option value="10. Sınıf">10. Sınıf</option>
          <option value="11. Sınıf">11. Sınıf</option>
          <option value="12. Sınıf (YKS)">12. Sınıf (YKS)</option>
          <option value="Mezun">Mezun</option>
          <option value="Veli">Veli (öğrenci velisiyim)</option>
        </select>
      </div>
      {grade === "Veli" && (
        <p className="rounded-xl border border-[#d5f2f5] bg-[#eef9f9] px-4 py-3 text-xs text-[#0E8FA3]">
          Veli hesabıyla, öğrencinizin sizi profilinden eklemesi durumunda gelişimini
          Veli Paneli&apos;nden takip edebilirsiniz.
        </p>
      )}
      <div style={{ display: examGroup ? "block" : "none" }}>
        <label className="mb-1.5 block text-sm font-medium text-gray-700">
          Destek almak istediğim sınav
        </label>
        <select name="exam_type" required={!!examGroup} className={selectClass}>
          <option value="">Sınav türünü seç</option>
          {examOptions.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
      <button type="submit" className="btn-primary w-full py-3">
        Kayıt ol
      </button>
    </form>
  );
}
