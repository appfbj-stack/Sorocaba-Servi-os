export type UserRole = 'cliente' | 'profissional' | 'empresa' | 'admin';

export type ProfessionalStatus = 'ATIVO' | 'PENDENTE' | 'BLOQUEADO';
export type BusinessStatus = 'ATIVO' | 'PENDENTE' | 'BLOQUEADO';

export type RequestStatus = 
  | 'aberto' 
  | 'recebido' 
  | 'profissional_interessado' 
  | 'em_negociacao' 
  | 'agendado' 
  | 'concluido' 
  | 'cancelado';

export interface City {
  id: string;
  nome: string;
  estado: string;
  slug?: string;
  ativo: boolean;
  cidadePrincipal: boolean;
  bairros: string[];
  bairrosPrincipais?: string[];
}

export interface ServiceCategory {
  id: string;
  nome: string;
  slug: string;
  icone: string;
  descricao: string;
  popular: boolean;
  servicosPadrao: string[];
  servicosExemplos?: string[];
}

export interface User {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  role: UserRole;
  cidadeId: string;
  bairro?: string;
  avatarUrl?: string;
  criadoEm: string;
}

export interface ProfessionalPlan {
  tipo: 'gratuito_6_meses' | 'profissional' | 'pro' | 'pacote_10_creditos';
  nome: string;
  dataInicio: string;
  dataTermino?: string;
  status: 'ativo' | 'expirado' | 'aviso_vencimento';
  limiteOrcamentosPorMes: number;
  origemCadastro: 'organico' | 'indicacao' | 'campanha';
}

export interface PixRechargeTransaction {
  id: string;
  profissionalId: string;
  profissionalNome: string;
  valor: number;
  oportunidadesLiberadas: number;
  chavePix: string;
  status: 'concluido' | 'pendente';
  dataHora: string;
}

export interface PortfolioItem {
  id: string;
  titulo: string;
  descricao: string;
  fotoUrl: string;
}

export interface Professional {
  id: string;
  usuarioId: string;
  nome: string;
  tituloProfissional: string;
  fotoUrl: string;
  categoriaId: string;
  servicos: string[];
  descricao: string;
  cidadeId: string;
  bairrosAtendidos: string[];
  bairroBase?: string;
  latitude?: number;
  longitude?: number;
  whatsapp: string;
  telefone: string;
  horarioAtendimento: string;
  disponivelAgora: boolean;
  verificado: boolean;
  status: ProfessionalStatus;
  notaMedia: number;
  totalAvaliacoes: number;
  portfolio: (PortfolioItem | string)[];
  plano: ProfessionalPlan;
  oportunidadesDisponiveis?: number;
  pedidosDesbloqueadosIds?: string[];
  criadoEm: string;
}

export interface BusinessAnalytics {
  visualizacoes: number;
  cliquesWhatsapp: number;
  cliquesComoChegar: number;
  cliquesSiteOuInsta: number;
}

export interface Business {
  id: string;
  usuarioId: string;
  nome: string;
  logoUrl: string;
  fotos: string[];
  descricao: string;
  categoriaId: string;
  cidadeId: string;
  bairro: string;
  endereco: string;
  telefone: string;
  whatsapp: string;
  horarioAtendimento: string;
  site?: string;
  instagram?: string;
  servicosOuProdutos: string[];
  patrocinada: boolean;
  posicaoDestaque?: number;
  anuncioAtivo: boolean;
  dataInicioAnuncio?: string;
  dataFimAnuncio?: string;
  status: BusinessStatus;
  notaMedia: number;
  totalAvaliacoes: number;
  analytics: BusinessAnalytics;
  criadoEm: string;
}

export interface ServiceProposal {
  id: string;
  pedidoId: string;
  profissionalId: string;
  profissionalNome: string;
  profissionalFoto: string;
  profissionalWhatsapp: string;
  valorEstimado?: number;
  prazoEstimado: string;
  mensagem: string;
  criadoEm: string;
  status: 'enviado' | 'aceito' | 'recusado';
}

export interface ServiceRequest {
  id: string;
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
  status: RequestStatus;
  propostas: ServiceProposal[];
  profissionalEscolhidoId?: string;
  avaliacaoId?: string;
  criadoEm: string;
  atualizadoEm: string;
}

export interface Review {
  id: string;
  pedidoId?: string;
  alvoTipo: 'profissional' | 'empresa';
  alvoId: string;
  clienteId?: string;
  clienteNome: string;
  clienteFoto?: string;
  nota: number; // 1 a 5
  comentario: string;
  servicoRealizado?: string;
  criadoEm: string;
}

export interface FavoriteItem {
  id: string;
  clienteId: string;
  tipo: 'profissional' | 'empresa';
  alvoId: string;
  criadoEm: string;
}

export interface AuditLog {
  id: string;
  acao: string;
  usuario: string;
  detalhes: string;
  timestamp: string;
  tipo: 'seguranca' | 'aprovacao' | 'bloqueio' | 'pedido' | 'destaque';
}

export interface SmartClassificationResult {
  categoriaId: string;
  categoriaNome: string;
  servicoSugerido: string;
  urgencia: 'baixa' | 'normal' | 'alta' | 'urgente';
  confianca: number;
  motivo: string;
  perguntasComplementares: string[];
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  accuracy?: number;
  label?: string;
  bairro?: string;
  timestamp?: number;
  isSimulated?: boolean;
}

export interface DistanceFilterOptions {
  enabled: boolean;
  maxDistanceKm: number | null; // null = qualquer distância
  sortByProximity: boolean;
}

