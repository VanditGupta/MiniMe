// Electron API type declarations
declare global {
  interface Window {
    electronAPI?: {
      dismissMinion: () => void;
      onMinionAppear: (callback: () => void) => void;
      onMinionHide: (callback: () => void) => void;
      sendMinionState: (state: string) => void;
      sendVoiceInput: (audioData: ArrayBuffer) => void;
      sendTextInput: (text: string) => void;
      getAppVersion: () => Promise<string>;
      requestMicrophonePermission: () => Promise<boolean>;
      removeAllListeners: (channel: string) => void;
    };
  }
}

export {};

