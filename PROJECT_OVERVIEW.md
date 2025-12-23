# 📋 Project Overview

A comprehensive overview of the Rummy Score Tracker application architecture and implementation.

## 🏗 Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   React Native App                   │
├─────────────────────────────────────────────────────┤
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Screens │  │Components│  │    Navigation    │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │             │                  │             │
│       └─────────────┴──────────────────┘             │
│                     │                                │
│              ┌──────┴──────┐                         │
│              │Redux Store  │                         │
│              ├─────────────┤                         │
│              │ gameSlice   │                         │
│              │ configSlice │                         │
│              │ playerSlice │                         │
│              └──────┬──────┘                         │
│                     │                                │
│              ┌──────┴──────────┐                     │
│              │  Redux Persist  │                     │
│              │  (AsyncStorage) │                     │
│              └─────────────────┘                     │
│                                                       │
└─────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
rummy-score/
│
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Button.tsx       # Custom button component
│   │   ├── PlayerCard.tsx   # Player display card
│   │   └── index.ts         # Component exports
│   │
│   ├── constants/           # App-wide constants
│   │   └── defaultConfigs.ts # Default game configs, colors, spacing
│   │
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx # Main navigation structure
│   │
│   ├── screens/            # Screen components
│   │   ├── HomeScreen.tsx           # Landing screen
│   │   ├── NewGameScreen.tsx        # Game setup
│   │   ├── ActiveGameScreen.tsx     # Live game scoring
│   │   ├── ScoreboardScreen.tsx     # Detailed scores
│   │   ├── ConfigPresetsScreen.tsx  # Manage presets
│   │   └── PlayerManagementScreen.tsx # Manage players
│   │
│   ├── store/              # Redux state management
│   │   ├── slices/
│   │   │   ├── gameSlice.ts    # Game state & actions
│   │   │   ├── configSlice.ts  # Config state & actions
│   │   │   └── playerSlice.ts  # Player state & actions
│   │   ├── hooks.ts            # Typed Redux hooks
│   │   └── index.ts            # Store configuration
│   │
│   ├── theme/              # Theme configuration
│   │   └── index.ts        # Colors, spacing, typography
│   │
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # All type definitions
│   │
│   └── utils/              # Utility functions
│       └── storage.ts      # Storage helpers
│
├── assets/                 # Images, icons, fonts
│
├── App.tsx                # App entry point
├── app.json               # Expo configuration
├── package.json           # Dependencies
├── tsconfig.json          # TypeScript config
├── babel.config.js        # Babel config
├── metro.config.js        # Metro bundler config
│
├── README.md              # Main documentation
├── SETUP.md               # Setup instructions
├── QUICKSTART.md          # Quick start guide
├── CHANGELOG.md           # Version history
├── CONTRIBUTING.md        # Contribution guidelines
├── LICENSE                # MIT License
└── .gitignore            # Git ignore rules
```

## 🔄 Data Flow

### Game Creation Flow

```
User Input → NewGameScreen
           ↓
    Dispatch startNewGame()
           ↓
    Redux Store (gameSlice)
           ↓
    Redux Persist
           ↓
    AsyncStorage
           ↓
    Navigate to ActiveGameScreen
```

### Score Entry Flow

```
User enters scores → ActiveGameScreen
                   ↓
            Validate inputs
                   ↓
            Create GameRound
                   ↓
         Dispatch addRound()
                   ↓
         Update player scores
                   ↓
         Check for elimination
                   ↓
         Update Redux Store
                   ↓
         Auto-save to storage
