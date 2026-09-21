/**
 * Kairós Serviços — cliente API
 *
 * Wrapper de fetch com:
 *   - Base URL configurável (VITE_API_URL)
 *   - Cookies httpOnly automáticos (credentials: include)
 *   - Tratamento de erros padronizado
 *   - Tipos compartilhados com o backend (Drizzle schema → TS types)
 */

const API_URL = (import.meta.env.VITE_API_URL as string | undefined)
  ?? (window.location.hostname === 'localhost' ? 'http://localhost:3051/api' : '/api');

export interface ApiError {
  error: string;
  message?: string;
  issues?: Array<{ path: string; message: string }>;
}

export class ApiException extends Error {
  constructor(
    public status: number,
    public body: ApiError,
  ) {
    super(body.message ?? body.error ?? `HTTP ${status}`);
  }
}

async function request<T>(
  method: string,
  path: string,
  body?: unknown,
  init?: RequestInit,
): Promise<T> {
  const url = `${API_URL}${path}`;

  const res = await fetch(url, {
    method,
    credentials: 'include', // envia cookie httpOnly
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    ...init,
  });

  if (!res.ok) {
    let errBody: ApiError;
    try {
      errBody = await res.json() as ApiError;
    } catch {
      errBody = { error: 'http_error', message: res.statusText };
    }
    throw new ApiException(res.status, errBody);
  }

  // 204 No Content
  if (res.status === 204) return undefined as T;

  return res.json() as Promise<T>;
}

// ===== Auth =====
export const AuthApi = {
  me: () => request<{ user: import('../types.ts').User }>('GET', '/auth/me'),
  login: (email: string, password: string) =>
    request<{ user: import('../types.ts').User; token: string }>('POST', '/auth/login', { email, password }),
  register: (data: {
    nome: string;
    email: string;
    password: string;
    telefone?: string;
    role?: 'cliente' | 'profissional' | 'empresa';
    cityId?: string;
    neighborhoodId?: string;
  }) => request<{ user: import('../types.ts').User; token: string }>('POST', '/auth/register', data),
  logout: () => request<{ ok: true }>('POST', '/auth/logout'),
};

// ===== Cities / Categories =====
export const CitiesApi = {
  list: () => request<{ cities: import('../types.ts').City[] }>('GET', '/cities'),
  get: (id: string) => request<{ city: import('../types.ts').City }>('GET', `/cities/${id}`),
  neighborhoods: (cityId: string) =>
    request<{ neighborhoods: { id: string; nome: string; principal: boolean }[] }>('GET', `/cities/${cityId}/neighborhoods`),
};

export const CategoriesApi = {
  list: () => request<{ categories: import('../types.ts').ServiceCategory[] }>('GET', '/categories'),
};

// ===== Listings (anúncios) =====
export const ListingsApi = {
  search: (filters: {
    tipo?: 'profissional' | 'empresa';
    cityId?: string;
    categoryId?: string;
    q?: string;
    limit?: number;
    offset?: number;
  } = {}) => {
    const qs = new URLSearchParams();
    for (const [k, v] of Object.entries(filters)) {
      if (v !== undefined && v !== '') qs.set(k, String(v));
    }
    return request<{ listings: import('../types.ts').Listing[] }>('GET', `/listings?${qs}`);
  },
  get: (id: string) => request<{ listing: import('../types.ts').Listing }>('GET', `/listings/${id}`),
  mine: () => request<{ listings: import('../types.ts').Listing[] }>('GET', '/listings/mine'),
  create: (data: Partial<import('../types.ts').Listing>) =>
    request<{ listing: import('../types.ts').Listing }>('POST', '/listings', data),
  update: (id: string, data: Partial<import('../types.ts').Listing>) =>
    request<{ listing: import('../types.ts').Listing }>('PATCH', `/listings/${id}`, data),
  delete: (id: string) => request<{ ok: true }>('DELETE', `/listings/${id}`),
  uploadImage: async (id: string, file: File): Promise<{ listing: import('../types.ts').Listing; imagemUrl: string }> => {
    const fd = new FormData();
    fd.append('imagem', file);
    const res = await fetch(`${API_URL}/listings/${id}/imagem`, {
      method: 'POST',
      credentials: 'include',
      body: fd,
    });
    if (!res.ok) throw new ApiException(res.status, await res.json().catch(() => ({ error: 'upload_failed' })));
    return res.json();
  },
  click: (id: string, tipo: 'whatsapp' | 'telefone') =>
    request<{ ok: true }>('POST', `/listings/${id}/click`, { tipo }),
};

