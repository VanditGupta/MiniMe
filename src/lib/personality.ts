/**
 * Personality System for Mini-Me Minion
 * Handles emotional intelligence, adaptive responses, and minion personality
 */

export type UserMood = 'happy' | 'sad' | 'stressed' | 'excited' | 'neutral';

export interface PersonalityResponse {
  text: string;
  mood: UserMood;
  tone: 'encouraging' | 'celebratory' | 'supportive' | 'upbeat' | 'comforting';
  emoji: string;
}

/**
 * Detect user mood from text input
 */
export function detectMood(text: string): UserMood {
  const lowerText = text.toLowerCase();
  
  // Happy indicators
  const happyWords = ['happy', 'great', 'awesome', 'amazing', 'excited', 'love', 'wonderful', 'fantastic', 'yay', 'yes!', '🎉', '😊', '😄'];
  if (happyWords.some(word => lowerText.includes(word))) {
    return 'happy';
  }
  
  // Excited indicators
  const excitedWords = ['yes!', 'woohoo', 'can\'t wait', 'so pumped', 'epic', 'incredible', '🚀', '🔥'];
  if (excitedWords.some(word => lowerText.includes(word))) {
    return 'excited';
  }
  
  // Sad indicators
  const sadWords = ['sad', 'down', 'upset', 'disappointed', 'frustrated', 'tired', 'exhausted', '😢', '😞', '😔'];
  if (sadWords.some(word => lowerText.includes(word))) {
    return 'sad';
  }
  
  // Stressed indicators
  const stressedWords = ['stressed', 'overwhelmed', 'anxious', 'worried', 'pressure', 'deadline', 'busy', 'too much', '😰', '😓'];
  if (stressedWords.some(word => lowerText.includes(word))) {
    return 'stressed';
  }
  
  return 'neutral';
}

/**
 * Generate minion response based on user mood and input
 */
export function generateMinionResponse(userInput: string, detectedMood: UserMood): PersonalityResponse {
  const responses: Record<UserMood, PersonalityResponse[]> = {
    happy: [
      {
        text: "OMG yes! That's amazing! I'm so happy for you! Let's celebrate! 🎉",
        mood: 'happy',
        tone: 'celebratory',
        emoji: '🎉',
      },
      {
        text: "That's fantastic! You're doing awesome! Keep that positive energy going! ✨",
        mood: 'happy',
        tone: 'celebratory',
        emoji: '✨',
      },
      {
        text: "YESSS! I'm so pumped for you! This is gonna be EPIC! 🚀",
        mood: 'excited',
        tone: 'celebratory',
        emoji: '🚀',
      },
    ],
    excited: [
      {
        text: "YESSS! I'm so pumped for you! This is gonna be EPIC! 🚀",
        mood: 'excited',
        tone: 'celebratory',
        emoji: '🚀',
      },
      {
        text: "That sounds INCREDIBLE! I'm getting excited just hearing about it! 🔥",
        mood: 'excited',
        tone: 'celebratory',
        emoji: '🔥',
      },
      {
        text: "WOW! That's so cool! Tell me more! I'm all ears! 👂",
        mood: 'excited',
        tone: 'upbeat',
        emoji: '👂',
      },
    ],
    sad: [
      {
        text: "Aww, that sounds tough buddy... your minion is here for you! Want to talk about it? 🫂",
        mood: 'sad',
        tone: 'comforting',
        emoji: '🫂',
      },
      {
        text: "I'm sorry you're feeling down. Remember, tough times don't last, but tough minions do! You've got this! 💛",
        mood: 'sad',
        tone: 'supportive',
        emoji: '💛',
      },
      {
        text: "Hey, it's okay to feel this way. I'm here to listen and support you. You're not alone! 🤗",
        mood: 'sad',
        tone: 'comforting',
        emoji: '🤗',
      },
    ],
    stressed: [
      {
        text: "Whoa, take a deep breath with me! You've got this, champion! Let's break it down step by step 💪",
        mood: 'stressed',
        tone: 'supportive',
        emoji: '💪',
      },
      {
        text: "I know it feels overwhelming, but you're stronger than you think! One thing at a time, buddy! 🌟",
        mood: 'stressed',
        tone: 'encouraging',
        emoji: '🌟',
      },
      {
        text: "Let's take a moment together. You're doing great, even if it doesn't feel like it right now. Deep breaths! 🧘",
        mood: 'stressed',
        tone: 'comforting',
        emoji: '🧘',
      },
    ],
    neutral: [
      {
        text: "That's interesting! Tell me more about that! 😊",
        mood: 'neutral',
        tone: 'upbeat',
        emoji: '😊',
      },
      {
        text: "Cool! I'm here to chat whenever you need me! What else is on your mind? 🤔",
        mood: 'neutral',
        tone: 'upbeat',
        emoji: '🤔',
      },
      {
        text: "Nice! Your minion friend is always here to listen! What's next? 🍌",
        mood: 'neutral',
        tone: 'upbeat',
        emoji: '🍌',
      },
    ],
  };

  const moodResponses = responses[detectedMood];
  return moodResponses[Math.floor(Math.random() * moodResponses.length)];
}

/**
 * Generate check-in message based on time of day and context
 */
export function generateCheckInMessage(): string {
  const hour = new Date().getHours();
  const messages = [];

  if (hour < 12) {
    messages.push("Good morning sunshine! Ready to conquer the day? ☀️");
    messages.push("Morning! How's your day starting? Need a minion boost? 🌅");
  } else if (hour < 17) {
    messages.push("How's the day treating you? Need a minion pep talk?");
    messages.push("Afternoon check-in! How are things going? 😊");
  } else {
    messages.push("Wrapping up work? You did awesome today! 🌟");
    messages.push("Evening time! How was your day? Want to share? 🌙");
  }

  // Add general check-ins
  messages.push("Hey buddy! What's poppin'? 🍌");
  messages.push("Whatcha working on? Need a minion break?");
  messages.push("How's it going, superstar? 😊");
  messages.push("Yo! Your little companion checking in!");

  return messages[Math.floor(Math.random() * messages.length)];
}

/**
 * Generate goodbye message
 */
export function generateGoodbyeMessage(): string {
  const messages = [
    "Alright buddy, back to work! I'll check on you later! 😊",
    "See you soon! Your minion will be here when you need me! 👋",
    "Take care! I'm always here for you! 💛",
    "Catch you later! Remember, I'm always in your corner! 🍌",
    "Bye for now! Your minion friend will be back soon! ✨",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
}

