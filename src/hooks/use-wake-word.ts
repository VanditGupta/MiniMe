/**
 * React hook for wake word detection
 * Automatically starts listening when component mounts
 */

import { useEffect, useRef, useState } from 'react';
import { WakeWordDetector } from '@/lib/wake-word';

export function useWakeWord(onWakeWord: () => void) {
  const detectorRef = useRef<WakeWordDetector | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Only initialize in Electron
    if (typeof window === 'undefined' || !window.electronAPI) {
      return;
    }

    // Get Picovoice access key from environment or use placeholder
    // User should set this in their .env file or config
    const accessKey = import.meta.env.VITE_PICOVOICE_ACCESS_KEY || '';
    
    if (!accessKey) {
      setError('Picovoice Access Key not found. Please set VITE_PICOVOICE_ACCESS_KEY in your .env file.');
      console.warn('⚠️ Picovoice Access Key not configured. Wake word detection will not work.');
      return;
    }

    const detector = new WakeWordDetector(accessKey);
    detectorRef.current = detector;

    // Initialize and start listening
    const init = async () => {
      try {
        const initialized = await detector.initialize(() => {
          // Wake word detected!
          console.log('🎤 Wake word detected!');
          onWakeWord();
          
          // Notify main process to show minion
          if (window.electronAPI) {
            window.electronAPI.send('wake-word-detected');
          }
        });

        if (initialized) {
          setIsInitialized(true);
          const started = await detector.startListening();
          setIsListening(started);
          
          if (started) {
            console.log('✅ Wake word detection active - say "Hey Minion"');
          } else {
            setError('Failed to start listening');
          }
        } else {
          setError('Failed to initialize Porcupine');
        }
      } catch (err) {
        console.error('Wake word initialization error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    init();

    // Cleanup on unmount
    return () => {
      if (detectorRef.current) {
        detectorRef.current.release();
        detectorRef.current = null;
      }
    };
  }, [onWakeWord]);

  return {
    isInitialized,
    isListening,
    error,
    start: async () => {
      if (detectorRef.current) {
        const started = await detectorRef.current.startListening();
        setIsListening(started);
        return started;
      }
      return false;
    },
    stop: () => {
      if (detectorRef.current) {
        detectorRef.current.stopListening();
        setIsListening(false);
      }
    },
  };
}

