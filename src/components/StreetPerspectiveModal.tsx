import React from 'react';
import { X, Eye, Compass, Sparkles } from 'lucide-react';

interface StreetPerspectiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

export const StreetPerspectiveModal: React.FC<StreetPerspectiveModalProps> = ({
  isOpen,
  onClose,
  imageUrl
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-200">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Eye className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-cinzel text-base font-bold text-amber-400">
                Perspectiva Planar: As Ruas e o Céu Invertido de Sigil
              </h3>
              <p className="text-[11px] text-stone-400">
                A Gaiola vista do chão: torres de lâminas, portais luminescentes e edifícios curvados sobre sua cabeça
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

        {/* Image viewport */}
        <div className="relative flex-1 bg-stone-950 overflow-hidden flex items-center justify-center p-2">
          <img
            src={imageUrl}
            alt="Visão de Rua de Sigil"
            className="max-w-full max-h-[70vh] object-contain rounded-lg border border-stone-800 shadow-2xl"
          />

          {/* Lore narrative banner */}
          <div className="absolute bottom-4 inset-x-6 bg-stone-950/85 backdrop-blur-md border border-stone-800/90 rounded-lg p-3 text-xs text-stone-300 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex-1 space-y-0.5">
              <span className="font-semibold text-amber-400 text-[11px] uppercase tracking-wider block">
                Física & Geometria da Cidade-Anel:
              </span>
              <p className="text-[11px] text-stone-300 leading-relaxed font-serif">
                Ao olhar para cima em Sigil, você não vê nuvens nem estrelas: você vê os telhados e chaminés do quarteirão oposto suspensos de cabeça para baixo através da névoa. Portais planares brilham em tons violeta e turquesa em cada vão de escada, enquanto os silenciosos Dabus flutuam com suas podas de metal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
