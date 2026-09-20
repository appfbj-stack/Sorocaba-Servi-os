import React from 'react';
import {
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Navigation,
  Heart,
  Award,
  ExternalLink
} from 'lucide-react';
import { Business } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface BusinessCardProps {
  business: Business;
  categoryName: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewProfile: (business: Business) => void;
}

export const BusinessCard: React.FC<BusinessCardProps> = ({
  business,
  categoryName,
  isFavorite,
  onToggleFavorite,
  onViewProfile
}) => {
  const whatsappMessage = `Olá! Encontrei a ${business.nome} no Kairos Serviços e gostaria de mais informações.`;
  const whatsappUrl = StorageService.buildWhatsAppUrl(business.whatsapp, whatsappMessage);
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.endereco)}`;

  const handleWhatsAppClick = () => {
    StorageService.trackBusinessClick(business.id, 'whatsapp');
  };

  const handleMapsClick = () => {
    StorageService.trackBusinessClick(business.id, 'maps');
  };

  return (
    <div
      id={`biz-card-${business.id}`}
      className={`bg-white rounded-2xl border transition-all flex flex-col justify-between overflow-hidden group ${
        business.patrocinada
          ? 'border-amber-300 shadow-md ring-1 ring-amber-400/20'
          : 'border-slate-200/90 shadow-xs hover:shadow-md'
      }`}
    >
      <div>
        {/* Banner image or top photo */}
        <div className="relative h-32 w-full overflow-hidden bg-slate-100">
          <img
            src={business.fotos[0] || business.logoUrl}
            alt={business.nome}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

          {/* Sponsored badge */}
          {business.patrocinada && (
            <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-500 text-white text-[11px] font-bold shadow-md">
              <Award className="w-3.5 h-3.5" />
              <span>Destaque Patrocinado</span>
            </div>
          )}

          {/* Favorite heart */}
          <button
            id={`btn-fav-biz-${business.id}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(business.id);
            }}
            className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition cursor-pointer ${
              isFavorite
                ? 'bg-rose-500 text-white'
                : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
            }`}
            title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Category & Neighborhood overlay */}
          <div className="absolute bottom-2 left-2.5 right-2.5 text-xs text-white/95 font-medium flex items-center justify-between gap-1">
            <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] text-white">
              {categoryName}
            </span>
            <span className="bg-white/95 text-slate-900 px-2 py-0.5 rounded-md text-[11px] font-bold shadow-xs flex items-center gap-1">
              <MapPin className="w-3 h-3 text-teal-600" />
              {business.bairro}
            </span>
          </div>
        </div>

        {/* Content area */}
        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h3
              onClick={() => {
                StorageService.trackBusinessClick(business.id, 'view');
                onViewProfile(business);
              }}
              className="font-bold text-slate-900 text-sm sm:text-base leading-snug hover:text-teal-600 cursor-pointer transition"
            >
              {business.nome}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1 text-xs shrink-0">
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span className="font-bold text-slate-800">{business.notaMedia.toFixed(1)}</span>
              <span className="text-slate-400 text-[11px]">({business.totalAvaliacoes})</span>
            </div>
          </div>

          {/* Address */}
          <div className="flex items-start gap-1.5 text-xs text-slate-600 mb-2 mt-2">
            <MapPin className="w-3.5 h-3.5 text-teal-600 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{business.endereco}</span>
          </div>

          {/* Hours */}
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-3">
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{business.horarioAtendimento}</span>
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {business.descricao}
          </p>

          {/* Products / Services Pills */}
          <div className="flex flex-wrap gap-1 mb-1">
            {business.servicosOuProdutos.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md truncate max-w-[160px]"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="p-3 sm:px-5 sm:py-3.5 bg-slate-50/90 border-t border-slate-100 flex items-center gap-2">
        {/* WhatsApp Button */}
        <a
          id={`btn-whatsapp-biz-${business.id}`}
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleWhatsAppClick}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <MessageCircle className="w-3.5 h-3.5 fill-white" />
          <span>WhatsApp</span>
        </a>

        {/* Como Chegar (Google Maps) */}
        <a
          id={`btn-maps-biz-${business.id}`}
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleMapsClick}
          className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold transition shadow-xs cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5" />
          <span>Como Chegar</span>
        </a>

        {/* View Profile */}
        <button
          onClick={() => {
            StorageService.trackBusinessClick(business.id, 'view');
            onViewProfile(business);
          }}
          className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
          title="Ver fotos e detalhes da loja"
        >
          Ver Loja
        </button>
      </div>
    </div>
  );
};
