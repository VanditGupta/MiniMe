/**
 * React hook for wake word detection using Web Speech API
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
    // Only initialize in Electron/browser
    if (typeof window === 'undefined') {
      return;
    }

    // Check if Web Speech API is available
    const SpeechRecognition = (window as any).SpeechRecognition || 
                             (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Web Speech API not supported in this browser. Please use Chrome, Edge, or Safari.');
      console.warn('⚠️ Web Speech API not available');
      return;
    }

    const detector = new WakeWordDetector();
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
            console.log('✅ Wake word detection active - say "Hey Minime"');
          } else {
            setError('Failed to start listening. Please grant microphone permission.');
          }
        } else {
          setError('Failed to initialize speech recognition');
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
