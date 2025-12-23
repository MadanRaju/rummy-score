export interface Player {
  id: string;
  name: string;
  totalScore: number;
  isActive: boolean;
  isEliminated: boolean;
  gamesPlayed: number;
  eliminatedAt?: number; // Round number when eliminated
  reEntryCount: number;
}

export interface GameRound {
  roundNumber: number;
  scores: Record<string, number>; // playerId -> score
  timestamp: number;
  actions: RoundAction[];
}

export interface RoundAction {
  playerId: string;
  actionType: 'NORMAL' | 'FIRST_DROP' | 'MIDDLE_DROP' | 'FULL_COUNT';
  score: number;
  timestamp: number;
}

export interface GameConfig {
  id: string;
  name: string;
  firstDropPenalty: number;
  middleDropPenalty: number;
  fullCountPenalty: number;
  maxScore: number; // Jackpot/elimination score
  isDefault?: boolean;
}

export interface GameState {
  gameId: string;
  isActive: boolean;
  startedAt?: number;
  currentRound: number;
  players: Player[];
  rounds: GameRound[];
  config: GameConfig;
  isPaused: boolean;
}

export interface SavedPlayer {
  id: string;
  name: string;
  gamesPlayed: number;
  lastUsed: number;
}

export type NavigationParams = {
  Home: undefined;
  NewGame: undefined;
  ActiveGame: undefined;
  Scoreboard: undefined;
  GameHistory: undefined;
  Settings: undefined;
  ConfigPresets: undefined;
  PlayerManagement: undefined;
};

