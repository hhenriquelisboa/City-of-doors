import { MapPreset, Quest } from '../types/rpg';

export const DEFAULT_PRESETS: MapPreset[] = [
  {
    id: 'sigil',
    name: 'Sigil: A Cidade das Portas',
    subtitle: 'A Gaiola · O Centro do Multiverso e dos Planos (Planescape)',
    imageUrl: '/src/assets/images/sigil_city_of_doors_map_1794279350371.jpg',
    streetViewUrl: '/src/assets/images/sigil_street_perspective_1794279349870.jpg',
    scaleUnit: 'Quarteirões',
    scaleDistance: 1,
    gridType: 'hex',
    gridSize: 52,
    initialTokens: [
      {
        id: 'token_lady_of_pain',
        name: 'A Dama da Dor (The Lady of Pain)',
        type: 'monster',
        x: 50.0,
        y: 11.5,
        hp: 999,
        maxHp: 999,
        label: 'Soberana Onipotente de Sigil',
        color: '#dc2626'
      },
      {
        id: 'token_party_planes',
        name: 'Companhia dos Andarilhos Planares',
        type: 'party',
        x: 21.0,
        y: 47.0,
        hp: 55,
        maxHp: 55,
        label: 'Aventureiros no Grande Bazar',
        color: '#f59e0b'
      },
      {
        id: 'token_dabus_1',
        name: 'Dabus (Zelador Mudo de Sigil)',
        type: 'dabus',
        x: 65.0,
        y: 35.0,
        hp: 40,
        maxHp: 40,
        label: 'Comunica-se por Rebustos Flutuantes',
        color: '#10b981'
      },
      {
        id: 'token_harmonium_patrol',
        name: 'Patrulha do Harmonium ("Cabeças-Duras")',
        type: 'npc',
        x: 69.0,
        y: 25.0,
        hp: 75,
        maxHp: 75,
        label: 'Guarda da Ordem Planar',
        color: '#ef4444'
      }
    ],
    initialPins: [
      // 1. THE LADY'S WARD (Distrito da Senhora)
      {
        id: 'pin_prison',
        name: 'A Prisão (The Prison)',
        ward: 'lady',
        wardName: "Distrito da Senhora (The Lady's Ward)",
        category: 'castle',
        x: 74.0,
        y: 31.0,
        shortSummary: 'Quartel-general da facção dos Algozes (Mercykillers). Fortaleza colossal e sem janelas.',
        lore: 'A Prisão é uma massa monolítica de pedra negra polida erguida no coração do Distrito da Senhora. Nenhuma janela se abre para o exterior. Aqueles que entram como condenados raramente retornam; os Algozes acreditam que a justiça absoluta é a única salvação para a decadência moral do multiverso.',
        dangerLevel: 4,
        rulerOrFaction: 'Alisa Lee · Os Algozes (Mercykillers)',
        factions: ['Os Algozes (Mercykillers)', 'Harmonium', 'Fraternidade da Ordem'],
        rumors: [
          'Dizem que um arquidiabo capturado nos Nove Infernos está enjaulado no nível -7, aguardando execução por uma lâmina forjada no Paraíso.',
          'Guardas afirmam escutar cantos fúnebres ecoando dos canos de ventilação na anti-hora (meia-noite).'
        ],
        secretGMNotes: 'Existe um portal oculto sob a cadeira de interrogatório da cela 42 que conduz a Carceri. A chave é uma gota de sangue de um assassino arrependido.',
        loot: ['Correntes de Adamante da Restrição Planar', 'Chave-Mestra das Masmorras', '350 Moedas de Platina'],
        portal: {
          destinationPlane: 'Carceri (Tártaros)',
          destinationLocation: 'Profundezas de Orthrys',
          portalKey: 'Um elo de ferro quebrado na mão de um condenado',
          appearance: 'Grade de esgoto manchada de ferrugem',
          dangerRating: 'Letal'
        },
        isVisibleToPlayers: true,
        color: '#dc2626'
      },
      {
        id: 'pin_high_courts',
        name: 'O Supremo Tribunal de Justiça (The High Courts)',
        ward: 'lady',
        wardName: "Distrito da Senhora (The Lady's Ward)",
        category: 'city',
        x: 67.5,
        y: 28.0,
        shortSummary: 'Sede da Fraternidade da Ordem (Guvners). Julgamentos planares e estudo das leis do cosmos.',
        lore: 'Cercado por colunas esguias encimadas por estátuas com olhos vendados. Os "Guvners" acreditam que se alguém compreender todas as leis do multiverso, poderá dobrar a própria realidade à sua vontade.',
        dangerLevel: 2,
        rulerOrFaction: 'Hashkar, o Juiz Supremo · Fraternidade da Ordem',
        factions: ['Fraternidade da Ordem (Guvners)', 'Harmonium'],
        rumors: [
          'Um julgamento entre um solar de Celestia e um pit fiend de Baator sobre a posse de uma alma mortal está na sua 300ª sessão ininterrupta.'
        ],
        secretGMNotes: 'A biblioteca do tribunal contém cópias das brechas nas leis da Dama da Dor, embora lê-las em voz alta atraia seus Dabus instantaneamente.',
        loot: ['Tomo das Invariantes Planares', 'Selo de Imunidade Diplomática'],
        portal: {
          destinationPlane: 'Mechanus (O Reino das Engrenagens)',
          destinationLocation: 'Cidadela de Delírio Ordenado',
          portalKey: 'Um relógio de bolso que marca exatamente 12:00',
          appearance: 'Porta de bronze de folha dupla com relevos de engrenagens',
          dangerRating: 'Médio'
        },
        isVisibleToPlayers: true,
        color: '#3b82f6'
      },
      {
        id: 'pin_armory',
        name: 'O Arsenal (The Armory)',
        ward: 'lady',
        wardName: "Distrito da Senhora (The Lady's Ward)",
        category: 'danger',
        x: 63.5,
        y: 19.5,
        shortSummary: 'Sede dos Guardiões da Ruína (Doomguard). O maior repositório de armas de cerco e magia destrutiva de Sigil.',
        lore: 'Uma pirâmide octogonal invertida feita de liga de ferro negro que parece desafiar as leis da gravidade. Os Guardiões da Ruína celebram o declínio cósmico e a entropia natural de todas as coisas.',
        dangerLevel: 5,
        rulerOrFaction: 'Ely Cromlich · Guardiões da Ruína (Doomguard)',
        factions: ['Doomguard', 'Mercenários Entrópicos'],
        secretGMNotes: 'No coração do Arsenal repousa a "Bomba Negativa", capaz de colapsar um plano menor inteiro se for ativada.',
        loot: ['Lâmina Vorpal da Decomposição', 'Granadas de Fogo de Entropia', 'Escudo de Ferro Gélido'],
        portal: {
          destinationPlane: 'Plano Quase-Elemental da Cinza',
          destinationLocation: 'Fortaleza da Chama Extinta',
          portalKey: 'Apagar uma vela de cera virgem entre os dedos',
          appearance: 'Arco de ferro calcinado cercado por cinzas volantes',
          dangerRating: 'Alto'
        },
        isVisibleToPlayers: true,
        color: '#8b5cf6'
      },
      {
        id: 'pin_barracks',
        name: 'Quartel-General do Harmonium (City Barracks)',
        ward: 'lady',
        wardName: "Distrito da Senhora (The Lady's Ward)",
        category: 'castle',
        x: 70.0,
        y: 22.0,
        shortSummary: 'Base das tropas da lei marcial ("Cabeças-Duras"). Patrulhas ostensivas e armaduras escarlates.',
        lore: 'O Harmonium acredita que a paz universal só será alcançada quando todas as pessoas pensarem e agirem da mesma forma. Eles usam força esmagadora contra quem ousa causar desordem.',
        dangerLevel: 3,
        rulerOrFaction: 'Sargento Kroll · O Harmonium',
        factions: ['O Harmonium (Cabeças-Duras)'],
        rumors: [
          'O Harmonium está planejando uma batida surpresa na Colmeia para prender simpatizantes da Liga Revolucionária.'
        ],
        secretGMNotes: 'Um infiltrador da Liga Revolucionária (Anarquistas) está roubando relatórios de rotas de patrulha todas as noites.',
        loot: ['Maça Pesada da Harmonia (+1 com dano elétrico)', 'Uniforme e Broche Oficial'],
        isVisibleToPlayers: true,
        color: '#ef4444'
      },

      // 2. THE CLERK'S WARD (Distrito dos Escribas)
      {
        id: 'pin_hall_of_speakers',
        name: 'O Salão dos Oradores (Hall of Speakers)',
        ward: 'clerk',
        wardName: "Distrito dos Escribas (The Clerk's Ward)",
        category: 'city',
        x: 80.5,
        y: 38.0,
        shortSummary: 'Centro do parlamento livre de Sigil e reduto filosófico dos Signatários (Sign of One).',
        lore: 'Edifício com cúpula de mármore translúcido e acústica mágica que projeta qualquer sussurro para milhares de ouvintes. Aqui, os representantes de cada facção disputam decretos e verbas municipais.',
        dangerLevel: 1,
        rulerOrFaction: 'Orador Darius · Signatários (Sign of One)',
        factions: ['Signatários (Sign of One)', 'Fraternidade da Ordem', 'Sensatos'],
        rumors: [
          'Um orador bardo conseguiu convencer metade do senado de que a Dama da Dor era apenas uma ilusão coletiva, até que um Dabus apareceu na galeria.'
        ],
        secretGMNotes: 'A acústica da cúpula funciona como um portal sônico para o Plano Astral se certas palavras ancestrais forem cantadas em ré maior.',
        loot: ['Cetro do Orador Eloquente (+2 em Carisma)', 'Pena de Fênix Escritora'],
        portal: {
          destinationPlane: 'Arcádia',
          destinationLocation: 'Pomar da Lei Perfeita',
          portalKey: 'Um ramo de oliveira prata colhido ao amanhecer',
          appearance: 'Espelho de prata polida no gabinete central',
          dangerRating: 'Baixo'
        },
        isVisibleToPlayers: true,
        color: '#eab308'
      },
      {
        id: 'pin_civic_festhall',
        name: 'O Salão das Festas Cívicas (Civic Festhall)',
        ward: 'clerk',
        wardName: "Distrito dos Escribas (The Clerk's Ward)",
        category: 'wonder',
        x: 84.0,
        y: 50.0,
        shortSummary: 'Sede da Sociedade da Sensação (Sensates). Teatros, concertos planares e gravação de memórias.',
        lore: 'O Festhall nunca fecha suas portas. Ali se encontram galerias de arte extradimensional, banhos de perfumes astrais e as lendárias Pedras Sensoriais, onde qualquer um pode reviver as experiências mais intensas do cosmos.',
        dangerLevel: 2,
        rulerOrFaction: 'Erin Montgomery · Sociedade da Sensação (Sensates)',
        factions: ['Sociedade da Sensação (Sensates)'],
        rumors: [
          'Uma nova pedra sensorial no cofre contém o último pensamento de um deus assassinado no Plano Astral.'
        ],
        secretGMNotes: 'A Dama do Festhall está sendo chantageada por um githyanki que ameaça expor a memória de uma traição.',
        loot: ['Pedra Sensorial Virgem', 'Manto das Sensações Cromáticas', 'Vinho Estelar de Arbórea'],
        portal: {
          destinationPlane: 'Arbórea (O Olimpo)',
          destinationLocation: 'Bosques de Dionísio',
          portalKey: 'Um brinde com vinho tinto e sorrir sinceramente',
          appearance: 'Porta de taverna em arco decorada com parreiras de uvas',
          dangerRating: 'Baixo'
        },
        isVisibleToPlayers: true,
        color: '#ec4899'
      },
      {
        id: 'pin_hall_of_records',
        name: 'O Salão dos Registros (Hall of Records)',
        ward: 'clerk',
        wardName: "Distrito dos Escribas (The Clerk's Ward)",
        category: 'city',
        x: 80.0,
        y: 60.5,
        shortSummary: 'Sede dos Fadados (The Fated / "Cobradores"). O império tributário e cartorial de Sigil.',
        lore: 'Prédio colossal de granito cinza onde dezenas de milhares de escrivães registram títulos de propriedade, cobranças de impostos e registros prediais. Os Fadados ensinam que quem não pode defender sua posse merece perdê-la.',
        dangerLevel: 2,
        rulerOrFaction: 'Duque Rowan Darkwood · Os Fadados (The Fated)',
        factions: ['Os Fadados (The Fated)'],
        secretGMNotes: 'O Duque Rowan Darkwood conspira para se tornar o Rei de Sigil, tentando decifrar o mistério que mantém a Dama da Dor inviolável.',
        loot: ['Contrato Notarial Vinculante Mágico', 'Bolsa de Moedas Planares Infinitas'],
        portal: {
          destinationPlane: 'Ysgard',
          destinationLocation: 'Planalto dos Heróis',
          portalKey: 'Uma moeda de ouro dobrada com os dentes',
          appearance: 'Portão de carvalho com tachas de ferro',
          dangerRating: 'Médio'
        },
        isVisibleToPlayers: true,
        color: '#6366f1'
      },

      // 3. THE GUILDHALL WARD (Distrito das Guildas)
      {
        id: 'pin_great_gymnasium',
        name: 'O Grande Ginásio (The Great Gymnasium)',
        ward: 'guildhall',
        wardName: 'Distrito das Guildas (The Guildhall Ward)',
        category: 'shrine',
        x: 68.0,
        y: 72.0,
        shortSummary: 'Sede da Ordem Transcendente (Cifras). Banhos termais, dojos e meditação do movimento puro.',
        lore: 'As Cifras acreditam que pensar demais desacelera a alma: a ação perfeita é aquela em que corpo e mente agem instantaneamente em harmonia com a pulsação do multiverso.',
        dangerLevel: 1,
        rulerOrFaction: 'Mestre Rhys · Ordem Transcendente (Cifras)',
        factions: ['Ordem Transcendente (Ciphers)'],
        rumors: [
          'Os lutadores do ginásio conseguem desviar de flechas de olhos vendados apenas ouvindo a vibração do anel da cidade.'
        ],
        secretGMNotes: 'Nas profundezas dos banhos termais, a água ferve sem fogo por causa de uma fissura ligada ao Plano do Vapor.',
        loot: ['Faixa da Ação Instantânea (+2 em Iniciativa)', 'Óleos de Regeneração Monástica'],
        portal: {
          destinationPlane: 'Elysium',
          destinationLocation: 'Riberas de Amoria',
          portalKey: 'Respirar fundo três vezes sem pensar em nada',
          appearance: 'Arco de mármore branco sobre uma fonte de água morna',
          dangerRating: 'Baixo'
        },
        isVisibleToPlayers: true,
        color: '#10b981'
      },

      // 4. THE LOWER WARD (Distrito Inferior / Forjas)
      {
        id: 'pin_great_foundry',
        name: 'A Grande Fundição (The Great Foundry)',
        ward: 'lower',
        wardName: 'Distrito Inferior (The Lower Ward)',
        category: 'dungeon',
        x: 44.0,
        y: 69.0,
        shortSummary: 'Sede dos Crentes da Fonte (Deuses-Homens / Godsmen). Forjas titânicas com lava e fumaça de enxofre.',
        lore: 'Um complexo industrial colossal de ferro, chaminés que tocam o céu invertido e caldeiras ruidosas. Os Deuses-Homens acreditam que a vida é uma forja que purifica as almas até que atinjam a divindade.',
        dangerLevel: 3,
        rulerOrFaction: 'Ambar Vergrove · Crentes da Fonte (Godsmen)',
        factions: ['Crentes da Fonte (Godsmen)', 'Guilda dos Ferreiros Planares'],
        rumors: [
          'Armaduras encomendadas aqui foram usadas pelos generais da Guerra de Sangue entre diabos e demônios.'
        ],
        secretGMNotes: 'Existe um portal instável sob a caldeira principal que despeja ferro derretido se um elfo pisar no pedestal.',
        loot: ['Martelo de Forja Divino (+2)', 'Lingote de Adamante Puro', 'Anel de Resistência ao Fogo'],
        portal: {
          destinationPlane: 'Plano Elemental do Fogo',
          destinationLocation: 'A Cidade de Latão (City of Brass)',
          portalKey: 'Um pedaço de carvão em brasa seguro na mão desprotegida',
          appearance: 'Porta de fornalha incandescente com runas ígneas',
          dangerRating: 'Letal'
        },
        isVisibleToPlayers: true,
        color: '#f97316'
      },

      // 5. THE MARKET WARD (Distrito do Mercado)
      {
        id: 'pin_great_bazaar',
        name: 'O Grande Bazar (The Great Bazaar)',
        ward: 'market',
        wardName: 'Distrito do Mercado (The Market Ward)',
        category: 'city',
        x: 18.5,
        y: 46.0,
        shortSummary: 'Sede da Liga Livre (Indeps). O maior mercado a céu aberto de todo o multiverso.',
        lore: 'Tendas de seda, animais exóticos do Plano Astral, barracas de comida tiefling, vendedores de relíquias divinas e mercadores githzerai. A Liga Livre defende a liberdade individual e recusa jurar lealdade a qualquer dogma.',
        dangerLevel: 2,
        rulerOrFaction: 'Conselho de Mercadores Independentes · Liga Livre (Indeps)',
        factions: ['A Liga Livre (Indeps)', 'Mercadores Planares de Toril e Krynn'],
        rumors: [
          'Um comerciante com pele de camaleão está vendendo um mapa que mostra a chave de todos os portais da Colmeia por 500 moedas de ouro.'
        ],
        secretGMNotes: 'A tenda "As Chaves de Janus" é uma fachada para contrabandistas da Liga Revolucionária.',
        loot: ['Mapa de Rotas de Portais de Sigil', 'Bússola Astral', 'Frascos de Especiarias Etéreas'],
        portal: {
          destinationPlane: 'Plano Material Primário (Faerûn)',
          destinationLocation: 'Waterdeep (Porto dos Mares)',
          portalKey: 'Um gole de cerveja anã ao mesmo tempo que se assobia uma valsa',
          appearance: 'Espaço entre duas barracas de tapeçarias roxas',
          dangerRating: 'Baixo'
        },
        isVisibleToPlayers: true,
        color: '#eab308'
      },

      // 6. THE HIVE WARD (Distrito da Colmeia)
      {
        id: 'pin_mortuary',
        name: 'O Necrotério (The Mortuary)',
        ward: 'hive',
        wardName: 'Distrito da Colmeia (The Hive Ward)',
        category: 'dungeon',
        x: 38.0,
        y: 27.0,
        shortSummary: 'Sede dos Poeirentos (Dustmen). Necrópole colossal onde todos os mortos de Sigil são catalogados.',
        lore: 'Massa lúgubre de pedra negra com torres encimadas por gargulas imóveis. Os Poeirentos acreditam que todos nós já estamos mortos e que a vida física é apenas uma ilusão atormentada.',
        dangerLevel: 4,
        rulerOrFaction: 'Skall, o Arquilich · Os Poeirentos (Dustmen)',
        factions: ['Os Poeirentos (Dustmen)', 'Legião dos Zumbis Servos'],
        rumors: [
          'Dizem que um cadáver sem memória acordou recentemente na mesa de necropsia e saiu andando pelas portas da frente (O Sem-Nome!).'
        ],
        secretGMNotes: 'Skall é secretamente um Lich ancião que governa a facção há séculos manipulando registros de cremação.',
        loot: ['Tomo das Almas Silenciosas', 'Frasco de Embalsamamento Mágico', 'Moedas Funerárias de Cobre'],
        portal: {
          destinationPlane: 'Plano de Energia Negativa',
          destinationLocation: 'Túmulo do Vazio',
          portalKey: 'Uma moeda funerária de cobre colocada sob a língua',
          appearance: 'Portão de ferro com esculturas de crânios chorando',
          dangerRating: 'Letal'
        },
        isVisibleToPlayers: true,
        color: '#71717a'
      },
      {
        id: 'pin_gatehouse',
        name: 'O Portão / Manicômio (The Gatehouse)',
        ward: 'hive',
        wardName: 'Distrito da Colmeia (The Hive Ward)',
        category: 'shrine',
        x: 27.5,
        y: 26.5,
        shortSummary: 'Sede da Cabala Desolada (Bleak Cabal / "Os Loucos"). Abrigo para os aflitos e insanos do multiverso.',
        lore: 'Um labirinto gótico cinzento que serve como sanatório e asilo para os indigentes de Sigil. A Cabala ensina que o multiverso não tem sentido algum e que tentar encontrar um propósito só leva à loucura.',
        dangerLevel: 3,
        rulerOrFaction: 'Laran · A Cabala Desolada (Bleak Cabal)',
        factions: ['A Cabala Desolada (Bleak Cabal)'],
        rumors: [
          'Um profeta louco nas celas de isolamento começou a desenhar os rostos exatos de todos os membros do grupo na parede com carvão.'
        ],
        secretGMNotes: 'O sanatório abriga um portal de pesadelo para Pandemônio que emite zumbidos na frequência mental dos loucos.',
        loot: ['Manto do Silêncio Mental', 'Poção de Sanidade Restaurada'],
        portal: {
          destinationPlane: 'Pandemônio',
          destinationLocation: 'As Cavernas Uivantes de Agathion',
          portalKey: 'Gritar com desespero genuíno em um tubo de ensaio',
          appearance: 'Fresta na parede úmida do pátio interno',
          dangerRating: 'Alto'
        },
        isVisibleToPlayers: true,
        color: '#a8a29e'
      },
      {
        id: 'pin_smoldering_corpse',
        name: 'Taverna do Cadáver Fumegante (The Smoldering Corpse Bar)',
        ward: 'hive',
        wardName: 'Distrito da Colmeia (The Hive Ward)',
        category: 'tavern',
        x: 32.0,
        y: 34.0,
        shortSummary: 'A taverna mais infame da Colmeia. O mago Ignus queima suspenso no ar perpetuamente.',
        lore: 'Cheira a cerveja azeda, sangue seco e cinzas ardentes. No centro da sala de estar flutua Ignus, um poderoso feiticeiro condenado por tentar queimar Sigil séculos atrás. Ele arde em fogo contínuo sem nunca morrer.',
        dangerLevel: 3,
        rulerOrFaction: 'Barkis, o Taverneiro Caolho',
        factions: ['Mercenários da Colmeia', 'Bruxas da Noite', 'Ladrões de Tatuagens'],
        rumors: [
          'Se você pagar 10 moedas de prata a Barkis, ele permite que você colete uma das faíscas que caem do corpo de Ignus como ingrediente mágico.'
        ],
        secretGMNotes: 'Barkis esconde um olho de vidro mágico na torneira do barril que registra conversas de clientes.',
        loot: ['Frasco de Fogo de Ignus', 'Caneca de Cerveja da Colmeia', 'Adaga Envenenada de Tiefling'],
        portal: {
          destinationPlane: 'Abismo',
          destinationLocation: 'Planalto dos Espasmos de Ghaunadaur',
          portalKey: 'Sussurrar uma queimação de culpa ou arrependimento',
          appearance: 'Porta dos fundos dos banheiros da taverna',
          dangerRating: 'Letal'
        },
        isVisibleToPlayers: true,
        color: '#f97316'
      },

      // 7. UNDERSIGIL & O ESPIGÃO
      {
        id: 'pin_spire',
        name: 'O Espigão Infinito (The Infinite Spire)',
        ward: 'undersigil',
        wardName: 'O Centro / O Espigão (The Spire)',
        category: 'wonder',
        x: 50.0,
        y: 51.0,
        shortSummary: 'A montanha de altura infinita sobre a qual o anel de Sigil repousa suspenso.',
        lore: 'Erguendo-se do centro das Terras Exteriores (Outlands), o Espigão perfura a abóbada celestial. Em seu topo, onde Sigil flutua, a magia de deuses físicos é completamente anulada pela presença da Dama da Dor.',
        dangerLevel: 5,
        rulerOrFaction: 'A Dama da Dor (The Lady of Pain)',
        secretGMNotes: 'Nenhum ser vivo conseguiu escalar o Espigão pelo lado de fora sem ser desintegrado pelas sombras cortantes da Dama.',
        loot: ['Fragmento de Pedra do Espigão (Anti-Magia Divina)'],
        isVisibleToPlayers: true,
        color: '#64748b'
      },
      {
        id: 'pin_undersigil',
        name: 'Catacumbas do Sub-Sigil (UnderSigil)',
        ward: 'undersigil',
        wardName: 'Sub-Sigil (UnderSigil)',
        category: 'dungeon',
        x: 45.0,
        y: 40.0,
        shortSummary: 'Túneis labirínticos, esgotos arcanos e ruínas esquecidas soterradas pela cidade anelar.',
        lore: 'Abaixo das calçadas de Sigil repousam camadas de civilizações esquecidas. Quando a Dama da Dor reconstrói quarteirões, ela empurra as estruturas antigas para baixo, criando um labirinto eterno infestado de crânios flutuantes, devoradores de mentes e aberrações.',
        dangerLevel: 5,
        rulerOrFaction: 'Os Muitos-Como-Um (Enxame das Ratos de Crânio)',
        factions: ['Ratos de Crânio', 'Ghouls de Dabus Caídos', 'Culto de Aoskar'],
        secretGMNotes: 'As ruínas do Templo de Aoskar, o deus dos portais destruído pela Dama da Dor, ainda retêm uma centelha de poder profano.',
        loot: ['Amuleto da Chave Mestre de Aoskar', 'Cálice de Sangue de Titã'],
        portal: {
          destinationPlane: 'Os Labirintos da Dama (The Mazes)',
          destinationLocation: 'Labirinto Penitencial dos Exilados',
          portalKey: 'Encontrar a única fresta que não tem sombra',
          appearance: 'Fenda estreita na rocha pulsando em violeta',
          dangerRating: 'Letal'
        },
        isVisibleToPlayers: false,
        color: '#a855f7'
      }
    ]
  },
  {
    id: 'aethelia',
    name: 'Crônicas de Aethelia',
    subtitle: 'Reinos do Continente Ocidental · Estilo Pergaminho Ancestral',
    imageUrl: '/src/assets/images/rpg_world_map_parchment_1794278477899.jpg',
    scaleUnit: 'Léguas',
    scaleDistance: 15,
    gridType: 'hex',
    gridSize: 55,
    initialTokens: [
      {
        id: 'party_1',
        name: 'Companhia da Lâmina Prateada',
        type: 'party',
        x: 48.5,
        y: 49.5,
        hp: 42,
        maxHp: 42,
        label: 'Aventureiros',
        color: '#f59e0b'
      }
    ],
    initialPins: [
      {
        id: 'pin_oakhaven',
        name: 'Cidadela de Oakhaven',
        category: 'castle',
        x: 54.5,
        y: 14.5,
        shortSummary: 'Fortaleza ducal do Carvalho Antigo e sede da Ordem da Aurora.',
        lore: 'Erguida sobre rocha viva há mais de seis séculos, Oakhaven nunca caiu diante de um cerco.',
        dangerLevel: 1,
        rulerOrFaction: 'Duque Kaelen Vaelen',
        isVisibleToPlayers: true,
        color: '#3b82f6'
      }
    ]
  },
  {
    id: 'dungeon_altar',
    name: 'Santuário Rúnico Subterrâneo',
    subtitle: 'Battlemap Tático em Grade · 5 pés por quadrado',
    imageUrl: '/src/assets/images/rpg_dungeon_battlemap_1794278477911.jpg',
    scaleUnit: 'Pés (ft)',
    scaleDistance: 5,
    gridType: 'square',
    gridSize: 48,
    initialTokens: [],
    initialPins: []
  }
];

