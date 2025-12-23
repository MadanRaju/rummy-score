import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameConfig } from '../../types/index';
import { DEFAULT_CONFIGS } from '../../constants/defaultConfigs';

interface ConfigState {
  configs: GameConfig[];
  selectedConfigId: string;
}

const initialState: ConfigState = {
  configs: DEFAULT_CONFIGS,
  selectedConfigId: 'standard',
};

const configSlice = createSlice({
  name: 'config',
  initialState,
  reducers: {
    addConfig: (state, action: PayloadAction<GameConfig>) => {
      state.configs.push(action.payload);
    },

    updateConfig: (state, action: PayloadAction<GameConfig>) => {
      const index = state.configs.findIndex((c) => c.id === action.payload.id);
      if (index !== -1) {
        state.configs[index] = action.payload;
      }
    },

    deleteConfig: (state, action: PayloadAction<string>) => {
      state.configs = state.configs.filter((c) => c.id !== action.payload);
      if (state.selectedConfigId === action.payload) {
        state.selectedConfigId = 'standard';
      }
    },

    selectConfig: (state, action: PayloadAction<string>) => {
      state.selectedConfigId = action.payload;
    },

    loadConfigs: (state, action: PayloadAction<GameConfig[]>) => {
      state.configs = action.payload;
    },
  },
});

export const {
  addConfig,
  updateConfig,
  deleteConfig,
  selectConfig,
  loadConfigs,
} = configSlice.actions;

export default configSlice.reducer;

