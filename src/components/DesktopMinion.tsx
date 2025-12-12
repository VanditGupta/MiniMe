import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TamagotchiBlob, { type BlobState } from "@/components/TamagotchiBlob";
import ScreenFlash from "@/components/ScreenFlash";
import StateControls from "@/components/StateControls";
import { sounds } from "@/lib/sounds";
import { useWakeWord } from "@/hooks/use-wake-word";

interface DesktopMinionProps {
  initialMessage?: string;
}

/**
 * Desktop-specific Minion component
 * Enhanced for Electron with auto-greetings, dismissal, and desktop features
 */
const DesktopMinion = ({ initialMessage }: DesktopMinionProps) => {
  const [blobState, setBlobState] = useState<BlobState>("sleeping");
  const [isFlashing, setIsFlashing] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  // Initialize wake word detection
  const { isListening, error: wakeWordError } = useWakeWord(() => {
    // When wake word is detected, show the minion with subtle confirmation
    setIsVisible(true);
    setIsFlashing(true);
    setBlobState("waking");
    // Play very subtle wake word confirmation (like "Hey Siri")
    sounds.wakeWordConfirm(); // Very quiet, short sound
    setTimeout(() => setIsFlashing(false), 300);
    setTimeout(() => setBlobState("listening"), 800);
  });

  // Handle Electron IPC messages
  useEffect(() => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      // Listen for minion appearance
      window.electronAPI.onMinionAppear(() => {
        handleMinionAppear();
      });

      // Listen for hide command
      window.electronAPI.onMinionHide(() => {
        handleDismiss();
      });

      // Cleanup on unmount
      return () => {
        window.electronAPI?.removeAllListeners('minion-appear');
        window.electronAPI?.removeAllListeners('minion-hide');
      };
    }
  }, []);

  // Handle initial message
  useEffect(() => {
    if (initialMessage) {
      handleMinionAppear(initialMessage);
    }
  }, [initialMessage]);

  /**
   * Handle minion appearance (no greeting)
   */
  const handleMinionAppear = (greeting?: string) => {
    setIsVisible(true);
    setIsFlashing(true);
    setBlobState("sleeping");
    
    // Play jingle when appearing
    sounds.jingle();
    
    setTimeout(() => setIsFlashing(false), 300);
  };

  /**
   * Handle graceful dismissal
   */
  const handleDismiss = () => {
    setBlobState("sleeping");
    
    // Hide immediately without messages
    setIsVisible(false);
    if (window.electronAPI) {
      window.electronAPI.dismissMinion();
    }
  };

  /**
   * Handle state change from buttons
   */
  const handleStateChange = (newState: BlobState) => {
    if (newState === "waking" && blobState === "sleeping") {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);
      sounds.wakeUp(); // Play wake-up sound
    } else if (newState === "sleeping") {
      sounds.sleep(); // Play sleep sound
    } else if (newState === "listening") {
      sounds.listening(); // Play listening sound
    } else if (newState === "speaking") {
      sounds.speaking(); // Play speaking sound
    } else {
      sounds.randomChime(); // Random chime variation for other state changes
    }
    
    setBlobState(newState);
    
    // Send state change to main process
    if (window.electronAPI) {
      window.electronAPI.sendMinionState(newState);
    }
  };

  // Auto-transition from waking to listening
  useEffect(() => {
    if (blobState === "waking") {
      const timer = setTimeout(() => {
        setBlobState("listening");
        sounds.listening(); // Play listening sound when transitioning
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [blobState]);

  const isExcited = blobState === "waking" || blobState === "speaking";

  // Handle escape key to dismiss
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleDismiss();
      }
    };
    
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!isVisible) {
    return null;
  }

  return (
    <div 
      className="relative w-full h-full overflow-hidden rounded-2xl"
      style={{ background: 'transparent' }}
      onClick={(e) => {
        // Click outside to dismiss (but not on the minion itself)
        if (e.target === e.currentTarget) {
          handleDismiss();
        }
      }}
    >
      <ScreenFlash isFlashing={isFlashing} />

      {/* Ambient glow behind blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{ background: "hsl(var(--primary))" }}
        animate={{
          scale: blobState === "speaking" ? [1, 1.2, 1] : [1, 1.1, 1],
          opacity: blobState === "sleeping" ? 0.1 : blobState === "speaking" ? 0.4 : 0.2,
        }}
        transition={{
          duration: blobState === "speaking" ? 0.5 : 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />


      {/* Main blob character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <motion.div
          animate={{
            y: blobState === "sleeping" ? [0, -5, 0] : 0,
          }}
          transition={{
            duration: 4,
            repeat: blobState === "sleeping" ? Infinity : 0,
            ease: "easeInOut",
          }}
        >
          <TamagotchiBlob state={blobState} />
        </motion.div>
      </div>


      {/* State controls - Sleep, Wake, Listen, Speak buttons */}
      <StateControls currentState={blobState} onStateChange={handleStateChange} />

      {/* Floating particles when speaking */}
      <AnimatePresence>
        {blobState === "speaking" && (
          <>
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full pointer-events-none"
                style={{
                  left: `${45 + Math.random() * 10}%`,
                  top: `${40 + Math.random() * 20}%`,
                }}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  y: [0, -100 - Math.random() * 50],
                  x: [(Math.random() - 0.5) * 100],
                }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{
                  duration: 1 + Math.random(),
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </>
        )}
      </AnimatePresence>

      {/* Subtle stars in background */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-foreground/20 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.1, 0.5, 0.1],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default DesktopMinion;

