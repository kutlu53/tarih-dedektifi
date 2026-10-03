// Mini görevler. Her görev (kap, ayar, bitince) alır: kap içine kendini çizer,
// oyuncu görevi tamamlayınca bitince() çağırır. kap, çağrıldığında sayfada olmalıdır.

const KAZI_ESIGI = 0.55;
const KAZI_FIRCA = 30;
const GIZLI_YERLER = [[20, 72], [52, 58], [82, 70], [36, 86]];

function karistir(dizi) {
  const d = dizi.slice();
  do {
    for (let i = d.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [d[i], d[j]] = [d[j], d[i]];
    }
  } while (d.every((x, i) => x === dizi[i]));
  return d;
}

// Sürükleme boyunca pencereyi dinler; öğe DOM'da yer değiştirse de olaylar kaçmaz.
function surukle(hareket, birak) {
  const bitir = (e) => {
    window.removeEventListener("pointermove", hareket);
    window.removeEventListener("pointerup", bitir);
    window.removeEventListener("pointercancel", bitir);
    birak(e);
  };
  window.addEventListener("pointermove", hareket);
  window.addEventListener("pointerup", bitir);
  window.addEventListener("pointercancel", bitir);
}

const GOREVLER = {
  // Kaynağın üzerindeki tozu silerek ortaya çıkar.
  kazi(kap, ayar, bitince) {
    const alan = el("div", "kazi");
    const alt = el("div", "kazi-alt");
    alt.append(el("span", "kazi-simge", ayar.simge), el("span", "kazi-ad", ayar.baslik));
    const tuval = document.createElement("canvas");
    tuval.className = "kazi-tuval";
    const cubuk = el("div", "ilerleme");
    const dolgu = el("div", "ilerleme-dolgu");
    cubuk.append(dolgu);
    alan.append(alt, tuval);
    kap.append(alan, cubuk, el("p", "not", "Parmağınla ya da fareyle sürterek tozu temizle."));

    const kutu = alan.getBoundingClientRect();
    tuval.width = Math.round(kutu.width);
    tuval.height = Math.round(kutu.height);
    const c = tuval.getContext("2d");
    const kum = c.createLinearGradient(0, 0, tuval.width, tuval.height);
    kum.addColorStop(0, "#d8b77c");
    kum.addColorStop(1, "#b08a4f");
    c.fillStyle = kum;
    c.fillRect(0, 0, tuval.width, tuval.height);
    for (let i = 0; i < 900; i++) {
      c.fillStyle = i % 2 ? "rgba(90,60,20,0.25)" : "rgba(255,240,200,0.3)";
      c.fillRect(Math.random() * tuval.width, Math.random() * tuval.height, 2, 2);
    }
    c.globalCompositeOperation = "destination-out";
    c.lineWidth = KAZI_FIRCA * 2;
    c.lineCap = "round";
    c.lineJoin = "round";

    let bitti = false;
    let hamle = 0;

    function temizlenenOran() {
      const veri = c.getImageData(0, 0, tuval.width, tuval.height).data;
      let bos = 0;
      let toplam = 0;
      for (let y = 6; y < tuval.height; y += 12) {
        for (let x = 6; x < tuval.width; x += 12) {
          toplam++;
          if (veri[(y * tuval.width + x) * 4 + 3] < 40) bos++;
        }
      }
      return bos / toplam;
    }

    function denetle() {
      const oran = temizlenenOran();
      dolgu.style.width = Math.min(100, Math.round((oran / KAZI_ESIGI) * 100)) + "%";
      if (oran >= KAZI_ESIGI && !bitti) {
        bitti = true;
        tuval.classList.add("silindi");
        bitince();
      }
    }

    tuval.addEventListener("pointerdown", (e) => {
      if (bitti) return;
      e.preventDefault();
      const k = tuval.getBoundingClientRect();
      let x = e.clientX - k.left;
      let y = e.clientY - k.top;
      c.beginPath();
      c.arc(x, y, KAZI_FIRCA, 0, Math.PI * 2);
      c.fill();
      surukle((h) => {
        const nx = h.clientX - k.left;
        const ny = h.clientY - k.top;
        c.beginPath();
        c.moveTo(x, y);
        c.lineTo(nx, ny);
        c.stroke();
        x = nx;
        y = ny;
        if (++hamle % 8 === 0) denetle();
      }, denetle);
    });
  },

  // Karışmış parçaları sürükleyerek ya da sırayla dokunarak yerine koy.
  yapboz(kap, ayar, bitince) {
    const SUTUN = 3;
    const SATIR = 2;
    const izgara = el("div", "yapboz");
    const resim = 'url("data:image/svg+xml,' + encodeURIComponent(ayar.sahne) + '")';
    const konum = karistir([...Array(SUTUN * SATIR).keys()]);
    const yuvalar = konum.map((_, i) => {
      const y = el("div", "parca");
      y.style.backgroundImage = resim;
      y.dataset.yuva = i;
      izgara.append(y);
      return y;
    });
    let secili = null;
    let bitti = false;

    function ciz() {
      yuvalar.forEach((y, i) => {
        const p = konum[i];
        y.style.backgroundPosition =
          ((p % SUTUN) * 100) / (SUTUN - 1) + "% " + (Math.floor(p / SUTUN) * 100) / (SATIR - 1) + "%";
      });
    }

    function degistir(a, b) {
      [konum[a], konum[b]] = [konum[b], konum[a]];
      ciz();
      cal("tik");
      if (konum.every((p, i) => p === i)) {
        bitti = true;
        izgara.classList.add("tamam");
        bitince();
      }
    }

    izgara.addEventListener("pointerdown", (e) => {
      const y = e.target.closest(".parca");
      if (!y || bitti) return;
      e.preventDefault();
      const a = Number(y.dataset.yuva);
      const bx = e.clientX;
      const by = e.clientY;
      let tasindi = false;
      y.classList.add("tasiniyor");

      surukle((h) => {
        const dx = h.clientX - bx;
        const dy = h.clientY - by;
        if (Math.abs(dx) + Math.abs(dy) > 6) tasindi = true;
        y.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.06)";
      }, (h) => {
        y.classList.remove("tasiniyor");
        y.style.transform = "";
        if (tasindi) {
          y.style.pointerEvents = "none";
          const alttaki = document.elementFromPoint(h.clientX, h.clientY);
          y.style.pointerEvents = "";
          const hedef = alttaki && alttaki.closest(".parca");
          if (hedef && hedef !== y && izgara.contains(hedef)) degistir(a, Number(hedef.dataset.yuva));
        } else if (secili === null) {
          secili = a;
          y.classList.add("secili");
        } else {
          yuvalar[secili].classList.remove("secili");
          if (secili !== a) degistir(secili, a);
          secili = null;
        }
      });
    });

    ciz();
    kap.append(izgara, el("p", "not", "Parçaları sürükleyerek ya da iki parçaya sırayla dokunarak yer değiştir."));
  },

  // 3B nesneyi sürükleyerek çevir, arkasındaki müze mührünü bul.
  cevir(kap, ayar, bitince) {
    const vitrin = el("div", "vitrin");
    const cubuk = el("div", "ilerleme");
    const dolgu = el("div", "ilerleme-dolgu");
    cubuk.append(dolgu);
    kap.append(vitrin, cubuk, el("p", "not", "Nesneyi tutup sürükleyerek çevir. Arkasındaki altın mührü bulunca kısa bir süre öyle tut."));
    temizleyiciler.push(Diorama.nesne(vitrin, ayar.nesne, ayar.nesneRenk,
      (oran) => { dolgu.style.width = oran * 100 + "%"; },
      () => {
        vitrin.classList.add("bulundu");
        bitince();
      }));
  },

  // Karanlık sahnede feneri gezdirerek gizli nesneleri bul.
  fener(kap, ayar, bitince) {
    const alan = el("div", "fener");
    alan.innerHTML = ayar.sahne;
    const sayac = el("p", "not", "");
    let bulunan = 0;

    function sayaciYaz() {
      sayac.textContent = "Feneri gezdir, gördüğün nesneye dokun. Bulunan: " + bulunan + " / " + ayar.gizli.length;
    }

    ayar.gizli.forEach((simge, i) => {
      const d = el("button", "gizli", simge);
      d.type = "button";
      d.style.left = GIZLI_YERLER[i][0] + "%";
      d.style.top = GIZLI_YERLER[i][1] + "%";
      d.addEventListener("click", () => {
        if (d.classList.contains("bulundu")) return;
        d.classList.add("bulundu");
        bulunan++;
        sayaciYaz();
        cal("tik");
        if (bulunan === ayar.gizli.length) {
          alan.classList.add("aydinlik");
          bitince();
        }
      });
      alan.append(d);
    });
    alan.append(el("div", "fener-karanlik"));

    const isik = (e) => {
      const k = alan.getBoundingClientRect();
      alan.style.setProperty("--x", e.clientX - k.left + "px");
      alan.style.setProperty("--y", e.clientY - k.top + "px");
    };
    alan.addEventListener("pointermove", isik);
    alan.addEventListener("pointerdown", isik);

    sayaciYaz();
    kap.append(alan, sayac);
  }
};

