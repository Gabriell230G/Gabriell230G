// Quadro de medalhas no estilo emblema de jogo: metal com degrade, fita,
// estrela, brilho passando, raios girando e faiscas piscando.
import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, esc, fontFaces, DISPLAY, defsGlow } from './tokens.mjs';
import { TITULOS, CONTAGEM } from './data.mjs';

const METAL = {
  ouro:   { a: '#FFF3C4', b: '#F7C64A', c: '#D18A22', borda: '#A9651A', miolo: ['#FFD866', '#E39A2B'], brilho: '#FFF8DC' },
  prata:  { a: '#FFFFFF', b: '#D5DBE5', c: '#97A1B1', borda: '#727B8A', miolo: ['#E9EDF3', '#A7B0BF'], brilho: '#FFFFFF' },
  bronze: { a: '#FFD9BC', b: '#DB8E5B', c: '#A5592C', borda: '#7E3F1C', miolo: ['#F0A877', '#B8642F'], brilho: '#FFE7D4' },
};

const r2 = (n) => Math.round(n * 10) / 10;
const estrela = (cx, cy, R, r, pontas = 5, giro = -90) => {
  const pts = [];
  for (let i = 0; i < pontas * 2; i++) {
    const ang = (giro + (i * 180) / pontas) * Math.PI / 180, rr = i % 2 ? r : R;
    pts.push(`${r2(cx + rr * Math.cos(ang))},${r2(cy + rr * Math.sin(ang))}`);
  }
  return pts.join(' ');
};
const faisca = (x, y, s, cor, atraso) => `<path class="fa" style="animation-delay:${atraso}s; transform-origin:${x}px ${y}px"
      d="M${x} ${y - s}Q${x} ${y} ${x + s} ${y}Q${x} ${y} ${x} ${y + s}Q${x} ${y} ${x - s} ${y}Q${x} ${y} ${x} ${y - s}Z" fill="${cor}"/>`;

// defs por metal (cada SVG declara os que usa)
const defsMetal = (id, m) => `
    <linearGradient id="${id}A" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${m.a}"/><stop offset=".45" stop-color="${m.b}"/><stop offset="1" stop-color="${m.c}"/></linearGradient>
    <linearGradient id="${id}M" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${m.miolo[0]}"/><stop offset="1" stop-color="${m.miolo[1]}"/></linearGradient>`;

// medalha com roseta, fita e estrela
function medalha(uid, cx, cy, R, metal, fita, { brilho = true, estrelaCor = '#FFFFFF' } = {}) {
  const m = METAL[metal], id = `${uid}${metal}`;
  const ros = estrela(cx, cy, R, R * 0.9, 16, -90);
  const fy = cy + R * 0.35;
  const tira = (s) => `<path d="M${cx + s * 2} ${fy}L${cx + s * (R * 0.62)} ${fy}L${cx + s * (R * 0.95)} ${cy + R * 1.75}L${cx + s * (R * 0.66)} ${cy + R * 1.55}L${cx + s * (R * 0.42)} ${cy + R * 1.82}Z" fill="url(#${uid}F${s > 0 ? 'D' : 'E'})"/>`;
  return `
    <defs>
      <linearGradient id="${uid}FE" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${fita[0]}"/><stop offset="1" stop-color="${fita[1]}"/></linearGradient>
      <linearGradient id="${uid}FD" x1="1" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${fita[0]}"/><stop offset="1" stop-color="${fita[1]}"/></linearGradient>
      <clipPath id="${uid}clip"><circle cx="${cx}" cy="${cy}" r="${R * 0.9}"/></clipPath>
    </defs>
    ${tira(-1)}${tira(1)}
    <polygon points="${ros}" fill="${m.borda}" transform="translate(0,2.5)" opacity=".55"/>
    <polygon points="${ros}" fill="url(#${id}A)"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.68}" fill="url(#${id}M)" stroke="${m.borda}" stroke-opacity=".35" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="${R * 0.68}" fill="none" stroke="${m.a}" stroke-opacity=".7" stroke-width="1.2" stroke-dasharray="${r2(R * 0.12)} ${r2(R * 0.09)}" transform="rotate(8 ${cx} ${cy})"/>
    <polygon points="${estrela(cx, cy + R * 0.02, R * 0.42, R * 0.18)}" fill="${estrelaCor}" fill-opacity=".95"/>
    <polygon points="${estrela(cx, cy + R * 0.02, R * 0.42, R * 0.18)}" fill="none" stroke="${m.borda}" stroke-opacity=".25"/>
    <ellipse cx="${cx - R * 0.3}" cy="${cy - R * 0.45}" rx="${R * 0.32}" ry="${R * 0.14}" fill="#FFFFFF" fill-opacity=".35" transform="rotate(-30 ${cx - R * 0.3} ${cy - R * 0.45})"/>
    ${brilho ? `<g clip-path="url(#${uid}clip)"><rect class="sweep" x="${cx - R * 0.25}" y="${cy - R * 1.4}" width="${R * 0.35}" height="${R * 2.8}" fill="${m.brilho}" fill-opacity=".55" transform="rotate(25 ${cx} ${cy})"/></g>` : ''}`;
}

