import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, pick, defsGlow, defsBleed, esc } from './tokens.mjs';
import { ITEMS } from './data.mjs';

const W = 1000, PAD_TOP = 40, ROW = 92, CARD_H = 74, RAIL_X = 116, CARD_X = 152;

function build(isDark) {
  const t = isDark ? dark : light;
  const H = PAD_TOP * 2 + ROW * ITEMS.length - (ROW - CARD_H);
  const cores = ITEMS.map((i) => pick(i.cor, isDark));

  const railTop = PAD_TOP + CARD_H / 2;
  const railBot = PAD_TOP + ROW * (ITEMS.length - 1) + CARD_H / 2;

  const paradas = cores.map((c, i) =>
    `<stop offset="${((i / (cores.length - 1)) * 100).toFixed(1)}%" stop-color="${c}"/>`).join('');

  const bleeds = cores.map((c, i) => defsBleed(`bl${i}`, c, isDark ? 0.30 : 0.13)).join('');

  const rows = ITEMS.map((it, i) => {
    const y = PAD_TOP + ROW * i;
    const cy = y + CARD_H / 2;
    const c = cores[i];
    return `
  <g class="row" style="animation-delay:${(i * 0.08).toFixed(2)}s">
    <text x="${RAIL_X - 34}" y="${cy + 5}" text-anchor="end" class="ano" fill="${c}">${esc(it.ano)}</text>
    <circle cx="${RAIL_X}" cy="${cy}" r="7" fill="${c}" filter="url(#gp)"/>
    <circle cx="${RAIL_X}" cy="${cy}" r="7" fill="${t.bg}"/>
    <circle cx="${RAIL_X}" cy="${cy}" r="7" fill="none" stroke="${c}" stroke-width="3"/>

    <rect x="${CARD_X}" y="${y}" width="${W - CARD_X - 30}" height="${CARD_H}" rx="14" fill="${t.card}"/>
    <rect x="${CARD_X}" y="${y}" width="${W - CARD_X - 30}" height="${CARD_H}" rx="14" fill="url(#bl${i})"/>
    <rect x="${CARD_X}" y="${y}" width="${W - CARD_X - 30}" height="${CARD_H}" rx="14" fill="none" stroke="${c}" stroke-opacity="${isDark ? .34 : .28}"/>
    <rect x="${CARD_X}" y="${y + 8}" width="4" height="${CARD_H - 16}" rx="2" fill="${c}" filter="url(#gb)"/>

    <text x="${CARD_X + 26}" y="${y + 32}" class="tit">${esc(it.titulo)}</text>
    <text x="${CARD_X + 26}" y="${y + 55}" class="des">${esc(it.desc)}</text>
  </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Trajetória: ${ITEMS.map(i => `${i.ano} ${i.titulo}, ${i.desc}`).join('; ')}">
  <style>
    .ano { font: 800 17px ${FONT}; letter-spacing:.2px }
    .tit { font: 700 17px ${FONT}; fill:${t.text} }
    .des { font: 400 13.5px ${FONT}; fill:${t.muted} }
    .row { opacity:0; animation: ent .55s cubic-bezier(.2,.7,.3,1) forwards }
    .rail{ opacity:0; animation: fade 1s ease-out .05s forwards }
    @keyframes ent { from{opacity:0;transform:translateX(-14px)} to{opacity:1;transform:translateX(0)} }
    @keyframes fade{ to{opacity:1} }
    @media (prefers-reduced-motion: reduce){ .row,.rail{opacity:1;animation:none} }
  </style>
  <defs>
    ${defsGlow('gb', 5)}
    ${defsGlow('gp', 7)}
    ${bleeds}
    <linearGradient id="rail" gradientUnits="userSpaceOnUse" x1="0" y1="${railTop}" x2="0" y2="${railBot}">${paradas}</linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.bg}" rx="18"/>
  <rect class="rail" x="${RAIL_X - 1.5}" y="${railTop}" width="3" height="${railBot - railTop}" rx="1.5" fill="url(#rail)" filter="url(#gb)"/>
  ${rows}
</svg>
`;
}

mkdirSync('assets', { recursive: true });
writeFileSync('assets/timeline-dark.svg', build(true));
writeFileSync('assets/timeline-light.svg', build(false));
console.log('assets/timeline-dark.svg\nassets/timeline-light.svg');
