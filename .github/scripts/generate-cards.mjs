// Destaques, cards de projeto e botoes de contato. Tudo em SVG proprio,
// versao clara e escura, para o README nao depender de servico externo.
import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, pick, defsGlow, defsBleed, defsWash, esc } from './tokens.mjs';
import { DESTAQUES, PROJETOS } from './data.mjs';

mkdirSync('assets', { recursive: true });
const out = [];
const save = (f, s) => { writeFileSync(`assets/${f}`, s); out.push(`assets/${f}`); };
const temas = [['dark', true], ['light', false]];

// largura aproximada de texto em fonte de sistema, para pilulas
const larg = (s, px, peso = 1) => s.length * px * 0.58 * peso;

// ---------------------------------------------------------------- destaques
function destaques(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, H = 168, gap = 16, n = DESTAQUES.length;
  const CW = (W - 60 - gap * (n - 1)) / n, CH = 128, Y = 20;
  const cards = DESTAQUES.map((d, i) => {
    const x = 30 + i * (CW + gap), c = pick(d.cor, isDark);
    return `
  <g class="cd" style="animation-delay:${(i * 0.09).toFixed(2)}s">
    <rect x="${x}" y="${Y}" width="${CW}" height="${CH}" rx="16" fill="${t.card}"/>
    <rect x="${x}" y="${Y}" width="${CW}" height="${CH}" rx="16" fill="url(#bl${i})"/>
    <rect x="${x}" y="${Y}" width="${CW}" height="${CH}" rx="16" fill="none" stroke="${c}" stroke-opacity="${isDark ? .34 : .26}"/>
    <rect x="${x}" y="${Y + 10}" width="4" height="${CH - 20}" rx="2" fill="${c}" filter="url(#gb)"/>
    <text x="${x + 24}" y="${Y + 58}" class="num" fill="${c}">${esc(d.num)}</text>
    <text x="${x + 24}" y="${Y + 86}" class="tit">${esc(d.tit)}</text>
    <text x="${x + 24}" y="${Y + 107}" class="des">${esc(d.desc)}</text>
  </g>`;
  }).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Destaques: ${DESTAQUES.map(d => `${d.num} ${d.tit}, ${d.desc}`).join('; ')}">
  <style>
    .num { font: 800 40px ${FONT}; letter-spacing:-1.2px }
    .tit { font: 700 15px ${FONT}; fill:${t.text} }
    .des { font: 400 12.5px ${FONT}; fill:${t.muted} }
    .cd { opacity:0; animation: ent .55s cubic-bezier(.2,.7,.3,1) forwards }
    @keyframes ent { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
    @media (prefers-reduced-motion: reduce){ .cd{opacity:1;animation:none} }
  </style>
  <defs>${defsGlow('gb', 5)}${DESTAQUES.map((d, i) => defsBleed(`bl${i}`, pick(d.cor, isDark), isDark ? .28 : .12)).join('')}</defs>
  ${cards}
</svg>
`;
}
for (const [n, d] of temas) save(`destaques-${n}.svg`, destaques(d));

// ---------------------------------------------------------------- projetos
function projeto(p, idx, isDark) {
  const t = isDark ? dark : light;
  const W = 1000, H = 344;
  const c = isDark ? p.cor.on : p.cor.off, c2 = isDark ? p.cor2.on : p.cor2.off;
  const img = readFileSync(`assets/shots/${p.shot}`).toString('base64');

  // moldura de navegador a direita
  const FX = 506, FY = 32, FW = 464, FH = 280, BAR = 26;

  let tx = 44;
  const tags = p.tags.map((tag) => {
    const w = larg(tag, 12.5) + 24;
    const el = `<rect x="${tx}" y="266" width="${w}" height="26" rx="13" fill="${t.cardHi}" stroke="${t.hair}"/>
    <text x="${tx + w / 2}" y="283.5" text-anchor="middle" class="tag">${esc(tag)}</text>`;
    tx += w + 8;
    return el;
  }).join('');

  const tituloW = larg(p.titulo, 40, 1.12);
  const seloW = p.selo.length * (11 * 0.66 + 1.6) + 34;
  const seloX = 44 + tituloW + 18;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(p.titulo)}: ${esc(p.tagline)}. ${esc(p.desc.join(' '))} Tecnologias: ${esc(p.tags.join(', '))}">
  <style>
    .kick { font: 700 11.5px ${FONT}; fill:${c}; letter-spacing:2.4px }
    .titulo { font: 800 40px ${FONT}; fill:${t.text}; letter-spacing:-1px }
    .selo { font: 800 11px ${FONT}; letter-spacing:1.6px }
    .tagl { font: 600 17px ${FONT}; fill:${t.text} }
    .desc { font: 400 14px ${FONT}; fill:${t.body} }
    .tag  { font: 600 12.5px ${FONT}; fill:${t.body} }
    .num  { font: 800 120px ${FONT}; fill:${c}; fill-opacity:${isDark ? .07 : .06}; letter-spacing:-6px }
    .flut { animation: f 7s ease-in-out infinite alternate }
    @keyframes f { from { transform: translateY(3px) } to { transform: translateY(-4px) } }
    .brilho { animation: b 4.5s ease-in-out infinite alternate }
    @keyframes b { from { opacity:.55 } to { opacity:1 } }
    @media (prefers-reduced-motion: reduce){ .flut,.brilho{ animation:none } }
  </style>
  <defs>
    ${defsGlow('gb', 5)}
    ${defsGlow('gs', 3)}
    ${defsBleed('bl', c, isDark ? .26 : .10)}
    ${defsWash('wa', c, isDark ? .55 : .30)}
    ${defsWash('wb', c2, isDark ? .35 : .18)}
    <clipPath id="card"><rect width="${W}" height="${H}" rx="20"/></clipPath>
    <clipPath id="tela"><rect x="${FX}" y="${FY + BAR}" width="${FW}" height="${FH - BAR}" rx="0"/></clipPath>
    <clipPath id="moldura"><rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" rx="12"/></clipPath>
    <linearGradient id="fio" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c}"/><stop offset="1" stop-color="${c2}"/>
    </linearGradient>
  </defs>

  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="${t.card}"/>
    <rect width="${W}" height="${H}" fill="url(#bl)"/>
    <g class="brilho">
      <ellipse cx="${FX + FW * 0.55}" cy="${FY + FH * 0.55}" rx="330" ry="220" fill="url(#wa)"/>
      <ellipse cx="${FX + FW * 0.95}" cy="${FY + 10}" rx="200" ry="150" fill="url(#wb)"/>
    </g>
    <rect x="0" y="${H - 3}" width="${W}" height="3" fill="url(#fio)" filter="url(#gb)"/>
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${c}" stroke-opacity="${isDark ? .30 : .24}"/>

  <text x="44" y="58" class="kick" xml:space="preserve">${esc(p.kicker)}</text>
  <text x="42" y="106" class="titulo">${esc(p.titulo)}</text>
  <rect x="${seloX}" y="81" width="${seloW}" height="24" rx="12" fill="${c}" fill-opacity="${isDark ? .14 : .10}" stroke="${c}" stroke-opacity=".5"/>
  <circle cx="${seloX + 13}" cy="93" r="3.2" fill="${c}" filter="url(#gs)"/>
  <text x="${seloX + 22}" y="97" class="selo" fill="${c}">${esc(p.selo)}</text>

  <text x="44" y="146" class="tagl">${esc(p.tagline)}</text>
  ${p.desc.map((l, i) => `<text x="44" y="${180 + i * 22}" class="desc">${esc(l)}</text>`).join('\n  ')}
  ${tags}

  <g class="flut">
    <rect x="${FX - 1}" y="${FY - 1}" width="${FW + 2}" height="${FH + 2}" rx="13" fill="${c}" fill-opacity=".35" filter="url(#gb)"/>
    <g clip-path="url(#moldura)">
      <rect x="${FX}" y="${FY}" width="${FW}" height="${FH}" fill="${isDark ? '#11131C' : '#EEF1F7'}"/>
      <circle cx="${FX + 16}" cy="${FY + 13}" r="4.2" fill="#FF5F57"/>
      <circle cx="${FX + 30}" cy="${FY + 13}" r="4.2" fill="#FEBC2E"/>
      <circle cx="${FX + 44}" cy="${FY + 13}" r="4.2" fill="#28C840"/>
      <rect x="${FX + 66}" y="${FY + 6}" width="${FW - 132}" height="14" rx="7" fill="${isDark ? '#1C2030' : '#FFFFFF'}"/>
      <image clip-path="url(#tela)" x="${FX}" y="${FY + BAR}" width="${FW}" height="${FH - BAR}" preserveAspectRatio="xMidYMin slice" xlink:href="data:image/jpeg;base64,${img}"/>
    </g>
    <rect x="${FX + .5}" y="${FY + .5}" width="${FW - 1}" height="${FH - 1}" rx="12" fill="none" stroke="${isDark ? '#FFFFFF' : '#0B1020'}" stroke-opacity=".14"/>
  </g>
</svg>
`;
}
PROJETOS.forEach((p, i) => { for (const [n, d] of temas) save(`proj-${p.id}-${n}.svg`, projeto(p, i, d)); });

// ---------------------------------------------------------------- botoes
const ICONES = {
  linkedin: (c) => `<rect x="18" y="13" width="22" height="22" rx="5" fill="${c}"/>
    <rect x="22.5" y="22" width="3.4" height="9" fill="#FFFFFF"/><circle cx="24.2" cy="18.4" r="2" fill="#FFFFFF"/>
    <path d="M28.6 22h3.2v1.3c.6-1 1.7-1.6 3-1.6 2.3 0 3.4 1.4 3.4 4V31h-3.4v-4.7c0-1.2-.4-1.9-1.4-1.9s-1.5.7-1.5 1.9V31h-3.3z" fill="#FFFFFF"/>`,
  email: (c) => `<rect x="17" y="15" width="24" height="18" rx="4" fill="none" stroke="${c}" stroke-width="2.4"/>
    <path d="M18.5 17.5l10.5 8 10.5-8" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/>`,
  repos: (c) => `<path d="M17 17a3 3 0 0 1 3-3h6l3 3.4h9a3 3 0 0 1 3 3V31a3 3 0 0 1-3 3H20a3 3 0 0 1-3-3z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M26 24.5l-2.6 2.6 2.6 2.6M32 24.5l2.6 2.6-2.6 2.6" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
};
const BOTOES = [
  { id: 'linkedin', txt: 'LinkedIn', cor: 'blue' },
  { id: 'email', txt: 'E-mail', cor: 'pink' },
  { id: 'repos', txt: 'Repositórios', cor: 'violet' },
];
function botao(b, isDark) {
  const t = isDark ? dark : light, c = pick(b.cor, isDark);
  const W = Math.round(64 + larg(b.txt, 15, 1.08) + 22), H = 48;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(b.txt)}">
  <style>.t{ font: 700 15px ${FONT}; fill:${t.text} }</style>
  <defs>${defsBleed('bl', c, isDark ? .30 : .12)}</defs>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="${t.card}"/>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="url(#bl)"/>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="24" fill="none" stroke="${c}" stroke-opacity="${isDark ? .5 : .4}"/>
  ${ICONES[b.id](c)}
  <text x="52" y="29.5" class="t">${esc(b.txt)}</text>
</svg>
`;
}
for (const b of BOTOES) for (const [n, d] of temas) save(`btn-${b.id}-${n}.svg`, botao(b, d));

console.log(out.join('\n'));
