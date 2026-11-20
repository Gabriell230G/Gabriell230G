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
  { icone: 'pasta', rot: 'HOJE', cor: 'peach',
    tit: 'Bradesco e FIAP',
    txt: ['Estagiário de Desenvolvimento e', 'Sustentação de Sistemas no Bradesco', 'e aluno de Sistemas de Informação', 'na FIAP, turma de 2025 a 2028.'],
    num: '5', sub: 'medalhas de colegas no Bradesco' },
  { icone: 'codigo', rot: 'NO CÓDIGO', cor: 'sage',
    tit: 'Java, front-end, UX/UI e IA',
    txt: ['Transformo processo manual, planilha', 'em que ninguém confia e dúvida do', 'dia a dia em ferramenta simples,', 'que abre em qualquer máquina.'],
    num: '1º', sub: 'na Global Solution, com a UTOPIA' },
  { icone: 'medalha', rot: 'NO TATAME', cor: 'gold',
    tit: 'Faixa preta de judô',
    txt: ['Campeão pan-americano, sul-americano', 'e brasileiro de kata. Dezesseis anos', 'de tatame me ensinaram a ter calma', 'e a refazer até dar certo.'],
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

// Trajetoria, do mais novo para o mais antigo. tipo: trofeu, projeto, trabalho, estudo, judo
export const ITEMS = [
  { ano: '2026', tipo: 'projeto', titulo: 'Tami, na GS CitizenTech', desc: 'Agente de saúde que orienta para onde ir' },
  { ano: '2026', tipo: 'trofeu', titulo: '4º no Mundial de Kata da IJF', desc: 'Nage-no-kata, em Sarajevo' },
  { ano: '2026', tipo: 'projeto', titulo: 'Protege+, no HackGov', desc: 'Denúncias anônimas, em parceria com a EGESP' },
  { ano: '2026', tipo: 'trofeu', titulo: 'Campeão da Global Solution', desc: 'Space Connect, com a UTOPIA' },
  { ano: '2026', tipo: 'judo', titulo: 'Campeão pan-americano de kata', desc: 'Nage-no-kata e Ju-no-kata' },
  { ano: '2026', tipo: 'trabalho', titulo: 'Estágio no Bradesco', desc: 'Desenvolvimento e Sustentação de Sistemas' },
  { ano: '2025', tipo: 'estudo', titulo: 'Entrada na FIAP', desc: 'Sistemas de Informação, 2025 a 2028' },
  { ano: '2024', tipo: 'judo', titulo: 'Campeão sul-americano de kata', desc: 'Nage-no-kata e Ju-no-kata' },
  { ano: '2024', tipo: 'estudo', titulo: 'Clube das Ciências Econômicas', desc: 'Cofundador, com visitas à FGV e ao IBMEC' },
  { ano: '2021', tipo: 'estudo', titulo: 'Colégio Mackenzie', desc: 'Ensino médio com Honra Acadêmica' },
  { ano: '2010', tipo: 'judo', titulo: 'Primeiro dia no tatame', desc: 'Associação Alto da Lapa, hoje faixa preta' },
];

// Quadro de medalhas do judo (kata).
// Linha de cima: os titulos grandes, cada um com um emblema desenhado.
// emblema: 'brasao' (com asas) ou 'medalha'; fita: cores da fita [clara, escura]
export const TITULOS = [
  { emblema: 'brasao', kick: 'MUNDIAL IJF  ·  2026', tit: '4º lugar no mundo', sub: 'Nage-no-kata, em Sarajevo', selo: '4º' },
  { emblema: 'medalha', kick: 'PAN-AMERICANO  ·  2026', tit: 'Campeão', sub: 'Nage-no-kata e Ju-no-kata', fita: ['#F2A683', '#C8553A'] },
  { emblema: 'medalha', kick: 'SUL-AMERICANO  ·  2024', tit: 'Campeão', sub: 'Nage-no-kata e Ju-no-kata', fita: ['#5ED69C', '#1F8A57'] },
];
// Linha de baixo: contagem de medalhas por competicao [ouro, prata, bronze]
export const CONTAGEM = [
  { kick: 'BRASILEIRO  ·  2023 A 2026', tit: '3× campeão brasileiro', m: [5, 0, 1] },
  { kick: 'COPA SÃO PAULO  ·  2023 A 2026', tit: '13 medalhas', m: [8, 2, 3] },
  { kick: 'PAULISTA  ·  2023 A 2026', tit: '9 medalhas', m: [6, 3, 0] },
];

// "Fora do teclado"
export const HOBBIES = [
  { icone: 'faixa', tit: 'Judô', sub: 'faixa preta, desde 2010' },
  { icone: 'claquete', tit: 'Cinéfilo', sub: 'vejo filme demais' },
  { icone: 'cubo', tit: 'Cubo mágico', sub: 'sempre baixando o tempo' },
  { icone: 'tenis', tit: 'Corrida', sub: 'nos fins de semana' },
  { icone: 'globo', tit: 'Termo e Globle', sub: 'e Seterra, todo dia' },
];

// Frases que ficam se revezando no fim do perfil. Quebra de linha manual.
export const FRASES = [
  { l: ['Se vi mais longe, foi por estar', 'sobre os ombros de gigantes.'], a: 'Isaac Newton' },
  { l: ['Se estiver difícil de encontrar pessoas', 'boas no mundo, se torne uma.'] },
  { l: ['Dê-me seis horas para derrubar uma árvore e', 'passarei as quatro primeiras afiando o machado.'], a: 'atribuída a Abraham Lincoln' },
  { l: ['Perder faz parte da mensagem.'] },
  { l: ['Você não nasceu para ser salvo.', 'Você nasceu para salvar outras pessoas.'] },
];

// Tecnologias (icones do Simple Icons, CC0) e o que estou estudando agora
export const TECNOLOGIAS = [
  ['openjdk', 'Java'], ['javascript', 'JavaScript'], ['html5', 'HTML'], ['css', 'CSS'], ['react', 'React'], ['nodedotjs', 'Node.js'],
  ['postgresql', 'PostgreSQL'], ['supabase', 'Supabase'], ['git', 'Git'], ['github', 'GitHub'], ['intellijidea', 'IntelliJ'], ['figma', 'Figma'],
];
export const ESTUDANDO = ['Desenvolvimento de software', 'Inteligência artificial', 'Automação de processos', 'Java', 'Front-end'];
