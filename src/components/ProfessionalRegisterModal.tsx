import React, { useState } from 'react';
import {
  X,
  Briefcase,
  CheckCircle2,
  Gift,
  Zap,
  ShieldCheck,
  MapPin,
  Phone,
  MessageCircle,
  Plus,
  Trash2,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { City, ServiceCategory, Professional, User } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface ProfessionalRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  selectedCity: City;
  onSuccess: (professional: Professional, user: User) => void;
  onSwitchToClient?: () => void;
}

// Preset avatars for rapid onboarding
const PRESET_AVATARS = [
  {
    label: 'Técnico 1',
    url: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Técnica 2',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Especialista 3',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Profissional 4',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&auto=format&fit=crop&q=80'
  },
  {
    label: 'Mestre 5',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  }
];

// Smart suggestions by category
const CATEGORY_SUGGESTIONS: Record<string, string[]> = {
  'cat-eletrica': [
    'Instalação de Chuveiro',
    'Troca de Fiação',
    'Quadro de Disjuntores',
    'Tomadas e Interruptores',
    'Luminárias e Fita LED',
    'Padrão de Entrada CPFL'
  ],
  'cat-hidraulica': [
    'Vazamentos e Canos Furados',
    'Desentupimento de Pia e Ralo',
    'Troca de Torneiras e Registros',
    'Limpeza de Caixa d’Água',
    'Instalação de Vaso Sanitário',
    'Válvula Hydra e Descarga'
  ],
  'cat-limpeza': [
    'Faxina Residencial Completa',
    'Diarista por Diária',
    'Limpeza Pós-Obra',
    'Passadeira de Roupas',
    'Higienização de Sofás e Colchões',
    'Limpeza de Vidros e Janelas'
  ],
  'cat-climatizacao': [
    'Instalação de Ar Split',
    'Limpeza e Higienização Química',
    'Carga de Gás Ecológico',
    'Manutenção Preventiva',
    'Desinstalação e Remanejamento'
  ],
  'cat-pintura': [
    'Pintura Residencial Interna',
    'Pintura de Fachada e Portão',
    'Aplicação de Massa Corrida',
    'Grafiato e Textura Projetada',
    'Verniz em Portas e Decks'
  ],
  'cat-manutencao': [
    'Montagem e Desmontagem de Móveis',
    'Instalação de Suporte de TV e Varal',
    'Troca de Fechaduras e Dobradiças',
    'Pequenos Reparos Gerais',
    'Instalação de Cortinas e Persianas'
  ],
  'cat-construcao': [
    'Assentamento de Piso e Porcelanato',
    'Reboco e Alvenaria',
    'Reparo em Telhados e Calhas',
    'Pequenas Reformas',
    'Gesso e Drywall'
  ],
  'cat-automotivo': [
    'Mecânica Rápida em Domicílio',
    'Polimento e Estética Automotiva',
    'Troca de Bateria',
    'Auto Elétrica'
  ],
  'cat-beleza': [
    'Cabelereira em Domicílio',
    'Manicure e Pedicure',
    'Design de Sobrancelhas',
    'Maquiagem Social'
  ]
};

