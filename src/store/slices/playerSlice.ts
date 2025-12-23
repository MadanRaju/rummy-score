import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SavedPlayer } from '../../types/index';

interface PlayerState {
  savedPlayers: SavedPlayer[];
}

const initialState: PlayerState = {
  savedPlayers: [],
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    addSavedPlayer: (state, action: PayloadAction<SavedPlayer>) => {
      const existingIndex = state.savedPlayers.findIndex(
        (p) => p.id === action.payload.id
      );
      if (existingIndex !== -1) {
        state.savedPlayers[existingIndex] = action.payload;
      } else {
        state.savedPlayers.push(action.payload);
      }
    },

    updateSavedPlayer: (state, action: PayloadAction<SavedPlayer>) => {
      const index = state.savedPlayers.findIndex(
        (p) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.savedPlayers[index] = action.payload;
      }
    },

    deleteSavedPlayer: (state, action: PayloadAction<string>) => {
      state.savedPlayers = state.savedPlayers.filter(
        (p) => p.id !== action.payload
      );
    },

    updatePlayerLastUsed: (state, action: PayloadAction<string>) => {
      const player = state.savedPlayers.find((p) => p.id === action.payload);
      if (player) {
        player.lastUsed = Date.now();
        player.gamesPlayed += 1;
      }
    },

    loadSavedPlayers: (state, action: PayloadAction<SavedPlayer[]>) => {
      state.savedPlayers = action.payload;
    },
  },
});

export const {
  addSavedPlayer,
  updateSavedPlayer,
  deleteSavedPlayer,
  updatePlayerLastUsed,
  loadSavedPlayers,
} = playerSlice.actions;

export default playerSlice.reducer;

