const SORU_PUANI = 10;
const SIRA_PUANI = 20;
const ACIKLAMA_PUANI = 30;
const KANIT_PUANI = 20;
const DENEME_CEZASI = 10;
const GEREKLI_KANIT = 2;
const IGNE_YERLERI = {
  3: [[20, 62], [50, 40], [80, 64]],
  4: [[14, 62], [38, 38], [62, 66], [86, 40]]
};
const KONFETI_RENKLERI = ["#d4a23a", "#a4432a", "#2f7d4f", "#2f6fb0", "#f4ead5"];
const NOTALAR = {
  tik: [520],
  dogru: [523, 784],
  yanlis: [196, 147],
  bul: [659, 880, 1047],
  zafer: [523, 659, 784, 1047]
};

const ekran = document.getElementById("ekran");
const puanKutusu = document.getElementById("puan");
const unvanKutusu = document.getElementById("unvan");
const sesDugmesi = document.getElementById("ses");
const konfetiTuvali = document.getElementById("konfeti");

let durum;
let zamanlayicilar = [];
let yeniZamanlayicilar = [];
let kurulacaklar = [];   // ekran sayfaya yerleşince çalışacak 3B kurulumlar; her biri kendi durdurucusunu döndürür
let temizleyiciler = []; // ekrandan çıkarken çalışacak durdurucular
let sesAcik = true;
let sesBaglami = null;

function yeniOyun() {
  durum = { oyuncu: "", vakaNo: 0, tamamlanan: {}, puan: 0, kayit: [] };
  vakayiSifirla();
  baslangicEkrani();
}

function vakayiSifirla() {
  durum.incelenen = {};
  durum.raporDenemesi = 0;
  durum.siraDenemesi = 0;
  durum.siraTamam = false;
}

function vaka() {
  return VAKALAR[durum.vakaNo];
}

// ---------- yardımcılar ----------

function el(etiket, sinif, metin) {
  const e = document.createElement(etiket);
  if (sinif) e.className = sinif;
  if (metin !== undefined) e.textContent = metin;
  return e;
}

function dugme(metin, tikla, sinif) {
  const d = el("button", sinif || "dugme", metin);
  d.type = "button";
  d.addEventListener("click", tikla);
  return d;
}

function goster(...ogeler) {
  // Yeni ekranın öğeleri goster çağrılmadan önce kurulur; yalnızca önceki ekranın sayaçları durdurulur.
  zamanlayicilar.forEach(clearInterval);
  zamanlayicilar = yeniZamanlayicilar;
  yeniZamanlayicilar = [];
  temizleyiciler.forEach((f) => f());
  temizleyiciler = [];
  ekran.replaceChildren(...ogeler);
  kurulacaklar.forEach((kur) => temizleyiciler.push(kur()));
  kurulacaklar = [];
  ekran.classList.remove("gir");
  void ekran.offsetWidth; // giriş animasyonunu yeniden başlatır
  ekran.classList.add("gir");
  window.scrollTo(0, 0);
  ustBilgiyiGuncelle();
}

// Küçük resimler ve WebGL'siz cihazlar SVG çizimi, ötekiler 3B sahneyi kullanır.
// igneler: sahnenin üstüne yerleşecek harita düğmeleri.
function sahne(id, sinif, igneler) {
  const s = el("div", "sahne" + (sinif ? " " + sinif : ""));
  if (Diorama.destek && sinif !== "kucuk") {
    s.classList.add("uc-boyut");
    kurulacaklar.push(() => Diorama.sahne(s, id, igneler));
  } else {
    s.innerHTML = SAHNELER[id];
    (igneler || []).forEach((igne, i) => {
      igne.style.left = IGNE_YERLERI[igneler.length][i][0] + "%";
      igne.style.top = IGNE_YERLERI[igneler.length][i][1] + "%";
    });
  }
  if (igneler) s.append(...igneler);
  return s;
}

