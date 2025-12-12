/**
 * Wake Word Detection using Web Speech API
 * Continuously listens for "Hey Minime" wake word
 * No external dependencies - uses browser's built-in speech recognition
 */

export class WakeWordDetector {
  private recognition: any = null;
  private isListening: boolean = false;
  private onWakeWordDetected: (() => void) | null = null;
  private wakeWordPhrases: string[] = ['hey minime', 'hey minime', 'hey minime'];

  constructor() {
    // Web Speech API is available in Electron (Chromium) and modern browsers
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || 
                               (window as any).webkitSpeechRecognition;
      
      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.setupRecognition();
        } catch (error) {
          console.error('Failed to create SpeechRecognition:', error);
        }
      } else {
        console.warn('Web Speech API not supported. Make sure you\'re using Chrome, Edge, Safari, or Electron.');
      }
    }
  }

  /**
   * Setup speech recognition parameters
   */
  private setupRecognition(): void {
    if (!this.recognition) return;

    // Continuous listening
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = 'en-US';

    // Handle results
    this.recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript.toLowerCase().trim();
        
        // Check if wake word is detected
        if (this.isWakeWord(transcript)) {
          console.log('🎤 Wake word detected: "Hey Minime"');
          if (this.onWakeWordDetected) {
            this.onWakeWordDetected();
          }
          // Stop briefly to avoid multiple triggers
          this.recognition.stop();
          setTimeout(() => {
            if (this.isListening) {
              this.recognition.start();
            }
          }, 1000);
          break;
        }
      }
    };

    // Handle errors
    this.recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // Restart on certain errors
      if (event.error === 'no-speech' || event.error === 'audio-capture') {
        if (this.isListening) {
          setTimeout(() => {
            try {
              this.recognition.start();
            } catch (e) {
              console.error('Failed to restart recognition:', e);
            }
          }, 1000);
        }
      }
    };

    // Restart when ended (for continuous listening)
    this.recognition.onend = () => {
      if (this.isListening) {
        try {
          this.recognition.start();
        } catch (e) {
          console.error('Failed to restart recognition:', e);
        }
      }
    };
  }

  /**
   * Check if transcript contains wake word
   */
  private isWakeWord(transcript: string): boolean {
    const lowerTranscript = transcript.toLowerCase();
    
    // Check for exact match or contains wake word
    return this.wakeWordPhrases.some(phrase => {
      return lowerTranscript.includes(phrase) || 
             lowerTranscript === phrase ||
             lowerTranscript.startsWith(phrase);
    });
  }

  /**
   * Initialize and set callback
   */
  async initialize(onWakeWord: () => void): Promise<boolean> {
    if (!this.recognition) {
      console.error('Speech recognition not available');
      return false;
    }

    this.onWakeWordDetected = onWakeWord;
    console.log('✅ Web Speech API initialized');
    return true;
  }

  /**
   * Start listening for wake word
   */
  async startListening(): Promise<boolean> {
    if (this.isListening || !this.recognition) {
      return false;
    }

    try {
      // Request microphone permission (Electron will handle this)
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach(track => track.stop()); // Release immediately, recognition will handle it
      } catch (permError) {
        console.warn('Microphone permission check failed, but continuing:', permError);
        // Continue anyway - Electron might handle permission differently
      }
      
      // Start recognition
      this.recognition.start();
      this.isListening = true;
      console.log('🎤 Wake word detection started - listening for "Hey Minime"');
      
      return true;
    } catch (error: any) {
      console.error('Failed to start listening:', error);
      
      // Handle specific Electron/Chromium errors
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        console.error('Microphone permission denied. Please grant permission in System Settings.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        console.error('No microphone found. Please connect a microphone.');
      }
      
      this.isListening = false;
      return false;
    }
  }

  /**
   * Stop listening for wake word
   */
  stopListening(): void {
    this.isListening = false;
    
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore errors when stopping
      }
    }
    
    console.log('🛑 Wake word detection stopped');
  }

  /**
   * Release resources
   */
  release(): void {
    this.stopListening();
    this.recognition = null;
  }
}
