// Quadro de medalhas, "Fora do teclado" e frases que se revezam.
import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, esc, fontFaces, DISPLAY, defsGlow, degrade } from './tokens.mjs';
import { HOBBIES, FRASES, TECNOLOGIAS, ESTUDANDO } from './data.mjs';
import { readFileSync } from 'node:fs';

mkdirSync('assets', { recursive: true });
const temas = [['dark', true], ['light', false]];
const out = [];
const save = (f, s) => { writeFileSync(`assets/${f}`, s); out.push(`assets/${f}`); };
const ENTRA = `.cd { opacity:0; animation: ent .6s cubic-bezier(.2,.7,.3,1) forwards }
    @keyframes ent { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:none} }`;
const bleed = (id, c, o) => `<radialGradient id="${id}" cx=".1" cy="0" r="1">
      <stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`;
const cardBase = (x, y, w, h, c, t, isDark, id) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="18" fill="url(#${id})"/>
    <rect x="${x + .5}" y="${y + .5}" width="${w - 1}" height="${h - 1}" rx="18" fill="none" stroke="${c}" stroke-opacity="${isDark ? .30 : .28}"/>
    <rect x="${x + 24}" y="${y}" width="48" height="3" rx="1.5" fill="${c}" filter="url(#gb)"/>`;

// ---------------------------------------------------------------- hobbies
const ICO = {
  faixa: (c, x, y) => `<rect x="${x - 14}" y="${y - 4}" width="28" height="7" rx="2" fill="${c}"/>
      <rect x="${x - 4.5}" y="${y - 7}" width="9" height="13" rx="2.5" fill="${c}" stroke="var(--fundo)" stroke-width="1.5"/>
      <path d="M${x - 2} ${y + 5}l-5 10M${x + 2} ${y + 5}l5 10" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/>`,
  claquete: (c, x, y) => `<rect x="${x - 13}" y="${y - 4}" width="26" height="17" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/>
      <g class="bate" style="transform-origin:${x - 13}px ${y - 4}px"><path d="M${x - 13} ${y - 5}l25 -7 1.5 5 -25 7z" fill="${c}"/></g>`,
  cubo: (c, x, y) => `<g class="gira" style="transform-origin:${x}px ${y}px">
      <path d="M${x} ${y - 14}l12 7v14l-12 7-12-7v-14z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M${x - 12} ${y - 7}l12 7 12-7M${x} ${y}v14" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M${x - 8} ${y - 9.3}l12 7M${x - 4} ${y - 11.6}l12 7M${x - 12} ${y - 2.3}l12 7M${x - 12} ${y + 2.3}l12 7" stroke="${c}" stroke-opacity=".55" stroke-width="1.2"/></g>`,
  tenis: (c, x, y) => `<g class="corre" style="transform-origin:${x}px ${y}px">
      <path d="M${x - 14} ${y + 6}c0-6 4-12 9-13l3 5c2 2 6 2 9 2 5 0 7 3 7 6z" fill="${c}"/>
      <path d="M${x - 14} ${y + 6}h28v3a2 2 0 0 1-2 2h-24a2 2 0 0 1-2-2z" fill="${c}" fill-opacity=".55"/></g>
      <path class="vento" d="M${x - 24} ${y - 4}h7M${x - 26} ${y + 2}h6" stroke="${c}" stroke-width="2" stroke-linecap="round"/>`,
  globo: (c, x, y) => `<circle cx="${x}" cy="${y}" r="13" fill="none" stroke="${c}" stroke-width="2.2"/>
      <ellipse class="meri" cx="${x}" cy="${y}" rx="6" ry="13" fill="none" stroke="${c}" stroke-width="1.8"/>
      <path d="M${x - 13} ${y}h26M${x - 11} ${y - 6.5}h22M${x - 11} ${y + 6.5}h22" stroke="${c}" stroke-width="1.4" stroke-opacity=".7"/>`,
};
function hobbies(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, gap = 14, n = HOBBIES.length, CW = (W - 60 - gap * (n - 1)) / n, CH = 150, H = CH + 28;
  const tiles = HOBBIES.map((h, i) => {
    const x = 30 + i * (CW + gap), y = 14, c = degrade(i, n, isDark), cx = x + CW / 2;
    return `
  <g class="cd" style="animation-delay:${(i * 0.08).toFixed(2)}s">${cardBase(x, y, CW, CH, c, t, isDark, `h${i}`)}
    <circle cx="${cx}" cy="${y + 54}" r="28" fill="${c}" fill-opacity="${isDark ? .13 : .11}"/>
    ${ICO[h.icone](c, cx, y + 54)}
    <text x="${cx}" y="${y + 112}" text-anchor="middle" class="tit">${esc(h.tit)}</text>
    <text x="${cx}" y="${y + 132}" text-anchor="middle" class="sub">${esc(h.sub)}</text>
  </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Fora do teclado: ${HOBBIES.map(h => `${h.tit}, ${h.sub}`).join('; ')}">
  <style>
    ${fontFaces('brico-500')}
    :root { --fundo:${t.card} }
    .tit { font: 500 17px ${DISPLAY}; fill:${t.text} }
    .sub { font: 400 12.5px ${FONT}; fill:${t.muted} }
    ${ENTRA}
    .gira { animation: gira 3s cubic-bezier(.7,0,.3,1) 1s infinite }
    @keyframes gira { 0%,40%{transform:rotate(0)} 60%,100%{transform:rotate(120deg)} }
    .bate { animation: bate 2.2s ease-in-out 1s infinite }
    @keyframes bate { 0%,80%,100%{transform:rotate(0)} 88%{transform:rotate(-18deg)} }
    .corre { animation: corre .9s ease-in-out infinite alternate }
    @keyframes corre { from{transform:translateY(1.5px)} to{transform:translateY(-1.5px)} }
    .vento { animation: vento .9s linear infinite }
    @keyframes vento { from{opacity:.9;transform:translateX(4px)} to{opacity:0;transform:translateX(-6px)} }
    .meri { transform-box: fill-box; transform-origin:center; animation: meri 3s linear infinite }
    @keyframes meri { 0%{transform:scaleX(1)} 50%{transform:scaleX(.15)} 100%{transform:scaleX(1)} }
    @media (prefers-reduced-motion: reduce) and (max-width: 1px){ .cd{opacity:1;animation:none} .gira,.bate,.corre,.vento,.meri{animation:none} }
  </style>
  <defs>${defsGlow('gb', 5)}${HOBBIES.map((h, i) => bleed(`h${i}`, degrade(i, n, isDark), isDark ? .20 : .09)).join('')}</defs>
  ${tiles}
</svg>
`;
}
for (const [nm, d] of temas) save(`hobbies-${nm}.svg`, hobbies(d));

// ---------------------------------------------------------------- frases
// Cartao com barrinhas no estilo "stories": cada frase fica 6 s e a barra
// dela vai enchendo; contador 01/05 no canto e aspas grandes de marca d'agua.
function frases(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, H = 250, n = FRASES.length, SLOT = 6, TOTAL = SLOT * n;
  const X0 = 30, Y0 = 12, CWD = W - 60, CHT = H - 24;
  const P = (s) => ((s / TOTAL) * 100).toFixed(3) + '%';
  const kf = [], blocos = [], barras = [], conts = [];
  const BX = 76, BW = W - 152, BG = 8, SW = (BW - BG * (n - 1)) / n, BY = Y0 + CHT - 28;
  FRASES.forEach((f, i) => {
    const c = degrade(i, n, isDark), s0 = i * SLOT, s1 = s0 + SLOT;
    // texto: entra com leve subida, sai subindo
    kf.push(`@keyframes f${i} { 0%{opacity:0} ${s0 ? `${P(s0)}{opacity:0;transform:translateY(10px)} ` : ''}${P(s0 + .7)}{opacity:1;transform:none} ${P(s1 - .6)}{opacity:1;transform:none} ${P(s1)}{opacity:0;transform:translateY(-10px)} 100%{opacity:0} }`);
    kf.push(`@keyframes b${i} { 0%{transform:scaleX(0)} ${s0 ? `${P(s0)}{transform:scaleX(0)} ` : ''}${P(s1)}{transform:scaleX(1)} 99.9%{transform:scaleX(1)} 100%{transform:scaleX(0)} }`);
    const linhas = f.l.length, y0 = Y0 + 104 - (linhas - 1) * 17;
    blocos.push(`<g class="fr" style="animation-name:f${i}">
      ${f.l.map((l, k) => `<text x="${W / 2}" y="${y0 + k * 34}" text-anchor="middle" class="q">${esc(l)}</text>`).join('')}
      ${f.a ? `<g><rect x="${W / 2 - (f.a.length * 3.6 + 22)}" y="${y0 + linhas * 34 - 8}" width="${f.a.length * 7.2 + 44}" height="26" rx="13" fill="${c}" fill-opacity=".12" stroke="${c}" stroke-opacity=".4"/>
      <text x="${W / 2}" y="${y0 + linhas * 34 + 9.5}" text-anchor="middle" class="a" fill="${c}">${esc(f.a)}</text></g>` : ''}
    </g>`);
    conts.push(`<text x="${X0 + CWD - 46}" y="${Y0 + 46}" text-anchor="end" class="ct fr" style="animation-name:f${i}"><tspan fill="${c}">0${i + 1}</tspan><tspan fill="${t.muted}"> / 0${n}</tspan></text>`);
    const bx = BX + i * (SW + BG);
    barras.push(`<rect x="${bx}" y="${BY}" width="${SW}" height="4" rx="2" fill="${t.hair}"/>
    <rect class="bar" x="${bx}" y="${BY}" width="${SW}" height="4" rx="2" fill="${c}" style="animation-name:b${i}; transform-origin:${bx}px ${BY}px"/>`);
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Frases que me guiam: ${esc(FRASES.map(f => `“${f.l.join(' ')}”${f.a ? `, ${f.a}` : ''}`).join('; '))}">
  <style>
    ${fontFaces('brico-500', 'brico-800')}
    .q  { font: 500 27px ${DISPLAY}; fill:${t.text}; letter-spacing:-.5px }
    .a  { font: 700 12px ${FONT}; letter-spacing:.6px }
    .k  { font: 700 11px ${FONT}; letter-spacing:2.2px; fill:${t.muted} }
    .ct { font: 800 15px ${DISPLAY}; letter-spacing:.5px }
    .aspa { font: 800 230px ${DISPLAY} }
    .fr { opacity:0; animation-duration:${TOTAL}s; animation-timing-function:ease-in-out; animation-iteration-count:infinite }
    .bar { transform: scaleX(0); animation-duration:${TOTAL}s; animation-timing-function:linear; animation-iteration-count:infinite }
    ${kf.join('\n    ')}
    .luz { animation: luz 9s ease-in-out infinite alternate }
    @keyframes luz { from{transform:translateX(-60px)} to{transform:translateX(60px)} }
    @media (prefers-reduced-motion: reduce) and (max-width: 1px){ .fr,.bar,.luz{animation:none} .fr.p0{opacity:1} .bar.p0{transform:none} }
  </style>
  <defs>
    <linearGradient id="borda" x1="0" y1="0" x2="1" y2="0">
      ${[0, 1, 2, 3].map(k => `<stop offset="${k / 3}" stop-color="${degrade(k, 4, isDark)}"/>`).join('')}
    </linearGradient>
    <linearGradient id="aspa" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${degrade(0, 4, isDark)}"/><stop offset="1" stop-color="${degrade(2, 4, isDark)}"/>
    </linearGradient>
    <radialGradient id="glow" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${degrade(1, 4, isDark)}" stop-opacity="${isDark ? .20 : .12}"/><stop offset="1" stop-color="${degrade(1, 4, isDark)}" stop-opacity="0"/>
    </radialGradient>
    <pattern id="pts" width="20" height="20" patternUnits="userSpaceOnUse"><circle cx="1.5" cy="1.5" r="1" fill="${t.muted}" fill-opacity="${isDark ? .10 : .14}"/></pattern>
    <clipPath id="card"><rect x="${X0}" y="${Y0}" width="${CWD}" height="${CHT}" rx="26"/></clipPath>
  </defs>
  <g clip-path="url(#card)">
    <rect x="${X0}" y="${Y0}" width="${CWD}" height="${CHT}" fill="${t.card}"/>
    <rect x="${X0}" y="${Y0}" width="${CWD}" height="${CHT}" fill="url(#pts)"/>
    <ellipse class="luz" cx="${W / 2}" cy="${Y0 + 110}" rx="380" ry="150" fill="url(#glow)"/>
    <text x="${X0 + 6}" y="${Y0 + 214}" class="aspa" fill="url(#aspa)" fill-opacity="${isDark ? .16 : .14}">“</text>
    <text x="${X0 + CWD + 4}" y="${Y0 + 290}" text-anchor="end" class="aspa" fill="url(#aspa)" fill-opacity="${isDark ? .10 : .10}">”</text>
  </g>
  <rect x="${X0 + .75}" y="${Y0 + .75}" width="${CWD - 1.5}" height="${CHT - 1.5}" rx="26" fill="none" stroke="url(#borda)" stroke-opacity="${isDark ? .55 : .65}" stroke-width="1.5"/>
  <circle cx="${X0 + 48}" cy="${Y0 + 41}" r="4" fill="${degrade(0, 4, isDark)}"/>
  <text x="${X0 + 62}" y="${Y0 + 45}" class="k">FRASES QUE ME GUIAM</text>
  ${conts.map((c, i) => i === 0 ? c.replace('class="ct fr"', 'class="ct fr p0"') : c).join('\n  ')}
  ${blocos.map((b, i) => i === 0 ? b.replace('class="fr"', 'class="fr p0"') : b).join('\n  ')}
  ${barras.map((b, i) => i === 0 ? b.replace('class="bar"', 'class="bar p0"') : b).join('\n  ')}
</svg>
`;
}
for (const [nm, d] of temas) save(`frases-${nm}.svg`, frases(d));

// ---------------------------------------------------------------- tecnologias
function tecnologias(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, cols = 6, gap = 12, TW = (W - 60 - gap * (cols - 1)) / cols, TH = 96;
  const linhas = Math.ceil(TECNOLOGIAS.length / cols);
  const yEst = 14 + linhas * (TH + gap) + 20;
  // chips do "estudando agora", centralizados
  const larg = ESTUDANDO.map((e) => e.length * 7.3 + 40), totalW = larg.reduce((a, b) => a + b, 0) + 10 * (ESTUDANDO.length - 1);
  let cx = (W - totalW) / 2;
  const chips = ESTUDANDO.map((e, i) => {
    const c = degrade(i, ESTUDANDO.length, isDark), w = larg[i];
    const el = `<g class="cd" style="animation-delay:${(0.7 + i * 0.07).toFixed(2)}s">
      <rect x="${cx}" y="${yEst + 22}" width="${w}" height="32" rx="16" fill="${c}" fill-opacity="${isDark ? .10 : .09}" stroke="${c}" stroke-opacity=".45"/>
      <circle cx="${cx + 16}" cy="${yEst + 38}" r="3.5" fill="${c}" class="pul" style="animation-delay:${(i * 0.4).toFixed(1)}s"/>
      <text x="${cx + 27}" y="${yEst + 42.5}" class="chip" fill="${t.text}">${esc(e)}</text></g>`;
    cx += w + 10;
    return el;
  }).join('');
  const H = yEst + 22 + 32 + 16;
  const tiles = TECNOLOGIAS.map(([ic, nome], i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x = 30 + col * (TW + gap), y = 14 + row * (TH + gap), c = degrade(i, TECNOLOGIAS.length, isDark);
    const d = readFileSync(`.github/scripts/icones/${ic}.txt`, 'utf8').trim();
    const S = 30, ix = x + TW / 2 - S / 2, iy = y + 18;
    return `<g class="cd" style="animation-delay:${(i * 0.045).toFixed(2)}s">
    <rect x="${x}" y="${y}" width="${TW}" height="${TH}" rx="16" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${TW}" height="${TH}" rx="16" fill="url(#tg${i})"/>
    <rect x="${x + .5}" y="${y + .5}" width="${TW - 1}" height="${TH - 1}" rx="16" fill="none" stroke="${c}" stroke-opacity="${isDark ? .28 : .30}"/>
    <g class="onda" style="animation-delay:${(i * 0.25).toFixed(2)}s; transform-origin:${x + TW / 2}px ${iy + S / 2}px"><path d="${d}" fill="${c}" transform="translate(${ix},${iy}) scale(${S / 24})"/></g>
    <text x="${x + TW / 2}" y="${y + 76}" text-anchor="middle" class="nm">${esc(nome)}</text>
  </g>`;
  }).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tecnologias: ${TECNOLOGIAS.map(([, n]) => n).join(', ')}. Estudando agora: ${ESTUDANDO.join(', ')}">
  <style>
    ${fontFaces('brico-500')}
    .nm   { font: 500 14px ${DISPLAY}; fill:${t.text} }
    .chip { font: 500 13px ${FONT} }
    .k    { font: 700 11px ${FONT}; letter-spacing:2.2px; fill:${t.muted} }
    ${ENTRA}
    .pul { animation: pul 2.4s ease-in-out infinite }
    .onda { animation: onda 6s ease-in-out infinite }
    @keyframes onda { 0%,12%,100%{transform:none} 5%{transform:translateY(-6px) scale(1.2)} }
    @keyframes pul { 0%,100%{opacity:1} 50%{opacity:.35} }
    @media (prefers-reduced-motion: reduce) and (max-width: 1px){ .cd{opacity:1;animation:none} .pul{animation:none} }
  </style>
  <defs>${TECNOLOGIAS.map((_, i) => bleed(`tg${i}`, degrade(i, TECNOLOGIAS.length, isDark), isDark ? .16 : .08)).join('')}</defs>
  ${tiles}
  <text x="${W / 2}" y="${yEst + 8}" text-anchor="middle" class="k">ESTUDANDO AGORA</text>
  ${chips}
</svg>
`;
}
for (const [nm, d] of temas) save(`tecnologias-${nm}.svg`, tecnologias(d));

console.log(out.join('\n'));
