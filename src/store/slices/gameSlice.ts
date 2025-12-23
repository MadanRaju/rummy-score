import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState, GameConfig, Player, GameRound, RoundAction } from '../../types/index';

const initialState: GameState = {
  gameId: '',
  isActive: false,
  currentRound: 0,
  players: [],
  rounds: [],
  config: {
    id: 'standard',
    name: 'Standard Rules',
    firstDropPenalty: 20,
    middleDropPenalty: 40,
    fullCountPenalty: 80,
    maxScore: 250,
    isDefault: true,
  },
  isPaused: false,
};

const gameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    startNewGame: (
      state,
      action: PayloadAction<{ players: Player[]; config: GameConfig }>
    ) => {
      state.gameId = Date.now().toString();
      state.isActive = true;
      state.startedAt = Date.now();
      state.currentRound = 0;
      state.players = action.payload.players;
      state.rounds = [];
      state.config = action.payload.config;
      state.isPaused = false;
    },

    addRound: (state, action: PayloadAction<GameRound>) => {
      state.rounds.push(action.payload);
      state.currentRound = action.payload.roundNumber;

      // Update player scores
      state.players = state.players.map((player) => {
        const roundScore = action.payload.scores[player.id] || 0;
        const newTotalScore = player.totalScore + roundScore;

        // Check for elimination
        const isEliminated = newTotalScore >= state.config.maxScore;

        return {
          ...player,
          totalScore: newTotalScore,
          gamesPlayed: player.gamesPlayed + 1,
          isEliminated,
          eliminatedAt: isEliminated && !player.isEliminated 
            ? action.payload.roundNumber 
            : player.eliminatedAt,
        };
      });
    },

    updateRound: (state, action: PayloadAction<{ roundNumber: number; round: GameRound }>) => {
      const { roundNumber, round } = action.payload;
      const roundIndex = state.rounds.findIndex((r) => r.roundNumber === roundNumber);
      
      if (roundIndex === -1) return;

      // Update the round
      state.rounds[roundIndex] = round;

      // Recalculate all player scores from scratch
      // Reset player scores to initial state
      state.players = state.players.map((player) => ({
        ...player,
        totalScore: 0,
        gamesPlayed: 0,
        isEliminated: false,
        eliminatedAt: undefined,
      }));

      // Sort all rounds by round number and recalculate scores sequentially
      const sortedRounds = [...state.rounds].sort((a, b) => a.roundNumber - b.roundNumber);

      sortedRounds.forEach((processedRound) => {
        state.players = state.players.map((player) => {
          const roundScore = processedRound.scores[player.id] || 0;
          const newTotalScore = player.totalScore + roundScore;
          const wasEliminated = player.isEliminated;
          const isEliminated = newTotalScore >= state.config.maxScore;

          return {
            ...player,
            totalScore: newTotalScore,
            gamesPlayed: player.gamesPlayed + 1,
            isEliminated,
            eliminatedAt: isEliminated && !wasEliminated 
              ? processedRound.roundNumber 
              : player.eliminatedAt,
          };
        });
      });
    },

    updatePlayerScore: (
      state,
      action: PayloadAction<{ playerId: string; score: number }>
    ) => {
      const player = state.players.find((p) => p.id === action.payload.playerId);
      if (player) {
        player.totalScore = action.payload.score;
        player.isEliminated = player.totalScore >= state.config.maxScore;
      }
    },

    removePlayer: (state, action: PayloadAction<string>) => {
      state.players = state.players.map((p) =>
        p.id === action.payload ? { ...p, isActive: false } : p
      );
    },

    reEntryPlayer: (state, action: PayloadAction<string>) => {
      // Find the highest score among active players
      const activePlayers = state.players.filter((p) => p.isActive && !p.isEliminated);
      const highestScore = activePlayers.length > 0
        ? Math.max(...activePlayers.map((p) => p.totalScore))
        : 0;

      state.players = state.players.map((p) =>
        p.id === action.payload
          ? {
              ...p,
              isEliminated: false,
              isActive: true,
              totalScore: highestScore, // Set score to current highest active player's score
              reEntryCount: p.reEntryCount + 1,
              eliminatedAt: undefined,
            }
          : p
      );
    },

    addPlayerMidGame: (state, action: PayloadAction<Player>) => {
      // Find the highest score among active players
      const activePlayers = state.players.filter((p) => p.isActive && !p.isEliminated);
      const highestScore = activePlayers.length > 0
        ? Math.max(...activePlayers.map((p) => p.totalScore))
        : 0;

      // Add the new player with score equal to highest active player's score
      const newPlayer = {
        ...action.payload,
        totalScore: highestScore,
        isActive: true,
        isEliminated: false,
        gamesPlayed: 0,
        reEntryCount: 0,
      };
      state.players.push(newPlayer);

      // Add the new player to all previous rounds with score 0
      // This ensures they have entries in all rounds for proper recalculation
      state.rounds.forEach((round) => {
        if (round.scores[newPlayer.id] === undefined) {
          round.scores[newPlayer.id] = 0;
        }
      });

      // To preserve the starting score when recalculating, add it to the first round
      // This way, when updateRound recalculates, the sum will be correct
      // Note: This modifies historical round data, but it's necessary to preserve the score
      if (state.rounds.length > 0) {
        const firstRound = state.rounds[0];
        // Store the starting score in the first round
        firstRound.scores[newPlayer.id] = highestScore;
      }
    },

    pauseGame: (state) => {
      state.isPaused = true;
    },

    resumeGame: (state) => {
      state.isPaused = false;
    },

    endGame: (state) => {
      state.isActive = false;
      state.isPaused = false;
    },

    resetGame: () => initialState,

    loadGame: (state, action: PayloadAction<GameState>) => {
      return action.payload;
    },
  },
});

export const {
  startNewGame,
  addRound,
  updateRound,
  updatePlayerScore,
  removePlayer,
  reEntryPlayer,
  addPlayerMidGame,
  pauseGame,
  resumeGame,
  endGame,
  resetGame,
  loadGame,
} = gameSlice.actions;

export default gameSlice.reducer;

