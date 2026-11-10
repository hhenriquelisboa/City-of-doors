import React, { useState } from 'react';
import {
  X,
  Shield,
  Skull,
  Scroll,
  BookOpen,
  Sparkles,
  Users,
  Lock,
  Edit2,
  Trash2,
  PlusCircle,
  Eye,
  EyeOff,
  DoorOpen,
  Key,
  Compass
} from 'lucide-react';
import { MapPin } from '../types/rpg';

interface PinDrawerProps {
  pin: MapPin | null;
  onClose: () => void;
  isGmMode: boolean;
  onEditPin: (pin: MapPin) => void;
  onDeletePin: (pinId: string) => void;
  onCreateQuestForPin: (pin: MapPin) => void;
  onTogglePinVisibility: (pinId: string) => void;
}

export const PinDrawer: React.FC<PinDrawerProps> = ({
  pin,
  onClose,
  isGmMode,
  onEditPin,
  onDeletePin,
  onCreateQuestForPin,
  onTogglePinVisibility
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lore' | 'portal' | 'rumors' | 'gm'>('overview');

  if (!pin) return null;

  const renderDangerSkulls = (level: number) => {
    return (
      <div className="flex items-center gap-0.5" title={`Nível de Perigo: ${level}/5`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <Skull
            key={i}
            className={`w-3.5 h-3.5 ${
              i <= level ? 'text-rose-500 fill-rose-500/20' : 'text-stone-700'
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[440px] bg-stone-900 border-l border-stone-800 z-50 flex flex-col shadow-2xl animate-in slide-in-from-right duration-200 select-none">
      {/* Header */}
      <div className="p-4 bg-stone-950/80 border-b border-stone-800 flex items-start justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            {pin.wardName && (
              <span className="text-[10px] font-semibold text-amber-400 bg-amber-950/60 border border-amber-800/60 px-1.5 py-0.5 rounded">
                🏛️ {pin.wardName}
              </span>
            )}
            <span className="text-stone-600">·</span>
            {renderDangerSkulls(pin.dangerLevel)}
            {!pin.isVisibleToPlayers && (
              <span className="text-[10px] bg-rose-950/60 border border-rose-800/60 text-rose-300 px-1.5 py-0.5 rounded">
                Oculto p/ Jogadores
              </span>
            )}
          </div>
          <h2 className="font-cinzel text-lg font-bold text-stone-100 leading-tight">
            {pin.name}
          </h2>
          {pin.rulerOrFaction && (
            <p className="text-xs text-stone-400 mt-1 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              <span>{pin.rulerOrFaction}</span>
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="text-stone-400 hover:text-stone-100 p-1.5 rounded-md hover:bg-stone-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center px-4 pt-2 bg-stone-950/40 border-b border-stone-800 text-xs overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'overview'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Visão Geral
        </button>
        <button
          onClick={() => setActiveTab('lore')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'lore'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          História & Lore
        </button>
        {pin.portal && (
          <button
            onClick={() => setActiveTab('portal')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'portal'
                ? 'border-purple-500 text-purple-400 font-semibold'
                : 'border-transparent text-purple-400/80 hover:text-purple-300'
            }`}
          >
            <DoorOpen className="w-3.5 h-3.5" />
            <span>Portal Planar</span>
          </button>
        )}
        <button
          onClick={() => setActiveTab('rumors')}
          className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer whitespace-nowrap ${
            activeTab === 'rumors'
              ? 'border-amber-500 text-amber-400 font-semibold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Rumores
        </button>
        {isGmMode && (
          <button
            onClick={() => setActiveTab('gm')}
            className={`px-3 py-2 border-b-2 font-medium transition-colors cursor-pointer flex items-center gap-1 whitespace-nowrap ${
              activeTab === 'gm'
                ? 'border-rose-500 text-rose-400 font-semibold'
                : 'border-transparent text-rose-400/70 hover:text-rose-300'
            }`}
          >
            <Lock className="w-3 h-3" />
            Mestre (GM)
          </button>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs leading-relaxed text-stone-300">
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Short summary */}
            <div className="bg-stone-950/60 border border-stone-800 rounded-lg p-3">
              <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block mb-1">
                Descrição do Local
              </span>
              <p className="text-stone-200">{pin.shortSummary}</p>
            </div>

            {/* Quick portal teaser if present */}
            {pin.portal && (
              <div
                onClick={() => setActiveTab('portal')}
                className="bg-purple-950/30 border border-purple-500/40 rounded-lg p-3 cursor-pointer hover:border-purple-400 transition-colors flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-4 h-4 text-purple-400" />
                  <div>
                    <span className="text-[10px] font-semibold text-purple-300 uppercase block">
                      Portal Ativo Detectado
                    </span>
                    <span className="text-xs text-stone-100 font-semibold">
                      Para: {pin.portal.destinationPlane}
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-purple-400 font-mono">Ver Chave →</span>
              </div>
            )}

            {/* Factions */}
            {pin.factions && pin.factions.length > 0 && (
              <div className="bg-stone-950/60 border border-stone-800 rounded-lg p-3">
                <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider block mb-1.5">
                  Facções de Planescape Ativas
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {pin.factions.map((f, idx) => (
                    <span
                      key={idx}
                      className="text-[11px] bg-stone-800/80 text-stone-300 border border-stone-700/60 px-2 py-0.5 rounded"
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Loot & Planar Relics */}
            {pin.loot && pin.loot.length > 0 && (
              <div className="bg-stone-950/60 border border-stone-800 rounded-lg p-3">
                <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider flex items-center gap-1 mb-1.5">
                  <Sparkles className="w-3 h-3" />
                  Relíquias & Itens Notáveis
                </span>
                <ul className="list-disc pl-4 space-y-1 text-stone-300">
                  {pin.loot.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Position info */}
            <div className="text-[11px] text-stone-500 font-mono">
              Coordenadas no Anel de Sigil: X {pin.x}% · Y {pin.y}%
            </div>
          </div>
        )}

        {activeTab === 'lore' && (
          <div className="space-y-3">
            <div className="bg-stone-950/60 border border-stone-800 rounded-lg p-4 font-serif text-stone-300 text-sm leading-relaxed space-y-3">
              <p>{pin.lore}</p>
            </div>
          </div>
        )}

        {activeTab === 'portal' && pin.portal && (
          <div className="space-y-3">
            <div className="bg-purple-950/30 border border-purple-500/40 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between border-b border-purple-900/50 pb-2">
                <div className="flex items-center gap-2">
                  <DoorOpen className="w-5 h-5 text-purple-400" />
                  <span className="font-cinzel text-sm font-bold text-purple-300">
                    Detalhes do Portal Planar
                  </span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800">
                  Perigo: {pin.portal.dangerRating}
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold block">
                  Destino do Portal
                </span>
                <p className="text-sm font-bold text-stone-100">
                  {pin.portal.destinationPlane} — <span className="font-normal text-purple-300">{pin.portal.destinationLocation}</span>
                </p>
              </div>

              <div className="bg-stone-950/80 rounded p-2.5 border border-purple-800/40">
                <span className="text-[10px] uppercase text-amber-400 font-semibold block flex items-center gap-1 mb-1">
                  <Key className="w-3 h-3 text-amber-400" />
                  Chave do Portal (Portal Key):
                </span>
                <p className="text-amber-200 italic leading-relaxed text-xs">
                  "{pin.portal.portalKey}"
                </p>
              </div>

              <div>
                <span className="text-[10px] uppercase text-stone-400 font-semibold block">
                  Aparência Visual da Passagem
                </span>
                <p className="text-stone-300 text-xs">
                  {pin.portal.appearance}
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'rumors' && (
          <div className="space-y-3">
            <div className="bg-stone-950/60 border border-stone-800 rounded-lg p-3">
              <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider block mb-2">
                Chant das Tavernas Planares (Rumores)
              </span>
              {pin.rumors && pin.rumors.length > 0 ? (
                <ul className="space-y-2.5">
                  {pin.rumors.map((r, idx) => (
                    <li
                      key={idx}
                      className="bg-stone-900 border border-stone-800/90 rounded p-2 text-stone-300 italic font-serif"
                    >
                      "{r}"
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-stone-500 italic">Nenhum boato registrado nesta região ainda.</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'gm' && isGmMode && (
          <div className="space-y-3">
            <div className="bg-rose-950/20 border border-rose-800/40 rounded-lg p-3.5 space-y-2">
              <div className="flex items-center gap-1.5 text-rose-400 font-semibold text-xs">
                <Lock className="w-3.5 h-3.5" />
                <span>O "Dark" de Sigil (Segredos do Mestre)</span>
              </div>
              <p className="text-rose-200/90 leading-relaxed font-serif">
                {pin.secretGMNotes || 'Nenhuma anotação secreta registrada para este ponto.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer Quick Actions */}
      <div className="p-3 bg-stone-950/80 border-t border-stone-800 flex items-center justify-between gap-2">
        <button
          onClick={() => onCreateQuestForPin(pin)}
          className="flex-1 py-1.5 px-2 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 rounded text-xs font-medium flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>Criar Missão Aqui</span>
        </button>

        {isGmMode && (
          <>
            <button
              onClick={() => onTogglePinVisibility(pin.id)}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors cursor-pointer"
              title={pin.isVisibleToPlayers ? 'Ocultar dos Jogadores' : 'Revelar para Jogadores'}
            >
              {pin.isVisibleToPlayers ? <Eye className="w-4 h-4 text-emerald-400" /> : <EyeOff className="w-4 h-4 text-rose-400" />}
            </button>
            <button
              onClick={() => onEditPin(pin)}
              className="p-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 rounded border border-stone-700 transition-colors cursor-pointer"
              title="Editar Ponto de Interesse"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDeletePin(pin.id)}
              className="p-1.5 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 rounded border border-rose-800/50 transition-colors cursor-pointer"
              title="Excluir Marcador"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
};
