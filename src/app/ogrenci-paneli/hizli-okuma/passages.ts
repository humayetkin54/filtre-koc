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

  // ─────────────────── KOLAY ───────────────────
  {
    id: "su-dongusu",
    title: "Suyun Yolculuğu",
    level: "Kolay",
    text: `Dünyadaki su hiç tükenmez; sadece sürekli yer değiştirir. Denizlerden ve göllerden buharlaşan su, gökyüzüne yükselir. Yükseldikçe soğur ve küçük damlacıklara dönüşerek bulutları oluşturur. Bulutlar ağırlaşınca su, yağmur ya da kar olarak yeryüzüne geri döner.

Yeryüzüne inen suyun bir kısmı toprağa süzülür ve yer altı sularını besler. Bir kısmı ise derelerde ve nehirlerde toplanarak yeniden denize ulaşır. Böylece döngü hiç durmadan yeniden başlar. Bilim insanları bu sürece su döngüsü adını verir.

Bu döngü, gezegendeki yaşamın temelidir. Bitkiler topraktaki suyu kökleriyle alır, hayvanlar ve insanlar içerek yaşar. Suyun sürekli dolaşımı olmasaydı, kara parçaları çölleşir ve canlılar yaşayamazdı. Bu yüzden suyu kirletmemek ve boşa harcamamak, aslında bu değerli döngüyü korumak demektir.`,
    questions: [
      {
        q: "Denizlerden buharlaşan su ne oluşturur?",
        options: ["Yer altı sularını", "Bulutları", "Nehirleri", "Çölleri"],
        correct: 1,
      },
      {
        q: "Metne göre suyun sürekli yer değiştirmesine ne ad verilir?",
        options: ["Buharlaşma", "Su döngüsü", "Yağış", "Süzülme"],
        correct: 1,
      },
      {
        q: "Metnin ana mesajı nedir?",
        options: [
          "Su tükenen bir kaynaktır",
          "Su döngüsü yaşamın temelidir ve korunmalıdır",
          "Yağmur zararlıdır",
          "Denizler kuruyacaktır",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "ari-toplum",
    title: "Arıların Düzeni",
    level: "Kolay",
    text: `Bir arı kovanı, binlerce arının kusursuz bir uyum içinde yaşadığı küçük bir şehir gibidir. Kovanda her arının belli bir görevi vardır. Kraliçe arı yumurtaları bırakır, erkek arılar üremeye yardımcı olur, işçi arılar ise kovanın neredeyse bütün işini üstlenir.

İşçi arılar yaşamları boyunca farklı görevlerde çalışır. Gençken kovanı temizler ve larvaları besler. Biraz büyüyünce bal peteği örer ve kovanı korur. En sonunda dışarı çıkıp çiçeklerden nektar toplamaya başlar. Topladıkları nektar, kovanda bala dönüşür.

Arılar birbirleriyle dans ederek iletişim kurar. Bir işçi arı bol çiçek bulduğunda kovana döner ve özel bir dansla yiyeceğin yönünü ve uzaklığını arkadaşlarına anlatır. Bu sayede diğer arılar zaman kaybetmeden doğru yere gider. Arıların bu düzeni, doğadaki iş birliğinin en güzel örneklerinden biridir.`,
    questions: [
      {
        q: "Kovandaki işlerin neredeyse tamamını hangi arılar yapar?",
        options: ["Kraliçe arı", "Erkek arılar", "İşçi arılar", "Larvalar"],
        correct: 2,
      },
      {
        q: "Arılar yiyeceğin yerini birbirlerine nasıl anlatır?",
        options: ["Ses çıkararak", "Dans ederek", "Koku bırakarak", "Renk değiştirerek"],
        correct: 1,
      },
      {
        q: "Metne göre işçi bir arı en son hangi görevi üstlenir?",
        options: ["Kovanı temizlemek", "Larvaları beslemek", "Nektar toplamak", "Peteği örmek"],
        correct: 2,
      },
    ],
  },
  {
    id: "guness-enerji",
    title: "Güneşten Gelen Güç",
    level: "Kolay",
    text: `Güneş, dünyaya her gün muazzam bir enerji gönderir. Bu enerjinin yalnızca küçük bir bölümünü kullanabilsek bile, tüm gezegenin ihtiyacını karşılayabiliriz. İşte güneş panelleri tam olarak bunu yapmak için üretilmiştir.

Güneş panelleri, üzerlerine düşen ışığı elektriğe çevirir. Panelin içinde özel maddeler bulunur; ışık bu maddelere çarptığında elektrik akımı oluşur. Bu akım evlerde, okullarda ve fabrikalarda kullanılabilir. Üstelik bu süreçte hava kirletilmez ve yakıt tüketilmez.

Güneş enerjisinin en büyük avantajı tükenmemesidir. Kömür ve petrol gibi kaynaklar bir gün bitecektir, ama güneş milyarlarca yıl daha parlamaya devam edecektir. Bu yüzden birçok ülke, temiz ve sınırsız olan güneş enerjisine giderek daha fazla yatırım yapmaktadır.`,
    questions: [
      {
        q: "Güneş panelleri ışığı neye çevirir?",
        options: ["Isıya", "Elektriğe", "Suya", "Yakıta"],
        correct: 1,
      },
      {
        q: "Metne göre güneş enerjisinin en büyük avantajı nedir?",
        options: ["Ucuz olması", "Tükenmemesi", "Kolay taşınması", "Hızlı olması"],
        correct: 1,
      },
      {
        q: "Metne göre güneş enerjisi üretilirken ne olmaz?",
        options: [
          "Elektrik oluşmaz",
          "Hava kirletilmez ve yakıt tüketilmez",
          "Panel ısınmaz",
          "Işık kullanılmaz",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "alexandria",
    title: "Kayıp Kütüphane",
    level: "Kolay",
    text: `Antik çağda İskenderiye şehrinde, dünyanın en büyük kütüphanesi bulunuyordu. Bu kütüphane, o dönemde bilinen neredeyse tüm bilgiyi bir araya toplamayı amaçlıyordu. Şehre gelen gemiler aranır, üzerlerindeki kitaplar kopyalanır ve kütüphaneye eklenirdi.

Kütüphanede yüz binlerce el yazması vardı. Buraya dünyanın dört bir yanından bilginler gelir, çalışır ve tartışırdı. Matematik, tıp, astronomi ve felsefe alanında birçok önemli fikir bu duvarlar arasında doğdu. İskenderiye, adeta bir bilgi başkentiydi.

Ne yazık ki kütüphane zamanla yangınlar ve savaşlar sonucu yok oldu. İçindeki sayısız eser sonsuza dek kayboldu. Bugün o kitapların çoğunu asla okuyamıyoruz. İskenderiye Kütüphanesi'nin hikâyesi, bilginin ne kadar değerli ve aynı zamanda ne kadar kırılgan olduğunu bize hatırlatır.`,
    questions: [
      {
        q: "İskenderiye Kütüphanesi'nin amacı neydi?",
        options: [
          "Sadece şiir toplamak",
          "Bilinen tüm bilgiyi bir araya getirmek",
          "Gemi yapmak",
          "Para biriktirmek",
        ],
        correct: 1,
      },
      {
        q: "Şehre gelen gemilerdeki kitaplara ne yapılırdı?",
        options: ["Satılırdı", "Yakılırdı", "Kopyalanıp kütüphaneye eklenirdi", "Geri verilirdi"],
        correct: 2,
      },
      {
        q: "Metne göre kütüphanenin hikâyesi bize neyi hatırlatır?",
        options: [
          "Bilginin değerli ama kırılgan olduğunu",
          "Savaşların yararlı olduğunu",
          "Kitapların gereksiz olduğunu",
          "Gemilerin tehlikeli olduğunu",
        ],
        correct: 0,
      },
    ],
  },

  // ─────────────────── ORTA ───────────────────
  {
    id: "hafiza-sarayi",
    title: "Hafıza Sarayı Yöntemi",
    level: "Orta",
    text: `İnsan zihni, soyut listeleri hatırlamakta zorlanır ama mekânları ve görselleri şaşırtıcı bir kolaylıkla akılda tutar. Antik Yunan ve Roma'da hatipler bu gerçeği fark etmiş ve "hafıza sarayı" adı verilen bir teknik geliştirmişlerdir. Bu yöntem bugün hâlâ hafıza şampiyonları tarafından kullanılmaktadır.

Teknik oldukça basit bir mantığa dayanır. Kişi, çok iyi bildiği bir mekânı, örneğin kendi evini zihninde canlandırır. Ardından hatırlamak istediği bilgileri, bu mekânın belirli noktalarına yerleştirir. Kapıya, koltuğa, mutfak masasına birer bilgi asar. Bilgiyi ne kadar tuhaf ve abartılı bir görselle eşleştirirse, o kadar kalıcı olur.

Hatırlama anında kişi, zihninde bu mekânda yürüyüşe çıkar. Her durakta oraya yerleştirdiği görseli görür ve bilgiyi geri çağırır. Böylece rastgele bir kelime listesi, tanıdık bir yolculuğa dönüşür. Beynin mekânsal hafızası, sıralı hatırlamayı destekler.

Bu yöntemin gücü, öğrenmeyi pasif tekrardan aktif hayal gücüne taşımasında yatar. Bilgiyi kendi zihinsel dünyamızda inşa ettiğimizde, o bilgi bize ait hâle gelir ve çok daha zor unutulur.`,
    questions: [
      {
        q: "Hafıza sarayı yöntemi insan zihninin hangi güçlü yönünden yararlanır?",
        options: [
          "Sayıları hatırlama",
          "Mekânları ve görselleri hatırlama",
          "Hızlı okuma",
          "Soyut düşünme",
        ],
        correct: 1,
      },
      {
        q: "Metne göre bir bilgi nasıl daha kalıcı hâle gelir?",
        options: [
          "Sessizce tekrar edilerek",
          "Tuhaf ve abartılı bir görselle eşleştirilerek",
          "Hızlıca okunarak",
          "Yazıya dökülerek",
        ],
        correct: 1,
      },
      {
        q: "Bu yöntemi ilk geliştirenler kimlerdir?",
        options: [
          "Modern bilim insanları",
          "Antik Yunan ve Romalı hatipler",
          "Mısırlı rahipler",
          "Ortaçağ keşişleri",
        ],
        correct: 1,
      },
      {
        q: "Metne göre yöntemin asıl gücü nereden gelir?",
        options: [
          "Öğrenmeyi pasif tekrardan aktif hayal gücüne taşımasından",
          "Çok zaman almasından",
          "Yazmayı gerektirmesinden",
          "Kolay olmasından",
        ],
        correct: 0,
      },
    ],
  },
  {
    id: "buyume-zihni",
    title: "Gelişim Zihniyeti",
    level: "Orta",
    text: `Psikolog Carol Dweck, yıllar süren araştırmalarında insanların yeteneğe bakış açısını iki ana grupta topladı. Bir grup, zekânın ve yeteneğin doğuştan sabit olduğuna inanıyordu. Diğer grup ise yeteneğin çalışmayla geliştirilebileceğini düşünüyordu. Dweck bu ikinci bakış açısına "gelişim zihniyeti" adını verdi.

Sabit zihniyete sahip öğrenciler, zorlukla karşılaştıklarında kolayca pes etme eğilimindedir. Onlar için başarısızlık, yeteneksiz olduklarının bir kanıtıdır. Bu yüzden hata yapmaktan kaçınır, kendilerini zorlayacak görevlerden uzak dururlar. Bir sınavda düşük not aldıklarında, "Ben zaten bu işte iyi değilim" derler.

Gelişim zihniyetine sahip öğrenciler ise zorluğu bir tehdit değil, bir fırsat olarak görür. Onlara göre başarısızlık, henüz öğrenilmemiş bir şeyin işaretidir. Hatalarını inceler, eksiklerini kapatır ve tekrar dener. Bu öğrenciler zamanla, doğuştan daha yetenekli görünen akranlarını bile geçebilir.

Dweck'in bulguları, başarının yalnızca doğuştan gelen bir armağan olmadığını gösterir. Çabaya ve doğru stratejiye verilen değer, uzun vadede en belirleyici etkendir. Zihniyet, kaderi değiştirebilir.`,
    questions: [
      {
        q: "Gelişim zihniyetine sahip kişiler yeteneği nasıl görür?",
        options: [
          "Doğuştan sabit",
          "Çalışmayla geliştirilebilir",
          "Şansa bağlı",
          "Değiştirilemez",
        ],
        correct: 1,
      },
      {
        q: "Sabit zihniyetli öğrenciler başarısızlığı nasıl yorumlar?",
        options: [
          "Öğrenilecek bir fırsat olarak",
          "Yeteneksizliğin kanıtı olarak",
          "Şanssızlık olarak",
          "Önemsiz bir olay olarak",
        ],
        correct: 1,
      },
      {
        q: "Bu kavramı ortaya koyan psikolog kimdir?",
        options: ["Sigmund Freud", "Carol Dweck", "Ivan Pavlov", "Jean Piaget"],
        correct: 1,
      },
      {
        q: "Metne göre uzun vadede başarıyı belirleyen en önemli etken nedir?",
        options: [
          "Doğuştan gelen zekâ",
          "Çaba ve doğru strateji",
          "Şans",
          "Ailenin desteği",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "matbaa",
    title: "Matbaanın Devrimi",
    level: "Orta",
    text: `On beşinci yüzyıla kadar kitaplar tek tek elle çoğaltılıyordu. Bir keşiş, tek bir kitabı kopyalamak için aylarca, bazen yıllarca çalışırdı. Bu yüzden kitaplar son derece pahalıydı ve yalnızca zengin kişiler ya da kilise sahip olabilirdi. Bilgi, dar bir çevrenin elinde tutuluyordu.

Johannes Gutenberg'in geliştirdiği hareketli harfli matbaa, bu düzeni kökten değiştirdi. Artık harfler tek tek dizilebiliyor, bir sayfa kalıba dönüştürülüp yüzlerce kez basılabiliyordu. Bir kitabın çoğaltılması aylar yerine günler alıyordu. Kitap fiyatları hızla düştü ve okuryazarlık yayılmaya başladı.

Bu teknik değişimin sonuçları çok derin oldu. Fikirler daha önce hiç olmadığı kadar hızlı yayıldı. Bilim insanları birbirlerinin çalışmalarını okuyabiliyor, tartışmalar kıtalar arasında sürebiliyordu. Dini metinler halkın diline çevrildi ve sıradan insanlar da onlara ulaşabildi.

Tarihçiler, matbaayı insanlık tarihinin dönüm noktalarından biri sayar. Çünkü matbaa yalnızca bir baskı makinesi değildi; bilginin özgürleşmesinin ve modern dünyanın kapılarını aralayan bir anahtardı.`,
    questions: [
      {
        q: "Matbaadan önce kitaplar nasıl çoğaltılıyordu?",
        options: ["Makinelerle", "Elle tek tek kopyalanarak", "Fotoğrafla", "Baskı kalıplarıyla"],
        correct: 1,
      },
      {
        q: "Hareketli harfli matbaayı kim geliştirdi?",
        options: ["Leonardo da Vinci", "Johannes Gutenberg", "Galileo", "Isaac Newton"],
        correct: 1,
      },
      {
        q: "Matbaanın en önemli sonucu ne oldu?",
        options: [
          "Kitaplar daha pahalı oldu",
          "Bilgi hızla yayıldı ve okuryazarlık arttı",
          "Kütüphaneler kapandı",
          "Keşişler zenginleşti",
        ],
        correct: 1,
      },
      {
        q: "Metne göre tarihçiler matbaayı neden önemli sayar?",
        options: [
          "Sadece bir makine olduğu için",
          "Bilginin özgürleşmesini sağladığı için",
          "Pahalı olduğu için",
          "Kiliseye ait olduğu için",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "uyku-evreleri",
    title: "Uykunun Evreleri",
    level: "Orta",
    text: `Uyku, dışarıdan bakıldığında tek tip bir dinlenme gibi görünse de aslında birbirinden farklı evrelerden oluşan karmaşık bir süreçtir. Gece boyunca beynimiz, bu evreler arasında birçok kez gidip gelir. Her evrenin bedenimiz ve zihnimiz için ayrı bir görevi vardır.

Uykunun ilk evreleri hafif uykudur. Bu aşamada beden yavaşlar, kaslar gevşer ve kalp atışı düşer. Ardından derin uyku evresi gelir. Derin uyku, bedenin kendini onardığı, kasların yenilendiği ve bağışıklık sisteminin güçlendiği evredir. Bu yüzden fiziksel yorgunluğun asıl giderildiği an burasıdır.

Gecenin ilerleyen saatlerinde REM adı verilen bir evre öne çıkar. REM uykusunda gözler kapalıyken hızla hareket eder ve rüyaların çoğu bu evrede görülür. İlginç olan, REM sırasında beynin neredeyse uyanıkken olduğu kadar aktif olmasıdır. Bilim insanları, gün içinde öğrenilen bilgilerin özellikle bu evrede düzenlenip pekiştirildiğini düşünür.

Sağlıklı bir uyku, bu evrelerin dengeli biçimde tamamlanmasını gerektirir. Uyku bölündüğünde ya da kısaldığında, özellikle derin uyku ve REM evreleri eksik kalır. Bu da hem bedenin dinlenmesini hem de öğrenmenin kalıcılığını olumsuz etkiler.`,
    questions: [
      {
        q: "Bedenin kendini onardığı evre hangisidir?",
        options: ["Hafif uyku", "Derin uyku", "REM uykusu", "Uyanıklık"],
        correct: 1,
      },
      {
        q: "Rüyaların çoğu hangi evrede görülür?",
        options: ["Hafif uyku", "Derin uyku", "REM uykusu", "Uykuya dalış"],
        correct: 2,
      },
      {
        q: "Metne göre öğrenilen bilgiler hangi evrede pekiştirilir?",
        options: ["Hafif uyku", "Derin uyku", "REM uykusu", "Hiçbiri"],
        correct: 2,
      },
      {
        q: "Uyku bölündüğünde en çok hangi evreler eksik kalır?",
        options: [
          "Sadece hafif uyku",
          "Derin uyku ve REM",
          "Yalnızca REM",
          "Hiçbir evre etkilenmez",
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────── İLERİ ───────────────────
  {
    id: "kelebek-etkisi",
    title: "Kelebek Etkisi ve Kaos",
    level: "İleri",
    text: `Yirminci yüzyılın ortalarında meteorolog Edward Lorenz, hava durumunu bilgisayarla modellemeye çalışırken beklenmedik bir şeyle karşılaştı. Bir hesaplamayı tekrar çalıştırmak istediğinde, başlangıç değerlerini binde birlik bir farkla yuvarlamış, bunun sonucu etkilemeyeceğini varsaymıştı. Oysa çıkan tahmin, öncekinden tamamen farklıydı. Bu küçük hata, devasa bir sapmaya yol açmıştı.

Lorenz'in fark ettiği şey, sonradan kaos teorisinin temeli oldu. Bazı sistemler, başlangıç koşullarındaki en ufak değişime bile olağanüstü duyarlıdır. Bu duyarlılık, uzun vadeli tahminleri neredeyse imkânsız hâle getirir. Lorenz bu fikri çarpıcı bir imgeyle özetledi: Brezilya'da bir kelebeğin kanat çırpması, haftalar sonra Teksas'ta bir kasırgayı tetikleyebilir.

Bu "kelebek etkisi" kavramı, determinizm hakkındaki sezgilerimize meydan okur. Sistem tamamen belirlenimci kurallara uysa bile, başlangıç durumunu sonsuz kesinlikte ölçemediğimiz için geleceği kestiremeyiz. Yani kaos, rastlantısallık değildir; ölçüm sınırlarımızın ve duyarlılığın bir sonucudur.

Kaos teorisi bugün meteorolojiden ekonomiye, kalp ritminden gezegen yörüngelerine kadar pek çok alanda kullanılır. Öğrettiği ders çarpıcıdır: Düzenli görünen sistemler öngörülemez davranabilir ve küçük nedenler büyük sonuçlar doğurabilir. Evrenin bir kısmı, kesin kurallarla işlese bile bizim için temelde tahmin edilemez kalır.`,
    questions: [
      {
        q: "Lorenz'in beklenmedik sonuçla karşılaşmasının nedeni neydi?",
        options: [
          "Bilgisayarın bozulması",
          "Başlangıç değerlerini çok küçük bir farkla yuvarlaması",
          "Yanlış formül kullanması",
          "Verileri kaybetmesi",
        ],
        correct: 1,
      },
      {
        q: "Metne göre 'kelebek etkisi' neyi anlatır?",
        options: [
          "Kelebeklerin göçünü",
          "Küçük bir değişimin büyük sonuçlar doğurabileceğini",
          "Hava durumunun kolay tahmin edildiğini",
          "Kaosun rastlantı olduğunu",
        ],
        correct: 1,
      },
      {
        q: "Metne göre kaos aslında nedir?",
        options: [
          "Tamamen rastlantısallık",
          "Ölçüm sınırlarımızın ve duyarlılığın bir sonucu",
          "Bir hesap hatası",
          "Doğanın düzensizliği",
        ],
        correct: 1,
      },
      {
        q: "Kaos teorisinin öğrettiği temel ders nedir?",
        options: [
          "Her sistem kolayca tahmin edilir",
          "Düzenli görünen sistemler öngörülemez davranabilir",
          "Küçük nedenler önemsizdir",
          "Bilim geleceği kesin bilir",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "antibiyotik-direnc",
    title: "Görünmez Bir Yarış",
    level: "İleri",
    text: `Antibiyotiklerin keşfi, tıp tarihinin en büyük zaferlerinden biriydi. Bir zamanlar ölümcül olan enfeksiyonlar, birkaç günlük tedaviyle iyileştirilebilir hâle geldi. Ancak bu zaferin gölgesinde, giderek büyüyen sessiz bir tehdit doğdu: antibiyotik direnci.

Bakteriler, hızla çoğalan ve çoğalırken sürekli küçük değişimler geçiren canlılardır. Bir antibiyotik bir bakteri topluluğuna uygulandığında, çoğu bakteri ölür. Ne var ki rastlantısal bir değişim sayesinde ilaca dayanıklı hâle gelmiş birkaç birey hayatta kalabilir. Bu dirençli bireyler çoğaldıkça, artık ilacın etkisiz kaldığı yeni bir topluluk ortaya çıkar. Bu, doğal seçilimin acımasız ve hızlı bir örneğidir.

Sorunu büyüten en önemli etken, antibiyotiklerin bilinçsiz kullanımıdır. Gereksiz yere ilaç almak ya da tedaviyi yarıda bırakmak, en dirençli bakterilerin ayakta kalmasına ve yayılmasına zemin hazırlar. Tarımda ve hayvancılıkta yaygın antibiyotik kullanımı da bu süreci hızlandırır.

Bilim insanları, direncin bugün küresel bir sağlık tehdidi hâline geldiği konusunda uyarıyor. Eğer yeni ilaçlar geliştirilemez ve mevcut ilaçlar bilinçli kullanılmazsa, basit enfeksiyonların bile yeniden tehlikeli hâle geldiği bir döneme dönebiliriz. Bu görünmez yarışta insanlığın en güçlü silahı, dikkatli ve sorumlu davranıştır.`,
    questions: [
      {
        q: "Bir antibiyotik uygulandığında dirençli bakterilere ne olur?",
        options: [
          "Hepsi ölür",
          "Hayatta kalıp çoğalırlar",
          "Değişim geçirmezler",
          "Etkisiz hâle gelirler",
        ],
        correct: 1,
      },
      {
        q: "Metne göre direnç sürecini hızlandıran en önemli etken nedir?",
        options: [
          "İlaçların pahalı olması",
          "Antibiyotiklerin bilinçsiz kullanımı",
          "Bakterilerin yavaş çoğalması",
          "Yeni ilaçların bulunması",
        ],
        correct: 1,
      },
      {
        q: "Antibiyotik direnci hangi doğa mekanizmasının bir örneğidir?",
        options: ["Adaptasyon eksikliği", "Doğal seçilim", "Mutasyonsuz üreme", "Simbiyoz"],
        correct: 1,
      },
      {
        q: "Metne göre bu yarışta insanlığın en güçlü silahı nedir?",
        options: [
          "Daha çok ilaç kullanmak",
          "Dikkatli ve sorumlu davranış",
          "Tedaviyi kısa kesmek",
          "Tarımda antibiyotik kullanmak",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "gozun-yanilgisi",
    title: "Gözün Yanılttığı An",
    level: "İleri",
    text: `Gördüğümüz dünyanın, gözümüze düşen ışığın doğrudan bir kopyası olduğunu sanırız. Oysa görme, göründüğünden çok daha karmaşık ve yaratıcı bir süreçtir. Gözlerimizden gelen ham veri eksik, bulanık ve çoğu zaman çelişkilidir. Beyin, bu eksik veriyi geçmiş deneyimleriyle birleştirerek tutarlı bir görüntü inşa eder. Yani gördüğümüz şey, kısmen bir tahmindir.

Bu yaratıcı sürecin en çarpıcı kanıtı optik yanılsamalardır. Belirli desenlere baktığımızda, aslında hareket etmeyen çizgilerin kıpırdadığını görebilir ya da eşit uzunluktaki iki çizgiyi farklı algılayabiliriz. Bu yanılgılar, gözün bir kusuru değildir; tam tersine, beynin dünyayı hızlı ve verimli yorumlamak için kullandığı kısayolların bir yan ürünüdür.

Beyin, her ayrıntıyı tek tek işlemek yerine bağlama dayalı varsayımlar yapar. Örneğin bir nesnenin gölgesine bakarak rengini "düzeltir" ya da eksik bir şeklin devamını kendiliğinden tamamlar. Bu varsayımlar günlük yaşamda neredeyse her zaman işe yarar; bu yüzden farkında bile olmayız. Ancak yanılsamalar, tam da bu varsayımların sınırlarını zorladığı için ortaya çıkar.

Bu durum, algının nesnel bir kayıt değil, etkin bir yorum olduğunu gösterir. Gerçekliği olduğu gibi değil, beynimizin en olası tahminini görürüz. Bilmek ile görmek arasındaki bu ince fark, insan zihninin hem ne kadar güçlü hem de ne kadar kolay yanılabilir olduğunu ortaya koyar.`,
    questions: [
      {
        q: "Metne göre gördüğümüz görüntü aslında nedir?",
        options: [
          "Işığın birebir kopyası",
          "Beynin eksik veriden inşa ettiği bir tahmin",
          "Kusursuz bir kayıt",
          "Gözün ürettiği bir fotoğraf",
        ],
        correct: 1,
      },
      {
        q: "Optik yanılsamalar neyin sonucudur?",
        options: [
          "Gözün bir kusurunun",
          "Beynin hızlı yorumlama kısayollarının bir yan ürününün",
          "Işık eksikliğinin",
          "Yorgunluğun",
        ],
        correct: 1,
      },
      {
        q: "Beyin eksik bir şekille karşılaştığında ne yapar?",
        options: [
          "Onu görmezden gelir",
          "Devamını kendiliğinden tamamlar",
          "Hata verir",
          "Rengini siler",
        ],
        correct: 1,
      },
      {
        q: "Metnin ana çıkarımı nedir?",
        options: [
          "Algı nesnel bir kayıttır",
          "Algı etkin bir yorumdur ve zihin yanılabilir",
          "Gözler her zaman doğruyu gösterir",
          "Yanılsamalar nadirdir",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "ortak-trajedi",
    title: "Ortak Alanların Trajedisi",
    level: "İleri",
    text: `Bir köyün ortasında, herkesin hayvanlarını otlatabildiği ortak bir mera olduğunu düşünelim. Her çoban için mantıklı olan, sürüsüne bir hayvan daha katmaktır; çünkü ek hayvanın getirisi tümüyle kendisine ait olurken, otlağın aşınması tüm köye pay edilir. Bireysel olarak akılcı olan bu tercih, herkes aynı şekilde davrandığında merayı çölleştirir. Sonunda kimse kazanamaz.

İktisatçı Garrett Hardin'in "ortak alanların trajedisi" olarak adlandırdığı bu ikilem, paylaşılan ama sınırlı olan kaynakların temel sorununu gösterir. Balık stokları, temiz hava, yeraltı suları ve hatta ortak bir çalışma projesi; bunların hepsi aynı mantıksal tuzağı taşır. Kısa vadeli bireysel çıkar, uzun vadeli ortak yıkımla çelişir.

Bu trajedi kaçınılmaz değildir. Araştırmacı Elinor Ostrom, dünyanın dört bir yanındaki topluluklarda insanların ortak kaynakları başarıyla yönettiği örnekler buldu. Bu toplulukların ortak özelliği, açık kurallar koymaları, kuralları birlikte denetlemeleri ve ihlalleri caydıracak makul yaptırımlar geliştirmeleriydi. Yani çözüm, ne tümüyle devletin zoruydu ne de sınırsız serbestlik; kolektif öz yönetimdi.

Bu kavram, bireysel akılcılığın her zaman toplumsal iyiye çıkmadığını hatırlatır. Ortak bir geleceği korumak, çoğu zaman bireyin kısa vadeli çıkarını bilinçli biçimde sınırlamasını gerektirir. Güven, kurallar ve iş birliği olmadan paylaşılan hiçbir kaynak uzun süre ayakta kalamaz.`,
    questions: [
      {
        q: "Ortak merada her çoban için bireysel olarak mantıklı olan nedir?",
        options: [
          "Hayvan sayısını azaltmak",
          "Sürüsüne bir hayvan daha katmak",
          "Merayı terk etmek",
          "Otları sulamak",
        ],
        correct: 1,
      },
      {
        q: "Bu ikilemi 'ortak alanların trajedisi' olarak adlandıran kimdir?",
        options: ["Elinor Ostrom", "Garrett Hardin", "Adam Smith", "Carol Dweck"],
        correct: 1,
      },
      {
        q: "Ostrom'un bulduğu başarılı toplulukların ortak özelliği neydi?",
        options: [
          "Kaynağı tamamen serbest bırakmaları",
          "Açık kurallar koyup birlikte denetlemeleri",
          "Devletin her şeyi yönetmesi",
          "Kaynağı hiç kullanmamaları",
        ],
        correct: 1,
      },
      {
        q: "Metnin ana çıkarımı nedir?",
        options: [
          "Bireysel akılcılık her zaman topluma yarar",
          "Ortak geleceği korumak bazen bireysel çıkarı sınırlamayı gerektirir",
          "Paylaşılan kaynaklar sorunsuz kendini yönetir",
          "İş birliği gereksizdir",
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────── KOLAY (ek) ───────────────────
  {
    id: "pusula",
    title: "Pusulanın İcadı",
    level: "Kolay",
    text: `İnsanlar binlerce yıl boyunca yönlerini güneşe ve yıldızlara bakarak buldu. Ama hava bulutlu olduğunda ya da açık denizde hiçbir kara parçası görünmediğinde, yolu bulmak çok zorlaşıyordu. Denizciler için bu, hayatı tehlikeye atan büyük bir sorundu.

Bu sorunu çözen buluş pusuladır. Pusula, üzerinde serbestçe dönebilen küçük bir mıknatıslı iğneye sahiptir. Bu iğne, Dünya'nın manyetik alanı sayesinde her zaman kuzeyi gösterir. Böylece denizciler, hava nasıl olursa olsun yönlerini şaşırmadan yol alabildiler.

Pusulanın ilk olarak Çin'de kullanıldığı düşünülür. Zamanla bu buluş dünyaya yayıldı ve deniz yolculuklarını kökten değiştirdi. Kâşifler artık daha uzak denizlere açılmaya cesaret edebiliyordu. Pusula olmasaydı, okyanusların keşfi belki de yüzyıllarca gecikirdi.`,
    questions: [
      {
        q: "Pusuladan önce denizciler yönlerini nasıl buluyordu?",
        options: ["Haritalarla", "Güneşe ve yıldızlara bakarak", "Rüzgârla", "Kuşları izleyerek"],
        correct: 1,
      },
      {
        q: "Pusulanın iğnesi neden hep kuzeyi gösterir?",
        options: [
          "Ağır olduğu için",
          "Dünya'nın manyetik alanı sayesinde",
          "Güneşi takip ettiği için",
          "Rüzgâr onu ittiği için",
        ],
        correct: 1,
      },
      {
        q: "Metne göre pusula ilk olarak nerede kullanılmıştır?",
        options: ["Mısır", "Çin", "Yunanistan", "Roma"],
        correct: 1,
      },
    ],
  },
  {
    id: "orman-agac",
    title: "Ağaçların Gizli Ağı",
    level: "Kolay",
    text: `Bir ormana baktığımızda, ağaçları tek tek büyüyen ayrı canlılar sanırız. Oysa bilim insanları, ağaçların toprağın altında birbirleriyle bağlantılı olduğunu keşfetti. Bu bağlantıyı sağlayan şey, köklerin çevresinde yaşayan minik mantarlardır.

Bu mantarlar, ağaç kökleriyle iş birliği yapar. Ağaçtan şeker alırlar, karşılığında ağaca sudan ve topraktaki minerallerden daha kolay yararlanmasını sağlarlar. Ama işin ilginç yanı, bu mantar ağı farklı ağaçları da birbirine bağlar. Böylece ağaçlar adeta yer altından haberleşir.

Güçlü bir ağaç, bu ağ sayesinde zayıf düşmüş komşusuna besin gönderebilir. Bir ağaç zararlı bir böcek saldırısına uğradığında, komşularını uyaran kimyasal sinyaller bile iletilebilir. Bilim insanları bu şaşırtıcı sisteme bazen şaka yollu "orman ağı" adını verir. Orman, göründüğünden çok daha fazla iş birliğine dayanır.`,
    questions: [
      {
        q: "Ağaçları toprağın altında birbirine bağlayan nedir?",
        options: ["Taşlar", "Minik mantarlar", "Su boruları", "Kökler tek başına"],
        correct: 1,
      },
      {
        q: "Mantarlar ağaçtan ne alır?",
        options: ["Su", "Şeker", "Yaprak", "Toprak"],
        correct: 1,
      },
      {
        q: "Metne göre güçlü bir ağaç bu ağ sayesinde ne yapabilir?",
        options: [
          "Komşusunun besinini çalabilir",
          "Zayıf komşusuna besin gönderebilir",
          "Daha hızlı büyür",
          "Kendini gizler",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "renk-gorme",
    title: "Renkleri Nasıl Görürüz?",
    level: "Kolay",
    text: `Etrafımızdaki dünya rengârenktir; ama aslında renk, nesnelerin kendisinde değil, ışıkta ve gözümüzde saklıdır. Güneş ışığı bize beyaz görünse de, içinde gökkuşağının tüm renklerini barındırır. Bir nesneye baktığımızda gördüğümüz renk, o nesnenin yansıttığı ışığın rengidir.

Örneğin bir elma kırmızı görünür; çünkü elma, ışığın kırmızı bölümünü yansıtır ve diğer renkleri yutar. Yeşil bir yaprak ise yeşil ışığı yansıtır. Yani nesneler, yalnızca yansıttıkları renkte görünür. Karanlıkta hiç ışık olmadığında ise hiçbir renk göremeyiz.

Gözümüzün içinde renkleri algılayan özel hücreler vardır. Bu hücreler farklı renklere duyarlıdır ve beyne sinyal gönderir. Beyin bu sinyalleri birleştirerek gördüğümüz zengin renk dünyasını oluşturur. Kısacası renk, ışığın, nesnenin ve gözümüzün ortak bir eseridir.`,
    questions: [
      {
        q: "Bir elma neden kırmızı görünür?",
        options: [
          "Kırmızı ışığı yuttuğu için",
          "Kırmızı ışığı yansıttığı için",
          "İçi kırmızı olduğu için",
          "Işık kırmızı olduğu için",
        ],
        correct: 1,
      },
      {
        q: "Metne göre karanlıkta renkleri neden göremeyiz?",
        options: ["Gözümüz kapandığı için", "Hiç ışık olmadığı için", "Renkler kaybolduğu için", "Beyin uyuduğu için"],
        correct: 1,
      },
      {
        q: "Metne göre renk neyin ortak eseridir?",
        options: [
          "Sadece nesnenin",
          "Işığın, nesnenin ve gözün",
          "Sadece ışığın",
          "Sadece beynin",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "gonulluluk",
    title: "Küçük Bir İyilik",
    level: "Kolay",
    text: `Bazen bir insanın gününü değiştirmek için büyük şeyler yapmak gerekmez. Otobüste yaşlı birine yer vermek, düşen bir kalemi almak ya da yorgun bir arkadaşa gülümsemek küçük görünür. Oysa bu küçük iyilikler, hem karşımızdaki kişiyi hem de bizi etkiler.

Araştırmalar, başkalarına yardım etmenin insanın kendi ruh hâlini de iyileştirdiğini gösteriyor. Birine yardım ettiğimizde beynimizde mutluluk veren kimyasallar salgılanır. Yani iyilik yapmak, aslında sadece alan için değil, veren için de bir armağandır.

Üstelik iyilik bulaşıcıdır. Bir kişinin yaptığı küçük bir yardım, onu gören başkalarını da benzer davranışlara yöneltir. Böylece tek bir jest, bir zincir gibi büyüyerek yayılabilir. Küçük iyilikler, toplum içinde sessiz ama güçlü bir dalga oluşturur.`,
    questions: [
      {
        q: "Metne göre birine yardım ettiğimizde beynimizde ne olur?",
        options: [
          "Hiçbir şey olmaz",
          "Mutluluk veren kimyasallar salgılanır",
          "Yorgunluk artar",
          "Uykumuz gelir",
        ],
        correct: 1,
      },
      {
        q: "Metne göre iyilik neden 'bulaşıcı'dır?",
        options: [
          "Hastalık gibi yayıldığı için",
          "Onu görenleri de benzer davranışa yönelttiği için",
          "Zorunlu olduğu için",
          "Para gerektirdiği için",
        ],
        correct: 1,
      },
      {
        q: "Metnin ana fikri nedir?",
        options: [
          "Sadece büyük yardımlar önemlidir",
          "Küçük iyilikler hem alanı hem vereni etkiler ve yayılır",
          "İyilik yapmak yorucudur",
          "İyilik yalnızca alan için iyidir",
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────── ORTA (ek) ───────────────────
  {
    id: "aktif-hatirlama",
    title: "Aktif Hatırlamanın Gücü",
    level: "Orta",
    text: `Çoğu öğrenci ders çalışırken aynı yöntemi kullanır: konuyu tekrar tekrar okumak. Not defterini ya da kitabı defalarca gözden geçirmek, bilgiyi öğrendiğimiz hissini verir. Ne var ki bu his çoğu zaman aldatıcıdır. Metni tanıdık bulmak, onu gerçekten hatırlayabilmekle aynı şey değildir.

Bilişsel psikoloji araştırmaları, çok daha etkili bir yöntem olduğunu gösteriyor: aktif hatırlama. Bu yöntemde öğrenci, konuyu tekrar okumak yerine kitabı kapatır ve hatırlayabildiği her şeyi kendi kendine anlatmaya ya da yazmaya çalışır. Beyni bilgiyi geri çağırmaya zorlamak, o bilgiyi hafızada güçlendirir.

Aktif hatırlamanın zor gelmesi aslında iyi bir işarettir. Beyin bir bilgiyi geri çağırmak için çabaladığında, o bilgiye giden sinir yolları kuvvetlenir. Oysa pasif okumada bu çaba yoktur; göz metnin üzerinden kayar ama zihin gerçekten çalışmaz. Bu yüzden bir saat pasif okuma, çoğu zaman yirmi dakika aktif hatırlamadan daha az kalıcıdır.

Bu bulgu, test çözmenin neden bu kadar değerli olduğunu da açıklar. Deneme sınavları yalnızca ölçme aracı değildir; aynı zamanda öğrenmeyi güçlendiren birer araçtır. Kendini sınayan öğrenci, farkında olmadan en etkili çalışma yöntemlerinden birini uygular.`,
    questions: [
      {
        q: "Metne göre bir metni tekrar okumak neden aldatıcı olabilir?",
        options: [
          "Çok zaman aldığı için",
          "Tanıdıklık hissi, gerçekten hatırlamakla karıştırıldığı için",
          "Sıkıcı olduğu için",
          "Gözü yorduğu için",
        ],
        correct: 1,
      },
      {
        q: "Aktif hatırlama yönteminde öğrenci ne yapar?",
        options: [
          "Konuyu tekrar tekrar okur",
          "Kitabı kapatıp hatırladıklarını anlatır ya da yazar",
          "Not almadan dinler",
          "Sadece altını çizer",
        ],
        correct: 1,
      },
      {
        q: "Metne göre aktif hatırlamanın zor gelmesi neyin işaretidir?",
        options: [
          "Yöntemin işe yaramadığının",
          "Beynin çalıştığının ve sinir yollarının güçlendiğinin",
          "Öğrencinin yeteneksiz olduğunun",
          "Konunun çok kolay olduğunun",
        ],
        correct: 1,
      },
      {
        q: "Metne göre deneme sınavları neden değerlidir?",
        options: [
          "Sadece not vermek için",
          "Hem ölçme hem de öğrenmeyi güçlendirme aracı olduğu için",
          "Öğrenciyi yordukları için",
          "Zaman doldurdukları için",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "buz-cagi",
    title: "Buzul Çağlarının Sırrı",
    level: "Orta",
    text: `Dünya'nın geçmişinde, buzulların kıtaların büyük bölümünü kapladığı uzun soğuk dönemler yaşandı. Bu dönemlere buzul çağları denir. Bir zamanlar bugün ılıman olan pek çok bölge, kilometrelerce kalınlıkta buzla örtülüydü. Peki gezegen neden zaman zaman bu kadar soğur?

Bilim insanları, bunun başlıca nedeninin Dünya'nın Güneş çevresindeki hareketlerindeki küçük değişimler olduğunu düşünüyor. Dünya'nın yörüngesi ve ekseninin eğikliği çok yavaş biçimde değişir. Bu değişimler, gezegenin farklı bölgelerine düşen güneş ışığının miktarını etkiler. Yeterince uzun süre az ışık alan bölgelerde buzullar büyümeye başlar.

Buzullar büyüdükçe ilginç bir döngü devreye girer. Buz, üzerine düşen güneş ışığının büyük kısmını uzaya geri yansıtır. Bu da yeryüzünün daha da soğumasına yol açar ve buzulların daha çok büyümesini sağlar. Böylece soğuma kendi kendini besler.

Son buzul çağı yaklaşık on bin yıl önce sona erdi. Bugün içinde bulunduğumuz ılıman dönem, aslında iki buzul çağı arasındaki bir ara dönem olabilir. Dünya'nın iklimi, insan ömrüyle kıyaslanamayacak kadar uzun ölçeklerde sürekli değişmektedir.`,
    questions: [
      {
        q: "Buzul çağlarının başlıca nedeni olarak metinde ne gösteriliyor?",
        options: [
          "Volkanik patlamalar",
          "Dünya'nın Güneş çevresindeki hareketlerindeki küçük değişimler",
          "Okyanus akıntıları",
          "İnsan faaliyetleri",
        ],
        correct: 1,
      },
      {
        q: "Buz, üzerine düşen güneş ışığına ne yapar?",
        options: [
          "Tamamını emer",
          "Büyük kısmını uzaya geri yansıtır",
          "Isıya çevirir",
          "Depolar",
        ],
        correct: 1,
      },
      {
        q: "Metinde anlatılan 'kendi kendini besleyen döngü' nedir?",
        options: [
          "Buzullar büyüdükçe daha çok ışık yansıtılır, bu da daha çok soğumaya yol açar",
          "Buzullar eridikçe hava ısınır",
          "Güneş giderek söner",
          "Okyanuslar buharlaşır",
        ],
        correct: 0,
      },
      {
        q: "Metne göre bugünkü ılıman dönem ne olabilir?",
        options: [
          "Kalıcı bir iklim",
          "İki buzul çağı arasındaki bir ara dönem",
          "Bir buzul çağının başlangıcı",
          "İnsan yapımı bir dönem",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "empati-beyin",
    title: "Başkasının Yerine Geçmek",
    level: "Orta",
    text: `Bir arkadaşımızın canı yandığında yüzünü buruşturması, çoğu zaman bizde de hafif bir rahatsızlık uyandırır. Sanki acıyı bir nebze biz de hissederiz. Uzun süre bir sır gibi kalan bu deneyim, beyin araştırmalarıyla açıklanmaya başladı.

Bilim insanları, beynimizde "ayna nöronlar" adı verilen özel hücreler olduğunu keşfetti. Bu hücreler, biz bir hareketi yaptığımızda da, başkasının aynı hareketi yaptığını gördüğümüzde de etkinleşir. Yani beynimiz, başkasının deneyimini bir bakıma kendi içinde taklit eder. Bu mekanizma, empatinin biyolojik temellerinden biri sayılır.

Empati, yalnızca hoş bir duygu değil, aynı zamanda toplumsal yaşamın temel taşıdır. Başkalarının ne hissettiğini anlayabilmek, iş birliğini, yardımlaşmayı ve güveni mümkün kılar. Empati zayıfladığında, insanlar birbirinin acısına kayıtsız kalmaya başlar.

İyi haber şu ki empati sabit bir özellik değildir; geliştirilebilir. Farklı hayatları okumak, dinlemek ve kendimizi başkasının yerine koymaya çalışmak bu yeteneği güçlendirir. Empati kası, tıpkı diğer beceriler gibi, kullanıldıkça gelişir.`,
    questions: [
      {
        q: "Ayna nöronlar ne zaman etkinleşir?",
        options: [
          "Yalnızca biz bir hareket yaptığımızda",
          "Hem biz yaptığımızda hem de başkasının yaptığını gördüğümüzde",
          "Sadece uyurken",
          "Sadece acı çektiğimizde",
        ],
        correct: 1,
      },
      {
        q: "Metne göre empati neden toplumsal yaşamın temel taşıdır?",
        options: [
          "İnsanları yalnızlaştırdığı için",
          "İş birliğini, yardımlaşmayı ve güveni mümkün kıldığı için",
          "Rekabeti artırdığı için",
          "Duyguları bastırdığı için",
        ],
        correct: 1,
      },
      {
        q: "Metne göre empati hakkında 'iyi haber' nedir?",
        options: [
          "Doğuştan sabittir",
          "Geliştirilebilir bir yetenektir",
          "Herkeste aynıdır",
          "Yaşla azalır",
        ],
        correct: 1,
      },
      {
        q: "Empati nasıl güçlendirilebilir?",
        options: [
          "Kimseyle konuşmayarak",
          "Farklı hayatları okuyup kendini başkasının yerine koyarak",
          "Yalnız kalarak",
          "Duyguları görmezden gelerek",
        ],
        correct: 1,
      },
    ],
  },

  // ─────────────────── İLERİ (ek) ───────────────────
  {
    id: "entropi",
    title: "Zamanın Oku ve Düzensizlik",
    level: "İleri",
    text: `Fizik yasalarının çoğu, zaman ileri ya da geri aksa da aynı biçimde işler. Bir bilardo topunun çarpışmasını gösteren bir filmi tersten oynatsak, yine de fizik kurallarına uygun görünür. Peki neden gerçek hayatta zaman hep tek yönde akar? Kırılan bir bardağın kendiliğinden birleşip masaya geri sıçradığını asla görmeyiz.

Bu sorunun cevabı, termodinamiğin ikinci yasasında ve entropi kavramında saklıdır. Entropi, kabaca bir sistemdeki düzensizliğin ölçüsüdür. İkinci yasa, kapalı bir sistemde entropinin zamanla artma eğiliminde olduğunu söyler. Yani doğa, düzenli hâllerden düzensiz hâllere doğru kayar; bunun tersi kendiliğinden gerçekleşmez.

Bir bardağın kırılması entropiyi artırır: düzenli bir yapı, dağınık parçalara dönüşür. Parçaların kendiliğinden birleşmesi ise entropiyi azaltırdı ki bu, son derece olanaksızdır. İşte "zamanın oku" dediğimiz tek yönlü akış, aslında entropinin bu istatistiksel eğiliminden doğar. Geçmiş, geleceğe göre daha düşük entropili olduğu için geçmişi hatırlar, geleceği hatırlamayız.

Bu fikir şaşırtıcı bir sonuca götürür: zamanın yönü, temel bir fizik yasasından çok, olasılıkla ilgilidir. Düzenli düzenlemeler, düzensiz olanlara kıyasla sayıca çok azdır. Bu yüzden bir sistem, neredeyse her zaman daha olası olan düzensiz hâllere doğru evrilir. Zamanın akışını hissetmemiz, evrenin bu istatistiksel doğasının en derin yansımalarından biridir.`,
    questions: [
      {
        q: "Metne göre 'zamanın oku' hangi kavramla açıklanır?",
        options: [
          "Yerçekimi",
          "Entropi ve termodinamiğin ikinci yasası",
          "Işık hızı",
          "Manyetizma",
        ],
        correct: 1,
      },
      {
        q: "Entropi kabaca neyin ölçüsüdür?",
        options: [
          "Sıcaklığın",
          "Bir sistemdeki düzensizliğin",
          "Hızın",
          "Kütlenin",
        ],
        correct: 1,
      },
      {
        q: "Kırılan bir bardağın parçalarının kendiliğinden birleşmemesinin nedeni nedir?",
        options: [
          "Bu, entropiyi azaltırdı ve son derece olanaksızdır",
          "Yerçekimi buna izin vermez",
          "Cam çok serttir",
          "Enerji yetersizdir",
        ],
        correct: 0,
      },
      {
        q: "Metnin şaşırtıcı sonucu nedir?",
        options: [
          "Zaman geriye akabilir",
          "Zamanın yönü temel bir yasadan çok olasılıkla ilgilidir",
          "Entropi her zaman azalır",
          "Geçmiş ve gelecek aynıdır",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "dil-dusunce",
    title: "Dil Düşünceyi Biçimlendirir mi?",
    level: "İleri",
    text: `Konuştuğumuz dil, yalnızca düşüncelerimizi aktarmanın bir aracı mıdır, yoksa düşünme biçimimizi de şekillendirir mi? Bu soru, dilbilim ve psikoloji arasında uzun süredir tartışılıyor. Bir görüşe göre dil, zihnimizin üzerine giydiği nötr bir kılıftır. Karşıt görüş ise dilin, dünyayı algılayışımızı sessizce yönlendirdiğini savunur.

Bu ikinci görüşü destekleyen çarpıcı örnekler vardır. Bazı dillerde "sağ-sol" gibi göreli yön ifadeleri yerine yalnızca "kuzey-güney" gibi mutlak yönler kullanılır. Bu dilleri konuşan topluluklar, kapalı bir odada bile yön duygularını şaşırtıcı bir kesinlikle korur; çünkü dilleri onları sürekli yönlerini takip etmeye zorlar. Renk isimlerinin sayısı da benzer biçimde, insanların renk tonlarını ayırt etme hızını etkileyebilir.

Ancak bu, dilin düşünceyi tümüyle belirlediği anlamına gelmez. İnsanlar, dillerinde bir kelime bulunmayan kavramları da düşünebilir ve öğrenebilir. Dilin etkisi, bir hapishane değil, daha çok bir eğilimdir: belirli düşünce yollarını kolaylaştırır, başkalarını zorlaştırır. Dil, düşünceye set çekmez ama ona belli patikalar açar.

Bu tartışmanın önemi, soyut bir merakın ötesindedir. Eğer dil algıyı biçimlendiriyorsa, ikinci bir dil öğrenmek yalnızca yeni kelimeler kazanmak değil, dünyaya bakmanın yeni bir yolunu edinmek anlamına gelir. Her dil, gerçekliğin farklı bir yüzünü aydınlatan ayrı bir pencere gibidir.`,
    questions: [
      {
        q: "Metinde tartışılan temel soru nedir?",
        options: [
          "Hangi dilin daha zor olduğu",
          "Dilin düşünme biçimimizi şekillendirip şekillendirmediği",
          "Kaç dil öğrenilebileceği",
          "Dillerin nasıl doğduğu",
        ],
        correct: 1,
      },
      {
        q: "Mutlak yön ifadeleri kullanan dilleri konuşanlar hakkında ne söyleniyor?",
        options: [
          "Yön duygularını kolayca kaybederler",
          "Kapalı bir odada bile yönlerini şaşırtıcı kesinlikle korurlar",
          "Hiç yön kullanmazlar",
          "Sadece haritayla yön bulurlar",
        ],
        correct: 1,
      },
      {
        q: "Metne göre dilin düşünce üzerindeki etkisi nasıl tanımlanıyor?",
        options: [
          "Bir hapishane",
          "Bir eğilim — belli düşünce yollarını kolaylaştıran patikalar",
          "Tümüyle belirleyici bir güç",
          "Hiçbir etkisi olmayan bir kılıf",
        ],
        correct: 1,
      },
      {
        q: "Metne göre ikinci bir dil öğrenmek ne anlama gelir?",
        options: [
          "Sadece yeni kelimeler ezberlemek",
          "Dünyaya bakmanın yeni bir yolunu edinmek",
          "Ana dili unutmak",
          "Yön duygusunu kaybetmek",
        ],
        correct: 1,
      },
    ],
  },
  {
    id: "sunk-cost",
    title: "Batık Maliyet Yanılgısı",
    level: "İleri",
    text: `Sıkıcı bulduğunuz bir filmi, yalnızca bileti için para ödediğiniz gerekçesiyle sonuna kadar izlediğiniz oldu mu? Ya da keyif almadığınız bir kitabı, "yarısına geldim, bırakmak yazık olur" diyerek bitirdiniz mi? Bu davranışların ardında, insan zihninin en yaygın mantık hatalarından biri yatar: batık maliyet yanılgısı.

Batık maliyet, geri getirilemeyecek biçimde harcanmış zaman, para ya da emektir. Akılcı bir karar, yalnızca bundan sonra ne kazanacağımıza bakmalıdır; çünkü geçmişte harcanan şey, ne yaparsak yapalım geri gelmez. Ne var ki insanlar, harcadıkları emri "boşa gitmiş saymamak" için genellikle kötü bir işi sürdürme eğilimindedir. Böylece küçük bir kaybı büyütürler.

Bu yanılgı, günlük seçimlerden çok daha büyük kararlara kadar uzanır. Başarısız olacağı belli olan bir projeye şirketler, yalnızca daha önce çok yatırım yaptıkları için kaynak akıtmaya devam edebilir. Kişiler, mutsuz oldukları bir yolda "buraya kadar bunca yıl verdim" düşüncesiyle ilerleyebilir. Geçmişin ağırlığı, geleceğin muhakemesini gölgeler.

Bu tuzaktan kurtulmanın yolu, her kararı sıfırdan değerlendirmeyi öğrenmektir. Doğru soru "buraya kadar ne harcadım?" değil, "bundan sonra en iyi seçenek nedir?" olmalıdır. Geçmiş bir öğretmen olabilir; ama geleceği belirleyen bir zincir olmamalıdır. Aklın olgunluğu, kısmen, ne zaman vazgeçeceğini bilmekte yatar.`,
    questions: [
      {
        q: "Batık maliyet nedir?",
        options: [
          "Gelecekte kazanılacak para",
          "Geri getirilemeyecek biçimde harcanmış zaman, para ya da emek",
          "Bir yatırımın getirisi",
          "Beklenmedik bir kazanç",
        ],
        correct: 1,
      },
      {
        q: "Metne göre akılcı bir karar neye bakmalıdır?",
        options: [
          "Geçmişte ne harcandığına",
          "Yalnızca bundan sonra ne kazanılacağına",
          "Başkalarının ne düşündüğüne",
          "Harcanan emeğin büyüklüğüne",
        ],
        correct: 1,
      },
      {
        q: "İnsanlar neden kötü bir işi sürdürme eğilimindedir?",
        options: [
          "Daha çok kazanmak için",
          "Harcadıkları emeği 'boşa gitmiş saymamak' için",
          "Yeni fırsatları sevmedikleri için",
          "Zamanları bol olduğu için",
        ],
        correct: 1,
      },
      {
        q: "Metne göre bu tuzaktan kurtulmanın yolu nedir?",
        options: [
          "Her zaman başladığını bitirmek",
          "Her kararı sıfırdan, 'bundan sonra en iyi seçenek nedir?' diye değerlendirmek",
          "Hiç karar vermemek",
          "Geçmişi tamamen unutmak",
        ],
        correct: 1,
      },
    ],
  },
];
