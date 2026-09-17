// Busca os numeros reais na API do GitHub e desenha o painel.
// Nada aqui e digitado a mao, entao nao tem como desatualizar.
import { writeFileSync, mkdirSync } from 'node:fs';
import { FONT, dark, light, accents, pick, defsGlow, defsBleed, esc } from './tokens.mjs';

const USER  = process.env.GH_USER  || 'Gabriell230G';
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
const H_JSON = { 'User-Agent': USER, Accept: 'application/vnd.github+json',
                 ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}) };

async function rest(path) {
  const r = await fetch(`https://api.github.com${path}`, { headers: H_JSON });
  if (!r.ok) throw new Error(`${path} -> ${r.status}`);
  return r.json();
}

async function graphql(query) {
  if (!TOKEN) return null;
  const r = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json', 'User-Agent': USER },
    body: JSON.stringify({ query }),
  });
  if (!r.ok) return null;
  const j = await r.json();
  return j.data ?? null;
}

async function coletar() {
  const user = await rest(`/users/${USER}`);
  let repos = [], page = 1;
  for (;;) {
    const lote = await rest(`/users/${USER}/repos?per_page=100&page=${page}&type=owner`);
    repos = repos.concat(lote);
    if (lote.length < 100) break;
    page++;
  }
  const proprios = repos.filter((r) => !r.fork && !r.private);
  const estrelas = proprios.reduce((s, r) => s + r.stargazers_count, 0);

  // linguagens ponderadas por bytes de codigo
  const bytes = {};
  for (const r of proprios) {
    if (!r.languages_url) continue;
    try {
      const l = await rest(new URL(r.languages_url).pathname);
      for (const [k, v] of Object.entries(l)) bytes[k] = (bytes[k] || 0) + v;
    } catch { /* repo sem linguagem detectada */ }
  }
  const total = Object.values(bytes).reduce((a, b) => a + b, 0) || 1;
  const langs = Object.entries(bytes).sort((a, b) => b[1] - a[1])
    .map(([nome, b]) => ({ nome, pct: (b / total) * 100 }));
  const topo = langs.slice(0, 5);
  const resto = langs.slice(5).reduce((s, l) => s + l.pct, 0);
  if (resto > 0.05) topo.push({ nome: 'Outras', pct: resto });

  const d = await graphql(`{ user(login:"${USER}"){
      contributionsCollection{ contributionCalendar{ totalContributions }
        totalCommitContributions restrictedContributionsCount } } }`);
  const cc = d?.user?.contributionsCollection;

  return {
    repos: proprios.length,
    estrelas,
    contribuicoes: cc?.contributionCalendar?.totalContributions ?? null,
    commits: cc ? cc.totalCommitContributions + (cc.restrictedContributionsCount || 0) : null,
    langs: [], // desligada: o linguist conta JS dentro de .html como HTML
    seguidores: user.followers,
  };
}

const CORES_LANG = ['violet', 'pink', 'cyan', 'amber', 'green', 'blue'];

function build(s, isDark) {
  const t = isDark ? dark : light;
  // Estrelas e seguidores ficam de fora de proposito: sao metricas de
  // popularidade, nao de trabalho, e nao dizem nada sobre quem esta comecando.
  const cards = [
    s.contribuicoes !== null && { v: s.contribuicoes.toLocaleString('pt-BR'), r: 'contribuições em 12 meses', c: 'violet' },
    s.commits !== null && { v: s.commits.toLocaleString('pt-BR'), r: 'commits no último ano', c: 'cyan' },
    { v: String(s.repos), r: s.repos === 1 ? 'repositório público' : 'repositórios públicos', c: 'pink' },
  ].filter(Boolean);

  const W = 1000, CW = Math.floor((W - 60 - 20 * (cards.length - 1)) / cards.length), CH = 128;
  const H = 30 + CH + (s.langs.length ? 40 + 16 + 34 + 26 : 30);

  const cardEls = cards.map((c, i) => {
    const x = 30 + i * (CW + 20), col = pick(c.c, isDark);
    return `
    <g>
      <rect x="${x}" y="30" width="${CW}" height="${CH}" rx="16" fill="${t.card}"/>
      <rect x="${x}" y="30" width="${CW}" height="${CH}" rx="16" fill="url(#bl${i})"/>
      <rect x="${x}" y="30" width="${CW}" height="${CH}" rx="16" fill="none" stroke="${col}" stroke-opacity="${isDark ? .34 : .26}"/>
      <rect x="${x}" y="${30 + 10}" width="4" height="${CH - 20}" rx="2" fill="${col}" filter="url(#gb)"/>
      <text x="${x + 30}" y="${30 + 62}" class="num" fill="${col}">${esc(c.v)}</text>
      <text x="${x + 30}" y="${30 + 92}" class="rot">${esc(c.r)}</text>
    </g>`;
  }).join('');

  const barY = 30 + CH + 40;
  let bx = 30;
  const barW = W - 60;
  const segs = s.langs.map((l, i) => {
    const w = Math.max(3, (l.pct / 100) * barW);
    const el = `<rect x="${bx.toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="16" fill="${pick(CORES_LANG[i % 6], isDark)}"/>`;
    bx += w;
    return el;
  }).join('');

  let lx = 30;
  const legenda = s.langs.map((l, i) => {
    const col = pick(CORES_LANG[i % 6], isDark);
    const txt = `${l.nome} ${l.pct.toFixed(1)}%`;
    const el = `<g><circle cx="${lx + 5}" cy="${barY + 44}" r="4.5" fill="${col}" filter="url(#gd)"/>
      <text x="${lx + 17}" y="${barY + 48}" class="leg">${esc(txt)}</text></g>`;
    lx += 30 + txt.length * 6.9;
    return el;
  }).join('');

  const bleeds = cards.map((c, i) => defsBleed(`bl${i}`, pick(c.c, isDark), isDark ? 0.28 : 0.12)).join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Estatísticas do GitHub: ${cards.map(c => `${c.v} ${c.r}`).join(', ')}. Linguagens: ${s.langs.map(l => `${l.nome} ${l.pct.toFixed(1)}%`).join(', ')}">
  <style>
    .num { font: 800 46px ${FONT}; letter-spacing:-1.6px }
    .rot { font: 500 13.5px ${FONT}; fill:${t.muted} }
    .leg { font: 500 12.5px ${FONT}; fill:${t.body} }
  </style>
  <defs>${defsGlow('gb', 5)}${defsGlow('gd', 3)}${bleeds}
    <clipPath id="barra"><rect x="30" y="${barY}" width="${barW}" height="16" rx="8"/></clipPath>
  </defs>
  <rect width="${W}" height="${H}" fill="${t.bg}" rx="18"/>
  ${cardEls}
  ${s.langs.length ? `<g clip-path="url(#barra)"><rect x="30" y="${barY}" width="${barW}" height="16" fill="${t.hair}"/>${segs}</g>${legenda}` : ''}
</svg>
`;
}

const MOCK = process.env.STATS_MOCK;
const s = MOCK ? JSON.parse(MOCK) : await coletar();
if (MOCK) console.error('!! modo preview: numeros vieram de STATS_MOCK, nao da API');
mkdirSync('assets', { recursive: true });
writeFileSync('assets/stats-dark.svg', build(s, true));
writeFileSync('assets/stats-light.svg', build(s, false));
console.log(JSON.stringify({ ...s, langs: s.langs.map(l => `${l.nome} ${l.pct.toFixed(1)}%`) }, null, 1));
