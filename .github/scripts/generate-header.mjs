// Header do perfil: nome a esquerda, "editor de codigo" a direita.
// Paleta quente, tirada da foto de perfil. Tudo anima uma vez ao abrir
// (nome sobe letra a letra, codigo digita) e depois fica respirando.
import { writeFileSync, mkdirSync } from 'node:fs';
import { accents, warm as w, defsGlow, defsWash, esc, fontFaces, DISPLAY, MONO } from './tokens.mjs';
import { PERFIL } from './data.mjs';

const W = 1000, H = 340, A = accents;
const PE = A.peach.on, SA = A.sand.on, SG = A.sage.on, CL = A.clay.on;

// cores da sintaxe
const SX = { k: PE, v: w.text, p: SG, s: SA, n: CL, f: SG, x: w.taupe };

// ---- nome letra a letra (avancos medidos na fonte Bricolage 800)
const AV = { G: 729, a: 595, b: 648, r: 446, i: 286, e: 587, l: 283 };
const NS = 84, LS = -3;
let nx = 46;
const letras = [...PERFIL.nome1].map((ch, i) => {
  const el = `<text x="${nx.toFixed(1)}" y="176" class="n1 lt" style="animation-delay:${(0.25 + i * 0.07).toFixed(2)}s">${esc(ch)}</text>`;
  nx += (AV[ch] ?? 600) / 1000 * NS + LS;
  return el;
}).join('');

// ---- editor com digitacao
const EX = 548, EY = 44, EW = 420, EH = 256, LH = 21.5, CODE_Y = EY + 66, CW = 8.1;
let t0 = 1.0;
const clips = [], linhas = [];
PERFIL.codigo.forEach((ln, i) => {
  const y = CODE_Y + i * LH;
  const txt = ln.map(([s]) => s).join('');
  const dur = Math.max(0.12, txt.length * 0.022);
  clips.push(`<clipPath id="c${i}"><rect x="${EX + 44}" y="${y - 15}" height="21" width="0">
      <animate attributeName="width" from="0" to="${(txt.length * CW + 6).toFixed(1)}" begin="${t0.toFixed(2)}s" dur="${dur.toFixed(2)}s" fill="freeze"/>
    </rect></clipPath>`);
  const spans = ln.map(([s, c]) => `<tspan fill="${SX[c]}">${esc(s)}</tspan>`).join('');
  linhas.push(`<text x="${EX + 32}" y="${y}" class="gut" text-anchor="end">${i + 1}</text>
    <text x="${EX + 46}" y="${y}" class="cod" xml:space="preserve" clip-path="url(#c${i})">${spans}</text>`);
  t0 += dur + 0.06;
});
const fimDigitacao = t0;
const ultima = PERFIL.codigo.at(-1).map(([s]) => s).join('');
const cursorX = EX + 46 + ultima.length * CW + 3;
const cursorY = CODE_Y + (PERFIL.codigo.length - 1) * LH - 14;

