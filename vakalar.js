// Oyundaki bütün vakalar bu dosyada durur. Yeni vaka eklemek için bir vakayı
// kopyalayıp VAKALAR dizisinin sonuna ekleyin; oyun.js'e dokunmak gerekmez.
//
// Kaynak metinleri gerçek tarihî kaynakların ÖZETİDİR, birebir alıntı değildir.
// Her vakanın sonundaki "kaynakca" asıl kaynakların nerede bulunduğunu gösterir.

const VAKALAR = [
  {
    id: "kades",
    baslik: "İki Galipli Savaş",
    sinif: "5. sınıf",
    donem: "MÖ 13. yüzyıl · Hititler ve Mısır",
    giris:
      "Sana iki fotoğraf getirdim. Birinde Mısır'daki dev bir tapınak duvarı, " +
      "diğerinde Boğazköy'de bulunmuş kil bir tablet var. İkisi de aynı savaşı anlatıyor: " +
      "Kadeş. Ama ikisi de \"biz kazandık\" diyor. Gerçekte ne oldu, bul bakalım.",
    soru: "Kadeş Savaşı'nı gerçekten kim kazandı?",
    // olaylar: doğru zaman sırasıyla yazılır; oyun karıştırıp gösterir
    olaylar: [
      "II. Ramses ordusuyla Kadeş'e doğru yola çıkar",
      "Mısır ordusu yanlış bilgiyle pusuya düşer",
      "Ramses geri çekilir; Kadeş Hititlerde kalır",
      "Hattuşili ile Ramses barış antlaşması yapar"
    ],

    mekanlar: [
      {
        id: "siir",
        mekan: "Mısır tapınağı",
        simge: "🏛️",
        gorev: "kazi",
        gorevMetni: "Tapınak duvarını örten kumu temizle",
        kaynakAdi: "Kadeş Şiiri ve tapınak kabartmaları",
        metin:
          "Firavun II. Ramses savaşı tapınak duvarlarına yazdırıp resmettirdi. Bu anlatıya " +
          "göre Ramses, askerleri dağıldığında savaş arabasıyla tek başına düşmanın üzerine " +
          "yürüdü, Hititleri bozguna uğrattı ve büyük bir zafer kazandı.",
        sorular: [
          {
            soru: "Bu anlatıyı kim, ne amaçla yazdırmış?",
            secenekler: [
              "Tarafsız bir gezgin, merak ettiği için",
              "Firavunun kendisi, gücünü halkına göstermek için",
              "Hitit kralı, yenilgisini kabul etmek için"
            ],
            dogru: 1,
            aciklama: "Anlatı Ramses'in emriyle yazıldı. Bir hükümdarın kendi zaferini anlattığı metin tek taraflı olabilir."
          },
          {
            soru: "Bu kaynak tek başına \"Mısır kazandı\" demeye yeter mi?",
            secenekler: [
              "Yetmez; öbür tarafın ne dediğine ve savaştan sonra ne olduğuna da bakmak gerekir",
              "Yeter; taşa yazılan her şey doğrudur"
            ],
            dogru: 0,
            aciklama: "Birinci el kaynak olması, doğruyu söylediği anlamına gelmez. Başka kaynaklarla karşılaştırılmalıdır."
          }
        ]
      },
      {
        id: "bulten",
        mekan: "Mısır tapınağı, arka duvar",
        simge: "🔍",
        gorev: "fener",
        gorevMetni: "Kentin arkasına gizlenen Hitit birliklerini bul",
        gizli: ["🐎", "🛡️", "🏹"],
        kaynakAdi: "Mısır'ın savaş raporu (\"Bülten\")",
        metin:
          "Aynı tapınaklardaki ikinci bir metin savaşın başını anlatıyor: İki kişi Ramses'e " +
          "Hitit ordusunun çok uzakta olduğunu söyledi. Oysa Hitit ordusu Kadeş kentinin " +
          "arkasında gizleniyordu. Mısır ordusunun bir birliği ani saldırıyla dağıtıldı.",
        sorular: [
          {
            soru: "Bu metin bize ne gösteriyor?",
            secenekler: [
              "Mısır ordusunun hiç zorlanmadığını",
              "Hititlerin savaşa hiç gelmediğini",
              "Mısır ordusunun yanlış bilgiyle pusuya düşürüldüğünü"
            ],
            dogru: 2,
            aciklama: "Mısır'ın kendi metni bile ordunun pusuya düştüğünü kabul ediyor."
          },
          {
            soru: "Bu ayrıntı neden değerli bir kanıttır?",
            secenekler: [
              "Çünkü bir taraf kendi aleyhine olan bir şeyi yazmışsa, bu büyük olasılıkla doğrudur",
              "Çünkü çok uzun bir metin",
              "Değerli değil; Mısır kaynaklarının hiçbirine güvenilmez"
            ],
            dogru: 0,
            aciklama: "Tarihçiler, bir kaynağın kendi tarafını kötü gösteren ayrıntılarına özellikle dikkat eder."
          }
        ]
      },
      {
        id: "hitit",
        mekan: "Hattuşa arşivi",
        simge: "🧱",
        gorev: "yapboz",
        gorevMetni: "Kırılmış tabletin parçalarını birleştir",
        kaynakAdi: "Hitit tabletleri",
        metin:
          "Hitit başkenti Hattuşa'da (Boğazköy) bulunan tabletlere göre Ramses yenildi ve " +
          "geri çekildi. Savaştan sonra Kadeş kenti ile Amurru ülkesi Hititlerin elinde " +
          "kaldı; Hitit ordusu daha güneye, Şam yöresine kadar ilerledi.",
        sorular: [
          {
            soru: "Hitit tabletleri ile Mısır yazıtlarının ortak yönü nedir?",
            secenekler: [
              "İkisi de savaşı kaybettiğini söylüyor",
              "İkisi de kendi tarafını galip gösteriyor",
              "İkisi de savaştan hiç söz etmiyor"
            ],
            dogru: 1,
            aciklama: "İki taraf da zaferi kendine yazmış. Bu yüzden ikisine de sorgulayarak bakmak gerekir."
          },
          {
            soru: "Tabletlerdeki hangi bilgi başka yollarla sınanabilir?",
            secenekler: [
              "Hitit kralının çok cesur olduğu",
              "Tanrıların Hititleri sevdiği",
              "Savaştan sonra Kadeş kentinin kimin elinde kaldığı"
            ],
            dogru: 2,
            aciklama: "Bir kentin kimde kaldığı somut bir sonuçtur. Mısır, uğruna savaştığı Kadeş'i alamadı."
          }
        ]
      },
      {
        id: "antlasma",
        mekan: "İstanbul Arkeoloji Müzeleri",
        simge: "🤝",
        gorev: "cevir",
        nesne: "tablet",
        gorevMetni: "Tableti çevir, arkasındaki müze mührünü bul",
        kaynakAdi: "Kadeş Antlaşması tableti",
        metin:
          "Savaştan yaklaşık on beş yıl sonra Hitit kralı III. Hattuşili ile II. Ramses bir " +
          "barış antlaşması yaptı. Metinde iki hükümdar da \"büyük kral\" diye anılıyor; " +
          "birbirlerine saldırmamaya ve gerektiğinde yardım etmeye söz veriyorlar.",
        sorular: [
          {
            soru: "Antlaşmada iki taraf nasıl görünüyor?",
            secenekler: [
              "Eşit iki güç olarak",
              "Mısır galip, Hititler yenik olarak",
              "Hititler galip, Mısır yenik olarak"
            ],
            dogru: 0,
            aciklama: "İki taraf da \"büyük kral\" olarak anılıyor ve yükümlülükler karşılıklı. Bu, eşitler arası bir antlaşmadır."
          },
          {
            soru: "Bu antlaşma, \"bir taraf ezici zafer kazandı\" iddiası için ne söyler?",
            secenekler: [
              "İddiayı güçlendirir",
              "İddiayı zayıflatır; ezici bir galip olsaydı eşit şartlı antlaşma yapılmazdı",
              "Bir şey söylemez"
            ],
            dogru: 1,
            aciklama: "Eşit şartlı barış, iki tarafın da ötekini yenemediğini düşündürür."
          }
        ]
      }
    ],

    aciklamalar: [
      {
        metin: "Mısır ezici bir zafer kazandı; Ramses Hititleri tek başına bozguna uğrattı.",
        dogru: false,
        ipucu: "Bu açıklama yalnızca Ramses'in kendi yazdırdığı anlatıya dayanıyor. Savaştan sonra Kadeş kimin elinde kaldı?"
      },
      {
        metin: "Hititler Mısır'ı tamamen yendi ve Mısır'ı ele geçirdi.",
        dogru: false,
        ipucu: "Hiçbir kaynak Mısır'ın ele geçirildiğini söylemiyor. İki devlet sonradan nasıl bir antlaşma yapmıştı?"
      },
      {
        metin: "Kesin bir galip olmadı: Mısır pusuya düştü ve Kadeş'i alamadı, ama yok da edilmedi; iki devlet sonunda eşit şartlarda barış yaptı.",
        dogru: true,
        kanitlar: ["bulten", "hitit", "antlasma"]
      }
    ],

    sonuc:
      "Güzel iş! İki hükümdar da kendi halkına \"kazandım\" dedi. Sen " +
      "ise söylenene değil, sonuca baktın: kent kimde kaldı, barış nasıl yapıldı? " +
      "Tarihçilerin çoğu bugün Kadeş'i kesin galibi olmayan bir savaş sayar.",
    kaynakca: [
      "Kadeş Antlaşması tableti: İstanbul Arkeoloji Müzeleri, Eski Şark Eserleri Müzesi",
      "Mısır metinleri (\"Şiir\" ve \"Bülten\"): Abu Simbel, Karnak, Luksor, Ramesseum ve Abydos tapınakları",
      "Hitit tabletleri: Boğazköy (Hattuşa) arşivi"
    ]
  },

  {
    id: "gokturk",
    baslik: "Kağanlığın Çöküşü",
    sinif: "6. sınıf",
    donem: "630 · I. Göktürk Kağanlığı",
    giris:
      "Bu kez sana bir taş yazıtın kopyasını getirdim. Göktürkler koca bir bozkır " +
      "imparatorluğu kurmuştu. Ama 630 yılında Doğu Göktürk Kağanlığı yıkıldı ve Türkler " +
      "elli yıl Çin'e bağlı yaşadı. Böyle güçlü bir devlet nasıl çöktü?",
    soru: "Doğu Göktürk Kağanlığı 630'da neden yıkıldı?",
    olaylar: [
      "Bizans elçisi Zemarkhos güçlü Göktürk otağını ziyaret eder",
      "Ağır kış sürüleri öldürür, boylar ayaklanır",
      "Tang ordusu baskın yapar, İl Kağan esir düşer",
      "Bilge Kağan, Kül Tigin Yazıtı'nı diktirir"
    ],

    mekanlar: [
      {
        id: "yazit",
        mekan: "Orhun Vadisi",
        simge: "🗿",
        gorev: "kazi",
        gorevMetni: "Yazıtın üzerindeki tozu ve yosunu temizle",
        kaynakAdi: "Kül Tigin Yazıtı",
        metin:
          "732'de dikilen yazıtta Bilge Kağan milletine sesleniyor. Ona göre Çin, tatlı sözü " +
          "ve yumuşak ipeğiyle Türkleri kandırdı; kardeşleri, beylerle halkı birbirine " +
          "düşürdü. Beyler ile millet arasında uyum kalmayınca Türkler devletini yitirdi, " +
          "beyler Çin adları aldı ve elli yıl Çin kağanına hizmet etti.",
        sorular: [
          {
            soru: "Bu yazıt yıkılıştan ne kadar sonra yazılmış?",
            secenekler: [
              "Aynı yıl",
              "Yaklaşık yüz yıl sonra",
              "Bin yıl sonra"
            ],
            dogru: 1,
            aciklama: "Devlet 630'da yıkıldı, yazıt 732'de dikildi. Bilge Kağan olayları kendisi görmedi; atalarından kalan anlatıyı aktarıyor."
          },
          {
            soru: "Bilge Kağan bunları neden taşa yazdırmış olabilir?",
            secenekler: [
              "Yalnızca süs olsun diye",
              "Çinlilere teşekkür etmek için",
              "Milletini aynı hataya düşmemesi için uyarmak amacıyla"
            ],
            dogru: 2,
            aciklama: "Yazıt bir öğüt ve uyarıdır. Türklerin olayı nasıl yorumladığını gösterir; amacı olan bir metin olduğu unutulmamalıdır."
          }
        ]
      },
      {
        id: "yillik",
        mekan: "Çin saray arşivi",
        simge: "❄️",
        gorev: "fener",
        gorevMetni: "Tipide kaybolan sürüleri bul",
        gizli: ["🐎", "🐑", "🐪"],
        kaynakAdi: "Tang yıllıkları: kış ve isyanlar",
        metin:
          "Çin saray kayıtlarından derlenen yıllıklara göre 627'de bozkıra çok ağır bir kar " +
          "yağdı, sürüler öldü ve kıtlık başladı. İl Kağan kaybını kapatmak için bağlı " +
          "boylardan at istedi; boylar ayaklandı. Türk beyleri de kağanın yabancı " +
          "danışmanlara güvenmesinden rahatsızdı.",
        sorular: [
          {
            soru: "Hayvancılıkla geçinen bir toplum için sürülerin ölmesi ne demektir?",
            secenekler: [
              "Yiyeceğin, zenginliğin ve ordunun atlarının yok olması",
              "Önemsiz bir kayıp",
              "Daha çok tarım yapılması"
            ],
            dogru: 0,
            aciklama: "Bozkırda hayvan hem besin hem servet hem de savaş gücüdür. Sürüler ölünce devlet de zayıflar."
          },
          {
            soru: "Bu kaynağı kullanırken neye dikkat etmeliyiz?",
            secenekler: [
              "Hiçbir şeye; Çin kaynakları her zaman tarafsızdır",
              "Göktürklerin rakibi olan Çin'in kayıtları olduğuna; yine de kış ve isyan gibi somut olayları anlatıyor",
              "Tamamen uydurma olduğuna"
            ],
            dogru: 1,
            aciklama: "Rakibin yazdığı kaynak taraflı olabilir. Ama anlattıkları Türk yazıtındaki \"uyumsuzluk\" ile örtüşüyorsa güçlenir."
          }
        ]
      },
      {
        id: "sefer",
        mekan: "Çin sınır karargâhı",
        simge: "⚔️",
        gorev: "yapboz",
        gorevMetni: "Yırtılmış sefer haritasını birleştir",
        kaynakAdi: "Tang ordusunun sefer kaydı",
        metin:
          "Yıllıklara göre Tang imparatoru, Göktürklerin zayıfladığını görünce 629-630'da " +
          "ordu gönderdi. Komutan Li Jing ani bir baskın yaptı. İl Kağan 630'da yakalanıp " +
          "Çin başkentine götürüldü.",
        sorular: [
          {
            soru: "Çin ordusu neden tam bu yıllarda saldırdı?",
            secenekler: [
              "Göktürkler en güçlü dönemindeydi",
              "Tamamen rastlantı",
              "Kıtlık ve isyanlar Göktürkleri zayıflatmıştı"
            ],
            dogru: 2,
            aciklama: "Saldırı, kış felaketinden ve isyanlardan hemen sonra geldi. Çin zayıflık anını bekledi."
          },
          {
            soru: "Bu baskın yıkılışın tek nedeni sayılabilir mi?",
            secenekler: [
              "Sayılamaz; baskın son darbedir, devleti asıl zayıflatan önceki olaylardır",
              "Sayılır; başka hiçbir şeyin etkisi yoktur"
            ],
            dogru: 0,
            aciklama: "Büyük olayların çoğu tek nedenle açıklanmaz. Son olay ile onu hazırlayan nedenleri ayırmak gerekir."
          }
        ]
      },
      {
        id: "elci",
        mekan: "Bizans elçiliği",
        simge: "👑",
        gorev: "cevir",
        nesne: "tomar",
        gorevMetni: "Elçinin tomarını çevir, arkasındaki mührü bul",
        kaynakAdi: "Elçi Zemarkhos'un anlattıkları",
        metin:
          "568'de Göktürklere gelen Bizans elçisi Zemarkhos, İstemi Yabgu'nun otağını anlatır: " +
          "ipek kumaşlarla süslü çadırlar, altın taht, altın ve gümüş kaplar. Elçi büyük bir " +
          "zenginlik ve güçle karşılaştığını bildirir.",
        sorular: [
          {
            soru: "Bu kaynak hangi zamanı ve yeri anlatıyor?",
            secenekler: [
              "630 yılını, Doğu Göktürk Kağanlığı'nı",
              "568 yılını, devletin batı kanadını",
              "732 yılını, Orhun Vadisi'ni"
            ],
            dogru: 1,
            aciklama: "Elçi, yıkılıştan altmış yıl kadar önce ve devletin batı kanadında bulunmuş."
          },
          {
            soru: "Bu kaynak vakamız için ne kadar işe yarar?",
            secenekler: [
              "Çok; yıkılışın nedenini doğrudan açıklıyor",
              "Hiç güvenilmez; elçi yalan söylüyor",
              "Güvenilir bir görgü tanığı, ama başka bir zamanı anlattığı için bu soruya kanıt olmaz"
            ],
            dogru: 2,
            aciklama: "Bir kaynak güvenilir olabilir ama sorduğumuz soruyla ilgisiz olabilir. Kaynağın zamanı ve yeri soruya uymalıdır."
          }
        ]
      }
    ],

    aciklamalar: [
      {
        metin: "Ağır kış ve kıtlık, boyların isyanı ve içteki uyumsuzluk devleti zayıflattı; Çin bu durumdan yararlanıp son darbeyi vurdu.",
        dogru: true,
        kanitlar: ["yazit", "yillik", "sefer"]
      },
      {
        metin: "Göktürkler zenginlik ve gösteriş içinde yaşadıkları için yıkıldılar.",
        dogru: false,
        ipucu: "Bu açıklama elçinin anlattıklarına dayanıyor. Elçi hangi yılda ve devletin hangi kanadında bulunmuştu?"
      },
      {
        metin: "Yalnızca tek bir savaşı kaybettikleri için yıkıldılar; öncesinde hiçbir sorun yoktu.",
        dogru: false,
        ipucu: "Baskından önceki yıllarda bozkırda neler olmuştu? Kaynaklara yeniden bak."
      }
    ],

    sonuc:
      "Raporunu dikkatle okudum. Türk yazıtı \"uyumsuzluk ve Çin'in oyunları\" diyor, " +
      "Çin yıllıkları \"kış, kıtlık ve isyan\" diyor. İki rakibin kaynağı aynı tabloyu farklı " +
      "yönlerden gösteriyor. İkisini birleştirdiğin için açıklaman sağlam.",
    kaynakca: [
      "Kül Tigin ve Bilge Kağan yazıtları, Orhun Vadisi (Moğolistan); Türkçesi: Muharrem Ergin, Orhun Abideleri",
      "Eski Tang Kitabı (Jiu Tang Shu) ve Zizhi Tongjian",
      "Menandros Protektor'un tarihinden parçalar (Zemarkhos elçiliği)"
    ]
  },

  {
    id: "malazgirt",
    baslik: "Malazgirt Ovası'nda Bir Gün",
    sinif: "6. sınıf",
    donem: "1071 · Büyük Selçuklu ve Bizans",
    giris:
      "Şu haritaya bak: 26 Ağustos 1071, Malazgirt. İmparator Romanos " +
      "Diogenes büyük bir orduyla geldi, karşısında Sultan Alp Arslan vardı. Akşam " +
      "olduğunda imparator esirdi. Kalabalık bir ordu bir günde nasıl dağıldı?",
    soru: "Bizans ordusu Malazgirt'te neden yenildi?",
    olaylar: [
      "Bizans ordusunun bir bölümü Ahlat'a gönderilir",
      "Paralı Uz askerleri Selçuklu tarafına geçer",
      "Selçuklular geri çekilir gibi yapıp Bizans birliklerini üzerine çeker",
      "Artçı birlikler çekilir, imparator esir düşer"
    ],

    mekanlar: [
      {
        id: "attaleiates",
        mekan: "Bizans ordugâhı",
        simge: "⛺",
        gorev: "cevir",
        nesne: "kitap",
        nesneRenk: "#6b2d2d",
        gorevMetni: "Eski el yazmasını çevir, arkasındaki mührü bul",
        kaynakAdi: "Attaleiates'in Tarihi",
        metin:
          "Ordu kadısı olarak seferde bulunan Mikhael Attaleiates şunları anlatır: Ordunun " +
          "büyük bir bölümü önceden Ahlat'a gönderilmişti ve savaşa dönmedi. Paralı Uz " +
          "askerlerinin bir kısmı Selçuklu tarafına geçti. Akşama doğru imparator kampa " +
          "dönüş emri verince uzaktaki birlikler onun yenildiğini sandı. Artçı komutanı " +
          "Andronikos Dukas imparatoru korumak yerine askerlerini alıp çekildi. İmparator " +
          "savaşmayı sürdürdü, yaralandı ve esir düştü.",
        sorular: [
          {
            soru: "Attaleiates bu olayları nereden biliyor?",
            secenekler: [
              "Seferde ordunun içindeydi; görgü tanığı",
              "Yüzyıllar sonra kitaplardan okudu",
              "Selçuklu ordusundaydı"
            ],
            dogru: 0,
            aciklama: "Attaleiates sefere katıldı. Olayları yakından gören bir Bizanslının anlatımıdır."
          },
          {
            soru: "Yenilen tarafın bir görevlisi kendi ordusundaki ihaneti ve dağınıklığı yazıyorsa, bu nasıl bir kanıttır?",
            secenekler: [
              "Zayıf; kimse kendi tarafını kötülemez",
              "Güçlü; kendi tarafının aleyhine olan şeyi uydurması için bir nedeni yoktur",
              "Değersiz; Bizanslıların yazdığı hiçbir şeye güvenilmez"
            ],
            dogru: 1,
            aciklama: "Bir kaynak kendi tarafının kusurlarını anlatıyorsa buna özellikle değer verilir. Yine de yazarın imparatora yakın olduğu akılda tutulmalıdır."
          }
        ]
      },
      {
        id: "bryennios",
        mekan: "Savaş alanı",
        simge: "🏹",
        gorev: "fener",
        gorevMetni: "Pusuya yatmış atlı okçuları bul",
        gizli: ["🏹", "🐎", "🏹"],
        kaynakAdi: "Bryennios'un anlatımı",
        metin:
          "Dedesi savaşta Bizans ordusunun bir kanadına komuta eden Nikephoros Bryennios " +
          "şunları yazar: Türkler ordularını bölüklere ayırıp pusular kurdu. Geri çekilir " +
          "gibi yaptılar; peşlerine düşen Bizans birlikleri ok yağmuruna tutuldu ve çevrildi.",
        sorular: [
          {
            soru: "Bryennios savaşı nereden öğrenmiş olabilir?",
            secenekler: [
              "Kendisi savaştı",
              "Selçuklu sarayında dinledi",
              "Savaşa katılan dedesinden ve ailesinden"
            ],
            dogru: 2,
            aciklama: "Bryennios savaştan sonra doğdu; bilgisi savaşa katılan aile büyüklerine dayanır. Görgü tanığına yakın bir ikinci el kaynaktır."
          },
          {
            soru: "Anlatılan savaş yöntemi nedir?",
            secenekler: [
              "Sahte geri çekilme ve pusu: düşmanı peşine takıp çevirmek",
              "Kale kuşatması",
              "Deniz savaşı"
            ],
            dogru: 0,
            aciklama: "Bu, bozkır halklarının iyi bilinen savaş yöntemidir. Ağır Bizans birlikleri hızlı atlı okçuların peşinde düzenini yitirdi."
          }
        ]
      },
      {
        id: "ibnulesir",
        mekan: "Selçuklu tarihi",
        simge: "📚",
        gorev: "yapboz",
        gorevMetni: "Dağılmış sayfaları yerine koy",
        kaynakAdi: "İbnü'l-Esîr'in tarihi",
        metin:
          "Savaştan yaklaşık yüz elli yıl sonra yazan İbnü'l-Esîr şunları aktarır: Sultan " +
          "cuma günü askerleriyle namaz kılıp dua etti, beyaz giysiler giydi ve ölürse " +
          "bunların kefeni olacağını söyledi. Yazar, Bizans ordusunu yüz binlerle ifade " +
          "eder. Günümüz tarihçileri ise bu ordunun kırk bin dolayında olduğunu düşünür.",
        sorular: [
          {
            soru: "Bu kaynak ne tür bir kaynaktır?",
            secenekler: [
              "Görgü tanığı anlatımı",
              "Olaydan çok sonra, eski anlatılara dayanarak yazılmış ikinci el kaynak",
              "Savaş sırasında tutulmuş resmî kayıt"
            ],
            dogru: 1,
            aciklama: "İbnü'l-Esîr savaşı görmedi; kendinden önceki yazarlardan derledi."
          },
          {
            soru: "Kaynaktaki çok yüksek asker sayıları için ne düşünmeliyiz?",
            secenekler: [
              "Kesin doğrudur",
              "Kaynağın tamamı yalandır",
              "Zaferi büyük göstermek için abartılmış olabilir; başka kaynaklarla karşılaştırılmalıdır"
            ],
            dogru: 2,
            aciklama: "Eski kaynaklarda sayılar sık sık abartılır. Kaynak yine de zaferin Müslümanlarca nasıl hatırlandığını gösterir."
          }
        ]
      }
    ],

    aciklamalar: [
      {
        metin: "Selçuklu ordusu sayıca çok daha kalabalıktı.",
        dogru: false,
        ipucu: "Kaynaklar hangi ordunun daha kalabalık olduğunu söylüyor? Sayı üstünlüğü kimdeydi?"
      },
      {
        metin: "Bizans ordusu bölünmüş ve birliğini yitirmişti: paralı askerler saf değiştirdi, artçı komutanı çekildi. Selçuklular da sahte geri çekilme ve pusu ile bu dağınıklığı değerlendirdi.",
        dogru: true,
        kanitlar: ["attaleiates", "bryennios"]
      },
      {
        metin: "İmparator savaş başlamadan kaçtığı için ordu dağıldı.",
        dogru: false,
        ipucu: "Görgü tanığı Attaleiates, imparatorun esir düşene kadar ne yaptığını yazıyordu?"
      }
    ],

    sonuc:
      "Gördüğün gibi kalabalık olmak yetmez. Bir yanda birliği bozulmuş bir ordu, " +
      "öbür yanda iyi uygulanmış bir savaş planı vardı. Bunu iki ayrı Bizans kaynağından " +
      "çıkardın; yenilen tarafın kendi anlatımı çoğu zaman en güçlü kanıttır.",
    kaynakca: [
      "Mikhael Attaleiates, Tarih",
      "Nikephoros Bryennios, Tarihin Özü",
      "İbnü'l-Esîr, el-Kâmil fi't-Târîh"
    ]
  },

  {
    id: "canakkale",
    baslik: "Boğaz'da Görünmeyen Hat",
    sinif: "8. sınıf",
    donem: "18 Mart 1915 · Çanakkale",
    giris:
      "Şu eski deniz haritasına bak. 18 Mart 1915: İtilaf donanması Çanakkale " +
      "Boğazı'nı geçmek için saldırdı. Öğleden sonra Bouvet, Irresistible ve Ocean adlı " +
      "üç zırhlı battı. O gün amiral bile neye uğradığını anlamadı. Sen anlayabilir misin?",
    soru: "18 Mart 1915'te üç zırhlı neden battı?",
    olaylar: [
      "Osmanlı gözcüleri gemilerin Karanlık Liman'da döndüğünü fark eder",
      "Nusret gece gizlice 26 mayın döker",
      "İtilaf donanması Boğaz'a saldırır",
      "Bouvet mayına çarpıp batar; ardından iki zırhlı daha batar"
    ],

    mekanlar: [
      {
        id: "derobeck",
        mekan: "İngiliz amiral gemisi",
        simge: "🚢",
        gorev: "yapboz",
        gorevMetni: "Amiralin yırtılmış telgrafını birleştir",
        kaynakAdi: "Amiral de Robeck'in ilk değerlendirmesi",
        metin:
          "Donanmaya komuta eden Amiral de Robeck, Bouvet'in batışını gördü ama nedenini " +
          "çözemedi. İlk düşüncesi geminin cephaneliğinden vurulduğu, akıntıya bırakılmış " +
          "serseri bir mayına çarptığı ya da kıyıdan torpillendiği yönündeydi.",
        sorular: [
          {
            soru: "De Robeck olayı kendi gözüyle gördü. Bu, açıklamasının doğru olduğunu gösterir mi?",
            secenekler: [
              "Göstermez; görgü tanığı ne olduğunu görür ama nedenini yanlış yorumlayabilir",
              "Gösterir; görgü tanığı asla yanılmaz"
            ],
            dogru: 0,
            aciklama: "Amiral geminin battığını gördü, ama suyun altındakini göremedi. Görmek ile nedenini bilmek ayrı şeylerdir."
          },
          {
            soru: "Amiralin üç ayrı olasılık sayması bize ne anlatır?",
            secenekler: [
              "Nedenden emin olduğunu",
              "Olayı hiç görmediğini",
              "O anda gerçek nedeni bilmediğini; tahmin yürüttüğünü"
            ],
            dogru: 2,
            aciklama: "Birden çok olasılık saymak belirsizliği gösterir. Bu kaynak bir kanıt değil, bir tahmindir."
          }
        ]
      },
      {
        id: "nusret",
        mekan: "Çanakkale Müstahkem Mevki",
        simge: "⚓",
        gorev: "cevir",
        nesne: "kitap",
        nesneRenk: "#1f3557",
        gorevMetni: "Görev defterini çevir, arkasındaki mührü bul",
        kaynakAdi: "Nusret Mayın Gemisi'nin görev kayıtları",
        metin:
          "Osmanlı gözcüleri, İtilaf gemilerinin Erenköy Koyu'ndaki Karanlık Liman'da " +
          "manevra yaparak geri döndüğünü fark etmişti. Nusret Mayın Gemisi 7 Mart'ı " +
          "8 Mart'a bağlayan gece gizlice buraya geldi ve kıyıya paralel bir hat hâlinde " +
          "26 mayın döktü.",
        sorular: [
          {
            soru: "Mayınların yeri nasıl seçilmiş?",
            secenekler: [
              "Rastgele",
              "Düşman gemilerinin manevra yaptığı yer gözlemlenerek",
              "İtilaf donanmasının isteğiyle"
            ],
            dogru: 1,
            aciklama: "Yer, günler süren gözleme dayanıyordu: gemiler hep aynı koyda dönüyordu."
          },
          {
            soru: "Bu kayıt de Robeck'in bilmediği hangi bilgiyi veriyor?",
            secenekler: [
              "Koyda on gün önce dökülmüş sabit bir mayın hattı olduğunu",
              "Gemilerin kaç topu olduğunu",
              "Havanın nasıl olduğunu"
            ],
            dogru: 0,
            aciklama: "Mayınlar serseri değildi; önceden dökülmüş, yerinde duran bir hattı. Bunu ancak döken taraf bilebilirdi."
          }
        ]
      },
      {
        id: "tarama",
        mekan: "İtilaf mayın tarama filosu",
        simge: "🧭",
        gorev: "fener",
        gorevMetni: "Temiz sanılan koyda kalan mayınları bul",
        gizli: ["💣", "💣", "💣"],
        kaynakAdi: "Mayın tarama ve keşif kayıtları",
        metin:
          "İtilaf donanması Erenköy Koyu'nu mayından temizlenmiş sayıyordu. Tarama " +
          "tekneleri temiz sanılan bölgede üç mayın bulup yok etti, ama bu bilgi amirale " +
          "ulaştırılmadı. Havadan yapılan keşif de Nusret'in hattını göremedi.",
        sorular: [
          {
            soru: "Bu kayıt bize ne gösteriyor?",
            secenekler: [
              "Koyda mayın bulunmadığını",
              "İtilaf donanmasının koydaki mayın hattından habersiz olduğunu",
              "Amiralin her şeyi bildiğini"
            ],
            dogru: 1,
            aciklama: "Donanma koyu temiz sanarak içine girdi. Tehlikenin işareti vardı ama komutana ulaşmadı."
          },
          {
            soru: "Bu kayıt Nusret'in kayıtlarıyla birlikte okununca ne olur?",
            secenekler: [
              "İkisi birbirini çürütür",
              "İkisi de önemsizleşir",
              "İki rakip tarafın kaynakları birbirini doğrular"
            ],
            dogru: 2,
            aciklama: "Osmanlı kaydı \"mayın döktük\", İtilaf kaydı \"temiz sandığımız yerde mayın çıktı\" diyor. Karşı tarafların örtüşen kayıtları güçlü kanıttır."
          }
        ]
      },
      {
        id: "topcu",
        mekan: "Kıyı tabyaları",
        simge: "💥",
        gorev: "kazi",
        gorevMetni: "Hasar raporunun isini temizle",
        kaynakAdi: "Savaş günü hasar kayıtları",
        metin:
          "Kıyı tabyalarının ve bataryaların ateşi gün boyu sürdü. Gaulois, Suffren ve " +
          "Agamemnon gibi gemiler top isabetleriyle hasar gördü. Batan üç zırhlının üçü de " +
          "Erenköy Koyu'nda mayına çarptı; yara alıp sürüklenen gemiler top ateşi altında kaldı.",
        sorular: [
          {
            soru: "Kayıtlara göre batan üç geminin ortak noktası nedir?",
            secenekler: [
              "Üçü de aynı koyda mayına çarptı",
              "Üçü de yalnızca top ateşiyle battı",
              "Üçü de fırtınada battı"
            ],
            dogru: 0,
            aciklama: "Üç gemi de Erenköy Koyu'nda, Nusret'in mayın döktüğü yerde yara aldı."
          },
          {
            soru: "Topçu ateşinin o günkü rolü neydi?",
            secenekler: [
              "Hiçbir etkisi olmadı",
              "Gemilere hasar verdi, mayın tarayıcıları engelledi ve yaralı gemilerin kurtarılmasını zorlaştırdı",
              "Mayınları patlattı"
            ],
            dogru: 1,
            aciklama: "Zafer tek bir nedene bağlanamaz: mayın hattı ile kıyı savunması birlikte çalıştı."
          }
        ]
      }
    ],

    aciklamalar: [
      {
        metin: "Gemiler, akıntıya bırakılmış serseri mayınlara ya da kıyıdan atılan torpidolara denk geldi.",
        dogru: false,
        ipucu: "Bu, amiralin o günkü tahminiydi. Mayınların ne zaman ve nereye döküldüğünü hangi kaynak söylüyordu?"
      },
      {
        metin: "Gemiler bir fırtına yüzünden kayalara çarptı.",
        dogru: false,
        ipucu: "Kaynakların hiçbirinde fırtınadan ya da kayalardan söz ediliyor mu?"
      },
      {
        metin: "Gemiler, Nusret'in gizlice döktüğü ve İtilaf donanmasının fark etmediği mayın hattına çarptı; kıyı toplarının ateşi de hasarı artırdı.",
        dogru: true,
        kanitlar: ["nusret", "tarama", "topcu"]
      }
    ],

    sonuc:
      "İşte o koy! Amiral olayı gördü ama nedenini bilemedi. Sen " +
      "iki karşı tarafın kayıtlarını yan yana koydun ve görünmeyen hattı buldun. Bir " +
      "tanığın gördüğü ile olayın nedeni her zaman aynı şey değildir.",
    kaynakca: [
      "Nusret Mayın Gemisi'nin görev kayıtları ve Çanakkale Müstahkem Mevki Komutanlığı raporları",
      "Amiral de Robeck'in 18 Mart 1915 sonrası İngiliz Amiralliğine raporları",
      "İngiliz resmî deniz tarihi: Julian Corbett, Naval Operations, 2. cilt"
    ]
  }
];
