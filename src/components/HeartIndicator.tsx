import { motion } from "framer-motion";
import { Heart } from "lucide-react";

interface HeartIndicatorProps {
  isExcited: boolean;
}

const HeartIndicator = ({ isExcited }: HeartIndicatorProps) => {
  return (
    <motion.div
      className="fixed bottom-8 right-8 flex items-center gap-2"
      animate={{
        scale: isExcited ? [1, 1.3, 1] : [1, 1.15, 1, 1.1, 1],
      }}
      transition={{
        duration: isExcited ? 0.3 : 1,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Heart
        className="w-8 h-8 text-heart fill-heart"
        style={{
          filter: `drop-shadow(0 0 ${isExcited ? "15px" : "8px"} hsl(350 90% 55% / ${isExcited ? 0.8 : 0.5}))`,
        }}
      />
      <motion.div
        className="flex gap-0.5"
        animate={{ opacity: isExcited ? 1 : 0.6 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-1 h-3 bg-heart rounded-full"
            animate={{
              scaleY: isExcited ? [0.3, 1, 0.3] : [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: isExcited ? 0.2 : 0.5,
              repeat: Infinity,
              delay: i * 0.1,
            }}
          />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default HeartIndicator;
