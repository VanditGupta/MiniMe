# Assets Directory

This directory contains all assets for the Mini-Me Minion desktop app.

## Icons

Place the following icon files here:
- `icons/tray-icon.png` - Menu bar tray icon (16x16 or 22x22 for retina)
- `icons/icon.icns` - macOS app icon (512x512 or larger, converted to .icns)

## Sounds

Place audio files for minion interactions:
- `sounds/giggle.mp3` - Minion giggle sound
- `sounds/pop.mp3` - Pop sound effect
- `sounds/chime.mp3` - Chime sound effect

## Sprites

Place any sprite images or character assets here.

## Generating Icons

To create the .icns file from a PNG:
```bash
# Install iconutil (macOS only)
# Create iconset directory
mkdir icon.iconset

# Create different sizes
sips -z 16 16 icon.png --out icon.iconset/icon_16x16.png
sips -z 32 32 icon.png --out icon.iconset/icon_16x16@2x.png
sips -z 32 32 icon.png --out icon.iconset/icon_32x32.png
sips -z 64 64 icon.png --out icon.iconset/icon_32x32@2x.png
sips -z 128 128 icon.png --out icon.iconset/icon_128x128.png
sips -z 256 256 icon.png --out icon.iconset/icon_128x128@2x.png
sips -z 256 256 icon.png --out icon.iconset/icon_256x256.png
sips -z 512 512 icon.png --out icon.iconset/icon_256x256@2x.png
sips -z 512 512 icon.png --out icon.iconset/icon_512x512.png
sips -z 1024 1024 icon.png --out icon.iconset/icon_512x512@2x.png

# Create .icns file
iconutil -c icns icon.iconset -o icon.icns
```

