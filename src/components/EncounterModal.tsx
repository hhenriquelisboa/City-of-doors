import React, { useState } from 'react';
import { X, Flame, Dices, RefreshCw, Compass } from 'lucide-react';
import { RANDOM_ENCOUNTERS } from '../data/defaultPresets';
import { sound } from '../utils/audio';

interface EncounterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EncounterModal: React.FC<EncounterModalProps> = ({ isOpen, onClose }) => {
  const [biome, setBiome] = useState<'forest' | 'mountain' | 'swamp' | 'desert' | 'dungeon'>('forest');
  const [currentEncounter, setCurrentEncounter] = useState<string | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  if (!isOpen) return null;

  const biomes = [
    { key: 'forest' as const, label: 'Floresta Ancestral', icon: '🌲' },
    { key: 'mountain' as const, label: 'Picos & Montanhas', icon: '🏔️' },
    { key: 'swamp' as const, label: 'Pântano Sombrio', icon: '🐊' },
    { key: 'desert' as const, label: 'Deserto das Dunas', icon: '🏜️' },
    { key: 'dungeon' as const, label: 'Masmorra / Ruínas', icon: '🗝️' }
  ];

  const rollEncounter = (targetBiome = biome) => {
    setIsRolling(true);
    sound.playDiceRoll(false, false);

    setTimeout(() => {
      const list = RANDOM_ENCOUNTERS[targetBiome] || RANDOM_ENCOUNTERS.forest;
      const pick = list[Math.floor(Math.random() * list.length)];
      setCurrentEncounter(pick);
      setIsRolling(false);
    }, 220);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
              <Flame className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">
              Gerador de Encontros Aleatórios
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
        <div className="p-4 space-y-4 text-xs">
          {/* Biome Selector */}
          <div>
            <label className="block text-stone-400 font-semibold mb-1.5 uppercase tracking-wider text-[10px]">
              Selecione o Bioma / Região da Viagem
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
              {biomes.map((b) => (
                <button
                  key={b.key}
                  onClick={() => {
                    setBiome(b.key);
                    rollEncounter(b.key);
                  }}
                  className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                    biome === b.key
                      ? 'bg-amber-950/40 border-amber-500/60 text-amber-300'
                      : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200 hover:border-stone-700'
                  }`}
                >
                  <span>{b.icon}</span>
                  <span className="truncate">{b.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Encounter Roll Card */}
          <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 text-center min-h-[140px] flex flex-col items-center justify-center gap-2">
            {currentEncounter ? (
              <>
                <span className="text-[10px] text-amber-500 font-semibold uppercase tracking-wider">
                  Encontro Sorteado no Terreno
                </span>
                <p
                  className={`text-sm md:text-base font-serif text-stone-100 leading-relaxed max-w-md transition-opacity ${
                    isRolling ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  "{currentEncounter}"
                </p>
              </>
            ) : (
              <div className="text-stone-500 flex flex-col items-center gap-1.5">
                <Compass className="w-6 h-6 opacity-40" />
                <span>Clique no botão abaixo para sortear um perigo ou evento no caminho dos aventureiros.</span>
              </div>
            )}
          </div>

          {/* Roll Button */}
          <button
            onClick={() => rollEncounter()}
            disabled={isRolling}
            className="w-full py-2.5 px-4 rounded-lg bg-amber-400 hover:bg-amber-300 active:bg-amber-500 text-stone-950 font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer shadow"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>Rolar Novo Encontro ({biomes.find((b) => b.key === biome)?.label})</span>
          </button>
        </div>
      </div>
    </div>
  );
};
