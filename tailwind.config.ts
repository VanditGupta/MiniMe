import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        fredoka: ['Fredoka', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        heart: "hsl(var(--heart))",
        "heart-glow": "hsl(var(--heart-glow))",
        "eye-white": "hsl(var(--eye-white))",
        "eye-pupil": "hsl(var(--eye-pupil))",
        "bubble-bg": "hsl(var(--bubble-bg))",
        "bubble-border": "hsl(var(--bubble-border))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-slow": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.05)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
        "heartbeat": {
          "0%, 100%": { transform: "scale(1)" },
          "25%": { transform: "scale(1.2)" },
          "50%": { transform: "scale(1)" },
          "75%": { transform: "scale(1.15)" },
        },
        "heartbeat-fast": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.3)" },
        },
        "zzz-float": {
          "0%": { opacity: "0", transform: "translateY(0) translateX(0) scale(0.5)" },
          "50%": { opacity: "1" },
          "100%": { opacity: "0", transform: "translateY(-60px) translateX(30px) scale(1.2)" },
        },
        "blink": {
          "0%, 90%, 100%": { transform: "scaleY(1)" },
          "95%": { transform: "scaleY(0.1)" },
        },
        "eye-pop": {
          "0%": { transform: "scale(0.5) translateY(10px)" },
          "50%": { transform: "scale(1.3)" },
          "100%": { transform: "scale(1)" },
        },
        "jump": {
          "0%, 100%": { transform: "translateY(0)" },
          "30%": { transform: "translateY(-50px) scale(1.1)" },
          "50%": { transform: "translateY(-30px)" },
          "70%": { transform: "translateY(-40px) scale(1.05)" },
        },
        "screen-flash": {
          "0%, 100%": { opacity: "0" },
          "50%": { opacity: "0.8" },
        },
        "sound-wave": {
          "0%, 100%": { transform: "scaleY(0.3)" },
          "50%": { transform: "scaleY(1)" },
        },
        "mouth-speak": {
          "0%, 100%": { transform: "scaleY(0.3) scaleX(1)" },
          "25%": { transform: "scaleY(1) scaleX(0.8)" },
          "50%": { transform: "scaleY(0.5) scaleX(1.1)" },
          "75%": { transform: "scaleY(0.8) scaleX(0.9)" },
        },
        "vibrate": {
          "0%, 100%": { transform: "translateX(0)" },
          "25%": { transform: "translateX(-2px) rotate(-1deg)" },
          "50%": { transform: "translateX(2px) rotate(1deg)" },
          "75%": { transform: "translateX(-1px) rotate(-0.5deg)" },
        },
        "bubble-float": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-slow": "pulse-slow 3s ease-in-out infinite",
        "float": "float 4s ease-in-out infinite",
        "wiggle": "wiggle 0.15s ease-in-out infinite",
        "heartbeat": "heartbeat 1s ease-in-out infinite",
        "heartbeat-fast": "heartbeat-fast 0.3s ease-in-out infinite",
        "zzz-float": "zzz-float 2s ease-out infinite",
        "blink": "blink 4s ease-in-out infinite",
        "eye-pop": "eye-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "jump": "jump 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)",
        "screen-flash": "screen-flash 0.3s ease-out",
        "sound-wave": "sound-wave 0.5s ease-in-out infinite",
        "mouth-speak": "mouth-speak 0.2s ease-in-out infinite",
        "vibrate": "vibrate 0.1s ease-in-out infinite",
        "bubble-float": "bubble-float 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
