// Fonte unica do perfil. Edite aqui e rode `node .github/scripts/build.mjs`.
export const PERFIL = {
  nome: 'Gabriel Vasconcellos Gomes',
  saudacao: '// olá, eu sou o',
  nome1: 'Gabriel',
  nome2: 'Vasconcellos Gomes',
  tagline: ['Dev que gosta de problema real.', 'Faixa preta que refaz até ficar certo.'],
  // cada linha do "editor" do header: [texto, cor]. Cores: k (palavra-chave),
  // v (variavel), p (propriedade), s (texto), n (numero), f (funcao), x (pontuacao)
  codigo: [
    [['const ', 'k'], ['gabriel', 'v'], [' = {', 'x']],
    [['  idade', 'p'], [': ', 'x'], ['20', 'n'], [',', 'x']],
    [['  cidade', 'p'], [': ', 'x'], ['"São Paulo"', 's'], [',', 'x']],
    [['  estuda', 'p'], [': ', 'x'], ['"SI na FIAP"', 's'], [',', 'x']],
    [['  trabalha', 'p'], [': ', 'x'], ['"Dev no Bradesco"', 's'], [',', 'x']],
    [['  stack', 'p'], [': [', 'x'], ['"Java"', 's'], [', ', 'x'], ['"JS"', 's'], [', ', 'x'], ['"UX/UI"', 's'], [', ', 'x'], ['"IA"', 's'], ['],', 'x']],
    [['  judo', 'p'], [': ', 'x'], ['"faixa preta, 4º Mundial"', 's'], [',', 'x']],
    [['};', 'x']],
    [['gabriel', 'v'], ['.', 'x'], ['resolver', 'f'], ['(', 'x'], ['problemaReal', 'v'], [');', 'x']],
  ],
};

// "Sobre mim" em tres colunas. Linhas de texto quebradas a mao (~37 caracteres).
export const SOBRE = [
  { icone: 'pasta', rot: 'HOJE', cor: 'blue',
    tit: 'Bradesco e FIAP',
    txt: ['Estagiário de Desenvolvimento e', 'Sustentação de Sistemas no Bradesco', 'e aluno de Sistemas de Informação', 'na FIAP, turma de 2025 a 2028.'],
    num: '20', sub: 'anos, de São Paulo' },
  { icone: 'codigo', rot: 'NO CÓDIGO', cor: 'violet',
    tit: 'Java, front-end, UX/UI e IA',
    txt: ['Transformo processo manual, planilha', 'em que ninguém confia e dúvida do', 'dia a dia em ferramenta simples,', 'que abre em qualquer máquina.'],
    num: '1º', sub: 'na Global Solution, com a UTOPIA' },
  { icone: 'medalha', rot: 'NO TATAME', cor: 'amber',
    tit: 'Faixa preta de judô',
    txt: ['Campeão sul-americano e', 'pan-americano. Dezesseis anos de', 'tatame me ensinaram a ter calma', 'sob pressão e refazer até dar certo.'],
    num: '4º', sub: 'no Mundial de Kata IJF 2026' },
];

// Cards de projeto. `shot` e uma imagem em assets/shots, embutida no SVG.
export const PROJETOS = [
  {
    id: 'tami', shot: 'tami.jpg',
    cor: { on: '#7C86FF', off: '#3F4ACB' }, cor2: { on: '#B6EC0C', off: '#5E7A00' },
    kicker: 'SAÚDE  ·  GLOBAL SOLUTION 2026',
    titulo: 'Tami',
    selo: 'EM TESTE',
    tagline: 'A agente de saúde que diz para onde ir',
    desc: [
      'Conversa com a pessoa, entende o que ela sente e indica',
      'o caminho: SAMU 192, UPA hoje, UBS ou cuidar em casa.',
      'Não diagnostica. Regras testadas em 10.000 casos simulados.',
    ],
    tags: ['Java 17', 'JDBC', 'PostgreSQL', 'Supabase', 'Render'],
  },
  {
    id: 'protege', shot: 'protege.jpg',
    cor: { on: '#FFB020', off: '#B87400' }, cor2: { on: '#3B9BFF', off: '#1462C4' },
    kicker: 'GOVTECH  ·  HACKGOV E ENTERPRISE CHALLENGE',
    titulo: 'Protege+',
    selo: 'COM A EGESP',
    tagline: 'Canal nacional de denúncias anônimas',
    desc: [
      'Denúncia com geolocalização, áudio e QR Code, mapa de',
      'calor do Brasil e gestão com perfis de acesso. O anonimato',
      'veio antes de tudo, porque quem denuncia é o protagonista.',
    ],
    tags: ['React 18', 'Java', 'Oracle', 'RBAC', 'PT/EN'],
  },
  {
    id: 'utopia', shot: 'utopia.jpg',
    cor: { on: '#22E0D0', off: '#0E9C92' }, cor2: { on: '#8B5CFF', off: '#5B33D6' },
    kicker: 'CIDADES  ·  DADOS DE SATÉLITE',
    titulo: 'UTOPIA',
    selo: 'CAMPEÃ DA GS',
    tagline: 'Inteligência urbana vista do espaço',
    desc: [
      'Cruza dados da NASA e da ESA com o IBGE e dá a cada',
      'município de SP o Índice Utopia, de 0 a 100: infraestrutura,',
      'saúde, educação, área verde e risco de enchente.',
    ],
    tags: ['Java 17', 'Leaflet', 'Canvas', 'HTML/CSS/JS'],
  },
];

export const ITEMS = [
  { ano: '2026', cor: 'blue',
    titulo: 'Global Solution CitizenTech',
    desc: 'Tami, agente de saúde que orienta para onde ir, em fase de teste' },
  { ano: '2026', cor: 'amber',
    titulo: 'Campeonato Mundial de Kata da IJF',
    desc: '4º lugar em Sarajevo, Bósnia e Herzegovina' },
  { ano: '2026', cor: 'cyan',
    titulo: 'HackGov e Enterprise Challenge',
    desc: 'Protege+, plataforma GovTech de denúncias anônimas com a EGESP' },
  { ano: '2026', cor: 'violet',
    titulo: 'Global Solution Space Connect',
    desc: 'Campeão com a UTOPIA, plataforma de inteligência urbana' },
  { ano: '2026', cor: 'red',
    titulo: 'Bradesco',
    desc: 'Estagiário de Desenvolvimento e Sustentação de Sistemas' },
  { ano: '2025', cor: 'pink',
    titulo: 'FIAP',
    desc: 'Bacharelado em Sistemas de Informação, 2025 a 2028' },
  { ano: '2024', cor: 'coral',
    titulo: 'Clube das Ciências Econômicas',
    desc: 'Cofundador, mais de 80h de atividades e visitas à FGV e ao IBMEC' },
  { ano: '2021', cor: 'violet',
    titulo: 'Colégio Presbiteriano Mackenzie',
    desc: 'Ensino médio com Honra Acadêmica, entre os cinco melhores alunos' },
  { ano: '2010', cor: 'green',
    titulo: 'Judô, Associação Alto da Lapa',
    desc: 'Faixa preta, campeão sul e pan-americano, 4º no Mundial de Kata' },
];
