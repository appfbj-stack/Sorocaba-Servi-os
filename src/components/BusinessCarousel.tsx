import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  MapPin,
  Star,
  MessageCircle,
  Clock,
  ArrowRight,
  PlusCircle,
  Megaphone,
  ShieldCheck,
  Store
} from 'lucide-react';
import { Business } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface BusinessCarouselProps {
  businesses: Business[];
  onViewProfile: (business: Business) => void;
  onOpenRegisterModal: () => void;
  getCategoryName: (categoryId: string) => string;
}

export const BusinessCarousel: React.FC<BusinessCarouselProps> = ({
  businesses,
  onViewProfile,
  onOpenRegisterModal,
  getCategoryName
}) => {
  // Select sponsored and top-rated active businesses for advertisement carousel
  const carouselItems = businesses
    .filter((b) => b.anuncioAtivo !== false && b.status === 'ATIVO')
    .sort((a, b) => {
      if (a.patrocinada && !b.patrocinada) return -1;
      if (!a.patrocinada && b.patrocinada) return 1;
      return b.notaMedia - a.notaMedia;
    });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Determine items per page based on viewport estimate
  // We'll advance by 1 item each time
  const totalItems = carouselItems.length;

  useEffect(() => {
    if (totalItems <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalItems);
    }, 4500);

    return () => clearInterval(timer);
  }, [totalItems, isPaused]);

  if (totalItems === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + totalItems) % totalItems);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalItems);
  };

  // Safe window slice for responsive display (up to 3 visible on desktop)
  const getVisibleItems = () => {
    const items = [];
    for (let i = 0; i < Math.min(3, totalItems); i++) {
      const idx = (currentIndex + i) % totalItems;
      items.push({ item: carouselItems[idx], index: idx });
    }
    return items;
  };

  const visibleItems = getVisibleItems();

  return (
    <section
      id="carrossel-empresas-sorocaba"
      className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-teal-500/10 border border-amber-200/80 rounded-3xl p-5 sm:p-7 shadow-sm transition-all overflow-hidden relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Header bar of carousel */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500 text-white text-xs font-black shadow-xs tracking-wide uppercase mb-1.5">
            <Megaphone className="w-3.5 h-3.5 fill-white" />
            <span>Propaganda & Comércios em Destaque</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            Lojas & Empresas Locais de Sorocaba
            <Sparkles className="w-5 h-5 text-amber-500 fill-amber-400 hidden sm:inline" />
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-0.5">
            Encontre o comércio mais próximo da sua casa e peça direto pelo WhatsApp sem intermediários.
          </p>
        </div>

        {/* Carousel controls & CTA */}
        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <button
            id="btn-anunciar-empresa-carrossel"
            onClick={onOpenRegisterModal}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white text-xs font-bold shadow-xs transition hover:shadow cursor-pointer"
            title="Anuncie sua loja pagando taxa acessível via PIX"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Anuncie Sua Loja (Taxa PIX)</span>
          </button>

          <div className="flex items-center gap-1 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-amber-200">
            <button
              onClick={handlePrev}
              className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 transition cursor-pointer"
              aria-label="Empresa anterior"
              title="Empresa anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[11px] font-bold text-slate-600 px-1.5 min-w-[36px] text-center">
              {currentIndex + 1} / {totalItems}
            </span>
            <button
              onClick={handleNext}
              className="p-1.5 rounded-lg hover:bg-amber-100 text-slate-700 transition cursor-pointer"
              aria-label="Próxima empresa"
              title="Próxima empresa"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Carousel cards grid */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const diffX = touchStartX.current - e.changedTouches[0].clientX;
          if (diffX > 40) handleNext();
          if (diffX < -40) handlePrev();
          touchStartX.current = null;
        }}
      >
        {visibleItems.map(({ item: biz, index: itemIndex }, displayIdx) => {
          const whatsappMsg = `Olá! Vi a propaganda da ${biz.nome} no Sorocaba Serviços e gostaria de saber mais informações e valores.`;
          const whatsappUrl = StorageService.buildWhatsAppUrl(biz.whatsapp, whatsappMsg);

          const handleWhatsApp = (e: React.MouseEvent) => {
            e.stopPropagation();
            StorageService.trackBusinessClick(biz.id, 'whatsapp');
          };

          return (
            <div
              key={`${biz.id}-${itemIndex}`}
              id={`carousel-biz-${biz.id}`}
              className={`bg-white rounded-2xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md ${
                displayIdx > 0 ? 'hidden md:flex' : 'flex'
              } ${displayIdx === 2 ? 'hidden lg:flex' : ''} border-amber-300/80 ring-1 ring-amber-400/20`}
            >
              <div>
                {/* Banner / Store facade */}
                <div className="relative h-36 w-full overflow-hidden bg-slate-900 group">
                  <img
                    src={biz.fotos[0] || biz.logoUrl}
                    alt={biz.nome}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />

                  {/* Top Badges */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                      <Sparkles className="w-3 h-3 fill-white" />
                      Destaque Comercial
                    </span>

                    {/* Neighborhood tag */}
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-slate-800 text-[11px] font-bold shadow-xs">
                      <MapPin className="w-3 h-3 text-teal-600" />
                      {biz.bairro}
                    </span>
                  </div>

                  {/* Category Pill at bottom of image */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white text-xs">
                    <span className="bg-teal-600/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-medium">
                      {getCategoryName(biz.categoriaId)}
                    </span>
                    <div className="flex items-center gap-1 bg-black/60 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-bold text-amber-300">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{biz.notaMedia.toFixed(1)}</span>
                      <span className="text-white/70 font-normal">({biz.totalAvaliacoes})</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3
                    onClick={() => {
                      StorageService.trackBusinessClick(biz.id, 'view');
                      onViewProfile(biz);
                    }}
                    className="font-extrabold text-slate-900 text-sm leading-snug hover:text-amber-600 transition cursor-pointer line-clamp-1"
                    title={biz.nome}
                  >
                    {biz.nome}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {biz.descricao}
                  </p>

                  {/* Highlights / Products */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {biz.servicosOuProdutos.slice(0, 2).map((prod, pIdx) => (
                      <span
                        key={pIdx}
                        className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200/70 px-2 py-0.5 rounded-md truncate max-w-[170px] font-medium"
                      >
                        ✓ {prod}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 pt-1">
                    <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                    <span className="truncate">{biz.horarioAtendimento}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center gap-2">
                {/* Direct WhatsApp Button */}
                <a
                  id={`btn-carousel-whatsapp-${biz.id}`}
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={handleWhatsApp}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold shadow-xs hover:shadow transition cursor-pointer"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-white" />
                  <span>Chamar no WhatsApp</span>
                </a>

                {/* View Details */}
                <button
                  onClick={() => {
                    StorageService.trackBusinessClick(biz.id, 'view');
                    onViewProfile(biz);
                  }}
                  className="px-2.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer shrink-0"
                  title="Ver endereço e catálogo completo"
                >
                  Ver Loja
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom advertisement bar banner */}
      <div className="mt-5 pt-4 border-t border-amber-200/70 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <Store className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Tem uma loja, comércio ou distribuidora em Sorocaba? <strong>Pague uma taxa única/mensal via PIX</strong> e apareça para quem busca perto de você.
          </span>
        </div>

        <button
          onClick={onOpenRegisterModal}
          className="inline-flex items-center gap-1 font-bold text-amber-700 hover:text-amber-800 underline decoration-amber-500 underline-offset-2 shrink-0 cursor-pointer"
        >
          Ver planos de anúncio
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </section>
  );
};
