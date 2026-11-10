import { MapPreset, MapPin, MapToken, Quest } from '../types/rpg';

export function generateStandaloneHtml(
  preset: MapPreset,
  pins: MapPin[],
  tokens: MapToken[],
  quests: Quest[],
  isGmMode: boolean
): string {
  const mapData = {
    presetName: preset.name,
    presetSubtitle: preset.subtitle,
    imageUrl: preset.imageUrl,
    scaleUnit: preset.scaleUnit,
    scaleDistance: preset.scaleDistance,
    gridType: preset.gridType,
    gridSize: preset.gridSize,
    pins,
    tokens,
    quests
  };

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${preset.name} - Mapa Interativo de RPG</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0c0a09;
      color: #f5f5f4;
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .cinzel { font-family: 'Cinzel', serif; }
    .mono { font-family: 'JetBrains Mono', monospace; }
    header {
      background: #1c1917;
      border-bottom: 1px solid #292524;
      padding: 10px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 50;
      flex-shrink: 0;
    }
    .main-container {
      position: relative;
      flex: 1;
      overflow: hidden;
      background: #171412;
      cursor: grab;
    }
    .main-container.grabbing { cursor: grabbing; }
    #map-viewport {
      position: absolute;
      top: 0; left: 0;
      transform-origin: 0 0;
      user-select: none;
    }
    #map-image {
      display: block;
      max-width: none;
      pointer-events: none;
    }
    #grid-canvas, #fog-canvas {
      position: absolute;
      top: 0; left: 0;
      pointer-events: none;
    }
    .pin-marker {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 4px 10px rgba(0,0,0,0.5), 0 0 0 2px rgba(255,255,255,0.8);
      font-weight: bold;
      font-size: 14px;
      transition: transform 0.15s ease, filter 0.15s ease;
      z-index: 20;
    }
    .pin-marker:hover {
      transform: translate(-50%, -50%) scale(1.25);
      z-index: 30;
      filter: brightness(1.2);
    }
    .token-marker {
      position: absolute;
      transform: translate(-50%, -50%);
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0,0,0,0.7), 0 0 0 3px #f59e0b;
      cursor: move;
      z-index: 25;
      font-size: 18px;
    }
    .ui-toolbar {
      position: absolute;
      top: 16px;
      left: 16px;
      background: rgba(28, 25, 23, 0.92);
      backdrop-filter: blur(8px);
      border: 1px solid #44403c;
      border-radius: 8px;
      padding: 6px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      z-index: 40;
    }
    .ui-btn {
      background: #292524;
      border: 1px solid #44403c;
      color: #e7e5e4;
      padding: 6px 12px;
      border-radius: 6px;
      font-size: 12px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 6px;
      font-family: inherit;
      white-space: nowrap;
    }
    .ui-btn:hover { background: #44403c; color: #fff; }
    .ui-btn.active { background: #b45309; border-color: #d97706; color: #fff; }
    #drawer {
      position: absolute;
      top: 0; right: 0; bottom: 0;
      width: 400px;
      background: #1c1917;
      border-left: 1px solid #292524;
      z-index: 60;
      transform: translateX(100%);
      transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 30px rgba(0,0,0,0.5);
    }
    #drawer.open { transform: translateX(0); }
    .drawer-header {
      padding: 16px 20px;
      border-bottom: 1px solid #292524;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .drawer-content {
      padding: 20px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 16px;
      font-size: 13px;
      line-height: 1.6;
    }
    .drawer-section {
      background: #292524;
      border: 1px solid #44403c;
      border-radius: 8px;
      padding: 12px 14px;
    }
    .drawer-title {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: #a8a29e;
      margin-bottom: 6px;
      font-weight: 600;
    }
    .portal-box {
      background: rgba(147, 51, 234, 0.15);
      border: 1px solid rgba(168, 85, 247, 0.4);
      color: #e9d5ff;
    }
    .gm-only {
      background: rgba(185, 28, 28, 0.15);
      border: 1px solid rgba(220, 38, 38, 0.4);
      color: #fca5a5;
    }
    .dice-dock {
      position: absolute;
      bottom: 16px;
      right: 16px;
      background: rgba(28, 25, 23, 0.95);
      backdrop-filter: blur(8px);
      border: 1px solid #44403c;
      border-radius: 8px;
      padding: 8px 12px;
      display: flex;
      align-items: center;
      gap: 8px;
      z-index: 40;
    }
    .dice-btn {
      background: #292524;
      border: 1px solid #44403c;
      color: #f59e0b;
      font-weight: bold;
      width: 36px;
      height: 36px;
      border-radius: 6px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
    }
    .dice-btn:hover { background: #b45309; color: #fff; }
    #dice-result {
      font-size: 18px;
      font-weight: bold;
      min-width: 50px;
      text-align: center;
      color: #facc15;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 11px;
      border-radius: 4px;
      background: #44403c;
    }
  </style>
</head>
<body>

  <header>
    <div>
      <h1 class="cinzel" style="font-size: 18px; letter-spacing: 0.05em; color: #f59e0b;">${preset.name}</h1>
      <p style="font-size: 12px; color: #a8a29e;">${preset.subtitle}</p>
    </div>
    <div style="display: flex; align-items: center; gap: 10px;">
      <button id="toggle-gm-btn" class="ui-btn ${isGmMode ? 'active' : ''}">
        Modo Mestre: <span id="gm-status">${isGmMode ? 'LIGADO' : 'DESLIGADO'}</span>
      </button>
      <span class="mono" style="font-size: 12px; color: #78716c;" id="coords-display">X: 0, Y: 0</span>
    </div>
  </header>

  <div class="main-container" id="container">
    <div id="map-viewport">
      <img id="map-image" src="${preset.imageUrl}" alt="${preset.name}" onload="initDimensions()" />
      <canvas id="grid-canvas"></canvas>
      <canvas id="fog-canvas"></canvas>
      <div id="pins-layer"></div>
      <div id="tokens-layer"></div>
    </div>

    <!-- Floating Map Controls -->
    <div class="ui-toolbar">
      <button class="ui-btn" onclick="zoomIn()">Zoom +</button>
      <button class="ui-btn" onclick="zoomOut()">Zoom -</button>
      <button class="ui-btn" onclick="resetZoom()">Centralizar</button>
      <div style="height: 1px; background: #44403c; margin: 4px 0;"></div>
      <button class="ui-btn" id="grid-btn" onclick="toggleGrid()">Grade: Hex</button>
      <button class="ui-btn" id="fog-btn" onclick="toggleFogTool()">Névoa: Revelar</button>
      <button class="ui-btn" onclick="resetFog()">Reset Névoa</button>
    </div>

    <!-- Dice Dock -->
    <div class="dice-dock">
      <span style="font-size: 11px; color: #a8a29e; text-transform: uppercase;">Dados:</span>
      <button class="dice-btn mono" onclick="rollDie(4)">d4</button>
      <button class="dice-btn mono" onclick="rollDie(6)">d6</button>
      <button class="dice-btn mono" onclick="rollDie(8)">d8</button>
      <button class="dice-btn mono" onclick="rollDie(10)">d10</button>
      <button class="dice-btn mono" onclick="rollDie(12)">d12</button>
      <button class="dice-btn mono" onclick="rollDie(20)">d20</button>
      <button class="dice-btn mono" onclick="rollDie(100)">d%</button>
      <div id="dice-result" class="mono">-</div>
    </div>

    <!-- Location Detail Drawer -->
    <div id="drawer">
      <div class="drawer-header">
        <div>
          <h2 id="d-name" class="cinzel" style="font-size: 16px; color: #f59e0b;">Local</h2>
          <span id="d-category" class="badge">Categoria</span>
        </div>
        <button class="ui-btn" onclick="closeDrawer()">✕</button>
      </div>
      <div class="drawer-content">
        <div class="drawer-section">
          <div class="drawer-title">Visão Geral</div>
          <p id="d-summary"></p>
        </div>
        <div class="drawer-section" id="d-portal-section" style="display: none;">
          <div class="drawer-title" style="color: #c084fc;">Portal Planar Ativo</div>
          <p id="d-portal-dest" style="font-weight: bold; margin-bottom: 4px;"></p>
          <p id="d-portal-key" style="font-style: italic; color: #fde047;"></p>
        </div>
        <div class="drawer-section">
          <div class="drawer-title">História & Lore de Sigil</div>
          <p id="d-lore"></p>
        </div>
        <div class="drawer-section" id="d-faction-box">
          <div class="drawer-title">Facção / Governante</div>
          <p id="d-faction"></p>
        </div>
        <div class="drawer-section" id="d-rumors-box">
          <div class="drawer-title">Rumores & Ganchos</div>
          <ul id="d-rumors" style="padding-left: 18px;"></ul>
        </div>
        <div class="drawer-section gm-only" id="d-gm-box">
          <div class="drawer-title" style="color: #f87171;">O "Dark" (Segredos do Mestre)</div>
          <p id="d-gm-notes"></p>
        </div>
      </div>
    </div>
  </div>

  <script>
    const DATA = ${JSON.stringify(mapData)};
    let isGM = ${isGmMode};
    let scale = 1;
    let panX = 0;
    let panY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let currentGrid = '${preset.gridType}';
    let fogToolActive = false;

    const container = document.getElementById('container');
    const viewport = document.getElementById('map-viewport');
    const img = document.getElementById('map-image');
    const gridCanvas = document.getElementById('grid-canvas');
    const fogCanvas = document.getElementById('fog-canvas');
    const pinsLayer = document.getElementById('pins-layer');
    const tokensLayer = document.getElementById('tokens-layer');
    const coordsDisplay = document.getElementById('coords-display');

    function updateTransform() {
      viewport.style.transform = \`translate(\${panX}px, \${panY}px) scale(\${scale})\`;
    }

    function initDimensions() {
      const w = img.naturalWidth || 1920;
      const h = img.naturalHeight || 1080;
      viewport.style.width = w + 'px';
      viewport.style.height = h + 'px';
      gridCanvas.width = w;
      gridCanvas.height = h;
      fogCanvas.width = w;
      fogCanvas.height = h;

      const cW = container.clientWidth;
      const cH = container.clientHeight;
      scale = Math.min(cW / w, cH / h) * 0.95;
      panX = (cW - w * scale) / 2;
      panY = (cH - h * scale) / 2;
      updateTransform();

      drawGrid();
      initFog();
      renderPins();
      renderTokens();
    }

    function zoomIn() { scale = Math.min(scale * 1.25, 4); updateTransform(); }
    function zoomOut() { scale = Math.max(scale / 1.25, 0.2); updateTransform(); }
    function resetZoom() { initDimensions(); }

    container.addEventListener('mousedown', (e) => {
      if (e.target.closest('.ui-toolbar, .dice-dock, #drawer, .pin-marker, .token-marker')) return;
      if (fogToolActive) {
        revealFogAt(e);
        return;
      }
      isDragging = true;
      startX = e.clientX - panX;
      startY = e.clientY - panY;
      container.classList.add('grabbing');
    });

    window.addEventListener('mousemove', (e) => {
      if (isDragging) {
        panX = e.clientX - startX;
        panY = e.clientY - startY;
        updateTransform();
      }
      const rect = viewport.getBoundingClientRect();
      const x = Math.round((e.clientX - rect.left) / scale);
      const y = Math.round((e.clientY - rect.top) / scale);
      coordsDisplay.innerText = \`X: \${x}, Y: \${y}\`;
    });

    window.addEventListener('mouseup', () => {
      isDragging = false;
      container.classList.remove('grabbing');
    });

    container.addEventListener('wheel', (e) => {
      e.preventDefault();
      const zoomFactor = e.deltaY < 0 ? 1.15 : 0.85;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const newScale = Math.min(Math.max(scale * zoomFactor, 0.2), 4);
      panX = mouseX - (mouseX - panX) * (newScale / scale);
      panY = mouseY - (mouseY - panY) * (newScale / scale);
      scale = newScale;
      updateTransform();
    }, { passive: false });

    function toggleGrid() {
      const types = ['none', 'square', 'hex'];
      const nextIdx = (types.indexOf(currentGrid) + 1) % types.length;
      currentGrid = types[nextIdx];
      document.getElementById('grid-btn').innerText = 'Grade: ' + currentGrid.toUpperCase();
      drawGrid();
    }

    function drawGrid() {
      const ctx = gridCanvas.getContext('2d');
      ctx.clearRect(0, 0, gridCanvas.width, gridCanvas.height);
      if (currentGrid === 'none') return;

      const size = DATA.gridSize || 50;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;

      if (currentGrid === 'square') {
        ctx.beginPath();
        for (let x = 0; x <= gridCanvas.width; x += size) {
          ctx.moveTo(x, 0); ctx.lineTo(x, gridCanvas.height);
        }
        for (let y = 0; y <= gridCanvas.height; y += size) {
          ctx.moveTo(0, y); ctx.lineTo(gridCanvas.width, y);
        }
        ctx.stroke();
      } else if (currentGrid === 'hex') {
        const r = size / 2;
        const h = r * Math.sin(Math.PI / 3);
        for (let y = 0; y < gridCanvas.height + size; y += h * 2) {
          for (let x = 0; x < gridCanvas.width + size; x += r * 3) {
            drawHexagon(ctx, x, y, r);
            drawHexagon(ctx, x + r * 1.5, y + h, r);
          }
        }
      }
    }

    function drawHexagon(ctx, x, y, r) {
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
    }

    function initFog() {
      const ctx = fogCanvas.getContext('2d');
      ctx.fillStyle = isGM ? 'rgba(10, 10, 12, 0.45)' : 'rgba(10, 10, 12, 0.94)';
      ctx.fillRect(0, 0, fogCanvas.width, fogCanvas.height);
    }

    function resetFog() { initFog(); }

    function toggleFogTool() {
      fogToolActive = !fogToolActive;
      document.getElementById('fog-btn').classList.toggle('active', fogToolActive);
    }

    function revealFogAt(e) {
      const rect = viewport.getBoundingClientRect();
      const x = (e.clientX - rect.left) / scale;
      const y = (e.clientY - rect.top) / scale;
      const ctx = fogCanvas.getContext('2d');

      ctx.save();
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 120, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    function renderPins() {
      pinsLayer.innerHTML = '';
      DATA.pins.forEach(pin => {
        if (!isGM && !pin.isVisibleToPlayers) return;
        const el = document.createElement('div');
        el.className = 'pin-marker';
        el.style.left = pin.x + '%';
        el.style.top = pin.y + '%';
        el.style.backgroundColor = pin.portal ? '#9333ea' : (pin.color || '#3b82f6');
        el.innerText = pin.portal ? '🚪' : (pin.name[0] || '📍');
        el.title = pin.name;
        el.onclick = () => openDrawer(pin);
        pinsLayer.appendChild(el);
      });
    }

    function renderTokens() {
      tokensLayer.innerHTML = '';
      DATA.tokens.forEach(tok => {
        const el = document.createElement('div');
        el.className = 'token-marker';
        el.style.left = tok.x + '%';
        el.style.top = tok.y + '%';
        el.style.backgroundColor = tok.color || '#f59e0b';
        el.innerText = tok.id === 'token_lady_of_pain' ? '👑' : tok.type === 'party' ? '⚔️' : tok.type === 'dabus' ? '🌿' : '🐉';
        el.title = tok.name;
        tokensLayer.appendChild(el);
      });
    }

    function openDrawer(pin) {
      document.getElementById('d-name').innerText = pin.name;
      document.getElementById('d-category').innerText = (pin.wardName || pin.category).toUpperCase();
      document.getElementById('d-summary').innerText = pin.shortSummary || '';
      document.getElementById('d-lore').innerText = pin.lore || '';
      document.getElementById('d-faction').innerText = pin.rulerOrFaction || 'Independente';

      const portalSec = document.getElementById('d-portal-section');
      if (pin.portal) {
        portalSec.style.display = 'block';
        document.getElementById('d-portal-dest').innerText = 'Destino: ' + pin.portal.destinationPlane + ' (' + pin.portal.destinationLocation + ')';
        document.getElementById('d-portal-key').innerText = 'Chave: "' + pin.portal.portalKey + '"';
      } else {
        portalSec.style.display = 'none';
      }

      const rumorsEl = document.getElementById('d-rumors');
      rumorsEl.innerHTML = '';
      if (pin.rumors && pin.rumors.length > 0) {
        pin.rumors.forEach(r => {
          const li = document.createElement('li');
          li.innerText = r;
          rumorsEl.appendChild(li);
        });
      } else {
        rumorsEl.innerHTML = '<li>Nenhum rumor ativo.</li>';
      }

      const gmBox = document.getElementById('d-gm-box');
      if (isGM) {
        gmBox.style.display = 'block';
        document.getElementById('d-gm-notes').innerText = pin.secretGMNotes || 'Nenhum segredo registrado.';
      } else {
        gmBox.style.display = 'none';
      }

      document.getElementById('drawer').classList.add('open');
    }

    function closeDrawer() {
      document.getElementById('drawer').classList.remove('open');
    }

    document.getElementById('toggle-gm-btn').addEventListener('click', () => {
      isGM = !isGM;
      document.getElementById('gm-status').innerText = isGM ? 'LIGADO' : 'DESLIGADO';
      document.getElementById('toggle-gm-btn').classList.toggle('active', isGM);
      initFog();
      renderPins();
    });

    function rollDie(sides) {
      const res = Math.floor(Math.random() * sides) + 1;
      const el = document.getElementById('dice-result');
      el.innerText = res;
      el.style.color = res === sides ? '#22c55e' : (res === 1 ? '#ef4444' : '#facc15');
    }

    window.addEventListener('load', initDimensions);
  </script>
</body>
</html>`;
}
