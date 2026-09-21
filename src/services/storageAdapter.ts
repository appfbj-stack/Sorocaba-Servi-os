/**
 * Storage Adapter — decide se usa API real ou localStorage.
 *
 * Quando VITE_API_URL tá configurada:
 *   - Reads (get*) → API com fallback pra OfflineCache
 *   - Writes (create*/update*/register*/delete*) → API + atualiza cache
 *
 * Quando VITE_API_URL tá vazia:
 *   - Comporta como antes (100% localStorage)
 *
 * Migração progressiva:StorageService continua sendo o entry-point pros
 * 18 componentes atuais. Novas features podem importar direto de `./api`.
 */

import * as api from './api';
import { OfflineCache } from './offline-cache';
import {
  INITIAL_CITIES,
  INITIAL_CATEGORIES,
  INITIAL_CLIENTS,
  INITIAL_PROFESSIONALS,
  INITIAL_BUSINESSES,
  INITIAL_REQUESTS,
  INITIAL_REVIEWS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { NEIGHBORHOOD_COORDINATES } from '../utils/geolocation';
import type {
  City,
  ServiceCategory,
  User,
  Professional,
  Business,
  BusinessStatus,
  ServiceRequest,
  ServiceProposal,
  Review,
  AuditLog,
  PixRechargeTransaction,
  FavoriteItem,
} from '../types';

const STORAGE_KEYS = {
  CITIES: 'kairos_cities_v2',
  CATEGORIES: 'kairos_categories_v2',
  CLIENTS: 'kairos_clients_v2',
  ACTIVE_USER: 'kairos_active_user_v2',
  SELECTED_CITY_ID: 'kairos_selected_city_v2',
  CACHE_TIMESTAMP: 'kairos_cache_ts_v2',
};

// Flag computada uma vez
export const USE_API = Boolean((import.meta.env.VITE_API_URL as string | undefined)?.trim());

// =============================================================
// Helpers locais (mantidos do storage original)
// =============================================================

function uuid(): string {
  return crypto.randomUUID?.() ?? `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

// =============================================================
// Cache localStorage (fallback + dev)
// =============================================================

function loadLS<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`[storage] falha ao salvar ${key}:`, err);
  }
}

// =============================================================
// Storage Adapter
// =============================================================

export const StorageAdapter = {
  isUsingAPI: USE_API,

  // ===== Cities =====
  async getCities(): Promise<City[]> {
    if (USE_API) {
      const { data } = await OfflineCache.withCache(
        'cities',
        () => api.CitiesApi.list().then((r) => r.cities),
        INITIAL_CITIES,
      );
      return data;
    }
    return loadLS<City[]>(STORAGE_KEYS.CITIES, INITIAL_CITIES);
  },

  async getSelectedCityId(): Promise<string> {
    if (USE_API) {
      return localStorage.getItem(STORAGE_KEYS.SELECTED_CITY_ID) ?? '';
    }
    return loadLS<string>(STORAGE_KEYS.SELECTED_CITY_ID, 'cid-sorocaba');
  },

  setSelectedCityId(cityId: string): void {
    localStorage.setItem(STORAGE_KEYS.SELECTED_CITY_ID, cityId);
  },

  // ===== Categories =====
  async getCategories(): Promise<ServiceCategory[]> {
    if (USE_API) {
      const { data } = await OfflineCache.withCache(
        'categories',
        () => api.CategoriesApi.list().then((r) => r.categories),
        INITIAL_CATEGORIES,
      );
      return data;
    }
    return loadLS<ServiceCategory[]>(STORAGE_KEYS.CATEGORIES, INITIAL_CATEGORIES);
  },

  // ===== Auth =====
  async getActiveUser(): Promise<User | null> {
    if (USE_API) {
      try {
        const { user } = await api.AuthApi.me();
        return user;
      } catch {
        return null;
      }
    }
    return loadLS<User | null>(STORAGE_KEYS.ACTIVE_USER, INITIAL_CLIENTS[0] as User);
  },

  setActiveUser(user: User): void {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_USER, JSON.stringify(user));
  },

  async login(email: string, password: string): Promise<User> {
    if (USE_API) {
      const { user } = await api.AuthApi.login(email, password);
      this.setActiveUser(user);
      return user;
    }
    // Modo offline — match simples (dev only, sem segurança real)
    const clients = loadLS<User[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
    const found = clients.find((c) => c.email === email);
    if (!found) throw new Error('Credenciais inválidas');
    this.setActiveUser(found);
    return found;
  },

  async register(data: Omit<User, 'id' | 'criadoEm'> & { password?: string }): Promise<User> {
    if (USE_API) {
      if (!data.password) throw new Error('Senha obrigatória no modo API');
      const { user } = await api.AuthApi.register({
        nome: data.nome,
        email: data.email,
        password: data.password,
        telefone: data.telefone,
        role: data.role,
        cityId: data.cidadeId,
        neighborhoodId: data.neighborhoodId,
      });
      this.setActiveUser(user);
      return user;
    }
    // Offline
    const clients = loadLS<User[]>(STORAGE_KEYS.CLIENTS, INITIAL_CLIENTS);
    const newUser: User = {
      ...data,
      id: uuid(),
      criadoEm: new Date().toISOString(),
    };
    clients.push(newUser);
    saveLS(STORAGE_KEYS.CLIENTS, clients);
    this.setActiveUser(newUser);
    return newUser;
  },

  async logout(): Promise<void> {
    if (USE_API) await api.AuthApi.logout();
    localStorage.removeItem(STORAGE_KEYS.ACTIVE_USER);
  },

  // ===== Listings (substitui Professionals + Businesses) =====
  async searchListings(filters: {
    tipo?: 'profissional' | 'empresa';
    cityId?: string;
    categoryId?: string;
    q?: string;
    limit?: number;
    offset?: number;
  } = {}): Promise<import('../types.ts').Listing[]> {
    if (USE_API) {
      const { listings } = await api.ListingsApi.search(filters);
      return listings;
    }
    // Offline fallback (dev)
    const profissionais = loadLS<Professional[]>('sorocaba_servicos_professionals_v1', INITIAL_PROFESSIONALS);
    const businesses = loadLS<Business[]>('sorocaba_servicos_businesses_v1', INITIAL_BUSINESSES);
    return [
      ...profissionais.map((p) => ({
        id: p.id, userId: p.usuarioId, tipo: 'profissional' as const,
        categoryId: p.categoriaId, nome: p.nome, imagemUrl: p.fotoUrl,
        whatsapp: p.whatsapp, telefone: p.telefone,
        cityId: p.cidadeId, neighborhoodId: undefined,
        servicos: p.servicos, descricao: p.descricao,
        status: (p.status === 'ATIVO' ? 'ativo' : p.status === 'PENDENTE' ? 'pendente' : 'bloqueado') as 'ativo' | 'pendente' | 'bloqueado',
        creditos: p.oportunidadesDisponiveis ?? 0,
        anuncioAtivo: false, visualizacoes: 0, cliquesWhatsapp: 0, cliquesTelefone: 0,
        criadoEm: p.criadoEm, atualizadoEm: p.criadoEm,
      })),
      ...businesses.map((b) => ({
        id: b.id, userId: b.usuarioId, tipo: 'empresa' as const,
        categoryId: b.categoriaId, nome: b.nome, imagemUrl: b.logoUrl,
        whatsapp: b.whatsapp, telefone: b.telefone,
        cityId: b.cidadeId, neighborhoodId: undefined,
        servicos: b.servicosOuProdutos, descricao: b.descricao,
        status: (b.status === 'ATIVO' ? 'ativo' : b.status === 'PENDENTE' ? 'pendente' : 'bloqueado') as 'ativo' | 'pendente' | 'bloqueado',
        creditos: 0, anuncioAtivo: b.patrocinada ?? false,
        visualizacoes: 0, cliquesWhatsapp: 0, cliquesTelefone: 0,
        criadoEm: b.criadoEm, atualizadoEm: b.criadoEm,
      })),
    ];
  },

  async getListingById(id: string): Promise<import('../types.ts').Listing | null> {
    if (USE_API) {
      try {
        const { listing } = await api.ListingsApi.get(id);
        return listing;
      } catch {
        return null;
      }
    }
    const all = await this.searchListings();
    return all.find((l) => l.id === id) ?? null;
  },

  // ===== Requests =====
  async createRequest(data: {
    servico: string;
    descricao: string;
    categoryId: string;
    cityId: string;
    neighborhoodId?: string;
    clienteWhatsapp: string;
    clienteNome?: string;
    urgencia?: 'baixa' | 'normal' | 'alta' | 'urgente';
  }): Promise<ServiceRequest> {
    if (USE_API) {
      const { request } = await api.RequestsApi.create(data);
      return request;
    }
    // Offline
    const requests = loadLS<ServiceRequest[]>('sorocaba_servicos_requests_v1', INITIAL_REQUESTS);
    const newReq: ServiceRequest = {
      id: uuid(),
      clienteId: 'local',
      clienteNome: data.clienteNome ?? 'Anônimo',
      clienteWhatsapp: data.clienteWhatsapp,
      categoryId: data.categoryId,
      servico: data.servico,
      descricao: data.descricao,
      cityId: data.cityId,
      bairro: '',
      dataDesejada: '',
      horarioPreferencia: 'qualquer',
      urgencia: data.urgencia ?? 'normal',
      fotos: [],
      status: 'aberto',
      propostas: [],
      criadoEm: new Date().toISOString(),
      atualizadoEm: new Date().toISOString(),
    };
    requests.unshift(newReq);
    saveLS('sorocaba_servicos_requests_v1', requests);
    return newReq;
  },

  async getMyRequests(): Promise<ServiceRequest[]> {
    if (USE_API) {
      const { requests } = await api.RequestsApi.mine();
      return requests;
    }
    return loadLS<ServiceRequest[]>('sorocaba_servicos_requests_v1', INITIAL_REQUESTS);
  },

  // ===== Proposals =====
  async createProposal(data: { requestId: string; valorEstimado?: number; prazoEstimado?: string; mensagem?: string }): Promise<ServiceProposal> {
    if (USE_API) {
      const { proposal } = await api.ProposalsApi.create(data);
      return proposal;
    }
    throw new Error('Captação só disponível com API configurada (VITE_API_URL)');
  },

  // ===== PIX =====
  async createPixRecharge(tipo: 'recarga_creditos' | 'mensalidade_lojista' = 'recarga_creditos'): Promise<{
    transaction: PixRechargeTransaction;
    brCode: string;
    qrCodeImage: string;
  }> {
    if (USE_API) {
      return api.PixApi.recharge(tipo);
    }
    throw new Error('PIX só disponível com API configurada (VITE_API_URL)');
  },

  async getMyPixTransactions(): Promise<PixRechargeTransaction[]> {
    if (USE_API) {
      const { transactions } = await api.PixApi.transactions();
      return transactions;
    }
    return [];
  },

  // ===== Reset (manter pra dev/testes) =====
  resetDatabase(): void {
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
    OfflineCache.clearAll();
  },
};

// Re-exporta o nome StorageService pra compat com o que já tá importado
export const StorageService = StorageAdapter;
export type { City, ServiceCategory, User, Professional, Business, BusinessStatus, ServiceRequest, ServiceProposal, Review, AuditLog, PixRechargeTransaction, FavoriteItem };