export const ProfessionalRegisterModal: React.FC<ProfessionalRegisterModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCity,
  onSuccess,
  onSwitchToClient
}) => {
  if (!isOpen) return null;

  const cityNeighborhoods = selectedCity.bairrosPrincipais || selectedCity.bairros || [
    'Campolim',
    'Centro',
    'Mangal',
    'Trujillo',
    'Wanel Ville',
    'Além Ponte',
    'Vila Hortência',
    'Santa Rosália'
  ];

  // Form State
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id || 'cat-eletrica');
  const [tituloProfissional, setTituloProfissional] = useState('');
  const [bairroBase, setBairroBase] = useState(cityNeighborhoods[0] || 'Campolim');
  const [bairrosAtendidos, setBairrosAtendidos] = useState<string[]>([cityNeighborhoods[0] || 'Campolim']);
  const [atendeTodaCidade, setAtendeTodaCidade] = useState(true);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0].url);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [servicos, setServicos] = useState<string[]>([
    CATEGORY_SUGGESTIONS[categories[0]?.id]?.[0] || 'Atendimento em domicílio'
  ]);
  const [novoServicoInput, setNovoServicoInput] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horarioAtendimento, setHorarioAtendimento] = useState('Segunda a Sábado, das 08:00 às 18:00');
  const [disponivelAgora, setDisponivelAgora] = useState(true);

  // Status
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredResult, setRegisteredResult] = useState<{
    professional: Professional;
    user: User;
  } | null>(null);

  // Format WhatsApp input "(15) 99999-9999"
  const handleWhatsappChange = (value: string) => {
    const raw = value.replace(/\D/g, '');
    let formatted = raw;
    if (raw.length <= 2) {
      formatted = raw ? `(${raw}` : '';
    } else if (raw.length <= 7) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    } else if (raw.length <= 11) {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
    } else {
      formatted = `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7, 11)}`;
    }
    setWhatsapp(formatted);
  };

  // Add a service tag
  const handleAddService = (serviceName: string) => {
    const clean = serviceName.trim();
    if (!clean) return;
    if (!servicos.includes(clean)) {
      setServicos(prev => [...prev, clean]);
    }
    setNovoServicoInput('');
  };

  // Remove a service tag
  const handleRemoveService = (serviceName: string) => {
    setServicos(prev => prev.filter(s => s !== serviceName));
  };

  // Switch category updates suggestions
  const handleCategoryChange = (newCatId: string) => {
    setCategoriaId(newCatId);
    const suggestions = CATEGORY_SUGGESTIONS[newCatId];
    if (suggestions && suggestions.length > 0 && servicos.length <= 1) {
      setServicos([suggestions[0], suggestions[1] || '']);
    }
  };

  // Toggle neighborhood in list
  const handleToggleNeighborhood = (bairro: string) => {
    if (bairrosAtendidos.includes(bairro)) {
      if (bairrosAtendidos.length > 1) {
        setBairrosAtendidos(prev => prev.filter(b => b !== bairro));
      }
    } else {
      setBairrosAtendidos(prev => [...prev, bairro]);
    }
  };

  // Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!nome.trim() || nome.trim().length < 3) {
      errs.nome = 'Informe seu nome completo (mínimo 3 caracteres)';
    }

    const cleanWhats = whatsapp.replace(/\D/g, '');
    if (cleanWhats.length < 10) {
      errs.whatsapp = 'Informe um WhatsApp válido com DDD (ex: 15 99999-9999)';
    }

    if (!tituloProfissional.trim()) {
      errs.tituloProfissional = 'Informe seu título profissional (ex: Eletricista Residencial)';
    }

    if (servicos.length === 0) {
      errs.servicos = 'Adicione ao menos 1 serviço que você realiza';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const finalBairros = atendeTodaCidade
        ? cityNeighborhoods
        : bairrosAtendidos.length > 0
        ? bairrosAtendidos
        : [bairroBase];

      const avatar = customAvatarUrl.trim() || selectedAvatar;

      const result = StorageService.registerProfessional({
        nome: nome.trim(),
        tituloProfissional: tituloProfissional.trim(),
        categoriaId,
        servicos,
        descricao: descricao.trim() || `Profissional dedicado com ampla experiência em ${selectedCity.nome} e região. Atendimento rápido, com garantia e orçamento direto pelo WhatsApp.`,
        bairrosAtendidos: finalBairros,
        bairroBase,
        whatsapp,
        telefone: whatsapp,
        cidadeId: selectedCity.id,
        fotoUrl: avatar,
        status: 'ATIVO',
        email: email.trim() || undefined
      });

      // Update availability if requested
      if (!disponivelAgora) {
        StorageService.toggleProfessionalAvailability(result.professional.id);
        result.professional.disponivelAgora = false;
      }

      setRegisteredResult(result);
    } catch (err) {
      console.error('Erro ao cadastrar profissional:', err);
      setErrors({ form: 'Ocorreu um erro ao salvar o cadastro. Tente novamente.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFinish = () => {
    if (registeredResult) {
      onSuccess(registeredResult.professional, registeredResult.user);
      onClose();
    }
  };

  return (
    <div
      id="modal-professional-register"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-6">
        {/* Top Promotional Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-700 to-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-slate-950 text-xs font-black mb-2 shadow-xs">
            <Gift className="w-3.5 h-3.5 text-slate-950" />
            <span>6 MESES DE DEGUSTAÇÃO 100% GRÁTIS</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Cadastro de Prestador de Serviços
          </h2>
          <p className="text-xs sm:text-sm text-teal-100 mt-1 max-w-lg">
            Receba pedidos de clientes de {selectedCity.nome} e região diretamente no seu WhatsApp, com 0% de comissão.
          </p>
        </div>

        {/* If registered successfully: Success confirmation screen */}
        {registeredResult ? (
          <div className="p-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-slate-900">
                Parabéns, {registeredResult.professional.nome}!
              </h3>
              <p className="text-sm text-slate-600 max-w-md mx-auto">
                Seu perfil de <strong>{registeredResult.professional.tituloProfissional}</strong> já está ativo no marketplace de {selectedCity.nome}.
              </p>
            </div>

            {/* Benefit Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left max-w-lg mx-auto">
              <div className="p-3.5 rounded-2xl bg-teal-50 border border-teal-200/70">
                <div className="text-xs font-bold text-teal-900 flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-teal-600" />
                  <span>Disponível Agora</span>
                </div>
                <div className="text-[11px] text-teal-700 mt-1">
                  Seu perfil já está marcado com sinal verde para emergências.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70">
                <div className="text-xs font-bold text-amber-900 flex items-center gap-1">
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span>Plano 6 Meses</span>
                </div>
                <div className="text-[11px] text-amber-700 mt-1">
                  Sem nenhuma mensalidade até {new Date(registeredResult.professional.plano.dataTermino).toLocaleDateString('pt-BR')}.
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200/70">
                <div className="text-xs font-bold text-blue-900 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                  <span>WhatsApp Direto</span>
                </div>
                <div className="text-[11px] text-blue-700 mt-1">
                  Os clientes falarão diretamente com você sem intermediários.
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleFinish}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Acessar Meu Painel de Profissional</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Registration Form */
          <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
            {errors.form && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 font-semibold">
                {errors.form}
              </div>
            )}

            {/* SEÇÃO 1: Identificação e Contato */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                <UserCheck className="w-4 h-4 text-teal-600" />
                <span>1. Seus Dados & WhatsApp</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Nome Completo */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nome Completo <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    placeholder="Ex: Carlos Eduardo Silva"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-teal-500 outline-hidden ${
                      errors.nome ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.nome && <p className="text-[11px] text-rose-600 mt-1">{errors.nome}</p>}
                </div>

                {/* WhatsApp */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    WhatsApp Comercial <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <MessageCircle className="w-4 h-4 text-emerald-500 absolute left-3.5 top-3" />
                    <input
                      type="text"
                      required
                      value={whatsapp}
                      onChange={(e) => handleWhatsappChange(e.target.value)}
                      placeholder="(15) 99999-9999"
                      maxLength={15}
                      className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-teal-500 outline-hidden ${
                        errors.whatsapp ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                      }`}
                    />
                  </div>
                  {errors.whatsapp ? (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.whatsapp}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Os clientes clicarão para abrir o chat diretamente com você.
                    </p>
                  )}
                </div>
              </div>

              {/* Email opcional */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  E-mail de Contato (Opcional)
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seuemail@exemplo.com.br"
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
                />
              </div>

              {/* Foto de Perfil */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Escolha uma Foto de Perfil
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  {PRESET_AVATARS.map((av, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setSelectedAvatar(av.url);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative rounded-full p-0.5 border-2 transition cursor-pointer ${
                        selectedAvatar === av.url && !customAvatarUrl
                          ? 'border-teal-600 scale-105 shadow-sm'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={av.url}
                        alt={av.label}
                        className="w-11 h-11 rounded-full object-cover"
                      />
                    </button>
                  ))}
                  <div className="flex-1 min-w-[200px]">
                    <input
                      type="url"
                      value={customAvatarUrl}
                      onChange={(e) => setCustomAvatarUrl(e.target.value)}
                      placeholder="Ou cole o link de uma foto sua..."
                      className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* SEÇÃO 2: Especialidade e Atuação */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                <Briefcase className="w-4 h-4 text-teal-600" />
                <span>2. Especialidade & Local de Atuação</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Categoria Principal */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Categoria Principal <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={categoriaId}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-hidden font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Título Profissional */}
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Título de Destaque <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={tituloProfissional}
                    onChange={(e) => setTituloProfissional(e.target.value)}
                    placeholder="Ex: Eletricista Residencial e Predial"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-teal-500 outline-hidden ${
                      errors.tituloProfissional ? 'border-rose-400 bg-rose-50/50' : 'border-slate-300'
                    }`}
                  />
                  {errors.tituloProfissional && (
                    <p className="text-[11px] text-rose-600 mt-1">{errors.tituloProfissional}</p>
                  )}
                </div>
              </div>

              {/* Bairro Base */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Seu Bairro Base em {selectedCity.nome} <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={bairroBase}
                    onChange={(e) => {
                      setBairroBase(e.target.value);
                      if (!bairrosAtendidos.includes(e.target.value)) {
                        setBairrosAtendidos(prev => [...prev, e.target.value]);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-teal-500 outline-hidden"
                  >
                    {cityNeighborhoods.map((bairro, idx) => (
                      <option key={idx} value={bairro}>
                        {bairro}
                      </option>
                    ))}
                  </select>
                  <p className="text-[10px] text-slate-400 mt-1">
                    Utilizado no cálculo de distância do filtro por GPS.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Disponibilidade de Deslocamento
                  </label>
                  <div className="mt-1">
                    <label className="flex items-center gap-2 cursor-pointer p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition">
                      <input
                        type="checkbox"
                        checked={atendeTodaCidade}
                        onChange={(e) => setAtendeTodaCidade(e.target.checked)}
                        className="w-4 h-4 rounded-md text-teal-600 focus:ring-teal-500"
                      />
                      <span className="text-xs font-medium text-slate-700">
                        Atendo em <strong>toda a cidade</strong> e bairros vizinhos
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Bairros adicionais se não atender toda a cidade */}
              {!atendeTodaCidade && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Selecione os bairros que você atende:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {cityNeighborhoods.map((b, idx) => {
                      const isSelected = bairrosAtendidos.includes(b);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleToggleNeighborhood(b)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium transition cursor-pointer border ${
                            isSelected
                              ? 'bg-teal-600 text-white border-teal-600'
                              : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {b}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SEÇÃO 3: Serviços e Descrição */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-slate-800 font-bold text-sm">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>3. Serviços Realizados & Bio</span>
              </div>

              {/* Sugestões de Serviços */}
              {CATEGORY_SUGGESTIONS[categoriaId] && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-500 mb-1.5">
                    Clique para adicionar serviços recomendados para sua categoria:
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {CATEGORY_SUGGESTIONS[categoriaId].map((sug, idx) => {
                      const alreadyAdded = servicos.includes(sug);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            if (alreadyAdded) {
                              handleRemoveService(sug);
                            } else {
                              handleAddService(sug);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-full text-xs font-medium transition cursor-pointer flex items-center gap-1 border ${
                            alreadyAdded
                              ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold'
                              : 'bg-white text-slate-600 border-slate-200 hover:border-teal-300 hover:bg-slate-50'
                          }`}
                        >
                          <span>{alreadyAdded ? '✓' : '+'}</span>
                          <span>{sug}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Serviços Selecionados */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Serviços no seu Perfil ({servicos.length}) <span className="text-rose-500">*</span>
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 min-h-[36px] p-2 bg-slate-50 rounded-xl border border-slate-200">
                  {servicos.length === 0 ? (
                    <span className="text-xs text-slate-400 italic">
                      Nenhum serviço adicionado ainda. Adicione nas sugestões ou digite abaixo.
                    </span>
                  ) : (
                    servicos.map((srv, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 bg-white px-2.5 py-1 rounded-lg text-xs font-semibold text-teal-900 border border-teal-200 shadow-2xs"
                      >
                        <span>{srv}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveService(srv)}
                          className="text-slate-400 hover:text-rose-600 transition cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))
                  )}
                </div>

                {/* Input de serviço personalizado */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={novoServicoInput}
                    onChange={(e) => setNovoServicoInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddService(novoServicoInput);
                      }
                    }}
                    placeholder="Adicionar outro serviço específico..."
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                  <button
                    type="button"
                    onClick={() => handleAddService(novoServicoInput)}
                    className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Adicionar</span>
                  </button>
                </div>
                {errors.servicos && <p className="text-[11px] text-rose-600 mt-1">{errors.servicos}</p>}
              </div>

              {/* Descrição / Bio */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Apresentação e Experiência (Bio)
                </label>
                <textarea
                  rows={3}
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Conte um pouco sobre sua trajetória, garantia dos serviços, ferramentas e diferencial de atendimento..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden leading-relaxed"
                />
              </div>

              {/* Horário e Disponibilidade Imediata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Horário Padrão de Atendimento
                  </label>
                  <input
                    type="text"
                    value={horarioAtendimento}
                    onChange={(e) => setHorarioAtendimento(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-teal-500 outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Status Inicial
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer p-2 rounded-xl border border-emerald-200 bg-emerald-50/60 hover:bg-emerald-50 transition">
                    <input
                      type="checkbox"
                      checked={disponivelAgora}
                      onChange={(e) => setDisponivelAgora(e.target.checked)}
                      className="w-4 h-4 rounded-md text-emerald-600 focus:ring-emerald-500"
                    />
                    <div className="text-xs">
                      <span className="font-bold text-emerald-900">Disponível Agora (Sinal Verde)</span>
                      <p className="text-[10px] text-emerald-700">Destaque imediato nas buscas do dia</p>
                    </div>
                  </label>
                </div>
              </div>
            </div>

            {/* Aviso de Transparência dos 6 Meses */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
              <Gift className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900 space-y-1">
                <span className="font-bold">Termos da Degustação Gratuita (6 Meses):</span>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  Seu cadastro concede 180 dias de uso ilimitado sem custo algum. Você não paga taxa por lead nem porcentagem sobre os serviços. O cliente fecha e paga diretamente a você.
                </p>
              </div>
            </div>

            {/* Alternar para Cadastro de Cliente */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-600">
                Você é cliente e quer apenas <strong>solicitar e passar serviços</strong>?
              </span>
              {onSwitchToClient && (
                <button
                  type="button"
                  id="btn-switch-to-client-registration"
                  onClick={() => {
                    onClose();
                    onSwitchToClient();
                  }}
                  className="font-bold text-teal-700 hover:text-teal-800 underline cursor-pointer"
                >
                  Cadastrar como Cliente
                </button>
              )}
            </div>

            {/* Ações de Rodapé */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Criando seu perfil...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Concluir Cadastro Gratuito</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
