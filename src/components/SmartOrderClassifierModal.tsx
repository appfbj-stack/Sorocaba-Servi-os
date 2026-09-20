import React, { useState } from 'react';
import {
  Sparkles,
  X,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { SmartClassificationResult } from '../types.ts';
import { StorageService } from '../services/storage.ts';

interface SmartOrderClassifierModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialQuery?: string;
  onProceedToRequest: (result: SmartClassificationResult, originalText: string) => void;
}

export const SmartOrderClassifierModal: React.FC<SmartOrderClassifierModalProps> = ({
  isOpen,
  onClose,
  initialQuery = '',
  onProceedToRequest
}) => {
  if (!isOpen) return null;

  const [text, setText] = useState(initialQuery || '');
  const [result, setResult] = useState<SmartClassificationResult | null>(
    initialQuery ? StorageService.classifyNaturalLanguageRequest(initialQuery) : null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      const res = StorageService.classifyNaturalLanguageRequest(text);
      setResult(res);
      setIsAnalyzing(false);
    }, 450);
  };

  const sampleQueries = [
    'Preciso de 2 ajudantes para descarregar caminhão de caixas amanhã',
    'Panfletagem de material para campanha eleitoral no Centro',
    'Pedreiro para construir muro de arrimo com bloco e reboco',
    'Instalação de box blindex e portas de alumínio sob medida',
    'Minha tomada está esquentando e com cheiro estranho',
    'Preciso de uma diarista para faxina pesada no apartamento',
    'Montador para montar um guarda-roupas de casal'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden my-6 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Assistente Inteligente</h2>
              <p className="text-xs text-teal-200">
                Escreva com suas próprias palavras o que está acontecendo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/10 text-slate-300 hover:text-white hover:bg-white/20 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Input Form */}
          <form onSubmit={handleAnalyze} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Descreva seu problema ou necessidade
              </label>
              <textarea
                id="ai-classifier-input"
                rows={3}
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Ex: Minha tomada tá esquentando e o chuveiro parou de funcionar... ou Preciso de um pintor para pintar 2 quartos..."
                className="w-full rounded-2xl border border-slate-300 p-3 text-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-slate-900"
              />
            </div>

            <div className="flex items-center justify-between gap-2">
              <button
                type="submit"
                disabled={isAnalyzing || !text.trim()}
                className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-sm shadow-teal-600/20 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isAnalyzing ? 'Classificando serviço...' : 'Analisar e Sugerir Especialista'}</span>
              </button>
            </div>
          </form>

          {/* Quick chip examples */}
          {!result && (
            <div>
              <span className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Exemplos de situações reais:
              </span>
              <div className="space-y-1.5">
                {sampleQueries.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setText(sample);
                      setResult(StorageService.classifyNaturalLanguageRequest(sample));
                    }}
                    className="w-full text-left text-xs p-2 rounded-lg bg-slate-50 hover:bg-teal-50 hover:text-teal-800 text-slate-600 transition border border-slate-100 cursor-pointer"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Result Card */}
          {result && (
            <div className="p-4 rounded-2xl bg-teal-50/70 border border-teal-200 space-y-3.5 animate-in fade-in duration-200">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold text-teal-700 uppercase tracking-wider bg-teal-100 px-2 py-0.5 rounded-md">
                    Classificação Automática
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 mt-1">
                    {result.servicoSugerido}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">
                    Categoria recomendada: <strong>{result.categoriaNome}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      result.urgencia === 'urgente'
                        ? 'bg-rose-100 text-rose-700 border-rose-300'
                        : result.urgencia === 'alta'
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-emerald-100 text-emerald-700 border-emerald-300'
                    }`}
                  >
                    <Clock className="w-3 h-3" />
                    <span>Urgência {result.urgencia.toUpperCase()}</span>
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    Precisão estimada: {(result.confianca * 100).toFixed(0)}%
                  </div>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/80 border border-teal-100 text-xs text-slate-600 leading-relaxed">
                <strong>Diagnóstico:</strong> {result.motivo}
              </div>

              {/* Recommended follow-up questions */}
              {result.perguntasComplementares && result.perguntasComplementares.length > 0 && (
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-slate-700 mb-1.5">
                    <HelpCircle className="w-3.5 h-3.5 text-teal-600" />
                    <span>Perguntas que o profissional fará para você:</span>
                  </div>
                  <ul className="space-y-1">
                    {result.perguntasComplementares.map((p, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-1.5">
                        <span className="text-teal-600 font-bold">•</span>
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action Button to Open Request Modal */}
              <button
                id="btn-proceed-from-ai"
                onClick={() => {
                  onProceedToRequest(result, text);
                  onClose();
                }}
                className="w-full py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-sm transition flex items-center justify-center gap-2 shadow-md shadow-teal-600/20 cursor-pointer"
              >
                <span>Preencher Pedido com estes Dados</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
