import React, { useState } from 'react';
import { X, ScrollText, CheckCircle2, Circle, MapPin, Plus, Trophy } from 'lucide-react';
import { Quest, MapPin as MapPinType } from '../types/rpg';

interface QuestJournalProps {
  quests: Quest[];
  pins: MapPinType[];
  isOpen: boolean;
  onClose: () => void;
  onToggleObjective: (questId: string, objIndex: number) => void;
  onFocusPin: (pinId: string) => void;
  onCreateQuest: (quest: Quest) => void;
}

export const QuestJournal: React.FC<QuestJournalProps> = ({
  quests,
  pins,
  isOpen,
  onClose,
  onToggleObjective,
  onFocusPin,
  onCreateQuest
}) => {
  const [filter, setFilter] = useState<'active' | 'completed'>('active');
  const [isCreating, setIsCreating] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newGiver, setNewGiver] = useState('');
  const [newReward, setNewReward] = useState('');
  const [selectedPinId, setSelectedPinId] = useState<string>(pins[0]?.id || '');
  const [newObjectivesText, setNewObjectivesText] = useState('');

  if (!isOpen) return null;

  const filteredQuests = quests.filter((q) => q.status === filter);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const objectives = newObjectivesText
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)
      .map((text) => ({ text, done: false }));

    const newQuest: Quest = {
      id: `quest_${Date.now()}`,
      title: newTitle.trim(),
      description: newDesc.trim() || 'Sem descrição adicional.',
      giver: newGiver.trim() || 'Mestre do Jogo',
      reward: newReward.trim() || 'Experiência & Ouro',
      locationId: selectedPinId || undefined,
      status: 'active',
      objectives: objectives.length > 0 ? objectives : [{ text: 'Investigar o local', done: false }]
    };

    onCreateQuest(newQuest);
    setIsCreating(false);
    setNewTitle('');
    setNewDesc('');
    setNewGiver('');
    setNewReward('');
    setNewObjectivesText('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 select-none animate-in fade-in duration-150">
      <div className="bg-stone-900 border border-stone-800 rounded-xl shadow-2xl w-full max-w-xl max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-md bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <ScrollText className="w-4 h-4" />
            </div>
            <h3 className="font-cinzel text-base font-bold text-stone-100">
              Diário de Missões & Campanhas
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-100 p-1 rounded hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Bar */}
        <div className="p-3 bg-stone-950/40 border-b border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800">
            <button
              onClick={() => setFilter('active')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'active'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Ativas ({quests.filter((q) => q.status === 'active').length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-3 py-1 rounded-md font-medium transition-colors cursor-pointer ${
                filter === 'completed'
                  ? 'bg-amber-500 text-stone-950 font-semibold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              Concluídas ({quests.filter((q) => q.status === 'completed').length})
            </button>
          </div>

          <button
            onClick={() => setIsCreating(!isCreating)}
            className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-amber-400 rounded-md font-medium flex items-center gap-1.5 transition-colors cursor-pointer border border-stone-700"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{isCreating ? 'Cancelar' : 'Nova Missão'}</span>
          </button>
        </div>

        {/* Create Quest Sub-form */}
        {isCreating && (
          <form
            onSubmit={handleCreateSubmit}
            className="p-4 bg-stone-950 border-b border-stone-800 space-y-3 text-xs"
          >
            <h4 className="font-semibold text-amber-400">Criar Nova Aventura</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="Título da Missão..."
                className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
              <select
                value={selectedPinId}
                onChange={(e) => setSelectedPinId(e.target.value)}
                className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                <option value="">Vincular a Local no Mapa (Opcional)</option>
                {pins.map((p) => (
                  <option key={p.id} value={p.id}>
                    📍 {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                value={newGiver}
                onChange={(e) => setNewGiver(e.target.value)}
                placeholder="Contratante / Quem deu a missão..."
                className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
              <input
                type="text"
                value={newReward}
                onChange={(e) => setNewReward(e.target.value)}
                placeholder="Recompensa prometida..."
                className="bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <textarea
              rows={2}
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Descrição geral da missão..."
              className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
            <textarea
              rows={2}
              value={newObjectivesText}
              onChange={(e) => setNewObjectivesText(e.target.value)}
              placeholder="Objetivos (1 por linha)&#10;Ex: Falar com o batedor&#10;Recuperar o amuleto"
              className="w-full bg-stone-900 border border-stone-700 rounded px-2.5 py-1.5 text-stone-200 focus:outline-none focus:border-amber-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold rounded cursor-pointer"
              >
                Salvar Missão
              </button>
            </div>
          </form>
        )}

        {/* Quest List */}
        <div className="p-4 overflow-y-auto space-y-3 text-xs flex-1">
          {filteredQuests.length === 0 ? (
            <div className="text-center py-8 text-stone-500">
              <ScrollText className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p>Nenhuma missão registrada nesta categoria.</p>
            </div>
          ) : (
            filteredQuests.map((quest) => {
              const linkedPin = pins.find((p) => p.id === quest.locationId);
              const allDone = quest.objectives.every((o) => o.done);

              return (
                <div
                  key={quest.id}
                  className="bg-stone-950/60 border border-stone-800 rounded-lg p-3.5 space-y-2.5 hover:border-stone-700 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-cinzel text-sm font-bold text-amber-300">
                        {quest.title}
                      </h4>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Contratante: <span className="text-stone-300">{quest.giver}</span>
                      </p>
                    </div>

                    {linkedPin && (
                      <button
                        onClick={() => {
                          onFocusPin(linkedPin.id);
                          onClose();
                        }}
                        className="px-2 py-1 bg-stone-800 hover:bg-amber-950/40 text-stone-300 hover:text-amber-400 rounded border border-stone-700 text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
                        title="Localizar no Mapa"
                      >
                        <MapPin className="w-3 h-3 text-amber-500" />
                        <span>{linkedPin.name}</span>
                      </button>
                    )}
                  </div>

                  <p className="text-stone-300 leading-relaxed text-[11px]">{quest.description}</p>

                  {/* Objectives Checklist */}
                  <div className="bg-stone-900/80 rounded p-2.5 space-y-1.5 border border-stone-800/80">
                    <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                      Objetivos
                    </span>
                    {quest.objectives.map((obj, idx) => (
                      <div
                        key={idx}
                        onClick={() => onToggleObjective(quest.id, idx)}
                        className="flex items-start gap-2 cursor-pointer hover:text-white transition-colors"
                      >
                        {obj.done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        ) : (
                          <Circle className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
                        )}
                        <span
                          className={`text-[11px] ${
                            obj.done ? 'line-through text-stone-500' : 'text-stone-300'
                          }`}
                        >
                          {obj.text}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Rewards */}
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-800/60">
                    <span className="flex items-center gap-1 text-amber-400/90 font-medium">
                      <Trophy className="w-3 h-3 text-amber-400" />
                      Recompensa: {quest.reward}
                    </span>
                    <span className="font-mono text-[10px]">
                      {quest.objectives.filter((o) => o.done).length} / {quest.objectives.length} Feito
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
