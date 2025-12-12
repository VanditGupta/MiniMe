# Wake Word Status ✅

## Configuration Complete!

Your wake word detection is now configured and ready to use!

### ✅ What's Set Up:

1. **API Key**: Configured in `.env` file
2. **Wake Word Model**: `Hey-Minime_en_mac_v4_0_0.ppn` in place
3. **Integration**: Wake word detector integrated into DesktopMinion
4. **IPC Communication**: Main process ready to show minion on detection

### 🎤 How to Use:

1. **Start the app** (already running)
2. **Grant microphone permission** when prompted (if not already granted)
3. **Look for this message** in the console:
   ```
   ✅ Porcupine initialized successfully
   🎤 Wake word detection started - listening for "Hey Minion"
   ✅ Wake word detection active - say "Hey Minion"
   ```
4. **Say "Hey Minion"** clearly
5. **The minion will pop up!** 🎉

### 🔍 Troubleshooting:

#### If you see "Failed to initialize Porcupine":
- Check that your API key is valid at https://console.picovoice.ai/
- Make sure the key doesn't have extra quotes (should be: `VITE_PICOVOICE_ACCESS_KEY=your_key_here`)
- Restart the dev server after changing `.env`

#### If microphone permission is denied:
- Go to **System Settings → Privacy & Security → Microphone**
- Enable access for your app
- Restart the app

#### If wake word not detected:
- Speak clearly: "Hey Minion"
- Reduce background noise
- Check microphone is working (test in other apps)
- Increase sensitivity in `src/lib/wake-word.ts` (change `0.5` to `0.7`)

### 📝 Next Steps:

The wake word detection is now active! Try saying "Hey Minion" and watch the minion appear.

For more details, see `WAKE-WORD-SETUP.md`.

