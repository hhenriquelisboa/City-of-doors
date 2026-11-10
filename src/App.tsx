/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  MapPreset,
  MapPin,
  MapToken,
  Quest,
  DiceRoll,
  ToolMode,
  GridType,
  WeatherType,
  PinCategory
} from './types/rpg';
import { DEFAULT_PRESETS, INITIAL_QUESTS } from './data/defaultPresets';
import { Header } from './components/Header';
import { MapCanvas } from './components/MapCanvas';
import { MapControls } from './components/MapControls';
import { PinDrawer } from './components/PinDrawer';
import { PinEditorModal } from './components/PinEditorModal';
import { TokenEditorModal } from './components/TokenEditorModal';
import { DiceRoller } from './components/DiceRoller';
import { QuestJournal } from './components/QuestJournal';
import { EncounterModal } from './components/EncounterModal';
import { AtmosphereSelector } from './components/AtmosphereSelector';
import { WeatherOverlay } from './components/WeatherOverlay';
import { PortalGuideModal } from './components/PortalGuideModal';
import { StreetPerspectiveModal } from './components/StreetPerspectiveModal';
import { ShareModal } from './components/ShareModal';
import { sound } from './utils/audio';
import { generateStandaloneHtml } from './utils/standaloneHtmlGenerator';

