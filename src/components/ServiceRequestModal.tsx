import React, { useState } from 'react';
import {
  X,
  Send,
  Calendar,
  Clock,
  AlertTriangle,
  MapPin,
  Camera,
  CheckCircle2,
  ShieldCheck
} from 'lucide-react';
import { City, Professional, ServiceCategory, User } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface ServiceRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  selectedCity: City;
  activeUser: User;
  targetProfessional?: Professional | null;
  initialCategory?: string;
  initialService?: string;
  initialUrgency?: 'baixa' | 'normal' | 'alta' | 'urgente';
  onSuccess: () => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCity,
  activeUser,
  targetProfessional,
  initialCategory,
  initialService,
  initialUrgency = 'normal',
  onSuccess
}) => {
  if (!isOpen) return null;

  const [categoriaId, setCategoriaId] = useState<string>(
    targetProfessional?.categoriaId || initialCategory || categories[0]?.id || 'cat-eletrica'
  );
  const [servico, setServico] = useState<string>(
    initialService || (targetProfessional ? targetProfessional.servicos[0] : '')
  );
  const [descricao, setDescricao] = useState('');
  const [bairro, setBairro] = useState(activeUser.bairro || 'Campolim');
  const [dataDesejada, setDataDesejada] = useState(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [horarioPreferencia, setHorarioPreferencia] = useState<'manha' | 'tarde' | 'noite' | 'qualquer'>('manha');
  const [urgencia, setUrgencia] = useState<'baixa' | 'normal' | 'alta' | 'urgente'>(initialUrgency);
  const [clienteNome, setClienteNome] = useState(activeUser.nome);
  const [clienteWhatsapp, setClienteWhatsapp] = useState(activeUser.telefone);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const currentCategory = categories.find(c => c.id === categoriaId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!descricao.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newReq = StorageService.createServiceRequest({
        clienteId: activeUser.id,
        clienteNome,
        clienteWhatsapp,
        categoriaId,
        servico: servico || (currentCategory?.servicosExemplos?.[0] || currentCategory?.servicosPadrao?.[0] || 'Serviço Geral'),
        descricao,
        cidadeId: selectedCity.id,
        bairro,
        dataDesejada,
        horarioPreferencia,
        urgencia,
        fotos: [
          'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=500&auto=format&fit=crop&q=80'
        ]
      });

      // If directed to a specific professional, simulate automatic notification / proposal preparation
      if (targetProfessional) {
        StorageService.addAuditLog(
          'Solicitação Direcionada',
          clienteNome,
          `Pedido #${newReq.id} enviado diretamente ao profissional ${targetProfessional.nome}.`,
          'pedido'
        );
      }

      setIsSubmitting(false);
      setSubmittedSuccess(true);
      setTimeout(() => {
        setSubmittedSuccess(false);
        onClose();
        onSuccess();
      }, 1500);
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-teal-700 text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">
              {targetProfessional
                ? `Solicitar Orçamento para ${targetProfessional.nome}`
                : 'Pedir um Serviço em Sorocaba'}
            </h2>
            <p className="text-xs text-teal-100 mt-0.5">
              Receba propostas e compare orçamentos gratuitamente
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-teal-800 text-teal-200 hover:text-white hover:bg-teal-900 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submittedSuccess ? (
          <div className="p-10 text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">Pedido Publicado com Sucesso!</h3>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Os profissionais qualificados de Sorocaba serão notificados e enviarão orçamentos diretamente para você.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Especialidade / Categoria
              </label>
              <select
                id="select-request-category"
                value={categoriaId}
                onChange={(e) => {
                  setCategoriaId(e.target.value);
                  const newCat = categories.find(c => c.id === e.target.value);
                  if (newCat) setServico((newCat.servicosExemplos || newCat.servicosPadrao || ['Serviço Geral'])[0]);
                }}
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Serviço Desejado
              </label>
              <input
                id="input-request-service"
                type="text"
                value={servico}
                onChange={(e) => setServico(e.target.value)}
                placeholder="Ex: Troca de disjuntor, Faxina residencial, Conserto de vazamento"
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descrição Detalhada do que Precisa
              </label>
              <textarea
                id="textarea-request-desc"
                rows={3}
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Explique o que aconteceu, marcas dos aparelhos, cômodos envolvidos ou qualquer detalhe relevante para o profissional calcular o orçamento..."
                required
                className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              />
            </div>

            {/* City & Neighborhood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Cidade
                </label>
                <div className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-teal-600" />
                  <span>{selectedCity.nome} - {selectedCity.estado}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Bairro do Atendimento
                </label>
                <select
                  id="select-request-bairro"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  {(selectedCity.bairrosPrincipais || selectedCity.bairros || []).map((b: string, i: number) => (
                    <option key={i} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date & Shift */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-teal-600" />
                  <span>Data Desejada</span>
                </label>
                <input
                  id="input-request-date"
                  type="date"
                  value={dataDesejada}
                  onChange={(e) => setDataDesejada(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-teal-600" />
                  <span>Período de Preferência</span>
                </label>
                <select
                  id="select-request-shift"
                  value={horarioPreferencia}
                  onChange={(e) => setHorarioPreferencia(e.target.value as any)}
                  className="w-full rounded-xl border border-slate-300 p-2.5 text-sm bg-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="manha">Manhã (08:00 às 12:00)</option>
                  <option value="tarde">Tarde (13:00 às 18:00)</option>
                  <option value="noite">Noite (após as 18:00)</option>
                  <option value="qualquer">Qualquer horário comercial</option>
                </select>
              </div>
            </div>

            {/* Urgency Radio Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                <span>Nível de Urgência</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'baixa', label: 'Baixa (Sem pressa)', color: 'text-slate-600 border-slate-200' },
                  { id: 'normal', label: 'Normal (Esta semana)', color: 'text-teal-700 border-teal-200 bg-teal-50/50' },
                  { id: 'alta', label: 'Alta (Próximos dias)', color: 'text-amber-700 border-amber-300 bg-amber-50/50' },
                  { id: 'urgente', label: '🚨 Urgente (Hoje/Imediato)', color: 'text-rose-700 border-rose-300 bg-rose-50/50' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setUrgencia(item.id as any)}
                    className={`p-2.5 rounded-xl border text-xs font-semibold text-center transition cursor-pointer ${
                      urgencia === item.id
                        ? 'ring-2 ring-teal-600 border-teal-600 bg-teal-50 text-teal-900 shadow-xs'
                        : `${item.color} hover:bg-slate-100`
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Contact info notice */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-700 font-bold">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Privacidade Garantida</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                Seu número de WhatsApp será compartilhado com segurança somente com os profissionais que você autorizar ou aceitar a proposta. Não exibimos seus dados publicamente na internet.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <input
                  type="text"
                  value={clienteNome}
                  onChange={(e) => setClienteNome(e.target.value)}
                  placeholder="Seu Nome Completo"
                  required
                  className="rounded-lg border border-slate-300 p-2 text-xs bg-white"
                />
                <input
                  type="text"
                  value={clienteWhatsapp}
                  onChange={(e) => setClienteWhatsapp(e.target.value)}
                  placeholder="Seu WhatsApp (15) 99999-9999"
                  required
                  className="rounded-lg border border-slate-300 p-2 text-xs bg-white"
                />
              </div>
            </div>

            {/* Submit CTA */}
            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-sm font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                id="btn-submit-service-request"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition flex items-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Enviando Pedido...' : 'Publicar Pedido de Serviço'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