export const INITIAL_QUESTS: Quest[] = [
  {
    id: 'quest_sigil_1',
    title: 'O Portal do Cadáver Fumegante',
    locationId: 'pin_smoldering_corpse',
    giver: 'Barkis, Taverneiro da Colmeia',
    reward: '400 Moedas de Ouro Planares + Chave do Portal de Faerûn',
    status: 'active',
    description: 'Um portal instável no porão do bar está cuspindo vapores sufocantes do Abismo. Encontre a chave correta para selá-lo antes que a Patrulha do Harmonium confisque a taverna.',
    objectives: [
      { text: 'Interrogar os batedores de carteira no Mercado dos Catadores', done: true },
      { text: 'Comprar a Chave de Cinzas de um corretor de portais no Grande Bazar', done: false },
      { text: 'Executar o ritual de selamento na porta dos fundos do bar', done: false }
    ]
  },
  {
    id: 'quest_sigil_2',
    title: 'A Centelha Roubada do Necrotério',
    locationId: 'pin_mortuary',
    giver: 'Coletor de Cadáveres Pharod',
    reward: 'Manto da Proteção Entrópica + 2 Pedras Sensoriais',
    status: 'active',
    description: 'Um corpo no Necrotério trazia uma mensagem gravada nos ossos da costela destinada aos Guardiões da Ruína. Recupere o relatório antes que os Poeirentos o cremem.',
    objectives: [
      { text: 'Entrar disfarçado no Necrotério fingindo ser um zumbi ou visitante de luto', done: false },
      { text: 'Localizar a câmara de preparação nº 3', done: false },
      { text: 'Fazer o decalque dos ossos com carvão mágico', done: false }
    ]
  },
  {
    id: 'quest_sigil_3',
    title: 'A Sombra da Dama no Tribunal',
    locationId: 'pin_high_courts',
    giver: 'Hashkar, Juiz da Fraternidade da Ordem',
    reward: 'Título Honorário de Cidadão Livre + Varinha de Cancelamento Mágico',
    status: 'active',
    description: 'Um clérigo recém-chegado do Plano Material tentou erigir um altar público a uma divindade no Distrito da Senhora. Remova o sacerdote antes que a Dama da Dor apareça e lance todos no Labirinto!',
    objectives: [
      { text: 'Encontrar o clérigo fanático perto do Supremo Tribunal', done: false },
      { text: 'Convencê-lo ou forçá-lo a derrubar o altar imediatamente', done: false },
      { text: 'Evitar o olhar dos Dabus que já estão se aproximando', done: false }
    ]
  }
];

