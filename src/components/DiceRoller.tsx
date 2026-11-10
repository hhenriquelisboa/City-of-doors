import React, { useState } from 'react';
import { X, Dices, RotateCcw, Sparkles, AlertTriangle } from 'lucide-react';
import { DiceRoll } from '../types/rpg';
import { sound } from '../utils/audio';

interface DiceRollerProps {
  rolls: DiceRoll[];
  onAddRoll: (roll: DiceRoll) => void;
  onClearRolls: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export const DiceRoller: React.FC<DiceRollerProps> = ({
  rolls,
  onAddRoll,
  onClearRolls,
  isOpen,
  onClose
}) => {
  const [quantity, setQuantity] = useState(1);
  const [modifier, setModifier] = useState(0);
  const [d20Mode, setD20Mode] = useState<'normal' | 'advantage' | 'disadvantage'>('normal');
  const [lastRoll, setLastRoll] = useState<DiceRoll | null>(rolls[0] || null);
  const [isRollingAnimation, setIsRollingAnimation] = useState(false);

  const diceTypes = [
    { die: 4, label: 'd4', shape: '▲' },
    { die: 6, label: 'd6', shape: '■' },
    { die: 8, label: 'd8', shape: '◆' },
    { die: 10, label: 'd10', shape: '⬟' },
    { die: 12, label: 'd12', shape: '⬢' },
    { die: 20, label: 'd20', shape: '⬡' },
    { die: 100, label: 'd100', shape: '%' }
  ];

  const roll = (die: number, customLabel?: string) => {
    setIsRollingAnimation(true);

    setTimeout(() => {
      let rolledValues: number[] = [];
      let total = 0;
      let isCrit = false;
      let isFumble = false;

      if (die === 20 && (d20Mode === 'advantage' || d20Mode === 'disadvantage')) {
        const r1 = Math.floor(Math.random() * 20) + 1;
        const r2 = Math.floor(Math.random() * 20) + 1;
        rolledValues = [r1, r2];
        const chosen = d20Mode === 'advantage' ? Math.max(r1, r2) : Math.min(r1, r2);
        total = chosen + modifier;
        isCrit = chosen === 20;
        isFumble = chosen === 1;
      } else {
        for (let i = 0; i < quantity; i++) {
          const val = Math.floor(Math.random() * die) + 1;
          rolledValues.push(val);
          total += val;
        }
        total += modifier;
        if (die === 20 && quantity === 1) {
          isCrit = rolledValues[0] === 20;
          isFumble = rolledValues[0] === 1;
        }
      }

      sound.playDiceRoll(isCrit, isFumble);

      const formula =
        die === 20 && d20Mode !== 'normal'
          ? `1d20 (${d20Mode === 'advantage' ? 'Vantagem' : 'Desvantagem'})${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`
          : `${quantity}d${die}${modifier !== 0 ? (modifier > 0 ? ` + ${modifier}` : ` - ${Math.abs(modifier)}`) : ''}`;

      const newRoll: DiceRoll = {
        id: `roll_${Date.now()}`,
        timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        die,
        quantity,
        modifier,
        rolls: rolledValues,
        total,
        isCrit,
        isFumble,
        label: customLabel || formula
      };

      setLastRoll(newRoll);
      onAddRoll(newRoll);
      setIsRollingAnimation(false);
    }, 200);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <Dices className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">
              Rolador de Dados RPG
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
        <div className="p-4 overflow-y-auto space-y-4 text-xs flex-1">
          {/* Result Highlight Box */}
          <div
            className={`p-4 rounded-xl border text-center transition-all ${
              lastRoll?.isCrit
                ? 'bg-emerald-950/40 border-emerald-500/60 shadow-lg shadow-emerald-950/50'
                : lastRoll?.isFumble
                ? 'bg-rose-950/40 border-rose-600/60 shadow-lg shadow-rose-950/50'
                : 'bg-stone-950/70 border-stone-800'
            }`}
          >
            <div className="text-[11px] font-mono text-stone-400 mb-1">
              {lastRoll ? lastRoll.label : 'Nenhum dado rolado ainda'}
            </div>
            <div
              className={`font-mono text-4xl font-extrabold tracking-tight transition-transform ${
                isRollingAnimation ? 'scale-90 opacity-60' : 'scale-100'
              } ${
                lastRoll?.isCrit
                  ? 'text-emerald-400'
                  : lastRoll?.isFumble
                  ? 'text-rose-400'
                  : 'text-amber-400'
              }`}
            >
              {isRollingAnimation ? '...' : lastRoll ? lastRoll.total : '—'}
            </div>

            {lastRoll && (
              <div className="mt-2 flex items-center justify-center gap-2 text-stone-400 text-[11px]">
                {lastRoll.isCrit && (
                  <span className="text-emerald-400 font-semibold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" /> Sucesso Crítico!
                  </span>
                )}
                {lastRoll.isFumble && (
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> Falha Crítica!
                  </span>
                )}
                <span className="font-mono text-stone-500">
                  Dados: [{lastRoll.rolls.join(', ')}]
                  {lastRoll.modifier !== 0 && ` ${lastRoll.modifier > 0 ? `+ ${lastRoll.modifier}` : `- ${Math.abs(lastRoll.modifier)}`}`}
                </span>
              </div>
            )}
          </div>

          {/* Dice Buttons Strip */}
          <div>
            <label className="block text-stone-400 font-semibold mb-2 uppercase tracking-wider text-[10px]">
              Selecione o Dado
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
              {diceTypes.map((d) => (
                <button
                  key={d.die}
                  onClick={() => roll(d.die)}
                  className="p-2.5 rounded-lg bg-stone-800 hover:bg-stone-700 active:bg-amber-600 text-stone-200 border border-stone-700 flex flex-col items-center justify-center gap-1 transition-all cursor-pointer hover:border-amber-500/50"
                >
                  <span className="text-xs text-amber-400 font-mono">{d.shape}</span>
                  <span className="font-mono font-bold text-xs">{d.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Multiplier & Modifier Controls */}
          <div className="grid grid-cols-2 gap-3 bg-stone-950/60 p-3 rounded-lg border border-stone-800">
            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-semibold mb-1">
                Quantidade de Dados
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-7 h-7 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center cursor-pointer font-mono font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold text-sm text-stone-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(Math.min(10, quantity + 1))}
                  className="w-7 h-7 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center cursor-pointer font-mono font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div>
              <label className="block text-stone-400 text-[10px] uppercase font-semibold mb-1">
                Modificador (+ / -)
              </label>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setModifier(modifier - 1)}
                  className="w-7 h-7 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center cursor-pointer font-mono font-bold"
                >
                  -
                </button>
                <span className="flex-1 text-center font-mono font-bold text-sm text-stone-100">
                  {modifier >= 0 ? `+${modifier}` : modifier}
                </span>
                <button
                  onClick={() => setModifier(modifier + 1)}
                  className="w-7 h-7 rounded bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center cursor-pointer font-mono font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* D20 Advantage / Disadvantage Mode */}
          <div>
            <label className="block text-stone-400 text-[10px] uppercase font-semibold mb-1.5">
              Modo Especial d20
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                onClick={() => setD20Mode('normal')}
                className={`py-1.5 px-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  d20Mode === 'normal'
                    ? 'bg-stone-800 border-amber-500 text-amber-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Normal
              </button>
              <button
                onClick={() => setD20Mode('advantage')}
                className={`py-1.5 px-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  d20Mode === 'advantage'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Vantagem
              </button>
              <button
                onClick={() => setD20Mode('disadvantage')}
                className={`py-1.5 px-2 rounded text-xs font-medium border transition-colors cursor-pointer ${
                  d20Mode === 'disadvantage'
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                Desvantagem
              </button>
            </div>
          </div>

          {/* Roll History */}
          <div className="pt-2 border-t border-stone-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                Histórico Recente
              </span>
              {rolls.length > 0 && (
                <button
                  onClick={onClearRolls}
                  className="text-[11px] text-stone-500 hover:text-stone-300 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" /> Limpar
                </button>
              )}
            </div>

            <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
              {rolls.length === 0 ? (
                <p className="text-stone-500 italic text-center py-2">Nenhuma rolagem feita ainda.</p>
              ) : (
                rolls.slice(0, 10).map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between p-1.5 rounded bg-stone-950/50 border border-stone-800/80 font-mono text-[11px]"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-stone-500">{r.timestamp}</span>
                      <span className="text-stone-300">{r.label}</span>
                    </div>
                    <span
                      className={`font-bold ${
                        r.isCrit
                          ? 'text-emerald-400'
                          : r.isFumble
                          ? 'text-rose-400'
                          : 'text-amber-400'
                      }`}
                    >
                      = {r.total}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
