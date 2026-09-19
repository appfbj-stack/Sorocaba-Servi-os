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
        title="Instalar Sorocaba Serviços no seu celular ou computador"
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
                Para ter o <strong>Sorocaba Serviços</strong> como aplicativo nativo:
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

  return (
    <button
      id="btn-pwa-install-fallback"
      onClick={() => alert("Para instalar no seu navegador ou celular, toque no menu de opções (três pontinhos) e clique em 'Instalar aplicativo' ou 'Adicionar à tela inicial'.")}
      className="hidden md:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
      title="Disponível como PWA instalável"
    >
      <Smartphone className="w-3.5 h-3.5 text-slate-500" />
      <span>App Instalável</span>
    </button>
  );
};
