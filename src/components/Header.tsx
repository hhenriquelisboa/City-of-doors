import React from 'react';
import {
  Compass,
  Download,
  Shield,
  Volume2,
  VolumeX,
  ScrollText,
  Dices,
  CloudSun,
  Flame,
  DoorOpen,
  Eye
} from 'lucide-react';
import { MapPreset } from '../types/rpg';

interface HeaderProps {
  currentPreset: MapPreset;
  presets: MapPreset[];
  onSelectPreset: (preset: MapPreset) => void;
  isGmMode: boolean;
  onToggleGmMode: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
  isAtmospherePlaying: boolean;
  onToggleAtmosphere: () => void;
  onOpenQuests: () => void;
  onOpenEncounters: () => void;
  onOpenWeather: () => void;
  onOpenDice: () => void;
  onOpenPortals: () => void;
  onOpenStreetView: () => void;
  onExportStandaloneHtml: () => void;
  onUploadCustomMap: (file: File) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPreset,
  presets,
  onSelectPreset,
  isGmMode,
  onToggleGmMode,
  isMuted,
  onToggleMute,
  isAtmospherePlaying,
  onToggleAtmosphere,
  onOpenQuests,
  onOpenEncounters,
  onOpenWeather,
  onOpenDice,
  onOpenPortals,
  onOpenStreetView,
  onExportStandaloneHtml,
  onUploadCustomMap
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUploadCustomMap(e.target.files[0]);
    }
  };

  return (
    <header className="flex items-center justify-between gap-3 md:gap-6 px-4 md:px-6 py-2 bg-stone-900 border-b border-stone-800 z-50 shrink-0 select-none">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
          <Compass className="w-4 h-4" />
        </div>
        <div className="flex flex-col">
          <span className="font-cinzel text-base md:text-lg font-bold tracking-wider text-amber-400 whitespace-nowrap shrink-0 leading-tight">
            Sigil · A Cidade das Portas
          </span>
          <span className="text-[11px] text-stone-400 hidden sm:inline whitespace-nowrap">
            {currentPreset.subtitle}
          </span>
        </div>
      </div>

      {/* Zone 2: 4–5 concise single-line nav links / tools */}
      <nav className="hidden lg:flex items-center gap-1.5 text-xs font-medium text-stone-300">
        {/* Preset Selector */}
        <div className="relative inline-flex items-center">
          <select
            value={currentPreset.id}
            onChange={(e) => {
              const selected = presets.find((p) => p.id === e.target.value);
              if (selected) onSelectPreset(selected);
            }}
            className="bg-stone-800 text-stone-200 border border-stone-700 rounded-md px-2.5 py-1 text-xs font-medium hover:border-amber-500/50 focus:outline-none focus:border-amber-500 cursor-pointer pr-6"
          >
            {presets.map((p) => (
              <option key={p.id} value={p.id}>
                🗺️ {p.name}
              </option>
            ))}
          </select>
        </div>

        {/* Planar Portals Guide button */}
        <button
          onClick={onOpenPortals}
          className="px-2.5 py-1 rounded-md bg-purple-950/40 border border-purple-800/60 hover:bg-purple-900/50 text-purple-200 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer font-semibold"
          title="Ver Guia de Portais, Chaves e Gírias de Sigil"
        >
          <DoorOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Portais & Chaves</span>
        </button>

        {/* Street Perspective View */}
        {currentPreset.streetViewUrl && (
          <button
            onClick={onOpenStreetView}
            className="px-2.5 py-1 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
            title="Ver perspectiva das ruas com o céu curvado de Sigil"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Visão de Rua</span>
          </button>
        )}

        <button
          onClick={onOpenQuests}
          className="px-2.5 py-1 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <ScrollText className="w-3.5 h-3.5 text-amber-400" />
          Missões
        </button>

        <button
          onClick={onOpenEncounters}
          className="px-2.5 py-1 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5 text-rose-400" />
          Encontros
        </button>

        <button
          onClick={onOpenWeather}
          className="px-2.5 py-1 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <CloudSun className="w-3.5 h-3.5 text-cyan-400" />
          Atmosfera
        </button>

        <button
          onClick={onOpenDice}
          className="px-2.5 py-1 rounded-md hover:bg-stone-800 text-stone-300 hover:text-white transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
        >
          <Dices className="w-3.5 h-3.5 text-emerald-400" />
          Dados
        </button>
      </nav>

      {/* Zone 3: 1 primary action + Mode toggles */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Upload Custom Map */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-2.5 py-1 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs border border-stone-700 transition-colors cursor-pointer hidden md:flex items-center gap-1"
          title="Importar imagem própria"
        >
          Importar
        </button>

        {/* Ambient Soundscape */}
        <button
          onClick={onToggleAtmosphere}
          className={`p-1.5 rounded-md border text-xs transition-colors cursor-pointer ${
            isAtmospherePlaying
              ? 'bg-amber-950/40 border-amber-600/50 text-amber-300'
              : 'bg-stone-800 border-stone-700 text-stone-400 hover:text-stone-200'
          }`}
          title={isAtmospherePlaying ? 'Pausar Áudio Ambiente' : 'Tocar Som Ambiente de Sigil'}
        >
          {isAtmospherePlaying ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Master / Player Mode Switch */}
        <button
          onClick={onToggleGmMode}
          className={`px-3 py-1 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition-all cursor-pointer whitespace-nowrap shrink-0 ${
            isGmMode
              ? 'bg-red-950/60 border-red-700/70 text-red-300 shadow-sm shadow-red-950'
              : 'bg-stone-800 border-stone-700 text-stone-300 hover:border-stone-600'
          }`}
          title={isGmMode ? 'Modo Mestre Ativo (Mostra segredos do Dark e portais ocultos)' : 'Modo Jogador'}
        >
          <Shield className={`w-3.5 h-3.5 ${isGmMode ? 'text-red-400' : 'text-stone-400'}`} />
          <span>{isGmMode ? 'Mestre (GM)' : 'Jogador'}</span>
        </button>

        {/* Primary CTA: Standalone HTML Export */}
        <button
          onClick={onExportStandaloneHtml}
          className="px-3.5 py-1 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow cursor-pointer"
          title="Baixar arquivo HTML interativo autônomo de Sigil para abrir sem internet"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Baixar HTML</span>
        </button>
      </div>
    </header>
  );
};
