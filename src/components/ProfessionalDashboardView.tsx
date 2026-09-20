import React, { useState } from 'react';
import {
  Briefcase,
  Power,
  Zap,
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
  Users,
  Lock,
  Unlock,
  QrCode,
  Coins,
  Receipt,
  Phone
} from 'lucide-react';
import { Professional, ServiceRequest, ServiceCategory } from '../types.ts';
import { StorageService } from '../services/storage.ts';
import { PixPaymentModal } from './PixPaymentModal.tsx';

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
  const [activeTab, setActiveTab] = useState<'leads' | 'perfil' | 'pix'>('leads');
  const [disponivel, setDisponivel] = useState(professional.disponivelAgora);

  // PIX recharge modal
  const [isPixModalOpen, setIsPixModalOpen] = useState(false);
  const [pendingUnlockReqId, setPendingUnlockReqId] = useState<string | undefined>(undefined);

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

  const oportunidadesSaldo = typeof professional.oportunidadesDisponiveis === 'number'
    ? professional.oportunidadesDisponiveis
    : 10;
  const pedidosDesbloqueados = professional.pedidosDesbloqueadosIds || [];

  const handleToggleAvailability = () => {
    const newState = StorageService.toggleProfessionalAvailability(professional.id);
    setDisponivel(newState);
    onRefresh();
  };

  const handleUnlockRequest = (req: ServiceRequest) => {
    if (oportunidadesSaldo > 0) {
      StorageService.unlockServiceRequestForPro(professional.id, req.id);
      onRefresh();
    } else {
      setPendingUnlockReqId(req.id);
      setIsPixModalOpen(true);
    }
  };

  const handleOpenProposal = (req: ServiceRequest) => {
    const isUnlocked = pedidosDesbloqueados.includes(req.id) || req.propostas.some(p => p.profissionalId === professional.id);
    if (!isUnlocked && oportunidadesSaldo <= 0) {
      setPendingUnlockReqId(req.id);
      setIsPixModalOpen(true);
      return;
    }
    setSelectedReqForProposal(req);
  };

  const handleSendProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReqForProposal) return;

    // If not yet unlocked, unlock it using 1 opportunity
    const isUnlocked = pedidosDesbloqueados.includes(selectedReqForProposal.id) ||
      selectedReqForProposal.propostas.some(p => p.profissionalId === professional.id);

    if (!isUnlocked) {
      if (oportunidadesSaldo > 0) {
        StorageService.unlockServiceRequestForPro(professional.id, selectedReqForProposal.id);
      } else {
        setIsPixModalOpen(true);
        return;
      }
    }

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
  const pixTransactions = StorageService.getPixTransactions().filter(t => t.profissionalId === professional.id);

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

      {/* Opportunities & PIX Recharge Card */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-950 text-white rounded-3xl p-6 shadow-md flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/30 shrink-0">
            <Zap className="w-7 h-7 fill-amber-400 text-amber-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-300 bg-amber-400/10 px-3 py-0.5 rounded-full border border-amber-400/20 mb-2">
              <Coins className="w-3.5 h-3.5" />
              <span>Plano por Oportunidades: R$ 9,99 = 10 Serviços Liberados</span>
            </div>
            <div className="flex items-baseline gap-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                {oportunidadesSaldo} {oportunidadesSaldo === 1 ? 'Oportunidade Disponível' : 'Oportunidades Disponíveis'}
              </h3>
              <span className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full ${oportunidadesSaldo > 0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/30' : 'bg-rose-500/20 text-rose-300 border border-rose-400/30'}`}>
                {oportunidadesSaldo > 0 ? 'Saldo Ativo' : 'Recarga Necessária'}
              </span>
            </div>
            <p className="text-xs text-teal-100 max-w-2xl mt-1.5 leading-relaxed">
              Cada oportunidade dá acesso ao WhatsApp e telefone completo do cliente para negociação direta.
              <span className="font-bold text-amber-200"> Sem mensalidade cara e sem porcentagens sobre o seu serviço!</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
          <button
            id="btn-recharge-pix"
            onClick={() => {
              setPendingUnlockReqId(undefined);
              setIsPixModalOpen(true);
            }}
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-500 hover:to-amber-600 text-slate-950 font-extrabold text-xs transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 cursor-pointer"
          >
            <QrCode className="w-4 h-4" />
            <span>Recarregar 10 Créditos (R$ 9,99 via PIX)</span>
          </button>
        </div>
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
        <button
          onClick={() => setActiveTab('pix')}
          className={`pb-3 px-3 text-sm font-bold border-b-2 transition cursor-pointer ${
            activeTab === 'pix'
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Extrato PIX & Chave (CPF)
        </button>
      </div>

      {/* Leads Tab */}
      {activeTab === 'leads' ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">
              Pedidos abertos na cidade de Sorocaba e região:
            </span>
            <span className="text-xs font-bold text-teal-800 bg-teal-50 px-2.5 py-1 rounded-lg border border-teal-200">
              Seu Saldo: {oportunidadesSaldo} créditos
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
                const isUnlocked = pedidosDesbloqueados.includes(req.id) || alreadySent;

                const whatsAppDirectMsg = `Olá ${req.clienteNome}! Vi seu pedido de "${req.servico}" em Sorocaba pelo portal Kairos Serviços e tenho disponibilidade para te atender. Podemos conversar?`;
                const whatsAppUrl = StorageService.buildWhatsAppUrl(req.clienteWhatsapp, whatsAppDirectMsg);

                return (
                  <div
                    key={req.id}
                    className={`bg-white rounded-2xl border p-5 shadow-xs flex flex-col justify-between space-y-4 transition ${
                      isUnlocked ? 'border-teal-300 bg-teal-50/10' : 'border-slate-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span className="text-xs font-bold text-teal-700 bg-teal-50 px-2.5 py-0.5 rounded-md border border-teal-100">
                          {req.servico}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {isUnlocked ? (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              <span>Liberado</span>
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200 flex items-center gap-1">
                              <Lock className="w-3 h-3 text-slate-400" />
                              <span>1 Crédito</span>
                            </span>
                          )}
                          <span
                            className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                              req.urgencia === 'urgente'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {req.urgencia === 'urgente' ? 'Urgente' : 'Normal'}
                          </span>
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100 mb-3">
                        "{req.descricao}"
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 mb-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{req.bairro}, Sorocaba</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{new Date(req.dataDesejada).toLocaleDateString('pt-BR')} ({req.horarioPreferencia})</span>
                        </span>
                      </div>

                      {/* Client details box (unlocked vs locked) */}
                      <div className={`p-3 rounded-xl border text-xs ${
                        isUnlocked
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : 'bg-slate-50 border-slate-200 text-slate-600'
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-bold flex items-center gap-1.5">
                            {isUnlocked ? (
                              <>
                                <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                                <span>Cliente: {req.clienteNome}</span>
                              </>
                            ) : (
                              <>
                                <Lock className="w-3.5 h-3.5 text-slate-400" />
                                <span>Cliente: {req.clienteNome.split(' ')[0]} (Verificado)</span>
                              </>
                            )}
                          </span>
                          <span className="font-mono text-[11px] font-bold">
                            {isUnlocked ? req.clienteWhatsapp : '(15) 9****-****'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 space-y-2">
                      {isUnlocked ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <a
                            href={whatsAppUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Chamar no WhatsApp</span>
                          </a>

                          {alreadySent ? (
                            <div className="py-2.5 px-3 rounded-xl bg-slate-100 text-slate-700 border border-slate-200 text-xs font-bold flex items-center justify-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Proposta Enviada</span>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleOpenProposal(req)}
                              className="py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Send className="w-3.5 h-3.5" />
                              <span>Enviar Proposta</span>
                            </button>
                          )}
                        </div>
                      ) : (
                        <button
                          id={`btn-unlock-contact-${req.id}`}
                          onClick={() => handleUnlockRequest(req)}
                          className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-800 hover:to-emerald-800 text-white text-xs font-extrabold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                        >
                          <Unlock className="w-3.5 h-3.5 text-amber-300" />
                          <span>
                            {oportunidadesSaldo > 0
                              ? 'Liberar WhatsApp do Cliente (1 Crédito)'
                              : 'Liberar WhatsApp (Recarregar R$ 9,99 via PIX)'}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : activeTab === 'pix' ? (
        /* Pix statement and settings tab */
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs max-w-3xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Extrato de Créditos & PIX</h3>
              <p className="text-xs text-slate-500">
                Transparência completa sobre suas recargas e oportunidades de atendimento
              </p>
            </div>
            <button
              onClick={() => {
                setPendingUnlockReqId(undefined);
                setIsPixModalOpen(true);
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <QrCode className="w-4 h-4" />
              <span>Nova Recarga (R$ 9,99)</span>
            </button>
          </div>

          {/* Details Box */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Saldo Disponível</span>
              <p className="text-2xl font-black text-teal-700 mt-1">{oportunidadesSaldo} créditos</p>
              <span className="text-[11px] text-slate-500">1 crédito = 1 cliente liberado</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Preço do Pacote</span>
              <p className="text-2xl font-black text-slate-900 mt-1">R$ 9,99</p>
              <span className="text-[11px] text-emerald-600 font-semibold">10 oportunidades liberadas</span>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase">Chave PIX Oficial</span>
              <p className="text-sm font-mono font-bold text-slate-900 mt-1">02598018796</p>
              <span className="text-[11px] text-slate-500">Fernando Borges (CPF)</span>
            </div>
          </div>

          {/* Transactions list */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
              Histórico de Recargas PIX
            </h4>
            {pixTransactions.length === 0 ? (
              <div className="p-6 text-center border border-dashed border-slate-200 rounded-2xl text-xs text-slate-500">
                Nenhuma recarga PIX registrada ainda neste dispositivo.
              </div>
            ) : (
              <div className="space-y-2">
                {pixTransactions.map((tx) => (
                  <div
                    key={tx.id}
                    className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-100 text-emerald-700">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-slate-900 block">
                          Recarga de {tx.oportunidadesLiberadas} Oportunidades
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          {new Date(tx.dataHora).toLocaleString('pt-BR')} • PIX CPF {tx.chavePix}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-700 block">
                        R$ {tx.valor.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-semibold uppercase">
                        Confirmado
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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
                  placeholder="Ex: Instalação de Ar-Condicionado"
                  value={newServiceInput}
                  onChange={(e) => setNewServiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddService();
                    }
                  }}
                  className="flex-1 rounded-xl border border-slate-300 p-2 text-xs focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="button"
                  onClick={handleAddService}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-bold"
                >
                  Adicionar
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {servicosList.map((srv, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs"
                  >
                    <span>{srv}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveService(srv)}
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

      {/* Pix Payment Modal */}
      <PixPaymentModal
        isOpen={isPixModalOpen}
        onClose={() => {
          setIsPixModalOpen(false);
          setPendingUnlockReqId(undefined);
        }}
        professional={professional}
        pendingRequestIdToUnlock={pendingUnlockReqId}
        onSuccess={(updatedPro) => {
          onRefresh();
        }}
      />
    </div>
  );
};
