// Quadro de medalhas, "Fora do teclado" e frases que se revezam.
import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, esc, fontFaces, DISPLAY, defsGlow, degrade } from './tokens.mjs';
import { MEDALHAS, HOBBIES, FRASES } from './data.mjs';

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

// ---------------------------------------------------------------- medalhas
const COR_MED = { o: ['#F4C26B', '#FFE3A3'], p: ['#C3CAD6', '#F1F4F8'], b: ['#C9835A', '#F0B48E'] };
function medalhas(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, gap = 16, CW = (W - 60 - gap * 2) / 3, CH = 138, H = 14 + CH * 2 + gap + 14;
  const n = MEDALHAS.length;
  const cards = MEDALHAS.map((m, i) => {
    const col = i % 3, row = Math.floor(i / 3);
    const x = 30 + col * (CW + gap), y = 14 + row * (CH + gap), c = degrade(i, n, isDark);
    const numW = [...m.num].reduce((w, ch) => w + (/[0-9]/.test(ch) ? 31 : 20), 0);
    const pips = (m.m || '').split('').map((k, j) => {
      const [base, luz] = COR_MED[k], cx = x + 32 + j * 18, cy = y + CH - 24;
      return `<g class="pip" style="animation-delay:${(0.6 + i * 0.1 + j * 0.05).toFixed(2)}s">
        <circle cx="${cx}" cy="${cy}" r="7" fill="${base}"/><circle cx="${cx - 2}" cy="${cy - 2}" r="2.4" fill="${luz}" fill-opacity=".9"/></g>`;
    }).join('');
    const yNum = m.m ? y + 86 : y + 98;
    return `
  <g class="cd" style="animation-delay:${(i * 0.09).toFixed(2)}s">${cardBase(x, y, CW, CH, c, t, isDark, `w${i}`)}
    <text x="${x + 24}" y="${y + 36}" class="kick" fill="${c}" xml:space="preserve">${esc(m.kick)}</text>
    <text x="${x + 22}" y="${yNum}" class="num" fill="${c}">${esc(m.num)}</text>
    <text x="${x + 34 + numW}" y="${yNum - 22}" class="tit">${esc(m.tit)}</text>
    <text x="${x + 34 + numW}" y="${yNum - 2}" class="sub">${esc(m.sub)}</text>
    ${pips}
  </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quadro de medalhas no judô, em kata: ${MEDALHAS.map(m => `${m.kick.replace(/\s+·\s+/, ', ').toLowerCase()}: ${m.num} ${m.tit}, ${m.sub}`).join('; ')}">
  <style>
    ${fontFaces('brico-800', 'brico-500')}
    .kick { font: 700 11px ${FONT}; letter-spacing:1.8px }
    .num  { font: 800 52px ${DISPLAY}; letter-spacing:-1.5px }
    .tit  { font: 500 17px ${DISPLAY}; fill:${t.text} }
    .sub  { font: 400 13px ${FONT}; fill:${t.muted} }
    ${ENTRA}
    .pip { opacity:0; transform-box: fill-box; transform-origin:center; animation: pop .4s cubic-bezier(.3,1.7,.5,1) forwards }
    @keyframes pop { from{opacity:0;transform:scale(.2)} to{opacity:1;transform:none} }
    @media (prefers-reduced-motion: reduce){ .cd,.pip{opacity:1;animation:none} }
  </style>
  <defs>${defsGlow('gb', 5)}${MEDALHAS.map((m, i) => bleed(`w${i}`, degrade(i, n, isDark), isDark ? .20 : .09)).join('')}</defs>
  ${cards}
</svg>
`;
}
for (const [nm, d] of temas) save(`medalhas-${nm}.svg`, medalhas(d));

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
    .gira { animation: gira 6s cubic-bezier(.7,0,.3,1) 1s infinite }
    @keyframes gira { 0%,70%{transform:rotate(0)} 85%,100%{transform:rotate(120deg)} }
    .bate { animation: bate 3.2s ease-in-out 1s infinite }
    @keyframes bate { 0%,80%,100%{transform:rotate(0)} 88%{transform:rotate(-18deg)} }
    .corre { animation: corre .9s ease-in-out infinite alternate }
    @keyframes corre { from{transform:translateY(1.5px)} to{transform:translateY(-1.5px)} }
    .vento { animation: vento .9s linear infinite }
    @keyframes vento { from{opacity:.9;transform:translateX(4px)} to{opacity:0;transform:translateX(-6px)} }
    .meri { transform-box: fill-box; transform-origin:center; animation: meri 3s linear infinite }
    @keyframes meri { 0%{transform:scaleX(1)} 50%{transform:scaleX(.15)} 100%{transform:scaleX(1)} }
    @media (prefers-reduced-motion: reduce){ .cd{opacity:1;animation:none} .gira,.bate,.corre,.vento,.meri{animation:none} }
  </style>
  <defs>${defsGlow('gb', 5)}${HOBBIES.map((h, i) => bleed(`h${i}`, degrade(i, n, isDark), isDark ? .20 : .09)).join('')}</defs>
  ${tiles}
</svg>
`;
}
for (const [nm, d] of temas) save(`hobbies-${nm}.svg`, hobbies(d));

// ---------------------------------------------------------------- frases
function frases(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, H = 190, n = FRASES.length, SLOT = 6, TOTAL = SLOT * n;
  const pct = (s) => ((s / TOTAL) * 100).toFixed(2) + '%';
  const blocos = FRASES.map((f, i) => {
    const c = degrade(i, n, isDark);
    const linhas = f.l.length, y0 = 92 - (linhas - 1) * 15;
    return `<g class="fr" style="animation-delay:${(i * SLOT - 0.4).toFixed(1)}s">
      ${f.l.map((l, k) => `<text x="${W / 2}" y="${y0 + k * 30}" text-anchor="middle" class="q">${esc(l)}</text>`).join('')}
      ${f.a ? `<text x="${W / 2}" y="${y0 + linhas * 30 + 8}" text-anchor="middle" class="a" fill="${c}">${esc(f.a)}</text>` : ''}
    </g>`;
  }).join('\n  ');
  const dots = FRASES.map((f, i) => `<circle class="dt" cx="${W / 2 - (n - 1) * 9 + i * 18}" cy="${H - 24}" r="3.5" fill="${degrade(i, n, isDark)}" style="animation-delay:${(i * SLOT - 0.4).toFixed(1)}s"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Frases que me guiam: ${esc(FRASES.map(f => `“${f.l.join(' ')}”${f.a ? `, ${f.a}` : ''}`).join('; '))}">
  <style>
    ${fontFaces('brico-500', 'brico-800')}
    .q  { font: 500 23px ${DISPLAY}; fill:${t.text}; letter-spacing:-.3px }
    .a  { font: 600 13px ${FONT}; letter-spacing:.4px }
    .aspa { font: 800 120px ${DISPLAY} }
    .fr { opacity:0; animation: fr ${TOTAL}s ease-in-out infinite }
    @keyframes fr { 0%{opacity:0;transform:translateY(8px)} ${pct(0.6)}{opacity:1;transform:none} ${pct(SLOT - 0.6)}{opacity:1;transform:none} ${pct(SLOT)}{opacity:0;transform:translateY(-8px)} 100%{opacity:0} }
    .dt { fill-opacity:.25; animation: dt ${TOTAL}s steps(1) infinite }
    @keyframes dt { 0%{fill-opacity:1} ${pct(SLOT)}{fill-opacity:.25} }
    @media (prefers-reduced-motion: reduce){ .fr{animation:none} .fr:first-of-type{opacity:1} .dt{animation:none} }
  </style>
  <defs>
    <linearGradient id="aspa" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${degrade(0, 4, isDark)}"/><stop offset="1" stop-color="${degrade(3, 4, isDark)}"/>
    </linearGradient>
    <radialGradient id="luz" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${degrade(1, 4, isDark)}" stop-opacity="${isDark ? .16 : .10}"/><stop offset="1" stop-color="${degrade(1, 4, isDark)}" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <ellipse cx="${W / 2}" cy="${H / 2}" rx="430" ry="110" fill="url(#luz)"/>
  <text x="${W / 2 - 330}" y="118" class="aspa" fill="url(#aspa)" fill-opacity=".9">“</text>
  ${blocos}
  ${dots}
</svg>
`;
}
for (const [nm, d] of temas) save(`frases-${nm}.svg`, frases(d));

console.log(out.join('\n'));