// brasao hexagonal com asas, para o Mundial
function brasao(uid, cx, cy, R, selo) {
  const hex = (rr) => Array.from({ length: 6 }, (_, i) => {
    const a = (-90 + i * 60) * Math.PI / 180; return `${r2(cx + rr * Math.cos(a))},${r2(cy + rr * Math.sin(a))}`;
  }).join(' ');
  const asa = Array.from({ length: 4 }, (_, i) => {
    const x0 = cx - R * 0.78, y0 = cy - R * 0.42 + i * R * 0.27, L = R * (0.95 - i * 0.16);
    return `<path d="M${r2(x0)} ${r2(y0)}L${r2(x0 - L)} ${r2(y0 - R * 0.28 + i * 4)}Q${r2(x0 - L - 8)} ${r2(y0 - R * 0.12 + i * 4)} ${r2(x0 - L + 4)} ${r2(y0 + R * 0.02 + i * 2)}L${r2(x0)} ${r2(y0 + R * 0.2)}Z" fill="url(#${uid}ouroA)" stroke="#A9651A" stroke-opacity=".5" stroke-width="1"/>`;
  }).join('');
  const globo = `<g fill="none" stroke="#FFF6EC" stroke-width="2" stroke-opacity=".95">
      <circle cx="${cx}" cy="${cy - 4}" r="${R * 0.3}"/>
      <ellipse class="meri" cx="${cx}" cy="${cy - 4}" rx="${R * 0.13}" ry="${R * 0.3}"/>
      <path d="M${r2(cx - R * 0.3)} ${cy - 4}h${r2(R * 0.6)}M${r2(cx - R * 0.26)} ${r2(cy - 4 - R * 0.15)}h${r2(R * 0.52)}M${r2(cx - R * 0.26)} ${r2(cy - 4 + R * 0.15)}h${r2(R * 0.52)}" stroke-width="1.4" stroke-opacity=".75"/></g>`;
  const by = cy + R * 0.62;
  return `
    <defs>
      <linearGradient id="${uid}cri" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7A27E"/><stop offset=".55" stop-color="#D9604A"/><stop offset="1" stop-color="#8E2F2A"/></linearGradient>
      <linearGradient id="${uid}ban" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE29A"/><stop offset="1" stop-color="#E0A030"/></linearGradient>
      <clipPath id="${uid}clip"><polygon points="${hex(R * 0.86)}"/></clipPath>
    </defs>
    <g>${asa}</g>
    <g transform="translate(${2 * cx},0) scale(-1,1)">${asa}</g>
    <polygon points="${hex(R)}" fill="#A9651A" transform="translate(0,3)" opacity=".5"/>
    <polygon points="${hex(R)}" fill="url(#${uid}ouroA)"/>
    <polygon points="${hex(R * 0.86)}" fill="url(#${uid}cri)"/>
    <polygon points="${hex(R * 0.86)}" fill="none" stroke="#FFE7B0" stroke-opacity=".5" stroke-width="1.2"/>
    <polygon points="${r2(cx)},${r2(cy - R * 0.86)} ${r2(cx + R * 0.745)},${r2(cy - R * 0.43)} ${r2(cx)},${cy} ${r2(cx - R * 0.745)},${r2(cy - R * 0.43)}" fill="#FFFFFF" fill-opacity=".10"/>
    ${globo}
    <g clip-path="url(#${uid}clip)"><rect class="sweep" x="${cx - R * 0.2}" y="${cy - R * 1.5}" width="${R * 0.32}" height="${R * 3}" fill="#FFF3DC" fill-opacity=".45" transform="rotate(25 ${cx} ${cy})"/></g>
    <path d="M${r2(cx - R * 0.95)} ${r2(by - 2)}L${r2(cx - R * 1.12)} ${r2(by + 16)}L${r2(cx - R * 0.95)} ${r2(by + 14)}Z" fill="#B06C1C"/>
    <path d="M${r2(cx + R * 0.95)} ${r2(by - 2)}L${r2(cx + R * 1.12)} ${r2(by + 16)}L${r2(cx + R * 0.95)} ${r2(by + 14)}Z" fill="#B06C1C"/>
    <path d="M${r2(cx - R * 0.95)} ${r2(by - 12)}Q${cx} ${r2(by - 2)} ${r2(cx + R * 0.95)} ${r2(by - 12)}L${r2(cx + R * 0.95)} ${r2(by + 12)}Q${cx} ${r2(by + 22)} ${r2(cx - R * 0.95)} ${r2(by + 12)}Z" fill="url(#${uid}ban)" stroke="#A9651A" stroke-opacity=".6"/>
    <text x="${cx}" y="${r2(by + 12)}" text-anchor="middle" class="selo">${esc(selo)}</text>`;
}

