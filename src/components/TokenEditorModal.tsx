import React, { useState } from 'react';
import { X, Save, ShieldAlert } from 'lucide-react';
import { MapToken } from '../types/rpg';

interface TokenEditorModalProps {
  token: Partial<MapToken>;
  onSave: (tokenData: MapToken) => void;
  onDelete?: (tokenId: string) => void;
  onClose: () => void;
}

export const TokenEditorModal: React.FC<TokenEditorModalProps> = ({
  token,
  onSave,
  onDelete,
  onClose
}) => {
  const [name, setName] = useState(token.name || '');
  const [type, setType] = useState<'party' | 'monster' | 'npc' | 'ally' | 'dabus'>(token.type || 'party');
  const [hp, setHp] = useState<number>(token.hp || 30);
  const [maxHp, setMaxHp] = useState<number>(token.maxHp || 30);
  const [label, setLabel] = useState(token.label || '');
  const [color, setColor] = useState(token.color || '#f59e0b');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: MapToken = {
      id: token.id || `token_${Date.now()}`,
      name: name.trim(),
      type,
      x: token.x ?? 50,
      y: token.y ?? 50,
      hp,
      maxHp,
      label: label.trim() || undefined,
      color
    };
    onSave(saved);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-sm overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-cinzel text-base font-bold text-amber-400">
            {token.id ? 'Editar Ficha do Token' : 'Novo Token no Mapa'}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Nome do Token</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Grupo de Aventureiros ou Dabus"
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Tipo de Token</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'party' | 'monster' | 'npc' | 'ally' | 'dabus')}
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
            >
              <option value="party">⚔️ Grupo de Jogadores (Party)</option>
              <option value="dabus">🌿 Dabus (Zelador de Sigil)</option>
              <option value="monster">🐉 Monstro / Chefe / Dama</option>
              <option value="npc">🧙 NPC Aliado / Neutro</option>
              <option value="ally">🛡️ Aliado / Mascote</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Pontos de Vida (HP)</label>
              <input
                type="number"
                value={hp}
                onChange={(e) => setHp(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">HP Máximo</label>
              <input
                type="number"
                value={maxHp}
                onChange={(e) => setMaxHp(Number(e.target.value))}
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Subtítulo / Descrição Rápida</label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="Ex: Nível 4 · 4 Heróis"
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Cor do Anel do Token</label>
            <div className="flex items-center gap-2">
              {['#f59e0b', '#ef4444', '#3b82f6', '#10b981', '#8b5cf6', '#ec4899'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                    color === c ? 'scale-125 border-white ring-2 ring-amber-400/50' : 'border-transparent'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-stone-800">
            {token.id && onDelete ? (
              <button
                type="button"
                onClick={() => onDelete(token.id!)}
                className="text-rose-400 hover:text-rose-300 text-xs font-semibold cursor-pointer"
              >
                Remover Token
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-xs flex items-center gap-1 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
