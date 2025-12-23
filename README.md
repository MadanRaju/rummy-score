# 🃏 Rummy Score Tracker

A modern, feature-rich React Native application for tracking Rummy game scores with support for multiple players, custom game rules, and detailed scoring history.

## ✨ Features

### Core Functionality
- 🎮 **Multi-player Support** - Track scores for up to 9 players per game
- 👥 **Player Management** - Save and manage player profiles for quick game setup
- ⚙️ **Custom Game Presets** - Create and save custom rule configurations
  - First Drop penalty
  - Middle Drop penalty
  - Full Count penalty
  - Maximum score (elimination threshold)
- 📊 **Comprehensive Scoreboard** - View current standings and detailed round-by-round history
- 💾 **Auto-save** - Automatic game state persistence - resume anytime
- 🚫 **Auto-elimination** - Players automatically removed when reaching max score
- ↻ **Re-entry Support** - Allow eliminated players to rejoin the game
- 🎯 **Quick Score Entry** - Fast scoring with preset penalty buttons
- 📺 **Screen Casting** - Cast to TV (Chromecast support)

### User Experience
- 🌙 **Dark Mode Design** - Beautiful, modern dark theme
- 📱 **Responsive UI** - Clean and intuitive interface
- 🎨 **Visual Progress Indicators** - Color-coded score progress bars
- 🏆 **Leaderboard** - Real-time rankings with podium positions
- 📈 **Game Statistics** - Track games played, active players, and more

## 🛠 Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **State Management**: Redux Toolkit
- **Persistence**: AsyncStorage with Redux Persist
- **UI Library**: React Native Paper
- **Navigation**: React Navigation v6
- **Build Tool**: Expo

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI (optional, but recommended)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd rummy-score
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - **iOS**: Press `i` or scan QR code with Camera app
   - **Android**: Press `a` or scan QR code with Expo Go app
   - **Web**: Press `w` (for testing only)

## 📱 Usage

### Starting a New Game

1. **Select Game Rules**
   - Choose from preset configurations (Standard, Quick, High Stakes)
   - Or create your own custom rules

2. **Add Players**
   - Select from saved players
   - Or add new players on the fly
   - Minimum 2 players, maximum 9 players

3. **Start Playing**
   - Enter scores after each round
   - Use quick buttons for common penalties (First Drop, Middle Drop, Full Count)
   - Players are automatically eliminated when reaching max score

### Managing Players

- Navigate to **Player Management** from home screen
- Add new players to save them for future games
- Edit or delete existing players
- View player statistics (games played, last used)

### Creating Custom Presets

- Go to **Game Presets** from home screen
- Tap the **+** button to create new preset
- Set custom values for:
  - First Drop Penalty
  - Middle Drop Penalty
  - Full Count Penalty
  - Maximum Score (elimination threshold)
- Save and use in future games

### Viewing Scoreboard

- Access detailed scoreboard during active game
- Switch between **Summary** and **Detailed** views
- Summary shows current standings and statistics
- Detailed shows round-by-round scores for all players

## 🎮 Game Features

### Scoring Rules

The app supports standard Rummy scoring penalties:
- **First Drop**: Player drops in first round (default: 20 points)
- **Middle Drop**: Player drops mid-game (default: 40 points)
- **Full Count**: Invalid declaration (default: 80 points)
- **Custom Scores**: Enter any score manually

### Player States

- **Active**: Currently playing in the game
- **Eliminated**: Reached maximum score threshold
- **Retired**: Manually removed from game
- **Re-entered**: Eliminated player rejoining the game

### Data Persistence

- All game data is automatically saved to local storage
- Resume interrupted games seamlessly
- Player profiles and presets persist across app sessions
- Game history available for review

## 🚀 Upcoming Features

- [ ] Export/Import game data
- [ ] Game history with past games
- [ ] Detailed player statistics
- [ ] Multiple game variants (Points Rummy, Pool Rummy, etc.)
- [ ] Social features (share scores)
- [ ] Dark/Light theme toggle
- [ ] Localization support
- [ ] Sound effects and animations

## 🏗 Project Structure

```
rummy-score/
├── src/
│   ├── components/       # Reusable UI components
│   ├── constants/        # App constants and default configs
│   ├── navigation/       # Navigation configuration
│   ├── screens/         # Screen components
│   │   ├── HomeScreen.tsx
│   │   ├── NewGameScreen.tsx
│   │   ├── ActiveGameScreen.tsx
│   │   ├── ScoreboardScreen.tsx
│   │   ├── ConfigPresetsScreen.tsx
│   │   └── PlayerManagementScreen.tsx
│   ├── store/           # Redux store and slices
│   │   ├── slices/
│   │   │   ├── gameSlice.ts
│   │   │   ├── configSlice.ts
│   │   │   └── playerSlice.ts
│   │   ├── hooks.ts
│   │   └── index.ts
│   ├── theme/           # Theme configuration
│   ├── types/           # TypeScript type definitions
│   └── utils/           # Utility functions
├── App.tsx              # App entry point
├── app.json            # Expo configuration
├── package.json        # Dependencies
└── tsconfig.json       # TypeScript configuration
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- React Native Paper for the beautiful UI components
- Redux Toolkit for state management
- Expo for the amazing development experience

