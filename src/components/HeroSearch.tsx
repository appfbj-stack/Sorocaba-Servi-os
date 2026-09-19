import React, { useState } from 'react';
import { Search, Sparkles, MapPin, ArrowRight, Shield, Clock, CheckCircle2, Navigation } from 'lucide-react';
import { City, ServiceCategory } from '../types.ts';
import { CategoryIcon } from './CategoryIcon.tsx';

interface HeroSearchProps {
  selectedCity: City;
  categories: ServiceCategory[];
  onSearch: (query: string, categoryId?: string) => void;
  onSelectCategory: (categoryId: string) => void;
  onQuickAIQuery: (text: string) => void;
  onOpenNewRequest: () => void;
  onOpenNearMe?: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  selectedCity,
  categories,
  onSearch,
  onSelectCategory,
  onQuickAIQuery,
  onOpenNewRequest,
  onOpenNearMe
}) => {
  const [query, setQuery] = useState('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const samplePrompts = [
    'Minha tomada está esquentando e quero trocar',
    'Preciso de uma diarista amanhã no Campolim',
    'Chuveiro queimou preciso de conserto urgente',
    'Montador para guarda-roupas casal 6 portas'
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-teal-900 via-teal-800 to-slate-900 text-white pt-10 pb-16 px-4 sm:px-6 lg:px-8">
      {/* Decorative ambient gradients */}
      <div className="absolute top-0 right-0 -mt-12 -mr-12 w-96 h-96 rounded-full bg-teal-500/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -mb-12 -ml-12 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* City Location Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-700/60 border border-teal-500/30 text-teal-200 text-xs font-semibold mb-5 shadow-xs">
          <MapPin className="w-3.5 h-3.5 text-amber-300" />
          <span>Atendendo em {selectedCity.nome} e toda a região metropolitana</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-white mb-4">
          Encontre o profissional ou serviço que você precisa
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base sm:text-xl text-teal-100/90 font-normal max-w-2xl mx-auto mb-8">
          Profissionais autônomos, empresas e serviços perto de você com contato direto via WhatsApp.
        </p>

        {/* Main Search Input Form */}
        <form
          onSubmit={handleFormSubmit}
          className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-2xl flex flex-col sm:flex-row items-center gap-2 border border-white/20"
        >
          <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              id="hero-search-input"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Digite o que você precisa... Ex: Eletricista, diarista, celular"
              className="w-full text-slate-900 placeholder:text-slate-400 text-sm sm:text-base py-2 bg-transparent focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onOpenNearMe && (
              <button
                type="button"
                onClick={onOpenNearMe}
                className="w-full sm:w-auto px-3.5 py-3 rounded-xl bg-slate-900/90 hover:bg-slate-900 text-teal-300 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5 border border-teal-500/30 cursor-pointer shadow-xs shrink-0"
                title="Filtrar por proximidade GPS"
              >
                <Navigation className="w-4 h-4 text-amber-300" />
                <span className="whitespace-nowrap">Perto de mim</span>
              </button>
            )}

            <button
              id="btn-hero-search-submit"
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-teal-600/30 cursor-pointer"
            >
              <span>Encontrar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Natural Language Prompt Suggestion (AI Simulation) */}
        <div className="mt-5 max-w-2xl mx-auto text-left">
          <div className="flex items-center gap-1.5 text-xs text-teal-200/80 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Busca Inteligente por Frases (preenchimento automático):</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {samplePrompts.map((promptText, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setQuery(promptText);
                  onQuickAIQuery(promptText);
                }}
                className="text-xs text-left px-2.5 py-1 rounded-lg bg-teal-950/60 hover:bg-teal-700/60 border border-teal-500/20 text-teal-100 transition cursor-pointer"
              >
                "{promptText}"
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="mt-8 pt-6 border-t border-teal-700/50 flex flex-wrap items-center justify-center gap-6 text-xs text-teal-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-amber-300" />
            <span>Profissionais Verificados</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-300" />
            <span>Filtro "Disponível Agora"</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-amber-300" />
            <span>100% Gratuito para Clientes</span>
          </div>
        </div>
      </div>
    </section>
  );
};
