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