export const PLANAR_PORTALS_GUIDE = [
  {
    name: 'Portal do Necrotério',
    destination: 'Plano de Energia Negativa',
    location: 'Necrotério (Colmeia)',
    key: 'Uma moeda funerária de cobre sob a língua',
    danger: 'Letal'
  },
  {
    name: 'Portal da Fundição',
    destination: 'Cidade de Latão (Plano do Fogo)',
    location: 'A Grande Fundição (Distrito Inferior)',
    key: 'Carvão incandescente segurado na mão',
    danger: 'Letal'
  },
  {
    name: 'Portal do Salão dos Oradores',
    destination: 'Arcádia',
    location: 'Salão dos Oradores (Distrito dos Escribas)',
    key: 'Ramo de oliveira prata colhido ao amanhecer',
    danger: 'Baixo'
  },
  {
    name: 'Portal do Grande Bazar',
    destination: 'Waterdeep (Faerûn)',
    location: 'Grande Bazar (Distrito do Mercado)',
    key: 'Gole de cerveja anã e assobio de uma valsa',
    danger: 'Baixo'
  },
  {
    name: 'Portal da Prisão',
    destination: 'Carceri (Tártaros)',
    location: 'A Prisão (Distrito da Senhora)',
    key: 'Elo de ferro quebrado na mão de um condenado',
    danger: 'Letal'
  },
  {
    name: 'Portal do Ginásio',
    destination: 'Elysium',
    location: 'O Grande Ginásio (Distrito das Guildas)',
    key: 'Respirar fundo três vezes sem pensar em nada',
    danger: 'Baixo'
  },
  {
    name: 'Portal do Sub-Sigil',
    destination: 'Os Labirintos da Dama (The Mazes)',
    location: 'Ruínas do Sub-Sigil',
    key: 'Encontrar a única fresta sem sombra',
    danger: 'Letal'
  }
];

