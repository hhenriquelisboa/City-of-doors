import React, { useState } from 'react';
import { X, Share2, Copy, Check, Download, Globe, HardDrive, Shield } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadHtml: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  onDownloadHtml
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Share2 className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">
              Como Compartilhar o Mapa de Sigil
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Method 1: Web Link */}
          <div className="p-3.5 rounded-lg bg-stone-950/80 border border-stone-800 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs">
              <Globe className="w-4 h-4 text-amber-400" />
              <span>Opção 1: Link Direto da Web (Nuvem)</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Envie este link para seus jogadores no Discord, WhatsApp ou grupo de RPG. Eles podem abrir em qualquer computador, tablet ou celular:
            </p>

            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 font-mono text-[11px] select-all focus:outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copiado!' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          {/* Method 2: Offline Standalone HTML File */}
          <div className="p-3.5 rounded-lg bg-stone-950/80 border border-stone-800 space-y-2.5">
            <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs">
              <HardDrive className="w-4 h-4 text-purple-400" />
              <span>Opção 2: Baixar Arquivo HTML Único (Offline)</span>
            </div>
            <p className="text-stone-300 leading-relaxed text-[11px]">
              Gera um arquivo <code>.html</code> independente e completo com o mapa de Sigil, pontos de interesse, rolador de dados e névoa de guerra. Você pode enviar o arquivo por e-mail ou pendrive e ele funciona <strong>sem internet</strong>:
            </p>

            <button
              onClick={() => {
                onDownloadHtml();
                onClose();
              }}
              className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded flex items-center justify-center gap-2 transition-colors cursor-pointer text-xs shadow"
            >
              <Download className="w-4 h-4" />
              <span>Baixar Arquivo HTML Autônomo</span>
            </button>
          </div>

          {/* GM Advice Note */}
          <div className="p-3 rounded-lg bg-amber-950/20 border border-amber-800/40 text-[11px] text-amber-200/90 leading-relaxed flex items-start gap-2.5">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-amber-300 block mb-0.5">Dica para a Sessão de RPG:</span>
              Como Mestre, use o <strong>Modo Mestre (GM)</strong> para visualizar notas secretas e gerenciar a névoa. Seus jogadores podem alternar para o <strong>Modo Jogador</strong> para explorar a cidade sem ver segredos ou áreas ocultas.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