function mudur(metin) {
  const kap = el("div", "mudur");
  const yuz = el("div", "mudur-yuz");
  yuz.innerHTML = MUDUR_SVG;
  const balon = el("div", "balon");
  const yazi = el("span", "balon-yazi");
  // Görünmeyen tam metin balonun boyunu baştan belirler; yazı üstüne daktilo gibi gelir.
  balon.append(el("span", "balon-hayalet", metin), yazi);
  let i = 0;
  const z = setInterval(() => {
    i += 2;
    yazi.textContent = metin.slice(0, i);
    if (i >= metin.length) clearInterval(z);
  }, 18);
  yeniZamanlayicilar.push(z);
  balon.addEventListener("click", () => {
    clearInterval(z);
    yazi.textContent = metin;
  });
  kap.append(yuz, balon);
  return kap;
}

function cal(tur) {
  if (!sesAcik) return;
  const Baglam = window.AudioContext || window.webkitAudioContext;
  if (!Baglam) return;
  sesBaglami = sesBaglami || new Baglam();
  NOTALAR[tur].forEach((frekans, i) => {
    const o = sesBaglami.createOscillator();
    const g = sesBaglami.createGain();
    const t = sesBaglami.currentTime + i * 0.11;
    o.type = tur === "yanlis" ? "sawtooth" : "triangle";
    o.frequency.value = frekans;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.26);
    o.connect(g).connect(sesBaglami.destination);
    o.start(t);
    o.stop(t + 0.3);
  });
}

function konfeti() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = konfetiTuvali.getContext("2d");
  const g = (konfetiTuvali.width = window.innerWidth);
  const y = (konfetiTuvali.height = window.innerHeight);
  const parcalar = Array.from({ length: 130 }, (_, i) => ({
    x: Math.random() * g,
    y: -20 - Math.random() * y * 0.6,
    vx: (Math.random() - 0.5) * 3,
    vy: 2.5 + Math.random() * 4,
    boy: 5 + Math.random() * 6,
    aci: Math.random() * 6,
    renk: KONFETI_RENKLERI[i % KONFETI_RENKLERI.length]
  }));
  const bas = performance.now();
  (function ciz(simdi) {
    c.clearRect(0, 0, g, y);
    if (simdi - bas > 3200) return;
    parcalar.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.aci += 0.12;
      c.save();
      c.translate(p.x, p.y);
      c.rotate(p.aci);
      c.fillStyle = p.renk;
      c.fillRect(-p.boy / 2, -p.boy / 4, p.boy, p.boy / 2);
      c.restore();
    });
    requestAnimationFrame(ciz);
  })(bas);
}

function vakaEnYuksekPuan(v) {
  const soruSayisi = v.mekanlar.reduce((t, m) => t + m.sorular.length, 0);
  return soruSayisi * SORU_PUANI + SIRA_PUANI + ACIKLAMA_PUANI + KANIT_PUANI;
}

function toplamEnYuksekPuan() {
  return VAKALAR.reduce((t, v) => t + vakaEnYuksekPuan(v), 0);
}

function unvan() {
  const oran = durum.puan / toplamEnYuksekPuan();
  if (oran >= 0.8) return "Usta Tarihçi";
  if (oran >= 0.5) return "Kalfa Tarihçi";
  return "Çırak Tarihçi";
}

function ustBilgiyiGuncelle() {
  puanKutusu.textContent = durum.puan + " puan";
  unvanKutusu.textContent = unvan();
}

function puanEkle(miktar) {
  durum.puan += miktar;
  ustBilgiyiGuncelle();
  const arti = el("span", "arti", "+" + miktar);
  arti.addEventListener("animationend", () => arti.remove());
  puanKutusu.parentElement.append(arti);
}

function kaydet(adim, secim, dogru) {
  durum.kayit.push({ vaka: vaka().baslik, adim, secim, dogru: dogru ? "evet" : "hayır" });
}

function salla(oge) {
  oge.classList.remove("salla");
  void oge.offsetWidth;
  oge.classList.add("salla");
}

