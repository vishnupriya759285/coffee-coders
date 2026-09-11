// Core TypeScript interfaces for Ithinoru Pattu AI Music Experience

export type PeopleMode = 'one' | 'duo' | 'couple' | 'trio' | 'group';

export interface Cue {
  label: string;
  score: number;
}

export interface ColorCue {
  name: string;
  tone: string;
  hex: string;
  percentage?: number;
  isDark: boolean;
  isBright: boolean;
  isWarm: boolean;
  isCool: boolean;
  vibeSignal: string; // e.g., 'dark / edgy', 'intense / energetic', 'clean / minimal'
}

export interface PatternCue {
  name: string;
  score: number;
  energyBonus: number;
  vibeBonus: { dim: keyof VibeVectorDimensions; value: number };
}

export interface GraphicCue {
  name: string;
  semanticMeaning: string;
  genreInfluence: string;
  score: number;
}

export interface TextCue {
  rawText: string;
  semanticSignal: string;
  genreAffinity: string;
  confidence: number;
  matchedSongId?: string;
  matchReason?: string;
}

export interface AccessoryCue {
  name: string;
  score: number;
  vibeInfluence: string;
  bonus: { dim: keyof VibeVectorDimensions; value: number };
}

export interface ObjectCue {
  name: string;
  score: number;
  context: string;
  genreInfluence: string;
}

export interface ExpressionModifier {
  name: string;
  modifier: string;
  energyShift: number;
}

export interface PersonAnalysis {
  id: number;
  clothingType: string;
  clothingStyle: string;
  clothingPattern: string;
  clothingColors: ColorCue[];
  graphics: GraphicCue[];
  detectedText?: TextCue;
  hairstyle: string;
  glasses: string;
  accessories: AccessoryCue[];
  heldObjects: ObjectCue[];
  expression: string;
  aesthetic: string;
  vibeDimensions: VibeVectorDimensions;
}

export interface VibeVectorDimensions {
  energy: number;   // 0 - 100
  edge: number;     // 0 - 100
  playful: number;  // 0 - 100
  dreamy: number;   // 0 - 100
  classy: number;   // 0 - 100
  street: number;   // 0 - 100
}

export interface VibeVector extends VibeVectorDimensions {
  dominantVibe: string;
  secondaryVibes: string[];
}

export interface DuoAnalysis {
  personA: PersonAnalysis;
  personB: PersonAnalysis;
  combinedVibe: string;
  hasConflict: boolean;
  conflictDetails?: string;
  selectedSoundtrackVibe: string;
}

export interface GroupAnalysis {
  peopleCount: number;
  groupEnergy: number;       // e.g., 94%
  styleDiversity: number;    // e.g., 85%
  dominantColor: string;
  dominantAesthetic: string;
  groupVibeTitle: string;    // e.g., "CHAOTIC ENERGY 94%", "TOO MANY MAIN CHARACTERS"
  groupTags: string[];       // e.g., ["CHAOTIC", "HYPE", "PARTY", "UNHINGED"]
  auxWinner: {
    personIndex: number;
    personLabel: string;
    energyScore: number;
    reason: string;
  };
}

export interface SceneAnalysis {
  mode: PeopleMode;
  peopleCount: number;
  primaryPerson?: PersonAnalysis;
  duo?: DuoAnalysis;
  group?: GroupAnalysis;
  dominantColors: ColorCue[];
  activeCues: string[];
  vibeVector: VibeVector;
  timestamp: number;
}

export interface SongExplanationItem {
  icon: string;
  title: string;
  detail: string;
  influence: string;
}

export interface SongExplanation {
  items: SongExplanationItem[];
  finalVibe: string;
  matchScore: number;
}

export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  genre: string;
  language: string;
  emoji: string;
  category: 'street' | 'dreamy' | 'chill' | 'playful' | 'romantic' | 'dramatic' | 'classy';
  spotifyId: string;
  audioPreviewUrl?: string;
  artworkUrl?: string;
  synthPreset?: 'drill' | 'ambient' | 'synthpop' | 'lofi' | 'rage' | 'jazz' | 'melody' | 'kuthu';
  vibeTag: string;
  bestFit: string;
  vibeVector: VibeVectorDimensions;
}

export interface OutfitAsSongResult {
  songTitle: string;
  artist: string;
  genre: string;
  vibeFormula: string; // e.g. "DREAMY × NIGHT × URBAN"
  aestheticCard: string;
}

export interface VibeHistoryEntry {
  id: string;
  timestamp: string;
  vibeTitle: string;
  dominantVibe: string;
  songTitle: string;
  songArtist: string;
  mode: PeopleMode;
  keyCues: string[];
}

export interface VibeSnapshot {
  id: string;
  snapshotNumber: number;
  date: string;
  time: string;
  vibe: string;
  energy: number;
  edge: number;
  playful: number;
  dreamy: number;
  classy: number;
  street: number;
  colors: string[];
  pattern: string;
  detectedText?: string;
  song: {
    title: string;
    artist: string;
    genre: string;
  };
  keyCues: string[];
}