// ---- particulas subindo devagar ao fundo
const parts = Array.from({ length: 22 }, (_, i) => {
  const x = (i * 97 + 31) % W, r = 1 + (i % 3) * 0.6, d = 9 + (i % 5) * 2.4, dl = -(i * 1.37) % d;
  const cor = [PE, SA, SG][i % 3];
  return `<circle cx="${x}" cy="${H + 10}" r="${r}" fill="${cor}" fill-opacity=".55" class="pt" style="animation-duration:${d.toFixed(1)}s;animation-delay:${dl.toFixed(2)}s"/>`;
}).join('\n    ');

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(PERFIL.nome)}. ${esc(PERFIL.tagline.join(' '))} 20 anos, São Paulo, Sistemas de Informação na FIAP, dev no Bradesco, faixa preta de judô e 4º lugar no Mundial de Kata">
  <style>
    ${fontFaces('brico-800', 'brico-500', 'mono-400')}
    .ola  { font: 400 15px ${MONO}; fill:${PE} }
    .n1   { font: 800 ${NS}px ${DISPLAY}; fill:${w.text} }
    .n2   { font: 500 33px ${DISPLAY}; letter-spacing:-.6px }
    .tg   { font: 500 17px ${DISPLAY}; fill:${w.body} }
    .loc  { font: 400 12.5px ${MONO}; fill:${w.taupe} }
    .cod  { font: 400 13.5px ${MONO} }
    .gut  { font: 400 12px ${MONO}; fill:#4A3C35 }
    .aba  { font: 400 12px ${MONO}; fill:${w.body} }

    .lt   { opacity:0; animation: sobe .7s cubic-bezier(.2,.9,.25,1.15) forwards }
    @keyframes sobe { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:none} }
    .fade { opacity:0; animation: aparece .8s ease-out forwards }
    @keyframes aparece { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    .risco{ transform-box: fill-box; transform-origin: left; transform: scaleX(0); animation: risco .9s cubic-bezier(.6,0,.2,1) 1.05s forwards }
    @keyframes risco { to{ transform: scaleX(1) } }
    .digita{ opacity:0; animation: aparece2 .01s linear .2s forwards }
    @keyframes aparece2 { to{opacity:1} }
    .cur  { opacity:0; animation: pisca 1.05s steps(1) ${fimDigitacao.toFixed(2)}s infinite }
    @keyframes pisca { 0%{opacity:1} 50%{opacity:0} }
    .vivo { transform-box: fill-box; transform-origin:center; animation: pulso 2.2s ease-out infinite }
    @keyframes pulso { 0%{transform:scale(1);opacity:.7} 100%{transform:scale(3.2);opacity:0} }
    .ed   { opacity:0; animation: entra .9s cubic-bezier(.2,.8,.2,1) .5s forwards }
    @keyframes entra { from{opacity:0;transform:translate(24px,10px)} to{opacity:1;transform:none} }
    .flut { animation: f 7s ease-in-out 1.4s infinite alternate }
    @keyframes f { from{transform:translateY(0)} to{transform:translateY(-6px)} }
    .drift{ animation: d 14s ease-in-out infinite alternate }
    @keyframes d { from{transform:translate(-30px,10px)} to{transform:translate(36px,-14px)} }
    .drift2{ animation: d2 18s ease-in-out infinite alternate }
    @keyframes d2 { from{transform:translate(30px,0)} to{transform:translate(-40px,12px)} }
    .pt   { animation-name: pt; animation-timing-function: linear; animation-iteration-count: infinite }
    @keyframes pt { 0%{transform:translateY(0);opacity:0} 15%{opacity:.9} 85%{opacity:.6} 100%{transform:translateY(-${H + 30}px);opacity:0} }
    @media (prefers-reduced-motion: reduce){
      .lt,.fade,.ed,.digita{opacity:1;animation:none} .risco{transform:none;animation:none}
      .cur,.vivo,.flut,.drift,.drift2,.pt{animation:none} }
  </style>
  <defs>
    ${defsGlow('gb', 6)}
    ${defsGlow('gs', 2.5)}
    ${defsWash('wB', w.brown, .85)}
    ${defsWash('wP', PE, .42)}
    ${defsWash('wG', SG, .20)}
    <linearGradient id="grad" gradientUnits="userSpaceOnUse" x1="50" y1="0" x2="390" y2="0">
      <stop offset="0" stop-color="${PE}"/>
      <stop offset=".5" stop-color="${SA}"/>
      <stop offset="1" stop-color="${SG}"/>
      <animateTransform attributeName="gradientTransform" type="translate" values="-160 0;160 0;-160 0" dur="8s" repeatCount="indefinite"/>
    </linearGradient>
    <linearGradient id="grad2" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${PE}"/><stop offset="1" stop-color="${SA}"/>
    </linearGradient>
    <linearGradient id="fio" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${PE}"/>
      <stop offset=".5" stop-color="${SA}"/>
      <stop offset="1" stop-color="${SG}"/>
    </linearGradient>
    <pattern id="pts" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.5" cy="1.5" r="1.1" fill="${SA}" fill-opacity=".06"/>
    </pattern>
    <linearGradient id="vinheta" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${w.deep}" stop-opacity=".92"/>
      <stop offset=".45" stop-color="${w.deep}" stop-opacity=".3"/>
      <stop offset="1" stop-color="${w.deep}" stop-opacity="0"/>
    </linearGradient>
    <clipPath id="cl"><rect width="${W}" height="${H}" rx="22"/></clipPath>
    <clipPath id="ed"><rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" rx="14"/></clipPath>
    ${clips.join('\n    ')}
  </defs>

  <g clip-path="url(#cl)">
    <rect width="${W}" height="${H}" fill="${w.deep}"/>
    <rect width="${W}" height="${H}" fill="url(#pts)"/>
    <g class="drift">
      <ellipse cx="780" cy="30" rx="380" ry="230" fill="url(#wB)"/>
      <ellipse cx="700" cy="120" rx="260" ry="150" fill="url(#wP)"/>
    </g>
    <g class="drift2">
      <ellipse cx="980" cy="330" rx="260" ry="160" fill="url(#wG)"/>
      <ellipse cx="300" cy="380" rx="320" ry="140" fill="url(#wB)"/>
    </g>
    <g>${parts}</g>
    <rect width="${W}" height="${H}" fill="url(#vinheta)"/>
    <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#fio)" filter="url(#gb)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="22" fill="none" stroke="${SA}" stroke-opacity=".10"/>

  <g class="fade" style="animation-delay:.05s">
    <text x="52" y="96" class="ola">${esc(PERFIL.saudacao)}</text>
  </g>
  ${letras}
  <g class="fade" style="animation-delay:.85s">
    <text x="50" y="216" class="n2" fill="url(#grad)">${esc(PERFIL.nome2)}</text>
  </g>
  <rect class="risco" x="52" y="238" width="56" height="3" rx="1.5" fill="url(#grad2)"/>
  <g class="fade" style="animation-delay:1.25s">
    <text x="52" y="270" class="tg">${esc(PERFIL.tagline[0])}</text>
    <text x="52" y="294" class="tg">${esc(PERFIL.tagline[1])}</text>
  </g>

  <g class="ed">
   <g class="flut">
    <rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" rx="14" fill="${PE}" fill-opacity=".22" filter="url(#gb)"/>
    <g clip-path="url(#ed)">
      <rect x="${EX}" y="${EY}" width="${EW}" height="${EH}" fill="#120E0C" fill-opacity=".95"/>
      <rect x="${EX}" y="${EY}" width="${EW}" height="34" fill="#1A1412"/>
      <circle cx="${EX + 18}" cy="${EY + 17}" r="5" fill="#FF5F57"/>
      <circle cx="${EX + 35}" cy="${EY + 17}" r="5" fill="#FEBC2E"/>
      <circle cx="${EX + 52}" cy="${EY + 17}" r="5" fill="#28C840"/>
      <rect x="${EX + 74}" y="${EY + 6}" width="96" height="28" rx="6" fill="#120E0C"/>
      <circle cx="${EX + 88}" cy="${EY + 20}" r="3.5" fill="${PE}" filter="url(#gs)"/>
      <text x="${EX + 98}" y="${EY + 24}" class="aba">gabriel.js</text>
      <circle cx="${EX + EW - 92}" cy="${EY + 17}" r="3.6" fill="${SG}"/>
      <circle cx="${EX + EW - 92}" cy="${EY + 17}" r="3.6" fill="${SG}" class="vivo"/>
      <text x="${EX + EW - 82}" y="${EY + 21}" class="loc">São Paulo</text>
    </g>
    <rect x="${EX + .5}" y="${EY + .5}" width="${EW - 1}" height="${EH - 1}" rx="14" fill="none" stroke="${SA}" stroke-opacity=".14"/>
    <g class="digita">
    ${linhas.join('\n    ')}
    </g>
    <rect class="cur" x="${cursorX.toFixed(1)}" y="${cursorY.toFixed(1)}" width="8" height="17" rx="1.5" fill="${PE}"/>
   </g>
  </g>
</svg>
`;

mkdirSync('assets', { recursive: true });
writeFileSync('assets/header.svg', svg);
console.log('assets/header.svg');