export const CANT_DICTIONARY = [
  { term: 'A Gaiola (The Cage)', meaning: 'Sigil, a Cidade das Portas. Você pode entrar a qualquer momento, mas só sai se tiver a chave certa.' },
  { term: 'A Dama (The Lady)', meaning: 'A Dama da Dor. A senhora de Sigil. Nunca olhe diretamente nos olhos dela, e NUNCA a venere como deusa.' },
  { term: 'Chant', meaning: 'As notícias, informações valiosas, boatos que circulam nas tavernas planares.' },
  { term: 'Dark', meaning: 'O segredo mais profundo e perigoso sobre algo. Saber o Dark pode enriquecer ou matar você.' },
  { term: 'Jink', meaning: 'Moedas, dinheiro vivo, ouro, prata ou platina.' },
  { term: 'Berk', meaning: 'Um tolo que fala demais ou não conhece os perigos dos planos.' },
  { term: 'Primevo (Prime)', meaning: 'Alguém que nasceu em um mundo comum do Plano Material (como Faerûn, Greyhawk ou Krynn).' },
  { term: 'Dabus', meaning: 'Os seres cornudos e mudos que consertam a cidade de Sigil e falam com enigmas visuais flutuantes.' },
  { term: 'Os Labirintos (The Mazes)', meaning: 'Dimensões de bolso criadas pela Dama da Dor para onde ela exila eternamente aqueles que ameaçam a cidade.' },
  { term: 'Pike it', meaning: 'Cai fora; dane-se; esqueça isso.' }
];

