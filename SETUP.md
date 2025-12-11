# Mini-Me Minion - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

This will install:
- React and Vite dependencies
- Electron and electron-builder
- All UI components and utilities

### 2. Development Mode

**Option A: Combined Command (Recommended)**
```bash
npm run dev:electron
```

This will:
1. Start Vite dev server on port 8080
2. Wait for server to be ready
3. Launch Electron app

**Option B: Separate Terminals**
```bash
# Terminal 1: Start Vite
npm run dev

# Terminal 2: Start Electron (after Vite is running)
npm run electron:dev
```

### 3. Building for Production

```bash
# Build renderer and main process
npm run build:electron

# Package as macOS app (.dmg and .zip)
npm run build
```

Output will be in the `out/` directory.

## Project Structure

```
my-little-echo-main/
├── src-electron/              # Electron main process
│   ├── main.ts                # Main process (menu bar, windows, IPC)
│   └── preload.ts            # Preload script (secure IPC bridge)
├── src/                       # React renderer (your existing app)
│   ├── components/
│   │   ├── DesktopMinion.tsx  # Desktop-specific minion component
│   │   ├── TamagotchiBlob.tsx # Original blob character
│   │   └── ...                # Other components
│   ├── lib/
│   │   ├── personality.ts     # Personality and mood detection
│   │   └── voice.ts           # Voice processing utilities
│   └── pages/
│       └── Index.tsx          # Main page (detects Electron vs web)
├── assets/                    # App assets
│   ├── icons/                 # App icons (create tray-icon.png)
│   ├── sounds/                 # Sound effects
│   └── sprites/                # Character sprites
├── build/                     # Build configuration
│   └── entitlements.mac.plist # macOS entitlements
└── dist-electron/             # Compiled Electron code (generated)
```

## Key Features

### ✅ Menu Bar App
- Hidden from dock (`app.dock.hide()`)
- System tray icon with menu
- Left-click to show/hide
- Right-click for options

### ✅ Popup Window
- 280x320px transparent overlay
- Always-on-top
- Smooth animations
- Smart positioning (top-right)

### ✅ Check-in System
- Random intervals (20-45 minutes)
- Time-based greetings
- Context-aware interruptions

### ✅ Personality System
- Mood detection from text
- Adaptive responses
- Emotional intelligence

### ✅ Voice Integration
- Microphone access
- Audio processing
- TTS support (ElevenLabs ready)

## Next Steps

1. **Create Icons**
   - Add `assets/icons/tray-icon.png` (16x16 or 22x22)
   - Create `assets/icons/icon.icns` for app icon
   - See `assets/README.md` for instructions

2. **Add Sound Effects**
   - Add minion sounds to `assets/sounds/`
   - Update code to play sounds on interactions

3. **Configure API Keys**
   - Set up ElevenLabs API for voice cloning
   - Add API keys to environment variables

4. **Customize Behavior**
   - Adjust check-in intervals in `src-electron/main.ts`
   - Customize personality responses in `src/lib/personality.ts`
   - Modify window size/position in `src-electron/main.ts`

5. **Test & Build**
   - Test in development mode
   - Build and test packaged app
   - Sign app for distribution (optional)

## Troubleshooting

### Electron won't start
- Ensure Vite is running on port 8080
- Check that TypeScript compiled successfully
- Verify all dependencies installed

### Window not appearing
- Check browser console for errors
- Verify preload script loaded
- Check React app is rendering

### Tray icon missing
- Create `assets/icons/tray-icon.png`
- App uses fallback if icon not found

### Build fails
- Ensure all dependencies installed
- Check TypeScript compilation
- Verify electron-builder configuration

## Development Tips

- Use `console.log` in main process (check terminal)
- Use browser DevTools for renderer (uncomment in main.ts)
- Hot reload works for renderer, restart Electron for main process changes
- Check `dist-electron/` for compiled output

## API Integration

The app is ready for:
- **ElevenLabs**: Voice cloning and TTS (see `src/lib/voice.ts`)
- **OpenAI Whisper**: Speech-to-text (see `src/lib/voice.ts`)
- **Custom APIs**: Add to `src-electron/main.ts` IPC handlers

## Support

For issues or questions:
1. Check `README-ELECTRON.md` for detailed docs
2. Review code comments in main files
3. Check Electron and React documentation

Happy coding! 🍌

