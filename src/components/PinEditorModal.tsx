import React, { useState } from 'react';
import { X, Save } from 'lucide-react';
import { MapPin, PinCategory } from '../types/rpg';

interface PinEditorModalProps {
  pin: Partial<MapPin>;
  isNew: boolean;
  onSave: (pinData: MapPin) => void;
  onClose: () => void;
}

export const PinEditorModal: React.FC<PinEditorModalProps> = ({
  pin,
  isNew,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(pin.name || '');
  const [category, setCategory] = useState<PinCategory>(pin.category || 'city');
  const [shortSummary, setShortSummary] = useState(pin.shortSummary || '');
  const [lore, setLore] = useState(pin.lore || '');
  const [dangerLevel, setDangerLevel] = useState<1 | 2 | 3 | 4 | 5>(pin.dangerLevel || 2);
  const [rulerOrFaction, setRulerOrFaction] = useState(pin.rulerOrFaction || '');
  const [secretGMNotes, setSecretGMNotes] = useState(pin.secretGMNotes || '');
  const [rumorsText, setRumorsText] = useState((pin.rumors || []).join('\n'));
  const [lootText, setLootText] = useState((pin.loot || []).join('\n'));
  const [isVisibleToPlayers, setIsVisibleToPlayers] = useState(
    pin.isVisibleToPlayers !== undefined ? pin.isVisibleToPlayers : true
  );
  const [color, setColor] = useState(pin.color || '#3b82f6');

  const categories: { key: PinCategory; label: string }[] = [
    { key: 'city', label: 'Cidade / Capital' },
    { key: 'castle', label: 'Castelo / Fortaleza' },
    { key: 'dungeon', label: 'Masmorra / Cripta' },
    { key: 'ruins', label: 'Ruínas Antigas' },
    { key: 'wonder', label: 'Maravilha Natural' },
    { key: 'danger', label: 'Perigo / Covil de Monstro' },
    { key: 'port', label: 'Porto / Arquipélago' },
    { key: 'shrine', label: 'Santuário / Templo' },
    { key: 'tavern', label: 'Taverna / Estalagem' },
    { key: 'camp', label: 'Acampamento' }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const rumors = rumorsText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const loot = lootText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const savedPin: MapPin = {
      id: pin.id || `pin_${Date.now()}`,
      name: name.trim(),
      category,
      x: pin.x ?? 50,
      y: pin.y ?? 50,
      shortSummary: shortSummary.trim() || 'Ponto de interesse marcado no mapa.',
      lore: lore.trim() || 'Nenhuma lenda registrada ainda.',
      dangerLevel,
      rulerOrFaction: rulerOrFaction.trim() || undefined,
      secretGMNotes: secretGMNotes.trim() || undefined,
      rumors,
      loot,
      isVisibleToPlayers,
      color
    };

    onSave(savedPin);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <h3 className="font-cinzel text-base font-bold text-amber-400">
            {isNew ? 'Adicionar Ponto de Interesse' : 'Editar Ponto de Interesse'}
          </h3>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Name & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Nome do Ponto *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Cidadela de Oakhaven"
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Categoria</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PinCategory)}
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {categories.map((c) => (
                  <option key={c.key} value={c.key}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Danger level & Color */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">
                Nível de Perigo (1 a 5)
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setDangerLevel(lvl as 1 | 2 | 3 | 4 | 5)}
                    className={`flex-1 py-1 rounded border text-xs font-bold transition-colors cursor-pointer ${
                      dangerLevel === lvl
                        ? 'bg-rose-950 border-rose-600 text-rose-300'
                        : 'bg-stone-950 border-stone-800 text-stone-400 hover:border-stone-700'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Cor do Marcador</label>
              <div className="flex items-center gap-2">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'].map((c) => (
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
          </div>

          {/* Ruler or Faction */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1">
              Governante / Facção Dominante
            </label>
            <input
              type="text"
              value={rulerOrFaction}
              onChange={(e) => setRulerOrFaction(e.target.value)}
              placeholder="Ex: Duque Kaelen · Ordem da Aurora"
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Short summary */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Resumo Curto</label>
            <input
              type="text"
              value={shortSummary}
              onChange={(e) => setShortSummary(e.target.value)}
              placeholder="Ex: Fortaleza ducal construída sobre rocha viva."
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Full Lore */}
          <div>
            <label className="block text-stone-300 font-semibold mb-1">História & Lore</label>
            <textarea
              rows={3}
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Histórico detalhado do local para o mestre narrar aos jogadores..."
              className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 leading-relaxed"
            />
          </div>

          {/* Rumors & Loot */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">
                Rumores (1 por linha)
              </label>
              <textarea
                rows={2}
                value={rumorsText}
                onChange={(e) => setRumorsText(e.target.value)}
                placeholder="Dizem que monstros habitam as catacumbas..."
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-stone-300 font-semibold mb-1">
                Loot & Tesouros (1 por linha)
              </label>
              <textarea
                rows={2}
                value={lootText}
                onChange={(e) => setLootText(e.target.value)}
                placeholder="Espada Bastarda +1&#10;200 Moedas de Ouro"
                className="w-full bg-stone-950 border border-stone-800 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* GM Secret Notes */}
          <div className="bg-rose-950/20 border border-rose-900/40 rounded-lg p-3">
            <label className="block text-rose-400 font-semibold mb-1">
              Notas Secretas do Mestre (Confidencial)
            </label>
            <textarea
              rows={2}
              value={secretGMNotes}
              onChange={(e) => setSecretGMNotes(e.target.value)}
              placeholder="Segredo oculto: O lorde foi substituído por um doppelgänger..."
              className="w-full bg-stone-950 border border-rose-900/60 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-rose-500 leading-relaxed"
            />
          </div>

          {/* Player visibility toggle */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="vis-toggle"
              checked={isVisibleToPlayers}
              onChange={(e) => setIsVisibleToPlayers(e.target.checked)}
              className="rounded bg-stone-950 border-stone-800 text-amber-500 focus:ring-0 cursor-pointer"
            />
            <label htmlFor="vis-toggle" className="text-stone-300 cursor-pointer">
              Visível no mapa dos Jogadores (Desmarque para criar ponto secreto de mestre)
            </label>
          </div>

          {/* Submit buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-stone-800">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Marcador</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
