#!/bin/bash

# Quick script to build APK for local distribution
# Usage: ./build-apk.sh

echo "🚀 Building APK for local distribution..."
echo ""

# Check if EAS CLI is installed
if ! command -v eas &> /dev/null; then
    echo "❌ EAS CLI not found. Installing..."
    npm install -g eas-cli
fi

# Check if logged in
echo "Checking EAS login status..."
if ! eas whoami &> /dev/null; then
    echo "⚠️  Not logged in. Please login:"
    echo "   eas login"
    exit 1
fi

echo "✅ Logged in to EAS"
echo ""

# Build APK
echo "📦 Starting APK build..."
echo "   This will take 10-20 minutes..."
echo ""

eas build --platform android --profile preview

echo ""
echo "✅ Build complete! Check your email or EAS dashboard for download link."
echo "   Or run: eas build:list"

