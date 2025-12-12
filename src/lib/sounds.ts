/**
 * Sound Effects System
 * Supports both file-based sounds and programmatic sounds
 * Uses file-based sounds if available, falls back to programmatic sounds
 */

class SoundManager {
  private audioContext: AudioContext | null = null;
  private masterVolume: number = 0.3; // 30% volume by default
  private soundCache: Map<string, HTMLAudioElement> = new Map();
  private basePath: string;

  constructor() {
    // Determine base path for sound files
    if (typeof window !== 'undefined') {
      // Check if running in Electron
      const isElectron = (window as any).electronAPI !== undefined;
      const isDev = window.location.href.includes('localhost') || window.location.href.includes('127.0.0.1');
      
      if (isElectron && isDev) {
        // Electron dev mode: Vite serves from public folder
        this.basePath = '/assets/sounds/';
      } else if (isElectron) {
        // Electron production: use relative path from app root
        this.basePath = './assets/sounds/';
      } else {
        // Web dev: use public path
        this.basePath = '/assets/sounds/';
      }
    } else {
      this.basePath = './assets/sounds/';
    }
  }

  /**
   * Initialize audio context (lazy initialization)
   * Note: AudioContext must be created/resumed after user interaction
   */
  private getAudioContext(): AudioContext {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      // Resume context if suspended (required for autoplay policies)
      if (this.audioContext.state === 'suspended') {
        this.audioContext.resume().catch(() => {
          // Ignore errors - context will be resumed on user interaction
        });
      }
    }
    // Resume if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    return this.audioContext;
  }

  /**
   * Set master volume (0.0 to 1.0)
   */
  setVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    // Update volume for all cached audio elements
    this.soundCache.forEach((audio) => {
      audio.volume = volume;
    });
  }

  /**
   * Load and cache a sound file
   */
  private async loadSoundFile(filename: string): Promise<HTMLAudioElement | null> {
    // Check cache first
    if (this.soundCache.has(filename)) {
      const cached = this.soundCache.get(filename)!;
      // Reset to beginning for replay
      cached.currentTime = 0;
      return cached;
    }

    try {
      const audio = new Audio(`${this.basePath}${filename}`);
      audio.volume = this.masterVolume;
      audio.preload = 'auto';
      
      // Wait for file to be loadable
      return new Promise((resolve) => {
        audio.addEventListener('canplaythrough', () => {
          this.soundCache.set(filename, audio);
          resolve(audio);
        }, { once: true });
        
        audio.addEventListener('error', () => {
          // File doesn't exist or failed to load
          resolve(null);
        }, { once: true });
        
        // Start loading
        audio.load();
        
        // Timeout after 1 second if file doesn't exist
        setTimeout(() => {
          if (!this.soundCache.has(filename)) {
            resolve(null);
          }
        }, 1000);
      });
    } catch (error) {
      // File doesn't exist or failed to load
      return null;
    }
  }

  /**
   * Play a sound file if available, otherwise use programmatic sound
   */
  private async playSound(
    filename: string,
    fallbackFn: () => void
  ): Promise<void> {
    // Try to load and play file
    const audio = await this.loadSoundFile(filename);
    
    if (audio) {
      try {
        // Reset to beginning and play
        audio.currentTime = 0;
        audio.volume = this.masterVolume;
        await audio.play();
        return;
      } catch (error) {
        // If play fails, fall back to programmatic
        // Don't log in production to avoid console spam
        if (process.env.NODE_ENV === 'development') {
          console.log(`Could not play ${filename}, using fallback sound`);
        }
      }
    }
    
    // Fall back to programmatic sound
    fallbackFn();
  }

  /**
   * Play a tone with specified frequency, duration, and waveform
   */
  private playTone(
    frequency: number,
    duration: number,
    type: OscillatorType = 'sine',
    startTime: number = 0
  ): void {
    try {
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = type;
      oscillator.frequency.value = frequency;

      // Envelope: fade in and out for smooth sound
      const now = ctx.currentTime + startTime;
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, now + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

      oscillator.start(now);
      oscillator.stop(now + duration);
    } catch (error) {
      console.warn('Could not play sound:', error);
    }
  }

  /**
   * Play a cheerful jingle (appears, wakes up)
   */
  playJingle(): void {
    this.playSound('jingle.mp3', () => {
      // Fallback programmatic jingle
      const ctx = this.getAudioContext();
      const notes = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.1 },   // E5
        { freq: 783.99, time: 0.2 },   // G5
        { freq: 1046.50, time: 0.3 },  // C6
      ];

      notes.forEach((note) => {
        this.playTone(note.freq, 0.15, 'sine', note.time);
      });
    });
  }

  /**
   * Play a gentle chime (state changes, interactions)
   * Supports multiple chime variations: chime.mp3, chime1.mp3, chime2.mp3, etc.
   */
  playChime(variation: number = 0): void {
    const filename = variation === 0 ? 'chime.mp3' : `chime${variation}.mp3`;
    
    this.playSound(filename, () => {
      // Fallback programmatic chime
      const ctx = this.getAudioContext();
      const notes = [
        { freq: 659.25, time: 0 },    // E5
        { freq: 783.99, time: 0.1 },   // G5
      ];

      notes.forEach((note) => {
        this.playTone(note.freq, 0.2, 'sine', note.time);
      });
    });
  }

  /**
   * Play a random chime variation
   */
  playRandomChime(): void {
    // Try random chime files (chime1.mp3 through chime5.mp3)
    const randomVariation = Math.floor(Math.random() * 5) + 1;
    this.playChime(randomVariation);
  }

  /**
   * Play a loud wake word confirmation sound
   * Alert sound when "Hey Minime" is detected
   */
  playWakeWordConfirm(): void {
    this.playSound('wake-confirm.mp3', () => {
      // Fallback: loud, attention-grabbing chime
      const ctx = this.getAudioContext();
      
      // Play a bright, ascending chime sequence
      const notes = [
        { freq: 659.25, time: 0 },    // E5
        { freq: 783.99, time: 0.1 },  // G5
        { freq: 987.77, time: 0.2 },   // B5
        { freq: 1318.51, time: 0.3 }, // E6
      ];

      notes.forEach((note) => {
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;

        const now = ctx.currentTime + note.time;
        // Loud (80% of master volume) and clear
        gainNode.gain.setValueAtTime(0, now);
        gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.8, now + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

        oscillator.start(now);
        oscillator.stop(now + 0.3);
      });
    });
  }

  /**
   * Play a soft pop (button clicks, small interactions)
   */
  playPop(): void {
    this.playSound('pop.mp3', () => {
      // Fallback programmatic pop
      const ctx = this.getAudioContext();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, ctx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

      gainNode.gain.setValueAtTime(0, ctx.currentTime);
      gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.2, ctx.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.05);
    });
  }

  /**
   * Play a giggle sound (happy moments)
   */
  playGiggle(): void {
    this.playSound('giggle.mp3', () => {
      // Fallback programmatic giggle
      const ctx = this.getAudioContext();
      const notes = [
        { freq: 523.25, time: 0 },    // C5
        { freq: 659.25, time: 0.05 }, // E5
        { freq: 523.25, time: 0.1 },  // C5
      ];

      notes.forEach((note) => {
        this.playTone(note.freq, 0.08, 'sine', note.time);
      });
    });
  }

  /**
   * Play a wake-up sound (transitioning from sleep)
   */
  playWakeUp(): void {
    const ctx = this.getAudioContext();
    // Ascending notes for wake-up
    const notes = [
      { freq: 392.00, time: 0 },    // G4
      { freq: 493.88, time: 0.1 },  // B4
      { freq: 587.33, time: 0.2 },  // D5
    ];

    notes.forEach((note) => {
      this.playTone(note.freq, 0.2, 'sine', note.time);
    });
  }

  /**
   * Play a sleep sound (going to sleep)
   */
  playSleep(): void {
    const ctx = this.getAudioContext();
    // Descending notes for sleep
    const notes = [
      { freq: 587.33, time: 0 },    // D5
      { freq: 493.88, time: 0.15 },  // B4
      { freq: 392.00, time: 0.3 },  // G4
    ];

    notes.forEach((note) => {
      this.playTone(note.freq, 0.25, 'sine', note.time);
    });
  }

  /**
   * Play a listening sound (subtle ping)
   */
  playListening(): void {
    const ctx = this.getAudioContext();
    this.playTone(800, 0.1, 'sine', 0);
    this.playTone(1000, 0.1, 'sine', 0.1);
  }

  /**
   * Play a speaking sound (excited notes)
   */
  playSpeaking(): void {
    const ctx = this.getAudioContext();
    // Quick excited notes
    const notes = [
      { freq: 659.25, time: 0 },    // E5
      { freq: 783.99, time: 0.08 },  // G5
      { freq: 987.77, time: 0.16 }, // B5
    ];

    notes.forEach((note) => {
      this.playTone(note.freq, 0.1, 'sine', note.time);
    });
  }

  /**
   * Play a success sound (positive feedback)
   */
  playSuccess(): void {
    const ctx = this.getAudioContext();
    // Upward arpeggio
    const notes = [
      { freq: 523.25, time: 0 },    // C5
      { freq: 659.25, time: 0.1 },   // E5
      { freq: 783.99, time: 0.2 },   // G5
    ];

    notes.forEach((note) => {
      this.playTone(note.freq, 0.15, 'sine', note.time);
    });
  }
}

// Singleton instance
let soundManagerInstance: SoundManager | null = null;

/**
 * Get the sound manager instance
 */
export function getSoundManager(): SoundManager {
  if (!soundManagerInstance) {
    soundManagerInstance = new SoundManager();
  }
  return soundManagerInstance;
}

/**
 * Convenience functions for common sounds
 */
export const sounds = {
  jingle: () => getSoundManager().playJingle(),
  chime: (variation?: number) => getSoundManager().playChime(variation),
  randomChime: () => getSoundManager().playRandomChime(),
  pop: () => getSoundManager().playPop(),
  giggle: () => getSoundManager().playGiggle(),
  wakeUp: () => getSoundManager().playWakeUp(),
  wakeWordConfirm: () => getSoundManager().playWakeWordConfirm(),
  sleep: () => getSoundManager().playSleep(),
  listening: () => getSoundManager().playListening(),
  speaking: () => getSoundManager().playSpeaking(),
  success: () => getSoundManager().playSuccess(),
};