// ===== Requests (pedidos) =====
export const RequestsApi = {
  mine: () => request<{ requests: import('../types.ts').ServiceRequest[] }>('GET', '/requests/mine'),
  available: () => request<{ requests: import('../types.ts').ServiceRequest[] }>('GET', '/requests/available'),
  get: (id: string) => request<{ request: import('../types.ts').ServiceRequest }>('GET', `/requests/${id}`),
  create: (data: {
    categoryId: string;
    servico: string;
    descricao: string;
    cityId: string;
    neighborhoodId?: string;
    dataDesejada?: string;
    urgencia?: 'baixa' | 'normal' | 'alta' | 'urgente';
    clienteWhatsapp: string;
    clienteNome?: string;
  }) => request<{ request: import('../types.ts').ServiceRequest }>('POST', '/requests', data),
  setStatus: (id: string, status: string) =>
    request<{ request: import('../types.ts').ServiceRequest }>('PATCH', `/requests/${id}/status`, { status }),
};

// ===== Proposals (captações) =====
export const ProposalsApi = {
  mine: () => request<{ proposals: import('../types.ts').ServiceProposal[] }>('GET', '/proposals/mine'),
  byRequest: (requestId: string) =>
    request<{ proposals: import('../types.ts').ServiceProposal[] }>('GET', `/proposals/by-request/${requestId}`),
  create: (data: { requestId: string; valorEstimado?: number; prazoEstimado?: string; mensagem?: string }) =>
    request<{ proposal: import('../types.ts').ServiceProposal }>('POST', '/proposals', data),
  cancel: (id: string) => request<{ ok: true }>('PATCH', `/proposals/${id}/cancel`),
  accept: (id: string) => request<{ ok: true }>('PATCH', `/proposals/${id}/accept`),
  refuse: (id: string) => request<{ ok: true }>('PATCH', `/proposals/${id}/refuse`),
};

// ===== PIX =====
export const PixApi = {
  recharge: (tipo: 'recarga_creditos' | 'mensalidade_lojista' = 'recarga_creditos') =>
    request<{
      transaction: import('../types.ts').PixRechargeTransaction;
      brCode: string;
      qrCodeImage: string;
    }>('POST', '/pix/recharge', { tipo }),
  transactions: () =>
    request<{ transactions: import('../types.ts').PixRechargeTransaction[] }>('GET', '/pix/transactions'),
};

// ===== Admin =====
export const AdminApi = {
  dashboard: () => request<{ dashboard: Record<string, number> }>('GET', '/admin/dashboard'),
  pendingListings: () => request<{ listings: import('../types.ts').Listing[] }>('GET', '/admin/listings?status=pendente'),
  approveListing: (id: string, motivo?: string) =>
    request<{ listing: import('../types.ts').Listing }>('PATCH', `/admin/listings/${id}/status`, { status: 'ativo', motivo }),
  blockListing: (id: string, motivo: string) =>
    request<{ listing: import('../types.ts').Listing }>('PATCH', `/admin/listings/${id}/status`, { status: 'bloqueado', motivo }),
  pendingPix: () => request<{ transactions: import('../types.ts').PixRechargeTransaction[] }>('GET', '/admin/pix/pending'),
  confirmPix: (id: string) => request<{ ok: true }>('PATCH', `/admin/pix/${id}/confirm`),
};

// ===== Settings (públicas) =====
export const SettingsApi = {
  public: () => request<{ settings: Record<string, unknown> }>('GET', '/settings/public'),
};

export { API_URL };
