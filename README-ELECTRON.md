# Mini-Me Minion - Electron Desktop App

An adorable macOS desktop companion that keeps you company while you work!

## Features

✨ **Menu Bar App** - Lives quietly in your menu bar, no dock icon  
🎭 **Adorable Popups** - Cute transparent overlay windows with smooth animations  
⏰ **Smart Check-ins** - Randomly pops up every 20-45 minutes with friendly greetings  
💬 **Personality System** - Emotionally intelligent responses that adapt to your mood  
🎤 **Voice Integration** - Supports voice input and cloned voice responses  
⌨️ **Keyboard Shortcuts** - Press ⌘⌥M to summon your minion anytime  

## Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- macOS (for building macOS app)

### Installation

```bash
# Install dependencies
npm install

# Install Electron dependencies
npm run postinstall
```

### Development

```bash
# Start Vite dev server and Electron (in separate terminals)

# Terminal 1: Start Vite
npm run dev

# Terminal 2: Start Electron (after Vite is running)
npm run electron:dev
```

Or use the combined command:
```bash
npm run dev:electron
```

### Building

```bash
# Build for production
npm run build:electron

# Package as macOS app
npm run build
```

This will create:
- `dist/` - Built renderer process
- `dist-electron/` - Built main process
- `out/` - Packaged app (.dmg and .zip)

## Project Structure

```
mini-me-minion/
├── src-electron/          # Electron main process
│   ├── main.ts            # Main process (menu bar, windows, IPC)
│   └── preload.ts         # Preload script (secure IPC bridge)
├── src/                   # React renderer process
│   ├── components/        # React components
│   │   ├── DesktopMinion.tsx  # Desktop-specific minion component
│   │   └── ...            # Other components
│   ├── lib/               # Utilities
│   │   ├── personality.ts # Personality and mood detection
│   │   └── voice.ts       # Voice processing
│   └── pages/             # Pages
├── assets/                # App assets
│   ├── icons/             # App icons
│   ├── sounds/            # Sound effects
│   └── sprites/           # Character sprites
└── build/                 # Build configuration
    └── entitlements.mac.plist  # macOS entitlements
```

## Key Features Implementation

### Menu Bar App
- Hidden from dock using `app.dock.hide()`
- System tray icon with right-click menu
- Left-click to show/hide minion

### Popup Window
- Transparent, borderless overlay (280x320px)
- Always-on-top
- Smooth slide-in/out animations
- Smart positioning (top-right corner)

### Check-in System
- Random intervals (20-45 minutes)
- Time-based greetings (morning/afternoon/evening)
- Context-aware (respects DND, full-screen apps)

### Personality System
- Mood detection from user input
- Adaptive responses:
  - Happy → Celebratory
  - Sad → Comforting
  - Stressed → Supportive
  - Excited → Upbeat

### Voice Integration
- Native microphone access
- Audio processing for voice input
- TTS integration (ElevenLabs) for responses
- User's cloned voice with minion personality

## Configuration

### Check-in Interval
Edit `src-electron/main.ts`:
```typescript
const minInterval = 20 * 60 * 1000; // 20 minutes
const maxInterval = 45 * 60 * 1000; // 45 minutes
```

### Window Size
Edit `src-electron/main.ts`:
```typescript
const windowWidth = 280;
const windowHeight = 320;
```

## Troubleshooting

### Electron won't start
- Make sure Vite dev server is running on port 8080
- Check that TypeScript compilation succeeded
- Verify all dependencies are installed

### Tray icon not showing
- Create `assets/icons/tray-icon.png` (16x16 or 22x22)
- App will use fallback icon if file not found

### Window not appearing
- Check console for errors
- Verify preload script is loading correctly
- Make sure React app is rendering

## Next Steps

1. **Add Icons**: Create proper app icons in `assets/icons/`
2. **Add Sounds**: Add minion sound effects to `assets/sounds/`
3. **API Integration**: Connect to ElevenLabs for voice cloning
4. **Settings Window**: Create settings UI for customization
5. **Auto-updater**: Set up auto-update system
6. **Analytics**: Add optional usage analytics

## License

MIT

