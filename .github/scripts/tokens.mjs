// Sistema de design dos assets do README.
// Uma fonte de verdade para cor, tipo e brilho. Mexa aqui e tudo se ajusta.

export const FONT =
  'system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';

export const dark = {
  bg:        '#05060A',
  bgDeep:    '#020306',
  card:      '#0C0E16',
  cardHi:    '#141826',
  hair:      '#1E2333',
  text:      '#FFFFFF',
  body:      '#C3CADC',
  muted:     '#6C7590',
  rail:      '#1A1F2E',
};

export const light = {
  bg:        '#FFFFFF',
  bgDeep:    '#F4F6FB',
  card:      '#FFFFFF',
  cardHi:    '#F7F9FD',
  hair:      '#E3E8F2',
  text:      '#080A12',
  body:      '#3A4258',
  muted:     '#767F97',
  rail:      '#E3E8F2',
};

// acentos calibrados para brilhar em fundo preto sem estourar no claro
export const accents = {
  red:    { on: '#FF2D55', off: '#D40F35' },
  violet: { on: '#8B5CFF', off: '#5B33D6' },
  cyan:   { on: '#22E0D0', off: '#0E9C92' },
  pink:   { on: '#FF4D9D', off: '#D41A6E' },
  amber:  { on: '#FFB020', off: '#B87400' },
  coral:  { on: '#FF7A5C', off: '#D6462A' },
  green:  { on: '#2BE38A', off: '#0E9B57' },
  blue:   { on: '#3B9BFF', off: '#1462C4' },
  // paleta quente tirada da foto de perfil (pele, fundo, camiseta e o ponto verde)
  peach:  { on: '#F2A683', off: '#B4583A' },
  sand:   { on: '#E9CDAA', off: '#8C6840' },
  sage:   { on: '#46CF8D', off: '#1C8752' },
  clay:   { on: '#D9826A', off: '#A24B33' },
  gold:   { on: '#F4C26B', off: '#A8741A' },
};

export const warm = {
  bg:    '#0D0A09',
  deep:  '#090706',
  brown: '#5A4034',
  taupe: '#8C7A6F',
  text:  '#FBF4EC',
  body:  '#D9C9B9',
};

export const pick = (name, isDark) => accents[name][isDark ? 'on' : 'off'];

// blocos reutilizáveis ------------------------------------------------------

export const defsGlow = (id, blur) =>
  `<filter id="${id}" x="-70%" y="-70%" width="240%" height="240%">
      <feGaussianBlur stdDeviation="${blur}" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;

export const defsWash = (id, color, o1 = 0.55) =>
  `<radialGradient id="${id}" cx=".5" cy=".5" r=".5">
      <stop offset="0" stop-color="${color}" stop-opacity="${o1}"/>
      <stop offset=".55" stop-color="${color}" stop-opacity="${(o1 * 0.38).toFixed(3)}"/>
      <stop offset="1" stop-color="${color}" stop-opacity="0"/>
    </radialGradient>`;

// sangria lateral colorida do card, a ideia das referencias
export const defsBleed = (id, color, o = 0.3) =>
  `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${color}" stop-opacity="${o}"/>
      <stop offset=".22" stop-color="${color}" stop-opacity="${(o * 0.42).toFixed(3)}"/>
      <stop offset=".62" stop-color="${color}" stop-opacity="0"/>
    </linearGradient>`;

export const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
           .replace(/"/g, '&quot;');

// fontes embutidas (subconjunto latino em assets/fonts) ---------------------
import { readFileSync } from 'node:fs';
const FONTES = {
  'brico-800': ['Brico', 800], 'brico-500': ['Brico', 500], 'mono-400': ['JBMono', 400],
};
export const fontFaces = (...ids) => ids.map((id) => {
  const [fam, w] = FONTES[id];
  const b64 = readFileSync(`assets/fonts/${id}.woff2`).toString('base64');
  return `@font-face{font-family:"${fam}";font-weight:${w};src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
}).join('\n    ');
export const DISPLAY = `"Brico", ${FONT}`;
export const MONO = `"JBMono", ui-monospace, "Cascadia Code", Consolas, monospace`;

// degrade quente da paleta: laranja avermelhado ➜ laranja ➜ dourado ➜ verde.
// Interpola em HSL para o meio do caminho nao ficar cor de lama.
const hex2hsl = (h) => {
  const [r, g, b] = [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16) / 255);
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2, d = mx - mn;
  if (!d) return [0, 0, l];
  const s = d / (1 - Math.abs(2 * l - 1));
  const hh = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [(hh * 60 + 360) % 360, s, l];
};
const hsl2hex = ([h, s, l]) => {
  const f = (n) => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
    return Math.round(255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1)))).toString(16).padStart(2, '0'); };
  return ('#' + f(0) + f(8) + f(4)).toUpperCase();
};
const ESCALA = ['clay', 'peach', 'gold', 'sage'];
export const degrade = (i, n, isDark) => {
  const u = n < 2 ? 0 : (i / (n - 1)) * (ESCALA.length - 1);
  const k = Math.min(Math.floor(u), ESCALA.length - 2), f = u - k;
  const a = hex2hsl(pick(ESCALA[k], isDark)), b = hex2hsl(pick(ESCALA[k + 1], isDark));
  return hsl2hex(a.map((v, j) => v + (b[j] - v) * f));
};
