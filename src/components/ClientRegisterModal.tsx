import React, { useState } from 'react';
import {
  X,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Briefcase,
  FileText
} from 'lucide-react';
import { City, User as UserType } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface ClientRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: City;
  onSuccess: (newUser: UserType, proceedToRequest: boolean) => void;
  onSwitchToProfessional?: () => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=80'
];

export const ClientRegisterModal: React.FC<ClientRegisterModalProps> = ({
  isOpen,
  onClose,
  selectedCity,
  onSuccess,
  onSwitchToProfessional
}) => {
  if (!isOpen) return null;

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [bairro, setBairro] = useState(selectedCity.bairros?.[0] || 'Campolim');
  const [customBairro, setCustomBairro] = useState('');
  const [isCustomBairro, setIsCustomBairro] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<UserType | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 11);
    if (digits.length <= 2) return digits;
    if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTelefone(formatPhone(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!nome.trim()) {
      setErrorMessage('Por favor, informe seu nome completo.');
      return;
    }

    const cleanDigits = telefone.replace(/\D/g, '');
    if (cleanDigits.length < 10) {
      setErrorMessage('Informe um número de WhatsApp válido com DDD (ex: 15 99999-8888).');
      return;
    }

    const finalBairro = isCustomBairro ? customBairro.trim() || 'Centro' : bairro;

    setIsSubmitting(true);

    try {
      const newUser = StorageService.registerClient({
        nome: nome.trim(),
        email: email.trim() || undefined,
        telefone: cleanDigits,
        bairro: finalBairro,
        cidadeId: selectedCity.id,
        avatarUrl: selectedAvatar
      });

      setCreatedUser(newUser);
    } catch (err) {
      console.error(err);
      setErrorMessage('Erro ao realizar cadastro. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="modal-client-register"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 px-6 py-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white leading-tight">
                Cadastro de Cliente
              </h2>
              <p className="text-xs text-teal-200">
                Para solicitar orçamentos e passar serviços em {selectedCity.nome}
              </p>
            </div>
          </div>
          <button
            id="btn-close-client-register-modal"
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {createdUser ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="space-y-2 max-w-md mx-auto">
              <h3 className="text-xl font-extrabold text-slate-900">
                Cadastro Realizado com Sucesso!
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Bem-vindo(a), <strong>{createdUser.nome}</strong>! Sua conta de cliente já está ativa em <strong>{selectedCity.nome} - {createdUser.bairro}</strong>. Agora você pode solicitar serviços e falar direto pelo WhatsApp com prestadores locais.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200/80 text-left text-xs space-y-2">
              <div className="font-bold text-teal-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-teal-600" />
                <span>Vantagens do seu perfil ativo:</span>
              </div>
              <ul className="space-y-1 text-slate-600 pl-5 list-disc">
                <li>Seus dados de contato ficam salvos para orçamentos rápidos em 1 clique</li>
                <li>Filtro de profissionais por proximidade do seu bairro ({createdUser.bairro})</li>
                <li>Histórico e status dos seus pedidos na aba <strong>Meus Pedidos</strong></li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                id="btn-client-success-new-request"
                onClick={() => onSuccess(createdUser, true)}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm shadow-md transition cursor-pointer flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4" />
                <span>Passar / Solicitar Serviço Agora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                id="btn-client-success-explore"
                onClick={() => onSuccess(createdUser, false)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-sm transition cursor-pointer"
              >
                Explorar Profissionais
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {/* Quick Benefits Pill */}
            <div className="p-3 rounded-2xl bg-teal-50 border border-teal-200 text-teal-900 text-xs flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-teal-600 shrink-0" />
              <span>
                <strong>100% Gratuito:</strong> Solicite quantos orçamentos quiser sem nenhuma comissão ou taxa de intermediação.
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {errorMessage}
              </div>
            )}

            {/* Avatar Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Escolha uma Foto de Perfil
              </label>
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {PRESET_AVATARS.map((url, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedAvatar(url)}
                    className={`relative rounded-full p-0.5 transition cursor-pointer shrink-0 ${
                      selectedAvatar === url
                        ? 'ring-3 ring-teal-600 scale-105'
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar ${idx + 1}`}
                      className="w-11 h-11 rounded-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Name & Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Nome Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="input-client-name"
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  WhatsApp / Celular *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    id="input-client-phone"
                    type="tel"
                    required
                    placeholder="(15) 99999-9999"
                    value={telefone}
                    onChange={handlePhoneChange}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
                <span className="text-[10px] text-slate-400">
                  Para os profissionais entrarem em contato
                </span>
              </div>
            </div>

            {/* Email (Optional) */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                E-mail (opcional)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  id="input-client-email"
                  type="email"
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>

            {/* City & Neighborhood */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Cidade
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    disabled
                    value={`${selectedCity.nome} - ${selectedCity.estado}`}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-600 text-sm cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seu Bairro em {selectedCity.nome} *
                </label>
                {!isCustomBairro ? (
                  <div className="space-y-1">
                    <select
                      id="select-client-neighborhood"
                      value={bairro}
                      onChange={(e) => {
                        if (e.target.value === '__custom__') {
                          setIsCustomBairro(true);
                        } else {
                          setBairro(e.target.value);
                        }
                      }}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                    >
                      {selectedCity.bairros.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                      <option value="__custom__">+ Outro Bairro não listado</option>
                    </select>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      id="input-client-custom-neighborhood"
                      type="text"
                      placeholder="Digite o nome do seu bairro"
                      value={customBairro}
                      onChange={(e) => setCustomBairro(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                    <button
                      type="button"
                      onClick={() => setIsCustomBairro(false)}
                      className="px-2 text-xs text-slate-500 hover:text-slate-800"
                    >
                      Voltar
                    </button>
                  </div>
                )}
                <span className="text-[10px] text-slate-400">
                  Usado para ordenar prestadores por proximidade
                </span>
              </div>
            </div>

            {/* Switch to Professional Link */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-slate-600">
                <Briefcase className="w-4 h-4 text-amber-600" />
                <span>Você é profissional autônomo e quer prestar serviços?</span>
              </div>
              {onSwitchToProfessional && (
                <button
                  type="button"
                  id="btn-switch-to-pro-registration"
                  onClick={() => {
                    onClose();
                    onSwitchToProfessional();
                  }}
                  className="font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                >
                  Cadastrar Prestador
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                id="btn-cancel-client-register"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:text-slate-900 text-sm font-semibold transition cursor-pointer"
              >
                Cancelar
              </button>

              <button
                id="btn-submit-client-register"
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold shadow-md shadow-teal-600/20 transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Cadastrando...</span>
                ) : (
                  <>
                    <span>Concluir Cadastro de Cliente</span>
                    <ArrowRight className="w-4 h-4" />
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
