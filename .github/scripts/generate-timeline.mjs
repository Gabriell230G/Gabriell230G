// Trajetoria em trilho central, cartoes alternando de lado.
// Abre desenhando o trilho e soltando os cartoes; depois um brilho
// fica descendo pelo trilho.
import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, pick, warm, defsGlow, esc, fontFaces, DISPLAY } from './tokens.mjs';
import { ITEMS } from './data.mjs';

const W = 1000, RX = 500, CW = 410, CH = 76, ROW = 64, TOP = 34, GAP_RAIL = 44;

const TIPOS = {
  trofeu:   { rot: 'CONQUISTA', cor: 'sand' },
  projeto:  { rot: 'PROJETO', cor: 'peach' },
  trabalho: { rot: 'TRABALHO', cor: 'clay' },
  estudo:   { rot: 'ESTUDO', cor: 'sage' },
  judo:     { rot: 'JUDÔ', cor: 'sand' },
};

const ICO = {
  trofeu: (c, x, y) => `<path d="M${x - 7} ${y - 8}h14v4a7 7 0 0 1-14 0z" fill="${c}"/>
      <path d="M${x - 7} ${y - 6}h-3.5a3.5 3.5 0 0 0 4 4.5M${x + 7} ${y - 6}h3.5a3.5 3.5 0 0 1-4 4.5" fill="none" stroke="${c}" stroke-width="1.8"/>
      <rect x="${x - 1.5}" y="${y + 2}" width="3" height="4" fill="${c}"/><rect x="${x - 5.5}" y="${y + 6}" width="11" height="3" rx="1" fill="${c}"/>`,
  projeto: (c, x, y) => `<path d="M${x - 4} ${y - 6}l-6 6 6 6M${x + 4} ${y - 6}l6 6-6 6" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>`,
  trabalho: (c, x, y) => `<rect x="${x - 9}" y="${y - 5}" width="18" height="13" rx="3" fill="none" stroke="${c}" stroke-width="2"/>
      <path d="M${x - 3.5} ${y - 5}v-3h7v3M${x - 9} ${y + 1}h18" fill="none" stroke="${c}" stroke-width="2"/>`,
  estudo: (c, x, y) => `<path d="M${x} ${y - 8}l11 5-11 5-11-5z" fill="${c}"/>
      <path d="M${x - 6} ${y}v4c0 2 3 3.5 6 3.5s6-1.5 6-3.5v-4" fill="none" stroke="${c}" stroke-width="2"/>`,
  judo: (c, x, y) => `<rect x="${x - 10}" y="${y - 3}" width="20" height="5" rx="1.5" fill="${c}"/>
      <rect x="${x - 3}" y="${y - 5}" width="6" height="9" rx="1.5" fill="${c}"/>
      <path d="M${x - 1.5} ${y + 3}l-3.5 7M${x + 1.5} ${y + 3}l3.5 7" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/>`,
};

