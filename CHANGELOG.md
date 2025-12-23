# Changelog

All notable changes to the Rummy Score Tracker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-11-28

### 🎉 Initial Release

#### Added
- **Multi-player Support**: Track scores for up to 9 players
- **Player Management**: Save and manage player profiles
- **Custom Game Presets**: Create and save custom scoring rules
  - First Drop penalty configuration
  - Middle Drop penalty configuration
  - Full Count penalty configuration
  - Maximum score (elimination) threshold
- **Comprehensive Scoreboard**: 
  - Summary view with leaderboard
  - Detailed round-by-round breakdown
  - Real-time statistics
- **Auto-save Functionality**: Automatic game state persistence
- **Auto-elimination**: Players removed at max score threshold
- **Re-entry Support**: Allow eliminated players to rejoin
- **Quick Score Entry**: Fast scoring with preset penalty buttons
- **Visual Progress Indicators**: Color-coded score bars
- **Modern Dark Theme UI**: Clean, intuitive interface
- **Game Statistics**: Track rounds, active players, eliminations

#### Technical Features
- React Native with Expo
- TypeScript for type safety
- Redux Toolkit for state management
- Redux Persist with AsyncStorage
- React Native Paper UI components
- React Navigation for routing
- Full offline support

## [Unreleased]

### Planned Features
- [ ] Export/Import game data (JSON, CSV)
- [ ] Game history with past games archive
- [ ] Detailed player statistics and analytics
- [ ] Multiple game variants (Points Rummy, Pool Rummy, Deals Rummy)
- [ ] Social features (share scores, leaderboards)
- [ ] Light theme support
- [ ] Customizable themes and colors
- [ ] Sound effects and animations
- [ ] Localization (multiple languages)
- [ ] Cloud sync across devices
- [ ] Player avatars and profiles
- [ ] Tournament mode
- [ ] Undo/Redo for score entry
- [ ] Score correction feature
- [ ] Game notes and comments
- [ ] Screen casting to TV (Chromecast)
- [ ] Voice input for scores
- [ ] Gesture controls
- [ ] Widgets for iOS/Android home screen
- [ ] Apple Watch / Wear OS companion app

### Known Issues
- None reported yet

## Version History

- **v1.0.0** - Initial release with core features
- **v0.1.0** - Internal beta testing

---

## Release Notes Format

Each version includes:
- **Added**: New features
- **Changed**: Changes to existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security updates

## Contributors

This project is built with ❤️ for Rummy players everywhere.

## Feedback

Have suggestions or found a bug? Please create an issue in the repository!

