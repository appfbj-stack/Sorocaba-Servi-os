import React from 'react';
import {
  X,
  Star,
  CheckCircle2,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  Phone,
  Shield,
  Award,
  Calendar,
  Navigation
} from 'lucide-react';
import { Professional, Review, ServiceCategory } from '../types.ts';
import { StorageService } from '../services/storage.ts';
import { formatDistance } from '../utils/geolocation.ts';

interface ProfessionalProfileModalProps {
  professional: Professional | null;
  category?: ServiceCategory;
  reviews: Review[];
  distanceKm?: number | null;
  onClose: () => void;
  onRequestService: (professional: Professional) => void;
}

export const ProfessionalProfileModal: React.FC<ProfessionalProfileModalProps> = ({
  professional,
  category,
  reviews,
  distanceKm,
  onClose,
  onRequestService
}) => {
  if (!professional) return null;

  const whatsappMessage = `Olá ${professional.nome.split(' ')[0]}, encontrei seu perfil no Kairos Serviços e gostaria de agendar uma visita/orçamento.`;
  const whatsappUrl = StorageService.buildWhatsAppUrl(professional.whatsapp, whatsappMessage);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Modal Header Bar */}
        <div className="bg-slate-900 text-white p-5 flex items-start justify-between relative">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={professional.fotoUrl}
                alt={professional.nome}
                referrerPolicy="no-referrer"
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-2 ring-teal-400/50 shadow-md"
              />
              {professional.verificado && (
                <span
                  className="absolute -bottom-1 -right-1 bg-teal-500 text-white p-1 rounded-full ring-2 ring-slate-900"
                  title="Verificado"
                >
                  <CheckCircle2 className="w-4 h-4" />
                </span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-extrabold text-white">
                  {professional.nome}
                </h2>
                {professional.disponivelAgora && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                    Online agora
                  </span>
                )}
              </div>
              <p className="text-teal-300 text-xs sm:text-sm font-medium">
                {professional.tituloProfissional}
              </p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <div className="flex items-center gap-1 text-xs">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span className="font-bold text-white">{professional.notaMedia.toFixed(1)}</span>
                  <span className="text-slate-400">({professional.totalAvaliacoes} avaliações)</span>
                </div>
                <span className="text-slate-500">•</span>
                <span className="text-xs text-slate-300 font-medium">{category?.nome}</span>
                {distanceKm !== undefined && distanceKm !== null && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-teal-300 bg-teal-900/60 px-2 py-0.5 rounded-md border border-teal-500/30">
                      <Navigation className="w-3 h-3" />
                      <span>{formatDistance(distanceKm)} de você</span>
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <a
              id="modal-btn-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>

            <button
              id="modal-btn-request"
              onClick={() => {
                onClose();
                onRequestService(professional);
              }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Solicitar Orçamento Formal</span>
            </button>
          </div>

          {/* About Me */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Sobre o Profissional
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {professional.descricao}
            </p>
          </div>

          {/* Key Info Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {distanceKm !== undefined && distanceKm !== null && (
              <div className="p-3 rounded-xl bg-teal-50/80 border border-teal-200/80 flex items-start gap-2.5 sm:col-span-2">
                <Navigation className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-teal-950 block">Proximidade Real</span>
                    <span className="text-teal-800">
                      Localizado a aproximadamente <strong>{formatDistance(distanceKm)}</strong> do seu endereço de referência ({professional.bairroBase || professional.bairrosAtendidos[0] || 'Sorocaba'}).
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-teal-800 bg-teal-200/60 px-2.5 py-1 rounded-lg">
                    {formatDistance(distanceKm)}
                  </span>
                </div>
              </div>
            )}

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Horário de Atendimento</span>
                <span className="text-slate-600">{professional.horarioAtendimento}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Garantia & Verificação</span>
                <span className="text-slate-600">
                  {professional.verificado ? 'Documentos e antecedentes verificados' : 'Em processo de certificação'}
                </span>
              </div>
            </div>
          </div>

          {/* Services Provided */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Serviços Prestados
            </h3>
            <div className="flex flex-wrap gap-2">
              {professional.servicos.map((serv, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200/60"
                >
                  ✓ {serv}
                </span>
              ))}
            </div>
          </div>

          {/* Neighborhoods Served */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-teal-600" />
              <span>Bairros Atendidos em Sorocaba</span>
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {professional.bairrosAtendidos.map((bairro, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium"
                >
                  {bairro}
                </span>
              ))}
            </div>
          </div>

          {/* Portfolio Gallery */}
          {professional.portfolio && professional.portfolio.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Fotos de Trabalhos Recentes
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {professional.portfolio.map((item, idx) => {
                  const imgUrl = typeof item === 'string' ? item : item.fotoUrl;
                  const title = typeof item === 'string' ? `Trabalho ${idx + 1}` : item.titulo;
                  return (
                    <div key={idx} className="h-28 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={imgUrl}
                        alt={title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover hover:scale-105 transition"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Client Reviews Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Avaliações de Clientes ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="font-bold">{professional.notaMedia.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl text-center">
                Ainda não há avaliações cadastradas para este profissional. Seja o primeiro a avaliar após a contratação!
              </p>
            ) : (
              <div className="space-y-3">
                {reviews.map((rev) => (
                  <div key={rev.id} className="p-3.5 rounded-xl bg-slate-50 border border-slate-100">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-bold text-xs text-slate-900">{rev.clienteNome}</span>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3 h-3 ${
                              star <= rev.nota ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      "{rev.comentario}"
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                      <span>{rev.servicoRealizado}</span>
                      <span>{new Date(rev.criadoEm).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
