// Oyundaki bütün çizimler burada SVG olarak durur. Dışarıdan resim dosyası
// gerekmez. Hareketler (bulut, dalga, kar, bayrak) stil.css'teki sınıflarla verilir.

const SVG_BAS = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 360" preserveAspectRatio="xMidYMid slice">';

function bulut(x, y, olcek) {
  return '<g class="bulut" transform="translate(' + x + ' ' + y + ') scale(' + olcek + ')" fill="#fff" opacity="0.85">' +
    '<ellipse cx="0" cy="0" rx="34" ry="12"/><ellipse cx="-16" cy="-8" rx="18" ry="11"/><ellipse cx="12" cy="-10" rx="20" ry="13"/></g>';
}

function bayrak(x, y, boy, renk) {
  return '<line x1="' + x + '" y1="' + y + '" x2="' + x + '" y2="' + (y - boy) + '" stroke="#4a3a28" stroke-width="3"/>' +
    '<path class="bayrak" style="transform-origin:' + x + 'px ' + (y - boy) + 'px" d="M' + x + ' ' + (y - boy) +
    ' q14 -6 28 0 t26 0 v18 q-13 6 -26 0 t-28 0z" fill="' + renk + '"/>';
}

function cadir(x, y, renk) {
  return '<polygon points="' + x + ',' + y + ' ' + (x + 26) + ',' + (y - 42) + ' ' + (x + 52) + ',' + y + '" fill="' + renk + '"/>' +
    '<polygon points="' + (x + 20) + ',' + y + ' ' + (x + 26) + ',' + (y - 20) + ' ' + (x + 32) + ',' + y + '" fill="#2b2118" opacity="0.55"/>';
}

function yurt(x, y, olcek) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + olcek + ')">' +
    '<path d="M0 40 V22 Q30 -12 60 22 V40Z" fill="#f4efe2"/>' +
    '<rect x="0" y="22" width="60" height="5" fill="#a4432a"/>' +
    '<rect x="24" y="25" width="12" height="15" fill="#6b4a26"/></g>';
}

function mayin(x, y) {
  return '<g transform="translate(' + x + ' ' + y + ')">' +
    '<line x1="0" y1="8" x2="0" y2="60" stroke="#0e1a24" stroke-width="1.5" opacity="0.6"/>' +
    '<g stroke="#101b25" stroke-width="3"><line x1="-13" y1="0" x2="13" y2="0"/><line x1="0" y1="-13" x2="0" y2="13"/>' +
    '<line x1="-9" y1="-9" x2="9" y2="9"/><line x1="-9" y1="9" x2="9" y2="-9"/></g>' +
    '<circle r="9" fill="#1b2a36"/><circle cx="-3" cy="-3" r="2.5" fill="#4d6577"/></g>';
}

function zirhli(x, y, olcek) {
  return '<g transform="translate(' + x + ' ' + y + ') scale(' + olcek + ')">' +
    '<circle class="duman" cx="61" cy="-12" r="9" fill="#5a6068"/><circle class="duman duman-2" cx="83" cy="-12" r="9" fill="#5a6068"/>' +
    '<polygon points="0,30 150,30 138,48 14,48" fill="#3d4650"/>' +
    '<rect x="40" y="14" width="60" height="16" fill="#59636e"/>' +
    '<rect x="56" y="-6" width="10" height="20" fill="#2c333a"/><rect x="78" y="-6" width="10" height="20" fill="#2c333a"/>' +
    '<rect x="14" y="22" width="26" height="5" fill="#2c333a"/><rect x="106" y="22" width="26" height="5" fill="#2c333a"/>' +
    '<line x1="70" y1="14" x2="70" y2="-22" stroke="#2c333a" stroke-width="2"/></g>';
}

function kar() {
  let s = "";
  for (let i = 0; i < 26; i++) {
    const x = (i * 97) % 600;
    const gecikme = ((i * 37) % 60) / 10;
    s += '<circle class="kar" style="animation-delay:-' + gecikme + 's" cx="' + x + '" cy="-10" r="' + (2 + (i % 3)) + '" fill="#fff"/>';
  }
  return s;
}

