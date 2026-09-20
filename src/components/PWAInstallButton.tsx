import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall.ts';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';

export const PWAInstallButton: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);

  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setJustInstalled(true);
      setTimeout(() => setJustInstalled(false), 4000);
    }
  };

  if (justInstalled) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1.5 rounded-lg border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        <span>Aplicativo instalado com sucesso!</span>
      </div>
    );
  }

  if (isInstallable) {
    return (
      <button
        id="btn-pwa-install"
        onClick={handleInstall}
        className={compact
          ? "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs cursor-pointer"
          : "flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg bg-teal-600 text-white hover:bg-teal-700 transition shadow-xs cursor-pointer"
        }
        title="Instalar Kairos Serviços no seu celular ou computador"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Instalar App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          id="btn-pwa-install-ios"
          onClick={() => setShowIOSGuide(true)}
          className={compact
            ? "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 transition cursor-pointer"
            : "flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 transition cursor-pointer"
          }
        >
          <Smartphone className="w-3.5 h-3.5 text-teal-600" />
          <span>Instalar no iPhone</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">Instalar no iPhone / iPad</h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 space-y-2 mb-5">
                Para ter o <strong>Kairos Serviços</strong> como aplicativo nativo:
                <br /><br />
                1. Toque no botão <strong>Compartilhar</strong> (ícone com seta para cima) na barra do Safari.<br />
                2. Role para baixo e selecione <strong>Adicionar à Tela de Início</strong>.<br />
                3. Toque em <strong>Adicionar</strong> no canto superior direito.
              </p>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition"
              >
                Entendi
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  const [showGenericGuide, setShowGenericGuide] = useState(false);

  return (
    <>
      <button
        id="btn-pwa-install-fallback"
        onClick={() => setShowGenericGuide(true)}
        className={compact
          ? "flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 transition cursor-pointer"
          : "flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50 text-teal-800 hover:bg-teal-100 transition cursor-pointer"
        }
        title="Instalar Kairos Serviços no seu celular ou computador"
      >
        <Smartphone className="w-3.5 h-3.5 text-teal-600" />
        <span>Instalar Aplicativo</span>
      </button>

      {showGenericGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-teal-100 text-teal-700">
                  <Download className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Instalar Aplicativo</h3>
              </div>
              <button
                onClick={() => setShowGenericGuide(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-xs sm:text-sm text-slate-600 space-y-3 mb-5 leading-relaxed">
              <p>
                O <strong>Kairos Serviços</strong> é um Progressive Web App (PWA) e pode ser instalado diretamente no seu celular ou computador sem ocupar espaço da loja:
              </p>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1.5">
                <p><strong>• No Chrome / Edge (Desktop/Android):</strong> Clique no ícone de instalação <Download className="w-3.5 h-3.5 inline text-teal-600" /> na barra de endereços ou no menu (três pontos) &gt; <em>"Instalar aplicativo"</em>.</p>
                <p><strong>• No Safari (iPhone/iPad):</strong> Toque em <em>Compartilhar</em> e selecione <em>"Adicionar à Tela de Início"</em>.</p>
              </div>
            </div>
            <button
              onClick={() => setShowGenericGuide(false)}
              className="w-full rounded-xl bg-teal-600 py-2.5 text-sm font-semibold text-white hover:bg-teal-700 transition cursor-pointer"
            >
              Fechar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
