import React from 'react';
import {
  Hand,
  MapPin as MapPinIcon,
  Ruler,
  Eye,
  EyeOff,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Grid,
  Filter,
  Layers,
  Sparkles,
  DoorOpen
} from 'lucide-react';
import { ToolMode, GridType, PinCategory } from '../types/rpg';

interface MapControlsProps {
  toolMode: ToolMode;
  onChangeToolMode: (mode: ToolMode) => void;
  gridType: GridType;
  onChangeGridType: (type: GridType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onResetFog: () => void;
  onClearFog: () => void;
  activeCategories: Set<PinCategory>;
  onToggleCategory: (cat: PinCategory) => void;
  selectedWardFilter: string | 'all';
  onSelectWardFilter: (ward: string | 'all') => void;
  isGmMode: boolean;
  totalPinsCount: number;
}

export const MapControls: React.FC<MapControlsProps> = ({
  toolMode,
  onChangeToolMode,
  gridType,
  onChangeGridType,
  onZoomIn,
  onZoomOut,
  onResetView,
  onResetFog,
  onClearFog,
  activeCategories,
  onToggleCategory,
  selectedWardFilter,
  onSelectWardFilter,
  isGmMode,
  totalPinsCount
}) => {
  const [showFilterDropdown, setShowFilterDropdown] = React.useState(false);

  const categories: { key: PinCategory; label: string; icon: string }[] = [
    { key: 'city', label: 'Cortes & Cidadelas', icon: '🏛️' },
    { key: 'castle', label: 'Prisões & Fortalezas', icon: '🛡️' },
    { key: 'dungeon', label: 'Necrotérios & Forjas', icon: '🗝️' },
    { key: 'wonder', label: 'Teatros & Maravilhas', icon: '✨' },
    { key: 'tavern', label: 'Tavernas & Estalagens', icon: '🍺' },
    { key: 'shrine', label: 'Ginásios & Santuários', icon: '⛩️' },
    { key: 'danger', label: 'Arsenais & Perigos', icon: '⚔️' }
  ];

  const wards = [
    { id: 'all', label: 'Todos os Distritos' },
    { id: 'lady', label: "Distrito da Senhora (Lady's Ward)" },
    { id: 'clerk', label: "Distrito dos Escribas (Clerk's Ward)" },
    { id: 'hive', label: "Distrito da Colmeia (The Hive)" },
    { id: 'lower', label: 'Distrito Inferior / Forjas (Lower Ward)' },
    { id: 'market', label: 'Distrito do Mercado (Market Ward)' },
    { id: 'guildhall', label: 'Distrito das Guildas (Guildhall)' },
    { id: 'undersigil', label: 'Sub-Sigil & O Espigão' }
  ];

  return (
    <div className="absolute top-4 left-4 z-40 flex flex-col gap-2 select-none">
      {/* Primary Tool Selector */}
      <div className="bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-lg p-1.5 shadow-xl flex flex-col gap-1 w-11 items-center">
        {/* Navigation Hand */}
        <button
          onClick={() => onChangeToolMode('pan')}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            toolMode === 'pan'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title="Mover Mapa (Arrastar com o mouse)"
        >
          <Hand className="w-4 h-4" />
        </button>

        {/* Add Pin Marker */}
        <button
          onClick={() => onChangeToolMode('add_pin')}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            toolMode === 'add_pin'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title="Adicionar Novo Ponto / Portal no Mapa"
        >
          <MapPinIcon className="w-4 h-4" />
        </button>

        {/* Distance Ruler */}
        <button
          onClick={() => onChangeToolMode('measure')}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            toolMode === 'measure'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title="Medir Distância em Quarteirões da Cidade"
        >
          <Ruler className="w-4 h-4" />
        </button>

        <div className="w-6 h-[1px] bg-stone-800 my-0.5" />

        {/* Fog of War: Reveal Brush */}
        <button
          onClick={() => onChangeToolMode('fog_reveal')}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            toolMode === 'fog_reveal'
              ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
              : 'text-stone-300 hover:bg-stone-800 hover:text-white'
          }`}
          title="Revelar Névoa de Guerra (Pincel)"
        >
          <Eye className="w-4 h-4" />
        </button>

        {/* Fog of War: Conceal Brush */}
        {isGmMode && (
          <button
            onClick={() => onChangeToolMode('fog_hide')}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              toolMode === 'fog_hide'
                ? 'bg-amber-500 text-stone-950 font-bold shadow-sm'
                : 'text-stone-300 hover:bg-stone-800 hover:text-white'
            }`}
            title="Ocultar com Névoa de Guerra (Pincel)"
          >
            <EyeOff className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Secondary Quick Action Bar: Zoom, Grid & Ward Filters */}
      <div className="bg-stone-900/95 backdrop-blur-md border border-stone-800 rounded-lg p-1.5 shadow-xl flex flex-col gap-1 w-11 items-center">
        <button
          onClick={onZoomIn}
          className="w-8 h-8 rounded-md flex items-center justify-center text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Aumentar Zoom (+)"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={onZoomOut}
          className="w-8 h-8 rounded-md flex items-center justify-center text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Diminuir Zoom (-)"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={onResetView}
          className="w-8 h-8 rounded-md flex items-center justify-center text-stone-300 hover:bg-stone-800 hover:text-white transition-colors cursor-pointer"
          title="Centralizar Anel de Sigil"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>

        <div className="w-6 h-[1px] bg-stone-800 my-0.5" />

        {/* Grid Cycle Button */}
        <button
          onClick={() => {
            const types: GridType[] = ['none', 'square', 'hex'];
            const nextIdx = (types.indexOf(gridType) + 1) % types.length;
            onChangeGridType(types[nextIdx]);
          }}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
            gridType !== 'none' ? 'text-amber-400 bg-amber-950/30' : 'text-stone-400 hover:bg-stone-800'
          }`}
          title={`Grade: ${gridType === 'none' ? 'Desativada' : gridType === 'square' ? 'Quadrada' : 'Hexagonal'}`}
        >
          <Grid className="w-4 h-4" />
        </button>

        {/* Layer Filters Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors cursor-pointer ${
              showFilterDropdown ? 'bg-stone-700 text-white' : 'text-stone-300 hover:bg-stone-800'
            }`}
            title="Filtrar por Distritos ou Categorias"
          >
            <Filter className="w-4 h-4" />
          </button>

          {/* Filter dropdown */}
          {showFilterDropdown && (
            <div className="absolute left-10 top-0 bg-stone-900 border border-stone-800 rounded-lg shadow-2xl p-3 w-64 flex flex-col gap-2.5 z-50">
              {/* Ward filter */}
              <div>
                <span className="text-[10px] uppercase font-semibold text-amber-500 tracking-wider block mb-1">
                  Filtrar por Distrito (Ward)
                </span>
                <select
                  value={selectedWardFilter}
                  onChange={(e) => onSelectWardFilter(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 text-stone-200 text-xs rounded p-1.5 focus:outline-none focus:border-amber-500 cursor-pointer"
                >
                  {wards.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category Toggles */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-stone-300 pb-1 border-b border-stone-800">
                  <span className="flex items-center gap-1.5 text-[11px]">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Categorias
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    {activeCategories.size}/{categories.length}
                  </span>
                </div>
                <div className="flex flex-col gap-1 max-h-36 overflow-y-auto mt-1.5">
                  {categories.map((c) => {
                    const isActive = activeCategories.has(c.key);
                    return (
                      <button
                        key={c.key}
                        onClick={() => onToggleCategory(c.key)}
                        className={`flex items-center justify-between px-2 py-1 rounded text-xs transition-colors text-left cursor-pointer ${
                          isActive
                            ? 'bg-amber-950/40 text-amber-200 border border-amber-800/40'
                            : 'text-stone-400 hover:bg-stone-800 hover:text-stone-200'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span>{c.icon}</span>
                          <span className="truncate">{c.label}</span>
                        </span>
                        <span className="text-[10px] text-stone-400 font-mono">
                          {isActive ? '✓' : ''}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {isGmMode && (
                <div className="pt-2 border-t border-stone-800 flex flex-col gap-1">
                  <span className="text-[10px] text-stone-400 font-semibold uppercase">Névoa de Guerra:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={onResetFog}
                      className="flex-1 py-1 px-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium cursor-pointer"
                    >
                      Cobrir Tudo
                    </button>
                    <button
                      onClick={onClearFog}
                      className="flex-1 py-1 px-2 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-[11px] font-medium cursor-pointer"
                    >
                      Revelar Tudo
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
