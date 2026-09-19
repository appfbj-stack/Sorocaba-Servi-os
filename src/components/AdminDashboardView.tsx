import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Briefcase,
  Store,
  FileText,
  MapPin,
  CheckCircle2,
  XCircle,
  Clock,
  Plus,
  RotateCcw,
  Award,
  AlertTriangle,
  Gift,
  ExternalLink,
  Search
} from 'lucide-react';
import {
  Professional,
  Business,
  City,
  ServiceCategory,
  AuditLog,
  ServiceRequest
} from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface AdminDashboardViewProps {
  professionals: Professional[];
  businesses: Business[];
  cities: City[];
  categories: ServiceCategory[];
  requests: ServiceRequest[];
  auditLogs: AuditLog[];
  onRefresh: () => void;
  onResetData: () => void;
}

export const AdminDashboardView: React.FC<AdminDashboardViewProps> = ({
  professionals,
  businesses,
  cities,
  categories,
  requests,
  auditLogs,
  onRefresh,
  onResetData
}) => {
  const [activeTab, setActiveTab] = useState<'pros' | 'bizs' | 'cities' | 'logs'>('pros');
  const [proFilter, setProFilter] = useState<'ALL' | 'ATIVO' | 'PENDENTE' | 'BLOQUEADO'>('ALL');
  const [searchPro, setSearchPro] = useState('');

  // Add city form state
  const [newCityName, setNewCityName] = useState('');
  const [newCityState, setNewCityState] = useState('SP');
  const [newCityBairros, setNewCityBairros] = useState('');
  const [showAddCityModal, setShowAddCityModal] = useState(false);

  // Filter pros
  const filteredPros = professionals.filter(p => {
    const matchesFilter = proFilter === 'ALL' || p.status === proFilter;
    const matchesSearch = p.nome.toLowerCase().includes(searchPro.toLowerCase()) ||
                          p.tituloProfissional.toLowerCase().includes(searchPro.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Calculate stats
  const totalPros = professionals.length;
  const activePros = professionals.filter(p => p.status === 'ATIVO').length;
  const pendingPros = professionals.filter(p => p.status === 'PENDENTE').length;
  const totalBizs = businesses.length;
  const sponsoredBizs = businesses.filter(b => b.patrocinada).length;
  const totalRequests = requests.length;
  const completedRequests = requests.filter(r => r.status === 'concluido').length;
  const totalWhatsAppClicks = businesses.reduce((acc, b) => acc + b.analytics.cliquesWhatsapp, 0) +
                              professionals.reduce((acc, p) => acc + (p.totalAvaliacoes * 3 + 2), 0);

  const handleApprovePro = (proId: string) => {
    StorageService.updateProfessionalStatus(proId, 'ATIVO');
    onRefresh();
  };

  const handleBlockPro = (proId: string) => {
    StorageService.updateProfessionalStatus(proId, 'BLOQUEADO');
    onRefresh();
  };

  const handleExtendTrial = (proId: string) => {
    StorageService.extendProfessionalTrial(proId, 180);
    onRefresh();
  };

  const handleToggleBizSponsored = (bizId: string) => {
    StorageService.toggleBusinessSponsored(bizId);
    onRefresh();
  };

  const handleApproveBiz = (bizId: string) => {
    StorageService.updateBusinessStatus(bizId, 'ATIVO');
    onRefresh();
  };

  const handleBlockBiz = (bizId: string) => {
    StorageService.updateBusinessStatus(bizId, 'BLOQUEADO');
    onRefresh();
  };

  const handleAddCity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCityName.trim()) return;

    const bairrosArray = newCityBairros
      .split(',')
      .map(b => b.trim())
      .filter(b => b.length > 0);

    StorageService.addCity({
      nome: newCityName.trim(),
      estado: newCityState.trim(),
      ativo: true,
      cidadePrincipal: false,
      bairros: bairrosArray.length > 0 ? bairrosArray : ['Centro', 'Bairro 1', 'Bairro 2'],
      bairrosPrincipais: bairrosArray.length > 0 ? bairrosArray : ['Centro', 'Bairro 1', 'Bairro 2']
    });

    setNewCityName('');
    setNewCityBairros('');
    setShowAddCityModal(false);
    onRefresh();
  };

  const handleToggleCity = (cityId: string) => {
    StorageService.toggleCityActive(cityId);
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-purple-600" />
            <span>Painel Administrativo da Plataforma</span>
          </h1>
          <p className="text-sm text-slate-500">
            Supervisão geral, aprovação de profissionais, controle de expansão de cidades e auditoria.
          </p>
        </div>

        <button
          onClick={onResetData}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition cursor-pointer self-start sm:self-auto"
          title="Restaura banco de dados para os valores padrão de teste"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Restaurar Seed de Testes</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Profissionais</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalPros}</span>
          <span className="text-[10px] text-emerald-600 font-semibold">{activePros} ativos ({pendingPros} pendentes)</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Empresas / Lojas</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalBizs}</span>
          <span className="text-[10px] text-amber-600 font-semibold">{sponsoredBizs} patrocinadas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Pedidos Feitos</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{totalRequests}</span>
          <span className="text-[10px] text-teal-600 font-semibold">{completedRequests} concluídos</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Leads WhatsApp</span>
          <span className="text-2xl font-extrabold text-emerald-700 mt-1 block">~{totalWhatsAppClicks}</span>
          <span className="text-[10px] text-slate-500 font-semibold">Contatos gerados</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Cidades Cadastradas</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{cities.length}</span>
          <span className="text-[10px] text-slate-500 font-semibold">Sorocaba + expansão</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Categorias</span>
          <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{categories.length}</span>
          <span className="text-[10px] text-slate-500 font-semibold">Especialidades ativas</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto">
        <button
          onClick={() => setActiveTab('pros')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === 'pros' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Profissionais Autônomos ({professionals.length})
        </button>
        <button
          onClick={() => setActiveTab('bizs')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === 'bizs' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Empresas & Lojas ({businesses.length})
        </button>
        <button
          onClick={() => setActiveTab('cities')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === 'cities' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Expansão de Cidades ({cities.length})
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition shrink-0 cursor-pointer ${
            activeTab === 'logs' ? 'border-purple-600 text-purple-700' : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Auditoria & Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab: Professionals */}
      {activeTab === 'pros' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchPro}
                  onChange={(e) => setSearchPro(e.target.value)}
                  placeholder="Buscar profissional..."
                  className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs w-56 focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="flex gap-1">
                {(['ALL', 'ATIVO', 'PENDENTE', 'BLOQUEADO'] as const).map(f => (
                  <button
                    key={f}
                    onClick={() => setProFilter(f)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                      proFilter === f
                        ? 'bg-purple-600 text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {f === 'ALL' ? 'Todos' : f}
                  </button>
                ))}
              </div>
            </div>

            <span className="text-xs text-slate-500">
              Mostrando {filteredPros.length} profissionais
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Profissional</th>
                  <th className="py-3 px-3">Especialidade</th>
                  <th className="py-3 px-3">Plano 6m</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">WhatsApp</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredPros.map((pro) => (
                  <tr key={pro.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={pro.fotoUrl}
                          alt={pro.nome}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{pro.nome}</span>
                          <span className="text-[11px] text-slate-400">{pro.bairrosAtendidos[0]}, Sorocaba</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-700">
                      {pro.tituloProfissional}
                    </td>
                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 text-[11px] text-teal-700 font-semibold bg-teal-50 px-2 py-0.5 rounded-md">
                        <Gift className="w-3 h-3" />
                        <span>6 Meses Grátis</span>
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          pro.status === 'ATIVO'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : pro.status === 'PENDENTE'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}
                      >
                        {pro.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-500">
                      {pro.whatsapp}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {pro.status !== 'ATIVO' && (
                          <button
                            onClick={() => handleApprovePro(pro.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold cursor-pointer"
                            title="Aprovar profissional e marcar como verificado"
                          >
                            Aprovar
                          </button>
                        )}
                        {pro.status !== 'BLOQUEADO' && (
                          <button
                            onClick={() => handleBlockPro(pro.id)}
                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md text-[10px] font-bold cursor-pointer"
                            title="Bloquear profissional"
                          >
                            Bloquear
                          </button>
                        )}
                        <button
                          onClick={() => handleExtendTrial(pro.id)}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[10px] font-semibold cursor-pointer"
                          title="Estender período gratuito em 6 meses"
                        >
                          +180d
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Businesses */}
      {activeTab === 'bizs' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Lojas & Empresas Cadastradas</h3>
            <span className="text-xs text-slate-500">{businesses.length} empresas</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 text-slate-400 uppercase font-bold text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-3">Empresa</th>
                  <th className="py-3 px-3">Endereço</th>
                  <th className="py-3 px-3">Destaque Patrocinado</th>
                  <th className="py-3 px-3">Métricas (Views / Whats)</th>
                  <th className="py-3 px-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {businesses.map((biz) => (
                  <tr key={biz.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={biz.logoUrl}
                          alt={biz.nome}
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{biz.nome}</span>
                          <span className="text-[10px] text-slate-400">{biz.telefone}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-600 max-w-xs truncate">
                      {biz.endereco}
                    </td>
                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleBizSponsored(biz.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition ${
                          biz.patrocinada
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        <Award className="w-3 h-3" />
                        <span>{biz.patrocinada ? 'Patrocinada (Ativa)' : 'Ativar Destaque'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-semibold text-slate-700">
                        {biz.analytics.visualizacoes} views • {biz.analytics.cliquesWhatsapp} whats
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {biz.status !== 'ATIVO' && (
                          <button
                            onClick={() => handleApproveBiz(biz.id)}
                            className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[10px] font-bold cursor-pointer"
                          >
                            Aprovar
                          </button>
                        )}
                        {biz.status !== 'BLOQUEADO' && (
                          <button
                            onClick={() => handleBlockBiz(biz.id)}
                            className="px-2 py-1 bg-rose-100 hover:bg-rose-200 text-rose-700 rounded-md text-[10px] font-bold cursor-pointer"
                          >
                            Bloquear
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Cities & Expansion */}
      {activeTab === 'cities' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Configuração de Cidades & Expansão</h3>
              <p className="text-xs text-slate-500">
                A plataforma foi desenhada com IDs desacoplados para rápida expansão multi-cidades.
              </p>
            </div>

            <button
              onClick={() => setShowAddCityModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Adicionar Nova Cidade</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            {cities.map((c) => (
              <div
                key={c.id}
                className={`p-4 rounded-2xl border transition ${
                  c.cidadePrincipal
                    ? 'border-purple-300 bg-purple-50/50'
                    : 'border-slate-200 bg-white'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-purple-600" />
                    <h4 className="font-bold text-slate-900 text-sm">
                      {c.nome} / {c.estado}
                    </h4>
                  </div>
                  {c.cidadePrincipal && (
                    <span className="text-[10px] font-bold bg-purple-200 text-purple-800 px-2 py-0.5 rounded-md">
                      Principal (MVP)
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 mb-3">
                  <strong>Bairros cadastrados:</strong> {(c.bairrosPrincipais || c.bairros || []).slice(0, 3).join(', ')}...
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className={`text-[10px] font-bold ${c.ativo ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {c.ativo ? '● Ativa na plataforma' : '○ Inativa'}
                  </span>

                  {!c.cidadePrincipal && (
                    <button
                      onClick={() => handleToggleCity(c.id)}
                      className="text-[10px] font-bold text-purple-700 hover:underline cursor-pointer"
                    >
                      {c.ativo ? 'Desativar' : 'Ativar'}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Modal to add city */}
          {showAddCityModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
              <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 space-y-4">
                <h3 className="font-bold text-base text-slate-900">Adicionar Nova Cidade para Expansão</h3>
                <form onSubmit={handleAddCity} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Nome da Cidade
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: São Roque"
                      value={newCityName}
                      onChange={(e) => setNewCityName(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Estado (UF)
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={2}
                      value={newCityState}
                      onChange={(e) => setNewCityState(e.target.value.toUpperCase())}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Bairros Principais (separados por vírgula)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Centro, Taboão, Guaçu..."
                      value={newCityBairros}
                      onChange={(e) => setNewCityBairros(e.target.value)}
                      className="w-full rounded-xl border border-slate-300 p-2 text-xs"
                    />
                  </div>
                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCityModal(false)}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold"
                    >
                      Salvar Cidade
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab: Audit Logs */}
      {activeTab === 'logs' && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900">Histórico de Auditoria & Segurança</h3>
            <span className="text-xs text-slate-400">Últimas 100 ações registradas</span>
          </div>

          <div className="space-y-2">
            {auditLogs.map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.acao}</span>
                    <span className="text-slate-400">•</span>
                    <span className="text-purple-700 font-semibold">{log.usuario}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.detalhes}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">
                  {new Date(log.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
