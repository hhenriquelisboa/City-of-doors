import React, { useState } from 'react';
import { X, DoorOpen, Key, BookOpen, AlertTriangle, Sparkles, MapPin } from 'lucide-react';
import { PLANAR_PORTALS_GUIDE, CANT_DICTIONARY } from '../data/defaultPresets';

interface PortalGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPortalLocation?: (locationName: string) => void;
}

export const PortalGuideModal: React.FC<PortalGuideModalProps> = ({
  isOpen,
  onClose,
  onSelectPortalLocation
}) => {
  const [tab, setTab] = useState<'portals' | 'cant'>('portals');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <DoorOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-400">
                Guia Planar de Sigil: Portais, Chaves & Gírias
              </h3>
              <p className="text-[11px] text-stone-400">
                Manual de sobrevivência na Cidade das Portas (A Gaiola)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex items-center px-4 pt-2 bg-stone-950/40 border-b border-stone-800 text-xs">
          <button
            onClick={() => setTab('portals')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'portals'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>Portais & Chaves Conhecidas</span>
          </button>
          <button
            onClick={() => setTab('cant')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
              tab === 'cant'
                ? 'border-amber-500 text-amber-400 font-semibold'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Dicionário do Cant Planar (Gírias)</span>
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          {tab === 'portals' && (
            <div className="space-y-3">
              <p className="text-stone-400 text-[11px] leading-relaxed">
                Em Sigil, literalmente qualquer arco de pedra, porta de taberna, bueiro ou janela pode ser um portal planar.
                Para ativá-lo, é obrigatório possuir a <strong>Chave do Portal</strong> correspondente (uma ação, objeto, frase ou sentimento).
              </p>

              <div className="grid grid-cols-1 gap-2.5">
                {PLANAR_PORTALS_GUIDE.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-stone-950/70 border border-stone-800 hover:border-purple-500/50 transition-colors space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-cinzel text-xs font-bold text-amber-300">
                          {p.name}
                        </span>
                        <span className="text-[10px] text-stone-500">→</span>
                        <span className="text-xs font-semibold text-purple-300">
                          {p.destination}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                          p.danger === 'Letal'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : p.danger === 'Alto'
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        }`}
                      >
                        Perigo: {p.danger}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-stone-400">
                      <div>
                        <span className="text-stone-500 block">Localização em Sigil:</span>
                        <span className="text-stone-200">{p.location}</span>
                      </div>
                      <div>
                        <span className="text-amber-500 font-semibold block flex items-center gap-1">
                          <Key className="w-3 h-3 text-amber-400" />
                          Chave Requerida:
                        </span>
                        <span className="text-amber-200/90 italic">{p.key}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'cant' && (
            <div className="space-y-3">
              <p className="text-stone-400 text-[11px] leading-relaxed">
                O "Cant Planar" é o dialeto falado pelos nativos de Sigil, mercenários e andarilhos dos planos. Conhecer estas expressões evita que você seja passado para trás como um simples "Primevo".
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {CANT_DICTIONARY.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-lg bg-stone-950/70 border border-stone-800 space-y-1"
                  >
                    <span className="font-cinzel text-xs font-bold text-amber-400 block">
                      {item.term}
                    </span>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      {item.meaning}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
