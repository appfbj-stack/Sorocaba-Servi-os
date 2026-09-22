/**
 * Painel Admin Backend — consome a API real do Kairós Serviços.
 *
 * Abas:
 *   - Dashboard: métricas gerais
 *   - Listings: aprovar/bloquear pendentes
 *   - PIX: confirmar pagamentos pendentes
 *   - Settings: editar valores de monetização
 *   - Logs: audit log
 */

import { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Store, Banknote, Settings, ScrollText, RefreshCw, Check, X, Loader2,
  AlertTriangle,
} from 'lucide-react';
import * as api from '../services/api';

type Tab = 'dashboard' | 'listings' | 'pix' | 'settings' | 'logs';

interface DashboardData {
  usersTotal: number;
  listingsAtivos: number;
  listingsPendentes: number;
  requestsAbertos: number;
  requestsConcluidos: number;
  pixPendentes: number;
}

interface ListingRow {
  id: string;
  nome: string;
  tipo: 'profissional' | 'empresa';
  whatsapp: string;
  cidadeId: string;
  status: 'pendente' | 'ativo' | 'bloqueado';
  criadoEm: string;
}

interface PixRow {
  id: string;
  txid: string;
  tipo: string;
  valor: string;
  status: string;
  criadoEm: string;
  descricao: string;
}

interface AuditRow {
  id: string;
  tipo: string;
  acao: string;
  usuarioNome?: string;
  criadoEm: string;
  detalhes?: unknown;
}

export function AdminBackendPanel() {
  const [tab, setTab] = useState<Tab>('dashboard');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-slate-900 text-white px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <LayoutDashboard className="w-6 h-6 text-teal-400" />
          <h1 className="text-xl font-bold">Painel Admin · Kairós Serviços</h1>
          <span className="ml-auto text-xs text-slate-400">backend conectado</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="max-w-7xl mx-auto flex gap-1 overflow-x-auto">
          <TabButton active={tab==='dashboard'} onClick={()=>setTab('dashboard')} icon={LayoutDashboard} label="Dashboard" />
          <TabButton active={tab==='listings'} onClick={()=>setTab('listings')} icon={Store} label="Anúncios" />
          <TabButton active={tab==='pix'} onClick={()=>setTab('pix')} icon={Banknote} label="PIX" />
          <TabButton active={tab==='settings'} onClick={()=>setTab('settings')} icon={Settings} label="Configurações" />
          <TabButton active={tab==='logs'} onClick={()=>setTab('logs')} icon={ScrollText} label="Logs" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {tab === 'dashboard' && <DashboardTab />}
        {tab === 'listings' && <ListingsTab />}
        {tab === 'pix' && <PixTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'logs' && <LogsTab />}
      </div>
    </div>
  );
}

// ============================================================
// UI helpers
// ============================================================

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean; onClick: () => void; icon: typeof LayoutDashboard; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
        active
          ? 'border-teal-500 text-teal-700'
          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );
}

