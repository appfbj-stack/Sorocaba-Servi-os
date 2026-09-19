import React, { useState } from 'react';
import {
  Store,
  Eye,
  MessageCircle,
  Navigation,
  Globe,
  Award,
  Clock,
  MapPin,
  Phone,
  CheckCircle2,
  TrendingUp,
  Sparkles
} from 'lucide-react';
import { Business, ServiceCategory } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface BusinessDashboardViewProps {
  business: Business;
  categories: ServiceCategory[];
  onRefresh: () => void;
}

export const BusinessDashboardView: React.FC<BusinessDashboardViewProps> = ({
  business,
  categories,
  onRefresh
}) => {
  const [isSponsored, setIsSponsored] = useState(business.patrocinada);

  const handleToggleSponsored = () => {
    const newState = StorageService.toggleBusinessSponsored(business.id);
    setIsSponsored(newState);
    onRefresh();
  };

  const categoryName = categories.find(c => c.id === business.categoriaId)?.nome || 'Comércio Local';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={business.logoUrl}
            alt={business.nome}
            referrerPolicy="no-referrer"
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500/30"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold text-slate-900">{business.nome}</h1>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-amber-50 text-amber-800 border border-amber-200">
                {categoryName}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">{business.endereco}</p>
          </div>
        </div>

        {/* Sponsored Toggle Badge */}
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-2xl border border-slate-200 w-full md:w-auto justify-between">
          <div className="px-2">
            <span className="text-xs font-bold text-slate-700 block">Destaque de Anúncio</span>
            <span className={`text-[11px] font-semibold flex items-center gap-1.5 ${isSponsored ? 'text-amber-600' : 'text-slate-500'}`}>
              <Award className="w-3.5 h-3.5" />
              {isSponsored ? 'Patrocinada Ativa (Topo da Categoria)' : 'Listagem Gratuita Padrão'}
            </span>
          </div>

          <button
            id="btn-toggle-sponsored"
            onClick={handleToggleSponsored}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition cursor-pointer ${
              isSponsored
                ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                : 'bg-teal-600 hover:bg-teal-700 text-white'
            }`}
          >
            <span>{isSponsored ? 'Desativar Destaque' : 'Ativar Destaque'}</span>
          </button>
        </div>
      </div>

      {/* Analytics KPI Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-teal-600" />
            <span>Métricas de Visibilidade em Sorocaba</span>
          </h2>
          <span className="text-xs text-slate-400">Atualizado em tempo real</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Visualizações</span>
              <Eye className="w-4 h-4 text-teal-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {business.analytics.visualizacoes}
            </span>
            <span className="text-[11px] text-teal-600 font-semibold mt-1 block">
              Pessoas que viram sua loja
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cliques WhatsApp</span>
              <MessageCircle className="w-4 h-4 text-emerald-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {business.analytics.cliquesWhatsapp}
            </span>
            <span className="text-[11px] text-emerald-600 font-semibold mt-1 block">
              Conversas iniciadas
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Rotas no Mapa</span>
              <Navigation className="w-4 h-4 text-sky-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {business.analytics.cliquesComoChegar}
            </span>
            <span className="text-[11px] text-sky-600 font-semibold mt-1 block">
              Cliques em "Como Chegar"
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between text-slate-500 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Cliques em Redes</span>
              <Globe className="w-4 h-4 text-purple-600" />
            </div>
            <span className="text-2xl sm:text-3xl font-black text-slate-900 block">
              {business.analytics.cliquesSiteOuInsta}
            </span>
            <span className="text-[11px] text-purple-600 font-semibold mt-1 block">
              Visitas a links externos
            </span>
          </div>
        </div>
      </div>

      {/* Store Information Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/90 p-6 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900">Dados Cadastrais da Empresa</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Telefone de Contato</span>
              <span className="font-bold text-slate-800">{business.telefone}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">WhatsApp Comercial</span>
              <span className="font-bold text-slate-800">{business.whatsapp}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Horário de Funcionamento</span>
              <span className="font-bold text-slate-800">{business.horarioAtendimento}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-slate-400 block mb-0.5">Bairro / Região</span>
              <span className="font-bold text-slate-800">{business.bairro}, Sorocaba</span>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Produtos & Serviços Divulgados
            </h4>
            <div className="flex flex-wrap gap-2">
              {business.servicosOuProdutos.map((item, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-800 text-xs font-semibold"
                >
                  ✓ {item}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tips for local businesses */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 space-y-3">
          <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Dicas para Vender Mais</span>
          </div>
          <ul className="text-xs text-amber-800 space-y-2 leading-relaxed">
            <li>• Mantenha o link do WhatsApp configurado para responder rapidamente orçamentos.</li>
            <li>• Ative o Destaque Patrocinado para figurar no topo das buscas no bairro e categoria.</li>
            <li>• Solicite aos seus clientes atendidos que avaliem seu perfil com 5 estrelas.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
