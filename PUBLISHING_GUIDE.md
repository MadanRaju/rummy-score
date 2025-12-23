# 📱 Publishing Guide - Rummy Score

This guide will walk you through publishing your Rummy Score app to both Google Play Store and Apple App Store.

## Prerequisites

1. **Expo Account**: Sign up at [expo.dev](https://expo.dev) - **FREE**
2. **EAS CLI**: Install EAS CLI globally
   ```bash
   npm install -g eas-cli
   ```
3. **Google Play Console Account**: $25 one-time fee (mandatory for all developers)
   - This is a **one-time registration fee**, not per-app
   - Required even for free apps
   - Alternative: Distribute APK directly (bypasses Play Store)
4. **Apple Developer Account**: $99/year subscription (mandatory for App Store)
   - This is an **annual membership fee**, not per-app
   - Required even for free apps
   - No alternative for App Store distribution

### Fee Clarification

**Yes, fees are mandatory** even for free apps:

- **Google Play Store**: $25 one-time developer registration fee (required for all developers)
- **Apple App Store**: $99/year developer program membership (required for all developers)

These are **developer account fees**, not per-app fees. Once you pay:
- **Google**: You can publish unlimited free/paid apps forever
- **Apple**: You can publish unlimited free/paid apps for one year (renew annually)

**Free alternatives** (not recommended for distribution):
- **Android**: Distribute APK files directly (users must enable "Install from unknown sources")
- **iOS**: No legal way to distribute iOS apps outside App Store without developer account

## Step 1: Install EAS CLI and Login

```bash
npm install -g eas-cli
eas login
```

## Step 2: Configure EAS Project

```bash
eas build:configure
```

This will:
- Create an EAS project
- Update `app.json` with your project ID
- Set up build profiles

## Step 3: Prepare App Assets

You need to create the following assets:

### Required Assets:
1. **App Icon** (`assets/icon.png`)
   - Size: 1024x1024px
   - Format: PNG
   - No transparency
   - Square design

2. **Adaptive Icon** (`assets/adaptive-icon.png`) - Android only
   - Size: 1024x1024px
   - Format: PNG
   - Foreground only (background will be added)

3. **Splash Screen** (`assets/splash.png`)
   - Size: 1284x2778px (or use Expo's splash screen generator)
   - Format: PNG
   - Background color: #121212 (dark theme)

4. **Favicon** (`assets/favicon.png`) - Web only
   - Size: 48x48px
   - Format: PNG

### Quick Asset Generation:
You can use online tools or Expo's asset generator:
- [App Icon Generator](https://www.appicon.co/)
- [Expo Splash Screen Generator](https://github.com/expo/expo-cli/tree/main/packages/expo-cli#expo-asset-generate)

## Step 4: Update App Configuration

1. **Update `app.json`**:
   - Verify bundle identifier: `com.rummyscore.app`
   - Update version numbers
   - Add your project description

2. **Update `eas.json`**:
   - Add your Apple ID and Team ID for iOS submission
   - Configure Android service account (optional, can use web UI)

## Step 5: Build for Production

### Android Build (AAB for Play Store):

```bash
eas build --platform android --profile production
```

This will:
- Build an Android App Bundle (.aab)
- Upload to EAS servers
- Provide download link when complete

### iOS Build:

```bash
eas build --platform ios --profile production
```

This will:
- Build an iOS app (.ipa)
- Require Apple Developer account credentials
- Upload to EAS servers

### Build Both Platforms:

```bash
eas build --platform all --profile production
```

## Step 6: Google Play Store Submission

### 6.1 Create Play Console Account
1. Go to [Google Play Console](https://play.google.com/console)
2. Pay $25 one-time registration fee
3. Create a new app

### 6.2 App Information Required:
- **App name**: Rummy Score
- **Default language**: English
- **App or game**: Game
- **Free or paid**: Free
- **Declarations**: Complete all required sections

### 6.3 Store Listing:
- **App description** (up to 4000 characters)
- **Short description** (up to 80 characters)
- **Graphics**:
  - Feature graphic (1024x500px)
  - Screenshots (at least 2, up to 8)
    - Phone: 16:9 or 9:16 aspect ratio
    - Tablet: 7" and 10" screenshots
  - App icon (512x512px)
  - Promotional graphic (optional)

### 6.4 Content Rating:
- Complete content rating questionnaire
- Get rating certificate

### 6.5 Privacy Policy:
- Required for all apps
- Host on your website or use a free hosting service
- Add URL in Play Console

### 6.6 Upload Build:
1. Go to "Production" → "Create new release"
2. Upload the `.aab` file from EAS build
3. Add release notes
4. Review and roll out

### 6.7 Submit for Review:
- Complete all required sections
- Submit for review
- Typically takes 1-3 days

## Step 7: Apple App Store Submission

### 7.1 Create App Store Connect App
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Rummy Score
   - Primary Language: English
   - Bundle ID: com.rummyscore.app
   - SKU: rummy-score-ios

### 7.2 App Information Required:
- **App description** (up to 4000 characters)
- **Subtitle** (up to 30 characters)
- **Keywords** (up to 100 characters)
- **Support URL**: Your website or support page
- **Marketing URL** (optional)
- **Privacy Policy URL**: Required

### 7.3 App Store Listing:
- **Screenshots**:
  - iPhone 6.7" Display: 1290x2796px (at least 3)
  - iPhone 6.5" Display: 1284x2778px (at least 3)
  - iPad Pro 12.9": 2048x2732px (at least 3)
- **App Preview Videos** (optional)
- **App Icon**: 1024x1024px

### 7.4 App Privacy:
- Complete App Privacy questionnaire
- Declare data collection practices

### 7.5 Upload Build:
1. Use EAS Submit or Transporter:
   ```bash
   eas submit --platform ios
   ```
2. Or use Xcode Transporter app

### 7.6 Submit for Review:
1. Create a new version in App Store Connect
2. Select the uploaded build
3. Complete all required information
4. Submit for review
5. Typically takes 1-7 days

## Step 8: Post-Submission

### Monitor Status:
- **Play Store**: Check Play Console for review status
- **App Store**: Check App Store Connect for review status

### Common Issues:
- **Rejected builds**: Check email for specific reasons
- **Missing information**: Complete all required fields
- **Policy violations**: Review store policies

## Step 9: Update Your App

When you need to update:

1. **Update version numbers**:
   - `app.json`: `"version": "1.0.1"`
   - Android: `"versionCode": 2`
   - iOS: `"buildNumber": "2"`

2. **Build new version**:
   ```bash
   eas build --platform all --profile production
   ```

3. **Submit update**:
   ```bash
   eas submit --platform all
   ```

## Sample Store Listings

### App Description (Short):
"Track your Rummy game scores with ease. Support for multiple players, custom rules, and detailed scoreboards."

### App Description (Full):
```
🎮 Rummy Score Tracker - Your Ultimate Companion for Rummy Games

Keep track of your Rummy game scores effortlessly with this feature-rich mobile app. Perfect for casual games with friends and family.

✨ Key Features:
• Multi-player support (2-9 players)
• Custom game rules and presets
• Real-time score tracking
• Detailed round-by-round history
• Player re-entry support
• Beautiful Material You design
• Dark mode support
• Auto-save and resume games

🎯 Perfect for:
• Family game nights
• Friendly competitions
• Tournament tracking
• Score keeping on the go

📊 Features:
- Save player profiles for quick game setup
- Create custom game configurations
- View comprehensive scoreboards
- Track game statistics
- Edit previous rounds
- Add players mid-game

Download now and never lose track of your Rummy scores again!
```

### Privacy Policy Template:
You'll need to create a privacy policy. Here's what to include:
- What data you collect (if any)
- How you use the data
- Data storage (local only)
- Third-party services (if any)
- User rights

## Troubleshooting

### Build Errors:
- Check EAS build logs
- Verify all dependencies are compatible
- Ensure app.json is valid JSON

### Submission Errors:
- Verify bundle identifiers match
- Check certificates and provisioning profiles
- Ensure all required assets are present

### Review Rejections:
- Read rejection reasons carefully
- Address all issues mentioned
- Resubmit with fixes

## Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [EAS Submit Documentation](https://docs.expo.dev/submit/introduction/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Expo Documentation](https://docs.expo.dev/)

## Next Steps

1. ✅ Install EAS CLI and login
2. ✅ Configure EAS project
3. ✅ Create app assets (icons, splash screens)
4. ✅ Update app.json with final details
5. ✅ Build production versions
6. ✅ Create store listings
7. ✅ Submit for review
8. ✅ Monitor and respond to reviews

Good luck with your app launch! 🚀