// ---------- ekranlar ----------

function baslangicEkrani() {
  const kod = el("input", "girdi");
  kod.type = "text";
  kod.maxLength = 30;
  kod.placeholder = "Örnek: 6A-12";

  goster(
    sahne("muze"),
    el("h1", "buyuk-baslik", "Tarih Dedektifi"),
    mudur(
      "Hoş geldin çırak! Masamda çözülmemiş dosyalar birikti. Her dosyada kaynakları " +
      "bulacak, sorgulayacak ve kanıta dayalı bir rapor yazacaksın. Hazır mısın?"
    ),
    el("p", "not", "Dosyalardaki kaynak metinleri gerçek tarihî kaynakların özetidir."),
    el("p", "etiket", "Oyuncu kodu (isteğe bağlı)"),
    kod,
    dugme("Başla", () => {
      durum.oyuncu = kod.value.trim();
      cal("dogru");
      menuEkrani();
    })
  );
}

function menuEkrani() {
  const liste = el("div", "dosyalar");
  VAKALAR.forEach((v, i) => {
    const bitti = Boolean(durum.tamamlanan[v.id]);
    const d = dugme("", () => {
      durum.vakaNo = i;
      vakayiSifirla();
      girisEkrani();
    }, "dosya" + (bitti ? " bitti" : ""));
    d.disabled = bitti;
    const yazi = el("span", "dosya-yazi");
    yazi.append(el("span", "dosya-ad", v.baslik), el("span", "dosya-bilgi", v.sinif + " · " + v.donem));
    d.append(sahne(v.id, "kucuk"), yazi);
    if (bitti) d.append(el("span", "muhur kucuk-muhur", "ÇÖZÜLDÜ"));
    liste.append(d);
  });

  const sonuclar = dugme("Sonuçları gör", bitisEkrani, "dugme ikincil");
  sonuclar.disabled = durum.kayit.length === 0;

  goster(
    el("h1", null, "Dosyalar"),
    el("p", "anlati", "Çözmek istediğin dosyayı seç."),
    liste,
    sonuclar
  );
}

function girisEkrani() {
  const v = vaka();
  goster(
    sahne(v.id),
    el("p", "etiket", v.donem),
    el("h1", null, v.baslik),
    mudur(v.giris),
    el("p", "vaka-sorusu", v.soru),
    dugme("Dosyayı aç", haritaEkrani)
  );
}

function haritaEkrani() {
  const v = vaka();
  const igneler = v.mekanlar.map((m) => {
    const bitti = durum.incelenen[m.id];
    const igne = dugme("", () => (bitti ? kaynakEkrani(m, 0) : gorevEkrani(m)), "igne" + (bitti ? " bitti" : ""));
    igne.append(el("span", "igne-simge", bitti ? "✓" : m.simge), el("span", "igne-ad", m.mekan));
    return igne;
  });
  const harita = sahne(v.id, "harita", igneler);

  const incelenen = v.mekanlar.filter((m) => durum.incelenen[m.id]).length;
  const hepsiTamam = incelenen === v.mekanlar.length;
  const cubuk = el("div", "ilerleme");
  const dolgu = el("div", "ilerleme-dolgu");
  dolgu.style.width = (incelenen / v.mekanlar.length) * 100 + "%";
  cubuk.append(dolgu);

  const ileri = durum.siraTamam
    ? dugme("Raporu yaz", raporEkrani)
    : dugme("Olayları sırala", siralamaEkrani);
  ileri.disabled = !hepsiTamam;

  goster(
    el("p", "vaka-sorusu", v.soru),
    harita,
    el("p", "etiket", "Bulunan kaynak: " + incelenen + " / " + v.mekanlar.length),
    cubuk,
    el("p", "anlati", hepsiTamam
      ? "Bütün kaynakları buldun. Şimdi olayları sıraya koy."
      : "Haritadaki bir yere git ve kaynağı ortaya çıkar."),
    ileri,
    dugme("Dosyalara dön", menuEkrani, "dugme ikincil")
  );
}

