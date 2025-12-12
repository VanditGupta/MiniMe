/**
 * Wake Word Detection using Picovoice Porcupine Web SDK
 * Continuously listens for "Hey Minion" wake word in the renderer process
 */

import { PorcupineWorker } from '@picovoice/porcupine-web';

export class WakeWordDetector {
  private porcupineWorker: PorcupineWorker | null = null;
  private isListening: boolean = false;
  private onWakeWordDetected: (() => void) | null = null;
  private accessKey: string;

  constructor(accessKey: string) {
    this.accessKey = accessKey;
  }

  /**
   * Initialize Porcupine with the wake word model
   */
  async initialize(onWakeWord: () => void): Promise<boolean> {
    try {
      this.onWakeWordDetected = onWakeWord;

      // Get path to wake word model file
      const modelPath = '/assets/sounds/Hey-Minime_en_mac_v4_0_0.ppn';

      // Fetch the model file
      const response = await fetch(modelPath);
      if (!response.ok) {
        throw new Error(`Failed to load wake word model: ${response.statusText}`);
      }
      const keywordFile = await response.arrayBuffer();

      // Initialize Porcupine Worker
      this.porcupineWorker = await PorcupineWorker.init(
        this.accessKey,
        [keywordFile],
        [0.5], // Sensitivity (0.0 to 1.0)
        (keywordIndex: number) => {
          // Wake word detected callback
          console.log('🎤 Wake word detected: "Hey Minion"');
          if (this.onWakeWordDetected) {
            this.onWakeWordDetected();
          }
        }
      );

      console.log('✅ Porcupine initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize Porcupine:', error);
      return false;
    }
  }

  /**
   * Start listening for wake word
   */
  async startListening(): Promise<boolean> {
    if (this.isListening || !this.porcupineWorker) {
      return false;
    }

    try {
      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      // Start processing audio with Porcupine Worker
      await this.porcupineWorker.start();

      this.isListening = true;
      console.log('🎤 Wake word detection started - listening for "Hey Minion"');
      
      return true;
    } catch (error) {
      console.error('Failed to start listening:', error);
      this.isListening = false;
      return false;
    }
  }

  /**
   * Stop listening for wake word
   */
  stopListening(): void {
    this.isListening = false;
    
    if (this.porcupineWorker) {
      this.porcupineWorker.stop();
    }
    
    console.log('🛑 Wake word detection stopped');
  }

  /**
   * Release resources
   */
  release(): void {
    this.stopListening();
    if (this.porcupineWorker) {
      this.porcupineWorker.terminate();
      this.porcupineWorker = null;
    }
  }
}
