import React from 'react';
import { ServiceCategory } from '../types.ts';
import { CategoryIcon } from './CategoryIcon.tsx';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  categories: ServiceCategory[];
  selectedCategoryId: string | null;
  onSelectCategory: (categoryId: string | null) => void;
  professionalCounts: Record<string, number>;
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
  professionalCounts
}) => {
  return (
    <section className="py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Categorias Populares
          </h2>
          <p className="text-sm text-slate-500">
            Selecione uma especialidade para encontrar profissionais e empresas avaliadas.
          </p>
        </div>

        {selectedCategoryId && (
          <button
            onClick={() => onSelectCategory(null)}
            className="text-xs font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 px-3 py-1.5 rounded-lg border border-teal-200 transition self-start sm:self-auto cursor-pointer"
          >
            Limpar Filtro de Categoria
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.map((cat) => {
          const isSelected = selectedCategoryId === cat.id;
          const count = professionalCounts[cat.id] || 0;

          return (
            <button
              key={cat.id}
              id={`cat-card-${cat.slug}`}
              onClick={() => onSelectCategory(isSelected ? null : cat.id)}
              className={`group flex flex-col items-start p-3.5 sm:p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-600 bg-teal-50/80 ring-2 ring-teal-500/20 shadow-sm'
                  : 'border-slate-200/90 bg-white hover:border-teal-300 hover:shadow-md'
              }`}
            >
              <div
                className={`p-2.5 rounded-lg mb-3 transition ${
                  isSelected
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 group-hover:bg-teal-50 group-hover:text-teal-700'
                }`}
              >
                <CategoryIcon name={cat.icone} className="w-5 h-5" />
              </div>

              <span className="font-bold text-slate-900 text-xs sm:text-sm mb-1 leading-snug line-clamp-1 group-hover:text-teal-700">
                {cat.nome}
              </span>

              <span className="text-[11px] text-slate-400 font-medium">
                {count} {count === 1 ? 'profissional' : 'profissionais'}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