const SAHNELER = {
  muze: SVG_BAS +
    '<defs><linearGradient id="mu-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f2a52"/><stop offset="1" stop-color="#f0b97a"/></linearGradient></defs>' +
    '<rect width="600" height="360" fill="url(#mu-gok)"/>' +
    '<g fill="#fff8dc"><circle class="yildiz" cx="60" cy="40" r="2"/><circle class="yildiz yildiz-2" cx="140" cy="80" r="1.5"/><circle class="yildiz" cx="250" cy="30" r="2"/>' +
    '<circle class="yildiz yildiz-2" cx="380" cy="55" r="1.5"/><circle class="yildiz" cx="480" cy="35" r="2"/><circle class="yildiz yildiz-2" cx="550" cy="90" r="2"/></g>' +
    '<rect x="0" y="304" width="600" height="56" fill="#2a2f45"/>' +
    '<rect x="110" y="292" width="380" height="14" fill="#cdbd9a"/><rect x="130" y="280" width="340" height="14" fill="#ddceac"/>' +
    '<rect x="150" y="168" width="300" height="112" fill="#e9dcbd"/>' +
    '<polygon points="136,170 300,92 464,170" fill="#ddceac"/><polygon points="176,162 300,104 424,162" fill="#efe3c6"/>' +
    '<text x="300" y="150" text-anchor="middle" font-family="Georgia, serif" font-size="20" font-weight="bold" letter-spacing="6" fill="#7a5a2c">MÜZE</text>' +
    '<rect x="279" y="208" width="42" height="72" rx="3" fill="#5b3d1e"/><rect x="284" y="214" width="32" height="66" fill="#f6c66b" opacity="0.9"/>' +
    '<g fill="#fff8e6">' + [162, 208, 254, 328, 374, 420].map((x) =>
      '<rect x="' + x + '" y="176" width="18" height="104"/><rect x="' + (x - 3) + '" y="170" width="24" height="8"/>').join("") + '</g>' +
    '<rect x="146" y="164" width="308" height="8" fill="#cdbd9a"/>' +
    '</svg>',

  kades: SVG_BAS +
    '<defs><linearGradient id="kd-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f29e4c"/><stop offset="1" stop-color="#fbe6b5"/></linearGradient></defs>' +
    '<rect width="600" height="360" fill="url(#kd-gok)"/>' +
    '<circle class="gunes" cx="470" cy="84" r="38" fill="#fff4c9"/>' +
    bulut(120, 70, 1) +
    '<path d="M0 230 Q120 185 260 215 T600 200 V360 H0Z" fill="#e3b56d"/>' +
    '<path d="M20 226 Q110 150 210 224Z" fill="#c9954f"/>' +
    '<g fill="#a8743a"><rect x="76" y="162" width="84" height="34"/><rect x="76" y="153" width="12" height="10"/><rect x="100" y="153" width="12" height="10"/>' +
    '<rect x="124" y="153" width="12" height="10"/><rect x="148" y="153" width="12" height="10"/></g><rect x="110" y="176" width="16" height="20" fill="#6e4a22"/>' +
    '<path class="dalga" d="M-120 262 Q-90 252 -60 262 T0 262 T60 262 T120 262 T180 262 T240 262 T300 262 T360 262 T420 262 T480 262 T540 262 T600 262 T660 262 T720 262 V292 H-120Z" fill="#4c9fb3"/>' +
    '<path d="M0 286 Q150 268 300 284 T600 276 V360 H0Z" fill="#d29a4d"/>' +
    '<polygon points="340,270 346,150 351,136 356,150 362,270" fill="#d9bb80"/>' +
    '<polygon points="382,270 394,160 440,160 448,270" fill="#ecd5a2"/><polygon points="476,270 484,160 530,160 542,270" fill="#ecd5a2"/>' +
    '<rect x="446" y="196" width="32" height="74" fill="#d9bb80"/><rect x="453" y="218" width="18" height="52" fill="#5b3d1e"/>' +
    '<rect x="390" y="156" width="54" height="6" fill="#b5533c"/><rect x="480" y="156" width="54" height="6" fill="#b5533c"/>' +
    '<g stroke="#b08a4e" stroke-width="3"><line x1="400" y1="182" x2="434" y2="182"/><line x1="398" y1="200" x2="436" y2="200"/><line x1="396" y1="218" x2="438" y2="218"/>' +
    '<line x1="490" y1="182" x2="524" y2="182"/><line x1="488" y1="200" x2="526" y2="200"/><line x1="486" y1="218" x2="528" y2="218"/></g>' +
    '<path d="M250 318 Q244 286 254 252" stroke="#6b4a26" stroke-width="6" fill="none"/>' +
    '<g fill="#3f7d4a"><path d="M254 252 q-30 -14 -46 8 q26 -10 46 -8z"/><path d="M254 252 q30 -14 46 8 q-26 -10 -46 -8z"/>' +
    '<path d="M254 252 q-8 -32 -34 -32 q22 8 34 32z"/><path d="M254 252 q8 -32 34 -32 q-22 8 -34 32z"/></g>' +
    '</svg>',

  gokturk: SVG_BAS +
    '<defs><linearGradient id="gk-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6fa8c4"/><stop offset="1" stop-color="#e9f2f3"/></linearGradient></defs>' +
    '<rect width="600" height="360" fill="url(#gk-gok)"/>' +
    bulut(110, 60, 1.1) + bulut(430, 44, 0.8) +
    '<polygon points="0,225 90,112 170,200 262,92 360,210 452,122 600,232 600,262 0,262" fill="#6c8296"/>' +
    '<g fill="#fff"><polygon points="90,112 68,140 84,134 94,146 112,138"/><polygon points="262,92 238,122 254,116 264,130 284,120"/><polygon points="452,122 430,150 446,144 456,156 474,148"/></g>' +
    '<path d="M0 238 Q200 214 400 234 T600 228 V360 H0Z" fill="#b9c47c"/>' +
    yurt(70, 236, 1) + yurt(160, 250, 0.8) +
    bayrak(300, 300, 86, "#2f6fb0") +
    '<path d="M0 296 Q180 272 360 292 T600 284 V360 H0Z" fill="#96aa58"/>' +
    '<g transform="translate(424 178)"><ellipse cx="25" cy="120" rx="46" ry="11" fill="#6f7a82"/><rect x="0" y="0" width="50" height="120" rx="12" fill="#8f9aa3"/>' +
    '<g stroke="#56626b" stroke-width="2.5" fill="none"><path d="M12 22 v14 M20 22 l8 14 M36 22 v14 M12 48 l8 12 l-8 0 M30 48 v14 M38 48 l-6 14"/>' +
    '<path d="M12 74 v14 M20 74 h10 v14 M38 74 l-6 14 M12 98 l10 10 M30 96 v12 M38 96 v12"/></g></g>' +
    kar() +
    '</svg>',

  malazgirt: SVG_BAS +
    '<defs><linearGradient id="mz-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ef8354"/><stop offset="1" stop-color="#fbe0ae"/></linearGradient></defs>' +
    '<rect width="600" height="360" fill="url(#mz-gok)"/>' +
    '<circle class="gunes" cx="96" cy="118" r="34" fill="#fff1c1"/>' +
    bulut(470, 70, 1) +
    '<path d="M0 244 Q80 190 180 244Z" fill="#8b7d6b"/><path d="M420 244 Q520 186 600 244Z" fill="#8b7d6b"/>' +
    '<polygon points="150,244 300,74 450,244" fill="#7c6f8a"/><polygon points="300,74 268,110 288,104 300,120 314,104 334,112" fill="#fff"/>' +
    '<path d="M0 236 Q300 218 600 236 V360 H0Z" fill="#cdb56a"/>' +
    '<g fill="#8a6d3b"><rect x="276" y="222" width="48" height="20"/><rect x="276" y="216" width="8" height="8"/><rect x="296" y="216" width="8" height="8"/><rect x="316" y="216" width="8" height="8"/></g>' +
    '<path class="ok-yolu" d="M170 262 Q300 176 430 262" stroke="#3b2f2f" stroke-width="2.5" stroke-dasharray="7 9" fill="none"/>' +
    cadir(40, 292, "#2a9d8f") + cadir(96, 300, "#238377") + bayrak(34, 292, 72, "#2a9d8f") +
    cadir(452, 292, "#8a3168") + cadir(508, 300, "#732756") + bayrak(574, 296, 72, "#8a3168") +
    '<path d="M0 304 Q300 286 600 304 V360 H0Z" fill="#a9954d"/>' +
    '</svg>',

  canakkale: SVG_BAS +
    '<defs><linearGradient id="ck-gok" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8fbfe0"/><stop offset="1" stop-color="#e8f2f8"/></linearGradient>' +
    '<linearGradient id="ck-su" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b82a8"/><stop offset="1" stop-color="#143f63"/></linearGradient></defs>' +
    '<rect width="600" height="360" fill="url(#ck-gok)"/>' +
    bulut(150, 50, 1) + bulut(420, 76, 0.8) +
    '<path d="M0 156 Q100 116 220 144 T420 134 T600 150 V196 H0Z" fill="#6f8f68"/>' +
    '<rect x="0" y="180" width="600" height="180" fill="url(#ck-su)"/>' +
    zirhli(250, 164, 0.55) + zirhli(60, 186, 1) +
    '<g fill="none" stroke="#fff" stroke-width="2" opacity="0.35">' +
    '<path class="dalga" d="M-120 232 Q-90 226 -60 232 T0 232 T60 232 T120 232 T180 232 T240 232 T300 232 T360 232 T420 232 T480 232 T540 232 T600 232 T660 232 T720 232"/>' +
    '<path class="dalga dalga-2" d="M-120 262 Q-90 256 -60 262 T0 262 T60 262 T120 262 T180 262 T240 262 T300 262 T360 262 T420 262 T480 262 T540 262 T600 262 T660 262 T720 262"/></g>' +
    '<g opacity="0.6">' + mayin(110, 300) + mayin(180, 306) + mayin(250, 300) + mayin(320, 306) + '</g>' +
    '<path d="M370 360 Q420 286 520 272 T600 256 V360Z" fill="#7d9c63"/>' +
    '<g fill="#b39b74"><rect x="468" y="232" width="84" height="44"/><rect x="468" y="223" width="14" height="10"/><rect x="491" y="223" width="14" height="10"/>' +
    '<rect x="514" y="223" width="14" height="10"/><rect x="538" y="223" width="14" height="10"/></g><rect x="500" y="250" width="20" height="26" fill="#5d4a30"/>' +
    bayrak(560, 232, 54, "#c0392b") +
    '</svg>'
};

