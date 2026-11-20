// Header do perfil: nome a esquerda, "editor de codigo" a direita.
import { writeFileSync, mkdirSync } from 'node:fs';
import { dark, accents, defsGlow, defsWash, esc, fontFaces, DISPLAY, MONO } from './tokens.mjs';
import { PERFIL } from './data.mjs';

const W = 1000, H = 340, t = dark, A = accents;

// cores da sintaxe
const SX = { k: A.pink.on, v: '#E6EAF5', p: A.cyan.on, s: A.amber.on, n: A.violet.on, f: A.green.on, x: '#7C86A2' };

// editor
const EX = 548, EY = 46, EW = 420, EH = 256, LH = 21.5, CODE_Y = EY + 66;
const linhas = PERFIL.codigo.map((ln, i) => {
  const y = CODE_Y + i * LH;
  const spans = ln.map(([txt, c]) => `<tspan fill="${SX[c]}">${esc(txt)}</tspan>`).join('');
  return `<g class="ln" style="animation-delay:${(0.35 + i * 0.16).toFixed(2)}s">
      <text x="${EX + 20}" y="${y}" class="gut" text-anchor="end" dx="12">${i + 1}</text>
      <text x="${EX + 46}" y="${y}" class="cod" xml:space="preserve">${spans}</text>
    </g>`;
}).join('\n    ');
const ultima = PERFIL.codigo.at(-1).map(([s]) => s).join('');
const cursorX = EX + 46 + ultima.length * 8.1 + 3;
const cursorY = CODE_Y + (PERFIL.codigo.length - 1) * LH - 14;
const atraso = (0.35 + PERFIL.codigo.length * 0.16).toFixed(2);

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(PERFIL.nome)}. ${esc(PERFIL.tagline.join(' '))} 20 anos, São Paulo, Sistemas de Informação na FIAP, dev no Bradesco, faixa preta de judô e 4º lugar no Mundial de Kata">
  <style>
    ${fontFaces('brico-800', 'brico-500', 'mono-400')}
    .ola  { font: 400 15px ${MONO}; fill:${A.violet.on} }
    .n1   { font: 800 84px ${DISPLAY}; fill:${t.text}; letter-spacing:-3px }
    .n2   { font: 500 33px ${DISPLAY}; letter-spacing:-.6px }
    .tg   { font: 500 17px ${DISPLAY}; fill:${t.body} }
    .cod  { font: 400 13.5px ${MONO} }
    .gut  { font: 400 12px ${MONO}; fill:#3A4158 }
    .aba  { font: 400 12px ${MONO}; fill:${t.body} }
    .ln   { opacity:0; animation: ln .35s ease-out forwards }
    @keyframes ln { from{opacity:0;transform:translateX(-6px)} to{opacity:1;transform:none} }
    .cur  { opacity:0; animation: pisca 1.05s steps(1) ${atraso}s infinite }
    @keyframes pisca { 0%{opacity:1} 50%{opacity:0} }
    .drift{ animation: d 16s ease-in-out infinite alternate }
    @keyframes d { from{transform:translate(-20px,8px)} to{transform:translate(26px,-10px)} }
    .flut { animation: f 7s ease-in-out infinite alternate }
    @keyframes f { from{transform:translateY(3px)} to{transform:translateY(-4px)} }
    @media (prefers-reduced-motion: reduce){ .ln,.cur{opacity:1;animation:none} .drift,.flut{animation:none} }
  </style>
  <defs>
    ${defsGlow('gb', 6)}
    ${defsGlow('gs', 2.5)}
    ${defsWash('wV', A.violet.on, .55)}
    ${defsWash('wC', A.cyan.on, .30)}
    ${defsWash('wP', A.pink.on, .32)}
    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${A.violet.on}"/>
      <stop offset=".5" stop-color="${A.pink.on}"/>
      <stop offset="1" stop-color="${A.amber.on}"/>
    </linearGradient>
    <linearGradient id="fio" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${A.violet.on}"/>
      <stop offset=".5" stop-color="${A.pink.on}"/>
      <stop offset="1" stop-color="${A.cyan.on}"/>
    </linearGradient>
    <pattern id="pts" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.1" fill="#FFFFFF" fill-opacity=".055"/>
    </pattern>
    <linearGradient id="vinheta" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${t.bgDeep}" stop-opacity=".95"/>
      <stop offset=".45" stop-color="${t.bgDeep}" stop-opacity=".35"/>
      <stop offset="1" stop-color="${t.bgDeep}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="cl"><rect width="${W}" height="${H}" rx="22"/></clipPath>
    <clipPath id="ed"><rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" rx="14"/></clipPath>
  </defs>

  <g clip-path="url(#cl)">
    <rect width="${W}" height="${H}" fill="${t.bgDeep}"/>
    <rect width="${W}" height="${H}" fill="url(#pts)"/>
    <g class="drift">
      <ellipse cx="790" cy="40" rx="360" ry="220" fill="url(#wV)"/>
      <ellipse cx="960" cy="320" rx="260" ry="170" fill="url(#wC)"/>
      <ellipse cx="420" cy="360" rx="300" ry="140" fill="url(#wP)"/>
    </g>
    <rect width="${W}" height="${H}" fill="url(#vinheta)"/>
    <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#fio)" filter="url(#gb)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="#FFFFFF" stroke-opacity=".07"/>

  <text x="52" y="96" class="ola">${esc(PERFIL.saudacao)}</text>
  <text x="46" y="174" class="n1">${esc(PERFIL.nome1)}</text>
  <text x="50" y="214" class="n2" fill="url(#grad)">${esc(PERFIL.nome2)}</text>
  <rect x="52" y="238" width="44" height="3" rx="1.5" fill="url(#grad)"/>
  <text x="52" y="270" class="tg">${esc(PERFIL.tagline[0])}</text>
  <text x="52" y="294" class="tg">${esc(PERFIL.tagline[1])}</text>

  <g class="flut">
    <rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" rx="14" fill="${A.violet.on}" fill-opacity=".30" filter="url(#gb)"/>
    <g clip-path="url(#ed)">
      <rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" fill="#0B0D15" fill-opacity=".94"/>
      <rect x="${EX}" y="${EY}" width="${EW}" height="34" fill="#11141F"/>
      <circle cx="${EX + 18}" cy="${EY + 17}" r="5" fill="#FF5F57"/>
      <circle cx="${EX + 35}" cy="${EY + 17}" r="5" fill="#FEBC2E"/>
      <circle cx="${EX + 52}" cy="${EY + 17}" r="5" fill="#28C840"/>
      <rect x="${EX + 74}" y="${EY + 6}" width="96" height="28" rx="6" fill="#0B0D15"/>
      <circle cx="${EX + 88}" cy="${EY + 20}" r="3.5" fill="${A.amber.on}" filter="url(#gs)"/>
      <text x="${EX + 98}" y="${EY + 24}" class="aba">gabriel.js</text>
    </g>
    <rect x="${EX + .5}" y="${EY + .5}" width="${EW - 1}" height="${EH - 1}" rx="14" fill="none" stroke="#FFFFFF" stroke-opacity=".10"/>
    ${linhas}
    <rect class="cur" x="${cursorX.toFixed(1)}" y="${cursorY.toFixed(1)}" width="8" height="17" rx="1.5" fill="${A.violet.on}"/>
  </g>
</svg>
`;

mkdirSync('assets', { recursive: true });
writeFileSync('assets/header.svg', svg);
console.log('assets/header.svg');
