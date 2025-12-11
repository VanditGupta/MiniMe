import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TamagotchiBlob, { type BlobState } from "@/components/TamagotchiBlob";
import ChatBubble from "@/components/ChatBubble";
import HeartIndicator from "@/components/HeartIndicator";
import ScreenFlash from "@/components/ScreenFlash";
import StateControls from "@/components/StateControls";
import DesktopMinion from "@/components/DesktopMinion";

// Check if running in Electron
const isElectron = typeof window !== 'undefined' && window.electronAPI !== undefined;

const Index = () => {
  // If running in Electron, use the desktop version
  if (isElectron) {
    return <DesktopMinion />;
  }

  // Original web version
  const [blobState, setBlobState] = useState<BlobState>("sleeping");
  const [isFlashing, setIsFlashing] = useState(false);
  const [messages] = useState<Array<{ message: string; isUser: boolean }>>([]);

  const handleStateChange = (newState: BlobState) => {
    if (newState === "waking" && blobState === "sleeping") {
      setIsFlashing(true);
      setTimeout(() => setIsFlashing(false), 300);
    }
    setBlobState(newState);
  };

  // Auto-transition from waking to listening after the animation
  useEffect(() => {
    if (blobState === "waking") {
      const timer = setTimeout(() => {
        setBlobState("listening");
      }, 800);
      return () => clearTimeout(timer);
    }
  }, [blobState]);

  const isExcited = blobState === "waking" || blobState === "speaking";

  return (
    <div className="relative min-h-screen overflow-hidden" style={{ background: 'transparent' }}>
      <ScreenFlash isFlashing={isFlashing} />

      {/* Ambient glow behind blob */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full opacity-20 blur-3xl"
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

      {/* Left side chat bubbles */}
      <div className="fixed left-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 max-h-[60vh] overflow-hidden">
        <AnimatePresence>
          {messages.slice(0, 3).map((msg, i) => (
            <ChatBubble
              key={i}
              message={msg.message}
              isUser={msg.isUser}
              index={i}
              side="left"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Right side chat bubbles */}
      <div className="fixed right-0 top-1/2 -translate-y-1/2 flex flex-col gap-4 items-end max-h-[60vh] overflow-hidden">
        <AnimatePresence>
          {messages.slice(3).map((msg, i) => (
            <ChatBubble
              key={i + 3}
              message={msg.message}
              isUser={msg.isUser}
              index={i}
              side="right"
            />
          ))}
        </AnimatePresence>
      </div>

      {/* Main blob character */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
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

      {/* Heart indicator */}
      <HeartIndicator isExcited={isExcited} />

      {/* State controls */}
      <StateControls currentState={blobState} onStateChange={handleStateChange} />

      {/* Floating particles when speaking */}
      <AnimatePresence>
        {blobState === "speaking" && (
          <>
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-primary rounded-full"
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
        {[...Array(20)].map((_, i) => (
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

export default Index;
