// Hızlı okuma testi metinleri + anlama soruları.
// Kelime sayısı çalışma anında whitespace'e göre hesaplanır (wordCount).

export type Question = {
  q: string;
  options: string[];
  correct: number; // options index
};

export type Passage = {
  id: string;
  title: string;
  level: "Kolay" | "Orta" | "İleri";
  text: string;
  questions: Question[];
};

export function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const PASSAGES: Passage[] = [
  {
    id: "beyin",
    title: "Beyin Nasıl Öğrenir?",
    level: "Kolay",
    text: `İnsan beyni, hayatı boyunca kendini yeniden şekillendirebilen olağanüstü bir organdır. Bilim insanları bu özelliğe nöroplastisite adını verir. Yeni bir bilgi öğrendiğimizde beyin hücreleri, yani nöronlar arasında yeni bağlantılar kurulur. Bu bağlantıları ne kadar sık kullanırsak, o kadar güçlenirler. Kullanılmayan bağlantılar ise zamanla zayıflar ve kaybolur.

Öğrenmeyi kalıcı hâle getiren en önemli faktör tekrardır. Ancak tekrar tek başına yeterli değildir; aralıklı tekrar çok daha etkilidir. Bir konuyu bir kez uzun süre çalışmak yerine, aynı konuyu günlere yayarak birkaç kez gözden geçirmek beynin bilgiyi uzun süreli hafızaya taşımasına yardımcı olur. Uyku da bu süreçte kritik bir rol oynar. Gün içinde öğrendiklerimiz, biz uyurken düzenlenir ve pekiştirilir.

Bu yüzden sınavdan önceki gece sabaha kadar çalışmak çoğu zaman ters teper. Beyin, dinlenmediği için öğrendiklerini düzgün biçimde yerleştiremez. Düzenli uyku, aralıklı tekrar ve odaklanmış çalışma bir araya geldiğinde öğrenme çok daha verimli hâle gelir.`,
    questions: [
      {
        q: "Beynin kendini yeniden şekillendirebilme özelliğine ne ad verilir?",
        options: ["Nöroplastisite", "Nöron", "Hafıza", "Refleks"],
        correct: 0,
      },
      {
        q: "Metne göre öğrenmeyi kalıcı kılan en etkili yöntem hangisidir?",
        options: [
          "Bir konuyu tek seferde uzun süre çalışmak",
          "Aralıklı tekrar",
          "Sadece sınavdan önce çalışmak",
          "Hiç uyumamak",
        ],
        correct: 1,
      },
      {
        q: "Metne göre uykunun öğrenmedeki rolü nedir?",
        options: [
          "Öğrenmeyi engeller",
          "Hiçbir etkisi yoktur",
          "Öğrenilenlerin düzenlenip pekiştirilmesini sağlar",
          "Sadece bedeni dinlendirir",
        ],
        correct: 2,
      },
    ],
  },
  {
    id: "zaman",
    title: "Zamanı Yönetmek",
    level: "Orta",
    text: `Zaman, herkese eşit dağıtılan ama çoğu zaman en kötü kullanılan kaynaktır. Sınava hazırlanan bir öğrenci için zamanı yönetmek, bilgiyi öğrenmek kadar önemlidir. Çünkü sınırsız çalışma saati yoktur; asıl mesele eldeki saatleri en verimli biçimde değerlendirmektir.

Etkili zaman yönetiminin ilk adımı önceliklendirmedir. Her görev aynı öneme sahip değildir. Bazı konular hem sınavda çok çıkar hem de öğrencinin zayıf olduğu alanlardır; bunlara öncelik verilmelidir. Buna karşılık, zaten iyi bilinen bir konuyu tekrar tekrar çalışmak, güvenli ama verimsiz bir tercihtir.

İkinci adım, çalışmayı yönetilebilir bloklara bölmektir. Kesintisiz üç saat çalışmaya çalışmak çoğu insanın dikkatini dağıtır. Bunun yerine yirmi beş dakikalık odaklı çalışma ve beş dakikalık molalardan oluşan döngüler, dikkati canlı tutar. Bu yönteme Pomodoro tekniği denir.

Son olarak, planı yazılı hâle getirmek gerekir. Zihinde tutulan planlar kolayca unutulur ve esner. Kâğıda ya da bir uygulamaya yazılan hedefler ise sorumluluk duygusu yaratır ve ilerlemenin görülmesini sağlar. Kısacası zamanı yönetmek, aslında dikkati ve önceliği yönetmektir.`,
    questions: [
      {
        q: "Metne göre etkili zaman yönetiminin ilk adımı nedir?",
        options: ["Uzun süre çalışmak", "Önceliklendirme", "Mola vermemek", "Not tutmamak"],
        correct: 1,
      },
      {
        q: "Yirmi beş dakika çalışıp beş dakika mola vermeye dayanan yönteme ne ad verilir?",
        options: ["Nöroplastisite", "Aralıklı tekrar", "Pomodoro tekniği", "Önceliklendirme"],
        correct: 2,
      },
      {
        q: "Metne göre planı yazılı hâle getirmenin faydası nedir?",
        options: [
          "Planı esnetmeyi kolaylaştırır",
          "Sorumluluk duygusu yaratır ve ilerlemeyi görünür kılar",
          "Zamanı uzatır",
          "Dikkati dağıtır",
        ],
        correct: 1,
      },
      {
        q: "Metnin ana fikri aşağıdakilerden hangisidir?",
        options: [
          "Zamanı yönetmek dikkati ve önceliği yönetmektir",
          "Çok çalışan her zaman kazanır",
          "Zaman yönetimi gereksizdir",
          "Sadece kolay konular çalışılmalıdır",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: "okuma",
    title: "Hızlı Okumanın Sırrı",
    level: "İleri",
    text: `Çoğu insan okurken farkında olmadan hızını düşüren alışkanlıklara sahiptir. Bunların başında iç seslendirme gelir. Okuduğumuz her kelimeyi zihnimizde sanki yüksek sesle söylüyormuş gibi tekrarlarız. Bu alışkanlık, konuşma hızımızla sınırlı kaldığımız için okuma hızını ciddi biçimde yavaşlatır. Oysa göz, zihnin sesinden çok daha hızlı çalışabilir.

İkinci engel geri dönüşlerdir. Gözlerimiz, okuduğumuz bir satıra ya da kelimeye emin olmadığımız için sık sık geri döner. Bu geri dönüşlerin büyük kısmı aslında gereksizdir; metnin akışı içinde kaçırdığımızı sandığımız bilgiyi zaten kavramışızdır. Üçüncü engel ise kelimeleri tek tek okumaktır. Deneyimli bir okur, gözünü bir kelimeye değil, üç dört kelimelik gruplara odaklar ve satırı sıçramalarla tarar.

Hızlı okuma, bu üç engeli azaltma sanatıdır. İç seslendirmeyi bastırmak, gereksiz geri dönüşleri engellemek ve kelimeleri gruplar hâlinde algılamak, okuma hızını iki hatta üç katına çıkarabilir. Ancak burada gözden kaçırılmaması gereken bir nokta vardır: Hız, anlamayı gölgede bırakmamalıdır. Amaç, sayfayı yalnızca hızlı geçmek değil, aynı zamanda kavramaktır. Gerçek hızlı okur, hem hızlı hem de doğru anlayandır.`,
    questions: [
      {
        q: "Metne göre okuma hızını düşüren başlıca alışkanlık nedir?",
        options: ["Kelime gruplama", "İç seslendirme", "Hızlı göz hareketi", "Çok okumak"],
        correct: 1,
      },
      {
        q: "Deneyimli bir okur gözünü neye odaklar?",
        options: [
          "Tek bir harfe",
          "Tek bir kelimeye",
          "Üç dört kelimelik gruplara",
          "Tüm sayfaya aynı anda",
        ],
        correct: 2,
      },
      {
        q: "Metnin vurguladığı en önemli uyarı nedir?",
        options: [
          "Hız her şeyden önemlidir",
          "Anlamak gereksizdir",
          "Hız, anlamayı gölgede bırakmamalıdır",
          "Geri dönüşler her zaman gereklidir",
        ],
        correct: 2,
      },
      {
        q: "Metne göre 'geri dönüşler' çoğunlukla nasıldır?",
        options: [
          "Zorunludur",
          "Gereksizdir",
          "Anlamayı artırır",
          "Hızı yükseltir",
        ],
        correct: 1,
      },
    ],
  },
];
