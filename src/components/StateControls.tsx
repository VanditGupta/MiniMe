import { motion } from "framer-motion";
import { Moon, Zap, Mic, MessageCircle } from "lucide-react";
import type { BlobState } from "./TamagotchiBlob";
import { sounds } from "@/lib/sounds";

interface StateControlsProps {
  currentState: BlobState;
  onStateChange: (state: BlobState) => void;
}

const StateControls = ({ currentState, onStateChange }: StateControlsProps) => {
  const states: { state: BlobState; icon: typeof Moon; label: string }[] = [
    { state: "sleeping", icon: Moon, label: "Sleep" },
    { state: "waking", icon: Zap, label: "Wake" },
    { state: "listening", icon: Mic, label: "Listen" },
    { state: "speaking", icon: MessageCircle, label: "Speak" },
  ];

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      {states.map(({ state, icon: Icon, label }) => (
        <motion.button
          key={state}
          onClick={() => {
            sounds.pop(); // Play pop sound on button click
            onStateChange(state);
          }}
          className={`flex flex-col items-center gap-1 px-4 py-3 rounded-2xl backdrop-blur-sm transition-all ${
            currentState === state
              ? "bg-primary/30 border-2 border-primary"
              : "bg-muted/50 border border-muted-foreground/20 hover:bg-muted"
          }`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Icon
            className={`w-5 h-5 ${
              currentState === state ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <span
            className={`text-xs font-medium ${
              currentState === state ? "text-primary" : "text-muted-foreground"
            }`}
          >
            {label}
          </span>
        </motion.button>
      ))}
    </div>
  );
};

export default StateControls;