function build(isDark) {
  const t = isDark ? dark : light;
  const ink = isDark ? '#0B0D15' : '#FFFFFF';
  const H = TOP + ROW * (ITEMS.length - 1) + CH + 24;
  const railTop = TOP + CH / 2 - GAP_RAIL / 2, railBot = TOP + ROW * (ITEMS.length - 1) + CH / 2 + 14;
  const railLen = railBot - railTop;

  let anoAnterior = null;
  const els = ITEMS.map((it, i) => {
    const tp = TIPOS[it.tipo], c = pick(tp.cor, isDark);
    const esq = i % 2 === 0;
    const y = TOP + ROW * i, cy = y + CH / 2;
    const x = esq ? RX - 40 - CW : RX + 40;
    const bordaRail = esq ? x + CW : x;
    const novoAno = it.ano !== anoAnterior; anoAnterior = it.ano;
    const atraso = (0.25 + i * 0.13).toFixed(2);
    const dx = esq ? -18 : 18;

    const no = novoAno
      ? `<rect x="${RX - 30}" y="${cy - 13}" width="60" height="26" rx="13" fill="${ink}" stroke="${c}" stroke-width="2"/>
      <text x="${RX}" y="${cy + 5}" text-anchor="middle" class="ano" fill="${c}">${esc(it.ano)}</text>`
      : `<circle cx="${RX}" cy="${cy}" r="6" fill="${ink}" stroke="${c}" stroke-width="2.5"/>`;
    const ligaX1 = esq ? bordaRail : RX + (novoAno ? 30 : 6), ligaX2 = esq ? RX - (novoAno ? 30 : 6) : bordaRail;

    return `
  <g class="it" style="animation-delay:${atraso}s; --dx:${dx}px">
    <line x1="${ligaX1}" x2="${ligaX2}" y1="${cy}" y2="${cy}" stroke="${c}" stroke-opacity=".5" stroke-dasharray="3 4"/>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="16" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH}" rx="16" fill="url(#bl${esq ? 'D' : 'E'}${i})"/>
    <rect x="${x + .5}" y="${y + .5}" width="${CW - 1}" height="${CH - 1}" rx="16" fill="none" stroke="${c}" stroke-opacity="${isDark ? .30 : .30}"/>
    <circle cx="${x + 38}" cy="${cy}" r="21" fill="${c}" fill-opacity="${isDark ? .13 : .12}"/>
    ${ICO[it.tipo](c, x + 38, cy)}
    <text x="${x + 72}" y="${y + 24}" class="tag" fill="${c}">${esc(tp.rot)}</text>
    <text x="${x + 72}" y="${y + 46}" class="tit">${esc(it.titulo)}</text>
    <text x="${x + 72}" y="${y + 64}" class="des">${esc(it.desc)}</text>
  </g>
  <g class="no" style="animation-delay:${atraso}s">${no}</g>`;
  }).join('');

  const bleeds = ITEMS.map((it, i) => {
    const c = pick(TIPOS[it.tipo].cor, isDark), esq = i % 2 === 0;
    const o = isDark ? .22 : .10;
    return `<linearGradient id="bl${esq ? 'D' : 'E'}${i}" x1="${esq ? 1 : 0}" y1="0" x2="${esq ? 0 : 1}" y2="0">
      <stop offset="0" stop-color="${c}" stop-opacity="${o}"/><stop offset=".6" stop-color="${c}" stop-opacity="0"/></linearGradient>`;
  }).join('');

  const cores = ITEMS.map((it) => pick(TIPOS[it.tipo].cor, isDark));
  const paradas = cores.map((c, i) => `<stop offset="${((i / (cores.length - 1)) * 100).toFixed(1)}%" stop-color="${c}"/>`).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Trajetória: ${ITEMS.map(i => `${i.ano}, ${i.titulo}: ${i.desc}`).join('; ')}">
  <style>
    ${fontFaces('brico-800', 'brico-500')}
    .ano { font: 800 14px ${DISPLAY}; letter-spacing:.3px }
    .tag { font: 700 10.5px ${FONT}; letter-spacing:1.8px }
    .tit { font: 500 17px ${DISPLAY}; fill:${t.text}; letter-spacing:-.2px }
    .des { font: 400 13px ${FONT}; fill:${t.muted} }
    .trilho { transform-box: fill-box; transform-origin: top; transform: scaleY(0); animation: risca 1.6s cubic-bezier(.6,0,.2,1) .1s forwards }
    @keyframes risca { to { transform: scaleY(1) } }
    .it { opacity:0; animation: entra .6s cubic-bezier(.2,.8,.25,1) forwards }
    @keyframes entra { from{opacity:0;transform:translateX(var(--dx))} to{opacity:1;transform:none} }
    .no { opacity:0; transform-box: fill-box; transform-origin:center; animation: pop .45s cubic-bezier(.3,1.6,.5,1) forwards }
    @keyframes pop { from{opacity:0;transform:scale(.3)} to{opacity:1;transform:none} }
    .brilho { opacity:0; animation: desce 4.5s ease-in-out 2.2s infinite }
    @keyframes desce { 0%{transform:translateY(0);opacity:0} 10%{opacity:1} 90%{opacity:1} 100%{transform:translateY(${railLen.toFixed(0)}px);opacity:0} }
    @media (prefers-reduced-motion: reduce){ .it,.no{opacity:1;animation:none} .trilho{transform:none;animation:none} .brilho{animation:none} }
  </style>
  <defs>
    ${defsGlow('gb', 5)}
    <radialGradient id="halo"><stop offset="0" stop-color="${pick('peach', isDark)}" stop-opacity=".9"/><stop offset="1" stop-color="${pick('peach', isDark)}" stop-opacity="0"/></radialGradient>
    ${bleeds}
    <linearGradient id="rail" gradientUnits="userSpaceOnUse" x1="0" y1="${railTop}" x2="0" y2="${railBot}">${paradas}</linearGradient>
  </defs>
  <rect x="${RX - 1.5}" y="${railTop}" width="3" height="${railLen}" rx="1.5" fill="${t.hair}"/>
  <rect class="trilho" x="${RX - 1.5}" y="${railTop}" width="3" height="${railLen}" rx="1.5" fill="url(#rail)" filter="url(#gb)"/>
  <g class="brilho">
    <circle cx="${RX}" cy="${railTop}" r="14" fill="url(#halo)"/>
    <circle cx="${RX}" cy="${railTop}" r="3" fill="${isDark ? warm.text : '#FFFFFF'}"/>
  </g>
  ${els}
</svg>
`;
}

mkdirSync('assets', { recursive: true });
writeFileSync('assets/timeline-dark.svg', build(true));
writeFileSync('assets/timeline-light.svg', build(false));
console.log('assets/timeline-dark.svg\nassets/timeline-light.svg');
