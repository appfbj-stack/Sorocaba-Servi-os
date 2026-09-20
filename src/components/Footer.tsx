import React from 'react';
import { MapPin, ShieldCheck, Heart, Sparkles, Hourglass } from 'lucide-react';
import { City } from '../types.ts';

interface FooterProps {
  selectedCity: City;
  onSelectCategory: (slug: string) => void;
  onOpenNewRequest: () => void;
  onOpenRegisterPro?: () => void;
  onOpenRegisterClient?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  selectedCity,
  onSelectCategory,
  onOpenNewRequest,
  onOpenRegisterPro,
  onOpenRegisterClient
}) => {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand Col */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-teal-800 to-teal-600 flex items-center justify-center text-amber-300 shadow-sm">
              <Hourglass className="w-4 h-4 text-amber-300" />
            </div>
            <span className="text-white font-extrabold text-base tracking-tight">
              Kairos<span className="text-teal-400">Serviços</span>
            </span>
          </div>
          <p className="text-slate-400 leading-relaxed">
            Kairos Serviços — Marketplace & Comércio Local conectando moradores de Sorocaba/SP e região aos melhores profissionais e lojas de bairro.
          </p>
          <div className="flex items-center gap-1 text-teal-400 font-semibold">
            <MapPin className="w-3.5 h-3.5" />
            <span>Região Metropolitana de Sorocaba</span>
          </div>
        </div>

        {/* Categories SEO */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Serviços Populares em Sorocaba
          </h4>
          <ul className="space-y-1.5 text-slate-400">
            <li>
              <button onClick={() => onSelectCategory('cat-eletrica')} className="hover:text-white transition">
                Eletricistas em Sorocaba
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('cat-limpeza')} className="hover:text-white transition">
                Diaristas e Faxineiras
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('cat-hidraulica')} className="hover:text-white transition">
                Encanadores e Desentupidoras
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('cat-climatizacao')} className="hover:text-white transition">
                Instalação de Ar-Condicionado
              </button>
            </li>
            <li>
              <button onClick={() => onSelectCategory('cat-manutencao')} className="hover:text-white transition">
                Marido de Aluguel e Montador
              </button>
            </li>
          </ul>
        </div>

        {/* Neighborhoods */}
        <div>
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Principais Bairros Atendidos
          </h4>
          <div className="flex flex-wrap gap-1.5 text-[11px]">
            {['Campolim', 'Centro', 'Além Ponte', 'Trujillo', 'Vila Hortência', 'Wanel Ville', 'Jardim América', 'Santa Rosália', 'Éden', 'Aparecidinha'].map((bairro, idx) => (
              <span key={idx} className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md">
                {bairro}
              </span>
            ))}
          </div>
        </div>

        {/* Security and Trust */}
        <div className="space-y-3">
          <h4 className="text-white font-bold text-xs uppercase tracking-wider mb-3">
            Segurança & Transparência
          </h4>
          <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 space-y-1.5">
            <div className="flex items-center gap-1.5 text-slate-200 font-bold">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Privacidade do Cliente</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-normal">
              Nunca divulgamos números ou endereços de clientes em páginas públicas. Todo contato ocorre após solicitação ou proposta.
            </p>
          </div>
          <p className="text-[11px] text-amber-300/80">
            ★ Pacote de oportunidades: R$ 9,99 = 10 clientes liberados via PIX na tela.
          </p>
          <div className="space-y-2 pt-1">
            {onOpenRegisterClient && (
              <button
                id="btn-footer-register-client"
                onClick={onOpenRegisterClient}
                className="w-full py-2 px-3 rounded-xl bg-teal-600/20 hover:bg-teal-600/30 border border-teal-500/40 text-teal-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Cadastrar-se como Cliente (Pedir Serviços)</span>
              </button>
            )}

            {onOpenRegisterPro && (
              <button
                id="btn-footer-register-pro"
                onClick={onOpenRegisterPro}
                className="w-full py-2 px-3 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs font-bold transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>Cadastrar-se como Profissional (6M Grátis)</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
        <div>
          © {new Date().getFullYear()} Kairos Serviços - Marketplace & Comércio Local. Conectando você aos melhores negócios e profissionais.
        </div>
        <div className="flex items-center gap-1 text-slate-400">
          <span>Feito com dedicação para Sorocaba e Região Metropolitana</span>
        </div>
      </div>
    </footer>
  );
};
