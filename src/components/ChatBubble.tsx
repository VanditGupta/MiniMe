import { motion } from "framer-motion";

interface ChatBubbleProps {
  message: string;
  isUser: boolean;
  index: number;
  side: "left" | "right";
}

const ChatBubble = ({ message, isUser, index, side }: ChatBubbleProps) => {
  return (
    <motion.div
      className={`max-w-48 px-4 py-3 rounded-2xl backdrop-blur-sm ${
        side === "left" ? "ml-4" : "mr-4"
      } ${
        isUser
          ? "bg-primary/20 border border-primary/30"
          : "bg-bubble-bg border border-bubble-border"
      }`}
      initial={{ opacity: 0, y: 20, x: side === "left" ? -20 : 20 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      }}
    >
      <p className={`text-sm ${isUser ? "text-primary" : "text-foreground/80"}`}>
        {message}
      </p>
      <div
        className={`absolute top-3 ${
          side === "left" ? "-left-2" : "-right-2"
        } w-0 h-0 border-8 border-transparent ${
          isUser
            ? side === "left"
              ? "border-r-primary/20"
              : "border-l-primary/20"
            : side === "left"
            ? "border-r-bubble-bg"
            : "border-l-bubble-bg"
        }`}
      />
    </motion.div>
  );
};

export default ChatBubble;
