export type PinCategory =
  | 'city'
  | 'castle'
  | 'dungeon'
  | 'ruins'
  | 'shrine'
  | 'danger'
  | 'wonder'
  | 'tavern'
  | 'camp'
  | 'port'
  | 'portal'
  | 'faction';

export interface PlanarPortal {
  destinationPlane: string;
  destinationLocation: string;
  portalKey: string;
  appearance: string;
  dangerRating: 'Baixo' | 'Médio' | 'Alto' | 'Letal';
}

export interface MapPin {
  id: string;
  name: string;
  ward?: 'lady' | 'clerk' | 'hive' | 'lower' | 'market' | 'guildhall' | 'undersigil';
  wardName?: string;
  category: PinCategory;
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  shortSummary: string;
  lore: string;
  dangerLevel: 1 | 2 | 3 | 4 | 5;
  rulerOrFaction?: string;
  factions?: string[];
  rumors?: string[];
  secretGMNotes?: string;
  loot?: string[];
  portal?: PlanarPortal;
  isVisibleToPlayers: boolean;
  color?: string;
}

export interface MapToken {
  id: string;
  name: string;
  type: 'party' | 'monster' | 'npc' | 'ally' | 'dabus';
  x: number; // percentage 0 - 100
  y: number; // percentage 0 - 100
  hp?: number;
  maxHp?: number;
  label?: string;
  color?: string;
}

export type GridType = 'none' | 'square' | 'hex';

export interface MapPreset {
  id: string;
  name: string;
  subtitle: string;
  imageUrl: string;
  streetViewUrl?: string;
  scaleUnit: string; // e.g. "Léguas", "Passos", "Quarteirões"
  scaleDistance: number;
  gridType: GridType;
  gridSize: number;
  initialPins: MapPin[];
  initialTokens: MapToken[];
}

export interface Quest {
  id: string;
  title: string;
  locationId?: string;
  description: string;
  giver: string;
  reward: string;
  status: 'active' | 'completed' | 'failed';
  objectives: { text: string; done: boolean }[];
}

export interface DiceRoll {
  id: string;
  timestamp: string;
  die: number;
  quantity: number;
  modifier: number;
  rolls: number[];
  total: number;
  isCrit: boolean;
  isFumble: boolean;
  label?: string;
}

export type WeatherType = 'clear' | 'fog' | 'rain' | 'storm' | 'night' | 'sunset' | 'smog';

export type ToolMode = 'pan' | 'add_pin' | 'measure' | 'fog_reveal' | 'fog_hide';
