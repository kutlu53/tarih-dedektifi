// 3 boyutlu sahneler ve çevrilebilen nesneler (Three.js, lib/three.min.js).
// Bütün modeller ve dokular kodla üretilir; dışarıdan model ya da resim dosyası yoktur.
// WebGL yoksa Diorama.destek false olur ve oyun SVG sahnelere döner.

const Diorama = (() => {
  function webglVar() {
    if (!window.THREE) return false;
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  }
  if (!webglVar()) return { destek: false };

  const T = THREE;
  const MUHUR_ACISI = 0.5;   // nesnenin arkası kameraya bu kadar radyan yaklaşınca mühür görünür sayılır
  const MUHUR_SURESI = 0.7;  // saniye

  // ---------- dokular ----------

  function tuvalDoku(g, y, ciz) {
    const c = document.createElement("canvas");
    c.width = g;
    c.height = y;
    ciz(c.getContext("2d"), g, y);
    return new T.CanvasTexture(c);
  }

  function benekDoku(taban, benek1, benek2, tekrar) {
    const d = tuvalDoku(128, 128, (c, g, y) => {
      c.fillStyle = taban;
      c.fillRect(0, 0, g, y);
      for (let i = 0; i < 1100; i++) {
        c.fillStyle = i % 2 ? benek1 : benek2;
        c.globalAlpha = 0.2 + Math.random() * 0.4;
        c.fillRect(Math.random() * g, Math.random() * y, 2, 2);
      }
    });
    d.wrapS = d.wrapT = T.RepeatWrapping;
    d.repeat.set(tekrar, tekrar);
    return d;
  }

  function gokDoku(ust, alt) {
    return tuvalDoku(4, 256, (c, g, y) => {
      const gr = c.createLinearGradient(0, 0, 0, y);
      gr.addColorStop(0, ust);
      gr.addColorStop(1, alt);
      c.fillStyle = gr;
      c.fillRect(0, 0, g, y);
    });
  }

  // Yazılı yüzey: taban renk üstüne satır satır işaretler (çivi yazısı, runik, satır çizgisi).
  function yaziDoku(taban, murekkep, tur) {
    return tuvalDoku(256, 384, (c, g, y) => {
      c.fillStyle = taban;
      c.fillRect(0, 0, g, y);
      for (let i = 0; i < 700; i++) {
        c.fillStyle = "rgba(0,0,0," + Math.random() * 0.08 + ")";
        c.fillRect(Math.random() * g, Math.random() * y, 3, 3);
      }
      c.strokeStyle = murekkep;
      c.fillStyle = murekkep;
      c.lineWidth = 3;
      for (let sy = 40; sy < y - 30; sy += 30) {
        for (let sx = 30; sx < g - 30; sx += tur === "satir" ? 400 : 22) {
          c.beginPath();
          if (tur === "civi") {
            c.moveTo(sx, sy);
            c.lineTo(sx + 9, sy + 4);
            c.lineTo(sx, sy + 8);
            c.fill();
            if (Math.random() > 0.5) c.fillRect(sx + 10, sy + 3, 8, 2);
          } else if (tur === "runik") {
            c.moveTo(sx + 5, sy);
            c.lineTo(sx + 5, sy + 16);
            if (Math.random() > 0.4) c.lineTo(sx + 13, sy + 8 * Math.random());
            c.stroke();
          } else {
            c.lineWidth = 2;
            c.moveTo(30, sy);
            c.lineTo(g - 30 - Math.random() * 60, sy);
            c.stroke();
          }
        }
      }
    });
  }

  // ---------- model yardımcıları ----------

  function mat(renk, ek) {
    return new T.MeshStandardMaterial(Object.assign({ color: renk, flatShading: true, roughness: 0.9 }, ek));
  }

  function ekle(ust, geo, malzeme, x, y, z) {
    const m = new T.Mesh(geo, malzeme);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    ust.add(m);
    return m;
  }

  // y her zaman tabanın yüksekliğidir
  const kutu = (ust, g, y, d, renk, x, yy, z) => ekle(ust, new T.BoxGeometry(g, y, d), mat(renk), x, yy + y / 2, z);
  const koni = (ust, r, y, renk, x, yy, z, dilim) => ekle(ust, new T.ConeGeometry(r, y, dilim || 4), mat(renk), x, yy + y / 2, z);
  const silindir = (ust, rUst, rAlt, y, renk, x, yy, z, dilim) =>
    ekle(ust, new T.CylinderGeometry(rUst, rAlt, y, dilim || 12), mat(renk), x, yy + y / 2, z);

  function arazi(s, yukseklik, doku) {
    const geo = new T.PlaneGeometry(70, 70, 56, 56);
    geo.rotateX(-Math.PI / 2);
    const p = geo.attributes.position;
    for (let i = 0; i < p.count; i++) p.setY(i, yukseklik(p.getX(i), p.getZ(i)));
    geo.computeVertexNormals();
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({ map: doku, flatShading: true, roughness: 1 }));
    m.receiveShadow = true;
    s.sahne.add(m);
  }

  function su(s, y, renk, dalgali) {
    const geo = new T.PlaneGeometry(70, 70, dalgali ? 36 : 1, dalgali ? 36 : 1);
    geo.rotateX(-Math.PI / 2);
    const m = new T.Mesh(geo, new T.MeshStandardMaterial({
      color: renk, flatShading: true, roughness: 0.35, metalness: 0.1, transparent: true, opacity: 0.84
    }));
    m.position.y = y;
    m.receiveShadow = true;
    s.sahne.add(m);
    if (!dalgali) return;
    const p = geo.attributes.position;
    s.canlandir.push((t) => {
      for (let i = 0; i < p.count; i++) {
        p.setY(i, Math.sin(p.getX(i) * 0.5 + t * 1.2) * 0.09 + Math.cos(p.getZ(i) * 0.6 + t * 1.6) * 0.09);
      }
      p.needsUpdate = true;
      geo.computeVertexNormals();
    });
  }

  function bayrak(s, x, y, z, boy, renk) {
    silindir(s.sahne, 0.05, 0.05, boy, "#4a3a28", x, y, z, 6);
    const geo = new T.PlaneGeometry(1.6, 0.9, 10, 1);
    geo.translate(0.8, 0, 0);
    const m = new T.Mesh(geo, mat(renk, { side: T.DoubleSide }));
    m.position.set(x, y + boy - 0.5, z);
    m.castShadow = true;
    s.sahne.add(m);
    const p = geo.attributes.position;
    s.canlandir.push((t) => {
      for (let i = 0; i < p.count; i++) p.setZ(i, Math.sin(p.getX(i) * 3.5 - t * 5) * 0.14 * p.getX(i));
      p.needsUpdate = true;
      geo.computeVertexNormals();
    });
  }

  function parcaciklar(s, sayi, renk, boyut, hizX, hizY) {
    const konum = new Float32Array(sayi * 3);
    for (let i = 0; i < sayi; i++) {
      konum[i * 3] = (Math.random() - 0.5) * 50;
      konum[i * 3 + 1] = Math.random() * 16;
      konum[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    const geo = new T.BufferGeometry();
    geo.setAttribute("position", new T.BufferAttribute(konum, 3));
    const noktalar = new T.Points(geo, new T.PointsMaterial({
      color: renk, size: boyut, transparent: true, opacity: 0.85, depthWrite: false
    }));
    s.sahne.add(noktalar);
    s.canlandir.push((t, dt) => {
      for (let i = 0; i < sayi; i++) {
        konum[i * 3] += hizX * dt;
        konum[i * 3 + 1] -= hizY * dt;
        if (konum[i * 3 + 1] < 0) konum[i * 3 + 1] = 16;
        if (konum[i * 3] > 25) konum[i * 3] = -25;
      }
      geo.attributes.position.needsUpdate = true;
    });
  }

  function dag(s, x, z, r, y, renk, karli) {
    koni(s.sahne, r, y, renk, x, -0.5, z, 6);
    if (karli) koni(s.sahne, r * 0.42, y * 0.42, "#ffffff", x, -0.5 + y * 0.585, z, 6);
  }

  function cadir(s, x, y, z, renk) {
    koni(s.sahne, 0.95, 1.3, renk, x, y, z, 6);
    kutu(s.sahne, 0.3, 0.55, 0.1, "#2b2118", x, y, z + 0.8);
  }

  function yurt(s, x, y, z) {
    silindir(s.sahne, 1, 1, 0.8, "#f4efe2", x, y, z, 14);
    silindir(s.sahne, 1.03, 1.03, 0.14, "#a4432a", x, y + 0.66, z, 14);
    koni(s.sahne, 1.15, 0.7, "#ece5d2", x, y + 0.8, z, 14);
    kutu(s.sahne, 0.4, 0.6, 0.1, "#6b4a26", x, y, z + 0.98);
  }

  function palmiye(s, x, y, z) {
    const g = new T.Group();
    g.position.set(x, y, z);
    g.rotation.z = (Math.random() - 0.5) * 0.2;
    silindir(g, 0.1, 0.16, 2.4, "#7a5730", 0, 0, 0, 6);
    for (let i = 0; i < 7; i++) {
      const eksen = new T.Group();
      eksen.position.y = 2.4;
      eksen.rotation.y = (i / 7) * Math.PI * 2;
      const geo = new T.ConeGeometry(0.22, 1.5, 4);
      geo.translate(0, 0.75, 0);
      const yaprak = ekle(eksen, geo, mat("#3f7d4a"), 0, 0, 0);
      yaprak.rotation.z = -Math.PI / 2 - 0.4;
      yaprak.scale.z = 0.35;
      g.add(eksen);
    }
    s.sahne.add(g);
  }

  function agac(s, x, y, z, olcek) {
    silindir(s.sahne, 0.12 * olcek, 0.16 * olcek, 0.7 * olcek, "#6b4a26", x, y, z, 6);
    koni(s.sahne, 0.8 * olcek, 1.8 * olcek, "#3f6f45", x, y + 0.6 * olcek, z, 7);
  }

  function sur(s, x, y, z, boy, renk, yuk) {
    const k = 0.35;
    [[0, -1], [0, 1], [-1, 0], [1, 0]].forEach(([dx, dz]) => {
      kutu(s.sahne, dx ? k : boy, yuk, dx ? boy : k, renk, x + (dx * boy) / 2, y, z + (dz * boy) / 2);
      for (let i = -1; i <= 1; i++) {
        kutu(s.sahne, 0.3, 0.25, 0.3, renk,
          x + (dx ? (dx * boy) / 2 : (i * boy) / 4), y + yuk, z + (dz ? (dz * boy) / 2 : (i * boy) / 4));
      }
    });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(([dx, dz]) => {
      kutu(s.sahne, 0.9, yuk + 0.55, 0.9, renk, x + (dx * boy) / 2, y, z + (dz * boy) / 2);
    });
    kutu(s.sahne, boy * 0.4, yuk * 1.2, boy * 0.4, renk, x, y, z);
  }

  function at(s, x, y, z, renk, yon) {
    const g = new T.Group();
    g.position.set(x, y, z);
    g.rotation.y = yon;
    kutu(g, 1, 0.42, 0.34, renk, 0, 0.55, 0);
    const boyun = kutu(g, 0.24, 0.55, 0.24, renk, 0.48, 0.8, 0);
    boyun.rotation.z = -0.5;
    kutu(g, 0.42, 0.2, 0.2, renk, 0.72, 1.22, 0);
    [[-0.38, -0.1], [-0.38, 0.1], [0.38, -0.1], [0.38, 0.1]].forEach(([bx, bz]) => kutu(g, 0.1, 0.56, 0.1, renk, bx, 0, bz));
    kutu(g, 0.08, 0.4, 0.08, "#2b2118", -0.54, 0.5, 0);
    s.sahne.add(g);
  }

  function asker(s, x, y, z, renk) {
    silindir(s.sahne, 0.13, 0.17, 0.5, renk, x, y, z, 6);
    ekle(s.sahne, new T.SphereGeometry(0.12, 6, 5), mat("#e8c39e"), x, y + 0.62, z);
    silindir(s.sahne, 0.02, 0.02, 1, "#4a3a28", x + 0.17, y + 0.1, z, 4);
  }

  function gemi(s, x, z, olcek, yon, renk) {
    const g = new T.Group();
    kutu(g, 5, 0.8, 1.3, renk, 0, -0.1, 0);
    const burun = koni(g, 0.65, 1.4, renk, 3.1, 0, 0, 4);
    burun.rotation.z = -Math.PI / 2;
    burun.position.set(3.15, 0.3, 0);
    burun.scale.set(1, 1, 1.4);
    kutu(g, 4.7, 0.08, 1.15, "#6b5a45", 0, 0.7, 0);
    kutu(g, 1.8, 0.6, 0.8, "#59636e", -0.1, 0.78, 0);
    kutu(g, 0.7, 0.5, 0.6, "#6c7782", 0.5, 1.38, 0);
    silindir(g, 0.03, 0.03, 1.8, "#2c333a", 0.5, 1.8, 0, 4);
    [-1.6, 1.9].forEach((tx, i) => {
      silindir(g, 0.36, 0.36, 0.3, "#4a545e", tx, 0.78, 0, 8);
      const namlu = silindir(g, 0.05, 0.05, 1.1, "#2c333a", tx, 0.4, 0, 6);
      namlu.rotation.z = Math.PI / 2;
      namlu.position.set(tx + (i ? 0.6 : -0.6), 0.95, 0);
    });
    [-0.5, 0.15].forEach((bx, b) => {
      silindir(g, 0.2, 0.24, 1, "#2c333a", bx, 1.38, 0, 8);
      for (let i = 0; i < 3; i++) {
        const duman = new T.Mesh(new T.SphereGeometry(0.3, 6, 5),
          new T.MeshStandardMaterial({ color: "#4f555c", transparent: true, flatShading: true }));
        g.add(duman);
        s.canlandir.push((t) => {
          const p = (t * 0.3 + i / 3 + b * 0.15) % 1;
          duman.position.set(bx - p * 1.2, 2.5 + p * 2, 0);
          duman.scale.setScalar(0.6 + p * 1.6);
          duman.material.opacity = 0.6 * (1 - p);
        });
      }
    });
    g.position.set(x, 0, z);
    g.scale.setScalar(olcek);
    g.rotation.y = yon;
    s.sahne.add(g);
    s.canlandir.push((t) => {
      g.position.y = Math.sin(t * 1.1 + x) * 0.06;
      g.rotation.z = Math.sin(t * 0.8 + x) * 0.02;
    });
  }

  function mayin(s, x, z) {
    const g = new T.Group();
    ekle(g, new T.SphereGeometry(0.32, 10, 8), mat("#16222c", { roughness: 0.5 }), 0, 0, 0);
    for (let i = 0; i < 6; i++) {
      const diken = silindir(g, 0.03, 0.05, 0.25, "#0e171e", 0, 0, 0, 5);
      const a = (i / 6) * Math.PI * 2;
      diken.position.set(Math.cos(a) * 0.38, 0.12, Math.sin(a) * 0.38);
      diken.rotation.set(Math.sin(a) * 1.2, 0, -Math.cos(a) * 1.2);
    }
    silindir(g, 0.015, 0.015, 2, "#0e171e", 0, -2.2, 0, 4);
    g.position.set(x, -0.42, z);
    s.sahne.add(g);
    s.canlandir.push((t) => { g.position.y = -0.42 + Math.sin(t * 0.9 + x) * 0.05; });
  }

  // ---------- sahneler ----------
  // Her sahne { gok, sis, isik, kamera, hedef, kur(s) } verir; kur(s) iğne bağlantı noktalarını döndürür.

  const SAHNELER = {
    muze: {
      gok: ["#141c3d", "#e9a86b"], sis: "#b98a6a", gunes: ["#ffd9a8", [-10, 12, 14]], ortam: ["#6f7fb5", "#3a3040"],
      kamera: [0, 5.5, 22], hedef: [0, 3.2, -3],
      kur(s) {
        arazi(s, () => 0, benekDoku("#565b70", "#474b5e", "#6a6f85", 12));
        kutu(s.sahne, 15, 0.35, 8, "#cdbd9a", 0, 0, -3);
        kutu(s.sahne, 13.6, 0.35, 7, "#ddceac", 0, 0.35, -3.3);
        kutu(s.sahne, 11.4, 4.2, 4.4, "#e9dcbd", 0, 0.7, -4.6);
        for (let i = 0; i < 6; i++) {
          const x = -5 + i * 2;
          silindir(s.sahne, 0.34, 0.4, 4, "#fff8e6", x, 0.7, -1.7, 12);
          kutu(s.sahne, 0.95, 0.2, 0.95, "#ddceac", x, 4.7, -1.7);
          kutu(s.sahne, 0.95, 0.15, 0.95, "#ddceac", x, 0.7, -1.7);
        }
        kutu(s.sahne, 12.4, 0.5, 6, "#ddceac", 0, 4.9, -3.6);
        const ucgen = new T.Shape();
        ucgen.moveTo(-6.4, 0);
        ucgen.lineTo(6.4, 0);
        ucgen.lineTo(0, 2.4);
        ekle(s.sahne, new T.ExtrudeGeometry(ucgen, { depth: 6, bevelEnabled: false }), mat("#e4d6b6"), 0, 5.4, -6.6);
        ekle(s.sahne, new T.BoxGeometry(1.7, 2.9, 0.2),
          mat("#f6c66b", { emissive: "#f0a63a", emissiveIntensity: 0.9 }), 0, 2.15, -2.35);
        [-8.5, 8.5].forEach((x) => {
          silindir(s.sahne, 0.07, 0.1, 2.6, "#2a2f45", x, 0, 2.5, 6);
          ekle(s.sahne, new T.SphereGeometry(0.28, 10, 8), mat("#fff1c1", { emissive: "#ffd27a", emissiveIntensity: 1 }), x, 2.8, 2.5);
          const lamba = new T.PointLight("#ffcf8a", 0.9, 14);
          lamba.position.set(x, 2.8, 2.5);
          s.sahne.add(lamba);
          agac(s, x * 1.45, 0, -3, 1.6);
          agac(s, x * 1.8, 0, 0.5, 1.2);
        });
        parcaciklar(s, 160, "#fff8dc", 0.12, 0.15, 0.05);
        return [];
      }
    },

    kades: {
      gok: ["#f0934a", "#fbe6b5"], sis: "#f3d6a0", gunes: ["#ffe2ad", [14, 14, 8]], ortam: ["#ffd9a0", "#b98a4e"],
      kamera: [0, 9.5, 23], hedef: [0, 1, -1],
      kur(s) {
        const h = (x, z) => {
          let y = 0.5 * Math.sin(x * 0.25) * Math.cos(z * 0.3) + 0.25 * Math.sin(x * 0.6 + z * 0.4) + 0.45;
          const d = Math.abs(z - (6.5 + 1.5 * Math.sin(x * 0.2)));
          if (d < 2.6) y = -0.9 + (y + 0.9) * (d / 2.6) * (d / 2.6);
          return y;
        };
        arazi(s, h, benekDoku("#dfb36c", "#c79548", "#f0d39a", 12));
        su(s, -0.3, "#3f97ad", false);
        // Kadeş kenti: höyük üstünde surlu kent
        const hoyuk = ekle(s.sahne, new T.SphereGeometry(5, 14, 8), mat("#c99a55"), -9, 0, -5);
        hoyuk.scale.y = 0.4;
        sur(s, -9, 1.8, -5, 4.2, "#a8743a", 1.1);
        // Mısır tapınağı
        [-1.9, 1.9].forEach((dx) => {
          const geo = new T.CylinderGeometry(1.0, 1.35, 3.4, 4);
          geo.rotateY(Math.PI / 4);
          const pilon = ekle(s.sahne, geo, mat("#ecd5a2"), 8.5 + dx, 2.1, -3.5);
          pilon.scale.set(1.25, 1, 0.55);
          kutu(s.sahne, 2.3, 0.18, 1.0, "#b5533c", 8.5 + dx, 3.8, -3.5);
        });
        kutu(s.sahne, 1.5, 2.3, 0.8, "#d9bb80", 8.5, 0.4, -3.5);
        kutu(s.sahne, 0.75, 1.6, 0.85, "#4a3018", 8.5, 0.4, -3.5);
        kutu(s.sahne, 5.4, 2.1, 5, "#e3c98f", 8.5, 0.4, -6.6);
        for (let i = 0; i < 4; i++) silindir(s.sahne, 0.22, 0.26, 2.3, "#ecd5a2", 6.4 + i * 1.4, 0.4, -1.9, 8);
        silindir(s.sahne, 0.12, 0.26, 3.6, "#d9bb80", 4.4, 0.4, -1.2, 4);
        ekle(s.sahne, new T.ConeGeometry(0.17, 0.4, 4), mat("#f1c453", { emissive: "#c9982a", emissiveIntensity: 0.5 }), 4.4, 4.2, -1.2);
        // Mısır ordugâhı
        [[-1, 0.5], [1, -0.3], [2.6, 1.2], [0.6, 2]].forEach(([x, z]) => cadir(s, x, h(x, z), z, "#f3ead2"));
        bayrak(s, -2.4, h(-2.4, 1), 1, 2.6, "#b5533c");
        [[-3, 3.6], [2, 3.4], [6.5, 3.8], [-7, 9.4], [3.5, 9.6], [10, 9.2], [-12, 3.2]].forEach(([x, z]) => palmiye(s, x, h(x, z) - 0.1, z));
        parcaciklar(s, 120, "#f6dca8", 0.1, 1.2, 0.1);
        return [[6.2, 5.2, -3.5], [13, 3.6, -6], [-9, 4.6, -5], [0.6, 2.4, 0.8]];
      }
    },

    gokturk: {
      gok: ["#5f9bbb", "#e9f2f3"], sis: "#dbe8ea", gunes: ["#ffffff", [-12, 16, 10]], ortam: ["#cfe6f2", "#7f8f5a"],
      kamera: [0, 8.5, 23], hedef: [0, 1.4, -1],
      kur(s) {
        const h = (x, z) => 0.6 * Math.sin(x * 0.18) * Math.cos(z * 0.2) + 0.2 * Math.sin(x * 0.5 + 1) + 0.3;
        arazi(s, h, benekDoku("#a9b76a", "#8fa052", "#c5cf8a", 12));
        dag(s, -15, -20, 9, 11, "#6c8296", true);
        dag(s, -3, -23, 10, 13.5, "#627789", true);
        dag(s, 9, -21, 9, 10, "#6c8296", true);
        dag(s, 19, -19, 8, 8.5, "#74899c", true);
        [[-7, 0], [-3.6, -2.4], [-10, -3]].forEach(([x, z]) => yurt(s, x, h(x, z) - 0.05, z));
        // Yazıt: kaplumbağa kaide üstünde dikili taş
        const yy = h(7.5, 0.5);
        kutu(s.sahne, 1.7, 0.4, 2.3, "#737d85", 7.5, yy - 0.05, 0.5);
        const tas = new T.MeshStandardMaterial({ color: "#8f9aa3", flatShading: true, roughness: 1 });
        const yazili = new T.MeshStandardMaterial({ map: yaziDoku("#99a4ad", "#4f5a63", "runik"), roughness: 1 });
        const dikili = new T.Mesh(new T.BoxGeometry(1.3, 3.8, 0.5), [tas, tas, tas, tas, yazili, tas]);
        dikili.position.set(7.5, yy + 2.2, 0.5);
        dikili.castShadow = true;
        s.sahne.add(dikili);
        bayrak(s, 2, h(2, 1.5), 1.5, 3.4, "#2f6fb0");
        [[1, 5.5, "#6b4a2e", 0.4], [3.2, 6.8, "#3a2a1e", -0.6], [-1.6, 7.4, "#8a6a48", 2.6], [5.2, 4.6, "#57402b", 1.2], [-4.4, 5, "#d8cfc0", 0.2]]
          .forEach(([x, z, renk, yon]) => at(s, x, h(x, z), z, renk, yon));
        parcaciklar(s, 420, "#ffffff", 0.16, 0.6, 1.8);
        return [[7.5, 5.4, 0.5], [-13, 7, -16], [1.5, 2.6, 6], [-7, 3, 0]];
      }
    },

    malazgirt: {
      gok: ["#ec7d4d", "#fbe0ae"], sis: "#f1cf9d", gunes: ["#ffd3a0", [-16, 9, 6]], ortam: ["#ffd0a6", "#a08a4e"],
      kamera: [0, 8.5, 23], hedef: [0, 1.2, -1],
      kur(s) {
        const h = (x, z) => 0.15 * Math.sin(x * 0.4) * Math.cos(z * 0.5) + 0.2;
        arazi(s, h, benekDoku("#cdb56a", "#b39a50", "#e0cd8c", 12));
        dag(s, 0, -24, 14, 15, "#7c6f8a", true);
        dag(s, -19, -20, 10, 6, "#8b7d6b", false);
        dag(s, 19, -20, 10, 6.5, "#8b7d6b", false);
        sur(s, 0, 0.2, -7, 3.2, "#8a6d3b", 1);
        // Selçuklu ordugâhı (solda) ve Bizans ordugâhı (sağda)
        [[-12, -1], [-10, 1.4], [-13, 2.6], [-9.4, -2.6], [-11.6, 4.6]].forEach(([x, z]) => cadir(s, x, h(x, z), z, "#2a9d8f"));
        [[12, -1], [10, 1.4], [13, 2.6], [9.4, -2.6], [11.6, 4.6]].forEach(([x, z]) => cadir(s, x, h(x, z), z, "#8a3168"));
        bayrak(s, -8, 0.2, 0, 3.2, "#2a9d8f");
        bayrak(s, 8, 0.2, 0, 3.2, "#8a3168");
        for (let i = 0; i < 4; i++) {
          for (let j = 0; j < 6; j++) {
            asker(s, -5.5 + i * 0.7, 0.2, 1.5 + j * 0.8, "#2a9d8f");
            asker(s, 5.5 - i * 0.7, 0.2, 1.5 + j * 0.8, "#8a3168");
          }
        }
        [[-3, 7.5, "#3a2a1e", 0.2], [-1.8, 8.6, "#6b4a2e", 0.5], [-4.2, 9, "#57402b", -0.2]].forEach(([x, z, renk, yon]) => at(s, x, 0.2, z, renk, yon));
        parcaciklar(s, 140, "#f1dcae", 0.1, 1.6, 0.05);
        return [[11, 3, 0], [0, 2.4, 4], [-11, 3, 0]];
      }
    },

    canakkale: {
      gok: ["#7fb4dc", "#e8f2f8"], sis: "#d4e6f1", gunes: ["#ffffff", [12, 16, 10]], ortam: ["#d6ecfa", "#4f7d5a"],
      kamera: [0, 9.5, 23], hedef: [0, 0.6, -1],
      kur(s) {
        const kis = (v, a, b) => Math.max(a, Math.min(b, v));
        const h = (x, z) => {
          const uzak = kis((-z - 9) * 0.4, -2.5, 3) + (z < -9 ? 0.4 * Math.sin(x * 0.3) : 0);
          const yakin = kis((x * 0.55 + z - 8) * 0.45, -2.5, 1.6);
          return Math.max(uzak, yakin);
        };
        arazi(s, h, benekDoku("#7d9c63", "#688650", "#98b47c", 12));
        su(s, 0, "#2f7fa6", true);
        gemi(s, -7, -1, 1, 0.25, "#3d4650");
        gemi(s, 2, -5, 0.8, -0.2, "#454f5a");
        gemi(s, -14, -5.5, 0.7, 0.4, "#3d4650");
        gemi(s, 3.2, 5.2, 0.42, 2.6, "#2b3138"); // Nusret
        [-6.4, -4.2, -2, 0.2, 2.4].forEach((x) => mayin(s, x, 3.6));
        sur(s, 7.8, h(7.8, 7) - 0.1, 7, 2.6, "#b39b74", 1.1);
        bayrak(s, 7.8, h(7.8, 7) + 1.2, 7, 2.4, "#c0392b");
        // Karşı kıyıdaki tabya ve topları
        kutu(s.sahne, 4, 0.7, 1.2, "#a8916b", 6, h(6, -12), -12);
        [-1, 0, 1].forEach((i) => {
          const top = silindir(s.sahne, 0.1, 0.13, 1.3, "#2c333a", 6 + i * 1.2, 0, 0, 8);
          top.rotation.x = Math.PI / 2.4;
          top.position.set(6 + i * 1.2, h(6, -12) + 1, -11.4);
        });
        [[-12, -13], [-6, -15], [0, -13.5], [13, -14], [18, -12.5], [-18, -14]].forEach(([x, z]) => agac(s, x, h(x, z) - 0.1, z, 1.1));
        return [[-7, 3, -1], [7.8, 4.4, 7], [-2, 1.4, 3.6], [6, 3.4, -12]];
      }
    }
  };

  // ---------- ortak kurulum ----------

  function yeniSahne(kap, saydam, fov) {
    const cizer = new T.WebGLRenderer({ antialias: true, alpha: saydam });
    cizer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    cizer.shadowMap.enabled = true;
    cizer.shadowMap.type = T.PCFSoftShadowMap;
    cizer.domElement.className = "uc-tuval";
    kap.prepend(cizer.domElement);

    const s = { sahne: new T.Scene(), kamera: new T.PerspectiveCamera(fov, 1, 0.1, 200), canlandir: [], kap, cizer };

    function boyutla() {
      const g = kap.clientWidth;
      const y = kap.clientHeight;
      if (!g || !y) return;
      cizer.setSize(g, y, false);
      s.kamera.aspect = g / y;
      s.kamera.updateProjectionMatrix();
    }
    boyutla();
    window.addEventListener("resize", boyutla);

    let kare;
    let onceki = performance.now();
    let t = 0;
    (function dongu(simdi) {
      const dt = Math.min(0.05, Math.max(0, (simdi - onceki) / 1000));
      onceki = simdi;
      t += dt;
      s.canlandir.forEach((f) => f(t, dt));
      cizer.render(s.sahne, s.kamera);
      kare = requestAnimationFrame(dongu);
    })(onceki);

    s.durdur = () => {
      cancelAnimationFrame(kare);
      window.removeEventListener("resize", boyutla);
      s.sahne.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
          [].concat(o.material).forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      if (s.sahne.background) s.sahne.background.dispose();
      cizer.dispose();
      cizer.forceContextLoss();
      cizer.domElement.remove();
    };
    return s;
  }

  // Sahneyi kap içine kurar. igneler verilirse her kare 3B bağlantı noktasının ekrandaki yerine taşınır.
  function sahne(kap, id, igneler) {
    const a = SAHNELER[id];
    const s = yeniSahne(kap, false, 38);
    s.sahne.background = gokDoku(a.gok[0], a.gok[1]);
    s.sahne.fog = new T.Fog(a.sis, 30, 75);
    s.sahne.add(new T.HemisphereLight(a.ortam[0], a.ortam[1], 0.6));
    const gunes = new T.DirectionalLight(a.gunes[0], 0.75);
    gunes.position.set(...a.gunes[1]);
    gunes.castShadow = true;
    gunes.shadow.mapSize.set(1024, 1024);
    Object.assign(gunes.shadow.camera, { left: -26, right: 26, top: 26, bottom: -26, near: 1, far: 80 });
    gunes.shadow.bias = -0.0006;
    s.sahne.add(gunes);

    const baglantilar = a.kur(s).map((n) => new T.Vector3(...n));

    let px = 0;
    let py = 0;
    kap.addEventListener("pointermove", (e) => {
      const k = kap.getBoundingClientRect();
      px = ((e.clientX - k.left) / k.width) * 2 - 1;
      py = ((e.clientY - k.top) / k.height) * 2 - 1;
    });
    const hedef = new T.Vector3(...a.hedef);
    const gecici = new T.Vector3();
    s.canlandir.push((t) => {
      s.kamera.position.set(a.kamera[0] + Math.sin(t * 0.25) * 1.3 + px * 1.6, a.kamera[1] - py * 0.7, a.kamera[2]);
      s.kamera.lookAt(hedef);
      if (!igneler) return;
      s.kamera.updateMatrixWorld();
      igneler.forEach((igne, i) => {
        gecici.copy(baglantilar[i]).project(s.kamera);
        igne.style.left = (gecici.x * 0.5 + 0.5) * kap.clientWidth + "px";
        igne.style.top = (-gecici.y * 0.5 + 0.5) * kap.clientHeight + "px";
      });
    });
    return s.durdur;
  }

  // ---------- çevrilebilen nesneler ----------

  const NESNELER = {
    tablet(g) {
      const kil = new T.MeshStandardMaterial({ map: benekDoku("#b98b5e", "#9a7148", "#cfa57a", 2), roughness: 1 });
      const yazili = new T.MeshStandardMaterial({ map: yaziDoku("#b98b5e", "#6e4d2c", "civi"), roughness: 1 });
      const m = new T.Mesh(new T.BoxGeometry(3, 4.2, 0.5), [kil, kil, kil, kil, yazili, kil]);
      m.castShadow = true;
      g.add(m);
      return 0.26;
    },
    kitap(g, renk) {
      const kapak = mat(renk, { flatShading: false, roughness: 0.6 });
      const on = new T.MeshStandardMaterial({
        roughness: 0.6,
        map: tuvalDoku(256, 340, (c, gen, yuk) => {
          c.fillStyle = renk;
          c.fillRect(0, 0, gen, yuk);
          c.strokeStyle = "#d4a23a";
          c.lineWidth = 6;
          c.strokeRect(18, 18, gen - 36, yuk - 36);
          c.lineWidth = 2;
          c.strokeRect(30, 30, gen - 60, yuk - 60);
          c.fillStyle = "#d4a23a";
          c.fillRect(70, 120, gen - 140, 8);
          c.fillRect(90, 150, gen - 180, 5);
        })
      });
      [0.36, -0.36].forEach((z, i) => {
        const k = new T.Mesh(new T.BoxGeometry(3.1, 4.2, 0.1), i === 0 ? [kapak, kapak, kapak, kapak, on, kapak] : kapak);
        k.position.z = z;
        k.castShadow = true;
        g.add(k);
      });
      ekle(g, new T.BoxGeometry(0.12, 4.2, 0.82), kapak, -1.5, 0, 0);
      ekle(g, new T.BoxGeometry(2.9, 4, 0.62), mat("#efe2c4", { flatShading: false }), 0.05, 0, 0);
      return 0.42;
    },
    tomar(g) {
      const kagit = new T.MeshStandardMaterial({ map: yaziDoku("#efe0bd", "#5b4630", "satir"), roughness: 1, side: T.DoubleSide });
      const yaprak = new T.Mesh(new T.PlaneGeometry(3, 3.8, 1, 12), kagit);
      const p = yaprak.geometry.attributes.position;
      for (let i = 0; i < p.count; i++) p.setZ(i, Math.cos(p.getY(i) * 0.8) * 0.18 - 0.18);
      yaprak.geometry.computeVertexNormals();
      yaprak.castShadow = true;
      g.add(yaprak);
      [2, -2].forEach((y) => {
        const cubuk = silindir(g, 0.16, 0.16, 3.5, "#6b4a26", 0, 0, 0, 10);
        cubuk.rotation.z = Math.PI / 2;
        cubuk.position.set(0, y, -0.25);
        [-1.85, 1.85].forEach((x) => ekle(g, new T.SphereGeometry(0.22, 10, 8), mat("#4a3018", { flatShading: false }), x, y, -0.25));
      });
      return 0.3;
    }
  };

  // Nesneyi vitrinde gösterir; oyuncu sürükleyerek çevirir. Arkadaki mühür bir süre
  // kameraya dönük kalınca bulundu() çağrılır. ilerleme(0..1) her karede bildirilir.
  function nesne(kap, tur, renk, ilerleme, bulundu) {
    const s = yeniSahne(kap, true, 32);
    s.kamera.position.set(0, 0.6, 11);
    s.kamera.lookAt(0, 0, 0);
    s.sahne.add(new T.HemisphereLight("#fff3d6", "#3a2f25", 0.75));
    const spot = new T.SpotLight("#ffe7b8", 1.3, 40, 0.5, 0.6);
    spot.position.set(3, 8, 9);
    spot.castShadow = true;
    s.sahne.add(spot);
    const arka = new T.PointLight("#7fa8ff", 0.5, 30);
    arka.position.set(-5, 3, -6);
    s.sahne.add(arka);

    const kaide = silindir(s.sahne, 2.6, 2.9, 0.5, "#3a2a1c", 0, -3.1, 0, 28);
    kaide.material.flatShading = false;
    kaide.material.needsUpdate = true;

    const g = new T.Group();
    const arkaZ = NESNELER[tur](g, renk);
    const muhur = new T.Mesh(new T.CircleGeometry(0.62, 28),
      mat("#d4a23a", { flatShading: false, emissive: "#b8860b", emissiveIntensity: 0.4, metalness: 0.6, roughness: 0.3 }));
    muhur.position.set(0.7, -1.1, -arkaZ - 0.01);
    muhur.rotation.y = Math.PI;
    g.add(muhur);
    const yildiz = new T.Mesh(new T.CircleGeometry(0.34, 5), mat("#7a2e1c", { flatShading: false }));
    yildiz.position.set(0.7, -1.1, -arkaZ - 0.02);
    yildiz.rotation.y = Math.PI;
    g.add(yildiz);
    g.rotation.set(-0.08, 0.5, 0);
    s.sahne.add(g);

    let tutuldu = false;
    let sure = 0;
    let bitti = false;

    s.cizer.domElement.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      tutuldu = true;
      let x = e.clientX;
      let y = e.clientY;
      surukle((h) => {
        g.rotation.y += (h.clientX - x) * 0.012;
        g.rotation.x = Math.max(-0.6, Math.min(0.6, g.rotation.x + (h.clientY - y) * 0.008));
        x = h.clientX;
        y = h.clientY;
      }, () => {});
    });

    s.canlandir.push((t, dt) => {
      if (!tutuldu) g.rotation.y = 0.5 + Math.sin(t * 0.8) * 0.35;
      g.position.y = Math.sin(t * 1.4) * 0.06;
      if (bitti) {
        muhur.material.emissiveIntensity = 0.9 + Math.sin(t * 6) * 0.4;
        return;
      }
      const aci = ((g.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      sure = Math.abs(aci - Math.PI) < MUHUR_ACISI ? sure + dt : 0;
      ilerleme(Math.min(1, sure / MUHUR_SURESI));
      if (sure >= MUHUR_SURESI) {
        bitti = true;
        bulundu();
      }
    });
    return s.durdur;
  }

  return { destek: true, sahne, nesne };
})();
