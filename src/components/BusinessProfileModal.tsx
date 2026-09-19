import React from 'react';
import {
  X,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Award,
  ExternalLink,
  CheckCircle
} from 'lucide-react';
import { Business, Review, ServiceCategory } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface BusinessProfileModalProps {
  business: Business | null;
  category?: ServiceCategory;
  reviews: Review[];
  onClose: () => void;
}

export const BusinessProfileModal: React.FC<BusinessProfileModalProps> = ({
  business,
  category,
  reviews,
  onClose
}) => {
  if (!business) return null;

  const whatsappMessage = `Olá! Encontrei o perfil da ${business.nome} no Sorocaba Serviços e gostaria de mais informações.`;
  const whatsappUrl = StorageService.buildWhatsAppUrl(business.whatsapp, whatsappMessage);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.endereco)}`;

  const handleWhatsApp = () => {
    StorageService.trackBusinessClick(business.id, 'whatsapp');
  };

  const handleMaps = () => {
    StorageService.trackBusinessClick(business.id, 'maps');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Banner with close button */}
        <div className="relative h-48 sm:h-56 w-full bg-slate-900 shrink-0">
          <img
            src={business.fotos[0] || business.logoUrl}
            alt={business.nome}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/75 transition backdrop-blur-xs"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Sponsored badge */}
          {business.patrocinada && (
            <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-bold shadow-md">
              <Award className="w-3.5 h-3.5" />
              <span>Destaque Patrocinado</span>
            </div>
          )}

          {/* Bottom title info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <span className="text-xs bg-teal-600 px-2.5 py-0.5 rounded-md font-semibold text-white inline-block mb-1.5">
              {category?.nome}
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
              {business.nome}
            </h2>
            <div className="flex items-center gap-2 text-xs mt-1 text-slate-200">
              <div className="flex items-center gap-1 text-amber-300 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-300" />
                <span>{business.notaMedia.toFixed(1)}</span>
                <span className="text-slate-300 font-normal">({business.totalAvaliacoes} avaliações)</span>
              </div>
              <span>•</span>
              <span className="text-slate-300">{business.bairro}, Sorocaba</span>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <a
              id="biz-modal-whatsapp"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleWhatsApp}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 fill-white" />
              <span>Chamar no WhatsApp</span>
            </a>

            <a
              id="biz-modal-maps"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleMaps}
              className="flex items-center justify-center gap-2 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-bold text-sm transition shadow-sm cursor-pointer"
            >
              <Navigation className="w-4 h-4" />
              <span>Como Chegar (Google Maps)</span>
            </a>
          </div>

          {/* About Company */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
              Sobre a Empresa
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {business.descricao}
            </p>
          </div>

          {/* Contact & Hours Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-900 block">Endereço Completo</span>
                  <span className="text-slate-600">{business.endereco}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200/60">
                <Phone className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="text-slate-700 font-semibold">{business.telefone}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-2">
              <Clock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-900 block">Horário de Funcionamento</span>
                <span className="text-slate-600">{business.horarioAtendimento}</span>
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  ● Aberto para atendimento hoje
                </span>
              </div>
            </div>
          </div>

          {/* Featured Products & Services */}
          <div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Produtos & Serviços em Destaque
            </h3>
            <div className="flex flex-wrap gap-2">
              {business.servicosOuProdutos.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold border border-slate-200"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>

          {/* Photo Gallery */}
          {business.fotos && business.fotos.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2.5">
                Galeria de Fotos do Local
              </h3>
              <div className="grid grid-cols-2 gap-2.5">
                {business.fotos.map((foto, idx) => (
                  <div key={idx} className="h-32 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={foto}
                      alt={`Foto ${idx + 1}`}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews List */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Avaliações de Clientes ({reviews.length})
              </h3>
              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="font-bold">{business.notaMedia.toFixed(1)} / 5.0</span>
              </div>
            </div>

            {reviews.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl text-center">
                Ainda não há avaliações cadastradas para esta empresa.
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
                    <div className="text-[10px] text-slate-400 mt-2 text-right">
                      {new Date(rev.criadoEm).toLocaleDateString('pt-BR')}
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
