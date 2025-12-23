import { GameConfig } from '../types/index';

export const DEFAULT_CONFIGS: GameConfig[] = [
  {
    id: 'standard',
    name: 'Standard Rules',
    firstDropPenalty: 20,
    middleDropPenalty: 40,
    fullCountPenalty: 80,
    maxScore: 250,
    isDefault: true,
  },
  {
    id: 'quick',
    name: 'Quick Game',
    firstDropPenalty: 15,
    middleDropPenalty: 30,
    fullCountPenalty: 60,
    maxScore: 150,
  },
  {
    id: 'high-stakes',
    name: 'High Stakes',
    firstDropPenalty: 25,
    middleDropPenalty: 50,
    fullCountPenalty: 100,
    maxScore: 500,
  },
];

// Material You (Material Design 3) Color Palette
export const COLORS = {
  primary: '#6750A4', // Material You primary purple
  secondary: '#625B71',
  success: '#4CAF50', // Material You success green
  warning: '#FF9800', // Material You warning orange
  danger: '#BA1A1A', // Material You error red
  background: '#1C1B1F', // Material You dark background
  surface: '#1C1B1F',
  card: '#49454F', // Material You surface variant
  text: '#E6E1E5', // Material You on-surface
  textSecondary: '#CAC4D0', // Material You on-surface variant
  border: '#938F99', // Material You outline
  accent: '#6750A4', // Same as primary
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const MAX_PLAYERS = 9;
export const MIN_PLAYERS = 2;

