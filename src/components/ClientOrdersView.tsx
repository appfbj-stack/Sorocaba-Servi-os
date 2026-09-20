import React, { useState } from 'react';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  MessageCircle,
  DollarSign,
  Calendar,
  MapPin,
  Star,
  PlusCircle,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { ServiceRequest, ServiceProposal } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface ClientOrdersViewProps {
  requests: ServiceRequest[];
  onOpenNewRequest: () => void;
  onOpenReview: (targetId: string, targetName: string, serviceName: string, requestId: string) => void;
  onRefresh: () => void;
}

export const ClientOrdersView: React.FC<ClientOrdersViewProps> = ({
  requests,
  onOpenNewRequest,
  onOpenReview,
  onRefresh
}) => {
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequest | null>(requests[0] || null);

  const getStatusBadge = (status: ServiceRequest['status']) => {
    switch (status) {
      case 'aberto':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">Aguardando Propostas</span>;
      case 'profissional_interessado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">Propostas Recebidas</span>;
      case 'agendado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">Serviço Agendado</span>;
      case 'concluido':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">Concluído</span>;
      case 'cancelado':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">Cancelado</span>;
    }
  };

  const handleAcceptProposal = (pedidoId: string, proposalId: string) => {
    StorageService.acceptProposal(pedidoId, proposalId);
    onRefresh();
  };

  const handleCompleteOrder = (pedidoId: string) => {
    StorageService.updateRequestStatus(pedidoId, 'concluido');
    onRefresh();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-teal-600" />
            <span>Meus Pedidos de Serviço</span>
          </h1>
          <p className="text-sm text-slate-500">
            Acompanhe orçamentos enviados por profissionais e negocie via WhatsApp.
          </p>
        </div>

        <button
          onClick={onOpenNewRequest}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Fazer Novo Pedido</span>
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto shadow-xs">
          <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-1">Você ainda não fez nenhum pedido</h3>
          <p className="text-sm text-slate-500 mb-6">
            Publique o que precisa e receba orçamentos de profissionais avaliados de Sorocaba.
          </p>
          <button
            onClick={onOpenNewRequest}
            className="px-6 py-2.5 rounded-xl bg-teal-600 text-white font-semibold text-sm hover:bg-teal-700 transition"
          >
            Solicitar Serviço Agora
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* List of Orders */}
          <div className="lg:col-span-5 space-y-3">
            {requests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequest(req)}
                  className={`p-4 rounded-2xl border transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white border-teal-600 ring-2 ring-teal-500/20 shadow-sm'
                      : 'bg-white border-slate-200/90 hover:border-teal-300 hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-bold text-slate-400">
                      Pedido #{req.id.replace('req-', '')}
                    </span>
                    {getStatusBadge(req.status)}
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm leading-snug mb-1">
                    {req.servico}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                    {req.descricao}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {req.bairro}
                    </span>
                    <span className="font-semibold text-teal-700">
                      {req.propostas.length} {req.propostas.length === 1 ? 'proposta' : 'propostas'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed View of Selected Order */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs">
            {selectedRequest ? (
              <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-400">
                        Pedido #{selectedRequest.id.replace('req-', '')}
                      </span>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <h2 className="text-lg font-bold text-slate-900 mt-1">
                      {selectedRequest.servico}
                    </h2>
                  </div>

                  {selectedRequest.status === 'agendado' && (
                    <button
                      onClick={() => handleCompleteOrder(selectedRequest.id)}
                      className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs self-start sm:self-auto"
                    >
                      Marcar como Concluído
                    </button>
                  )}
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-3.5 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-slate-400 block mb-0.5">Bairro</span>
                    <span className="font-bold text-slate-800">{selectedRequest.bairro}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Data Desejada</span>
                    <span className="font-bold text-slate-800">
                      {new Date(selectedRequest.dataDesejada).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Período</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {selectedRequest.horarioPreferencia}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block mb-0.5">Urgência</span>
                    <span className="font-bold text-slate-800 capitalize">
                      {selectedRequest.urgencia}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Descrição do Serviço
                  </h4>
                  <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-100 leading-relaxed">
                    {selectedRequest.descricao}
                  </p>
                </div>

                {/* Proposals Received */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                      Orçamentos Recebidos ({selectedRequest.propostas.length})
                    </h4>
                    <span className="text-xs text-slate-500">
                      Contato direto sem intermediação financeira
                    </span>
                  </div>

                  {selectedRequest.propostas.length === 0 ? (
                    <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 text-center space-y-1">
                      <Clock className="w-6 h-6 text-amber-600 mx-auto mb-1" />
                      <p className="text-sm font-bold text-amber-900">
                        Nenhum orçamento recebido ainda
                      </p>
                      <p className="text-xs text-amber-700 max-w-sm mx-auto">
                        Seu pedido já está visível para os profissionais de Sorocaba na categoria correspondente.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {selectedRequest.propostas.map((prop) => {
                        const whatsappMsg = `Olá ${prop.profissionalNome.split(' ')[0]}, vi sua proposta no valor de R$ ${prop.valorEstimado || 'a combinar'} para o pedido #${selectedRequest.id} no Kairos Serviços. Podemos combinar os detalhes?`;
                        const whatsappLink = StorageService.buildWhatsAppUrl(prop.profissionalWhatsapp, whatsappMsg);

                        return (
                          <div
                            key={prop.id}
                            className={`p-4 rounded-2xl border transition ${
                              prop.status === 'aceito'
                                ? 'bg-teal-50/60 border-teal-300 ring-2 ring-teal-500/20'
                                : 'bg-slate-50 border-slate-200'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prop.profissionalFoto}
                                  alt={prop.profissionalNome}
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-xl object-cover"
                                />
                                <div>
                                  <h5 className="font-bold text-slate-900 text-sm">
                                    {prop.profissionalNome}
                                  </h5>
                                  <span className="text-xs text-slate-500">
                                    Prazo: {prop.prazoEstimado}
                                  </span>
                                </div>
                              </div>

                              <div className="text-right">
                                {prop.valorEstimado ? (
                                  <span className="text-base font-extrabold text-teal-700">
                                    R$ {prop.valorEstimado.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="text-xs font-bold text-slate-600">
                                    A Combinar
                                  </span>
                                )}
                                {prop.status === 'aceito' && (
                                  <span className="block text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md mt-1">
                                    ✓ Proposta Aceita
                                  </span>
                                )}
                              </div>
                            </div>

                            <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-slate-200/60 mb-3 leading-relaxed">
                              "{prop.mensagem}"
                            </p>

                            <div className="flex items-center gap-2">
                              <a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
                              >
                                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                                <span>Chamar no WhatsApp</span>
                              </a>

                              {prop.status !== 'aceito' && selectedRequest.status !== 'concluido' && (
                                <button
                                  onClick={() => handleAcceptProposal(selectedRequest.id, prop.id)}
                                  className="flex-1 py-2 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                                >
                                  Aceitar Proposta
                                </button>
                              )}

                              {(selectedRequest.status === 'agendado' || selectedRequest.status === 'concluido') && (
                                <button
                                  onClick={() => onOpenReview(prop.profissionalId, prop.profissionalNome, selectedRequest.servico, selectedRequest.id)}
                                  className="py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
                                >
                                  <Star className="w-3.5 h-3.5 fill-white" />
                                  <span>Avaliar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};
