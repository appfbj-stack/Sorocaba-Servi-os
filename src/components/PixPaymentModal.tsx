import React, { useState, useEffect } from 'react';
import {
  X,
  QrCode,
  Copy,
  Check,
  Zap,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  Clock,
  HelpCircle,
  AlertCircle
} from 'lucide-react';
import { Professional } from '../types.ts';
import { generatePixPayload, generatePixQRCodeDataURL, DEFAULT_PIX_CONFIG } from '../utils/pix.ts';
import { StorageService } from '../services/storage.ts';

interface PixPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  professional: Professional;
  onSuccess: (updatedPro: Professional) => void;
  pendingRequestIdToUnlock?: string;
}

export const PixPaymentModal: React.FC<PixPaymentModalProps> = ({
  isOpen,
  onClose,
  professional,
  onSuccess,
  pendingRequestIdToUnlock
}) => {
  if (!isOpen) return null;

  const [copiedKey, setCopiedKey] = useState(false);
  const [copiedPayload, setCopiedPayload] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [pixPayload, setPixPayload] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [successPaid, setSuccessPaid] = useState(false);

  const valor = 9.99;
  const oportunidades = 10;
  const cpfChave = DEFAULT_PIX_CONFIG.chavePix; // 02598018796
  const cpfFormatado = '025.980.187-96';

  useEffect(() => {
    const payload = generatePixPayload({
      chavePix: cpfChave,
      nomeRecebedor: 'FERNANDO BORGES',
      cidade: 'SOROCABA',
      valor: valor,
      txid: `OP10${Date.now().toString().slice(-4)}`
    });
    setPixPayload(payload);

    generatePixQRCodeDataURL(payload).then((url) => {
      setQrCodeUrl(url);
    });
  }, [cpfChave, valor]);

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

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    setTimeout(() => {
      const updated = StorageService.addProfessionalCredits(
        professional.id,
        oportunidades,
        valor,
        cpfChave
      );

      // If there was a pending request to unlock, unlock it right away
      let finalPro = updated;
      if (pendingRequestIdToUnlock) {
        finalPro = StorageService.unlockServiceRequestForPro(updated.id, pendingRequestIdToUnlock);
      }

      setIsVerifying(false);
      setSuccessPaid(true);

      setTimeout(() => {
        onSuccess(finalPro);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 via-teal-900 to-slate-950 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-400/20 text-amber-300 border border-amber-300/30 flex items-center justify-center">
              <Zap className="w-5 h-5 fill-amber-400 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Liberação de Oportunidades PIX</h2>
              <p className="text-xs text-teal-200">
                Pague direto na sua tela e desbloqueie contatos de clientes
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {successPaid ? (
            <div className="text-center py-8 space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">
                Pagamento Confirmado com Sucesso!
              </h3>
              <p className="text-sm text-slate-600 max-w-xs mx-auto">
                <span className="font-bold text-emerald-700">10 oportunidades de serviço</span> foram creditadas imediatamente na sua conta.
              </p>
              <div className="inline-flex items-center gap-1.5 text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>Atualizando seu painel...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Value & Package Highlight Box */}
              <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-2xl p-4 border border-teal-200/80 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-extrabold text-teal-800 uppercase tracking-wider block">
                    Pacote Profissional Selecionado
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl font-black text-slate-900">
                      R$ 9,99
                    </span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      = 10 Oportunidades
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1">
                    Cada oportunidade libera o WhatsApp e contato direto de um cliente para fechar serviço.
                  </p>
                </div>
                <div className="text-right pl-3 border-l border-teal-200">
                  <span className="text-[10px] text-slate-500 block">Custo por cliente:</span>
                  <span className="text-sm font-bold text-slate-800">R$ 0,99</span>
                </div>
              </div>

              {/* QR Code section */}
              <div className="text-center bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Abra o aplicativo do seu banco e aponte a câmera:
                </span>

                <div className="inline-block p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code Pix R$ 9,99"
                      className="w-48 h-48 sm:w-56 sm:h-56 object-contain rounded-lg mx-auto"
                    />
                  ) : (
                    <div className="w-48 h-48 flex items-center justify-center text-slate-400">
                      <QrCode className="w-12 h-12 animate-pulse" />
                    </div>
                  )}
                </div>

                <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Liberação automática em segundos</span>
                </div>
              </div>

              {/* CPF Key and Copia e Cola */}
              <div className="space-y-2.5">
                {/* CPF Key */}
                <div className="bg-white rounded-xl border border-slate-200 p-3 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Chave PIX (CPF do Titular)
                    </span>
                    <span className="text-sm font-mono font-bold text-slate-900">
                      {cpfFormatado}
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      Favorecido: Fernando Borges
                    </span>
                  </div>
                  <button
                    onClick={handleCopyKey}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey ? 'Copiado!' : 'Copiar CPF'}</span>
                  </button>
                </div>

                {/* Pix Copia e Cola */}
                <div className="bg-white rounded-xl border border-slate-200 p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Pix Copia e Cola (Código Completo)
                    </span>
                    <button
                      onClick={handleCopyPayload}
                      className="text-xs font-bold text-teal-700 hover:text-teal-800 flex items-center gap-1 cursor-pointer"
                    >
                      {copiedPayload ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedPayload ? 'Código Copiado!' : 'Copiar Código'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    readOnly
                    value={pixPayload}
                    onClick={handleCopyPayload}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg text-[11px] font-mono p-2 text-slate-600 truncate cursor-pointer focus:ring-1 focus:ring-teal-500"
                  />
                </div>
              </div>

              {/* Confirm / Release Button */}
              <div className="pt-2">
                <button
                  id="btn-confirm-pix-payment"
                  disabled={isVerifying}
                  onClick={handleConfirmPayment}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/25 cursor-pointer disabled:opacity-50"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      <span>Verificando e liberando créditos...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-5 h-5 text-amber-300" />
                      <span>Já Realizei o Pagamento • Liberar 10 Oportunidades</span>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-center text-slate-500 mt-2 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600 inline" />
                  <span>Sem comissão sobre serviços fechados. O valor total do trabalho fica 100% com você!</span>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
