import React from 'react';
import {
  Star,
  CheckCircle,
  MapPin,
  Clock,
  MessageCircle,
  Heart,
  Send,
  Zap,
  Navigation
} from 'lucide-react';
import { Professional } from '../types.ts';
import { StorageService } from '../services/storage.ts';
import { formatDistance } from '../utils/geolocation.ts';

interface ProfessionalCardProps {
  professional: Professional;
  categoryName: string;
  isFavorite: boolean;
  distanceKm?: number | null;
  onToggleFavorite: (id: string) => void;
  onViewProfile: (professional: Professional) => void;
  onRequestService: (professional: Professional) => void;
}

export const ProfessionalCard: React.FC<ProfessionalCardProps> = ({
  professional,
  categoryName,
  isFavorite,
  distanceKm,
  onToggleFavorite,
  onViewProfile,
  onRequestService
}) => {
  const whatsappMessage = `Olá ${professional.nome.split(' ')[0]}, encontrei seu perfil no Sorocaba Serviços e gostaria de solicitar um orçamento.`;
  const whatsappUrl = StorageService.buildWhatsAppUrl(professional.whatsapp, whatsappMessage);

  return (
    <div
      id={`pro-card-${professional.id}`}
      className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
    >
      <div className="p-4 sm:p-5">
        {/* Header with Photo, Name & Badges */}
        <div className="flex items-start gap-3.5 mb-3">
          <div className="relative">
            <img
              src={professional.fotoUrl}
              alt={professional.nome}
              referrerPolicy="no-referrer"
              className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl object-cover border border-slate-100 shadow-xs"
            />
            {professional.verificado && (
              <span
                className="absolute -bottom-1 -right-1 bg-teal-600 text-white p-0.5 rounded-full ring-2 ring-white"
                title="Profissional Verificado pela Plataforma"
              >
                <CheckCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-1">
              <h3
                onClick={() => onViewProfile(professional)}
                className="font-bold text-slate-900 text-sm sm:text-base leading-tight truncate hover:text-teal-600 cursor-pointer transition"
              >
                {professional.nome}
              </h3>
              <button
                id={`btn-fav-pro-${professional.id}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(professional.id);
                }}
                className={`p-1.5 rounded-lg transition cursor-pointer shrink-0 ${
                  isFavorite
                    ? 'text-rose-600 bg-rose-50'
                    : 'text-slate-400 hover:text-rose-500 hover:bg-slate-50'
                }`}
                title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <p className="text-xs text-slate-500 truncate mt-0.5 font-medium">
              {professional.tituloProfissional}
            </p>

            {/* Category and Rating */}
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-teal-50 text-teal-800 border border-teal-100">
                {categoryName}
              </span>

              <div className="flex items-center gap-1 text-xs">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span className="font-bold text-slate-800">{professional.notaMedia.toFixed(1)}</span>
                <span className="text-slate-400 text-[11px]">({professional.totalAvaliacoes})</span>
              </div>
            </div>
          </div>
        </div>

        {/* Availability, Status & Distance Pill */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          {distanceKm !== undefined && distanceKm !== null && (
            <span
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs"
              title={`Distância calculada: ${distanceKm.toFixed(2)} km`}
            >
              <Navigation className="w-3 h-3 text-teal-600 shrink-0" />
              <span>{formatDistance(distanceKm)} de você</span>
            </span>
          )}

          {professional.disponivelAgora ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Disponível Agora
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-600">
              <Clock className="w-3 h-3 text-slate-400" />
              Agendamento
            </span>
          )}

          <span className="text-xs text-slate-400 truncate flex items-center gap-1">
            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
            <span className="truncate">{professional.bairroBase || professional.bairrosAtendidos[0] || 'Sorocaba'}</span>
          </span>
        </div>

        {/* Short Bio */}
        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
          {professional.descricao}
        </p>

        {/* Services tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {professional.servicos.slice(0, 3).map((serv, idx) => (
            <span
              key={idx}
              className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[150px]"
            >
              {serv}
            </span>
          ))}
          {professional.servicos.length > 3 && (
            <span className="text-[10px] text-slate-400 font-semibold px-1 py-0.5">
              +{professional.servicos.length - 3} mais
            </span>
          )}
        </div>
      </div>

      {/* Action Footer Buttons */}
      <div className="p-3 sm:px-5 sm:py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center gap-2">
        {/* WhatsApp Link with Pre-filled message */}
        <a
          id={`btn-whatsapp-pro-${professional.id}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>

        {/* Request Service Modal Trigger */}
        <button
          id={`btn-request-pro-${professional.id}`}
          onClick={() => onRequestService(professional)}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Solicitar</span>
        </button>

        {/* View Profile */}
        <button
          onClick={() => onViewProfile(professional)}
          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          title="Ver perfil completo e avaliações"
        >
          Perfil
        </button>
      </div>
    </div>
  );
};