export default function App() {
  const [presets, setPresets] = useState<MapPreset[]>(DEFAULT_PRESETS);
  const [currentPreset, setCurrentPreset] = useState<MapPreset>(DEFAULT_PRESETS[0]);
  const [pins, setPins] = useState<MapPin[]>(DEFAULT_PRESETS[0].initialPins);
  const [tokens, setTokens] = useState<MapToken[]>(DEFAULT_PRESETS[0].initialTokens);
  const [quests, setQuests] = useState<Quest[]>(INITIAL_QUESTS);
  const [diceRolls, setDiceRolls] = useState<DiceRoll[]>([]);

  // Navigation & Tool State
  const [toolMode, setToolMode] = useState<ToolMode>('pan');
  const [gridType, setGridType] = useState<GridType>(DEFAULT_PRESETS[0].gridType);
  const [weather, setWeather] = useState<WeatherType>('clear');
  const [isGmMode, setIsGmMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isAtmospherePlaying, setIsAtmospherePlaying] = useState(false);

  // Active Category & Ward Filters
  const [activeCategories, setActiveCategories] = useState<Set<PinCategory>>(
    new Set(['city', 'castle', 'dungeon', 'ruins', 'shrine', 'danger', 'wonder', 'tavern', 'camp', 'port', 'portal', 'faction'])
  );
  const [selectedWardFilter, setSelectedWardFilter] = useState<string | 'all'>('all');

  // Canvas Transform
  const [scale, setScale] = useState(1);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Modals & Drawers
  const [selectedPin, setSelectedPin] = useState<MapPin | null>(null);
  const [editingPin, setEditingPin] = useState<Partial<MapPin> | null>(null);
  const [isNewPin, setIsNewPin] = useState(false);
  const [editingToken, setEditingToken] = useState<Partial<MapToken> | null>(null);
  const [isDiceOpen, setIsDiceOpen] = useState(false);
  const [isQuestsOpen, setIsQuestsOpen] = useState(false);
  const [isEncountersOpen, setIsEncountersOpen] = useState(false);
  const [isWeatherOpen, setIsWeatherOpen] = useState(false);
  const [isPortalsOpen, setIsPortalsOpen] = useState(false);
  const [isStreetViewOpen, setIsStreetViewOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Fog Canvas Ref
  const fogRef = useRef<HTMLCanvasElement | null>(null);

  // Reset Fog to opaque mask
  const resetFog = () => {
    const canvas = fogRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = 'rgba(12, 10, 9, 0.98)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  // Clear Fog completely
  const clearFog = () => {
    const canvas = fogRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Initialize fog on preset change
  useEffect(() => {
    resetFog();
  }, [currentPreset.id]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: MapPreset) => {
    setCurrentPreset(preset);
    setPins(preset.initialPins);
    setTokens(preset.initialTokens);
    setGridType(preset.gridType);
    setSelectedPin(null);
    setSelectedWardFilter('all');
  };

  // Upload Custom Map Image
  const handleUploadCustomMap = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const newPreset: MapPreset = {
        id: `custom_${Date.now()}`,
        name: file.name.replace(/\.[^/.]+$/, ''),
        subtitle: 'Mapa Importado Personalizado',
        imageUrl: dataUrl,
        scaleUnit: 'Quarteirões',
        scaleDistance: 1,
        gridType: 'hex',
        gridSize: 50,
        initialPins: [],
        initialTokens: [
          {
            id: 'party_custom',
            name: 'Grupo de Aventureiros',
            type: 'party',
            x: 50,
            y: 50,
            hp: 30,
            maxHp: 30,
            color: '#f59e0b'
          }
        ]
      };
      setPresets((prev) => [newPreset, ...prev]);
      handleSelectPreset(newPreset);
    };
    reader.readAsDataURL(file);
  };

  // Export standalone single-file HTML
  const handleExportStandaloneHtml = () => {
    const htmlContent = generateStandaloneHtml(currentPreset, pins, tokens, quests, isGmMode);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mapa_sigil_${currentPreset.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    sound.playPinClick();
  };

  // Pin actions
  const handleAddPinAt = (x: number, y: number) => {
    setEditingPin({ x, y, category: 'city', dangerLevel: 2, isVisibleToPlayers: true });
    setIsNewPin(true);
    setToolMode('pan');
  };

  const handleSavePin = (savedPin: MapPin) => {
    if (isNewPin) {
      setPins((prev) => [...prev, savedPin]);
      setSelectedPin(savedPin);
    } else {
      setPins((prev) => prev.map((p) => (p.id === savedPin.id ? savedPin : p)));
      setSelectedPin(savedPin);
    }
    setEditingPin(null);
  };

  const handleDeletePin = (pinId: string) => {
    setPins((prev) => prev.filter((p) => p.id !== pinId));
    setSelectedPin(null);
  };

  const handleTogglePinVisibility = (pinId: string) => {
    setPins((prev) =>
      prev.map((p) => (p.id === pinId ? { ...p, isVisibleToPlayers: !p.isVisibleToPlayers } : p))
    );
    if (selectedPin && selectedPin.id === pinId) {
      setSelectedPin((prev) => (prev ? { ...prev, isVisibleToPlayers: !prev.isVisibleToPlayers } : null));
    }
  };

  // Token actions
  const handleUpdateTokenPosition = (tokenId: string, x: number, y: number) => {
    setTokens((prev) => prev.map((t) => (t.id === tokenId ? { ...t, x, y } : t)));
  };

  const handleSaveToken = (savedToken: MapToken) => {
    setTokens((prev) =>
      prev.some((t) => t.id === savedToken.id)
        ? prev.map((t) => (t.id === savedToken.id ? savedToken : t))
        : [...prev, savedToken]
    );
    setEditingToken(null);
  };

  const handleDeleteToken = (tokenId: string) => {
    setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    setEditingToken(null);
  };

  // Category filter toggle
  const handleToggleCategory = (cat: PinCategory) => {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) next.delete(cat);
      else next.add(cat);
      return next;
    });
  };

  // Quests actions
  const handleToggleObjective = (questId: string, objIndex: number) => {
    setQuests((prev) =>
      prev.map((q) => {
        if (q.id !== questId) return q;
        const newObjs = [...q.objectives];
        newObjs[objIndex] = { ...newObjs[objIndex], done: !newObjs[objIndex].done };
        const allDone = newObjs.every((o) => o.done);
        return {
          ...q,
          objectives: newObjs,
          status: allDone ? 'completed' : 'active'
        };
      })
    );
  };

  const handleCreateQuestForPin = (pin: MapPin) => {
    const newQuest: Quest = {
      id: `quest_${Date.now()}`,
      title: `Aventura em ${pin.name}`,
      locationId: pin.id,
      giver: pin.rulerOrFaction || 'Agente das Facções',
      reward: '400 Moedas Planares + Chave de Portal',
      description: `Investigue os acontecimentos anormais relatados no quarteirão de ${pin.name}.`,
      status: 'active',
      objectives: [
        { text: `Deslocar-se pelas calçadas curvas até ${pin.name}`, done: false },
        { text: 'Confrontar a ameaça planar', done: false }
      ]
    };
    setQuests((prev) => [newQuest, ...prev]);
    setIsQuestsOpen(true);
  };

  // Focus Camera on Pin from Quests
  const handleFocusPin = (pinId: string) => {
    const targetPin = pins.find((p) => p.id === pinId);
    if (!targetPin) return;

    setSelectedPin(targetPin);
    const targetScale = 1.6;
    const windowW = window.innerWidth;
    const windowH = window.innerHeight;
    const targetX = -(targetPin.x / 100) * 1920 * targetScale + windowW / 2;
    const targetY = -(targetPin.y / 100) * 1080 * targetScale + windowH / 2;

    setScale(targetScale);
    setPanX(targetX);
    setPanY(targetY);
  };

  // Quick Roll D20
  const handleQuickD20 = () => {
    const res = Math.floor(Math.random() * 20) + 1;
    const isCrit = res === 20;
    const isFumble = res === 1;
    sound.playDiceRoll(isCrit, isFumble);

    const newRoll: DiceRoll = {
      id: `roll_${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('pt-BR'),
      die: 20,
      quantity: 1,
      modifier: 0,
      rolls: [res],
      total: res,
      isCrit,
      isFumble,
      label: '1d20 Rápido'
    };
    setDiceRolls((prev) => [newRoll, ...prev]);
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-stone-950 text-stone-100 select-none">
      {/* Universal Top Bar */}
      <Header
        currentPreset={currentPreset}
        presets={presets}
        onSelectPreset={handleSelectPreset}
        isGmMode={isGmMode}
        onToggleGmMode={() => setIsGmMode(!isGmMode)}
        isMuted={isMuted}
        onToggleMute={() => {
          const next = !isMuted;
          setIsMuted(next);
          sound.setMute(next);
        }}
        isAtmospherePlaying={isAtmospherePlaying}
        onToggleAtmosphere={() => {
          const playing = sound.toggleAtmosphere();
          setIsAtmospherePlaying(playing);
        }}
        onOpenQuests={() => setIsQuestsOpen(true)}
        onOpenEncounters={() => setIsEncountersOpen(true)}
        onOpenWeather={() => setIsWeatherOpen(true)}
        onOpenDice={() => setIsDiceOpen(true)}
        onOpenPortals={() => setIsPortalsOpen(true)}
        onOpenStreetView={() => setIsStreetViewOpen(true)}
        onOpenShare={() => setIsShareOpen(true)}
        onExportStandaloneHtml={handleExportStandaloneHtml}
        onUploadCustomMap={handleUploadCustomMap}
      />

      {/* Main Map Canvas Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        <MapCanvas
          preset={currentPreset}
          pins={pins}
          tokens={tokens}
          toolMode={toolMode}
          gridType={gridType}
          isGmMode={isGmMode}
          activeCategories={activeCategories}
          selectedWardFilter={selectedWardFilter}
          onSelectPin={(pin) => setSelectedPin(pin)}
          onUpdateTokenPosition={handleUpdateTokenPosition}
          onSelectToken={(tok) => setEditingToken(tok)}
          onAddPinAt={handleAddPinAt}
          scale={scale}
          panX={panX}
          panY={panY}
          onTransformChange={(s, px, py) => {
            setScale(s);
            setPanX(px);
            setPanY(py);
          }}
          fogRef={fogRef}
        />

        {/* Visual Weather & Sky Overlay */}
        <WeatherOverlay weather={weather} />

        {/* Floating Tool Bar */}
        <MapControls
          toolMode={toolMode}
          onChangeToolMode={setToolMode}
          gridType={gridType}
          onChangeGridType={setGridType}
          onZoomIn={() => setScale((s) => Math.min(s * 1.25, 4.5))}
          onZoomOut={() => setScale((s) => Math.max(s / 1.25, 0.2))}
          onResetView={() => {
            setScale(0.85);
            setPanX(50);
            setPanY(50);
          }}
          onResetFog={resetFog}
          onClearFog={clearFog}
          activeCategories={activeCategories}
          onToggleCategory={handleToggleCategory}
          selectedWardFilter={selectedWardFilter}
          onSelectWardFilter={setSelectedWardFilter}
          isGmMode={isGmMode}
          totalPinsCount={pins.length}
        />

        {/* Floating Quick Action Strip (Bottom Right) */}
        <div className="absolute bottom-4 right-4 z-40 flex items-center gap-2">
          {/* Quick D20 Button */}
          <button
            onClick={handleQuickD20}
            className="px-3 py-2 rounded-lg bg-stone-900/95 backdrop-blur-md border border-stone-800 hover:border-amber-500/60 text-amber-400 font-mono text-xs font-bold shadow-xl flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105"
            title="Rolar 1d20 rapidamente"
          >
            <span>🎲</span>
            <span>Rolar d20</span>
            {diceRolls[0] && (
              <span
                className={`ml-1 px-1.5 py-0.5 rounded text-[11px] font-extrabold ${
                  diceRolls[0].isCrit
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-500'
                    : diceRolls[0].isFumble
                    ? 'bg-rose-950 text-rose-400 border border-rose-500'
                    : 'bg-stone-800 text-stone-200'
                }`}
              >
                {diceRolls[0].total}
              </span>
            )}
          </button>

          {/* Open Full Dice Tray */}
          <button
            onClick={() => setIsDiceOpen(true)}
            className="p-2 rounded-lg bg-stone-900/95 backdrop-blur-md border border-stone-800 text-stone-300 hover:text-white shadow-xl cursor-pointer"
            title="Abrir Mesa Completa de Dados"
          >
            🎲
          </button>
        </div>

        {/* Location Pin Drawer */}
        <PinDrawer
          pin={selectedPin}
          onClose={() => setSelectedPin(null)}
          isGmMode={isGmMode}
          onEditPin={(pin) => {
            setEditingPin(pin);
            setIsNewPin(false);
          }}
          onDeletePin={handleDeletePin}
          onCreateQuestForPin={handleCreateQuestForPin}
          onTogglePinVisibility={handleTogglePinVisibility}
        />
      </div>

      {/* Modals */}
      {editingPin && (
        <PinEditorModal
          pin={editingPin}
          isNew={isNewPin}
          onSave={handleSavePin}
          onClose={() => setEditingPin(null)}
        />
      )}

      {editingToken && (
        <TokenEditorModal
          token={editingToken}
          onSave={handleSaveToken}
          onDelete={handleDeleteToken}
          onClose={() => setEditingToken(null)}
        />
      )}

      <DiceRoller
        isOpen={isDiceOpen}
        onClose={() => setIsDiceOpen(false)}
        rolls={diceRolls}
        onAddRoll={(r) => setDiceRolls((prev) => [r, ...prev])}
        onClearRolls={() => setDiceRolls([])}
      />

      <QuestJournal
        isOpen={isQuestsOpen}
        onClose={() => setIsQuestsOpen(false)}
        quests={quests}
        pins={pins}
        onToggleObjective={handleToggleObjective}
        onFocusPin={handleFocusPin}
        onCreateQuest={(q) => setQuests((prev) => [q, ...prev])}
      />

      <EncounterModal
        isOpen={isEncountersOpen}
        onClose={() => setIsEncountersOpen(false)}
      />

      <AtmosphereSelector
        weather={weather}
        onChangeWeather={setWeather}
        isOpen={isWeatherOpen}
        onClose={() => setIsWeatherOpen(false)}
      />

      <PortalGuideModal
        isOpen={isPortalsOpen}
        onClose={() => setIsPortalsOpen(false)}
      />

      {currentPreset.streetViewUrl && (
        <StreetPerspectiveModal
          isOpen={isStreetViewOpen}
          onClose={() => setIsStreetViewOpen(false)}
          imageUrl={currentPreset.streetViewUrl}
        />
      )}

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        onDownloadHtml={handleExportStandaloneHtml}
      />
    </div>
  );
}
