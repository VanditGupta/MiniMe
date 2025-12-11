# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Install
```bash
npm install
```

### 2. Run
```bash
npm run dev:electron
```

### 3. Enjoy!
Your minion will appear in the menu bar and pop up to say hello!

## 📋 Common Commands

```bash
# Development
npm run dev              # Vite only
npm run dev:electron     # Vite + Electron
npm run electron:dev     # Electron only (after Vite is running)

# Building
npm run build:electron   # Build renderer + main
npm run build            # Build + package app
```

## 🎯 Key Features

- **Menu Bar**: Click tray icon to show/hide
- **Keyboard**: Press ⌘⌥M to summon
- **Check-ins**: Automatic every 20-45 minutes
- **Chat**: Type and press Enter
- **Dismiss**: Click outside or press Escape

## 📁 Important Files

- `src-electron/main.ts` - Main process (menu bar, windows)
- `src/components/DesktopMinion.tsx` - Desktop UI
- `src/lib/personality.ts` - Personality system
- `assets/icons/` - Add your icons here

## 🐛 Troubleshooting

**App won't start?**
- Make sure Vite is running on port 8080
- Check terminal for errors
- Verify dependencies installed

**Window not showing?**
- Click tray icon
- Press ⌘⌥M
- Check console for errors

**Need help?**
- See `SETUP.md` for detailed guide
- See `README-ELECTRON.md` for full docs
- See `CONVERSION-SUMMARY.md` for what was built

## ✨ Next Steps

1. Add icons to `assets/icons/`
2. Customize check-in intervals
3. Add API keys for voice features
4. Test and build!

Happy coding! 🍌

