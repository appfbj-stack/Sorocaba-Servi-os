import React, { useState } from 'react';
import { Heart, User, Store } from 'lucide-react';
import { Professional, Business, ServiceCategory } from '../types.ts';
import { ProfessionalCard } from './ProfessionalCard.tsx';
import { BusinessCard } from './BusinessCard.tsx';

interface FavoritesViewProps {
  favoriteIds: string[];
  professionals: Professional[];
  businesses: Business[];
  categories: ServiceCategory[];
  onToggleFavorite: (id: string) => void;
  onViewProProfile: (pro: Professional) => void;
  onRequestProService: (pro: Professional) => void;
  onViewBizProfile: (biz: Business) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteIds,
  professionals,
  businesses,
  categories,
  onToggleFavorite,
  onViewProProfile,
  onRequestProService,
  onViewBizProfile
}) => {
  const [activeTab, setActiveTab] = useState<'pros' | 'bizs'>('pros');

  const favPros = professionals.filter(p => favoriteIds.includes(p.id));
  const favBizs = businesses.filter(b => favoriteIds.includes(b.id));

  const getCategoryName = (catId: string) => {
    return categories.find(c => c.id === catId)?.nome || 'Geral';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
            <span>Meus Favoritos Salvos</span>
          </h1>
          <p className="text-sm text-slate-500">
            Acesse rapidamente os profissionais e lojas que você mais confia.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('pros')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'pros' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5 text-teal-600" />
            <span>Profissionais ({favPros.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('bizs')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
              activeTab === 'bizs' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Store className="w-3.5 h-3.5 text-amber-600" />
            <span>Empresas & Lojas ({favBizs.length})</span>
          </button>
        </div>
      </div>

      {activeTab === 'pros' ? (
        favPros.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">Nenhum profissional favoritado</h3>
            <p className="text-xs text-slate-500 mt-1">
              Clique no coração nos cards dos profissionais para salvá-los aqui para consultas futuras.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favPros.map((pro) => (
              <ProfessionalCard
                key={pro.id}
                professional={pro}
                categoryName={getCategoryName(pro.categoriaId)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onViewProfile={onViewProProfile}
                onRequestService={onRequestProService}
              />
            ))}
          </div>
        )
      ) : (
        favBizs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="font-bold text-slate-800">Nenhuma empresa favoritada</h3>
            <p className="text-xs text-slate-500 mt-1">
              Salve suas lojas locais favoritas para ter horários e endereço sempre à mão.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favBizs.map((biz) => (
              <BusinessCard
                key={biz.id}
                business={biz}
                categoryName={getCategoryName(biz.categoriaId)}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onViewProfile={onViewBizProfile}
              />
            ))}
          </div>
        )
      )}
    </div>
  );
};
