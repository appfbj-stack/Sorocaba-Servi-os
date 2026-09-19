import React, { useState } from 'react';
import { Star, X, CheckCircle2, MessageSquare } from 'lucide-react';
import { StorageService } from '../services/storage.ts';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetId: string;
  targetName: string;
  targetType: 'profissional' | 'empresa';
  serviceName: string;
  clientName: string;
  requestId?: string;
  onReviewSubmitted: () => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  targetId,
  targetName,
  targetType,
  serviceName,
  clientName,
  requestId,
  onReviewSubmitted
}) => {
  if (!isOpen) return null;

  const [nota, setNota] = useState(5);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comentario.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      StorageService.addReview({
        pedidoId: requestId,
        alvoId: targetId,
        alvoTipo: targetType,
        clienteNome: clientName,
        nota,
        comentario,
        servicoRealizado: serviceName
      });

      setIsSubmitting(false);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
        onReviewSubmitted();
      }, 1200);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base">Avaliar Atendimento</h3>
            <p className="text-xs text-slate-400 mt-0.5">{targetName}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-8 text-center space-y-2">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
            <h4 className="font-bold text-slate-900">Avaliação enviada com sucesso!</h4>
            <p className="text-xs text-slate-500">Obrigado por ajudar a comunidade de Sorocaba.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Star selector */}
            <div className="text-center space-y-2">
              <span className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                Como você avalia o serviço prestado?
              </span>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active = hoverNota ? star <= hoverNota : star <= nota;
                  return (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverNota(star)}
                      onMouseLeave={() => setHoverNota(0)}
                      onClick={() => setNota(star)}
                      className="p-1 cursor-pointer transition transform hover:scale-110"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          active ? 'text-amber-400 fill-amber-400' : 'text-slate-200'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
              <div className="text-xs font-bold text-slate-700">
                {nota === 5 && '⭐ Excelente! Altamente recomendado'}
                {nota === 4 && '⭐ Muito Bom! Bom atendimento'}
                {nota === 3 && '⭐ Regular / Atendeu o esperado'}
                {nota === 2 && '⭐ Ruim / Deixou a desejar'}
                {nota === 1 && '⭐ Péssimo'}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Deixe seu comentário ou relato
              </label>
              <textarea
                rows={3}
                required
                value={comentario}
                onChange={(e) => setComentario(e.target.value)}
                placeholder="Pontualidade, capricho, honestidade, preço justo..."
                className="w-full rounded-xl border border-slate-300 p-2.5 text-xs text-slate-900 focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !comentario.trim()}
              className="w-full py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold transition flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? 'Salvando...' : 'Publicar Avaliação'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
