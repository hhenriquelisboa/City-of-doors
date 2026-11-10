import React, { useRef, useEffect, useState, useCallback } from 'react';
import {
  MapPreset,
  MapPin,
  MapToken,
  ToolMode,
  GridType,
  PinCategory
} from '../types/rpg';
import { sound } from '../utils/audio';

interface MapCanvasProps {
  preset: MapPreset;
  pins: MapPin[];
  tokens: MapToken[];
  toolMode: ToolMode;
  gridType: GridType;
  isGmMode: boolean;
  activeCategories: Set<PinCategory>;
  selectedWardFilter: string | 'all';
  onSelectPin: (pin: MapPin) => void;
  onUpdatePinPosition?: (pinId: string, x: number, y: number) => void;
  onUpdateTokenPosition: (tokenId: string, x: number, y: number) => void;
  onSelectToken: (token: MapToken) => void;
  onAddPinAt: (x: number, y: number) => void;
  scale: number;
  panX: number;
  panY: number;
  onTransformChange: (scale: number, panX: number, panY: number) => void;
  fogRef: React.MutableRefObject<HTMLCanvasElement | null>;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({
  preset,
  pins,
  tokens,
  toolMode,
  gridType,
  isGmMode,
  activeCategories,
  selectedWardFilter,
  onSelectPin,
  onUpdateTokenPosition,
  onSelectToken,
  onAddPinAt,
  scale,
  panX,
  panY,
  onTransformChange,
  fogRef
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const gridCanvasRef = useRef<HTMLCanvasElement>(null);
  const rulerCanvasRef = useRef<HTMLCanvasElement>(null);

  const [naturalWidth, setNaturalWidth] = useState(1920);
  const [naturalHeight, setNaturalHeight] = useState(1080);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [mouseCoords, setMouseCoords] = useState({ x: 0, y: 0, pctX: 0, pctY: 0 });

  // Ruler measurement points in percentage (0..100)
  const [rulerPoints, setRulerPoints] = useState<{ x: number; y: number }[]>([]);

  // Draggable token tracking
  const [draggingTokenId, setDraggingTokenId] = useState<string | null>(null);

  // Fog of war painting state
  const [isPaintingFog, setIsPaintingFog] = useState(false);

  // Initialize dimensions on image load
  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setNaturalWidth(img.naturalWidth || 1920);
    setNaturalHeight(img.naturalHeight || 1080);

    if (containerRef.current) {
      const cW = containerRef.current.clientWidth;
      const cH = containerRef.current.clientHeight;
      const initialScale = Math.min(cW / img.naturalWidth, cH / img.naturalHeight) * 0.95;
      const initialPanX = (cW - img.naturalWidth * initialScale) / 2;
      const initialPanY = (cH - img.naturalHeight * initialScale) / 2;
      onTransformChange(initialScale, initialPanX, initialPanY);
    }
  };

  // Draw Grid
  useEffect(() => {
    const canvas = gridCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, naturalWidth, naturalHeight);
    if (gridType === 'none') return;

    const size = preset.gridSize || 50;
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;

    if (gridType === 'square') {
      ctx.beginPath();
      for (let x = 0; x <= naturalWidth; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, naturalHeight);
      }
      for (let y = 0; y <= naturalHeight; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(naturalWidth, y);
      }
      ctx.stroke();
    } else if (gridType === 'hex') {
      const r = size / 1.732;
      const h = r * Math.sin(Math.PI / 3);
      for (let y = 0; y < naturalHeight + size; y += h * 2) {
        for (let x = 0; x < naturalWidth + size; x += r * 3) {
          drawHexagon(ctx, x, y, r);
          drawHexagon(ctx, x + r * 1.5, y + h, r);
        }
      }
    }
  }, [gridType, naturalWidth, naturalHeight, preset.gridSize]);

  const drawHexagon = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number) => {
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const hx = x + r * Math.cos(angle);
      const hy = y + r * Math.sin(angle);
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.stroke();
  };

  // Redraw ruler
  useEffect(() => {
    const canvas = rulerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, naturalWidth, naturalHeight);
    if (rulerPoints.length < 2) return;

    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 3;
    ctx.setLineDash([8, 6]);

    ctx.beginPath();
    rulerPoints.forEach((pt, idx) => {
      const px = (pt.x / 100) * naturalWidth;
      const py = (pt.y / 100) * naturalHeight;
      if (idx === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
    ctx.setLineDash([]);

    // Draw node circles
    rulerPoints.forEach((pt, idx) => {
      const px = (pt.x / 100) * naturalWidth;
      const py = (pt.y / 100) * naturalHeight;
      ctx.fillStyle = idx === 0 ? '#10b981' : '#f59e0b';
      ctx.beginPath();
      ctx.arc(px, py, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();
    });
  }, [rulerPoints, naturalWidth, naturalHeight]);

  // Handle Fog of War brush action
  const paintFog = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, isReveal: boolean) => {
      const fogCanvas = fogRef.current;
      if (!fogCanvas) return;
      const ctx = fogCanvas.getContext('2d');
      if (!ctx) return;

      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;

      const px = (e.clientX - rect.left) / scale;
      const py = (e.clientY - rect.top) / scale;
      const brushRadius = 90;

      ctx.save();
      if (isReveal) {
        ctx.globalCompositeOperation = 'destination-out';
        const grad = ctx.createRadialGradient(px, py, brushRadius * 0.4, px, py, brushRadius);
        grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(px, py, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(12, 10, 9, 0.95)';
        ctx.beginPath();
        ctx.arc(px, py, brushRadius, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
    [scale, fogRef]
  );

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;
    const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
    const rect = containerRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newScale = Math.min(Math.max(scale * zoomFactor, 0.15), 5);
    const newPanX = mouseX - (mouseX - panX) * (newScale / scale);
    const newPanY = mouseY - (mouseY - panY) * (newScale / scale);

    onTransformChange(newScale, newPanX, newPanY);
  };

  // Mouse Down
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.interactive-marker, .ui-ignore')) {
      return;
    }

    if (toolMode === 'fog_reveal' || toolMode === 'fog_hide') {
      setIsPaintingFog(true);
      paintFog(e, toolMode === 'fog_reveal');
      sound.playFogReveal();
      return;
    }

    if (toolMode === 'add_pin') {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / scale / naturalWidth) * 100;
      const y = ((e.clientY - rect.top) / scale / naturalHeight) * 100;
      sound.playPinClick();
      onAddPinAt(Number(x.toFixed(2)), Number(y.toFixed(2)));
      return;
    }

    if (toolMode === 'measure') {
      const rect = viewportRef.current?.getBoundingClientRect();
      if (!rect) return;
      const x = ((e.clientX - rect.left) / scale / naturalWidth) * 100;
      const y = ((e.clientY - rect.top) / scale / naturalHeight) * 100;
      sound.playRulerPing();
      setRulerPoints((prev) => [...prev, { x, y }]);
      return;
    }

    setIsPanning(true);
    setPanStart({ x: e.clientX - panX, y: e.clientY - panY });
  };

  // Mouse Move
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = viewportRef.current?.getBoundingClientRect();
    if (rect) {
      const px = Math.round((e.clientX - rect.left) / scale);
      const py = Math.round((e.clientY - rect.top) / scale);
      const pctX = Number(((px / naturalWidth) * 100).toFixed(1));
      const pctY = Number(((py / naturalHeight) * 100).toFixed(1));
      setMouseCoords({ x: px, y: py, pctX, pctY });
    }

    if (isPanning) {
      onTransformChange(scale, e.clientX - panStart.x, e.clientY - panStart.y);
      return;
    }

    if (isPaintingFog) {
      paintFog(e, toolMode === 'fog_reveal');
      return;
    }

    if (draggingTokenId && rect) {
      const newPctX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / scale / naturalWidth) * 100));
      const newPctY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / scale / naturalHeight) * 100));
      onUpdateTokenPosition(draggingTokenId, Number(newPctX.toFixed(2)), Number(newPctY.toFixed(2)));
    }
  };

  // Mouse Up
  const handleMouseUp = () => {
    setIsPanning(false);
    setIsPaintingFog(false);
    setDraggingTokenId(null);
  };

  // Calculate distance for ruler
  const calculateTotalDistance = (): { distance: number } => {
    if (rulerPoints.length < 2) return { distance: 0 };
    let totalPixelDist = 0;
    for (let i = 0; i < rulerPoints.length - 1; i++) {
      const p1 = rulerPoints[i];
      const p2 = rulerPoints[i + 1];
      const dx = ((p2.x - p1.x) / 100) * naturalWidth;
      const dy = ((p2.y - p1.y) / 100) * naturalHeight;
      totalPixelDist += Math.sqrt(dx * dx + dy * dy);
    }
    const distUnits = (totalPixelDist / (preset.gridSize || 50)) * preset.scaleDistance;
    return { distance: Math.round(distUnits) };
  };

  const rulerStats = calculateTotalDistance();

  const getPinIcon = (pin: MapPin) => {
    if (pin.portal) return '🚪';
    switch (pin.category) {
      case 'city':
        return '🏛️';
      case 'castle':
        return '🛡️';
      case 'dungeon':
        return '🗝️';
      case 'ruins':
        return '🏛️';
      case 'wonder':
        return '✨';
      case 'danger':
        return '⚔️';
      case 'tavern':
        return '🍺';
      case 'shrine':
        return '⛩️';
      default:
        return '📍';
    }
  };

  return (
    <div
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      className={`relative w-full h-full overflow-hidden bg-stone-950 select-none ${
        isPanning ? 'cursor-grabbing' : toolMode === 'pan' ? 'cursor-grab' : 'cursor-crosshair'
      }`}
    >
      {/* Viewport container with CSS transform */}
      <div
        ref={viewportRef}
        style={{
          width: naturalWidth,
          height: naturalHeight,
          transform: `translate(${panX}px, ${panY}px) scale(${scale})`,
          transformOrigin: '0 0'
        }}
        className="absolute top-0 left-0"
      >
        {/* The Base Map Image */}
        <img
          ref={imgRef}
          src={preset.imageUrl}
          alt={preset.name}
          onLoad={handleImageLoad}
          className="w-full h-full block pointer-events-none"
          draggable={false}
        />

        {/* Grid Canvas Overlay */}
        <canvas
          ref={gridCanvasRef}
          width={naturalWidth}
          height={naturalHeight}
          className="absolute top-0 left-0 pointer-events-none"
        />

        {/* Fog of War Canvas Overlay */}
        <canvas
          ref={fogRef}
          width={naturalWidth}
          height={naturalHeight}
          style={{
            opacity: isGmMode ? 0.35 : 0.98,
            transition: 'opacity 0.2s ease'
          }}
          className="absolute top-0 left-0 pointer-events-none z-10"
        />

        {/* Ruler Line Canvas */}
        <canvas
          ref={rulerCanvasRef}
          width={naturalWidth}
          height={naturalHeight}
          className="absolute top-0 left-0 pointer-events-none z-20"
        />

        {/* POI Markers Layer */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {pins.map((pin) => {
            if (!activeCategories.has(pin.category)) return null;
            if (selectedWardFilter !== 'all' && pin.ward !== selectedWardFilter) return null;
            if (!isGmMode && !pin.isVisibleToPlayers) return null;

            return (
              <div
                key={pin.id}
                onClick={(e) => {
                  e.stopPropagation();
                  sound.playPinClick();
                  onSelectPin(pin);
                }}
                style={{
                  left: `${pin.x}%`,
                  top: `${pin.y}%`
                }}
                className="interactive-marker pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              >
                {/* Pin Circle Marker */}
                <div
                  style={{
                    backgroundColor: pin.color || (pin.portal ? '#9333ea' : '#3b82f6')
                  }}
                  className={`w-8 h-8 rounded-full border-2 border-white shadow-xl flex items-center justify-center text-sm transform transition-all duration-150 group-hover:scale-125 ${
                    pin.portal ? 'ring-2 ring-purple-400 animate-pulse' : ''
                  }`}
                >
                  <span>{getPinIcon(pin)}</span>
                </div>

                {/* Pin Title Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 hidden group-hover:flex flex-col items-center pointer-events-none z-50">
                  <div className="bg-stone-900/95 border border-stone-700 text-stone-100 text-[11px] font-semibold px-2.5 py-1 rounded shadow-xl whitespace-nowrap">
                    {pin.name}
                    {pin.portal && <span className="ml-1 text-purple-300 font-normal">(Portal Planar)</span>}
                    {!pin.isVisibleToPlayers && (
                      <span className="ml-1 text-red-400 font-normal">(Oculto p/ Jogadores)</span>
                    )}
                  </div>
                  <div className="w-1.5 h-1.5 bg-stone-900 border-r border-b border-stone-700 rotate-45 -mt-1" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Tokens Layer (Party, Dabus, Lady of Pain, Monsters) */}
        <div className="absolute inset-0 pointer-events-none z-30">
          {tokens.map((token) => (
            <div
              key={token.id}
              onMouseDown={(e) => {
                e.stopPropagation();
                setDraggingTokenId(token.id);
                onSelectToken(token);
              }}
              style={{
                left: `${token.x}%`,
                top: `${token.y}%`
              }}
              className="interactive-marker pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing group select-none"
            >
              {/* Token Avatar Ring */}
              <div
                style={{
                  borderColor: token.color || '#f59e0b',
                  backgroundColor:
                    token.type === 'party'
                      ? '#b45309'
                      : token.type === 'dabus'
                      ? '#065f46'
                      : token.type === 'npc'
                      ? '#1e3a8a'
                      : '#991b1b'
                }}
                className={`w-10 h-10 rounded-full border-2 shadow-2xl flex items-center justify-center text-lg transform group-hover:scale-110 transition-transform ring-2 ring-black/80 ${
                  token.id === 'token_lady_of_pain' ? 'ring-4 ring-red-600 animate-pulse' : ''
                }`}
              >
                <span>
                  {token.id === 'token_lady_of_pain'
                    ? '👑'
                    : token.type === 'party'
                    ? '⚔️'
                    : token.type === 'dabus'
                    ? '🌿'
                    : token.type === 'npc'
                    ? '🛡️'
                    : '🐉'}
                </span>
              </div>

              {/* Health Bar if defined */}
              {token.maxHp && (
                <div className="w-10 h-1.5 bg-stone-950 rounded-full mt-1 overflow-hidden border border-stone-800">
                  <div
                    style={{
                      width: `${Math.min(100, ((token.hp || 0) / token.maxHp) * 100)}%`
                    }}
                    className={`h-full ${
                      (token.hp || 0) / token.maxHp > 0.5
                        ? 'bg-emerald-500'
                        : (token.hp || 0) / token.maxHp > 0.2
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                  />
                </div>
              )}

              {/* Name label */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0.5 pointer-events-none">
                <span className="bg-stone-900/90 text-stone-200 text-[10px] font-medium px-1.5 py-0.5 rounded border border-stone-800 whitespace-nowrap">
                  {token.name}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating Distance Measurement Badge if ruler is active */}
      {toolMode === 'measure' && rulerPoints.length >= 2 && (
        <div className="absolute bottom-16 left-4 bg-stone-900/95 backdrop-blur-md border border-amber-500/40 rounded-lg p-3 shadow-2xl z-40 flex flex-col gap-1 text-xs">
          <div className="flex items-center justify-between gap-4 font-semibold text-amber-400">
            <span>Distância no Anel:</span>
            <span className="font-mono text-sm text-white">
              {rulerStats.distance} {preset.scaleUnit}
            </span>
          </div>
          <div className="text-[11px] text-stone-400">
            Aproximadamente {Math.round(rulerStats.distance * 15)} minutos de caminhada pelas calçadas curvas.
          </div>
          <div className="flex items-center gap-2 mt-2 pt-1.5 border-t border-stone-800">
            <button
              onClick={() => setRulerPoints([])}
              className="text-[11px] text-stone-400 hover:text-white underline cursor-pointer"
            >
              Limpar Medição
            </button>
          </div>
        </div>
      )}

      {/* Floating Coordinate HUD */}
      <div className="absolute bottom-3 left-4 bg-stone-900/80 backdrop-blur-sm border border-stone-800/80 rounded px-2 py-1 text-[11px] font-mono text-stone-400 pointer-events-none z-30">
        Sigil X: {mouseCoords.x}px, Y: {mouseCoords.y}px ({mouseCoords.pctX}%, {mouseCoords.pctY}%) · Zoom: {Math.round(scale * 100)}%
      </div>
    </div>
  );
};
