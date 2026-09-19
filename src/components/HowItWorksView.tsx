import React from 'react';
import {
  Search,
  MessageCircle,
  Star,
  Gift,
  ShieldCheck,
  Zap,
  Store,
  Navigation,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const HowItWorksView: React.FC<{
  onOpenNewRequest: () => void;
  onGoToPros: () => void;
  onGoToBizs: () => void;
  onOpenRegisterPro?: () => void;
  onOpenRegisterClient?: () => void;
}> = ({ onOpenNewRequest, onGoToPros, onGoToBizs, onOpenRegisterPro, onOpenRegisterClient }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Intro */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 border border-teal-200 text-teal-800 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
          <span>Marketplace Local e Conexão Direta</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Como Funciona o Sorocaba Serviços
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          Nossa missão é aproximar moradores de Sorocaba dos melhores profissionais autônomos e comércios de bairro com agilidade, transparência e sem intermediários abusivos.
        </p>
      </div>

      {/* Section 1: Para Clientes */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700 font-black text-sm">
            01
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Para Clientes que Procuram Serviços</h2>
            <p className="text-xs text-slate-500">Rápido, gratuito e sem burocracia</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Search className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Busque ou Publique o Pedido</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Encontre o especialista no catálogo ou faça um pedido descrevendo o que precisa. Nossa busca inteligente ajuda a detalhar seu caso.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
              <MessageCircle className="w-5 h-5 fill-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Contato Direto via WhatsApp</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Converse diretamente com os profissionais, tire dúvidas, receba orçamentos e combine horários com total transparência.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Star className="w-5 h-5 fill-white" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. Avalie e Fortaleça a Região</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Após a conclusão do serviço, deixe sua avaliação de 1 a 5 estrelas para reconhecer o bom trabalho e orientar outros vizinhos.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            id="btn-howitworks-new-request"
            onClick={onOpenNewRequest}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer"
          >
            <span>Pedir um Serviço Agora</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {onOpenRegisterClient && (
            <button
              id="btn-howitworks-register-client"
              onClick={onOpenRegisterClient}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 text-sm font-bold transition cursor-pointer"
            >
              <span>Cadastrar como Cliente (Passar Serviços)</span>
            </button>
          )}
        </div>
      </div>

      {/* Section 2: Para Profissionais Autônomos */}
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-slate-900 text-white rounded-3xl p-8 shadow-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-400/20 text-amber-300 font-black text-sm border border-amber-300/30">
            02
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-white">Para Profissionais Autônomos</h2>
            <p className="text-xs text-teal-200">6 Meses Grátis de degustação com zero comissões</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-slate-800">
          <div className="p-5 rounded-2xl bg-white/95 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold">
              <Gift className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Sem Taxas por Orçamento</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Não cobramos comissão sobre seu trabalho nem taxas para você mandar propostas. Você fica com 100% do valor combinado.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/95 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Botão "Disponível Agora"</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Está com a agenda livre hoje? Ative o interruptor e seu perfil aparecerá com sinal luminoso verde e prioridade nas buscas da cidade.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/95 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. Construa sua Reputação</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Colete avaliações reais de clientes em Sorocaba, exiba fotos do seu portfólio e conquiste clientes recorrentes.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          {onOpenRegisterPro && (
            <button
              onClick={onOpenRegisterPro}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-sm font-black shadow-md transition cursor-pointer"
            >
              <span>Cadastrar Meu Perfil Grátis (6 Meses)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onGoToPros}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold border border-white/20 transition cursor-pointer"
          >
            <span>Ver Profissionais Cadastrados</span>
          </button>
        </div>
      </div>

      {/* Section 3: Para Lojas e Empresas */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xs">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800 font-black text-sm">
            03
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Para Empresas, Lojas & Comércios Locais</h2>
            <p className="text-xs text-slate-500">Visibilidade geográfica e métricas em tempo real</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold">
              <Store className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">1. Vitrine da Loja</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Divulgue fotos da sua loja física, produtos e serviços em destaque, horário de atendimento e telefone direto.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-sky-600 text-white flex items-center justify-center font-bold">
              <Navigation className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">2. Integração com Google Maps</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Botão de 1 clique em "Como Chegar" traça a rota diretamente para o endereço da sua loja em Sorocaba.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">3. Relatório de Métricas</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Saiba exatamente quantas visualizações sua loja recebeu e quantos clientes clicaram no seu WhatsApp e traçaram rotas.
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={onGoToBizs}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold shadow-md transition cursor-pointer"
          >
            <span>Explorar Empresas Locais</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