export const RANDOM_ENCOUNTERS = {
  forest: [
    'Uma névoa ácida soprada das chaminés da Grande Fundição cobre o quarteirão.',
    'Um Dabus flutuante gesticula furiosamente com rebustos de tesouras e correntes para alertar sobre uma fenda planar.',
    'Patrulha de 4 guardas do Harmonium exigindo documentos de autorização e inspeção de armas.',
    'Um tiefling batedor de carteiras tenta cortar a bolsa de moedas de um dos heróis.',
    'Dois githzerai e um githyanki desembainham espadas de prata no meio da rua iniciando um duelo mortal.'
  ],
  mountain: [
    'A gravidade do anel sofre uma micro-flutuação e objetos soltos caem em direção ao teto invertido.',
    'Um modron perdido de Mechanus caminha em círculos repetindo cálculos numéricos incompreensíveis.',
    'Um comerciante de escravos neogi acompanhado por dois umber hulks vigia a multidão do bazar.',
    'Sussurro estranho vindo de uma porta de celeiro que brilha em luz esmeralda.',
    'Três ratos de crânio com cérebros pulsantes espionam o grupo do topo de uma calha.'
  ],
  swamp: [
    'Cadáver reanimado por necromantes dos Dustmen carregando uma carruagem cheia de ataúdes vazios.',
    'Gritos de horror ecoam das masmorras da Prisão.',
    'Um mendigo cego da Cabala Desolada agarra a túnica do guerreiro e profetiza o apocalipse de um plano.',
    'Vendedores ambulantes oferecendo cerveja de cogumelo do Sub-Sigil e tortas de rato da Colmeia.',
    'Uma sombra com formato de coroa de lâminas projeta-se sobre a parede; silêncio sepulcral toma conta da rua.'
  ],
  desert: [
    'Uma tempestade de cinzas do Plano Elemental do Fogo precipita-se sobre as barracas.',
    'Um diabo espinhado (spinagon) vende pergaminhos de dívidas com desconto.',
    'Caravana de nômades astrais montados em besouros gigantes negociando seda etérea.',
    'Um grupo de Cifras treinando acrobacias em cima dos telhados inclinados.',
    'Portão de carvalho trancado com três cadeados emite calor insuportável.'
  ],
  dungeon: [
    'Uma ratazana de crânio gigante telepática tenta implantar pensamentos de paranóia no mago.',
    'Armadilha de guilhotina enferrujada deixada por construtores antigos.',
    'Fissura no chão revela a rocha viva do Espigão Infinito, onde a magia treme e falha.',
    'Esqueleto vestido com trajes clericais proibidos de um deus esquecido segurando uma chave de osso.',
    'Eco de passos de um Dabus nas profundezas escuras consertando tijolos quebrados.'
  ]
};
