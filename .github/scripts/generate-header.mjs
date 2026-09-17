import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, accents, defsGlow, defsWash, esc } from './tokens.mjs';
import { PERFIL } from './data.mjs';

const W = 1000, H = 238, t = dark;
const A = accents;
const chipCores = [A.violet.on, A.pink.on, A.cyan.on, A.amber.on];

const chips = PERFIL.chips.map((c, i) => ({ texto: c, cor: chipCores[i % 4] }));
let x = 60;
const chipEls = chips.map((c) => {
  const w = 40 + c.texto.length * 7.9;   // 25 de recuo + texto + 15 de respiro
  const el = `
    <g>
      <rect x="${x}" y="172" width="${w}" height="32" rx="16" fill="${c.cor}" fill-opacity=".10"/>
      <rect x="${x}" y="172" width="${w}" height="32" rx="16" fill="none" stroke="${c.cor}" stroke-opacity=".42"/>
      <circle cx="${x + 15}" cy="188" r="3.4" fill="${c.cor}" filter="url(#gDot)"/>
      <text x="${x + 25}" y="193" class="chip" fill="${c.cor}">${esc(c.texto)}</text>
    </g>`;
  x += w + 12;
  return el;
}).join('');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(PERFIL.nome)}, ${esc(PERFIL.cargo)} · ${esc(PERFIL.empresa)}">
  <style>
    .nome { font: 800 52px ${FONT}; fill:${t.text}; letter-spacing:-1.4px }
    .cargo{ font: 500 18px ${FONT}; fill:${t.body} }
    .marca{ font: 700 13px ${FONT}; fill:${A.red.on}; letter-spacing:3.4px }
    .chip { font: 600 13px ${FONT} }
    .drift{ animation: d 18s ease-in-out infinite alternate }
    @keyframes d { from { transform: translate(-26px,6px) } to { transform: translate(34px,-8px) } }
    @media (prefers-reduced-motion: reduce){ .drift{ animation:none } }
  </style>
  <defs>
    ${defsGlow('gBig', 26)}
    ${defsGlow('gDot', 3)}
    ${defsGlow('gLine', 5)}
    ${defsWash('wV', A.violet.on, .60)}
    ${defsWash('wP', A.pink.on, .48)}
    ${defsWash('wR', A.red.on, .40)}
    <linearGradient id="fio" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${A.red.on}"/>
      <stop offset=".34" stop-color="${A.pink.on}"/>
      <stop offset=".68" stop-color="${A.violet.on}"/>
      <stop offset="1" stop-color="${A.cyan.on}"/>
    </linearGradient>
    <linearGradient id="fade" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${t.bgDeep}" stop-opacity="0"/>
      <stop offset="1" stop-color="${t.bgDeep}" stop-opacity=".9"/>
    </linearGradient>
    <clipPath id="cl"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>

  <g clip-path="url(#cl)">
    <rect width="${W}" height="${H}" fill="${t.bgDeep}"/>

    <!-- poliedros de fundo, bem discretos -->
    <g fill="#FFFFFF" fill-opacity=".022">
      <polygon points="640,-40 810,26 742,150 590,96"/>
      <polygon points="880,120 1010,86 1040,210 900,236"/>
      <polygon points="470,150 570,190 520,250 430,214"/>
    </g>

    <g class="drift">
      <ellipse cx="800" cy="44" rx="330" ry="210" fill="url(#wV)"/>
      <ellipse cx="962" cy="196" rx="240" ry="170" fill="url(#wP)"/>
      <ellipse cx="612" cy="232" rx="250" ry="130" fill="url(#wR)"/>
    </g>
    <rect width="${W}" height="${H}" fill="url(#fade)"/>

    <!-- barra viva a esquerda -->
    <rect x="30" y="52" width="5" height="128" rx="2.5" fill="url(#fio)" filter="url(#gLine)"/>

    <text x="60" y="72" class="marca">BRADESCO  ·  FIAP</text>
    <text x="58" y="126" class="nome">${esc(PERFIL.nome)}</text>
    <text x="60" y="154" class="cargo">${esc(PERFIL.cargo)}</text>

    ${chipEls}

    <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#fio)" filter="url(#gLine)"/>
  </g>
</svg>
`;

mkdirSync('assets', { recursive: true });
writeFileSync('assets/header.svg', svg);
console.log('assets/header.svg');
