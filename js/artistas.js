/* =====================================================================
   ESTRELAS DO N✦RTE — dados dos artistas
   ---------------------------------------------------------------------
   Cada item do array vira uma estrela no céu. A ordem do array é a ordem
   da travessia: as primeiras estrelas aparecem mais perto do porto.

   Para adicionar um artista, copie o modelo:

   {
     id: 'nome-curto-unico',        // usado no link #artista=...
     nome: 'Nome do artista',
     local: 'Rio Branco — AC',
     area: 'Artes visuais',         // define a cor da estrela
     bio: 'Uma ou duas frases sobre a trajetória.',
     curador: 'Nome de quem curadoriou a indicação', // opcional; aparece no painel
     foto: 'assets/artistas/arquivo.jpg',   // opcional
     links: [
       { rotulo: 'Instagram', url: 'https://...' },
     ],
     obras: [
       {
         titulo: 'Nome da obra',
         ano: '2025',
         tecnica: 'Pintura digital',
         imagem: 'assets/obras/arquivo.jpg', // opcional
         descricao: 'Uma frase sobre a obra.',
         cores: ['#2e6db4', '#071126'],      // usadas no placeholder
       },
     ],
     // Posição opcional no céu: x de 0 a 1 (da esquerda para a direita
     // do percurso) e y de 0 a 1 (do topo até o horizonte). Quando não
     // informada, a estrela é distribuída automaticamente.
     ceu: { x: 0.2, y: 0.3 },
     demo: false,
   }

   As fotos e imagens de obras entram em assets/artistas/ e assets/obras/.
   Enquanto os arquivos não existem, o app mostra um placeholder gerado.
   ===================================================================== */

window.CORES_AREA = {
  'artes visuais': '#ffd21f',
  'muralismo': '#ffd21f',
  'musica': '#ff9f43',
  'literatura': '#7fe0c4',
  'roteiro': '#7fe0c4',
  'danca': '#ff8bb3',
  'teatro': '#c39bff',
  'audiovisual': '#7fb4de',
  'televisao': '#7fb4de',
  'cinema': '#7fb4de',
  'fotografia': '#a8c8ff',
  'artesanato': '#f5c27a',
  'performance': '#ff8bb3',
  'circo': '#c39bff',
  'grafite': '#ff8bb3',
  'arte-educacao': '#f5c27a',
  'humor': '#ffd21f',
  'esporte': '#a8c8ff',
  'moda': '#ff8bb3',
  'beleza': '#ff8bb3',
  'turismo': '#7fe0c4',
  'lifestyle': '#f5c27a',
  'rock': '#e8552f',
  'quadrinhos': '#a8c8ff',
  'criacao de conteudo': '#ff9f43',
};

