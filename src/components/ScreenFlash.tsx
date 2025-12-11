import { motion, AnimatePresence } from "framer-motion";

interface ScreenFlashProps {
  isFlashing: boolean;
}

const ScreenFlash = ({ isFlashing }: ScreenFlashProps) => {
  return (
    <AnimatePresence>
      {isFlashing && (
        <motion.div
          className="fixed inset-0 bg-primary pointer-events-none z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.8, 0] }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        />
      )}
    </AnimatePresence>
  );
};

export default ScreenFlash;
