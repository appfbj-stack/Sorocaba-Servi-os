import {
  City,
  ServiceCategory,
  User,
  Professional,
  Business,
  ServiceRequest,
  ServiceProposal,
  Review,
  AuditLog,
  SmartClassificationResult
} from '../types.ts';
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_CLIENTS,
  INITIAL_PROFESSIONALS,
  INITIAL_BUSINESSES,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData.ts';

const STORAGE_KEYS = {
  CITIES: 'sorocaba_servicos_cities_v1',
  CATEGORIES: 'sorocaba_servicos_categories_v1',
  CLIENTS: 'sorocaba_servicos_clients_v1',
  PROFESSIONALS: 'sorocaba_servicos_professionals_v1',
  BUSINESSES: 'sorocaba_servicos_businesses_v1',
  REQUESTS: 'sorocaba_servicos_requests_v1',
  REVIEWS: 'sorocaba_servicos_reviews_v1',
  AUDIT_LOGS: 'sorocaba_servicos_audit_v1',
  FAVORITES: 'sorocaba_servicos_favorites_v1',
  ACTIVE_USER: 'sorocaba_servicos_active_user_v1',
  SELECTED_CITY_ID: 'sorocaba_servicos_selected_city_id_v1'
};

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function save<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.error(`Erro salvando ${key}:`, err);
  }
}

