// Blog yazıları — dosya tabanlı (DB yok). İçerik biçimi markdown-lite:
// "## " başlık, "- " liste, **kalın**, [metin](/link), boş satır = paragraf ayracı.

export type Post = {
  slug: string;
  title: string;
  description: string; // meta description (~150 karakter)
  category: string;
  date: string; // ISO
  content: string;
};

export const POSTS: Post[] = [
  {
    slug: "yks-koclugu-nedir-kime-gerekli",
    title: "YKS Koçluğu Nedir, Kime Gerekli? 2027 Rehberi",
    description:
      "YKS koçluğu ne işe yarar, kimler almalı, ücretleri ne kadar? Online YKS koçluğunun artıları ve doğru koç seçimi için kapsamlı rehber.",
    category: "YKS",
    date: "2026-07-10",
    content: `Üniversite sınavına hazırlanan her öğrencinin karşılaştığı ortak sorun aynıdır: konular belli, kaynaklar belli, ama **plan ve süreklilik** yok. YKS koçluğu tam bu noktada devreye girer.

## YKS koçluğu ne işe yarar?

YKS koçu, öğrencinin hedefini netleştiren, haftalık çalışma programını kişiye özel hazırlayan ve bu programın gerçekten uygulanıp uygulanmadığını takip eden kişidir. İyi bir koçluk sürecinde şunlar olur:

- Hedef üniversite ve bölüme göre **net hedefi** belirlenir
- Öğrencinin güçlü ve zayıf konuları deneme analizleriyle tespit edilir
- Haftalık program, okul ve kurs yoğunluğuna göre kişiselleştirilir
- Düzenli birebir görüşmelerle motivasyon ve hesap verebilirlik sağlanır

## Kimler YKS koçluğu almalı?

Koçluk herkes için şart değildir; ama şu profillerde fark yaratır: çalışıyorum ama netlerim artmıyor diyenler, ne çalışacağını bilemeyip sürekli kaynak değiştirenler, motivasyonu hızlı düşenler ve sınav kaygısı yaşayanlar. Özellikle 12. sınıf ve mezun öğrencilerde, kalan sürenin doğru yönetilmesi başlı başına puan kazandırır.

## Online koçluk yüz yüzeden farklı mı?

Araştırmalar ve saha tecrübesi aynı noktada birleşiyor: koçlukta belirleyici olan görüşmenin fiziksel olması değil, **takibin sürekliliği**. Online koçlukta haftalık görüntülü görüşmeye ek olarak günlük mesajlaşma, dijital program takibi ve anlık deneme analizi yapılabildiği için süreç çoğu zaman yüz yüzeden daha sıkı işler.

## Teknoloji desteği neden önemli?

Yeni nesil platformlarda koçun yanına yapay zeka da eklendi. [Rekor Zeka](/)'da deneme kitapçığının fotoğrafını yükleyen öğrencinin zayıf konuları yapay zekayla tespit edilir ve koç bu analizi tek tıkla haftalık programa dönüştürür. 7/24 çalışan [AI asistan](/paketler) ise gece yarısı takılınan soruyu adım adım çözer. Koç + yapay zeka birlikteliği, klasik koçluğun en zayıf yanı olan "görüşmeler arası boşluğu" kapatır.

## YKS koçluğu ücretleri ne kadar?

2026 itibarıyla piyasada aylık koçluk ücretleri 3.000-5.500 TL bandında seyrediyor. Uzun dönem (sınava kadar) paketlerde aylık maliyet belirgin şekilde düşer. Fiyat karşılaştırması yaparken sadece rakama değil, pakete nelerin dahil olduğuna bakın: görüşme sıklığı, mesajlaşma desteği, deneme analizi, veli bilgilendirmesi ve ek araçlar (hızlı okuma, AI desteği) paketten pakete ciddi fark gösterir. [Paketlerimizi buradan karşılaştırabilirsiniz](/paketler).

## Doğru koç nasıl seçilir?

- Koçun **kendi sınav başarısını** ve diplomasını doğrulayın
- İlk görüşmenin ücretsiz olduğu platformları tercih edin
- Koç değiştirme hakkı ve iade garantisi olup olmadığını sorun
- Öğrenciyle koç arasındaki iletişim uyumunu ilk haftalarda gözlemleyin

Doğru koç, doğru zamanlama ve doğru psikolojiyle rekor senin de elinde. [Ücretsiz ön görüşme planlayarak](/on-gorusme) hedefini birlikte netleştirebiliriz.`,
  },
  {
    slug: "tyt-net-artirma-yontemleri",
    title: "TYT Netleri Nasıl Artar? Kanıtlanmış 7 Yöntem",
    description:
      "TYT netlerinizi artırmanın kanıtlanmış 7 yolu: deneme analizi, konu eksiği kapatma, paragraf hızı, zaman yönetimi ve daha fazlası.",
    category: "TYT",
    date: "2026-07-08",
    content: `TYT'de net artırmak şans işi değildir; sistematik bir süreçtir. İşte sahada gerçekten işe yarayan 7 yöntem.

## 1. Her denemeyi analiz et, sadece sayma

Deneme sonucundaki toplam net tek başına bir şey söylemez. Asıl bilgi yanlışların dağılımındadır: hangi ders, hangi konu, hangi soru tipi? Her denemeden sonra yanlış ve boş soruları konu bazında işaretleyin. Bunu manuel yapmak saatler alır — [Rekor Zeka'nın Deneme AI Analizi](/paketler) kitapçık fotoğrafından zayıf konularınızı dakikalar içinde çıkarır.

## 2. Zayıf konuya "mikro plan" uygula

Analizde çıkan her zayıf konu için 3 adımlık mini plan yapın: konu tekrarı (1 gün), bol soru (2-3 gün), deneme içinde test (ilk fırsatta). Konuyu kapatmadan yenisine geçmeyin; yarım kalan konular sınavda en pahalı hatalardır.

## 3. Paragraf hızını bilinçli çalış

TYT Türkçe'nin yaklaşık yarısı paragraf sorusudur ve çoğu öğrencinin asıl sorunu bilgi değil **okuma hızıdır**. Dakikada 150 kelime okuyan bir öğrenci paragrafta boğulur; 300 kelimeye çıkan öğrenci aynı sürede iki kat soru görür. Takistoskop, blok okuma ve göz egzersizleriyle okuma hızı 4-8 haftada belirgin şekilde artırılabilir. [Hızlı okuma eğitimimiz](/hizli-okuma) tam bu iş için tasarlandı.

## 4. Süre yönetimini denemede prova et

Sınav süresi strateji ister: hangi derse kaç dakika, takılan soruya kaç saniye? Kuralı denemede oturtun: 40 saniyede çıkmayan soru işaretlenir ve geçilir. Tur bitince işaretlilere dönülür. Bu basit kural tek başına 3-5 net kazandırabilir.

## 5. Hata defterini dijitalleştir

Klasik hata defteri iyidir ama çoğu öğrenci ikinci haftada bırakır. Yanlışlarınızı platform üzerinde tutarsanız hem koçunuz görür hem de tekrar zamanı geldiğinde hatırlatma alırsınız. Gelişim grafiği, motivasyonun en somut yakıtıdır — [net takibi ve grafikler](/paketler) her denemeden sonra otomatik güncellenir.

## 6. Haftalık düzenli görüşme ve hesap verebilirlik

Tek başına çalışan öğrencinin en büyük düşmanı erteleme. Haftalık koç görüşmesi "bu hafta şunları bitirdim" diyeceğiniz bir hesap verme anı yaratır. Araştırmalar, düzenli takip edilen öğrencilerin programa uyma oranının 2-3 kat arttığını gösteriyor.

## 7. Kaygıyı yönetmeyi öğren

Bilip de yapamamak, TYT'nin en acı senaryosudur ve neredeyse her zaman kaygı kaynaklıdır. Nefes teknikleri, sınav simülasyonu ve gerekirse PDR uzmanıyla düzenli görüşme, netlere doğrudan yansır. Sınav kaygısı yazımızı da okuyun: [Sınav kaygısı nasıl yenilir?](/blog/sinav-kaygisi-nasil-yenilir)

Bu 7 yöntemi tek başına uygulamak mümkün — ama bir koç ve yapay zeka desteğiyle çok daha hızlı ilerler. [Ücretsiz ön görüşmeyle](/on-gorusme) mevcut seviyeni birlikte analiz edelim.`,
  },
  {
    slug: "lgs-koclugu-veli-rehberi",
    title: "LGS Koçluğu: Veliler İçin Kapsamlı Rehber",
    description:
      "LGS'ye hazırlanan çocuğunuza koçluk almalı mısınız? Veli gözünden LGS koçluğu, veli takip sistemi ve doğru platform seçimi rehberi.",
    category: "LGS",
    date: "2026-07-05",
    content: `LGS maratonunda en zor rol çoğu zaman velinindir: çocuğunuzun çalışıp çalışmadığını bilmiyorsunuz, sorduğunuzda gerginlik çıkıyor, karnedeki notlarla deneme sonuçları birbirini tutmuyor. LGS koçluğu, bu belirsizliği yönetilebilir bir sürece çevirir.

## LGS koçluğu çocuğunuza ne kazandırır?

- **Düzen:** Haftalık program, okul + kurs + dinlenme dengesini kurar
- **Takip:** Ödevler ve denemeler düzenli izlenir; aksama anında görülür
- **Motivasyon:** Ergenlik dönemindeki bir çocuk, ebeveyn yerine "abla/abi" rolündeki bir koçtan geri bildirimi çok daha kolay kabul eder
- **Strateji:** Yeni nesil sorular, paragraf hızı ve sınav taktikleri sistemli çalışılır

## Veli olarak sizin kazanımınız: şeffaflık

İyi bir koçluk platformunda veli, sürecin dışında değil yanındadır. [Rekor Zeka'nın Veli Takip Sistemi](/) ile çocuğunuzun izin vermesi hâlinde koçunu, ödev durumunu ve deneme gelişimini kendi panelinizden görürsünüz; düzenli veli görüşmeleriyle süreç hakkında bilgilendirilirsiniz. "Çalışıyor musun?" sorusunun yarattığı gerginlik yerini veriye bırakır.

## Doğru LGS koçluk platformu nasıl seçilir?

- Koçların **diploması ve sınav geçmişi doğrulanmış** mı?
- Veli bilgilendirmesi pakete dahil mi, ek ücretli mi?
- Deneme analizi nasıl yapılıyor — göz kararı mı, veriyle mi?
- İade garantisi ve koç değiştirme hakkı var mı?
- Paragraf hızı için ek araç (hızlı okuma eğitimi) sunuluyor mu?

## Fiyatlar ve paket mantığı

LGS koçluğunda aylık ücretler piyasada 3.000-5.000 TL civarındadır. Uzun dönem paketlerde aylık maliyet düşer; ayrıca iyi platformlar kullanılmayan ayları iade eder. [Paket karşılaştırma tablomuzda](/paketler) hangi pakete neyin dahil olduğunu net biçimde görebilirsiniz.

## Sık yapılan veli hataları

- Çocuğun her denemesini sorgulamak (baskı, neti düşürür)
- Programı veli olarak yazmaya çalışmak (uzmanlık ister)
- Sadece sonuca odaklanmak (süreç övülmezse motivasyon kalmaz)
- Koçla iletişimi çocuk üzerinden kurmak (doğrudan veli görüşmesi isteyin)

Çocuğunuzun hedefine giden yol, baskıyla değil doğru sistemle açılır. [Ücretsiz ön görüşmede](/on-gorusme) hem siz hem çocuğunuz koçumuzla tanışabilir, süreci birlikte planlayabilirsiniz.`,
  },
  {
    slug: "sinav-kaygisi-nasil-yenilir",
    title: "Sınav Kaygısı Nasıl Yenilir? PDR Uzmanı Yaklaşımı",
    description:
      "Sınav kaygısının belirtileri, nedenleri ve kanıta dayalı çözümleri: nefes teknikleri, sınav simülasyonu ve PDR desteği ile kaygıyı yönetin.",
    category: "PDR",
    date: "2026-07-01",
    content: `"Evde hepsini çözüyorum, sınavda aklım duruyor." Bu cümle, sınav kaygısının en klasik özetidir. İyi haber: sınav kaygısı kişilik özelliği değil, **yönetilebilir bir beceri eksikliğidir**.

## Sınav kaygısını nasıl tanırsınız?

Sınav öncesi uykusuzluk ve iştah değişimi, sınav anında kalp çarpıntısı ve ellerde terleme, okuduğunu anlayamama, basit soruda donup kalma ve sınav sonrası "aslında biliyordum" hissi... Bunların birkaçı bir aradaysa kaygı, performansınızdan net çalıyor demektir.

## Kaygının asıl kaynağı: felaket senaryoları

Kaygılı zihin sınavı bir değerlendirme değil, **kimlik yargılaması** olarak görür: "Kazanamazsam bittim." Bu düşünce bedeni alarma geçirir; alarm hâlindeki beyin ise ezber ve muhakeme işlevlerini kısar. Yani kaygı, bilgi eksikliği olmadan da neti düşürür.

## Kanıta dayalı 5 çözüm

## 1. Nefesle bedeni sakinleştir

4 saniye al, 4 tut, 6 ver. Günde iki kez 5'er dakika ve her deneme öncesi 1 dakika. Uzun verilen nefes, alarm sistemini fizyolojik olarak kapatır. Basit ama en tutarlı işe yarayan tekniktir.

## 2. Sınavı simüle et

Kaygı bilinmezlikten beslenir. Haftada bir denemeyi gerçek sınav koşullarında çözün: aynı saat, süre tutarak, telefon başka odada, molasız. Beyin "bunu daha önce yaşadım" dediğinde alarm seviyesi düşer.

## 3. Düşünceyi yeniden çerçevele

"Kazanamazsam bittim" yerine "Bu deneme, eksiklerimi gösteren bir araç". Kulağa basit gelir ama bilişsel yeniden çerçeveleme, sınav kaygısında en güçlü kanıta sahip tekniktir. Yazılı yapın: kaygılı düşünceyi sol sütuna, gerçekçi karşılığını sağ sütuna.

## 4. Kontrol edebildiğine odaklan

Sıralama, kontenjan, başkalarının neti — kontrolünüz dışında. Bugünkü çalışma saati, deneme analizi, uyku düzeni — kontrolünüzde. Programınızı kontrol edilebilirler üzerine kurun; [kişiye özel haftalık program](/paketler) tam olarak bunu yapar.

## 5. Profesyonel destek almaktan çekinme

Kaygı günlük işlevi bozuyorsa (uyku, iştah, derse oturamama) bir uzmanla çalışmak en hızlı çözümdür. [Rekor Zeka'da](/) süreç PDR uzmanları koordinasyonunda yürür; sınav kaygısı yönetimi, motivasyon görüşmeleri ve veli iletişimi koçluğun içindedir. Dilerseniz [PDR uzmanlarımızı buradan inceleyebilirsiniz](/koclar?tip=PDR).

Unutmayın: hedef kaygıyı sıfırlamak değil — onu, sizi çalıştıran ama sınavda susan bir seviyede tutmaktır. [Ücretsiz ön görüşmede](/on-gorusme) durumunuzu birlikte değerlendirelim.`,
  },
  {
    slug: "hizli-okuma-teknikleri-paragraf",
    title: "Hızlı Okuma Teknikleri: Paragraf Sorularında Zaman Kazan",
    description:
      "Takistoskop, blok okuma ve göz egzersizleriyle okuma hızınızı 2-3 katına çıkarın. TYT ve LGS paragraf sorularında zaman kazandıran teknikler.",
    category: "Hızlı Okuma",
    date: "2026-06-28",
    content: `TYT Türkçe'nin ve LGS sözelin en büyük zaman tuzağı paragraftır. Soruyu yapamayan öğrencilerin çoğu aslında **bilgiyi değil, süreyi** kaybediyor. Ortalama bir öğrenci dakikada 120-150 kelime okur; eğitilmiş bir okuyucu 300-400 kelimeye çıkar. Aradaki fark, sınavda 15-20 dakikaya denk gelir.

## Sizi yavaşlatan 3 alışkanlık

- **İç seslendirme:** Okuduğunuz her kelimeyi zihninizde "söylüyorsanız", hızınız konuşma hızıyla sınırlı kalır
- **Geri dönüşler:** Gözün emin olamayıp satır başına dönmesi — çoğu zaman gereksizdir
- **Kelime kelime okuma:** Eğitimsiz göz her kelimeye ayrı odaklanır; eğitimli göz 3-4 kelimelik blokları tek bakışta yakalar

## Teknik 1: Takistoskop (kelime flaşlama)

Ekranda kelimeler tek tek, ayarlanabilir hızda belirip kaybolur. Göz "seslendirmeye" vakit bulamadığı için iç ses devre dışı kalır. Hız kademeli artırıldığında beyin, kelimeyi sesten değil görüntüden tanımayı öğrenir. [Rekor Zeka'nın hızlı okuma modülünde](/hizli-okuma) takistoskop 100-700 kelime/dk aralığında çalışır.

## Teknik 2: Blok okuma

Metni kelime kelime değil, 2-4 kelimelik gruplar hâlinde okuma alıştırmasıdır. Vurgulanan blok bir bakışta kavranır; satır, sıçramalarla taranır. Paragraf sorusunda asıl hız artışını bu teknik sağlar çünkü bağlam korunur.

## Teknik 3: Gölgeleme (pacer)

Metin üzerinde sabit hızda kayan bir vurgu, gözünüzü ritmik ilerlemeye zorlar. Geri dönüş alışkanlığını kırmanın en etkili yoludur — vurgu geçtiyse dönemezsiniz.

## Teknik 4: Göz açısı egzersizleri (Schulte tablosu)

5x5 karışık sayı tablosunda, merkeze sabit bakarken sayıları sırayla bulursunuz. Çevresel görüş genişledikçe tek duraklamada görülen alan büyür; satır başına düşen göz duraklaması azalır.

## Hız her şey değil: anlama oranı

Hızlı okumanın altın kuralı: **hız × anlama = etkili hız**. Dakikada 400 kelime okuyup yarısını anlamak, 250 kelime okuyup tamamını anlamaktan kötüdür. Bu yüzden her hız testinde anlama soruları da çözülmeli, gelişim "etkili hız" üzerinden izlenmelidir. Modülümüzdeki hız testleri tam bu mantıkla ölçüm yapar ve gelişiminizi grafikle gösterir.

## Ne kadar sürede sonuç alınır?

Düzenli çalışan bir öğrencide (günde 10-15 dakika) ilk ölçülebilir artış 2 haftada, kalıcı 2-3 kat artış 6-8 haftada gelir. Önemli olan yoğunluk değil **süreklilik**tir.

Hızlı okuma eğitimimiz tüm koçluk paketlerine dahildir; dilerseniz [yalnızca hızlı okuma paketini](/hizli-okuma) da alabilirsiniz. Paragrafta kaybettiğin her dakika, çözemediğin bir soru demek — bugün başla.`,
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function readingTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(2, Math.round(words / 200));
}
