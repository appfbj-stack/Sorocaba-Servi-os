import {
  City,
  ServiceCategory,
  User,
  Professional,
  Business,
  ServiceRequest,
  Review,
  AuditLog
} from '../types.ts';

export const INITIAL_CITIES: City[] = [
  {
    id: 'cid-sorocaba',
    nome: 'Sorocaba',
    estado: 'SP',
    slug: 'sorocaba',
    ativo: true,
    cidadePrincipal: true,
    bairros: [
      'Campolim',
      'Centro',
      'Wanel Ville',
      'Além Ponte',
      'Trujillo',
      'Éden',
      'Zona Industrial',
      'Santa Rosália',
      'Vila Hortência',
      'Mangal',
      'Jardim dos Estados',
      'Vila Carvalho',
      'Vila Santana',
      'Jardim Paulistano',
      'Vila Lucy',
      'Brigadeiro Tobias',
      'Vila Progresso',
      'Jardim América'
    ]
  },
  {
    id: 'cid-votorantim',
    nome: 'Votorantim',
    estado: 'SP',
    slug: 'votorantim',
    ativo: true,
    cidadePrincipal: false,
    bairros: ['Parque Bela Vista', 'Centro', 'Vossoroca', 'Rio Acima', 'Jardim Icatu']
  },
  {
    id: 'cid-itu',
    nome: 'Itu',
    estado: 'SP',
    slug: 'itu',
    ativo: true,
    cidadePrincipal: false,
    bairros: ['Centro', 'Cidade Nova', 'Rancho Grande', 'Itu Novo Centro']
  },
  {
    id: 'cid-salto',
    nome: 'Salto',
    estado: 'SP',
    slug: 'salto',
    ativo: true,
    cidadePrincipal: false,
    bairros: ['Centro', 'Jardim Saltense', 'Jardim Marília', 'Distrito Industrial']
  }
];

export const INITIAL_CATEGORIES: ServiceCategory[] = [
  {
    id: 'cat-limpeza',
    nome: 'Limpeza e Diaristas',
    slug: 'limpeza',
    icone: 'Sparkles',
    descricao: 'Diaristas, faxina pós-obra, limpeza residencial, comercial e de estofados.',
    popular: true,
    servicosPadrao: ['Diarista Residencial', 'Faxina Pós-Obra', 'Limpeza Comercial', 'Higienização de Sofás e Colchões', 'Passadeira']
  },
  {
    id: 'cat-eletrica',
    nome: 'Eletricista',
    slug: 'eletricistas',
    icone: 'Zap',
    descricao: 'Instalações elétricas, troca de disjuntores, chuveiros, fiação e padrão CPFL.',
    popular: true,
    servicosPadrao: ['Instalação de Chuveiro', 'Troca de Fiação', 'Instalação de Tomadas e Interruptores', 'Quadro de Distribuição', 'Instalação de Luminárias e Lustres', 'Padrão CPFL']
  },
  {
    id: 'cat-hidraulica',
    nome: 'Encanador e Hidráulica',
    slug: 'encanadores',
    icone: 'Droplets',
    descricao: 'Caça-vazamentos, conserto de descargas, torneiras, registros e desentupimento.',
    popular: true,
    servicosPadrao: ['Conserto de Torneiras e Registros', 'Caça-Vazamentos', 'Instalação de Vaso Sanitário', 'Desentupimento de Pias e Ralos', 'Troca de Sifão e Vedações']
  },
  {
    id: 'cat-manutencao',
    nome: 'Manutenção & Marido de Aluguel',
    slug: 'marido-de-aluguel',
    icone: 'Wrench',
    descricao: 'Pequenos reparos, montagem de móveis, furações, instalação de cortinas e fechaduras.',
    popular: true,
    servicosPadrao: ['Montagem e Desmontagem de Móveis', 'Instalação de Cortinas e Persianas', 'Suporte de TV na Parede', 'Troca de Fechaduras e Maçanetas', 'Pequenos Reparos Gerais']
  },
  {
    id: 'cat-beleza',
    nome: 'Beleza & Estética',
    slug: 'beleza',
    icone: 'Scissors',
    descricao: 'Manicures, cabeleireiros, maquiadoras, sobrancelhas e depilação a domicílio.',
    popular: true,
    servicosPadrao: ['Manicure e Pedicure', 'Corte e Escova', 'Design de Sobrancelhas', 'Maquiagem Profissional', 'Barbeiro a Domicílio', 'Alongamento de Cílios']
  },
  {
    id: 'cat-climatizacao',
    nome: 'Ar-Condicionado & Clima',
    slug: 'ar-condicionado',
    icone: 'Wind',
    descricao: 'Instalação, higienização completa, recarga de gás e conserto de ar-condicionado.',
    popular: true,
    servicosPadrao: ['Instalação de Split', 'Higienização e Limpeza Química', 'Carga de Gás R410/R32', 'Manutenção Preventiva', 'Conserto de Placa Eletrônica']
  },
  {
    id: 'cat-reforma',
    nome: 'Reforma & Construção',
    slug: 'pedreiros-reforma',
    icone: 'Hammer',
    descricao: 'Pedreiros, azulejistas, gesseiros, pintores residenciais e calheiros.',
    popular: true,
    servicosPadrao: ['Pintura Residencial Interna/Externa', 'Assentamento de Pisos e Porcelanato', 'Alvenaria e Pequenas Reformas', 'Gesso e Drywall', 'Reparo de Telhados e Calhas']
  },
  {
    id: 'cat-automotivo',
    nome: 'Automotivo & Mecânica',
    slug: 'mecanica-automotiva',
    icone: 'Car',
    descricao: 'Mecânicos a domicílio, socorro de bateria, autoelétrica, troca de pneus e estética.',
    popular: true,
    servicosPadrao: ['Troca de Bateria com Entrega', 'Socorro Mecânico Emergencial', 'Polimento e Cristalização', 'Higienização Interna Automotiva', 'Diagnóstico Eletrônico']
  },
  {
    id: 'cat-pet',
    nome: 'Pet & Veterinária',
    slug: 'pet-shops',
    icone: 'HeartHandshake',
    descricao: 'Banho e tosa a domicílio, passeador de cães (dog walker), adestradores e pet sitting.',
    popular: true,
    servicosPadrao: ['Banho e Tosa em Casa', 'Dog Walker / Passeios Diários', 'Pet Sitter em Domicílio', 'Adestramento Básico', 'Consulta Veterinária Domiciliar']
  },
  {
    id: 'cat-tecnologia',
    nome: 'Assistência de Celular & TI',
    slug: 'assistencia-celular',
    icone: 'Smartphone',
    descricao: 'Troca de tela, conector de carga, formatação de computadores e configuração de Wi-Fi.',
    popular: true,
    servicosPadrao: ['Troca de Tela de Celular', 'Troca de Bateria de Smartphone', 'Formatação e Instalação de SSD', 'Configuração de Rede Wi-Fi e Roteador', 'Recuperação de Dados']
  },
  {
    id: 'cat-jardinagem',
    nome: 'Jardinagem & Paisagismo',
    slug: 'jardinagem',
    icone: 'Trees',
    descricao: 'Corte de grama, poda de árvores, adubação, manutenção de jardins e limpeza de terrenos.',
    popular: false,
    servicosPadrao: ['Corte de Grama e Roçada', 'Poda de Cercas Vivas', 'Manutenção Mensal de Jardim', 'Limpeza e Tratamento de Piscina', 'Adubação e Controle de Pragas']
  },
  {
    id: 'cat-mudancas',
    nome: 'Fretes & Mudanças',
    slug: 'fretes-mudancas',
    icone: 'Truck',
    descricao: 'Carretos rápidos em Sorocaba e região, mudanças residenciais e montagem inclusa.',
    popular: false,
    servicosPadrao: ['Carreto Urbano Sorocaba', 'Mudança Residencial Completa', 'Transporte de Móveis e Eletros', 'Frete para Votorantim e Região', 'Içamento de Móveis']
  },
  {
    id: 'cat-esquadrias-blindex',
    nome: 'Esquadrias de Alumínio & Blindex',
    slug: 'esquadrias-aluminio-blindex',
    icone: 'AppWindow',
    descricao: 'Instalação e manutenção de esquadrias de alumínio sob medida, box blindex, vidros temperados, portas, janelas e fechamento de sacadas.',
    popular: true,
    servicosPadrao: [
      'Instalação de Box Blindex',
      'Esquadrias de Alumínio Sob Medida',
      'Portas e Janelas de Alumínio (Linha Suprema e Gold)',
      'Fechamento de Sacada e Varanda em Vidro',
      'Manutenção e Troca de Roldanas, Fechos e Guias',
      'Instalação de Guarda-Corpo de Vidro e Alumínio',
      'Espelhos Lapidados e Bisotados para Banheiro e Sala',
      'Substituição de Vidro Quebrado e Vedações de Silicone'
    ]
  },
  {
    id: 'cat-ajudantes',
    nome: 'Ajudantes, Carga & Diárias',
    slug: 'ajudantes-servicos-gerais',
    icone: 'Boxes',
    descricao: 'Ajudantes para descarregar caminhão, carga e descarga, entregas rápidas, panfletagem de eleições e eventos, e diárias gerais.',
    popular: true,
    servicosPadrao: [
      'Ajudante para Descarregar Caminhão',
      'Carga e Descarga de Mercadorias e Móveis',
      'Auxiliar de Entregas Rápidas e Logística',
      'Panfletagem (Eleições, Comércio e Eventos)',
      'Ajudante de Mudança e Carga Pesada',
      'Diária de Ajudante de Serviços Gerais',
      'Organização de Estoque, Galpão e Depósito'
    ]
  },
  {
    id: 'cat-pedreiro',
    nome: 'Pedreiros & Alvenaria',
    slug: 'pedreiros-alvenaria',
    icone: 'HardHat',
    descricao: 'Pedreiros especializados em alvenaria, construção de muros, reboco, contrapiso, assentamento de blocos e reformas completas.',
    popular: true,
    servicosPadrao: [
      'Construção de Muros e Alvenaria',
      'Reboco, Chapisco e Emboço',
      'Contrapiso e Regularização de Piso',
      'Assentamento de Tijolos e Blocos de Concreto',
      'Pequenas Reformas e Quebradeira',
      'Estrutura de Concreto, Viga e Baldrame',
      'Pedreiro por Diária ou Empreitada'
    ]
  }
];