export const StorageService = {
  // Reset all to seed data
  resetDatabase(): void {
    localStorage.clear();
    save(STORAGE_KEYS.CITIES, INITIAL_CITIES);
    save(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
    save(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
    save(STORAGE_KEYS.PROFESSIONALS, INITIAL_PROFESSIONALS);
    save(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
    save(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
    save(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
    save(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
    save(STORAGE_KEYS.FAVORITES, ['pro-1', 'emp-1']);
    save(STORAGE_KEYS.SELECTED_CITY_ID, 'cid-sorocaba');
    save(STORAGE_KEYS.ACTIVE_USER, INITIAL_CLIENTS[0]);
  },

  // Cities
  getCities(): City[] {
    return load<City[]>(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  },

  getSelectedCityId(): string {
    return load<string>(STORAGE_KEYS.SELECTED_CITY_ID, 'cid-sorocaba');
  },

  setSelectedCityId(cityId: string): void {
    save(STORAGE_KEYS.SELECTED_CITY_ID, cityId);
  },

  addCity(city: Omit<City, 'id'>): City {
    const cities = this.getCities();
    const newCity: City = {
      ...city,
      id: `cid-${Date.now()}`
    };
    cities.push(newCity);
    save(STORAGE_KEYS.CITIES, cities);
    this.addAuditLog('Cidade Adicionada', 'Administrador', `Nova cidade ${newCity.nome}/${newCity.estado} adicionada.`, 'seguranca');
    return newCity;
  },

  toggleCityActive(cityId: string): void {
    const cities = this.getCities().map(c => c.id === cityId ? { ...c, ativo: !c.ativo } : c);
    save(STORAGE_KEYS.CITIES, cities);
  },

  // Categories
  getCategories(): ServiceCategory[] {
    return load<ServiceCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // Active User / Auth
  getActiveUser(): User {
    const user = load<User | null>(STORAGE_KEYS.ACTIVE_USER, null);
    if (user) return user;
    return INITIAL_CLIENTS[0];
  },

  setActiveUser(user: User): void {
    save(STORAGE_KEYS.ACTIVE_USER, user);
  },

  getAllClients(): User[] {
    return load<User[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
  },

  registerUser(userData: Omit<User, 'id' | 'criadoEm'>): User {
    const clients = this.getAllClients();
    const newUser: User = {
      ...userData,
      id: `user-${Date.now()}`,
      criadoEm: new Date().toISOString()
    };
    clients.push(newUser);
    save(STORAGE_KEYS.CLIENTS, clients);
    this.setActiveUser(newUser);
    this.addAuditLog('Novo Cadastro', newUser.nome, `Usuário registrado como ${newUser.role}.`, 'seguranca');
    return newUser;
  },

  // Professionals
  getProfessionals(): Professional[] {
    return load<Professional[]>(STORAGE_KEYS.PROFESSIONALS, INITIAL_PROFESSIONALS);
  },

  getProfessionalById(id: string): Professional | undefined {
    return this.getProfessionals().find(p => p.id === id);
  },

  saveProfessional(pro: Professional): void {
    const pros = this.getProfessionals().map(p => p.id === pro.id ? pro : p);
    save(STORAGE_KEYS.PROFESSIONALS, pros);
  },

  registerProfessional(data: {
    nome: string;
    tituloProfissional: string;
    categoriaId: string;
    servicos: string[];
    descricao: string;
    bairrosAtendidos: string[];
    whatsapp: string;
    telefone: string;
    cidadeId: string;
  }): Professional {
    const pros = this.getProfessionals();
    const newPro: Professional = {
      id: `pro-${Date.now()}`,
      usuarioId: `usr-${Date.now()}`,
      nome: data.nome,
      tituloProfissional: data.tituloProfissional,
      fotoUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
      categoriaId: data.categoriaId,
      servicos: data.servicos,
      descricao: data.descricao,
      cidadeId: data.cidadeId,
      bairrosAtendidos: data.bairrosAtendidos,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      telefone: data.telefone,
      horarioAtendimento: 'Segunda a Sábado, das 08:00 às 18:00',
      disponivelAgora: true,
      verificado: false,
      status: 'PENDENTE',
      notaMedia: 5.0,
      totalAvaliacoes: 0,
      portfolio: [],
      plano: {
        tipo: 'gratuito_6_meses',
        nome: 'Degustação 6 Meses Grátis',
        dataInicio: new Date().toISOString(),
        dataTermino: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'ativo',
        limiteOrcamentosPorMes: 999,
        origemCadastro: 'organico'
      },
      criadoEm: new Date().toISOString()
    };
    pros.push(newPro);
    save(STORAGE_KEYS.PROFESSIONALS, pros);
    this.addAuditLog('Novo Profissional Cadastrado', data.nome, `Profissional cadastrado aguardando aprovação.`, 'aprovacao');
    return newPro;
  },

  toggleProfessionalAvailability(proId: string): boolean {
    const pros = this.getProfessionals();
    let newState = false;
    const updated = pros.map(p => {
      if (p.id === proId) {
        newState = !p.disponivelAgora;
        return { ...p, disponivelAgora: newState };
      }
      return p;
    });
    save(STORAGE_KEYS.PROFESSIONALS, updated);
    return newState;
  },

  updateProfessionalStatus(proId: string, status: 'ATIVO' | 'PENDENTE' | 'BLOQUEADO'): void {
    const pros = this.getProfessionals().map(p => p.id === proId ? { ...p, status, verificado: status === 'ATIVO' } : p);
    save(STORAGE_KEYS.PROFESSIONALS, pros);
    this.addAuditLog('Status Profissional Alterado', 'Administrador', `Profissional #${proId} alterado para ${status}.`, status === 'BLOQUEADO' ? 'bloqueio' : 'aprovacao');
  },

  extendProfessionalTrial(proId: string, extraDays: number = 180): void {
    const pros = this.getProfessionals().map(p => {
      if (p.id === proId) {
        const currEnd = new Date(p.plano.dataTermino).getTime();
        const newEnd = new Date(currEnd + extraDays * 24 * 60 * 60 * 1000).toISOString();
        return {
          ...p,
          plano: {
            ...p.plano,
            dataTermino: newEnd,
            status: 'ativo' as const
          }
        };
      }
      return p;
    });
    save(STORAGE_KEYS.PROFESSIONALS, pros);
    this.addAuditLog('Período Gratuito Estendido', 'Administrador', `Adicionados ${extraDays} dias para o profissional #${proId}.`, 'aprovacao');
  },

  // Businesses
  getBusinesses(): Business[] {
    return load<Business[]>(STORAGE_KEYS.BUSINESSES, INITIAL_BUSINESSES);
  },

  getBusinessById(id: string): Business | undefined {
    return this.getBusinesses().find(b => b.id === id);
  },

  registerBusiness(data: {
    nome: string;
    categoriaId: string;
    cidadeId: string;
    bairro: string;
    endereco: string;
    telefone: string;
    whatsapp: string;
    descricao: string;
    servicosOuProdutos: string[];
  }): Business {
    const list = this.getBusinesses();
    const newBiz: Business = {
      id: `emp-${Date.now()}`,
      usuarioId: `usr-biz-${Date.now()}`,
      nome: data.nome,
      logoUrl: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?w=150&auto=format&fit=crop&q=80',
      fotos: [
        'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'
      ],
      descricao: data.descricao,
      categoriaId: data.categoriaId,
      cidadeId: data.cidadeId,
      bairro: data.bairro,
      endereco: data.endereco,
      telefone: data.telefone,
      whatsapp: data.whatsapp.replace(/\D/g, ''),
      horarioAtendimento: 'Segunda a Sexta: 08:00 às 18:00',
      servicosOuProdutos: data.servicosOuProdutos,
      patrocinada: false,
      anuncioAtivo: false,
      status: 'PENDENTE',
      notaMedia: 5.0,
      totalAvaliacoes: 0,
      analytics: {
        visualizacoes: 0,
        cliquesWhatsapp: 0,
        cliquesComoChegar: 0,
        cliquesSiteOuInsta: 0
      },
      criadoEm: new Date().toISOString()
    };
    list.push(newBiz);
    save(STORAGE_KEYS.BUSINESSES, list);
    this.addAuditLog('Nova Empresa Cadastrada', data.nome, `Empresa cadastrada aguardando aprovação.`, 'aprovacao');
    return newBiz;
  },

  trackBusinessClick(businessId: string, type: 'view' | 'whatsapp' | 'maps' | 'link'): void {
    const list = this.getBusinesses().map(b => {
      if (b.id === businessId) {
        return {
          ...b,
          analytics: {
            visualizacoes: b.analytics.visualizacoes + (type === 'view' ? 1 : 0),
            cliquesWhatsapp: b.analytics.cliquesWhatsapp + (type === 'whatsapp' ? 1 : 0),
            cliquesComoChegar: b.analytics.cliquesComoChegar + (type === 'maps' ? 1 : 0),
            cliquesSiteOuInsta: b.analytics.cliquesSiteOuInsta + (type === 'link' ? 1 : 0)
          }
        };
      }
      return b;
    });
    save(STORAGE_KEYS.BUSINESSES, list);
  },

  toggleBusinessSponsored(businessId: string): boolean {
    const list = this.getBusinesses();
    let isSponsored = false;
    const updated = list.map(b => {
      if (b.id === businessId) {
        isSponsored = !b.patrocinada;
        return {
          ...b,
          patrocinada: isSponsored,
          anuncioAtivo: isSponsored,
          posicaoDestaque: isSponsored ? 1 : undefined,
          dataInicioAnuncio: isSponsored ? new Date().toISOString() : undefined,
          dataFimAnuncio: isSponsored ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() : undefined
        };
      }
      return b;
    });
    save(STORAGE_KEYS.BUSINESSES, updated);
    this.addAuditLog('Destaque de Empresa Alterado', 'Administrador', `Empresa #${businessId} destaque = ${isSponsored}`, 'destaque');
    return isSponsored;
  },

  updateBusinessStatus(businessId: string, status: 'ATIVO' | 'PENDENTE' | 'BLOQUEADO'): void {
    const list = this.getBusinesses().map(b => b.id === businessId ? { ...b, status } : b);
    save(STORAGE_KEYS.BUSINESSES, list);
    this.addAuditLog('Status Empresa Alterado', 'Administrador', `Empresa #${businessId} alterada para ${status}.`, status === 'BLOQUEADO' ? 'bloqueio' : 'aprovacao');
  },

  // Service Requests
  getServiceRequests(): ServiceRequest[] {
    return load<ServiceRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  },

  createServiceRequest(request: {
    clienteId: string;
    clienteNome: string;
    clienteWhatsapp: string;
    categoriaId: string;
    servico: string;
    descricao: string;
    cidadeId: string;
    bairro: string;
    dataDesejada: string;
    horarioPreferencia: 'manha' | 'tarde' | 'noite' | 'qualquer';
    urgencia: 'baixa' | 'normal' | 'alta' | 'urgente';
    fotos: string[];
  }): ServiceRequest {
    const list = this.getServiceRequests();
    const newReq: ServiceRequest = {
      ...request,
      id: `req-${Date.now()}`,
      status: 'aberto',
      propostas: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString()
    };
    list.unshift(newReq);
    save(STORAGE_KEYS.REQUESTS, list);
    this.addAuditLog('Novo Pedido de Serviço', request.clienteNome, `Solicitado serviço de ${request.servico} no bairro ${request.bairro}.`, 'pedido');
    return newReq;
  },

  sendProposal(pedidoId: string, proposal: {
    profissionalId: string;
    profissionalNome: string;
    profissionalFoto: string;
    profissionalWhatsapp: string;
    valorEstimado?: number;
    prazoEstimado: string;
    mensagem: string;
  }): void {
    const list = this.getServiceRequests().map(req => {
      if (req.id === pedidoId) {
        const newProposal: ServiceProposal = {
          ...proposal,
          id: `prop-${Date.now()}`,
          pedidoId,
          criadoEm: new Date().toISOString(),
          status: 'enviado'
        };
        const updatedProposals = [...req.propostas, newProposal];
        return {
          ...req,
          propostas: updatedProposals,
          status: req.status === 'aberto' ? ('profissional_interessado' as const) : req.status,
          atualizadoEm: new Date().toISOString()
        };
      }
      return req;
    });
    save(STORAGE_KEYS.REQUESTS, list);
    this.addAuditLog('Orçamento Enviado', proposal.profissionalNome, `Orçamento enviado para pedido #${pedidoId}.`, 'pedido');
  },

  acceptProposal(pedidoId: string, proposalId: string): void {
    const list = this.getServiceRequests().map(req => {
      if (req.id === pedidoId) {
        const chosen = req.propostas.find(p => p.id === proposalId);
        const updatedProposals = req.propostas.map(p => ({
          ...p,
          status: p.id === proposalId ? ('aceito' as const) : ('recusado' as const)
        }));
        return {
          ...req,
          propostas: updatedProposals,
          profissionalEscolhidoId: chosen?.profissionalId,
          status: 'agendado' as const,
          atualizadoEm: new Date().toISOString()
        };
      }
      return req;
    });
    save(STORAGE_KEYS.REQUESTS, list);
    this.addAuditLog('Proposta Aceita', 'Cliente', `Proposta aceita para pedido #${pedidoId}.`, 'pedido');
  },

  updateRequestStatus(pedidoId: string, status: ServiceRequest['status']): void {
    const list = this.getServiceRequests().map(req => {
      if (req.id === pedidoId) {
        return {
          ...req,
          status,
          atualizadoEm: new Date().toISOString()
        };
      }
      return req;
    });
    save(STORAGE_KEYS.REQUESTS, list);
    this.addAuditLog('Status de Pedido Alterado', 'Sistema', `Pedido #${pedidoId} alterado para ${status}.`, 'pedido');
  },

  // Reviews
  getReviews(): Review[] {
    return load<Review[]>(STORAGE_KEYS.REVIEWS, INITIAL_REVIEWS);
  },

  addReview(reviewData: Omit<Review, 'id' | 'criadoEm'>): Review {
    const reviews = this.getReviews();
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      criadoEm: new Date().toISOString()
    };
    reviews.unshift(newRev);
    save(STORAGE_KEYS.REVIEWS, reviews);

    // Update target rating
    if (reviewData.alvoTipo === 'profissional') {
      const pros = this.getProfessionals();
      const target = pros.find(p => p.id === reviewData.alvoId);
      if (target) {
        const proReviews = reviews.filter(r => r.alvoTipo === 'profissional' && r.alvoId === reviewData.alvoId);
        const sum = proReviews.reduce((acc, r) => acc + r.nota, 0);
        const avg = Number((sum / proReviews.length).toFixed(1));
        this.saveProfessional({
          ...target,
          notaMedia: avg,
          totalAvaliacoes: proReviews.length
        });
      }
    }

    if (reviewData.pedidoId) {
      this.updateRequestStatus(reviewData.pedidoId, 'concluido');
    }

    this.addAuditLog('Avaliação Registrada', reviewData.clienteNome, `Avaliação de ${reviewData.nota} estrelas adicionada.`, 'pedido');
    return newRev;
  },

  // Favorites
  getFavorites(): string[] {
    return load<string[]>(STORAGE_KEYS.FAVORITES, ['pro-1', 'emp-1']);
  },

  isFavorite(id: string): boolean {
    return this.getFavorites().includes(id);
  },

  toggleFavorite(id: string): boolean {
    const favs = this.getFavorites();
    const exists = favs.includes(id);
    const updated = exists ? favs.filter(item => item !== id) : [...favs, id];
    save(STORAGE_KEYS.FAVORITES, updated);
    return !exists;
  },

  // Audit Logs
  getAuditLogs(): AuditLog[] {
    return load<AuditLog[]>(STORAGE_KEYS.AUDIT_LOGS, INITIAL_AUDIT_LOGS);
  },

  addAuditLog(acao: string, usuario: string, detalhes: string, tipo: AuditLog['tipo']): void {
    const logs = this.getAuditLogs();
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      acao,
      usuario,
      detalhes,
      timestamp: new Date().toISOString(),
      tipo
    };
    logs.unshift(newLog);
    // Keep last 100
    save(STORAGE_KEYS.AUDIT_LOGS, logs.slice(0, 100));
  },

  // Smart natural language parser (Portuguese AI simulation for "O que você precisa?")
  classifyNaturalLanguageRequest(text: string): SmartClassificationResult {
    const lower = text.toLowerCase();

    // Check elétrica
    if (lower.includes('tomada') || lower.includes('chuveiro') || lower.includes('eletric') || lower.includes('fiação') || lower.includes('disjuntor') || lower.includes('luz') || lower.includes('esquentando') || lower.includes('curto')) {
      const isUrgent = lower.includes('queimou') || lower.includes('esquentando') || lower.includes('curto') || lower.includes('urgente') || lower.includes('sem luz');
      return {
        categoriaId: 'cat-eletrica',
        categoriaNome: 'Eletricista',
        servicoSugerido: lower.includes('chuveiro') ? 'Instalação ou Troca de Chuveiro' : lower.includes('tomada') ? 'Troca de Tomadas e Disjuntores' : 'Manutenção Elétrica Geral',
        urgencia: isUrgent ? 'urgente' : 'normal',
        confianca: 0.95,
        motivo: 'Detectamos termos ligados a rede elétrica e aquecimento de componentes.',
        perguntasComplementares: [
          'O disjuntor principal está desarmando?',
          'A fiação aparente apresenta cheiro de queimado?',
          'Qual a voltagem do local (110V ou 220V)?'
        ]
      };
    }

    // Check limpeza
    if (lower.includes('diarista') || lower.includes('faxina') || lower.includes('limpeza') || lower.includes('passadeira') || lower.includes('sofá') || lower.includes('estofado') || lower.includes('apartamento')) {
      return {
        categoriaId: 'cat-limpeza',
        categoriaNome: 'Limpeza e Diaristas',
        servicoSugerido: lower.includes('pós-obra') || lower.includes('obra') ? 'Faxina Pós-Obra' : lower.includes('sofá') ? 'Higienização de Estofados' : 'Diarista Residencial',
        urgencia: lower.includes('amanhã') || lower.includes('hoje') ? 'alta' : 'normal',
        confianca: 0.92,
        motivo: 'Identificada solicitação de higienização ou serviço de diarista.',
        perguntasComplementares: [
          'Quantos quartos e banheiros possui o imóvel?',
          'Há animais domésticos no local?',
          'Os produtos de limpeza serão fornecidos por você?'
        ]
      };
    }

    // Check hidráulica
    if (lower.includes('vazamento') || lower.includes('cano') || lower.includes('torneira') || lower.includes('encanador') || lower.includes('registro') || lower.includes('entup') || lower.includes('descarga') || lower.includes('esgoto')) {
      return {
        categoriaId: 'cat-hidraulica',
        categoriaNome: 'Encanador e Hidráulica',
        servicoSugerido: lower.includes('vazamento') ? 'Caça-Vazamentos e Reparo Hidráulico' : lower.includes('entup') ? 'Desentupimento de Esgoto e Ralos' : 'Reparo de Registros e Torneiras',
        urgencia: lower.includes('vazando') || lower.includes('inundando') ? 'urgente' : 'alta',
        confianca: 0.94,
        motivo: 'Palavras-chave relacionadas a encanamento e fluxo de água.',
        perguntasComplementares: [
          'O vazamento é visível ou sob o piso?',
          'O registro geral foi fechado?',
          'Trata-se de casa ou apartamento?'
        ]
      };
    }

    // Check ar-condicionado
    if (lower.includes('ar-condicionado') || lower.includes('ar condicionado') || lower.includes('split') || lower.includes('gelando') || lower.includes('gás')) {
      return {
        categoriaId: 'cat-climatizacao',
        categoriaNome: 'Ar-Condicionado & Clima',
        servicoSugerido: lower.includes('instalar') ? 'Instalação de Ar-Condicionado Split' : lower.includes('limpeza') || lower.includes('cheiro') ? 'Higienização Completa Antibacteriana' : 'Recarga de Gás e Manutenção',
        urgencia: 'normal',
        confianca: 0.91,
        motivo: 'Detectada menção a sistema de climatização.',
        perguntasComplementares: [
          'Qual a potência do aparelho (ex: 9.000, 12.000 ou 18.000 BTUs)?',
          'Já existe infraestrutura de tubulação passada na parede?'
        ]
      };
    }

    // Check móveis / manutenção
    if (lower.includes('móvel') || lower.includes('movel') || lower.includes('montador') || lower.includes('cortina') || lower.includes('suporte') || lower.includes('furar') || lower.includes('guarda-roupa')) {
      return {
        categoriaId: 'cat-manutencao',
        categoriaNome: 'Manutenção & Marido de Aluguel',
        servicoSugerido: lower.includes('guarda-roupa') || lower.includes('móvel') ? 'Montagem de Móveis' : 'Instalação de Suporte de TV e Quadros',
        urgencia: 'normal',
        confianca: 0.89,
        motivo: 'Termos compatíveis com serviços de montador ou marido de aluguel.',
        perguntasComplementares: [
          'Os móveis já foram entregues na residência?',
          'As paredes são de alvenaria convencional ou drywall?'
        ]
      };
    }

    // Check pet
    if (lower.includes('cachorro') || lower.includes('gato') || lower.includes('pet') || lower.includes('tosa') || lower.includes('banho') || lower.includes('passeador')) {
      return {
        categoriaId: 'cat-pet',
        categoriaNome: 'Pet & Veterinária',
        servicoSugerido: lower.includes('banho') || lower.includes('tosa') ? 'Banho e Tosa em Domicílio' : 'Dog Walker e Passeios',
        urgencia: 'normal',
        confianca: 0.90,
        motivo: 'Serviço voltado a cuidados animais e pets.',
        perguntasComplementares: [
          'Qual o porte e raça do seu pet?',
          'O animal possui alguma necessidade especial ou temperamento reativo?'
        ]
      };
    }

    // Check automotivo
    if (lower.includes('carro') || lower.includes('bateria') || lower.includes('mecanic') || lower.includes('pneu') || lower.includes('motor')) {
      return {
        categoriaId: 'cat-automotivo',
        categoriaNome: 'Automotivo & Mecânica',
        servicoSugerido: lower.includes('bateria') ? 'Troca de Bateria Emergencial' : 'Socorro Mecânico a Domicílio',
        urgencia: lower.includes('parou') || lower.includes('bateria') ? 'urgente' : 'normal',
        confianca: 0.92,
        motivo: 'Termos de assistência automotiva.',
        perguntasComplementares: [
          'Qual a marca, modelo e ano do veículo?',
          'O carro está estacionado em garagem ou em via pública?'
        ]
      };
    }

    // Fallback general service
    return {
      categoriaId: 'cat-manutencao',
      categoriaNome: 'Manutenção Geral',
      servicoSugerido: 'Serviço Especializado Sob Demanda',
      urgencia: 'normal',
      confianca: 0.70,
      motivo: 'Classificação preliminar baseada no texto informado.',
      perguntasComplementares: [
        'Pode detalhar um pouco mais o que precisa ser feito?',
        'Qual o melhor dia e horário para o atendimento?'
      ]
    };
  },

  // WhatsApp Link Helper
  buildWhatsAppUrl(phone: string, message: string): string {
    const cleanPhone = phone.replace(/\D/g, '');
    const encoded = encodeURIComponent(message);
    return `https://wa.me/${cleanPhone.startsWith('55') ? cleanPhone : '55' + cleanPhone}?text=${encoded}`;
  }
};