function gorevEkrani(m) {
  const v = vaka();
  const kap = el("div", "gorev-kap");
  const alt = el("div", "geri-bildirim");
  goster(
    el("p", "etiket", m.mekan + " · görev"),
    el("h2", null, m.gorev === "cevir" && !Diorama.destek ? "Kaynağın üzerindeki tozu sil" : m.gorevMetni),
    kap,
    alt,
    dugme("Haritaya dön", haritaEkrani, "dugme ikincil")
  );
  const gorev = m.gorev === "cevir" && !Diorama.destek ? "kazi" : m.gorev;
  const ayar = { sahne: SAHNELER[v.id], gizli: m.gizli, baslik: m.kaynakAdi, simge: m.simge, nesne: m.nesne, nesneRenk: m.nesneRenk };
  GOREVLER[gorev](kap, ayar, () => {
    cal("bul");
    alt.append(
      el("p", "iyi", "Kaynak bulundu: " + m.kaynakAdi),
      dugme("Kaynağı incele", () => kaynakEkrani(m, 0))
    );
  });
}

function kaynakKarti(m) {
  const kart = el("div", "kaynak");
  const bas = el("div", "kaynak-bas");
  const yazi = el("div");
  yazi.append(el("p", "etiket", m.mekan + " · kaynak özeti"), el("h2", null, m.kaynakAdi));
  bas.append(el("span", "kaynak-simge", m.simge), yazi);
  kart.append(bas, el("p", "kaynak-metin", m.metin));
  return kart;
}

function kaynakEkrani(m, soruNo) {
  if (soruNo >= m.sorular.length) {
    durum.incelenen[m.id] = true;
    haritaEkrani();
    return;
  }

  const s = m.sorular[soruNo];
  const tekrar = durum.incelenen[m.id]; // daha önce incelenmiş kaynak yeniden puan vermez
  const secenekler = el("div", "secenekler harfli");
  const geriBildirim = el("div", "geri-bildirim");

  s.secenekler.forEach((metin, i) => {
    const d = dugme(metin, () => {
      const dogru = i === s.dogru;
      secenekler.querySelectorAll("button").forEach((b, j) => {
        b.disabled = true;
        if (j === s.dogru) b.classList.add("dogru");
      });
      if (!dogru) {
        d.classList.add("yanlis");
        salla(d);
      }
      cal(dogru ? "dogru" : "yanlis");
      if (!tekrar) {
        if (dogru) puanEkle(SORU_PUANI);
        kaydet(m.kaynakAdi + " – " + s.soru, metin, dogru);
      }
      geriBildirim.append(
        el("p", dogru ? "iyi" : "kotu", dogru ? "Doğru!" : "Tam değil."),
        el("p", null, s.aciklama),
        dugme(soruNo + 1 < m.sorular.length ? "Sonraki soru" : "Haritaya dön", () => kaynakEkrani(m, soruNo + 1))
      );
    }, "secenek");
    secenekler.append(d);
  });

  goster(
    kaynakKarti(m),
    el("p", "etiket", "Kaynağı sorgula " + (soruNo + 1) + " / " + m.sorular.length),
    el("p", "soru", s.soru),
    secenekler,
    geriBildirim
  );
}