// 20 realistic Sorocaba clients
export const INITIAL_CLIENTS: User[] = [
  {
    id: 'cli-1',
    nome: 'Mariana Silva Borges',
    email: 'mariana.silva@exemplo.com.br',
    telefone: '(15) 99123-4567',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-01-10T10:30:00Z'
  },
  {
    id: 'cli-2',
    nome: 'Ricardo Antunes Mendes',
    email: 'ricardo.mendes@exemplo.com.br',
    telefone: '(15) 99781-2244',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-01-14T14:15:00Z'
  },
  {
    id: 'cli-3',
    nome: 'Beatriz Vasconcelos',
    email: 'beatriz.v@exemplo.com.br',
    telefone: '(15) 99654-8899',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Além Ponte',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-01-18T09:00:00Z'
  },
  {
    id: 'cli-4',
    nome: 'Felipe Camargo',
    email: 'felipe.camargo@exemplo.com.br',
    telefone: '(15) 98112-3344',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Trujillo',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-01-20T11:45:00Z'
  },
  {
    id: 'cli-5',
    nome: 'Camila Toledo Ferreira',
    email: 'camila.toledo@exemplo.com.br',
    telefone: '(15) 99765-4321',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Mangal',
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-01-25T16:20:00Z'
  },
  {
    id: 'cli-6',
    nome: 'Rodrigo Paes de Almeida',
    email: 'rodrigo.paes@exemplo.com.br',
    telefone: '(15) 99887-1122',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Santa Rosália',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-01T08:10:00Z'
  },
  {
    id: 'cli-7',
    nome: 'Larissa Albuquerque',
    email: 'larissa.a@exemplo.com.br',
    telefone: '(15) 99144-5566',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Jardim dos Estados',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-03T10:00:00Z'
  },
  {
    id: 'cli-8',
    nome: 'Gustavo Henrique Leite',
    email: 'gustavo.leite@exemplo.com.br',
    telefone: '(15) 99632-1144',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    avatarUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-05T13:40:00Z'
  },
  {
    id: 'cli-9',
    nome: 'Juliana Prado Rossi',
    email: 'juliana.rossi@exemplo.com.br',
    telefone: '(15) 98145-7788',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Vila Hortência',
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-08T15:30:00Z'
  },
  {
    id: 'cli-10',
    nome: 'Danilo Santos Queiroz',
    email: 'danilo.queiroz@exemplo.com.br',
    telefone: '(15) 99712-9900',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Jardim Paulistano',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-10T11:15:00Z'
  },
  {
    id: 'cli-11',
    nome: 'Tatiane Neves Costa',
    email: 'tatiane.costa@exemplo.com.br',
    telefone: '(15) 99188-7744',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    avatarUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-12T09:45:00Z'
  },
  {
    id: 'cli-12',
    nome: 'Lucas Gabriel Moreira',
    email: 'lucas.moreira@exemplo.com.br',
    telefone: '(15) 99655-3322',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Vila Lucy',
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-15T14:50:00Z'
  },
  {
    id: 'cli-13',
    nome: 'Renata Lemos Siqueira',
    email: 'renata.lemos@exemplo.com.br',
    telefone: '(15) 98166-4411',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-18T16:05:00Z'
  },
  {
    id: 'cli-14',
    nome: 'Bruno Carvalho Ramos',
    email: 'bruno.c.ramos@exemplo.com.br',
    telefone: '(15) 99778-9922',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Além Ponte',
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-20T10:10:00Z'
  },
  {
    id: 'cli-15',
    nome: 'Priscila Correa Diniz',
    email: 'priscila.diniz@exemplo.com.br',
    telefone: '(15) 99199-0011',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Santa Rosália',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-22T13:25:00Z'
  },
  {
    id: 'cli-16',
    nome: 'Marcio Azevedo Lima',
    email: 'marcio.lima@exemplo.com.br',
    telefone: '(15) 99611-2233',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Mangal',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-24T15:00:00Z'
  },
  {
    id: 'cli-17',
    nome: 'Vanessa Morais Prado',
    email: 'vanessa.prado@exemplo.com.br',
    telefone: '(15) 98122-8877',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Jardim América',
    avatarUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-02-26T11:30:00Z'
  },
  {
    id: 'cli-18',
    nome: 'Thiago Fogaça Vieira',
    email: 'thiago.fogaca@exemplo.com.br',
    telefone: '(15) 99744-5511',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-03-01T08:40:00Z'
  },
  {
    id: 'cli-19',
    nome: 'Aline Pires Santana',
    email: 'aline.santana@exemplo.com.br',
    telefone: '(15) 99133-6622',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-03-03T10:15:00Z'
  },
  {
    id: 'cli-20',
    nome: 'Eduardo Martins Bueno',
    email: 'eduardo.bueno@exemplo.com.br',
    telefone: '(15) 99677-8899',
    role: 'cliente',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    criadoEm: '2026-03-05T14:00:00Z'
  }
];

