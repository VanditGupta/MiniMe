# Wake Word Setup Guide

## "Hey Minion" Voice Activation

Your minion can now pop up when you say **"Hey Minion"** - just like "Hey Siri"!

## Setup Steps

### 1. Get Your Picovoice Access Key

1. Go to [Picovoice Console](https://console.picovoice.ai/)
2. Sign up for a free account (if you don't have one)
3. Navigate to your account settings
4. Copy your **Access Key**

### 2. Configure the Access Key

Create a `.env` file in the project root:

```bash
# .env
VITE_PICOVOICE_ACCESS_KEY=your_access_key_here
```

**Important:** Never commit your `.env` file to git! It's already in `.gitignore`.

### 3. Verify Wake Word Model

The wake word model file should be at:
- **Development:** `public/assets/sounds/Hey-Minime_en_mac_v4_0_0.ppn`
- **Production:** `assets/sounds/Hey-Minime_en_mac_v4_0_0.ppn`

✅ You've already added this file!

### 4. Grant Microphone Permission

When you first run the app:
1. macOS will prompt for microphone access
2. Click **"Allow"** to enable wake word detection
3. You can also grant permission in: **System Settings → Privacy & Security → Microphone**

### 5. Test It Out!

1. Start the app: `npm run electron:dev`
2. Wait for the console message: `✅ Wake word detection active - say "Hey Minion"`
3. Say **"Hey Minion"** clearly
4. The minion should pop up! 🎉

## How It Works

- **Continuous Listening:** The app listens in the background for the wake word
- **Low Power:** Uses efficient Porcupine engine - minimal battery impact
- **Privacy First:** All processing happens locally - no audio sent to servers
- **Automatic:** Starts listening when the app launches

## Troubleshooting

### "Picovoice Access Key not found"
- Make sure you created a `.env` file
- Check that `VITE_PICOVOICE_ACCESS_KEY` is set correctly
- Restart the dev server after adding the key

### "Failed to load wake word model"
- Check that `Hey-Minime_en_mac_v4_0_0.ppn` exists in `public/assets/sounds/`
- Verify the file path is correct

### "Microphone permission denied"
- Go to **System Settings → Privacy & Security → Microphone**
- Enable microphone access for your app
- Restart the app

### Wake word not detected
- Speak clearly: "Hey Minion"
- Reduce background noise
- Check microphone is working (test in other apps)
- Increase sensitivity in `src/lib/wake-word.ts` (change `0.5` to `0.7`)

## Customization

### Adjust Sensitivity

Edit `src/lib/wake-word.ts`:

```typescript
[0.5] // Lower = less sensitive, Higher = more sensitive (0.0 to 1.0)
```

### Change Wake Word

1. Create a new wake word in [Picovoice Console](https://console.picovoice.ai/)
2. Download the `.ppn` file
3. Replace `Hey-Minime_en_mac_v4_0_0.ppn` with your new file
4. Update the path in `src/lib/wake-word.ts` if needed

## Resources

- [Picovoice Console](https://console.picovoice.ai/)
- [Porcupine Documentation](https://picovoice.ai/docs/porcupine/)
- [Wake Word Models](https://github.com/Picovoice/porcupine/tree/master/resources/keyword_files)

