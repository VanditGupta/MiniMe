# Sound Effects Directory

This directory contains sound effect files for the Mini-Me Minion app.

## Supported Sound Files

The app will automatically use these sound files if they exist, otherwise it will use programmatic sounds as fallback.

### Required/Recommended Sounds:

- **jingle.mp3** - Cheerful jingle when minion appears
- **chime.mp3** - Default chime for interactions
- **chime1.mp3, chime2.mp3, chime3.mp3, etc.** - Chime variations (will be randomly selected)
- **pop.mp3** - Pop sound for button clicks
- **giggle.mp3** - Giggle sound for happy moments
- **wake-up.mp3** - Sound when minion wakes up
- **sleep.mp3** - Sound when minion goes to sleep
- **listening.mp3** - Sound when minion is listening
- **speaking.mp3** - Sound when minion is speaking
- **success.mp3** - Success/positive feedback sound

## File Format

- **Format**: MP3, WAV, or OGG
- **Recommended**: MP3 (best compatibility)
- **Duration**: Keep sounds short (0.1-2 seconds)
- **Volume**: Normalized to avoid clipping

## Where to Get Sounds

### Free Sound Resources:
1. **Freesound.org** - https://freesound.org
   - Search for: "chime", "jingle", "notification", "bell"
   - Filter by: CC0 or CC BY license
   - Format: Download as MP3

2. **Zapsplat** - https://www.zapsplat.com
   - Free with account
   - High quality sound effects

3. **Mixkit** - https://mixkit.co/free-sound-effects/
   - Free sound effects
   - No attribution required

4. **Pixabay** - https://pixabay.com/sound-effects/
   - Free sound effects
   - Good variety

### Recommended Search Terms:
- "chime notification"
- "bell chime"
- "jingle sound"
- "notification sound"
- "pop click"
- "giggle laugh"
- "wake up sound"
- "sleep sound"

## Adding Sounds

1. Download sound files in MP3 format
2. Place them in this directory (`assets/sounds/`)
3. Name them exactly as listed above
4. Restart the app - sounds will be used automatically!

## Example File Structure

```
assets/sounds/
├── jingle.mp3
├── chime.mp3
├── chime1.mp3
├── chime2.mp3
├── chime3.mp3
├── pop.mp3
├── giggle.mp3
├── wake-up.mp3
├── sleep.mp3
├── listening.mp3
├── speaking.mp3
└── success.mp3
```

## Tips

- **Keep files small**: Compress MP3s to reduce app size
- **Test volume**: Make sure sounds aren't too loud or quiet
- **Variety**: Add multiple chime variations for more personality
- **Quality**: 44.1kHz, 128kbps MP3 is usually sufficient for short sounds

## Fallback Behavior

If a sound file doesn't exist, the app will automatically use programmatic sounds (generated with Web Audio API). This ensures the app always has sounds, even without downloaded files.