function Card({ title, value, icon: Icon, color }: { title: string; value: string | number; icon: typeof LayoutDashboard; color: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
}

function EmptyState({ msg }: { msg: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
      <p className="text-slate-500">{msg}</p>
    </div>
  );
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
      <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-medium text-red-900">Erro</p>
        <p className="text-sm text-red-700 mt-1">{msg}</p>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pendente: 'bg-amber-100 text-amber-700',
    ativo: 'bg-emerald-100 text-emerald-700',
    bloqueado: 'bg-red-100 text-red-700',
    concluido: 'bg-emerald-100 text-emerald-700',
    pago: 'bg-emerald-100 text-emerald-700',
    expirado: 'bg-slate-100 text-slate-700',
    cancelado: 'bg-slate-100 text-slate-700',
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? 'bg-slate-100 text-slate-700'}`}>
      {status}
    </span>
  );
}

// ============================================================
// Tab: Dashboard
// ============================================================

function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.AdminApi.dashboard();
      setData(res.dashboard as unknown as DashboardData);
    } catch (e) {
      setError(String(e));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (error) return <ErrorBox msg={error} />;
  if (!data) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Visão Geral</h2>
        <button onClick={load} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card title="Usuários totais" value={data.usersTotal} icon={LayoutDashboard} color="bg-teal-100 text-teal-700" />
        <Card title="Anúncios ativos" value={data.listingsAtivos} icon={Store} color="bg-emerald-100 text-emerald-700" />
        <Card title="Pendentes aprovação" value={data.listingsPendentes} icon={AlertTriangle} color="bg-amber-100 text-amber-700" />
        <Card title="Pedidos abertos" value={data.requestsAbertos} icon={ScrollText} color="bg-blue-100 text-blue-700" />
        <Card title="Pedidos concluídos" value={data.requestsConcluidos} icon={Check} color="bg-emerald-100 text-emerald-700" />
        <Card title="PIX aguardando" value={data.pixPendentes} icon={Banknote} color="bg-purple-100 text-purple-700" />
      </div>
    </div>
  );
}

// ============================================================
// Tab: Listings (aprovar/bloquear)
// ============================================================

function ListingsTab() {
  const [listings, setListings] = useState<ListingRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.AdminApi.pendingListings();
      setListings(res.listings as unknown as ListingRow[]);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id: string, status: 'ativo' | 'bloqueado', motivo?: string) => {
    try {
      if (status === 'ativo') await api.AdminApi.approveListing(id, motivo);
      else await api.AdminApi.blockListing(id, motivo ?? 'Bloqueado pelo admin');
      await load();
    } catch (e) {
      alert('Erro: ' + String(e));
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (error) return <ErrorBox msg={error} />;
  if (listings.length === 0) return <EmptyState msg="Nenhum anúncio pendente de aprovação 🎉" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Anúncios pendentes ({listings.length})</h2>
        <button onClick={load} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>
      <div className="space-y-3">
        {listings.map((l) => (
          <div key={l.id} className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium text-slate-900">{l.nome}</p>
                <StatusBadge status={l.tipo} />
              </div>
              <p className="text-sm text-slate-600 mt-1">📱 {l.whatsapp}</p>
              <p className="text-xs text-slate-400 mt-1">Cadastrado em {new Date(l.criadoEm).toLocaleString('pt-BR')}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleAction(l.id, 'ativo')}
                className="px-3 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1"
              >
                <Check className="w-4 h-4" /> Aprovar
              </button>
              <button
                onClick={() => {
                  const motivo = prompt('Motivo do bloqueio?');
                  if (motivo !== null) handleAction(l.id, 'bloqueado', motivo);
                }}
                className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 flex items-center gap-1"
              >
                <X className="w-4 h-4" /> Bloquear
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tab: PIX (confirmar pagamentos)
// ============================================================

function PixTab() {
  const [txs, setTxs] = useState<PixRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await api.AdminApi.pendingPix();
      setTxs(res.transactions as unknown as PixRow[]);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const confirm = async (id: string) => {
    if (!confirm('Confirmar que o pagamento deste PIX foi recebido? Isso vai liberar os créditos/anuncio.')) return;
    try {
      await api.AdminApi.confirmPix(id);
      await load();
    } catch (e) {
      alert('Erro: ' + String(e));
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (error) return <ErrorBox msg={error} />;
  if (txs.length === 0) return <EmptyState msg="Nenhum PIX aguardando confirmação 🎉" />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">PIX pendentes ({txs.length})</h2>
        <button onClick={load} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>
      <div className="space-y-3">
        {txs.map((t) => (
          <div key={t.id} className="bg-white rounded-xl border border-slate-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Banknote className="w-4 h-4 text-purple-600" />
                  <p className="font-bold text-2xl text-slate-900">R$ {Number(t.valor).toFixed(2)}</p>
                  <StatusBadge status={t.status} />
                </div>
                <p className="text-sm text-slate-900 font-medium">{t.descricao}</p>
                <p className="text-xs text-slate-500 mt-1">txid: <code className="text-xs bg-slate-100 px-1 rounded">{t.tipo}</code> · {new Date(t.criadoEm).toLocaleString('pt-BR')}</p>
              </div>
              <button
                onClick={() => confirm(t.id)}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 flex items-center gap-1 whitespace-nowrap"
              >
                <Check className="w-4 h-4" /> Confirmar pagamento
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tab: Settings (editor de monetização)
// ============================================================

interface SettingField {
  key: string;
  label: string;
  type: 'boolean' | 'number' | 'text';
  help?: string;
}

const SETTING_FIELDS: SettingField[] = [
  { key: 'monetization_enabled', label: 'Ativar cobrança', type: 'boolean', help: 'Liga/desliga toda a monetização (false = MVP grátis)' },
  { key: 'lojista_price_monthly', label: 'Mensalidade lojista (R$)', type: 'number' },
  { key: 'lojista_free_months', label: 'Meses grátis iniciais do lojista', type: 'number' },
  { key: 'profissional_free_credits', label: 'Créditos grátis ao profissional', type: 'number' },
  { key: 'profissional_free_credits_validity_days', label: 'Validade dos créditos grátis (dias)', type: 'number' },
  { key: 'credit_pack_qty', label: 'Créditos por pacote', type: 'number' },
  { key: 'credit_pack_price', label: 'Preço do pacote (R$)', type: 'number' },
  { key: 'credit_pack_validity_days', label: 'Validade créditos comprados (dias)', type: 'number' },
  { key: 'pix_key', label: 'Chave PIX', type: 'text', help: 'CPF, CNPJ, email ou telefone' },
  { key: 'pix_key_type', label: 'Tipo da chave PIX', type: 'text' },
  { key: 'promo_text', label: 'Texto do banner de promoção', type: 'text' },
  { key: 'promo_active', label: 'Banner de promoção ativo', type: 'boolean' },
];

function SettingsTab() {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  // Como ainda não há /api/admin/settings (preciso adicionar uma rota),
  // vou usar SettingsApi.public pra leitura + AdminApi-style fetch direto
  // Workaround: vou buscar via api usando admin endpoint

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      // Get all settings via admin endpoint
      const res = await fetch('/api/admin/settings', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setSettings(data.settings);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  const update = (key: string, value: unknown) => {
    setSettings((s) => ({ ...s, [key]: value }));
    setSaved(false);
  };

  const save = async () => {
    setSaving(true); setSaved(false);
    try {
      // Salva cada chave via PATCH
      for (const [key, value] of Object.entries(settings)) {
        const res = await fetch('/api/admin/settings', {
          method: 'PATCH',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ key, value }),
        });
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`${key}: ${txt}`);
        }
      }
      setSaved(true);
      await load();
    } catch (e) {
      setError(String(e));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (error) return <ErrorBox msg={error} />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Configurações</h2>
        <div className="flex items-center gap-2">
          {saved && <span className="text-sm text-emerald-600">✓ Salvo</span>}
          <button onClick={save} disabled={saving} className="px-4 py-2 bg-teal-600 text-white rounded-lg text-sm font-medium hover:bg-teal-700 disabled:opacity-50 flex items-center gap-1">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Salvar tudo
          </button>
        </div>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {SETTING_FIELDS.map((f) => (
          <div key={f.key} className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
            <div>
              <label className="text-sm font-medium text-slate-900">{f.label}</label>
              {f.help && <p className="text-xs text-slate-500 mt-1">{f.help}</p>}
            </div>
            <div className="md:col-span-2">
              {f.type === 'boolean' ? (
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!settings[f.key]}
                    onChange={(e) => update(f.key, e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm text-slate-700">{settings[f.key] ? 'Ativado' : 'Desativado'}</span>
                </label>
              ) : f.type === 'number' ? (
                <input
                  type="number"
                  step="any"
                  value={Number(settings[f.key] ?? 0)}
                  onChange={(e) => update(f.key, Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              ) : (
                <input
                  type="text"
                  value={String(settings[f.key] ?? '')}
                  onChange={(e) => update(f.key, e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// Tab: Logs
// ============================================================

function LogsTab() {
  const [logs, setLogs] = useState<AuditRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch('/api/admin/audit-logs?limit=100', { credentials: 'include' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setLogs(data.logs);
    } catch (e) { setError(String(e)); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-teal-600" /></div>;
  if (error) return <ErrorBox msg={error} />;
  if (logs.length === 0) return <EmptyState msg="Nenhuma ação registrada ainda." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-900">Audit log (últimos {logs.length})</h2>
        <button onClick={load} className="text-sm text-teal-600 hover:text-teal-700 flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Atualizar
        </button>
      </div>
      <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100">
        {logs.map((l) => (
          <div key={l.id} className="p-4 flex items-start gap-3">
            <StatusBadge status={l.tipo} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900">{l.acao}</p>
              {l.usuarioNome && <p className="text-xs text-slate-500 mt-0.5">por {l.usuarioNome}</p>}
            </div>
            <p className="text-xs text-slate-400 whitespace-nowrap">{new Date(l.criadoEm).toLocaleString('pt-BR')}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
