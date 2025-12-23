# 📦 Building APK for Local Distribution

This guide will help you build an APK file that you can distribute directly to users without going through the Google Play Store.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev) - FREE
2. **EAS CLI**: Install EAS CLI globally
   ```bash
   npm install -g eas-cli
   ```

## Method 1: EAS Build (Cloud) - Recommended

This builds the APK on Expo's servers. No local setup required.

### Step 1: Login to EAS
```bash
eas login
```

### Step 2: Configure EAS (if not done already)
```bash
eas build:configure
```

### Step 3: Build APK
```bash
eas build --platform android --profile preview
```

This will:
- Build an APK file on Expo's servers
- Take 10-20 minutes
- Provide a download link when complete
- APK will be ready for direct installation

### Step 4: Download APK
- Check your email or the EAS dashboard
- Download the APK file
- Share with users or install directly

## Method 2: Local Build (Advanced)

Build the APK on your local machine. Requires Android SDK setup.

### Prerequisites for Local Build:
- Android Studio installed
- Android SDK configured
- Java Development Kit (JDK) installed
- Environment variables set

### Step 1: Install Android Studio
1. Download from [developer.android.com/studio](https://developer.android.com/studio)
2. Install Android Studio
3. Open Android Studio → SDK Manager
4. Install Android SDK Platform 34
5. Install Android SDK Build-Tools

### Step 2: Set Environment Variables
Add to your `~/.zshrc` or `~/.bash_profile`:

```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
```

Then reload:
```bash
source ~/.zshrc  # or source ~/.bash_profile
```

### Step 3: Build Locally
```bash
eas build --platform android --profile local-apk --local
```

This will:
- Build APK on your machine
- Require Android SDK setup
- Take longer but no cloud dependency

## Method 3: Development Build (Quick Testing)

For quick testing during development:

```bash
npx expo run:android
```

This creates a development build (not for distribution).

## Installing the APK

### On Android Device:
1. Transfer APK to device (email, USB, cloud storage)
2. Enable "Install from unknown sources" in Settings
3. Open APK file
4. Tap "Install"

### Via ADB (Android Debug Bridge):
```bash
adb install path/to/your-app.apk
```

## APK Distribution Options

### Option 1: Direct Share
- Email the APK file
- Share via cloud storage (Google Drive, Dropbox)
- Transfer via USB

### Option 2: Host Online
- Upload to your website
- Provide download link
- Users download and install

### Option 3: QR Code
- Upload APK to cloud storage
- Generate QR code with download link
- Users scan and download

## Important Notes

### Security Warning:
- APKs from unknown sources can be risky
- Users must trust you as the developer
- Consider code signing for credibility

### Version Management:
- Update version in `app.json` before each build
- Android `versionCode` must increment each build
- Keep track of versions you've distributed

### Updates:
- Users won't get automatic updates
- You'll need to distribute new APKs manually
- Consider Play Store for automatic updates

## Troubleshooting

### Build Fails:
- Check EAS build logs: `eas build:list`
- Verify `app.json` is valid
- Ensure all dependencies are compatible

### APK Won't Install:
- Check Android version compatibility (minSdkVersion: 21)
- Verify APK is not corrupted
- Ensure device allows unknown sources

### Large APK Size:
- APK includes all assets and dependencies
- Consider using App Bundle (.aab) for Play Store
- APK size is normal for React Native apps

## Quick Commands Reference

```bash
# Login to EAS
eas login

# Configure project
eas build:configure

# Build APK (cloud)
eas build --platform android --profile preview

# Build APK (local)
eas build --platform android --profile local-apk --local

# List builds
eas build:list

# View build status
eas build:view [BUILD_ID]
```

## Next Steps

1. ✅ Install EAS CLI: `npm install -g eas-cli`
2. ✅ Login: `eas login`
3. ✅ Configure: `eas build:configure`
4. ✅ Build APK: `eas build --platform android --profile preview`
5. ✅ Download and distribute APK

## Cost

- **EAS Build**: Free tier includes limited builds
- **Local Build**: Free (requires Android SDK setup)
- **Distribution**: Free (you host/share the APK)

For unlimited builds, consider EAS Build paid plan or use local builds.

