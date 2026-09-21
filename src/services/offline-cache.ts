/**
 * Cache offline localStorage.
 *
 * Usado como fallback quando a API não tá disponível
 * (PWA offline, dev local sem backend, etc).
 *
 * Não é persistência primária — só pra UX suave quando o backend falha.
 */

const NAMESPACE = 'kairos-servicos';

function key(name: string): string {
  return `${NAMESPACE}:${name}`;
}

export const OfflineCache = {
  get<T>(name: string): T | null {
    try {
      const raw = localStorage.getItem(key(name));
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  },

  set<T>(name: string, data: T): void {
    try {
      localStorage.setItem(key(name), JSON.stringify(data));
    } catch (err) {
      console.warn(`[offline-cache] falha ao salvar ${name}:`, err);
    }
  },

  remove(name: string): void {
    try {
      localStorage.removeItem(key(name));
    } catch {
      /* noop */
    }
  },

  clearAll(): void {
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k?.startsWith(`${NAMESPACE}:`)) toRemove.push(k);
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  },

  /** Tenta buscar da API; se falhar, usa cache; se nem cache tiver, retorna fallback */
  async withCache<T>(
    name: string,
    fetcher: () => Promise<T>,
    fallback: T,
    maxAgeMs = 5 * 60 * 1000,
  ): Promise<{ data: T; fromCache: boolean; stale: boolean }> {
    try {
      const data = await fetcher();
      this.set(`${name}:data`, data);
      this.set(`${name}:ts`, Date.now());
      return { data, fromCache: false, stale: false };
    } catch (err) {
      const cached = this.get<T>(`${name}:data`);
      const ts = this.get<number>(`${name}:ts`) ?? 0;
      const stale = Date.now() - ts > maxAgeMs;
      if (cached !== null) {
        console.warn(`[offline-cache] usando cache pra ${name} (stale=${stale})`);
        return { data: cached, fromCache: true, stale };
      }
      console.warn(`[offline-cache] sem cache pra ${name}, usando fallback`);
      return { data: fallback, fromCache: true, stale: true };
    }
  },
};