```

## 🗂 State Management

### Redux Slices

#### 1. Game Slice
```typescript
{
  gameId: string,
  isActive: boolean,
  currentRound: number,
  players: Player[],
  rounds: GameRound[],
  config: GameConfig,
  isPaused: boolean
}
```

**Actions:**
- `startNewGame` - Initialize new game
- `addRound` - Add round scores
- `removePlayer` - Remove player
- `reEntryPlayer` - Allow re-entry
- `endGame` - End current game
- `loadGame` - Restore saved game

#### 2. Config Slice
```typescript
{
  configs: GameConfig[],
  selectedConfigId: string
}
```

**Actions:**
- `addConfig` - Create new preset
- `updateConfig` - Modify preset
- `deleteConfig` - Remove preset
- `selectConfig` - Set default preset

#### 3. Player Slice
```typescript
{
  savedPlayers: SavedPlayer[]
}
```

**Actions:**
- `addSavedPlayer` - Save new player
- `updateSavedPlayer` - Update player
- `deleteSavedPlayer` - Remove player
- `updatePlayerLastUsed` - Track usage

## 🎨 UI Components

### Screen Components

1. **HomeScreen**
   - Entry point
   - Shows active game
   - Navigation to other screens
   - Quick stats

2. **NewGameScreen**
   - Select game config
   - Add/select players
   - Validate setup
   - Start game

3. **ActiveGameScreen**
   - Display active players
   - Enter round scores
   - Quick score buttons
   - Player management
   - Show eliminated players

4. **ScoreboardScreen**
   - Summary view (leaderboard)
   - Detailed view (round-by-round)
   - Game statistics
   - Round history

5. **ConfigPresetsScreen**
   - List all presets
   - Create/edit presets
   - Delete custom presets
   - Set default preset

6. **PlayerManagementScreen**
   - Add new players
   - Edit player names
   - Delete players
   - View player stats

### Reusable Components

- **Button** - Styled button with variants
- **PlayerCard** - Player info display with progress

## 🔐 Data Persistence

### AsyncStorage Structure

```
@rummy_game_backup     → Current game state
persist:root           → Redux persist root
  ├── persist:game     → Game slice
  ├── persist:config   → Config slice
  └── persist:player   → Player slice
```

### Auto-save Triggers

- Game start
- Round completion
- Player addition/removal
- Config changes
- Player profile updates
- App background/close

## 🎯 Key Features Implementation

### 1. Auto-elimination

```typescript
// In gameSlice.ts - addRound reducer
const newTotalScore = player.totalScore + roundScore;
const isEliminated = newTotalScore >= state.config.maxScore;
```

### 2. Re-entry

```typescript
// In gameSlice.ts - reEntryPlayer reducer
player.isEliminated = false;
player.isActive = true;
player.reEntryCount += 1;
```

### 3. Quick Score Entry

```typescript
// Preset buttons in ActiveGameScreen
handleQuickScore(playerId, 'FIRST_DROP');
// Sets score to config.firstDropPenalty
```

### 4. Progress Visualization

```typescript
// Color-coded based on percentage
const percentage = score / maxScore;
if (percentage >= 0.8) return DANGER;
if (percentage >= 0.5) return WARNING;
return SUCCESS;
```

## 🛠 Technical Decisions

### Why Expo?
- Faster development
- Easy testing
- Cross-platform build
- Great developer experience
- Good community support

### Why Redux Toolkit?
- Standard Redux solution
- Less boilerplate
- Built-in best practices
- Great TypeScript support
- Redux Persist integration

### Why React Native Paper?
- Material Design
- Consistent UI
- Comprehensive components
- Theming support
- Accessibility built-in

### Why TypeScript?
- Type safety
- Better IDE support
- Easier refactoring
- Self-documenting code
- Catch errors early

## 🚀 Performance Considerations

### Optimizations

1. **Memoization**
   - Use `useMemo` for expensive calculations
   - Use `React.memo` for pure components

2. **Lazy Loading**
   - Screens loaded on demand
   - Images optimized

3. **State Updates**
   - Batch Redux updates
   - Selective re-renders

4. **Storage**
   - Debounced saves
   - Efficient serialization

## 🔮 Future Enhancements

### Phase 2 Features
- Game history archive
- Player statistics
- Export/Import data
- Cloud sync
- Multiple game variants

### Phase 3 Features
- Social features
- Tournaments
- Analytics dashboard
- Custom themes
- Localization

### Phase 4 Features
- Screen casting (Chromecast)
- Voice input
- Widgets
- Companion apps

## 📊 Type System

### Core Types

```typescript
Player          → Individual player in game
GameRound       → Single round scores
RoundAction     → Score entry action
GameConfig      → Game rules preset
GameState       → Complete game state
SavedPlayer     → Saved player profile
NavigationParams → Navigation structure
```

## 🎓 Learning Resources

### For New Contributors

1. **React Native**: [reactnative.dev](https://reactnative.dev/)
2. **Redux Toolkit**: [redux-toolkit.js.org](https://redux-toolkit.js.org/)
3. **TypeScript**: [typescriptlang.org](https://www.typescriptlang.org/)
4. **Expo**: [docs.expo.dev](https://docs.expo.dev/)
5. **React Navigation**: [reactnavigation.org](https://reactnavigation.org/)

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## 📝 Notes

- Follow existing patterns
- Keep components focused
- Write meaningful comments
- Test on both platforms
- Update documentation

---

Last updated: 2024-11-28

