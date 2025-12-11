import { motion, AnimatePresence } from "framer-motion";

export type BlobState = "sleeping" | "waking" | "listening" | "speaking";

interface TamagotchiBlobProps {
  state: BlobState;
}

const TamagotchiBlob = ({ state }: TamagotchiBlobProps) => {
  const isSleeping = state === "sleeping";
  const isWaking = state === "waking";
  const isListening = state === "listening";
  const isSpeaking = state === "speaking";

  return (
    <div className="relative">
      {/* Main blob body */}
      <motion.div
        className="relative w-48 h-72 bg-primary rounded-full glow-yellow"
        animate={{
          scale: isSleeping ? [1, 1.03, 1] : isWaking ? [1, 1.15, 1] : 1,
          y: isWaking ? [0, -40, 0] : 0,
          rotate: isSpeaking ? [-2, 2, -2] : 0,
          x: isSpeaking ? [-2, 2, -1, 1, 0] : 0,
        }}
        transition={{
          scale: {
            duration: isSleeping ? 3 : 0.5,
            repeat: isSleeping ? Infinity : 0,
            ease: "easeInOut",
          },
          y: {
            duration: 0.6,
            ease: [0.68, -0.55, 0.265, 1.55],
          },
          rotate: {
            duration: 0.1,
            repeat: isSpeaking ? Infinity : 0,
          },
          x: {
            duration: 0.1,
            repeat: isSpeaking ? Infinity : 0,
          },
        }}
      >
        {/* Body shine */}
        <div className="absolute top-8 left-6 w-8 h-16 bg-accent/40 rounded-full blur-sm transform -rotate-12" />
        
        {/* Eyes container */}
        <div className="absolute top-14 left-1/2 -translate-x-1/2 flex gap-4">
          {/* Left eye */}
          <motion.div
            className="relative w-10 h-10 bg-eye-pupil rounded-full overflow-hidden shadow-lg"
            animate={{
              scaleY: isSleeping ? 0.15 : 1,
              scale: isWaking ? [0.5, 1.3, 1] : 1,
            }}
            transition={{
              scaleY: { duration: 0.3 },
              scale: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55] },
            }}
          >
            {/* Big sparkle */}
            <motion.div
              className="absolute w-4 h-4 bg-eye-white rounded-full"
              animate={{
                x: isListening ? [-1, 1, -1] : isSpeaking ? [0, 2, -2, 0] : 0,
                scale: [1, 1.1, 1],
              }}
              style={{ top: "15%", left: "15%" }}
              transition={{
                x: { duration: 0.5, repeat: Infinity },
                scale: { duration: 1.5, repeat: Infinity },
              }}
            />
            {/* Small sparkle */}
            <motion.div
              className="absolute w-2 h-2 bg-eye-white rounded-full opacity-80"
              animate={{
                scale: [1, 1.2, 1],
              }}
              style={{ bottom: "25%", right: "20%" }}
              transition={{
                scale: { duration: 1.2, repeat: Infinity, delay: 0.3 },
              }}
            />
          </motion.div>

          {/* Right eye */}
          <motion.div
            className="relative w-10 h-10 bg-eye-pupil rounded-full overflow-hidden shadow-lg"
            animate={{
              scaleY: isSleeping ? 0.15 : 1,
              scale: isWaking ? [0.5, 1.3, 1] : 1,
            }}
            transition={{
              scaleY: { duration: 0.3 },
              scale: { duration: 0.4, ease: [0.68, -0.55, 0.265, 1.55], delay: 0.05 },
            }}
          >
            {/* Big sparkle */}
            <motion.div
              className="absolute w-4 h-4 bg-eye-white rounded-full"
              animate={{
                x: isListening ? [-1, 1, -1] : isSpeaking ? [0, 2, -2, 0] : 0,
                scale: [1, 1.1, 1],
              }}
              style={{ top: "15%", left: "15%" }}
              transition={{
                x: { duration: 0.5, repeat: Infinity, delay: 0.1 },
                scale: { duration: 1.5, repeat: Infinity, delay: 0.1 },
              }}
            />
            {/* Small sparkle */}
            <motion.div
              className="absolute w-2 h-2 bg-eye-white rounded-full opacity-80"
              animate={{
                scale: [1, 1.2, 1],
              }}
              style={{ bottom: "25%", right: "20%" }}
              transition={{
                scale: { duration: 1.2, repeat: Infinity, delay: 0.4 },
              }}
            />
          </motion.div>
        </div>

        {/* Rosy cheeks */}
        <div className="absolute top-24 left-1/2 -translate-x-1/2 flex gap-16">
          <div className="w-6 h-4 bg-pink-400/40 rounded-full blur-sm" />
          <div className="w-6 h-4 bg-pink-400/40 rounded-full blur-sm" />
        </div>

        {/* Mouth */}
        <motion.div
          className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-eye-pupil rounded-full"
          animate={{
            width: isSleeping ? 16 : isListening ? 24 : isSpeaking ? 28 : 20,
            height: isSleeping ? 8 : isListening ? 20 : isSpeaking ? 24 : 12,
            scaleY: isSpeaking ? [0.3, 1, 0.5, 0.8, 0.3] : 1,
            scaleX: isSpeaking ? [1, 0.8, 1.1, 0.9, 1] : 1,
          }}
          transition={{
            width: { duration: 0.2 },
            height: { duration: 0.2 },
            scaleY: { duration: 0.15, repeat: isSpeaking ? Infinity : 0 },
            scaleX: { duration: 0.15, repeat: isSpeaking ? Infinity : 0 },
          }}
        />

        {/* Sound waves when listening */}
        <AnimatePresence>
          {isListening && (
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1 items-end">
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="w-1 bg-eye-pupil rounded-full"
                  initial={{ height: 4 }}
                  animate={{ height: [4, 16, 4] }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              ))}
            </div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ZZZ when sleeping */}
      <AnimatePresence>
        {isSleeping && (
          <div className="absolute -top-4 -right-8">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="absolute text-2xl font-bold text-primary text-shadow-glow"
                initial={{ opacity: 0, y: 0, x: 0, scale: 0.5 }}
                animate={{
                  opacity: [0, 1, 0],
                  y: -60,
                  x: 30,
                  scale: 1.2,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.6,
                  ease: "easeOut",
                }}
                style={{
                  top: i * -10,
                  left: i * 15,
                  fontSize: `${1.2 + i * 0.3}rem`,
                }}
              >
                Z
              </motion.span>
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Little arms */}
      <motion.div
        className="absolute top-1/2 -left-6 w-8 h-4 bg-primary rounded-full"
        animate={{
          rotate: isSpeaking ? [-10, 10, -10] : isSleeping ? [0, 5, 0] : 0,
        }}
        transition={{ duration: isSpeaking ? 0.2 : 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-1/2 -right-6 w-8 h-4 bg-primary rounded-full"
        animate={{
          rotate: isSpeaking ? [10, -10, 10] : isSleeping ? [0, -5, 0] : 0,
        }}
        transition={{ duration: isSpeaking ? 0.2 : 2, repeat: Infinity, delay: 0.1 }}
      />

      {/* Little feet */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 flex gap-8">
        <motion.div
          className="w-8 h-4 bg-primary rounded-full"
          animate={{
            rotate: isSpeaking ? [-5, 5, -5] : 0,
          }}
          transition={{ duration: 0.15, repeat: isSpeaking ? Infinity : 0 }}
        />
        <motion.div
          className="w-8 h-4 bg-primary rounded-full"
          animate={{
            rotate: isSpeaking ? [5, -5, 5] : 0,
          }}
          transition={{ duration: 0.15, repeat: isSpeaking ? Infinity : 0, delay: 0.05 }}
        />
      </div>
    </div>
  );
};

export default TamagotchiBlob;
