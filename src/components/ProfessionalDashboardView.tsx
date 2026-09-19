import React, { useState } from 'react';
import {
  Briefcase,
  Power,
  Gift,
  Clock,
  Send,
  MessageCircle,
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle2,
  DollarSign,
  Plus,
  Trash2,
  Save,
  Users
} from 'lucide-react';
import { Professional, ServiceRequest, ServiceCategory } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface ProfessionalDashboardViewProps {
  professional: Professional;
  categories: ServiceCategory[];
  requests: ServiceRequest[];
  onRefresh: () => void;
}

export const ProfessionalDashboardView: React.FC<ProfessionalDashboardViewProps> = ({
  professional,
  categories,
  requests,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'leads' | 'perfil'>('leads');
  const [disponivel, setDisponivel] = useState(professional.disponivelAgora);

  // Proposal modal state
  const [selectedReqForProposal, setSelectedReqForProposal] = useState<ServiceRequest | null>(null);
  const [proposalPrice, setProposalPrice] = useState<string>('');
  const [proposalTimeline, setProposalTimeline] = useState<string>('Atendo amanhã às 09:00');
  const [proposalMessage, setProposalMessage] = useState<string>(
    'Olá! Tenho disponibilidade para realizar o serviço com garantia e nota fiscal. Fico à disposição!'
  );
  const [sendingProposal, setSendingProposal] = useState(false);

  // Profile editing state
  const [titulo, setTitulo] = useState(professional.tituloProfissional);
  const [descricao, setDescricao] = useState(professional.descricao);
  const [servicosList, setServicosList] = useState<string[]>(professional.servicos);
  const [newServiceInput, setNewServiceInput] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedSuccess, setProfileSavedSuccess] = useState(false);

  const handleToggleAvailability = () => {
    const newState = StorageService.toggleProfessionalAvailability(professional.id);
    setDisponivel(newState);
    onRefresh();
  };

  const handleExtendTrial = () => {
    StorageService.extendProfessionalTrial(professional.id, 180);
    onRefresh();
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForProposal) return;

    setSendingProposal(true);
    setTimeout(() => {
      StorageService.sendProposal(selectedReqForProposal.id, {
        profissionalId: professional.id,
        profissionalNome: professional.nome,
        profissionalFoto: professional.fotoUrl,
        profissionalWhatsapp: professional.whatsapp,
        valorEstimado: proposalPrice ? parseFloat(proposalPrice) : undefined,
        prazoEstimado: proposalTimeline,
        mensagem: proposalMessage
      });
      setSendingProposal(false);
      setSelectedReqForProposal(null);
      setProposalPrice('');
      onRefresh();
    }, 400);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setTimeout(() => {
      StorageService.saveProfessional({
        ...professional,
        tituloProfissional: titulo,
        descricao,
        servicos: servicosList
      });
      setSavingProfile(false);
      setProfileSavedSuccess(true);
      setTimeout(() => setProfileSavedSuccess(false), 2500);
      onRefresh();
    }, 300);
  };

  const handleAddService = () => {
    if (newServiceInput.trim() && !servicosList.includes(newServiceInput.trim())) {
      setServicosList([...servicosList, newServiceInput.trim()]);
      setNewServiceInput('');
    }
  };

  const handleRemoveService = (serviceToRemove: string) => {
    setServicosList(servicosList.filter(s => s !== serviceToRemove));
  };

  // Filter requests matching this professional's category or open
  const relevantRequests = requests.filter(r => r.status === 'aberto' || r.status === 'profissional_interessado');

  // Days left calculation
  const trialEnd = new Date(professional.plano.dataTermino).getTime();
  const daysLeft = Math.max(0, Math.ceil((trialEnd - Date.now()) / (1000 * 60 * 60 * 24)));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner & Availability Controls */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={professional.fotoUrl}
              alt={professional.nome}
              referrerPolicy="no-referrer"
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-teal-500/30"
            />
            <span
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                disponivel ? 'bg-emerald-500' : 'bg-slate-400'
              }`}
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{professional.nome}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200">
                Profissional Autônomo
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{professional.tituloProfissional} • {professional.cidadeId === 'cid-sorocaba' ? 'Sorocaba/SP' : 'Região'}</p>
          </div>
        </div>

        {/* Live Availability Toggle Button */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full md:w-auto justify-between">
          <div className="px-2">
            <span className="text-xs font-bold text-slate-700 block">Status de Atendimento</span>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${disponivel ? 'text-emerald-600' : 'text-slate-500'}`}>
              <span className={`w-2 h-2 rounded-full ${disponivel ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
              {disponivel ? 'Disponível Agora (Visível com destaque)' : 'Ocupado / Indisponível'}
            </span>
          </div>

          <button
            id="btn-toggle-availability"
            onClick={handleToggleAvailability}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              disponivel
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                : 'bg-slate-300 hover:bg-slate-400 text-slate-800'
            }`}
          >
            <Power className="w-3.5 h-3.5" />
            <span>{disponivel ? 'Ficar Indisponível' : 'Ficar Disponível'}</span>
          </button>
        </div>
      </div>

      {/* 6 Months Free Trial Benefit Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="p-3 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/30 shrink-0">
            <Gift className="w-6 h-6" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20 mb-1">
              <span>Benefício de Lançamento Sorocaba</span>
            </div>
            <h3 className="text-lg font-bold text-white">
              {professional.plano.nome} — {daysLeft} dias restantes
            </h3>
            <p className="text-xs text-teal-100 max-w-xl mt-1 leading-relaxed">
              Você não paga nenhuma taxa de intermediação, mensalidade ou comissão por orçamento.
              Negocie 100% livre diretamente com seus clientes pelo WhatsApp!
            </p>
          </div>
        </div>

        <button
          onClick={handleExtendTrial}
          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold transition cursor-pointer shrink-0 self-start md:self-auto"
        >
          + Estender Período Grátis
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('leads')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'leads'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Mural de Pedidos de Clientes ({relevantRequests.length})
        </button>
        <button
          onClick={() => setActiveTab('perfil')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'perfil'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Editar Meu Perfil & Especialidades
        </button>
      </div>

      {/* Leads Tab */}
      {activeTab === 'leads' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pedidos abertos na cidade de Sorocaba e região:
            </span>
          </div>

          {relevantRequests.length === 0 ? (
            <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
              <Clock className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <h4 className="font-bold text-slate-800">Nenhum pedido pendente no momento</h4>
              <p className="text-xs text-slate-500 mt-1">
                Fique com o status "Disponível Agora" ativo para receber solicitações prioritárias!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relevantRequests.map((req) => {
                const alreadySent = req.propostas.some(p => p.profissionalId === professional.id);

                return (
                  <div
                    key={req.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-100">
                          {req.servico}
                        </span>
                        <span
                          className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                            req.urgencia === 'urgente'
                              ? 'bg-rose-50 text-rose-700 border-rose-200'
                              : 'bg-slate-100 text-slate-600 border-slate-200'
                          }`}
                        >
                          Urgência: {req.urgencia}
                        </span>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                        "{req.descricao}"
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{req.bairro}, Sorocaba</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{new Date(req.dataDesejada).toLocaleDateString('pt-BR')} ({req.horarioPreferencia})</span>
                        </span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      {alreadySent ? (
                        <div className="w-full py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold text-center flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Proposta já enviada</span>
                        </div>
                      ) : (
                        <button
                          id={`btn-send-proposal-${req.id}`}
                          onClick={() => setSelectedReqForProposal(req)}
                          className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Enviar Orçamento / Proposta</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Profile & Services Editor */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs max-w-2xl">
          <form onSubmit={handleSaveProfile} className="space-y-4">
            <h3 className="text-base font-bold text-slate-900">Editar Dados do Meu Perfil</h3>

            {profileSavedSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>Perfil atualizado com sucesso!</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Título Profissional
              </label>
              <input
                type="text"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descrição Profissional / Apresentação
              </label>
              <textarea
                rows={4}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Serviços Oferecidos
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  placeholder="Novo serviço (ex: Troca de disjuntor)"
                  className="flex-1 rounded-xl border border-slate-300 p-2 text-xs"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-3 py-2 bg-teal-600 text-white rounded-xl text-xs font-bold flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Adicionar</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {servicosList.map((serv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 text-slate-800 text-xs font-medium"
                  >
                    <span>{serv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(serv)}
                      className="text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Salvando...' : 'Salvar Alterações'}</span>
            </button>
          </form>
        </div>
      )}

      {/* Modal to Send Proposal */}
      {selectedReqForProposal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in duration-150">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base">Enviar Orçamento / Proposta</h3>
                <p className="text-xs text-slate-400">Pedido #{selectedReqForProposal.id.replace('req-', '')}: {selectedReqForProposal.servico}</p>
              </div>
              <button
                onClick={() => setSelectedReqForProposal(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSendProposal} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Valor Estimado (R$) — Opcional
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-bold">R$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="Ex: 150.00 (deixe em branco se for a combinar)"
                    value={proposalPrice}
                    onChange={(e) => setProposalPrice(e.target.value)}
                    className="w-full pl-9 rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Prazo / Previsão de Atendimento
                </label>
                <input
                  type="text"
                  required
                  value={proposalTimeline}
                  onChange={(e) => setProposalTimeline(e.target.value)}
                  placeholder="Ex: Atendo amanhã às 09:00 ou em até 2 dias"
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Mensagem para o Cliente
                </label>
                <textarea
                  rows={3}
                  required
                  value={proposalMessage}
                  onChange={(e) => setProposalMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReqForProposal(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-bold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={sendingProposal}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{sendingProposal ? 'Enviando...' : 'Enviar Proposta'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
