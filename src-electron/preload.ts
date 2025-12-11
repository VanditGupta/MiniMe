import { contextBridge, ipcRenderer } from 'electron';

/**
 * Preload script - Secure bridge between main process and renderer
 * Exposes safe APIs to the renderer process
 */

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Minion window controls
  dismissMinion: () => ipcRenderer.send('minion-dismiss'),
  
  // Minion state management
  onMinionAppear: (callback: () => void) => {
    ipcRenderer.on('minion-appear', () => callback());
  },
  
  onMinionHide: (callback: () => void) => {
    ipcRenderer.on('minion-hide', () => callback());
  },
  
  sendMinionState: (state: string) => {
    ipcRenderer.send('minion-state-change', state);
  },
  
  // Voice and text input
  sendVoiceInput: (audioData: ArrayBuffer) => {
    ipcRenderer.send('voice-input', audioData);
  },
  
  sendTextInput: (text: string) => {
    ipcRenderer.send('text-input', text);
  },
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  
  // Permissions
  requestMicrophonePermission: () => 
    ipcRenderer.invoke('request-microphone-permission'),
  
  // Remove listeners (cleanup)
  removeAllListeners: (channel: string) => {
    ipcRenderer.removeAllListeners(channel);
  },
});

// Type declaration for TypeScript
declare global {
  interface Window {
    electronAPI: {
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

