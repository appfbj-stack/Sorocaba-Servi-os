import React, { useState, useEffect } from 'react';
import {
  X,
  Store,
  MapPin,
  Phone,
  MessageCircle,
  Clock,
  CheckCircle,
  Sparkles,
  QrCode,
  Copy,
  Check,
  ShieldCheck,
  HelpCircle,
  Camera,
  Layers,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';
import { Business, ServiceCategory, City } from '../types.ts';
import { StorageService } from '../services/storage.ts';
import { generatePixPayload, generatePixQRCodeDataURL, DEFAULT_PIX_CONFIG } from '../utils/pix.ts';

interface BusinessRegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: ServiceCategory[];
  selectedCity: City;
  onSuccess: (newBusiness: Business) => void;
}

export const BusinessRegisterModal: React.FC<BusinessRegisterModalProps> = ({
  isOpen,
  onClose,
  categories,
  selectedCity,
  onSuccess
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'payment' | 'done'>('form');

  // Form states
  const [nome, setNome] = useState('');
  const [categoriaId, setCategoriaId] = useState(categories[0]?.id || 'cat-comercio');
  const [bairro, setBairro] = useState(selectedCity.bairros[0] || 'Campolim');
  const [endereco, setEndereco] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [telefone, setTelefone] = useState('');
  const [horarioAtendimento, setHorarioAtendimento] = useState('Segunda a Sexta: 08h às 18h | Sábado: 08h às 13h');
  const [descricao, setDescricao] = useState('');
  const [servicosStr, setServicosStr] = useState('');
  const [fotoUrl, setFotoUrl] = useState('');
  const [planoTaxa, setPlanoTaxa] = useState<'comercial' | 'carrossel'>('carrossel');

  // PIX states
  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [registeredBusiness, setRegisteredBusiness] = useState<Business | null>(null);

  const valorTaxa = planoTaxa === 'carrossel' ? 49.90 : 29.90;
  const cpfChave = DEFAULT_PIX_CONFIG.chavePix;

  // Sample quick photo presets for ease of registration
  const samplePhotos = [
    { label: 'Loja Geral', url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80' },
    { label: 'Materiais/Obras', url: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80' },
    { label: 'Alimentação', url: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&auto=format&fit=crop&q=80' },
    { label: 'Autopeças/Oficina', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=80' },
    { label: 'Pet Shop', url: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80' }
  ];

  // Update PIX payload when switching to payment step or changing plan
  useEffect(() => {
    if (step === 'payment') {
      const payload = generatePixPayload({
        chavePix: cpfChave,
        nomeRecebedor: 'FERNANDO BORGES',
        cidade: 'SOROCABA',
        valor: valorTaxa,
        txid: `BIZ${Date.now().toString().slice(-6)}`
      });
      setPixPayload(payload);

      generatePixQRCodeDataURL(payload).then((url) => {
        setQrCodeUrl(url);
      });
    }
  }, [step, valorTaxa, cpfChave]);

  const handleCopyKey = () => {
    navigator.clipboard.writeText(cpfChave);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(pixPayload);
    setCopiedPayload(true);
    setTimeout(() => setCopiedPayload(false), 2000);
  };

  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) {
      alert('Por favor, informe o nome da sua empresa ou comércio.');
      return;
    }
    if (!whatsapp.trim()) {
      alert('Por favor, informe o WhatsApp comercial para os clientes entrarem em contato.');
      return;
    }
    setStep('payment');
  };

  const handleConfirmPixPayment = () => {
    setIsProcessingPayment(true);

    setTimeout(() => {
      const parsedServices = servicosStr
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const newBiz = StorageService.registerBusiness({
        nome: nome.trim(),
        categoriaId,
        cidadeId: selectedCity.id,
        bairro,
        endereco: endereco.trim() || `Bairro ${bairro}, Sorocaba - SP`,
        telefone: telefone.trim() || whatsapp.trim(),
        whatsapp: whatsapp.replace(/\D/g, ''),
        descricao: descricao.trim() || `Comércio tradicional no bairro ${bairro}, com atendimento ágil e especializado.`,
        horarioAtendimento,
        servicosOuProdutos: parsedServices.length > 0 ? parsedServices : ['Atendimento no Balcão', 'Entrega a Domicílio', 'Orçamento via WhatsApp'],
        fotos: fotoUrl ? [fotoUrl] : ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&auto=format&fit=crop&q=80'],
        patrocinada: planoTaxa === 'carrossel',
        anuncioAtivo: true,
        status: 'ATIVO'
      });

      setRegisteredBusiness(newBiz);
      setIsProcessingPayment(false);
      setStep('done');
      onSuccess(newBiz);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/30 text-amber-200 text-xs font-bold mb-2 border border-amber-400/30">
            <Store className="w-3.5 h-3.5" />
            <span>Divulgação Comercial de Sorocaba</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            Anuncie sua Empresa ou Loja em Sorocaba
          </h2>
          <p className="text-xs sm:text-sm text-amber-100/90 mt-1 max-w-lg">
            Apareça para milhares de moradores que buscam produtos e serviços perto de casa com contato direto no seu WhatsApp!
          </p>

          {/* Stepper indicators */}
          <div className="flex items-center gap-2 mt-4 text-xs font-bold">
            <span className={`px-2.5 py-1 rounded-lg ${step === 'form' ? 'bg-white text-amber-800' : 'bg-white/20 text-white'}`}>
              1. Dados do Comércio
            </span>
            <span className="text-white/40">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${step === 'payment' ? 'bg-white text-amber-800' : 'bg-white/20 text-white'}`}>
              2. Taxa de Anúncio PIX
            </span>
            <span className="text-white/40">→</span>
            <span className={`px-2.5 py-1 rounded-lg ${step === 'done' ? 'bg-white text-emerald-800' : 'bg-white/20 text-white'}`}>
              3. Publicação Ativa
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6">
          {step === 'form' && (
            <form onSubmit={handleProceedToPayment} className="space-y-5">
              {/* Plan Choice with pricing */}
              <div>
                <label className="block text-xs font-black text-slate-800 uppercase tracking-wider mb-2">
                  Escolha o Plano de Divulgação (Taxa Mensal PIX)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Plano Carrossel Destaque */}
                  <div
                    onClick={() => setPlanoTaxa('carrossel')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      planoTaxa === 'carrossel'
                        ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div className="absolute -top-2.5 right-3 bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wide">
                      Mais Escolhido
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 text-amber-800 font-extrabold text-sm mb-1">
                        <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                        <span>Plano Destaque Carrossel</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mb-2">
                        R$ 49,90 <span className="text-xs font-normal text-slate-500">/mês</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span><strong>Presença no Carrossel Superior</strong> (Home e Empresas)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Selo Dourado de Destaque Patrocinado</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Prioridade no filtro do seu bairro</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Botão direto para o seu WhatsApp</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3 pt-2 border-t border-amber-200/60 text-[11px] font-bold text-amber-700">
                      {planoTaxa === 'carrossel' ? '✓ Plano Selecionado' : 'Clique para selecionar'}
                    </div>
                  </div>

                  {/* Plano Comercial Local */}
                  <div
                    onClick={() => setPlanoTaxa('comercial')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      planoTaxa === 'comercial'
                        ? 'border-amber-500 bg-amber-50/60 shadow-sm'
                        : 'border-slate-200 hover:border-amber-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-1.5 text-slate-800 font-extrabold text-sm mb-1">
                        <Store className="w-4 h-4 text-teal-600" />
                        <span>Plano Comercial Local</span>
                      </div>
                      <div className="text-2xl font-black text-slate-900 mb-2">
                        R$ 29,90 <span className="text-xs font-normal text-slate-500">/mês</span>
                      </div>
                      <ul className="text-xs text-slate-600 space-y-1.5">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Listagem no Guia de Comércios de Sorocaba</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Filtro por bairro (ache perto de casa)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Botão WhatsApp e Rota no Google Maps</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Painel com métricas de cliques</span>
                        </li>
                      </ul>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200 text-[11px] font-bold text-slate-600">
                      {planoTaxa === 'comercial' ? '✓ Plano Selecionado' : 'Clique para selecionar'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Basic Info */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5">
                  <Store className="w-4 h-4 text-amber-600" />
                  <span>Informações da sua Loja ou Empresa</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Nome */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Nome Comercial / Nome Fantasia *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Padaria Central, Depósito Silva, Ótica Visão..."
                      value={nome}
                      onChange={(e) => setNome(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 font-medium"
                    />
                  </div>

                  {/* Categoria */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Segmento / Categoria *
                    </label>
                    <select
                      value={categoriaId}
                      onChange={(e) => setCategoriaId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500"
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bairro em Sorocaba */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Bairro em Sorocaba * (Filtro do Cliente)
                    </label>
                    <select
                      value={bairro}
                      onChange={(e) => setBairro(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white focus:ring-2 focus:ring-amber-500 font-semibold text-amber-900"
                    >
                      {selectedCity.bairros.map((b, i) => (
                        <option key={i} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Endereço completo */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Endereço Completo (Rua, Número, Referência)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Av. Antônio Carlos Comitre, 850 - Campolim, Sorocaba"
                      value={endereco}
                      onChange={(e) => setEndereco(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* WhatsApp Comercial */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      WhatsApp Comercial (Receba Pedidos) *
                    </label>
                    <div className="relative">
                      <MessageCircle className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                      <input
                        type="tel"
                        required
                        placeholder="(15) 99123-4567"
                        value={whatsapp}
                        onChange={(e) => setWhatsapp(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 font-medium"
                      />
                    </div>
                  </div>

                  {/* Telefone Fixo */}
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Telefone Fixo / Adicional
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        placeholder="(15) 3224-0000"
                        value={telefone}
                        onChange={(e) => setTelefone(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Horário de Atendimento */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Horário de Funcionamento
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        placeholder="Ex: Seg a Sex: 08h às 18h | Sáb: 08h às 13h"
                        value={horarioAtendimento}
                        onChange={(e) => setHorarioAtendimento(e.target.value)}
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Breve Descrição & Diferenciais do seu Negócio
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Ex: Trabalhamos com produtos originais, pronta entrega para Sorocaba e região, aceitamos cartões e PIX..."
                      value={descricao}
                      onChange={(e) => setDescricao(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500 resize-none"
                    />
                  </div>

                  {/* Produtos / Serviços */}
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Principais Produtos ou Serviços (separe por vírgula)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Cimento Votoran, Areia Lavada, Pedra Britada, Entregas Rápidas"
                      value={servicosStr}
                      onChange={(e) => setServicosStr(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Foto da fachada */}
                  <div className="sm:col-span-2 space-y-2">
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Foto da Loja / Fachada / Vitrine (URL ou escolha um modelo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://sua-empresa.com.br/foto-fachada.jpg"
                      value={fotoUrl}
                      onChange={(e) => setFotoUrl(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-amber-500"
                    />
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700 shrink-0">Modelos rápidos:</span>
                      {samplePhotos.map((s, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setFotoUrl(s.url)}
                          className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 font-medium transition shrink-0 cursor-pointer"
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-sm font-semibold hover:bg-slate-50 cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
                >
                  <span>Continuar para Pagamento da Taxa (R$ {valorTaxa.toFixed(2).replace('.', ',')})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200/80 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <div className="p-2 bg-amber-500 text-white rounded-xl shrink-0">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-amber-900 text-sm">
                    Taxa de Divulgação Comercial: R$ {valorTaxa.toFixed(2).replace('.', ',')}
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-0.5">
                    Seu anúncio para a empresa <strong>{nome}</strong> no bairro <strong>{bairro}</strong> será ativado imediatamente após o pagamento via PIX.
                  </p>
                </div>
              </div>

              {/* QR Code and PIX keys */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                {qrCodeUrl ? (
                  <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-3">
                    <img
                      src={qrCodeUrl}
                      alt="QR Code PIX para Taxa Comercial"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-48 h-48 bg-slate-200 animate-pulse rounded-2xl mb-3 flex items-center justify-center text-xs text-slate-500">
                    Gerando QR Code...
                  </div>
                )}

                <div className="w-full max-w-md space-y-3">
                  {/* Chave PIX (CPF) */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Chave PIX (CPF):
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value="025.980.187-96"
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono font-bold text-slate-800"
                      />
                      <button
                        type="button"
                        onClick={handleCopyKey}
                        className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Copia e Cola EMV */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 mb-1">
                      Código PIX Copia e Cola:
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={pixPayload}
                        className="flex-1 px-3 py-2 rounded-xl bg-white border border-slate-300 text-xs font-mono text-slate-600 truncate"
                      />
                      <button
                        type="button"
                        onClick={handleCopyPayload}
                        className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                      >
                        {copiedPayload ? <Check className="w-3.5 h-3.5 text-white" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedPayload ? 'Copiado!' : 'Copiar'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 text-center mt-3 max-w-sm">
                  Favorecido: <strong>FERNANDO BORGES</strong> • Sorocaba/SP
                  <br />
                  A aprovação é instantânea ao confirmar abaixo.
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-50 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Voltar aos dados</span>
                </button>

                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handleConfirmPixPayment}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-extrabold text-sm shadow-md transition cursor-pointer"
                >
                  {isProcessingPayment ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Validando pagamento PIX...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      <span>Já Paguei via PIX (Ativar Anúncio Agora)</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 'done' && registeredBusiness && (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle className="w-9 h-9" />
              </div>

              <h3 className="text-xl font-black text-slate-900">
                Parabéns! Sua Empresa está Ativa no Portal!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto">
                <strong>{registeredBusiness.nome}</strong> já está visível para os moradores de <strong>{registeredBusiness.bairro}</strong> e toda Sorocaba com botão direto para o seu WhatsApp!
              </p>

              {registeredBusiness.patrocinada && (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black border border-amber-300">
                  <Sparkles className="w-4 h-4 text-amber-500 fill-amber-400" />
                  <span>Sua loja já foi inserida no Carrossel de Destaques!</span>
                </div>
              )}

              <div className="pt-4">
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-extrabold shadow-sm transition cursor-pointer"
                >
                  Fechar e Ver Guia de Lojas
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