function siralamaEkrani() {
  const v = vaka();
  const kap = el("div");
  const uyari = el("div", "geri-bildirim");
  const kontrol = dugme("Sırayı kontrol et", () => {
    const sira = liste.sira();
    const dogru = sira.every((no, i) => no === i);
    kaydet("Olay sıralama (deneme " + (durum.siraDenemesi + 1) + ")", sira.map((no) => no + 1).join("-"), dogru);
    uyari.replaceChildren();
    liste.isaretle();
    if (!dogru) {
      durum.siraDenemesi++;
      cal("yanlis");
      salla(kap);
      uyari.append(el("p", "kotu", "Bazı olaylar yerinde değil."), el("p", null, "Yeşil olanlar doğru yerde. Ötekileri yeniden sırala."));
      return;
    }
    durum.siraTamam = true;
    liste.kilitle();
    kontrol.disabled = true;
    cal("dogru");
    puanEkle(durum.siraDenemesi === 0 ? SIRA_PUANI : SIRA_PUANI / 2);
    uyari.append(el("p", "iyi", "Zaman şeridi tamam!"), dugme("Raporu yaz", raporEkrani));
  });

  goster(
    el("p", "etiket", "Zaman şeridi"),
    el("h2", null, "Olayları en eskiden en yeniye doğru sırala"),
    el("p", "not", "Kartları tutup yukarı ya da aşağı sürükle."),
    kap,
    kontrol,
    uyari,
    dugme("Haritaya dön", haritaEkrani, "dugme ikincil")
  );
  const liste = siralamaListesi(kap, v.olaylar);
}

function raporEkrani() {
  const v = vaka();
  let secilenAciklama = null;
  const secilenKanitlar = new Set();

  const aciklamaKutusu = el("div", "secenekler");
  v.aciklamalar.forEach((a, i) => {
    const d = dugme(a.metin, () => {
      secilenAciklama = i;
      aciklamaKutusu.querySelectorAll("button").forEach((b) => b.classList.remove("secili"));
      d.classList.add("secili");
      cal("tik");
    }, "secenek");
    aciklamaKutusu.append(d);
  });

  const kanitKutusu = el("div", "kanitlar");
  v.mekanlar.forEach((m) => {
    const d = dugme("", () => {
      if (secilenKanitlar.has(m.id)) {
        secilenKanitlar.delete(m.id);
        d.classList.remove("secili");
      } else if (secilenKanitlar.size < GEREKLI_KANIT) {
        secilenKanitlar.add(m.id);
        d.classList.add("secili");
        cal("tik");
      }
    }, "kanit");
    d.append(el("span", "kanit-simge", m.simge), el("span", null, m.kaynakAdi));
    kanitKutusu.append(d);
  });

  const uyari = el("div", "geri-bildirim");

  const teslim = dugme("Raporu teslim et", () => {
    uyari.replaceChildren();
    if (secilenAciklama === null || secilenKanitlar.size < GEREKLI_KANIT) {
      uyari.append(el("p", "kotu", "Bir açıklama ve " + GEREKLI_KANIT + " kanıt seçmelisin."));
      return;
    }
    const a = v.aciklamalar[secilenAciklama];
    const kanitlar = [...secilenKanitlar];
    const kanitTamam = a.dogru && kanitlar.every((k) => a.kanitlar.includes(k));
    kaydet("Rapor (deneme " + (durum.raporDenemesi + 1) + ")", a.metin + " | kanıt: " + kanitlar.join(", "), kanitTamam);

    if (!kanitTamam) {
      durum.raporDenemesi++;
      cal("yanlis");
      salla(teslim);
      if (!a.dogru) {
        uyari.append(el("p", "kotu", "Müdür raporu geri verdi."), el("p", null, a.ipucu));
      } else {
        uyari.append(
          el("p", "kotu", "Açıklaman akla yatkın, ama kanıtların onu desteklemiyor."),
          el("p", null, "Seçtiğin her kaynak açıklamanın bir parçasını göstermeli. Hangi kaynak bu soruya kanıt olmuyordu?")
        );
      }
      return;
    }
    const ceza = durum.raporDenemesi * DENEME_CEZASI;
    puanEkle(Math.max(ACIKLAMA_PUANI + KANIT_PUANI - ceza, DENEME_CEZASI));
    durum.tamamlanan[v.id] = true;
    sonucEkrani();
  });

  goster(
    el("h1", null, "Rapor"),
    el("p", "vaka-sorusu", v.soru),
    el("p", "etiket", "1. Açıklamanı seç"),
    aciklamaKutusu,
    el("p", "etiket", "2. Açıklamanı destekleyen " + GEREKLI_KANIT + " kanıtı seç"),
    kanitKutusu,
    teslim,
    uyari,
    dugme("Kaynaklara geri dön", haritaEkrani, "dugme ikincil")
  );
}

