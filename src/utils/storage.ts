import AsyncStorage from '@react-native-async-storage/async-storage';
import { GameState } from '../types/index';

const GAME_BACKUP_KEY = '@rummy_game_backup';

export const saveGameBackup = async (gameState: GameState): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(gameState);
    await AsyncStorage.setItem(GAME_BACKUP_KEY, jsonValue);
  } catch (e) {
    console.error('Error saving game backup:', e);
  }
};

export const loadGameBackup = async (): Promise<GameState | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(GAME_BACKUP_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error('Error loading game backup:', e);
    return null;
  }
};

export const clearGameBackup = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(GAME_BACKUP_KEY);
  } catch (e) {
    console.error('Error clearing game backup:', e);
  }
};

export const exportGameData = async (gameState: GameState): Promise<string> => {
  return JSON.stringify(gameState, null, 2);
};

export const importGameData = (jsonString: string): GameState | null => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    console.error('Error parsing game data:', e);
    return null;
  }
};