const MUDUR_SVG =
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 80">' +
  '<circle cx="40" cy="40" r="40" fill="#e6d3a8"/>' +
  '<path d="M14 80 Q16 58 40 58 Q64 58 66 80Z" fill="#3a4466"/>' +
  '<polygon points="40,60 30,66 30,56" fill="#a4432a"/><polygon points="40,60 50,66 50,56" fill="#a4432a"/>' +
  '<circle cx="40" cy="36" r="19" fill="#f1c9a5"/>' +
  '<path d="M21 34 Q20 14 40 15 Q60 14 59 34 Q54 22 40 23 Q26 22 21 34Z" fill="#9a9a9a"/>' +
  '<g fill="#fff" stroke="#3a2a1a" stroke-width="2"><circle cx="32" cy="36" r="6"/><circle cx="48" cy="36" r="6"/></g>' +
  '<line x1="38" y1="36" x2="42" y2="36" stroke="#3a2a1a" stroke-width="2"/>' +
  '<circle cx="32" cy="36" r="1.8" fill="#3a2a1a"/><circle cx="48" cy="36" r="1.8" fill="#3a2a1a"/>' +
  '<path d="M30 46 Q35 42 40 46 Q45 42 50 46 Q45 50 40 47 Q35 50 30 46Z" fill="#8a8a8a"/>' +
  '</svg>';