// 20 realistic professionals across categories with WhatsApp, ratings, trial plan, neighborhoods
export const INITIAL_PROFESSIONALS: Professional[] = [
  {
    id: 'pro-1',
    usuarioId: 'usr-pro-1',
    nome: 'Carlos Eduardo Oliveira',
    tituloProfissional: 'Eletricista Residencial & Predial Credenciado',
    fotoUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-eletrica',
    servicos: ['Instalação de Chuveiro', 'Troca de Fiação', 'Padrão CPFL', 'Quadro de Disjuntores', 'Iluminação LED'],
    descricao: 'Eletricista com mais de 12 anos de experiência em Sorocaba. Especialista em conformidade NR-10, quadros bifásicos/trifásicos, troca de fiações antigas e eliminação de curto-circuitos.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Centro', 'Mangal', 'Trujillo', 'Wanel Ville', 'Além Ponte'],
    whatsapp: '5515997123456',
    telefone: '(15) 99712-3456',
    horarioAtendimento: 'Segunda a Sábado, das 07:30 às 19:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 48,
    portfolio: [
      {
        id: 'port-1',
        titulo: 'Reforma de Quadro de Disjuntores',
        descricao: 'Substituição completa de disjuntores antigos NEMA por padrão DIN com DR e DPS no Campolim.',
        fotoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'port-2',
        titulo: 'Iluminação de Sanca e Perfil de LED',
        descricao: 'Instalação de fitas LED COB e automação em apartamento no Jardim Paulistano.',
        fotoUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-01T00:00:00Z',
      dataTermino: '2026-07-01T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-01T10:00:00Z'
  },
  {
    id: 'pro-2',
    usuarioId: 'usr-pro-2',
    nome: 'Maria de Fátima Rezende',
    tituloProfissional: 'Diarista Especialista & Organização Residencial',
    fotoUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-limpeza',
    servicos: ['Diarista Residencial', 'Faxina Pesada Pós-Mudança', 'Organização de Armários', 'Passadeira Profissional'],
    descricao: 'Mais de 10 anos atendendo famílias exigentes em Sorocaba. Pontual, caprichosa e com excelentes referências no Campolim e Santa Rosália.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Santa Rosália', 'Jardim dos Estados', 'Centro', 'Mangal'],
    whatsapp: '5515998124578',
    telefone: '(15) 99812-4578',
    horarioAtendimento: 'Segunda a Sexta, das 08:00 às 17:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 62,
    portfolio: [
      {
        id: 'port-3',
        titulo: 'Faxina Completa em Cozinha Gourmet',
        descricao: 'Higienização detalhada de azulejos, coifa e armários.',
        fotoUrl: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-05T00:00:00Z',
      dataTermino: '2026-07-05T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'indicacao'
    },
    criadoEm: '2026-01-05T11:00:00Z'
  },
  {
    id: 'pro-3',
    usuarioId: 'usr-pro-3',
    nome: 'Marcos Vinicius Santos (Marcão)',
    tituloProfissional: 'Encanador & Caça-Vazamentos com Aparelho Geofone',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-hidraulica',
    servicos: ['Caça-Vazamentos', 'Desentupimento sem Quebradeira', 'Conserto de Válvula Hydra', 'Instalação de Metais'],
    descricao: 'Localizo vazamentos ocultos sem quebrar piso ou parede desnecessariamente. Atendo emergências de esgoto entupido e falta de água.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Wanel Ville', 'Trujillo', 'Centro', 'Além Ponte', 'Vila Hortência', 'Vila Lucy'],
    whatsapp: '5515996238899',
    telefone: '(15) 99623-8899',
    horarioAtendimento: 'Segunda a Domingo, das 07:00 às 22:00 (Plantão)',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 39,
    portfolio: [
      {
        id: 'port-4',
        titulo: 'Detecção Não Destrutiva de Vazamento',
        descricao: 'Identificação pontual de tubulação rompida sob piso porcelanato.',
        fotoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-10T00:00:00Z',
      dataTermino: '2026-07-10T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-10T08:30:00Z'
  },
  {
    id: 'pro-4',
    usuarioId: 'usr-pro-4',
    nome: 'Lucas Gabriel Moreira',
    tituloProfissional: 'Marido de Aluguel & Montador de Móveis',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-manutencao',
    servicos: ['Montagem de Guarda-roupas e Painéis', 'Instalação de Varão de Cortina', 'Fixação de Suporte de TV', 'Reparos em Portas e Gavetas'],
    descricao: 'Serviço rápido, limpo e com ferramentas profissionais a bateria. Montagem impecável de móveis comprados na internet ou lojas físicas.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Centro', 'Além Ponte', 'Wanel Ville', 'Mangal', 'Santa Rosália'],
    whatsapp: '5515991448822',
    telefone: '(15) 99144-8822',
    horarioAtendimento: 'Segunda a Sábado, das 08:00 às 18:30',
    disponivelAgora: false,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 53,
    portfolio: [
      {
        id: 'port-5',
        titulo: 'Montagem de Painel Ripado com Suporte de TV 70"',
        descricao: 'Furação precisa em parede de drywall com buchas especiais.',
        fotoUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-12T00:00:00Z',
      dataTermino: '2026-07-12T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'campanha'
    },
    criadoEm: '2026-01-12T14:20:00Z'
  },
  {
    id: 'pro-5',
    usuarioId: 'usr-pro-5',
    nome: 'Juliana Prado Beauty',
    tituloProfissional: 'Designer de Sobrancelhas, Cílios & Manicure',
    fotoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-beleza',
    servicos: ['Alongamento em Fibra de Vidro', 'Manicure e Pedicure Spa dos Pés', 'Design com Henna e Brow Lamination', 'Lash Lifting'],
    descricao: 'Atendimento a domicílio com todo material 100% esterilizado em autoclave. Cuidado, biossegurança e resultados deslumbrantes no conforto da sua casa.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Mangal', 'Jardim dos Estados', 'Jardim Paulistano', 'Centro'],
    whatsapp: '5515998774433',
    telefone: '(15) 99877-4433',
    horarioAtendimento: 'Terça a Sábado, das 09:00 às 19:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 41,
    portfolio: [
      {
        id: 'port-6',
        titulo: 'Unhas de Fibra com Esmaltação em Gel',
        descricao: 'Acabamento natural com durabilidade de até 30 dias.',
        fotoUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-15T00:00:00Z',
      dataTermino: '2026-07-15T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-15T16:00:00Z'
  },
  {
    id: 'pro-6',
    usuarioId: 'usr-pro-6',
    nome: 'Rafael Siqueira Climatização',
    tituloProfissional: 'Técnico Especialista em Ar-Condicionado Split & Inverter',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-climatizacao',
    servicos: ['Instalação com Bomba de Vácuo', 'Higienização Química Antibacteriana', 'Recarga de Gás Ecológico', 'Contrato PMOC para Empresas'],
    descricao: 'Instalação dentro das normas dos fabricantes (LG, Daikin, Gree, Samsung) mantendo a garantia do equipamento. Limpeza completa com cesto de coleta.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Wanel Ville', 'Além Ponte', 'Centro', 'Santa Rosália', 'Éden'],
    whatsapp: '5515991557766',
    telefone: '(15) 99155-7766',
    horarioAtendimento: 'Segunda a Sexta, das 08:00 às 18:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 35,
    portfolio: [
      {
        id: 'port-7',
        titulo: 'Higienização Profissional com Bactericida',
        descricao: 'Eliminação completa de odores e fungos em evaporadora.',
        fotoUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-18T00:00:00Z',
      dataTermino: '2026-07-18T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-18T09:30:00Z'
  },
  {
    id: 'pro-7',
    usuarioId: 'usr-pro-7',
    nome: 'Geraldo Antunes Pintor',
    tituloProfissional: 'Pintor Residencial & Texturas Projetadas',
    fotoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-reforma',
    servicos: ['Pintura Interna e Externa', 'Aplicação de Massa Corrida', 'Efeito Cimento Queimado', 'Impermeabilização de Paredes'],
    descricao: '25 anos de experiência com pintura em Sorocaba. Proteção total de pisos, rodapés e móveis com plástico bolha e lona. Entrego a obra 100% limpa.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Trujillo', 'Além Ponte', 'Vila Hortência', 'Mangal'],
    whatsapp: '5515997223388',
    telefone: '(15) 99722-3388',
    horarioAtendimento: 'Segunda a Sexta, das 07:30 às 17:30',
    disponivelAgora: false,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 29,
    portfolio: [
      {
        id: 'port-8',
        titulo: 'Parede Efeito Cimento Queimado Suvinil',
        descricao: 'Sala de estar moderna com acabamento acetinado no Trujillo.',
        fotoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-20T00:00:00Z',
      dataTermino: '2026-07-20T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'indicacao'
    },
    criadoEm: '2026-01-20T11:15:00Z'
  },
  {
    id: 'pro-8',
    usuarioId: 'usr-pro-8',
    nome: 'Bruno Auto Socorro & Baterias',
    tituloProfissional: 'Mecânico a Domicílio & Autoelétrica Express',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-automotivo',
    servicos: ['Troca de Bateria com Teste de Alternador', 'Chupeta Emergencial', 'Scanner Diagnóstico de Injeção', 'Troca de Pastilhas de Freio em Casa'],
    descricao: 'Seu carro não liga na garagem ou na rua? Vou até você em até 35 minutos em qualquer bairro de Sorocaba com baterias Moura e Heliar.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Centro', 'Wanel Ville', 'Além Ponte', 'Trujillo', 'Santa Rosália'],
    whatsapp: '5515991889900',
    telefone: '(15) 99188-9900',
    horarioAtendimento: 'Todos os dias, das 06:30 às 23:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 58,
    portfolio: [
      {
        id: 'port-9',
        titulo: 'Troca de Bateria 60Ah Moura Express',
        descricao: 'Atendimento emergencial realizado no estacionamento de shopping.',
        fotoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-22T00:00:00Z',
      dataTermino: '2026-07-22T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-22T15:45:00Z'
  },
  {
    id: 'pro-9',
    usuarioId: 'usr-pro-9',
    nome: 'Amanda Duarte Dog Walker & Pet Sitter',
    tituloProfissional: 'Comportamentalista Canina & Passeadora de Cães',
    fotoUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-pet',
    servicos: ['Passeio Educativo para Cães', 'Pet Sitting Residencial durante Viagens', 'Banho Terapêutico em Casa', 'Socialização de Filhotes'],
    descricao: 'Certificada em primeiros socorros veterinários e reforço positivo. Cuidado carinhoso e responsável pelo seu pet enquanto você trabalha ou viaja.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Mangal', 'Jardim Paulistano', 'Jardim América'],
    whatsapp: '5515996655443',
    telefone: '(15) 99665-5443',
    horarioAtendimento: 'Segunda a Sábado, das 07:00 às 18:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 44,
    portfolio: [
      {
        id: 'port-10',
        titulo: 'Passeio em Trilha e Socialização',
        descricao: 'Passeio com Golden Retriever e Border Collie com reforço positivo.',
        fotoUrl: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-25T00:00:00Z',
      dataTermino: '2026-07-25T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-25T08:00:00Z'
  },
  {
    id: 'pro-10',
    usuarioId: 'usr-pro-10',
    nome: 'Fábio TI & Smartphones',
    tituloProfissional: 'Técnico Especialista Apple & Android / Redes Wi-Fi',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-tecnologia',
    servicos: ['Troca de Tela iPhone e Samsung no Local', 'Formatação e Instalação de SSD em Notebooks', 'Instalação de Redes Wi-Fi Mesh', 'Recuperação de Backup'],
    descricao: 'Conserto na sua frente ou com retirada e entrega grátis em Sorocaba. Peças com 6 meses de garantia e nota fiscal de serviço.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Centro', 'Campolim', 'Wanel Ville', 'Trujillo', 'Santa Rosália'],
    whatsapp: '5515997891234',
    telefone: '(15) 99789-1234',
    horarioAtendimento: 'Segunda a Sábado, das 09:00 às 19:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 37,
    portfolio: [
      {
        id: 'port-11',
        titulo: 'Troca de Tela OLED iPhone 13',
        descricao: 'Substituição realizada no local em menos de 40 minutos mantendo TrueTone.',
        fotoUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-28T00:00:00Z',
      dataTermino: '2026-07-28T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-28T13:10:00Z'
  },
  {
    id: 'pro-11',
    usuarioId: 'usr-pro-11',
    nome: 'Seu Bento Jardineiro & Piscinas',
    tituloProfissional: 'Jardinagem Completa, Paisagismo e Limpeza de Piscina',
    fotoUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-jardinagem',
    servicos: ['Corte de Grama e Poda de Arbustos', 'Decapagem e Cristalização de Piscina', 'Adubação de Pomares', 'Plantio de Grama Esmeralda'],
    descricao: 'Cuidado completo para a sua chácara, condomínio ou residência. Trabalho com maquinário próprio a gasolina, silencioso e rápido.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Brigadeiro Tobias', 'Jardim dos Estados', 'Além Ponte'],
    whatsapp: '5515991334455',
    telefone: '(15) 99133-4455',
    horarioAtendimento: 'Segunda a Sábado, das 07:00 às 16:30',
    disponivelAgora: false,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 26,
    portfolio: [
      {
        id: 'port-12',
        titulo: 'Reforma de Jardim Residencial',
        descricao: 'Plantio de grama esmeralda com canteiros de buxinhos e pedras brancas.',
        fotoUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a52d31?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-01T00:00:00Z',
      dataTermino: '2026-08-01T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'indicacao'
    },
    criadoEm: '2026-02-01T10:00:00Z'
  },
  {
    id: 'pro-12',
    usuarioId: 'usr-pro-12',
    nome: 'Claudio Fretes & Carretos Sorocaba',
    tituloProfissional: 'Fretes Rápidos, Mudanças & Carreto com HR Baú',
    fotoUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-mudancas',
    servicos: ['Carreto Urbano Rápido', 'Mudança Residencial com Ajudante', 'Transporte de Sofás e Geladeiras', 'Fretes para Votorantim e Itu'],
    descricao: 'Caminhonete HR baú fechada, protegendo seus móveis contra chuva e poeira. Ajudante experiente para carregar e descarregar.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Todos os bairros de Sorocaba', 'Votorantim', 'Itu', 'Salto'],
    whatsapp: '5515998112233',
    telefone: '(15) 99811-2233',
    horarioAtendimento: 'Segunda a Domingo, das 07:00 às 20:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 51,
    portfolio: [
      {
        id: 'port-13',
        titulo: 'Mudança de Apartamento no Campolim',
        descricao: 'Embalagem com filme stretch e cobertores de proteção.',
        fotoUrl: 'https://images.unsplash.com/photo-1600585152220-90363fe7e115?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-03T00:00:00Z',
      dataTermino: '2026-08-03T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-03T08:30:00Z'
  },
  {
    id: 'pro-13',
    usuarioId: 'usr-pro-13',
    nome: 'Luciana Diarista & Passadeira',
    tituloProfissional: 'Diarista Cuidadosa & Especialista em Roupas Sociais',
    fotoUrl: 'https://images.unsplash.com/photo-1548142813-c348350df52b?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-limpeza',
    servicos: ['Faxina Residencial', 'Passar Camisas e Peças Delicadas', 'Limpeza Pré-Festa e Pós-Evento'],
    descricao: 'Dedicação e capricho em cada canto da sua casa. Cuido das suas roupas com perfeição e atenção aos tecidos.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Wanel Ville', 'Trujillo', 'Centro', 'Vila Lucy'],
    whatsapp: '5515997556677',
    telefone: '(15) 99755-6677',
    horarioAtendimento: 'Segunda a Sexta, das 08:00 às 16:30',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 31,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-05T00:00:00Z',
      dataTermino: '2026-08-05T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-05T09:15:00Z'
  },
  {
    id: 'pro-14',
    usuarioId: 'usr-pro-14',
    nome: 'Leandro Eletrotécnico',
    tituloProfissional: 'Especialista em Redes Elétricas & Automação Residencial',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-eletrica',
    servicos: ['Automação Alexa e Sonoff', 'Instalação de Tomada para Carro Elétrico', 'Reparos Elétricos Urgentes'],
    descricao: 'Projetos modernos de automação residencial inteligente, interruptores touch e tomadas dedicadas para veículos elétricos e híbridos em Sorocaba.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Mangal', 'Santa Rosália', 'Jardim dos Estados'],
    whatsapp: '5515998334411',
    telefone: '(15) 99833-4411',
    horarioAtendimento: 'Segunda a Sábado, das 08:00 às 19:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 28,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-08T00:00:00Z',
      dataTermino: '2026-08-08T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-08T11:40:00Z'
  },
  {
    id: 'pro-15',
    usuarioId: 'usr-pro-15',
    nome: 'Valdemir Pedreiro & Azulejista',
    tituloProfissional: 'Assentador de Porcelanato Retificado & Reformas Gerais',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-reforma',
    servicos: ['Piso Porcelanato Retificado', 'Reboco e Alvenaria', 'Reforma de Banheiros e Nichos', 'Contra-piso'],
    descricao: 'Nivelamento a laser e cunhas niveladoras para um acabamento perfeito sem desníveis. Orçamento transparente e cumprimento rigoroso de prazos.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Wanel Ville', 'Além Ponte', 'Centro', 'Vila Hortência'],
    whatsapp: '5515996778844',
    telefone: '(15) 99677-8844',
    horarioAtendimento: 'Segunda a Sexta, das 07:00 às 17:00',
    disponivelAgora: false,
    verificado: false,
    status: 'PENDENTE',
    notaMedia: 4.7,
    totalAvaliacoes: 15,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-10T00:00:00Z',
      dataTermino: '2026-08-10T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-10T14:10:00Z'
  },
  {
    id: 'pro-16',
    usuarioId: 'usr-pro-16',
    nome: 'Danielle Hair Stylist',
    tituloProfissional: 'Cabeleireira Visagista, Mechas & Cortes a Domicílio',
    fotoUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-beleza',
    servicos: ['Loiras e Morena Iluminada', 'Botox Capilar e Cronograma', 'Corte Bordado e Tratamento de Pontas'],
    descricao: 'Atendimento exclusivo no conforto da sua residência com produtos das melhores marcas (Wella, Truss, L’Oréal).',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Mangal', 'Santa Rosália', 'Jardim Paulistano'],
    whatsapp: '5515991442299',
    telefone: '(15) 99144-2299',
    horarioAtendimento: 'Terça a Sábado, das 10:00 às 20:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 34,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-12T00:00:00Z',
      dataTermino: '2026-08-12T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'indicacao'
    },
    criadoEm: '2026-02-12T10:20:00Z'
  },
  {
    id: 'pro-17',
    usuarioId: 'usr-pro-17',
    nome: 'Roberto Calhas & Rufos',
    tituloProfissional: 'Instalador de Calhas, Rufos e Manutenção de Telhados',
    fotoUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-reforma',
    servicos: ['Limpeza de Calhas Entupidas', 'Instalação de Calha Galvanizada e Alumínio', 'Vedações de Infiltração em Telhas'],
    descricao: 'Elimine vazamentos na época de chuvas. Serviços de altura executados com total segurança e garantia de 1 ano contra vazamentos.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Todos os bairros de Sorocaba e Votorantim'],
    whatsapp: '5515998225577',
    telefone: '(15) 99822-5577',
    horarioAtendimento: 'Segunda a Sexta, das 07:30 às 17:30',
    disponivelAgora: false,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 21,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-15T00:00:00Z',
      dataTermino: '2026-08-15T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-15T15:30:00Z'
  },
  {
    id: 'pro-18',
    usuarioId: 'usr-pro-18',
    nome: 'Otávio Encanador Predial',
    tituloProfissional: 'Técnico Hidráulico Predial & Residencial Especializado',
    fotoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-hidraulica',
    servicos: ['Troca de Prumadas de Água e Esgoto', 'Instalação de Pressurizadores Rowa/Lorenzetti', 'Caixa d’água e Boias'],
    descricao: 'Pressão fraca nos chuveiros ou ruído na tubulação? Faço dimensionamento de pressurizadores e instalação de válvulas de retenção.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Mangal', 'Trujillo', 'Centro'],
    whatsapp: '5515997663344',
    telefone: '(15) 99766-3344',
    horarioAtendimento: 'Segunda a Sábado, das 08:00 às 18:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 33,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-18T00:00:00Z',
      dataTermino: '2026-08-18T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-18T09:00:00Z'
  },
  {
    id: 'pro-19',
    usuarioId: 'usr-pro-19',
    nome: 'Jorge Mecânico Autoelétrica',
    tituloProfissional: 'Especialista em Alternadores, Motores de Partida & Ar Quente',
    fotoUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-automotivo',
    servicos: ['Reparo de Alternador', 'Motor de Arranque / Partida', 'Faróis e Lanternas LED', 'Troca de Fusíveis'],
    descricao: 'Atendimento rápido no local onde seu veículo parou. Diagnóstico com multímetro e teste de carga real.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Além Ponte', 'Centro', 'Vila Hortência', 'Brigadeiro Tobias'],
    whatsapp: '5515991227788',
    telefone: '(15) 99122-7788',
    horarioAtendimento: 'Segunda a Sábado, das 08:00 às 18:30',
    disponivelAgora: true,
    verificado: false,
    status: 'PENDENTE',
    notaMedia: 4.6,
    totalAvaliacoes: 12,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-20T00:00:00Z',
      dataTermino: '2026-08-20T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-20T16:20:00Z'
  },
  {
    id: 'pro-20',
    usuarioId: 'usr-pro-20',
    nome: 'Silvia Faxina Pós-Obra',
    tituloProfissional: 'Equipe Especializada em Limpeza Pós-Obra & Vidros Altos',
    fotoUrl: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-limpeza',
    servicos: ['Remoção de Tinta e Gesso em Porcelanatos', 'Limpeza Técnica de Vidros e Esquadrias', 'Limpeza Pré-Entrega de Chaves'],
    descricao: 'Trabalho com equipe treinada, produtos químicos adequados que não mancham porcelanatos nem queimam alumínio. Deixamos sua casa pronta para morar!',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Santa Rosália', 'Jardim dos Estados', 'Wanel Ville'],
    whatsapp: '5515998551122',
    telefone: '(15) 99855-1122',
    horarioAtendimento: 'Segunda a Sábado, das 07:30 às 17:30',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 47,
    portfolio: [],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-02-22T00:00:00Z',
      dataTermino: '2026-08-22T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'campanha'
    },
    criadoEm: '2026-02-22T11:00:00Z'
  },
  {
    id: 'pro-21',
    usuarioId: 'usr-pro-21',
    nome: 'Marcos Vinícius de Souza',
    tituloProfissional: 'Instalador de Esquadrias de Alumínio & Box Blindex',
    fotoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-esquadrias-blindex',
    servicos: [
      'Instalação de Box Blindex',
      'Esquadrias de Alumínio Sob Medida',
      'Portas Balcão e Janelas Linha Suprema',
      'Troca de Roldanas, Guias e Fechos',
      'Fechamento de Sacadas e Varandas em Vidro'
    ],
    descricao: 'Especialista em fabricação, instalação e manutenção de esquadrias de alumínio sob medida (linhas Suprema e Gold) e vidros temperados Blindex. Atendo residências, condomínios e lojas em Sorocaba, Votorantim e região. Mais de 12 anos de experiência com acabamento de alto padrão e pontualidade.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Wanel Ville', 'Centro', 'Santa Rosália', 'Além Ponte', 'Jardim América', 'Mangal', 'Trujillo'],
    whatsapp: '5515998124455',
    telefone: '(15) 99812-4455',
    horarioAtendimento: 'Segunda a Sábado, das 08:00 às 18:30',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 46,
    portfolio: [
      {
        id: 'port-esq-1',
        titulo: 'Box Blindex Elegance Preto Fosco',
        descricao: 'Instalação de box frontal em vidro temperado 8mm incolor com roldanas aparentes no Campolim.',
        fotoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
      },
      {
        id: 'port-esq-2',
        titulo: 'Porta Balcão de Alumínio 4 Folhas',
        descricao: 'Fabricação sob medida com pintura eletrostática preta e fechaduras de segurança no Wanel Ville.',
        fotoUrl: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-10T00:00:00Z',
      dataTermino: '2026-07-10T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-10T08:30:00Z'
  },
  {
    id: 'pro-22',
    usuarioId: 'usr-pro-22',
    nome: 'Carlos Alberto Vidraçaria & Esquadrias',
    tituloProfissional: 'Técnico em Vidros Temperados, Blindex & Esquadrias',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-esquadrias-blindex',
    servicos: [
      'Fechamento de Sacada em Vidro Retrátil',
      'Box Blindex Padrão e Até o Teto',
      'Manutenção Preventiva de Esquadrias e Janelas',
      'Guarda-Corpo de Vidro e Alumínio',
      'Espelhos Bisotados e Lapidados'
    ],
    descricao: 'Instalação rápida de box blindex com pronta entrega em Sorocaba. Serviços de manutenção em janelas de alumínio emperradas, troca de roldanas gastas e vedação contra infiltração de chuva.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Campolim', 'Centro', 'Trujillo', 'Vila Hortência', 'Éden', 'Santa Rosália', 'Jardim Paulistano'],
    whatsapp: '5515991456789',
    telefone: '(15) 99145-6789',
    horarioAtendimento: 'Segunda a Sexta das 08:00 às 18:00 | Sábado das 08:00 às 13:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 38,
    portfolio: [
      {
        id: 'port-esq-3',
        titulo: 'Fechamento de Sacada Cortina de Vidro',
        descricao: 'Sistema de envidraçamento articulado sem esquadrias verticais em apartamento no Trujillo.',
        fotoUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'gratuito_6_meses',
      nome: 'Degustação 6 Meses Grátis',
      dataInicio: '2026-01-15T00:00:00Z',
      dataTermino: '2026-07-15T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-15T11:00:00Z'
  },
  {
    id: 'pro-ajudante-1',
    usuarioId: 'usr-pro-ajudante-1',
    nome: 'Márcio Rogério Santos (Equipe Carga & Apoio)',
    tituloProfissional: 'Ajudante Geral, Carga/Descarga de Caminhão & Entregas',
    fotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-ajudantes',
    servicos: [
      'Ajudante para Descarregar Caminhão',
      'Carga e Descarga de Mercadorias e Móveis',
      'Auxiliar de Entregas Rápidas e Logística',
      'Ajudante de Mudança e Carga Pesada',
      'Diária de Ajudante de Serviços Gerais'
    ],
    descricao: 'Mais de 8 anos atuando com apoio operacional, diárias e logística em Sorocaba, Éden, Zona Industrial e Votorantim. Força física, agilidade e total cuidado no manuseio de caixas, paletes pesados, materiais de construção e mudanças.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Éden', 'Zona Industrial', 'Além Ponte', 'Centro', 'Brigadeiro Tobias', 'Wanel Ville', 'Santa Rosália'],
    whatsapp: '5515998112233',
    telefone: '(15) 99811-2233',
    horarioAtendimento: 'Segunda a Sábado, das 06:00 às 20:00 (plantão para carretas)',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 42,
    oportunidadesDisponiveis: 10,
    pedidosDesbloqueadosIds: [],
    portfolio: [
      {
        id: 'port-aju-1',
        titulo: 'Descarga de Carreta Baú 24 Paletes',
        descricao: 'Apoio em descarga rápida de carga fracionada e conferência em centro de distribuição no Éden.',
        fotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'pacote_10_creditos',
      nome: 'Pacote 10 Oportunidades PIX',
      dataInicio: '2026-01-20T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-20T08:00:00Z'
  },
  {
    id: 'pro-ajudante-2',
    usuarioId: 'usr-pro-ajudante-2',
    nome: 'Lucas Vinícius Prado (Divulga Sorocaba)',
    tituloProfissional: 'Panfletagem de Rua, Eleições & Ajudante de Entregas',
    fotoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-ajudantes',
    servicos: [
      'Panfletagem (Eleições, Comércio e Eventos)',
      'Auxiliar de Entregas Rápidas e Logística',
      'Organização de Estoque, Galpão e Depósito',
      'Diária de Ajudante de Serviços Gerais'
    ],
    descricao: 'Atuação individual ou com equipe para panfletagem em semáforos, portas de comércio, feiras, eventos e campanhas eleitorais em toda Sorocaba. Responsabilidade, pontualidade, simpatia na entrega e envio de fotos/relatório do serviço.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Centro', 'Campolim', 'Wanel Ville', 'Vila Hortência', 'Trujillo', 'Santa Rosália', 'Jardim dos Estados'],
    whatsapp: '5515996554433',
    telefone: '(15) 99655-4433',
    horarioAtendimento: 'Todos os dias, das 07:00 às 19:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 31,
    oportunidadesDisponiveis: 10,
    pedidosDesbloqueadosIds: [],
    portfolio: [
      {
        id: 'port-aju-2',
        titulo: 'Ação de Panfletagem Comercial e Eleitoral',
        descricao: 'Distribuição orientada de materiais impressos em pontos estratégicos do Centro e Campolim com registro fotográfico.',
        fotoUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'pacote_10_creditos',
      nome: 'Pacote 10 Oportunidades PIX',
      dataInicio: '2026-02-01T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-02-01T09:00:00Z'
  },
  {
    id: 'pro-pedreiro-1',
    usuarioId: 'usr-pro-pedreiro-1',
    nome: 'Valdemar Soares de Almeida (Seu Valdemar)',
    tituloProfissional: 'Mestre de Obras & Pedreiro de Alvenaria e Estrutura',
    fotoUrl: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
    categoriaId: 'cat-pedreiro',
    servicos: [
      'Construção de Muros e Alvenaria',
      'Reboco, Chapisco e Emboço',
      'Contrapiso e Regularização de Piso',
      'Assentamento de Tijolos e Blocos de Concreto',
      'Pequenas Reformas e Quebradeira',
      'Estrutura de Concreto, Viga e Baldrame',
      'Pedreiro por Diária ou Empreitada'
    ],
    descricao: 'Mais de 20 anos construindo e reformando em Sorocaba. Especialista em levantar paredes e muros no prumo e esquadro perfeito, reboco paulista liso, contra-piso impermeabilizado e fundação. Serviço limpo, honesto e com ótimas recomendações.',
    cidadeId: 'cid-sorocaba',
    bairrosAtendidos: ['Wanel Ville', 'Campolim', 'Além Ponte', 'Trujillo', 'Vila Hortência', 'Jardim dos Estados', 'Santa Rosália'],
    whatsapp: '5515991887766',
    telefone: '(15) 99188-7766',
    horarioAtendimento: 'Segunda a Sexta das 07:00 às 17:00 | Sábado das 07:00 às 12:00',
    disponivelAgora: true,
    verificado: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 65,
    oportunidadesDisponiveis: 10,
    pedidosDesbloqueadosIds: [],
    portfolio: [
      {
        id: 'port-ped-1',
        titulo: 'Muro de Bloco Aparente e Reboco',
        descricao: 'Construção de muro de arrimo e divisa com 28 metros, sapatas reforçadas e reboco liso no Wanel Ville.',
        fotoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80'
      }
    ],
    plano: {
      tipo: 'pacote_10_creditos',
      nome: 'Pacote 10 Oportunidades PIX',
      dataInicio: '2026-01-10T00:00:00Z',
      status: 'ativo',
      limiteOrcamentosPorMes: 999,
      origemCadastro: 'organico'
    },
    criadoEm: '2026-01-10T07:30:00Z'
  }
];

// 10 realistic local businesses in Sorocaba with addresses, hours, sponsored status, and metrics
export const INITIAL_BUSINESSES: Business[] = [
  {
    id: 'emp-1',
    usuarioId: 'usr-emp-1',
    nome: 'Pet Mania Sorocaba - Centro de Estética & Pet Shop',
    logoUrl: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Pet shop completo com banho e tosa climatizado, rações super premium, farmácia veterinária e serviço de leva e traz em Sorocaba.',
    categoriaId: 'cat-pet',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    endereco: 'Av. Antônio Carlos Comitre, 850 - Parque Campolim, Sorocaba - SP',
    telefone: '(15) 3234-8899',
    whatsapp: '5515991882233',
    horarioAtendimento: 'Segunda a Sexta: 08h às 19h | Sábado: 08h às 17h',
    site: 'https://petmaniasorocaba.com.br',
    instagram: '@petmaniasorocaba',
    servicosOuProdutos: [
      'Banho & Tosa Especializada',
      'Hidratação de Pelos com Ozônio',
      'Rações Royal Canin, Premier, Hills',
      'Acessórios e Camas Conforto',
      'Leva & Traz Grátis no Campolim e Mangal'
    ],
    patrocinada: true,
    posicaoDestaque: 1,
    anuncioAtivo: true,
    dataInicioAnuncio: '2026-01-01T00:00:00Z',
    dataFimAnuncio: '2026-12-31T00:00:00Z',
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 84,
    analytics: {
      visualizacoes: 1420,
      cliquesWhatsapp: 384,
      cliquesComoChegar: 215,
      cliquesSiteOuInsta: 145
    },
    criadoEm: '2026-01-01T10:00:00Z'
  },
  {
    id: 'emp-2',
    usuarioId: 'usr-emp-2',
    nome: 'EletroPeças Sorocaba - Materiais Elétricos & Iluminação',
    logoUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Tudo em materiais elétricos residenciais e industriais: fios Sil e Prysmian, disjuntores Schneider, lâmpadas LED, caixas de passagem e padrão CPFL a pronta entrega.',
    categoriaId: 'cat-eletrica',
    cidadeId: 'cid-sorocaba',
    bairro: 'Além Ponte',
    endereco: 'Rua Cel. Nogueira Padilha, 1120 - Além Ponte, Sorocaba - SP',
    telefone: '(15) 3227-4400',
    whatsapp: '5515997441100',
    horarioAtendimento: 'Segunda a Sexta: 07h30 às 18h | Sábado: 08h às 13h',
    site: 'https://eletropecassorocaba.com.br',
    instagram: '@eletropecas.sorocaba',
    servicosOuProdutos: [
      'Fios e Cabos Normatizados NBR',
      'Postes e Caixas Padrão CPFL Completo',
      'Lustres, Pendentes e Fitas LED',
      'Tubulações e Conduítes Corrugados',
      'Ferramentas para Eletricistas Profissionais'
    ],
    patrocinada: true,
    posicaoDestaque: 2,
    anuncioAtivo: true,
    dataInicioAnuncio: '2026-01-05T00:00:00Z',
    dataFimAnuncio: '2026-12-31T00:00:00Z',
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 67,
    analytics: {
      visualizacoes: 1180,
      cliquesWhatsapp: 298,
      cliquesComoChegar: 180,
      cliquesSiteOuInsta: 95
    },
    criadoEm: '2026-01-05T09:00:00Z'
  },
  {
    id: 'emp-3',
    usuarioId: 'usr-emp-3',
    nome: 'iFix Sorocaba - Assistência Especializada Apple & Celulares',
    logoUrl: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1512499617640-c74ae3a79d37?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Conserto expresso de iPhones, iPads, MacBooks, Samsung e Xiaomi. Troca de telas na hora com garantia de 1 ano e películas de alta resistência.',
    categoriaId: 'cat-tecnologia',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    endereco: 'Rua São Bento, 245 - Centro, Sorocaba - SP',
    telefone: '(15) 3211-7788',
    whatsapp: '5515996554411',
    horarioAtendimento: 'Segunda a Sexta: 09h às 18h30 | Sábado: 09h às 14h',
    site: 'https://ifixsorocaba.com.br',
    instagram: '@ifix.sorocaba',
    servicosOuProdutos: [
      'Troca de Vidro e Display na Hora',
      'Substituição de Baterias Originais',
      'Desoxidação de Aparelhos Molhados',
      'Acessórios Homologados Anatel'
    ],
    patrocinada: true,
    posicaoDestaque: 3,
    anuncioAtivo: true,
    dataInicioAnuncio: '2026-01-10T00:00:00Z',
    dataFimAnuncio: '2026-07-10T00:00:00Z',
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 92,
    analytics: {
      visualizacoes: 1650,
      cliquesWhatsapp: 452,
      cliquesComoChegar: 230,
      cliquesSiteOuInsta: 210
    },
    criadoEm: '2026-01-10T11:00:00Z'
  },
  {
    id: 'emp-4',
    usuarioId: 'usr-emp-4',
    nome: 'Oficina Mecânica Sorocaba Motors',
    logoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Centro automotivo com alinhamento 3D, balanceamento, troca de óleo com filtro, freios ABS, embreagem e suspensão.',
    categoriaId: 'cat-automotivo',
    cidadeId: 'cid-sorocaba',
    bairro: 'Trujillo',
    endereco: 'Av. General Osório, 1420 - Trujillo, Sorocaba - SP',
    telefone: '(15) 3232-1515',
    whatsapp: '5515998114477',
    horarioAtendimento: 'Segunda a Sexta: 08h às 18h',
    site: 'https://sorocabamotors.com.br',
    instagram: '@sorocabamotors',
    servicosOuProdutos: [
      'Revisão Preventiva Completa',
      'Alinhamento e Balanceamento a Laser',
      'Troca de Óleo Lubrax, Castrol, Motul',
      'Higienização de Ar-Condicionado Automotivo'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 54,
    analytics: {
      visualizacoes: 890,
      cliquesWhatsapp: 195,
      cliquesComoChegar: 140,
      cliquesSiteOuInsta: 50
    },
    criadoEm: '2026-01-12T13:30:00Z'
  },
  {
    id: 'emp-5',
    usuarioId: 'usr-emp-5',
    nome: 'Casa das Tintas & Construção Sorocaba',
    logoUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1505798577917-a65157d3320a?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Sistema tintométrico Suvinil e Coral com mais de 5.000 cores na hora. Impermeabilizantes Vedacit, massas, pincéis e rolos com preço de atacado.',
    categoriaId: 'cat-reforma',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    endereco: 'Av. Elias Maluf, 780 - Wanel Ville, Sorocaba - SP',
    telefone: '(15) 3228-9000',
    whatsapp: '5515997228833',
    horarioAtendimento: 'Segunda a Sexta: 07h30 às 18h | Sábado: 08h às 14h',
    servicosOuProdutos: [
      'Tintas Acrílicas, Esmaltes e Vernizes',
      'Textura Projetada e Grafiato',
      'Massa Acrílica e Seladores',
      'Entrega Rápida em Toda Sorocaba'
    ],
    patrocinada: true,
    posicaoDestaque: 4,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.7,
    totalAvaliacoes: 43,
    analytics: {
      visualizacoes: 960,
      cliquesWhatsapp: 215,
      cliquesComoChegar: 130,
      cliquesSiteOuInsta: 40
    },
    criadoEm: '2026-01-15T15:00:00Z'
  },
  {
    id: 'emp-6',
    usuarioId: 'usr-emp-6',
    nome: 'Studio Lumina - Salão & Spa Urbano',
    logoUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Ambiente sofisticado com mechas, coloração, tratamentos capilares Kérastase, dia da noiva, estética facial e massagens relaxantes.',
    categoriaId: 'cat-beleza',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    endereco: 'Rua Francisco Neves, 120 - Parque Campolim, Sorocaba - SP',
    telefone: '(15) 3243-5566',
    whatsapp: '5515998667788',
    horarioAtendimento: 'Terça a Sábado: 09h às 20h',
    site: 'https://studioluminasorocaba.com.br',
    instagram: '@studiolumina.campolim',
    servicosOuProdutos: [
      'Mechas e Balayage com Especialistas',
      'Terapia Capilar e Tratamento de Queda',
      'Dia da Noiva com Sala Exclusiva',
      'Massagem com Pedras Quentes'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 78,
    analytics: {
      visualizacoes: 1100,
      cliquesWhatsapp: 260,
      cliquesComoChegar: 175,
      cliquesSiteOuInsta: 190
    },
    criadoEm: '2026-01-18T16:30:00Z'
  },
  {
    id: 'emp-7',
    usuarioId: 'usr-emp-7',
    nome: 'ClimaFrio Sorocaba - Ar-Condicionado & Peças',
    logoUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Revenda autorizada de aparelhos Split Hi-Wall, Cassete e Piso Teto. Peças de reposição, tubulação de cobre, suportes e ferramentas para instaladores.',
    categoriaId: 'cat-climatizacao',
    cidadeId: 'cid-sorocaba',
    bairro: 'Santa Rosália',
    endereco: 'Av. Pereira da Silva, 540 - Santa Rosália, Sorocaba - SP',
    telefone: '(15) 3233-1122',
    whatsapp: '5515997334455',
    horarioAtendimento: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
    servicosOuProdutos: [
      'Venda de Aparelhos com Instalação Homologada',
      'Tubos de Cobre e Isolamentos Térmicos',
      'Gás Refrigerante R410A, R32 e R22',
      'Manutenção Preventiva Empresarial'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 39,
    analytics: {
      visualizacoes: 720,
      cliquesWhatsapp: 160,
      cliquesComoChegar: 85,
      cliquesSiteOuInsta: 35
    },
    criadoEm: '2026-01-22T10:45:00Z'
  },
  {
    id: 'emp-8',
    usuarioId: 'usr-emp-8',
    nome: 'Casa do Encanador Sorocaba - Conexões & Louças',
    logoUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Tubos Tigre e Amanco, caixas d’água Fortlev, registros Deca e Docol, sifões, torneiras monocomando e peças de reparo hidráulico para pronta entrega.',
    categoriaId: 'cat-hidraulica',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    endereco: 'Rua Moreira César, 410 - Centro, Sorocaba - SP',
    telefone: '(15) 3231-6600',
    whatsapp: '5515998129988',
    horarioAtendimento: 'Segunda a Sexta: 07h30 às 18h | Sábado: 08h às 13h',
    servicosOuProdutos: [
      'Tubos e Conexões PVC Soldável e Esgoto',
      'Válvulas e Reparos de Descarga Hydra',
      'Aquecedores Solares e a Gás',
      'Bombas e Pressurizadores de Água'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 46,
    analytics: {
      visualizacoes: 810,
      cliquesWhatsapp: 175,
      cliquesComoChegar: 110,
      cliquesSiteOuInsta: 30
    },
    criadoEm: '2026-01-26T14:00:00Z'
  },
  {
    id: 'emp-9',
    usuarioId: 'usr-emp-9',
    nome: 'Barbearia Dom Pedro - Cortes Clássicos & Barba Terapia',
    logoUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Barbearia tradicional com toalha quente, navalha afiada, cerveja gelada, sinuca e os melhores produtos para barba e cabelo.',
    categoriaId: 'cat-beleza',
    cidadeId: 'cid-sorocaba',
    bairro: 'Mangal',
    endereco: 'Rua Visconde de Cairu, 310 - Mangal, Sorocaba - SP',
    telefone: '(15) 3342-9911',
    whatsapp: '5515997883322',
    horarioAtendimento: 'Segunda a Sábado: 09h às 21h',
    instagram: '@barbeariadompedro',
    servicosOuProdutos: [
      'Corte Degradê na Tesoura e Máquina',
      'Barboterapia com Toalha Quente e Óleos Nobres',
      'Camuflagem de Fios Brancos',
      'Pomadas e Shampoos para Barba'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 63,
    analytics: {
      visualizacoes: 920,
      cliquesWhatsapp: 220,
      cliquesComoChegar: 165,
      cliquesSiteOuInsta: 115
    },
    criadoEm: '2026-02-01T12:15:00Z'
  },
  {
    id: 'emp-10',
    usuarioId: 'usr-emp-10',
    nome: 'Hospital Veterinário Sorocaba 24 Horas',
    logoUrl: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Pronto socorro veterinário 24h, internação com UTI, exames laboratoriais na hora, ultrassom e centro cirúrgico completo.',
    categoriaId: 'cat-pet',
    cidadeId: 'cid-sorocaba',
    bairro: 'Jardim dos Estados',
    endereco: 'Av. Barão de Tatuí, 1100 - Jardim dos Estados, Sorocaba - SP',
    telefone: '(15) 3232-2424',
    whatsapp: '5515996112424',
    horarioAtendimento: 'Aberto 24 Horas - Todos os dias do ano',
    site: 'https://vetsorocaba24h.com.br',
    instagram: '@vetsorocaba24h',
    servicosOuProdutos: [
      'Pronto Atendimento Emergencial 24 Horas',
      'Raio-X Digital e Ultrassonografia',
      'Cirurgias Gerais e Ortopédicas',
      'Internação Monitorada por Veterinários'
    ],
    patrocinada: false,
    anuncioAtivo: false,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 115,
    analytics: {
      visualizacoes: 1890,
      cliquesWhatsapp: 512,
      cliquesComoChegar: 340,
      cliquesSiteOuInsta: 240
    },
    criadoEm: '2026-02-05T14:30:00Z'
  },
  {
    id: 'emp-11',
    usuarioId: 'usr-emp-11',
    nome: 'Vidraçaria & Esquadrias AlumiBlindex Sorocaba',
    logoUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Fabricação própria de esquadrias de alumínio linhas Suprema e Gold, box blindex padrão e até o teto, envidraçamento de sacadas retráteis, espelhos bisotados e portas pivotantes.',
    categoriaId: 'cat-esquadrias-blindex',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    endereco: 'Av. Professora Izoraida Marques Peres, 1200 - Campolim, Sorocaba - SP',
    telefone: '(15) 3224-5500',
    whatsapp: '5515998124455',
    horarioAtendimento: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 13h',
    site: 'https://alumiblindexsorocaba.com.br',
    instagram: '@alumiblindex.sorocaba',
    servicosOuProdutos: [
      'Box Blindex Pronta Entrega e Sob Medida',
      'Esquadrias Linha Suprema e Gold',
      'Fechamento de Sacadas e Varandas Gourmet',
      'Espelhos Bisotados para Lavabos e Salas',
      'Guarda-Corpo em Alumínio e Vidro Laminado',
      'Manutenção de Roldanas, Fechaduras e Vedações'
    ],
    patrocinada: true,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 58,
    analytics: {
      visualizacoes: 1420,
      cliquesWhatsapp: 380,
      cliquesComoChegar: 210,
      cliquesSiteOuInsta: 195
    },
    criadoEm: '2026-01-15T09:00:00Z'
  },
  {
    id: 'emp-12',
    usuarioId: 'usr-emp-12',
    nome: 'Depósito Wanel - Materiais de Construção, Areia & Brita',
    logoUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Depósito tradicional no Wanel Ville com entrega rápida em até 2 horas de areia lavada, brita, cimento Votoran, blocos estruturais, tijolos e tubos Tigre para obras residenciais e comerciais.',
    categoriaId: 'cat-pedreiro',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    endereco: 'Av. Paulo Emanuel de Almeida, 1450 - Wanel Ville, Sorocaba - SP',
    telefone: '(15) 3222-7700',
    whatsapp: '5515997223344',
    horarioAtendimento: 'Segunda a Sexta: 07h às 18h | Sábado: 07h às 13h',
    site: 'https://depositowanel.com.br',
    instagram: '@depositowanelsorocaba',
    servicosOuProdutos: [
      'Cimento Votoran CP-II e CP-III',
      'Areia Lavada e Pedra Britada Ensacada ou a Granel',
      'Blocos de Concreto Estrutural e Canaletas',
      'Tubos, Conexões e Caixas d Água Tigre',
      'Ferro Armado, Colunas e Malhas Pop'
    ],
    patrocinada: true,
    posicaoDestaque: 2,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 72,
    analytics: {
      visualizacoes: 1890,
      cliquesWhatsapp: 540,
      cliquesComoChegar: 310,
      cliquesSiteOuInsta: 210
    },
    criadoEm: '2026-01-10T10:00:00Z'
  },
  {
    id: 'emp-13',
    usuarioId: 'usr-emp-13',
    nome: 'Disk Gás Ultragaz, Água & Bebidas 24h Éden Express',
    logoUrl: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Entrega rápida de botijão de gás de cozinha Ultragaz P13 e P45, galão de água mineral Bonafont e Lindoya 20L, refrigerantes, carvão e fardos de gelo. Plantão diurno e noturno para Éden e Zona Industrial.',
    categoriaId: 'cat-ajudantes',
    cidadeId: 'cid-sorocaba',
    bairro: 'Éden',
    endereco: 'Rua Independência, 520 - Éden, Sorocaba - SP',
    telefone: '(15) 3225-1122',
    whatsapp: '5515998334455',
    horarioAtendimento: 'Aberto Todos os dias: 07h às 23h30',
    site: 'https://diskgasaguaeden.com.br',
    instagram: '@gasaguaeden',
    servicosOuProdutos: [
      'Botijão de Gás P13 e P45 Ultragaz',
      'Galão de Água Mineral 20 Litros',
      'Cervejas, Refrigerantes e Energéticos em Fardos',
      'Sacos de Gelo Filtrado e Carvão Vegetal',
      'Entrega Expressa por Motoboy no Éden'
    ],
    patrocinada: true,
    posicaoDestaque: 3,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.8,
    totalAvaliacoes: 96,
    analytics: {
      visualizacoes: 2310,
      cliquesWhatsapp: 780,
      cliquesComoChegar: 410,
      cliquesSiteOuInsta: 180
    },
    criadoEm: '2026-01-12T08:30:00Z'
  },
  {
    id: 'emp-14',
    usuarioId: 'usr-emp-14',
    nome: 'Padaria & Confeitaria Imperial Centro Sorocaba',
    logoUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Pães artesanais franceses crocantes a cada 30 minutos, café colonial completo, lanches no prato, salgados finos assados e fritos, e doces e bolos sob encomenda para aniversários e reuniões.',
    categoriaId: 'cat-servicos',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    endereco: 'Rua São Bento, 410 - Centro, Sorocaba - SP',
    telefone: '(15) 3231-6000',
    whatsapp: '5515996118899',
    horarioAtendimento: 'Segunda a Domingo: 06h às 21h',
    site: 'https://padariaimperialsorocaba.com.br',
    instagram: '@padariaimperialsorocaba',
    servicosOuProdutos: [
      'Pão Francês Quentinho e Pães de Fermentação Natural',
      'Café da Manhã e Almoço Executivo',
      'Bolos Decorados e Tortas Doces sob Encomenda',
      'Kit Festa com Mini Salgados e Docinhos',
      'Atendimento a Empresas e Faturamento Mensal'
    ],
    patrocinada: true,
    posicaoDestaque: 4,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 114,
    analytics: {
      visualizacoes: 3120,
      cliquesWhatsapp: 620,
      cliquesComoChegar: 530,
      cliquesSiteOuInsta: 340
    },
    criadoEm: '2026-01-05T06:00:00Z'
  },
  {
    id: 'emp-15',
    usuarioId: 'usr-emp-15',
    nome: 'Marmoraria & Granitos Arte & Pedra Além Ponte',
    logoUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Especializada em bancadas de cozinha esculpidas em Quartzo Branco, granito Preto São Gabriel, mármore Travertino, lavatórios com cuba esculpida, ilhas gourmet e soleiras em Sorocaba e região.',
    categoriaId: 'cat-pedreiro',
    cidadeId: 'cid-sorocaba',
    bairro: 'Além Ponte',
    endereco: 'Av. São Paulo, 1820 - Além Ponte, Sorocaba - SP',
    telefone: '(15) 3227-4400',
    whatsapp: '5515997665544',
    horarioAtendimento: 'Segunda a Sexta: 08h às 18h | Sábado: 08h às 12h',
    site: 'https://marmorariaarteepedra.com.br',
    instagram: '@marmorariaartepedra',
    servicosOuProdutos: [
      'Pias e Bancadas Gourmet em Granito e Quartzo',
      'Lavatórios com Cubas Esculpidas',
      'Ilhas e Balcões para Cozinha Americana',
      'Soleiras, Peitoris e Degraus de Escada',
      'Medição Técnica no Local sem Custo'
    ],
    patrocinada: true,
    posicaoDestaque: 5,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 47,
    analytics: {
      visualizacoes: 1450,
      cliquesWhatsapp: 420,
      cliquesComoChegar: 230,
      cliquesSiteOuInsta: 190
    },
    criadoEm: '2026-01-18T09:00:00Z'
  },
  {
    id: 'emp-16',
    usuarioId: 'usr-emp-16',
    nome: 'Autopeças & Baterias Express Trujillo',
    logoUrl: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Venda de peças para carros nacionais e importados, filtros, óleos lubrificantes, pastilhas de freio, socorro de bateria Heliar e Moura com entrega e instalação grátis a domicílio no Trujillo e Zona Norte.',
    categoriaId: 'cat-mecanica',
    cidadeId: 'cid-sorocaba',
    bairro: 'Trujillo',
    endereco: 'Rua Doutor Américo Figueiredo, 210 - Trujillo, Sorocaba - SP',
    telefone: '(15) 3233-9900',
    whatsapp: '5515991557788',
    horarioAtendimento: 'Segunda a Sexta: 08h às 18h30 | Sábado: 08h às 14h',
    site: 'https://autopecastrujillo.com.br',
    instagram: '@autopecastrujillo',
    servicosOuProdutos: [
      'Baterias Moura e Heliar com Instalação a Domicílio Grátis',
      'Pastilhas de Freio Fras-le e Bosch',
      'Óleos Motul, Castrol, Mobil e Troca Rápida',
      'Amortecedores Cofap e Monroe',
      'Atendimento Rápido via WhatsApp e Entrega Expressa'
    ],
    patrocinada: true,
    posicaoDestaque: 6,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 4.9,
    totalAvaliacoes: 88,
    analytics: {
      visualizacoes: 2190,
      cliquesWhatsapp: 670,
      cliquesComoChegar: 380,
      cliquesSiteOuInsta: 240
    },
    criadoEm: '2026-01-08T08:00:00Z'
  },
  {
    id: 'emp-17',
    usuarioId: 'usr-emp-17',
    nome: 'LogSorocaba - Mudanças, Fretes & Guarda-Móveis Zona Industrial',
    logoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=150&auto=format&fit=crop&q=80',
    fotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb18086f6?w=600&auto=format&fit=crop&q=80'
    ],
    descricao: 'Transportes e mudanças comerciais e residenciais com frota própria de caminhões baú com plataforma elevatória, mantas protetoras e equipe de ajudantes experientes para carregar e descarregar na Zona Industrial e Sorocaba.',
    categoriaId: 'cat-ajudantes',
    cidadeId: 'cid-sorocaba',
    bairro: 'Zona Industrial',
    endereco: 'Av. Jerome Case, 980 - Zona Industrial, Sorocaba - SP',
    telefone: '(15) 3238-5000',
    whatsapp: '5515997441122',
    horarioAtendimento: 'Segunda a Sábado: 07h às 20h (Plantão WhatsApp 24h)',
    site: 'https://logsorocabamudancas.com.br',
    instagram: '@logsorocabamudancas',
    servicosOuProdutos: [
      'Mudanças Residenciais e Comerciais Completas',
      'Caminhão Baú com Equipe de Carga e Descarga',
      'Embalagem Especial com Plástico Bolha e Caixas',
      'Içamento de Móveis e Cargas Pesadas',
      'Fretes Rápidos para Sorocaba e Interior de SP'
    ],
    patrocinada: true,
    posicaoDestaque: 7,
    anuncioAtivo: true,
    status: 'ATIVO',
    notaMedia: 5.0,
    totalAvaliacoes: 63,
    analytics: {
      visualizacoes: 1980,
      cliquesWhatsapp: 590,
      cliquesComoChegar: 270,
      cliquesSiteOuInsta: 220
    },
    criadoEm: '2026-01-14T07:00:00Z'
  }
];

// Initial realistic service requests in diverse states (Aberto, Proposta, Concluído)
export const INITIAL_REQUESTS: ServiceRequest[] = [
  {
    id: 'req-1',
    clienteId: 'cli-1',
    clienteNome: 'Mariana Silva Borges',
    clienteWhatsapp: '5515991234567',
    categoriaId: 'cat-eletrica',
    servico: 'Troca de Fiação e Instalação de Chuveiro',
    descricao: 'Preciso trocar a fiação do chuveiro do banheiro da suíte que está esquentando e desarmando o disjuntor de 32A. O chuveiro novo é um Lorenzetti 7500W.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Campolim',
    dataDesejada: '2026-09-22',
    horarioPreferencia: 'manha',
    urgencia: 'alta',
    fotos: [
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'profissional_interessado',
    propostas: [
      {
        id: 'prop-1',
        pedidoId: 'req-1',
        profissionalId: 'pro-1',
        profissionalNome: 'Carlos Eduardo Oliveira',
        profissionalFoto: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&auto=format&fit=crop&q=80',
        profissionalWhatsapp: '5515997123456',
        valorEstimado: 180,
        prazoEstimado: 'Atendo amanhã às 09:00',
        mensagem: 'Olá Mariana! Posso fazer a troca do circuito com cabo de 6mm² em conformidade com a potência de 7500W e substituir o disjuntor. Levo conectores WAGO para evitar aquecimento.',
        criadoEm: '2026-09-18T11:00:00Z',
        status: 'enviado'
      }
    ],
    criadoEm: '2026-09-18T09:30:00Z',
    atualizadoEm: '2026-09-18T11:00:00Z'
  },
  {
    id: 'req-2',
    clienteId: 'cli-2',
    clienteNome: 'Ricardo Antunes Mendes',
    clienteWhatsapp: '5515997812244',
    categoriaId: 'cat-limpeza',
    servico: 'Diarista Residencial',
    descricao: 'Preciso de uma diarista caprichosa para casa térrea de 3 quartos no Wanel Ville. Serviço inclui limpeza geral, aspiração de tapetes e passar 8 camisas.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    dataDesejada: '2026-09-24',
    horarioPreferencia: 'manha',
    urgencia: 'normal',
    fotos: [],
    status: 'agendado',
    propostas: [
      {
        id: 'prop-2',
        pedidoId: 'req-2',
        profissionalId: 'pro-2',
        profissionalNome: 'Maria de Fátima Rezende',
        profissionalFoto: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
        profissionalWhatsapp: '5515998124578',
        valorEstimado: 190,
        prazoEstimado: 'Quinta-feira às 08:00',
        mensagem: 'Olá Ricardo! Tenho disponibilidade para a quinta-feira. Faço o serviço completo conforme você precisa com pontualidade.',
        criadoEm: '2026-09-17T14:00:00Z',
        status: 'aceito'
      }
    ],
    profissionalEscolhidoId: 'pro-2',
    criadoEm: '2026-09-17T10:00:00Z',
    atualizadoEm: '2026-09-17T15:30:00Z'
  },
  {
    id: 'req-3',
    clienteId: 'cli-3',
    clienteNome: 'Beatriz Vasconcelos',
    clienteWhatsapp: '5515996548899',
    categoriaId: 'cat-hidraulica',
    servico: 'Conserto de Torneiras e Registros',
    descricao: 'Registro geral do banheiro social está pingando sem parar e não fecha totalmente. Precisa de reparo urgente.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Além Ponte',
    dataDesejada: '2026-09-19',
    horarioPreferencia: 'qualquer',
    urgencia: 'urgente',
    fotos: [],
    status: 'aberto',
    propostas: [],
    criadoEm: '2026-09-19T08:00:00Z',
    atualizadoEm: '2026-09-19T08:00:00Z'
  },
  {
    id: 'req-4',
    clienteId: 'cli-4',
    clienteNome: 'Felipe Camargo',
    clienteWhatsapp: '5515981123344',
    categoriaId: 'cat-manutencao',
    servico: 'Montagem e Desmontagem de Móveis',
    descricao: 'Montagem de 1 guarda-roupas casal 6 portas com espelho e 1 escrivaninha de escritório comprados pela internet.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Trujillo',
    dataDesejada: '2026-09-21',
    horarioPreferencia: 'tarde',
    urgencia: 'normal',
    fotos: [],
    status: 'concluido',
    propostas: [
      {
        id: 'prop-3',
        pedidoId: 'req-4',
        profissionalId: 'pro-4',
        profissionalNome: 'Lucas Gabriel Moreira',
        profissionalFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
        profissionalWhatsapp: '5515991448822',
        valorEstimado: 220,
        prazoEstimado: 'Segunda-feira 13:30',
        mensagem: 'Olá Felipe! Faço a montagem com nível laser e regulagem das portas e gavetas.',
        criadoEm: '2026-09-15T12:00:00Z',
        status: 'aceito'
      }
    ],
    profissionalEscolhidoId: 'pro-4',
    avaliacaoId: 'rev-1',
    criadoEm: '2026-09-15T10:00:00Z',
    atualizadoEm: '2026-09-16T17:00:00Z'
  },
  {
    id: 'req-5',
    clienteId: 'cli-2',
    clienteNome: 'Ricardo Antunes Mendes',
    clienteWhatsapp: '5515997812244',
    categoriaId: 'cat-esquadrias-blindex',
    servico: 'Instalação de Box Blindex e Janela de Alumínio',
    descricao: 'Preciso instalar um box blindex frontal fumê 8mm no banheiro social e trocar a janela de alumínio do quarto que está com as roldanas quebradas e emperrada.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    dataDesejada: '2026-09-24',
    horarioPreferencia: 'manha',
    urgencia: 'alta',
    fotos: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'profissional_interessado',
    propostas: [
      {
        id: 'prop-5',
        pedidoId: 'req-5',
        profissionalId: 'pro-21',
        profissionalNome: 'Marcos Vinícius de Souza',
        profissionalFoto: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80',
        profissionalWhatsapp: '5515998124455',
        valorEstimado: 480,
        prazoEstimado: 'Quarta-feira 09:00',
        mensagem: 'Olá Ricardo! Tenho o kit box blindex com perfil de alumínio reforçado e roldanas blindadas de alta durabilidade. Faço também o alinhamento da janela.',
        criadoEm: '2026-09-18T14:20:00Z',
        status: 'enviado'
      }
    ],
    criadoEm: '2026-09-18T12:00:00Z',
    atualizadoEm: '2026-09-18T14:20:00Z'
  },
  {
    id: 'req-6',
    clienteId: 'cli-1',
    clienteNome: 'Mariana Silva Borges (Distribuidora)',
    clienteWhatsapp: '5515991234567',
    categoriaId: 'cat-ajudantes',
    servico: 'Ajudante para Descarregar Caminhão',
    descricao: 'Preciso de 2 ajudantes com disposição física para descarregar um caminhão baú com 180 caixas e fardos no depósito no Éden/Zona Industrial. Previsão de início às 08h30 com duração de 4 horas.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Éden',
    dataDesejada: '2026-09-23',
    horarioPreferencia: 'manha',
    urgencia: 'urgente',
    fotos: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'aberto',
    propostas: [],
    criadoEm: '2026-09-19T10:00:00Z',
    atualizadoEm: '2026-09-19T10:00:00Z'
  },
  {
    id: 'req-7',
    clienteId: 'cli-2',
    clienteNome: 'Ricardo Antunes Mendes',
    clienteWhatsapp: '5515997812244',
    categoriaId: 'cat-ajudantes',
    servico: 'Panfletagem (Eleições, Comércio e Eventos)',
    descricao: 'Preciso de pessoas para panfletagem de material gráfico informativo em cruzamentos estratégicos e calçadão do Centro de Sorocaba durante a manhã (08:00 às 12:00). Pago diária justa no término.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Centro',
    dataDesejada: '2026-09-24',
    horarioPreferencia: 'manha',
    urgencia: 'normal',
    fotos: [],
    status: 'aberto',
    propostas: [],
    criadoEm: '2026-09-19T11:30:00Z',
    atualizadoEm: '2026-09-19T11:30:00Z'
  },
  {
    id: 'req-8',
    clienteId: 'cli-4',
    clienteNome: 'Juliana Camargo Dias',
    clienteWhatsapp: '5515998765432',
    categoriaId: 'cat-pedreiro',
    servico: 'Construção de Muros e Alvenaria',
    descricao: 'Preciso de pedreiro de confiança para construir muro de divisa no quintal (aproximadamente 16 metros por 2m de altura) com bloco de concreto de 14, colunas de ferro e reboco liso no Wanel Ville.',
    cidadeId: 'cid-sorocaba',
    bairro: 'Wanel Ville',
    dataDesejada: '2026-09-25',
    horarioPreferencia: 'manha',
    urgencia: 'alta',
    fotos: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&auto=format&fit=crop&q=80'
    ],
    status: 'aberto',
    propostas: [],
    criadoEm: '2026-09-19T14:10:00Z',
    atualizadoEm: '2026-09-19T14:10:00Z'
  }
];

export const INITIAL_REVIEWS: Review[] = [
  {
    id: 'rev-1',
    pedidoId: 'req-4',
    alvoTipo: 'profissional',
    alvoId: 'pro-4',
    clienteId: 'cli-4',
    clienteNome: 'Felipe Camargo',
    clienteFoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    nota: 5,
    comentario: 'O Lucas é um excelente montador! Muito educado, pontual, trouxe todas as ferramentas e o guarda-roupa ficou perfeito, sem nenhum arranhão.',
    criadoEm: '2026-09-16T18:00:00Z'
  },
  {
    id: 'rev-2',
    alvoTipo: 'profissional',
    alvoId: 'pro-1',
    clienteId: 'cli-5',
    clienteNome: 'Camila Toledo Ferreira',
    clienteFoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    nota: 5,
    comentario: 'O Carlos resolveu um curto-circuito no meu apartamento no Mangal em menos de uma hora. Muito profissional e explicou tudo certinho.',
    criadoEm: '2026-09-12T14:30:00Z'
  },
  {
    id: 'rev-3',
    alvoTipo: 'profissional',
    alvoId: 'pro-2',
    clienteId: 'cli-6',
    clienteNome: 'Rodrigo Paes de Almeida',
    clienteFoto: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    nota: 5,
    comentario: 'Dona Maria é maravilhosa. A casa ficou impecável e cheirosa. Super recomendada para quem mora em Sorocaba.',
    criadoEm: '2026-09-10T16:00:00Z'
  },
  {
    id: 'rev-4',
    alvoTipo: 'empresa',
    alvoId: 'emp-1',
    clienteId: 'cli-7',
    clienteNome: 'Larissa Albuquerque',
    clienteFoto: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    nota: 5,
    comentario: 'Levo meu Spitz Alemão na Pet Mania há 2 anos. A tosa na tesoura é espetacular e eles cuidam dos animais com muito amor!',
    criadoEm: '2026-09-08T11:20:00Z'
  },
  {
    id: 'rev-5',
    pedidoId: 'req-5',
    alvoTipo: 'profissional',
    alvoId: 'pro-21',
    clienteId: 'cli-3',
    clienteNome: 'Beatriz Vasconcelos',
    clienteFoto: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    nota: 5,
    comentario: 'O Marcos instalou o box blindex do meu banheiro e regulou as portas de correr de alumínio da sala. Trabalho impecável, sem sujeira e muito caprichoso!',
    criadoEm: '2026-09-14T15:00:00Z'
  }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  {
    id: 'log-1',
    acao: 'Profissional Aprovado',
    usuario: 'Administrador',
    detalhes: 'Profissional Carlos Eduardo Oliveira (Eletricista) aprovado com plano 6 Meses Grátis.',
    timestamp: '2026-09-01T10:00:00Z',
    tipo: 'aprovacao'
  },
  {
    id: 'log-2',
    acao: 'Empresa Destacada',
    usuario: 'Administrador',
    detalhes: 'Pet Mania Sorocaba definida como Patrocinada Destaque Posição #1 no Campolim.',
    timestamp: '2026-09-02T14:30:00Z',
    tipo: 'destaque'
  },
  {
    id: 'log-3',
    acao: 'Novo Pedido de Serviço',
    usuario: 'Mariana Silva Borges',
    detalhes: 'Pedido de Elétrica #req-1 aberto para profissionais de Sorocaba.',
    timestamp: '2026-09-18T09:30:00Z',
    tipo: 'pedido'
  }
];
