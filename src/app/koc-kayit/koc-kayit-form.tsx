"use client";

import { coachSignUp } from "@/app/koc-auth/actions";

const UNIVERSITELER = [
  "Boğaziçi Üniversitesi","İstanbul Teknik Üniversitesi (İTÜ)","Orta Doğu Teknik Üniversitesi (ODTÜ)",
  "Hacettepe Üniversitesi","Ankara Üniversitesi","Gazi Üniversitesi","İstanbul Üniversitesi",
  "İstanbul Üniversitesi-Cerrahpaşa","Ege Üniversitesi","Dokuz Eylül Üniversitesi",
  "Marmara Üniversitesi","Yıldız Teknik Üniversitesi","Bilkent Üniversitesi","Koç Üniversitesi",
  "Sabancı Üniversitesi","Bahçeşehir Üniversitesi","Atılım Üniversitesi","TED Üniversitesi",
  "İzmir Yüksek Teknoloji Enstitüsü (İYTE)","Gebze Teknik Üniversitesi","Erciyes Üniversitesi",
  "Selçuk Üniversitesi","Akdeniz Üniversitesi","Çukurova Üniversitesi","Uludağ Üniversitesi",
  "Karadeniz Teknik Üniversitesi","Ondokuz Mayıs Üniversitesi","Fırat Üniversitesi",
  "İnönü Üniversitesi","Dicle Üniversitesi","Gaziantep Üniversitesi","Pamukkale Üniversitesi",
  "Kocaeli Üniversitesi","Sakarya Üniversitesi","Anadolu Üniversitesi",
  "TOBB Ekonomi ve Teknoloji Üniversitesi","Başkent Üniversitesi","Çankaya Üniversitesi",
  "İstanbul Medipol Üniversitesi","Acıbadem Üniversitesi","Özyeğin Üniversitesi",
];

const BOLUMLER = [
  "Tıp","Diş Hekimliği","Eczacılık","Hemşirelik","Veterinerlik",
  "Hukuk","Siyaset Bilimi ve Kamu Yönetimi","Uluslararası İlişkiler",
  "İşletme","İktisat","Maliye",
  "Psikoloji","Psikolojik Danışmanlık ve Rehberlik (PDR)","Sosyal Hizmet",
  "Bilgisayar Mühendisliği","Yazılım Mühendisliği","Elektrik-Elektronik Mühendisliği",
  "Makine Mühendisliği","İnşaat Mühendisliği","Endüstri Mühendisliği","Kimya Mühendisliği",
  "Biyomedikal Mühendisliği","Havacılık ve Uzay Mühendisliği","Mekatronik Mühendisliği",
  "Mimarlık","İç Mimarlık","Şehir ve Bölge Planlama",
  "Matematik","Fizik","Kimya","Biyoloji","İstatistik",
  "Türk Dili ve Edebiyatı","Tarih","Felsefe","Sosyoloji",
  "İngiliz Dili ve Edebiyatı","Mütercim-Tercümanlık",
  "Öğretmenlik (Matematik)","Öğretmenlik (Fen Bilimleri)","Öğretmenlik (Türkçe)",
  "Öğretmenlik (İngilizce)","Öğretmenlik (Sınıf)",
  "Beslenme ve Diyetetik","Fizyoterapi ve Rehabilitasyon","Spor Bilimleri",
];

const inputClass =
  "w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20";

export default function KocKayitForm() {
  return (
    <form action={coachSignUp} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Ad Soyad</label>
          <input type="text" name="name" required autoComplete="name" placeholder="Ada Yılmaz" className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Mezun / Öğrenci olduğu Üniversite</label>
          <input list="koc-uni-list" name="university" required placeholder="Aramak için yaz..." className={inputClass} />
          <datalist id="koc-uni-list">
            {UNIVERSITELER.map((u) => <option key={u} value={u} />)}
          </datalist>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Bölüm</label>
          <input list="koc-bolum-list" name="department" required placeholder="Aramak için yaz..." className={inputClass} />
          <datalist id="koc-bolum-list">
            {BOLUMLER.map((b) => <option key={b} value={b} />)}
          </datalist>
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">E-posta</label>
          <input type="email" name="email" required autoComplete="email" placeholder="ada@ornek.com" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">Şifre</label>
          <input type="password" name="password" required minLength={6} autoComplete="new-password" placeholder="En az 6 karakter" className={inputClass} />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-gray-300">
            Kendini kısaca tanıt <span className="text-gray-500 font-normal">(opsiyonel)</span>
          </label>
          <textarea
            name="bio"
            rows={3}
            placeholder="Hangi sınavlara hazırladın, kaç yıllık deneyimin var..."
            className={`${inputClass} resize-none`}
          />
        </div>
      </div>
      <button type="submit" className="w-full rounded-xl bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
        Başvur
      </button>
    </form>
  );
}
