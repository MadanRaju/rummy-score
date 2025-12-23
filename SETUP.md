# 🚀 Setup Guide

Follow these steps to get the Rummy Score Tracker app running on your local machine.

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v16 or higher)
   ```bash
   node --version  # Should be v16 or higher
   ```

2. **npm** or **yarn**
   ```bash
   npm --version
   # or
   yarn --version
   ```

3. **Expo CLI** (optional but recommended)
   ```bash
   npm install -g expo-cli
   ```

4. **Development Environment**
   - For iOS: Xcode (macOS only)
   - For Android: Android Studio with Android SDK
   - For quick testing: Expo Go app on your phone

## Installation Steps

### 1. Install Dependencies

```bash
cd rummy-score
npm install
```

If you encounter any issues, try:
```bash
npm install --legacy-peer-deps
```

### 2. Verify Installation

Check if all dependencies are installed correctly:
```bash
npm list
```

### 3. Start Development Server

```bash
npm start
```

This will start the Expo development server and show a QR code.

### 4. Run on Device/Emulator

#### Option A: Physical Device (Easiest)

1. Install **Expo Go** app from:
   - [App Store (iOS)](https://apps.apple.com/app/expo-go/id982107779)
   - [Play Store (Android)](https://play.google.com/store/apps/details?id=host.exp.exponent)

2. Scan the QR code with:
   - iOS: Camera app
   - Android: Expo Go app

#### Option B: iOS Simulator (macOS only)

```bash
npm run ios
```

Or press `i` in the terminal where Metro is running.

#### Option C: Android Emulator

```bash
npm run android
```

Or press `a` in the terminal where Metro is running.

## Troubleshooting

### Common Issues

#### 1. Metro Bundler Issues

```bash
# Clear cache and restart
npm start -- --clear
```

#### 2. Module Resolution Errors

```bash
# Clean install
rm -rf node_modules
rm package-lock.json
npm install
```

#### 3. iOS Simulator Issues

```bash
# Reset iOS simulator
xcrun simctl erase all
```

#### 4. Android Emulator Issues

- Ensure Android SDK is properly installed
- Check that `ANDROID_HOME` environment variable is set
- Verify emulator is running: `adb devices`

#### 5. TypeScript Errors

```bash
# Regenerate TypeScript cache
rm -rf .expo
npm start
```

### Path Alias Issues

If you see import errors with `@/` or `@components/`, ensure:

1. `babel.config.js` includes `babel-plugin-module-resolver`
2. `tsconfig.json` has correct path mappings
3. Restart the development server

## Development Tips

### Hot Reloading

- Changes to code will automatically reload
- Shake device or press `Cmd+D` (iOS) / `Cmd+M` (Android) for dev menu
- Enable Fast Refresh in dev menu

### Debugging

1. **Console Logs**
   - View in terminal where Metro is running
   - Or use React Native Debugger

2. **React DevTools**
   ```bash
   npm install -g react-devtools
   react-devtools
   ```

3. **Redux DevTools**
   - Use Reactotron (optional)
   - Or Redux DevTools Extension

### Testing on Different Screen Sizes

Press `Shift+D` in the terminal to open the Expo Developer Tools in browser, where you can:
- View logs
- Open on different devices
- Enable performance monitoring

## Building for Production

### Create a Build

For iOS:
```bash
expo build:ios
```

For Android:
```bash
expo build:android
```

### EAS Build (Recommended)

```bash
npm install -g eas-cli
eas login
eas build --platform ios
# or
eas build --platform android
```

## Environment Setup

### macOS

```bash
# Install Homebrew
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node
brew install node

# Install Watchman (for better file watching)
brew install watchman
```

### Windows

1. Install Node.js from [nodejs.org](https://nodejs.org/)
2. Install Android Studio
3. Set up Android SDK and environment variables

### Linux

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install Watchman
sudo apt-get install watchman
```

## Next Steps

Once the app is running:

1. **Explore the Home Screen** - Familiarize yourself with the UI
2. **Create a Game Preset** - Set up your preferred rules
3. **Add Some Players** - Save player names for quick access
4. **Start a Game** - Try out the scoring features

## Getting Help

- Check the [README.md](README.md) for feature documentation
- Review the code in `src/` directory
- Look at TypeScript types in `src/types/`

## Useful Commands

```bash
# Start development server
npm start

# Start on iOS
npm run ios

# Start on Android
npm run android

# Start on web (experimental)
npm run web

# Clear cache
npm start -- --clear

# Check for updates
npm outdated

# Update dependencies
npm update
```

Happy coding! 🎮