window.corDaArea = function corDaArea(area) {
  const chave = String(area || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  for (const nome in window.CORES_AREA) {
    if (chave === nome || chave.includes(nome)) return window.CORES_AREA[nome];
  }
  return '#ffd21f';
};

window.ARTISTAS = [
  {
    id: 'ana-caylane',
    nome: 'Ana Caylane',
    local: 'Rio Branco — AC',
    area: 'Artes visuais',
    bio:
      'Artista visual acreana, também conhecida como Ana Cay. Sua releitura de "A Noite Estrelada", ' +
      'de Vincent van Gogh, aproximou os redemoinhos do céu da paisagem do rio Acre e inspirou a atmosfera deste app.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/ilustra_cay/' },
    ],
    obras: [
      {
        titulo: 'A Noite Estrelada (releitura)',
        tecnica: 'Pintura',
        imagem: 'assets/obras/ana-caylane-noite-estrelada.jpg',
        descricao:
          'Releitura da obra de Van Gogh com o céu do Norte, o rio, as casas ribeirinhas e a bandeira do Acre.',
        cores: ['#2e6db4', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'joao-donato',
    nome: 'João Donato',
    local: 'Rio Branco — AC',
    area: 'Música',
    bio:
      'João Donato de Oliveira Neto nasceu em 17 de agosto de 1934, em Rio Branco, e faleceu em 17 de julho de 2023. ' +
      'Pianista, cantor, compositor e arranjador, é um dos grandes nomes da música brasileira, com uma obra que ' +
      'atravessa a bossa nova, o jazz e a MPB, marcada pela leveza e pela escuta da Amazônia.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/joao_donato' },
      { rotulo: 'Spotify', url: 'https://open.spotify.com/artist/17wDxPR2GcU3r1dpCoCiUi' },
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Jo%C3%A3o_Donato' },
      { rotulo: 'Dicionário MPB', url: 'https://dicionariompb.com.br/artista/joao-donato/' },
      {
        rotulo: 'Funarte',
        url: 'https://www.gov.br/funarte/pt-br/assuntos/noticias/todas-noticias/funarte-lamenta-a-morte-de-um-dos-maiores-nomes-da-musica-brasileira-joao-donato',
      },
      {
        rotulo: 'Itaú Cultural',
        url: 'https://www.itaucultural.org.br/secoes/noticias/icone-da-mpb-morre-joao-donato-aos-88-anos',
      },
    ],
    obras: [
      {
        titulo: 'A Rã',
        tecnica: 'Composição',
        descricao: 'Um dos temas mais conhecidos de sua obra instrumental.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'Amazonas',
        tecnica: 'Composição',
        descricao: 'A floresta e o rio na linguagem da música instrumental brasileira.',
        cores: ['#7fe0c4', '#0b2a4a'],
      },
      {
        titulo: 'Lugar Comum',
        tecnica: 'Composição',
        descricao: 'Parceria com Gilberto Gil, gravada por tantas vozes da MPB.',
        cores: ['#ffd21f', '#123a63'],
      },
    ],
    demo: false,
  },
  {
    id: 'joelma',
    nome: 'Joelma',
    local: 'Almeirim — PA',
    area: 'Música',
    bio:
      'Cantora paraense que começou no coral da igreja e aos 19 anos entrou na banda Fazendo Arte. ' +
      'Em 1999 criou a Banda Calypso com Ximbinha e levou o ritmo para todo o Brasil; desde 2016 segue em carreira solo. ' +
      'É conhecida como a Rainha do Calypso, com coreografias marcantes e botas de salto alto.',
    foto: '',
    links: [],
    obras: [
      {
        titulo: 'A Lua Me Traiu',
        tecnica: 'Canção',
        descricao: 'Um dos maiores sucessos da Banda Calypso.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'Pra Te Esquecer',
        tecnica: 'Canção',
        descricao: 'Canção que marcou a fase da Banda Calypso.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
      {
        titulo: 'Isso é Calypso',
        tecnica: 'Canção',
        descricao: 'Registro do ritmo que projetou Joelma nacionalmente.',
        cores: ['#e8552f', '#123a63'],
      },
    ],
    demo: false,
  },
  {
    id: 'viviane-batidao',
    nome: 'Viviane Batidão',
    local: 'Santa Izabel do Pará — PA',
    area: 'Música',
    bio:
      'Cantora e compositora nascida em Santa Izabel do Pará. Começou no coral da igreja e aos 15 anos já se ' +
      'apresentava em bandas da região. Conhecida como Rainha do Tecnomelody, ganhou o Prêmio Multishow 2024 ' +
      'na categoria Melhor Artista do Brasil e teve sua obra reconhecida como patrimônio cultural imaterial do Pará em 2025.',
    foto: '',
    links: [],
    obras: [
      {
        titulo: 'Vem Meu Amor',
        tecnica: 'Canção',
        descricao: 'O sucesso que levou seu trabalho para outros estados.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'Galera da Golada',
        tecnica: 'Canção',
        descricao: 'Um dos hinos do tecnomelody paraense.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
      {
        titulo: 'Olha Bem Pra Mim',
        tecnica: 'Canção',
        descricao: 'Canção de destaque em sua trajetória.',
        cores: ['#7fe0c4', '#123a63'],
      },
      {
        titulo: 'Haja Paciência',
        tecnica: 'Canção',
        descricao: 'Mais um sucesso do repertório de Viviane Batidão.',
        cores: ['#ff8bb3', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'nazare-pereira',
    nome: 'Nazaré Pereira',
    local: 'Xapuri — AC',
    area: 'Música',
    bio:
      'Cantora e compositora nascida em Xapuri, com uma carreira consolidada de divulgação da música amazônica ' +
      'e da cultura brasileira. É conhecida por parcerias como a música "Acre Doce", com Luiz Gonzaga.',
    foto: '',
    links: [],
    obras: [
      {
        titulo: 'Acre Doce',
        tecnica: 'Canção',
        descricao: 'Parceria com Luiz Gonzaga, um encontro entre o Acre e o Nordeste.',
        cores: ['#7fe0c4', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'gleici-damasceno',
    nome: 'Gleici Damasceno',
    local: 'Rio Branco — AC',
    area: 'Televisão',
    bio:
      'Atriz e influenciadora digital acreana. Venceu o Big Brother Brasil 18, desfilou como destaque na ' +
      'Paraíso do Tuiuti e, em 2020, produziu uma série de 8 episódios sobre o Acre para a Netflix.',
    foto: '',
    links: [],
    obras: [
      {
        titulo: 'Série sobre o Acre',
        ano: '2020',
        tecnica: 'Série documental · 8 episódios',
        descricao: 'Produção da Netflix que apresenta histórias e paisagens do Acre.',
        cores: ['#7fb4de', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'jocilene-barroso',
    nome: 'Jocilene Barroso',
    local: 'Rio Branco — AC',
    area: 'Teatro',
    bio:
      'Atriz, produtora cultural, professora e artista visual acreana. Começou no teatro aos 14 anos e, em mais de ' +
      '27 anos de carreira, criou a Oficina de Teatro Expressão (2011) e a Companhia de Teatro Expressão (2013), ' +
      'formando novos artistas e valorizando a cena do Acre.',
    foto: '',
    links: [],
    obras: [
      {
        titulo: 'João e Maria',
        tecnica: 'Espetáculo teatral',
        descricao: 'Montagem dirigida por Jocilene Barroso.',
        cores: ['#c39bff', '#071126'],
      },
      {
        titulo: 'A Bruxinha que era Boa',
        tecnica: 'Espetáculo teatral',
        descricao: 'Montagem dirigida por Jocilene Barroso.',
        cores: ['#ff8bb3', '#0b2a4a'],
      },
      {
        titulo: 'Encontro de Contos',
        tecnica: 'Espetáculo teatral',
        descricao: 'Montagem dirigida por Jocilene Barroso.',
        cores: ['#ffd21f', '#123a63'],
      },
      {
        titulo: 'As Aventuras de Pinóquio',
        tecnica: 'Espetáculo teatral',
        descricao: 'Montagem dirigida por Jocilene Barroso.',
        cores: ['#7fe0c4', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'dannoelly-cardoso',
    nome: 'Dannoelly Cardoso',
    local: 'Pará — PA',
    area: 'Artes visuais / Muralismo',
    bio:
      'Artista visual e muralista paraense. Trabalha com pintura e com temas sociais e ambientais, ' +
      'levando a paisagem e as questões da Amazônia para os muros e para as galerias.',
    foto: '',
    links: [],
    obras: [],
    demo: false,
  },
  {
    id: 'rubens-belem',
    nome: 'Rubens Belém',
    local: 'Pará — PA',
    area: 'Artes visuais',
    bio:
      'Artista autodidata paraense com estilo inspirado em Monet e Van Gogh. Sua pintura retrata a vida ' +
      'ribeirinha e indígena, aproximando a luz impressionista das águas e das matas do Norte.',
    foto: '',
    links: [],
    obras: [],
    demo: false,
  },
  {
    id: 'marilia-bomfim',
    nome: 'Marília Bomfim',
    local: 'Norte — Brasil',
    area: 'Teatro',
    bio:
      'Atriz, diretora, dramaturga e fundadora do Grupo de Teatro (GPT), com forte atuação na circulação de ' +
      'espetáculos e na formação de plateia.',
    foto: '',
    links: [],
    obras: [],
    demo: false,
  },
  {
    id: 'cara-de-sacola',
    nome: 'Cara de Sacola',
    local: 'Norte — Brasil',
    area: 'Grafite',
    bio:
      'Grafiteiro do cenário artístico do Norte. A curadoria está completando a biografia e o portfólio; ' +
      'acompanhe seus trabalhos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/caradesacola/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'vand',
    nome: 'Vand',
    local: 'Norte — Brasil',
    area: 'Grafite',
    bio:
      'Grafiteira do cenário artístico do Norte. A curadoria está completando a biografia e o portfólio; ' +
      'acompanhe seus trabalhos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/vandsmile/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'jailanne-maria',
    nome: 'Jailanne Maria',
    local: 'Acre — Brasil',
    area: 'Arte-educação',
    bio:
      'Artista educadora que atua na interseção entre arte, educação e território. Desenvolve práticas de ' +
      'formação e criação com comunidades do Acre.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/maria.jai_/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'mag',
    nome: 'MAG',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Cantora do cenário musical do Norte. A curadoria está completando a biografia e o repertório; ' +
      'acompanhe seus lançamentos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/cantamag/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'gabrie',
    nome: 'Gabriê',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Cantora do cenário musical do Norte. A curadoria está completando a biografia e o repertório; ' +
      'acompanhe seus lançamentos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/gabrieoficial/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'duda-modesto',
    nome: 'Duda Modesto',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Cantora do cenário musical do Norte. A curadoria está completando a biografia e o repertório; ' +
      'acompanhe seus lançamentos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/dudamodestto/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'ruivinha-de-marte',
    nome: 'Ruivinha de Marte',
    local: 'Norte — Brasil',
    area: 'Humor / Dança / Criação de conteúdo',
    bio:
      'Ficou famosa com vídeos de dança e humor e participou do reality A Fazenda. Também é cantora e criadora ' +
      'de conteúdo, misturando música, humor e internet em uma linguagem própria.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/ruivinhademarte' },
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@ruivinhademarte' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'anderson-guarani',
    nome: 'Anderson Guarani',
    local: 'Norte — Brasil',
    area: 'Música / Criação de conteúdo',
    bio:
      'Cantor e criador de conteúdo do Norte. A curadoria está completando a biografia e o repertório; ' +
      'acompanhe seus vídeos pelo TikTok.',
    foto: '',
    links: [
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@andiiguarani' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'josezinho',
    nome: 'Josezinho',
    local: 'Rio Branco — AC',
    area: 'Humor / Criação de conteúdo',
    bio:
      'José Matheus, o Josezinho, é influenciador e criador de conteúdo de humor e entretenimento. ' +
      'Nascido em Rio Branco, no Acre, construiu uma audiência nas redes com vídeos de entretenimento.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/josezinhor/' },
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@.josezinho' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'banda-scalpo',
    nome: 'Banda Scalpo',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Banda do cenário musical do Norte. Agenda, lançamentos e novidades estão no Instagram oficial.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/scalpoband/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'banda-nicles',
    nome: 'Banda Nicles',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Banda do cenário musical do Norte. Agenda, lançamentos e novidades estão no Instagram oficial.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/niicles/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'banda-los-porongas',
    nome: 'Banda Los Porongas',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Banda do cenário musical do Norte. Agenda, lançamentos e novidades estão no Instagram oficial.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/losporongas_oficial/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'gaby-amarantos',
    nome: 'Gaby Amarantos',
    local: 'Belém — PA',
    area: 'Música',
    bio:
      'Gabriela Amaral dos Santos, a Gaby Amarantos, nasceu em Belém. É cantora, compositora e atriz, conhecida ' +
      'por divulgar o tecnobrega e por misturar o brega com batidas eletrônicas e ritmos amazônicos. Em 2023 ganhou ' +
      'o Grammy Latino com o álbum TecnoShow.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/gabyamarantos' },
    ],
    obras: [
      {
        titulo: 'Ex Mai Love',
        tecnica: 'Canção',
        descricao: 'Um dos maiores sucessos de sua carreira.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'Xirley',
        tecnica: 'Canção',
        descricao: 'Canção que ajudou a projetar o tecnobrega para todo o Brasil.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
      {
        titulo: 'TecnoShow',
        ano: '2023',
        tecnica: 'Álbum',
        descricao: 'Álbum premiado com o Grammy Latino.',
        cores: ['#e8552f', '#123a63'],
      },
    ],
    demo: false,
  },
  {
    id: 'isabelle-nogueira',
    nome: 'Isabelle Nogueira',
    local: 'Manaus — AM',
    area: 'Dança / Criação de conteúdo',
    bio:
      'Dançarina, professora e influenciadora digital nascida em Manaus. Ficou conhecida nacionalmente ao participar ' +
      'do BBB 24, onde conquistou o terceiro lugar. É Cunhã-Poranga do Boi Garantido e uma grande divulgadora do ' +
      'Festival de Parintins e das tradições amazônicas.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/isabellenogueiraoficial/' },
      {
        rotulo: 'Gshow',
        url: 'https://gshow.globo.com/realities/bbb/bbb-24/noticia/isabelle-disputa-vaga-no-bbb24-conheca.ghtml',
      },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'dona-onete',
    nome: 'Dona Onete',
    local: 'Cachoeira do Arari — PA',
    area: 'Música / Literatura',
    bio:
      'Ionete da Silveira Gama, a Dona Onete, nasceu em Cachoeira do Arari, no Pará. É cantora, compositora e ' +
      'poetisa, conhecida como a Rainha do Carimbó Chamegado. Suas músicas misturam ritmos tradicionais e valorizam ' +
      'a cultura, os costumes e as histórias da Amazônia. Começou a carreira solo depois dos 70 anos.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/donaonete/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'anna-suav',
    nome: 'Anna Suav',
    local: 'Manaus — AM',
    area: 'Música / Literatura',
    bio:
      'Cantora, rapper, poeta e compositora nascida em Manaus. Suas músicas abordam identidade negra, valorização ' +
      'das mulheres, desigualdade social e cultura amazônica. É uma das vozes da nova geração de artistas nortistas ' +
      'e divulga a cultura da Amazônia por meio da música e da palavra.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/annasuav' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'vivian-amorim',
    nome: 'Vivian Amorim',
    local: 'Manaus — AM',
    area: 'Televisão / Criação de conteúdo',
    bio:
      'Apresentadora, influenciadora e ex-BBB nascida e criada em Manaus. Formada em Direito, com credenciamento ' +
      'na OAB desde 2015, foi Miss Amazonas 2012 e ficou no TOP 10 do Miss Brasil 2012. Em 2017 foi homenageada ' +
      'pela Assembleia Legislativa do Amazonas e hoje atua com lifestyle e entretenimento.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/amorimvivian' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'huma-kimak',
    nome: 'Huma Kimak',
    local: 'Manaus — AM',
    area: 'Lifestyle / Criação de conteúdo',
    bio:
      'Influenciadora de Manaus focada em lifestyle, maternidade e cotidiano, com uma grande base de seguidores.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/humakimak' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'ramon-dino',
    nome: 'Ramon Dino',
    local: 'Rio Branco — AC',
    area: 'Esporte / Criação de conteúdo',
    bio:
      'Ramon Rocha Queiroz, o Ramon Dino, nasceu em Rio Branco em 9 de fevereiro de 1995. Conhecido como o ' +
      '"Dinossauro do Acre", é um dos maiores nomes do fisiculturismo profissional brasileiro.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/ramondinopro' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'maxine-silva',
    nome: 'Maxine Silva',
    local: 'Acre — AC',
    area: 'Turismo / Criação de conteúdo',
    bio:
      'Influenciadora acreana que divulga a cultura, a história e as belezas naturais do Acre. Em 2026 foi ' +
      'selecionada para um projeto de turismo sustentável na Amazônia.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/silvamaxine' },
      {
        rotulo: 'Notícia',
        url: 'https://contilnetnoticias.com.br/lite/destaque-2/influenciadora-maxine-silva-viraliza-ao-ensinar-o-acreanes-nas-redes-sociais/',
      },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'erick-frota',
    nome: 'Erick Frota (O Caboquinho)',
    local: 'Amazonas — AM',
    area: 'Turismo / Criação de conteúdo',
    bio:
      'Produz conteúdo sobre turismo, história, geografia e festivais dos municípios amazonenses.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/prof.erickfrota' },
      {
        rotulo: 'Notícia',
        url: 'https://www.riosdenoticias.com.br/o-caboquinho-influencer-do-amazonas-mostra-nas-redes-sociais-municipios-do-interior/',
      },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'clysma',
    nome: 'Clysma',
    local: 'Norte — Brasil',
    area: 'Criação de conteúdo',
    bio:
      'Criadora de conteúdo do Norte. A curadoria está completando a biografia e o portfólio; ' +
      'acompanhe seu trabalho pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/clysma' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'willian-de-oliveira',
    nome: 'Willian de Oliveira',
    local: 'Maraã — AM',
    area: 'Humor / Criação de conteúdo',
    bio:
      'Comediante, influenciador digital e ator de stand-up comedy, natural de Maraã, no interior do Amazonas.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/owilliandeoliveira' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'marilia-rodrigues',
    nome: 'Marília Rodrigues',
    local: 'Norte — Brasil',
    area: 'Beleza / Criação de conteúdo',
    bio:
      'Influenciadora que mostra seu dia a dia e dá dicas de cabelo, roupa, maquiagem, beleza e cuidados.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/marilialovesz' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'jennifer-priscilla',
    nome: 'Jennifer Priscilla',
    local: 'Norte — Brasil',
    area: 'Criação de conteúdo',
    bio:
      'Criadora de conteúdo do Norte. A curadoria está completando a biografia; acompanhe seu trabalho pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/jhenniferpriscilla_' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'annejhulie',
    nome: 'Annejhulie',
    local: 'Norte — Brasil',
    area: 'Criação de conteúdo',
    bio:
      'Criadora de conteúdo do Norte. A curadoria está completando a biografia; acompanhe seu trabalho pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/annejhulie_' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'ingrid-ohara',
    nome: 'Ingrid Ohara',
    local: 'Norte — Brasil',
    area: 'Moda / Criação de conteúdo',
    bio:
      'Criadora de conteúdo de moda e entretenimento no TikTok.',
    foto: '',
    links: [
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@ingridohara' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'theulyn-reis',
    nome: 'Theulyn Reis',
    local: 'Norte — Brasil',
    area: 'Criação de conteúdo',
    bio:
      'Criadora de conteúdo conhecida por vídeos criativos que valorizam a cultura e as características dos estados ' +
      'do Norte. Também compartilha rotina, dicas, moda e a construção da sua casa.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/theulynreis' },
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@theulynreis' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'heloisa-dias',
    nome: 'Heloisa Dias',
    local: 'Acre — AC',
    area: 'Moda / Criação de conteúdo',
    bio:
      'Criadora de conteúdo acreana que compartilha moda, beleza, rotina, dicas e lugares do Acre.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/euheloisadiass' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'pedroca',
    nome: 'Pedroca',
    local: 'Norte — Brasil',
    area: 'Humor / Criação de conteúdo',
    bio:
      'Humorista e influenciador. Produz vídeos de humor e entretenimento.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/aapedroca' },
      { rotulo: 'TikTok', url: 'https://www.tiktok.com/@pedroallann' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'smith-gois',
    nome: 'Smith Gois',
    local: 'Norte — Brasil',
    area: 'Humor / Criação de conteúdo',
    bio:
      'Criador de conteúdo de humor e pegadinhas, com grande alcance no TikTok e no Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/smith.gois' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'valentina-coimbra',
    nome: 'Valentina Coimbra',
    local: 'Parintins — AM',
    area: 'Dança / Criação de conteúdo',
    bio:
      'Dançarina, modelo e influenciadora digital. Foi Sinhazinha da Fazenda do Garantido entre 2020 e 2025. ' +
      'Seu conteúdo aborda dança, moda, beleza, bastidores do Festival de Parintins, cultura amazônica e rotina.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/valentinacoimbra' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'valentina-cid',
    nome: 'Valentina Cid',
    local: 'Parintins — AM',
    area: 'Dança / Criação de conteúdo',
    bio:
      'Artista amazonense, dançarina e influenciadora digital. É Sinhazinha da Fazenda do Caprichoso desde 2017. ' +
      'Seu conteúdo aborda dança, cultura amazônica, moda, eventos e bastidores do Caprichoso.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/valentinaacid' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'banda-tribos',
    nome: 'Banda Tribos',
    local: 'Norte — Brasil',
    area: 'Música',
    bio:
      'Banda conhecida pelo estilo brega pop. Sua música mais conhecida é "Gringo Lindo", do álbum ' +
      '"O Swing Tribal do Brega".',
    foto: '',
    links: [
      { rotulo: 'Spotify', url: 'https://open.spotify.com/artist/5dUC2vqDfPl2U3dutK5nMO' },
    ],
    obras: [
      {
        titulo: 'Gringo Lindo',
        tecnica: 'Canção',
        descricao: 'Faixa do álbum "O Swing Tribal do Brega".',
        cores: ['#ffd21f', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'arlinda-banda',
    nome: 'Arlinda Banda',
    local: 'Acre — AC',
    area: 'Rock',
    bio:
      'Banda de rock autoral do Acre.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/arlinda_banda' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'chapeu-de-palha',
    nome: 'Chapéu de Palha',
    local: 'Amazonas — AM',
    area: 'Música / Indie',
    bio:
      'Duo de música indie do Amazonas.',
    foto: '',
    links: [
      { rotulo: 'Spotify', url: 'https://open.spotify.com/artist/14WMxy5IQph8kM1kcrwCcu' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'fluxo-cia-de-artes',
    nome: 'Fluxo Cia de Artes',
    local: 'Norte — Brasil',
    area: 'Dança / Teatro',
    bio:
      'Companhia de dança e teatro do Norte. A curadoria está completando a biografia e o repertório.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/fluxociadeartes' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'raidol',
    nome: 'Raidol',
    local: 'Pará — PA',
    area: 'Música',
    bio:
      'Cantora paraense. A curadoria está completando a biografia e o repertório; ' +
      'acompanhe seus lançamentos pelo Instagram.',
    foto: '',
    links: [
      { rotulo: 'Instagram', url: 'https://www.instagram.com/soraidol/' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'monteirinho',
    nome: 'Monteirinho',
    local: 'Seringal Cachoeira — AC',
    area: 'Música / Ativismo',
    bio:
      'Francisco Monteiro de Morais, o Monteirinho (1949–2025), nasceu no Seringal Cachoeira e foi músico, ' +
      'compositor e ativista acreano. Ao lado de Chico Mendes, deixou um legado na defesa da floresta amazônica. ' +
      'Seus maiores sucessos são "Bicharada" e "A luta não foi em vão".',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Monteirinho' },
    ],
    obras: [
      {
        titulo: 'Bicharada',
        tecnica: 'Canção',
        descricao: 'Um dos maiores sucessos de Monteirinho.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'A luta não foi em vão',
        tecnica: 'Canção',
        descricao: 'Canção ligada à luta pela floresta e aos povos da Amazônia.',
        cores: ['#7fe0c4', '#0b2a4a'],
      },
    ],
    demo: false,
  },
  {
    id: 'tony-bandolim',
    nome: 'Tony Bandolim',
    local: 'Rio Branco — AC',
    area: 'Música / Choro',
    bio:
      'Antônio Carlos do Nascimento, o Tony Bandolim, nasceu em Rio Branco em 1925. É compositor, ' +
      'multi-instrumentista e um dos fundadores do Clube do Choro de Rio Branco e do Instituto Choro da ' +
      'Amazônia (ICA), o primeiro instituto dedicado ao choro no Brasil.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Tony_Bandolim' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'sansao-campos-pereira',
    nome: 'Sansão Campos Pereira',
    local: 'Xapuri — AC',
    area: 'Artes visuais',
    bio:
      'Sansão Campos Pereira (Xapuri, 1919 — Rio de Janeiro, 2014) foi artista plástico, intelectual, ' +
      'engenheiro elétrico e doutor em física. Sua trajetória cruza arte, ciência e pensamento.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Sans%C3%A3o_Campos_Pereira' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'jg-de-araujo-jorge',
    nome: 'J. G. de Araújo Jorge',
    local: 'Tarauacá — AC',
    area: 'Literatura / Poesia',
    bio:
      'José Guilherme de Araújo Jorge (Tarauacá, 1914 — Rio de Janeiro, 1987) foi poeta e político. ' +
      'É uma das vozes da poesia acreana com projeção nacional.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/J._G._de_Ara%C3%BAjo_Jorge' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'jorge-tufic',
    nome: 'Jorge Tufic',
    local: 'Sena Madureira — AC',
    area: 'Literatura / Poesia',
    bio:
      'Jorge Tufic Alaúzo (Sena Madureira, 1930 — São Paulo, 2018) foi poeta e jornalista. ' +
      'Sua obra integra a memória literária do Acre.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Jorge_Tufic' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'pinduca',
    nome: 'Pinduca',
    local: 'Igarapé-Miri — PA',
    area: 'Música / Carimbó',
    bio:
      'Aurino Quirino Gonçalves, o Pinduca, nasceu em Igarapé-Miri em 1937. É cantor, compositor e um dos ' +
      'maiores nomes do carimbó, conhecido como Rei do Carimbó. Seu álbum No Embalo do Pinduca foi indicado ' +
      'ao Grammy Latino em 2017.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Pinduca' },
    ],
    obras: [
      {
        titulo: 'No Embalo do Pinduca',
        ano: '2017',
        tecnica: 'Álbum',
        descricao: 'Álbum indicado ao Grammy Latino de Melhor Álbum de Raízes Brasileiras.',
        cores: ['#ffd21f', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'mestre-verequete',
    nome: 'Mestre Verequete',
    local: 'Quatipuru — PA',
    area: 'Música / Carimbó',
    bio:
      'Augusto Gomes Rodrigues, o Mestre Verequete (Quatipuru, 1916 — Belém, 2009), foi cantor e compositor ' +
      'de carimbó pau e corda, conhecido como Rei do Carimbó. Compôs cerca de 200 músicas e ajudou a projetar ' +
      'o ritmo nacionalmente.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Mestre_Verequete' },
    ],
    obras: [
      {
        titulo: 'O carimbó não morreu',
        tecnica: 'Canção',
        descricao: 'Um dos sucessos do Rei do Carimbó.',
        cores: ['#ff9f43', '#071126'],
      },
      {
        titulo: 'Chama Verequete',
        tecnica: 'Canção',
        descricao: 'Clássico do carimbó pau e corda.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
      {
        titulo: 'Xô peru',
        tecnica: 'Canção',
        descricao: 'Mais um registro do carimbó de raiz paraense.',
        cores: ['#7fe0c4', '#123a63'],
      },
    ],
    demo: false,
  },
  {
    id: 'mestre-cupijo',
    nome: 'Mestre Cupijó',
    local: 'Cametá — PA',
    area: 'Música / Siriá',
    bio:
      'Joaquim Maria Dias de Castro, o Mestre Cupijó (Cametá, 1936 — Belém, 2012), foi músico e compositor. ' +
      'Modernizou o siriá paraense e integrou a geração que levou ritmos do interior do Pará ao rádio.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Mestre_Cupij%C3%B3' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'ismael-nery',
    nome: 'Ismael Nery',
    local: 'Belém — PA',
    area: 'Artes visuais / Pintura',
    bio:
      'Ismael Nery (Belém, 1900 — Rio de Janeiro, 1934) foi pintor, desenhista, arquiteto, filósofo e poeta. ' +
      'Sua obra de influência surrealista tem em Autorretrato (1927) uma imagem icônica.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Ismael_Nery' },
    ],
    obras: [
      {
        titulo: 'Autorretrato',
        ano: '1927',
        tecnica: 'Pintura',
        descricao: 'Uma das obras mais conhecidas do modernismo brasileiro.',
        cores: ['#2e6db4', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'berna-reale',
    nome: 'Berna Reale',
    local: 'Belém — PA',
    area: 'Artes visuais / Performance',
    bio:
      'Berna Reale (Belém, 1965) é artista visual e perita criminal. Usa o corpo em performances e instalações ' +
      'para refletir sobre violência e o contexto sociopolítico. Integrou a representação brasileira na 56ª ' +
      'Bienal de Veneza, em 2015.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Berna_Reale' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'emmanuel-nassar',
    nome: 'Emmanuel Nassar',
    local: 'Capanema — PA',
    area: 'Artes visuais',
    bio:
      'Emmanuel Nassar (Capanema, 1949) é artista plástico. Estudou Arquitetura na UFPA e participou de ' +
      'edições da Bienal de São Paulo e da Bienal de Veneza de 1993.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Emmanuel_Nassar' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'denilson-baniwa',
    nome: 'Denilson Baniwa',
    local: 'Barcelos — AM',
    area: 'Artes visuais / Arte indígena',
    bio:
      'Denilson Baniwa (Barcelos, 1984) é artista do povo Baniwa, curador, comunicador e ativista dos direitos ' +
      'indígenas. Em 2025 recebeu o grau de cavaleiro da Ordem do Mérito Cultural.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Denilson_Baniwa' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'weena-tikuna',
    nome: 'Weena Tikuna',
    local: 'Terra Indígena Umariaçu — AM',
    area: 'Artes visuais / Moda',
    bio:
      'Weena Tikuna (Terra Indígena Umariaçu, 1988) é artista do povo Tikuna. Em 2019 tornou-se a primeira ' +
      'indígena a protagonizar um desfile no Brasil Eco Fashion Week, onde lançou as coleções Éware e No e.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Weena_Tikuna' },
    ],
    obras: [
      {
        titulo: 'Coleção Éware',
        ano: '2019',
        tecnica: 'Moda',
        descricao: 'Coleção apresentada no Brasil Eco Fashion Week.',
        cores: ['#ffd21f', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'milton-hatoum',
    nome: 'Milton Hatoum',
    local: 'Manaus — AM',
    area: 'Literatura',
    bio:
      'Milton Hatoum (Manaus, 1952) é escritor, tradutor e professor, membro da Academia Brasileira de Letras. ' +
      'Entre seus romances estão Relato de um Certo Oriente, Dois Irmãos e Cinzas do Norte.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Milton_Hatoum' },
    ],
    obras: [
      {
        titulo: 'Relato de um Certo Oriente',
        ano: '1989',
        tecnica: 'Romance',
        descricao: 'Romance de estreia de Milton Hatoum.',
        cores: ['#7fe0c4', '#071126'],
      },
      {
        titulo: 'Dois Irmãos',
        ano: '2000',
        tecnica: 'Romance',
        descricao: 'Uma das obras centrais da literatura amazonense.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
      {
        titulo: 'Cinzas do Norte',
        ano: '2005',
        tecnica: 'Romance',
        descricao: 'Vencedor do Prêmio Jabuti e do Prêmio Oceanos.',
        cores: ['#7fb4de', '#123a63'],
      },
    ],
    demo: false,
  },
  {
    id: 'marcio-souza',
    nome: 'Márcio Souza',
    local: 'Manaus — AM',
    area: 'Literatura / Teatro',
    bio:
      'Márcio Souza (Manaus, 1946 — 2024) foi escritor, jornalista, dramaturgo, editor e roteirista. ' +
      'É autor de Galvez, Imperador do Acre, entre outros romances.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/M%C3%A1rcio_Souza' },
    ],
    obras: [
      {
        titulo: 'Galvez, Imperador do Acre',
        ano: '1976',
        tecnica: 'Romance',
        descricao: 'Um marco da literatura amazônica contemporânea.',
        cores: ['#ff9f43', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'thiago-de-mello',
    nome: 'Thiago de Mello',
    local: 'Barreirinha — AM',
    area: 'Literatura / Poesia',
    bio:
      'Thiago de Mello (Barreirinha, 1926 — Manaus, 2022) foi poeta, jornalista e tradutor. É um dos poetas ' +
      'mais influentes da literatura brasileira, com obras como Os Estatutos do Homem e Faz Escuro mas Eu Canto.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Thiago_de_Mello' },
    ],
    obras: [
      {
        titulo: 'Os Estatutos do Homem',
        tecnica: 'Poema',
        descricao: 'Texto emblemático em defesa da dignidade humana.',
        cores: ['#7fe0c4', '#071126'],
      },
      {
        titulo: 'Faz Escuro mas Eu Canto',
        tecnica: 'Livro de poesia',
        descricao: 'Obra marcante da poesia brasileira.',
        cores: ['#ffd21f', '#0b2a4a'],
      },
    ],
    demo: false,
  },
  {
    id: 'patricia-bastos',
    nome: 'Patrícia Bastos',
    local: 'Macapá — AP',
    area: 'Música',
    bio:
      'Patrícia Bastos (Macapá, 1970) é cantora e compositora. Em 2022 tornou-se a primeira amapaense a ' +
      'cantar no Rock in Rio.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Patr%C3%ADcia_Bastos' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'ana-martel',
    nome: 'Ana Martel',
    local: 'Santana — AP',
    area: 'Música',
    bio:
      'Ana Martel (Santana, 1964) é cantora e compositora de música popular brasileira.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Ana_Martel' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'saruzilla',
    nome: 'Saruzilla',
    local: 'Amapá — AP',
    area: 'Quadrinhos / Ilustração',
    bio:
      'Saruzilla, pseudônimo de Lucas Bitencourt, é quadrinista natural do Amapá. Em 2025 lançou a HQ infantil ' +
      'O Menino e a Baleia, inspirada no Museu Sacaca, em Macapá; a obra ganhou o Troféu Angelo Agostini de ' +
      'melhor quadrinho infantil.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Saruzilla' },
    ],
    obras: [
      {
        titulo: 'O Menino e a Baleia',
        ano: '2025',
        tecnica: 'HQ infantil',
        descricao: 'História inspirada no esqueleto de baleia do Museu Sacaca.',
        cores: ['#7fb4de', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'jaquelline',
    nome: 'Jaquelline',
    local: 'Rolim de Moura — RO',
    area: 'Música / Criação de conteúdo',
    bio:
      'Jaqueline Grohalski Brito, a Jaquelline, nasceu em Rolim de Moura em 1994. É cantora e ficou conhecida ' +
      'no BBB 18 e em A Fazenda 15, reality que venceu.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Jaquelline' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'fernando-zor',
    nome: 'Fernando Zor',
    local: 'Ji-Paraná — RO',
    area: 'Música',
    bio:
      'Fernando Zor (Ji-Paraná, 1984) é cantor, compositor, multi-instrumentista e produtor. Forma com ' +
      'Sorocaba a dupla sertaneja Fernando & Sorocaba.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Fernando_Zor' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'vanessa-prieto',
    nome: 'Vanessa Prieto',
    local: 'Ji-Paraná — RO',
    area: 'Teatro / Audiovisual',
    bio:
      'Vanessa Prieto (Ji-Paraná, 1979) é atriz, dramaturga, produtora, escritora e garota-propaganda.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Vanessa_Prieto' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'alex-ferrari',
    nome: 'Alex Ferrari',
    local: 'Ariquemes — RO',
    area: 'Música',
    bio:
      'Alex Ferrari, nome artístico de Levi de Oliveira Silva (Ariquemes, 1982), é cantor, letrista e compositor. ' +
      'Seu sucesso Bara Bará Bere Berê alcançou o primeiro lugar na França em 2012.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Alex_Ferrari' },
    ],
    obras: [
      {
        titulo: 'Bara Bará Bere Berê',
        ano: '2012',
        tecnica: 'Canção',
        descricao: 'Sucesso internacional gravado por vários artistas.',
        cores: ['#ff9f43', '#071126'],
      },
    ],
    demo: false,
  },
  {
    id: 'jaider-esbell',
    nome: 'Jaider Esbell',
    local: 'Normandia — RR',
    area: 'Artes visuais / Literatura',
    bio:
      'Jaider Esbell (Normandia, 1979 — São Paulo, 2021) foi artista, escritor, arte-educador, geógrafo e ' +
      'curador macuxi. Foi um dos destaques da 34ª Bienal de São Paulo e uma voz central da arte indígena ' +
      'contemporânea.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Jaider_Esbell' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'eliakin-rufino',
    nome: 'Eliakin Rufino',
    local: 'Boa Vista — RR',
    area: 'Literatura / Música',
    bio:
      'Eliakin Rufino (Boa Vista, 1956) é poeta, cantor, escritor, professor de filosofia, produtor cultural e ' +
      'jornalista. Integra o movimento Roraimeira, expressão cultural amazônica ligada à identidade de Roraima.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Eliakin_Rufino' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'cristino-wapichana',
    nome: 'Cristino Wapichana',
    local: 'Roraima — RR',
    area: 'Literatura / Audiovisual',
    bio:
      'Cristino Wapichana é músico, compositor, cineasta e escritor indígena premiado, do povo Wapichana.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Cristino_Wapichana' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'eli-brasiliense',
    nome: 'Eli Brasiliense',
    local: 'Pium — TO',
    area: 'Literatura',
    bio:
      'Eli Brasiliense (Pium, 1915 — Goiânia, 1998) foi professor, escritor, filólogo, romancista e ensaísta. ' +
      'Sua obra integra a formação literária do Tocantins.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Eli_Brasiliense' },
    ],
    obras: [],
    demo: false,
  },
  {
    id: 'osvaldo-rodrigues-povoa',
    nome: 'Osvaldo Rodrigues Póvoa',
    local: 'Dianópolis — TO',
    area: 'Literatura / História',
    bio:
      'Osvaldo Rodrigues Póvoa (Dianópolis, 1925 — 2023) foi professor, historiador, ensaísta, cronista e ' +
      'pesquisador. Dedicou-se à memória e à história do Tocantins.',
    foto: '',
    links: [
      { rotulo: 'Wikipédia', url: 'https://pt.wikipedia.org/wiki/Osvaldo_Rodrigues_P%C3%B3voa' },
    ],
    obras: [],
    demo: false,
  },
];