// Sürükleyerek sıralanan liste. metinler doğru sırada verilir; liste karışık başlar.
function siralamaListesi(kap, metinler) {
  const liste = el("ol", "sira");
  let kilitli = false;

  karistir(metinler.map((_, i) => i)).forEach((no) => {
    const oge = el("li", "sira-oge");
    oge.dataset.no = no;
    oge.append(el("span", "sira-tutamak", "⋮⋮"), el("span", null, metinler[no]));
    liste.append(oge);
  });

  liste.addEventListener("pointerdown", (e) => {
    const oge = e.target.closest(".sira-oge");
    if (!oge || kilitli) return;
    e.preventDefault();
    liste.querySelectorAll(".sira-oge").forEach((o) => o.classList.remove("yerinde"));
    oge.classList.add("tasiniyor");
    surukle((h) => {
      const digerleri = [...liste.children].filter((o) => o !== oge);
      const sonraki = digerleri.find((o) => {
        const k = o.getBoundingClientRect();
        return h.clientY < k.top + k.height / 2;
      });
      liste.insertBefore(oge, sonraki || null);
    }, () => oge.classList.remove("tasiniyor"));
  });

  kap.append(liste);

  return {
    sira: () => [...liste.children].map((o) => Number(o.dataset.no)),
    isaretle: () => [...liste.children].forEach((o, i) => o.classList.toggle("yerinde", Number(o.dataset.no) === i)),
    kilitle: () => {
      kilitli = true;
      liste.classList.add("kilitli");
    }
  };
}