function sonucEkrani() {
  const v = vaka();
  const hepsiBitti = VAKALAR.every((x) => durum.tamamlanan[x.id]);
  const kaynakca = el("ul", "kaynakca");
  v.kaynakca.forEach((k) => kaynakca.append(el("li", null, k)));
  const ust = sahne(v.id);
  ust.append(el("span", "muhur", "ÇÖZÜLDÜ"));

  goster(
    ust,
    el("p", "etiket", "Dosya kapandı"),
    el("h1", null, v.baslik),
    mudur(v.sonuc),
    el("p", "etiket", "Gerçek kaynaklar"),
    kaynakca,
    dugme(hepsiBitti ? "Sonuçları gör" : "Dosyalara dön", hepsiBitti ? bitisEkrani : menuEkrani)
  );
  cal("zafer");
  konfeti();
}

function bitisEkrani() {
  const tablo = el("table", "kayit");
  const baslik = el("tr");
  ["Vaka", "Adım", "Seçim", "Doğru"].forEach((b) => baslik.append(el("th", null, b)));
  tablo.append(baslik);
  durum.kayit.forEach((k) => {
    const satir = el("tr");
    [k.vaka, k.adim, k.secim, k.dogru].forEach((h) => satir.append(el("td", null, h)));
    tablo.append(satir);
  });
  const tabloKabi = el("div", "tablo-kabi");
  tabloKabi.append(tablo);

  const hepsiBitti = VAKALAR.every((x) => durum.tamamlanan[x.id]);
  const madalya = el("div", "madalya");
  madalya.append(el("span", "madalya-simge", "🏅"), el("span", "madalya-unvan", unvan()));

  const ogeler = [
    el("p", "etiket", hepsiBitti ? "Bütün dosyalar kapandı" : "Şu ana kadarki sonuçlar"),
    madalya,
    el("p", "anlati orta", "Toplam puanın: " + durum.puan + " / " + toplamEnYuksekPuan()),
    dugme("Sonuçları indir (CSV)", csvIndir)
  ];
  if (!hepsiBitti) ogeler.push(dugme("Dosyalara dön", menuEkrani, "dugme ikincil"));
  ogeler.push(dugme("Yeni oyuncu ile baştan başla", yeniOyun, "dugme ikincil"), el("h2", null, "Seçimlerin"), tabloKabi);
  goster(...ogeler);
  if (hepsiBitti) konfeti();
}

function csvIndir() {
  const hucre = (h) => '"' + String(h).replace(/"/g, '""') + '"';
  const satirlar = [["Oyuncu", "Vaka", "Adım", "Seçim", "Doğru"]]
    .concat(durum.kayit.map((k) => [durum.oyuncu, k.vaka, k.adim, k.secim, k.dogru]))
    .map((s) => s.map(hucre).join(";"));
  satirlar.push([durum.oyuncu, "Toplam puan", durum.puan, toplamEnYuksekPuan(), ""].map(hucre).join(";"));
  // BOM, Excel'in Türkçe karakterleri doğru göstermesi için
  const dosya = new Blob(["﻿" + satirlar.join("\r\n")], { type: "text/csv;charset=utf-8" });
  const baglanti = document.createElement("a");
  baglanti.href = URL.createObjectURL(dosya);
  baglanti.download = "tarih-dedektifi-" + (durum.oyuncu || "sonuc") + ".csv";
  baglanti.click();
  URL.revokeObjectURL(baglanti.href);
}

sesDugmesi.addEventListener("click", () => {
  sesAcik = !sesAcik;
  sesDugmesi.textContent = sesAcik ? "🔊" : "🔇";
  sesDugmesi.setAttribute("aria-pressed", String(!sesAcik));
});

yeniOyun();