const raios = (cx, cy, cor, op) => {
  const n = 18, L = 130;
  const t = Array.from({ length: n }, (_, i) => {
    const a1 = (i * 360 / n) * Math.PI / 180, a2 = a1 + (360 / n / 2.4) * Math.PI / 180;
    return `M${cx} ${cy}L${r2(cx + L * Math.cos(a1))} ${r2(cy + L * Math.sin(a1))}L${r2(cx + L * Math.cos(a2))} ${r2(cy + L * Math.sin(a2))}Z`;
  }).join('');
  return `<g mask="url(#mr)"><path class="gira" style="transform-origin:${cx}px ${cy}px" d="${t}" fill="${cor}" fill-opacity="${op}"/></g>`;
};

function quadro(isDark) {
  const t = isDark ? dark : light;
  const W = 1000, gap = 16, CW = (W - 60 - gap * 2) / 3, CH1 = 286, CH2 = 208;
  const H = 14 + CH1 + gap + CH2 + 14;
  const cores = ['#F2A683', '#F4C26B', '#46CF8D'];

  const topo = TITULOS.map((tt, i) => {
    const x = 30 + i * (CW + gap), y = 14, cx = x + CW / 2, cy = y + 108, uid = `t${i}`;
    const corGlow = tt.emblema === 'brasao' ? '#F2A683' : '#F4C26B';
    const emb = tt.emblema === 'brasao'
      ? brasao(uid, cx, cy, 56, tt.selo)
      : medalha(uid, cx, cy - 10, 50, 'ouro', tt.fita);
    const fa = [[-78, -52, 7, .2], [80, -30, 5, 1.1], [64, 52, 6, 1.9], [-70, 40, 4.5, 2.6], [-30, -78, 4, .8]]
      .map(([dx, dy, s, d]) => faisca(cx + dx, cy + dy, s, isDark ? '#FFF1D2' : corGlow, d)).join('');
    return `
  <g class="cd" style="animation-delay:${(i * 0.12).toFixed(2)}s">
    <rect x="${x}" y="${y}" width="${CW}" height="${CH1}" rx="20" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH1}" rx="20" fill="url(#gl${i})"/>
    <rect x="${x + .5}" y="${y + .5}" width="${CW - 1}" height="${CH1 - 1}" rx="20" fill="none" stroke="${corGlow}" stroke-opacity="${isDark ? .32 : .40}"/>
    <g clip-path="url(#cc${i})">${raios(cx, cy, corGlow, isDark ? .16 : .22)}</g>
    <g class="flut" style="animation-delay:${(i * 0.7).toFixed(1)}s">${emb}</g>
    ${fa}
    <text x="${cx}" y="${y + 214}" text-anchor="middle" class="kick" fill="${isDark ? corGlow : '#A8641C'}" xml:space="preserve">${esc(tt.kick)}</text>
    <text x="${cx}" y="${y + 242}" text-anchor="middle" class="tit">${esc(tt.tit)}</text>
    <text x="${cx}" y="${y + 263}" text-anchor="middle" class="sub">${esc(tt.sub)}</text>
  </g>`;
  }).join('');

  const tipos = ['ouro', 'prata', 'bronze'], nomes = [['ouro', 'ouros'], ['prata', 'pratas'], ['bronze', 'bronzes']];
  const fitas = { ouro: ['#F2A683', '#C8553A'], prata: ['#8FB4E8', '#3D6DB5'], bronze: ['#5ED69C', '#1F8A57'] };
  const baixo = CONTAGEM.map((c, i) => {
    const x = 30 + i * (CW + gap), y = 14 + CH1 + gap, cor = cores[i];
    const meds = c.m.map((q, k) => {
      const mx = x + 58 + k * ((CW - 116) / 2), my = y + 108, vazio = q === 0;
      return `<g opacity="${vazio ? .28 : 1}">
      ${medalha(`b${i}${k}`, mx, my, 22, tipos[k], fitas[tipos[k]], { brilho: !vazio })}
      <text x="${mx}" y="${my + 66}" text-anchor="middle" class="qt">${q}</text>
      <text x="${mx + 1}" y="${my + 82}" text-anchor="middle" class="ql">${q === 1 ? nomes[k][0] : nomes[k][1]}</text></g>`;
    }).join('');
    return `
  <g class="cd" style="animation-delay:${(0.36 + i * 0.12).toFixed(2)}s">
    <rect x="${x}" y="${y}" width="${CW}" height="${CH2}" rx="20" fill="${t.card}"/>
    <rect x="${x}" y="${y}" width="${CW}" height="${CH2}" rx="20" fill="url(#gb${i})"/>
    <rect x="${x + .5}" y="${y + .5}" width="${CW - 1}" height="${CH2 - 1}" rx="20" fill="none" stroke="${cor}" stroke-opacity="${isDark ? .26 : .34}"/>
    <text x="${x + CW / 2}" y="${y + 32}" text-anchor="middle" class="kick" fill="${isDark ? cor : '#8C5A1C'}" xml:space="preserve">${esc(c.kick)}</text>
    <text x="${x + CW / 2}" y="${y + 58}" text-anchor="middle" class="tit">${esc(c.tit)}</text>
    ${meds}
  </g>`;
  }).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Quadro de medalhas no judô, em kata. ${TITULOS.map(tt => `${tt.kick.replace(/\s+·\s+/, ' ')}: ${tt.tit}, ${tt.sub}`).join('. ')}. ${CONTAGEM.map(c => `${c.kick.replace(/\s+·\s+/, ' ')}: ${c.tit}, ${c.m[0]} ouros, ${c.m[1]} pratas e ${c.m[2]} bronzes`).join('. ')}.">
  <style>
    ${fontFaces('brico-800', 'brico-500')}
    .kick { font: 700 11px ${FONT}; letter-spacing:1.9px }
    .tit  { font: 500 19px ${DISPLAY}; fill:${t.text}; letter-spacing:-.2px }
    .sub  { font: 400 13px ${FONT}; fill:${t.muted} }
    .selo { font: 800 17px ${DISPLAY}; fill:#6B3A0E }
    .qt   { font: 800 22px ${DISPLAY}; fill:${t.text} }
    .ql   { font: 500 11.5px ${FONT}; fill:${t.muted} }
    .cd { opacity:0; animation: ent .7s cubic-bezier(.2,.7,.3,1) forwards }
    @keyframes ent { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
    .gira { animation: gira 40s linear infinite }
    @keyframes gira { to { transform: rotate(360deg) } }
    .flut { animation: flut 4.5s ease-in-out infinite alternate }
    @keyframes flut { from{transform:translateY(2px)} to{transform:translateY(-4px)} }
    .sweep { animation: sweep 4.8s ease-in-out infinite }
    @keyframes sweep { 0%,55%{transform:translateX(-120px) rotate(25deg)} 85%,100%{transform:translateX(120px) rotate(25deg)} }
    .fa { animation: fa 2.8s ease-in-out infinite; opacity:0 }
    @keyframes fa { 0%,100%{opacity:0;transform:scale(.2)} 45%{opacity:1;transform:scale(1)} 70%{opacity:0;transform:scale(.4)} }
    .meri { transform-box: fill-box; transform-origin:center; animation: meri 3.5s linear infinite }
    @keyframes meri { 0%,100%{transform:scaleX(1)} 50%{transform:scaleX(.12)} }
    @media (prefers-reduced-motion: reduce){ .cd{opacity:1;animation:none} .gira,.flut,.sweep,.meri{animation:none} .fa{opacity:.8;animation:none} }
  </style>
  <defs>
    ${defsGlow('gb', 5)}
    ${['t0', 't1', 't2'].map((u) => defsMetal(`${u}ouro`, METAL.ouro)).join('')}
    ${[0, 1, 2].map((i) => [0, 1, 2].map((k) => defsMetal(`b${i}${k}${tipos[k]}`, METAL[tipos[k]])).join('')).join('')}
    <radialGradient id="mrg"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".3" stop-color="#FFFFFF" stop-opacity=".9"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient>
    ${TITULOS.map((tt, i) => {
      const x = 30 + i * (CW + gap), cx = x + CW / 2, cy = 14 + 108;
      const g = tt.emblema === 'brasao' ? '#F2A683' : '#F4C26B';
      return `<mask id="mr" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}"><rect width="${W}" height="${H}" fill="#000"/>${TITULOS.map((_, j) => `<circle cx="${30 + j * (CW + gap) + CW / 2}" cy="${cy}" r="130" fill="url(#mrg)"/>`).join('')}</mask>`.repeat(i === 0 ? 1 : 0) +
        `<clipPath id="cc${i}"><rect x="${x}" y="14" width="${CW}" height="${CH1}" rx="20"/></clipPath>
    <radialGradient id="gl${i}" cx=".5" cy=".36" r=".62"><stop offset="0" stop-color="${g}" stop-opacity="${isDark ? .26 : .16}"/><stop offset="1" stop-color="${g}" stop-opacity="0"/></radialGradient>`;
    }).join('\n    ')}
    ${cores.map((c, i) => `<radialGradient id="gb${i}" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="${c}" stop-opacity="${isDark ? .16 : .10}"/><stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`).join('')}
  </defs>
  ${topo}
  ${baixo}
</svg>
`;
}

mkdirSync('assets', { recursive: true });
writeFileSync('assets/medalhas-dark.svg', quadro(true));
writeFileSync('assets/medalhas-light.svg', quadro(false));
console.log('assets/medalhas-dark.svg\nassets/medalhas-light.svg');
