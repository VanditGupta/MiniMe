import { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain, screen, globalShortcut } from 'electron';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

// Keep a global reference of the window and tray objects
let popupWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let checkInTimer: NodeJS.Timeout | null = null;
let isWindowVisible = false;
let isQuitting = false;

// Cute check-in phrases for the minion
const CHECK_IN_PHRASES = [
  "Hey buddy! What's poppin'? 🍌",
  "Whatcha working on? Need a minion break?",
  "How's it going, superstar? 😊",
  "Yo! Your little companion checking in!",
  "Bored yet? Wanna chat with your minion?",
  "Hey there! How's your day going?",
  "What's up, champ? Ready for a quick chat?",
  "Your minion friend is here! What's new?",
];

// Morning/Afternoon/Evening greetings
const TIME_BASED_GREETINGS = {
  morning: "Good morning sunshine! Ready to conquer the day? ☀️",
  afternoon: "How's the day treating you? Need a minion pep talk?",
  evening: "Wrapping up work? You did awesome today! 🌟",
};

/**
 * Create the adorable popup overlay window
 * This is the main window where the minion appears
 */
function createPopupWindow(): BrowserWindow {
  const { width, height } = screen.getPrimaryDisplay().workAreaSize;
  
  // Perfect minion size: 280x320px
  const windowWidth = 280;
  const windowHeight = 320;
  
  // Smart positioning: top-right corner with padding
  const x = width - windowWidth - 20;
  const y = 20;

  const win = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x,
    y,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000', // Fully transparent background
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    movable: true,
    roundedCorners: true,
    hasShadow: true,
    focusable: false, // Don't steal focus from other apps
    acceptFirstMouse: true, // Allow clicking without focus
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false,
    },
    show: false, // Don't show until ready
  });
  
  // Ensure window stays visible even when app loses focus
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  
  // Prevent window from being hidden when app loses focus
  win.on('blur', () => {
    // Don't hide on blur - keep window visible
  });
  
  win.on('hide', () => {
    // Only hide if explicitly requested, not on focus loss
  });

  // Load the app
  if (isDev) {
    win.loadURL('http://localhost:8080');
    // Uncomment for debugging
    // win.webContents.openDevTools();
  } else {
    win.loadFile(join(__dirname, '../dist/index.html'));
  }

  // Smooth entrance animation trigger
  win.once('ready-to-show', () => {
    win.show();
    win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    // Trigger entrance animation via IPC (no message)
    win.webContents.send('minion-appear');
  });
  
  // Keep window visible even when app loses focus
  win.on('blur', () => {
    // Don't hide - keep window visible
    if (!isQuitting) {
      win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    }
  });

  // Handle window close (hide instead of destroy)
  win.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      hidePopupWindow();
    }
  });

  // Click outside to dismiss
  win.setIgnoreMouseEvents(false, { forward: true });

  return win;
}

/**
 * Show the popup window with smooth slide-in animation
 */
function showPopupWindow(): void {
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.show();
    popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    popupWindow.focus(); // Ensure window is focused
    isWindowVisible = true;
    return;
  }

  popupWindow = createPopupWindow();
  isWindowVisible = true;
  
  // Ensure it stays visible
  if (popupWindow && !popupWindow.isDestroyed()) {
    popupWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
  }
}

/**
 * Hide the popup window with smooth slide-out
 */
function hidePopupWindow(): void {
  if (popupWindow && !popupWindow.isDestroyed()) {
    // Trigger exit animation before hiding
    popupWindow.webContents.send('minion-hide');
    
    // Wait for animation to complete, then hide
    setTimeout(() => {
      if (popupWindow && !popupWindow.isDestroyed()) {
        popupWindow.hide();
        isWindowVisible = false;
      }
    }, 300); // Match animation duration
  }
}

/**
 * Get a random check-in phrase
 */
function getRandomCheckInPhrase(): string {
  return CHECK_IN_PHRASES[Math.floor(Math.random() * CHECK_IN_PHRASES.length)];
}

/**
 * Get time-based greeting
 */
function getTimeBasedGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) {
    return TIME_BASED_GREETINGS.morning;
  } else if (hour < 17) {
    return TIME_BASED_GREETINGS.afternoon;
  } else {
    return TIME_BASED_GREETINGS.evening;
  }
}

/**
 * Check if we should interrupt the user
 * Respects Focus modes, full-screen apps, etc.
 */
async function shouldInterrupt(): Promise<boolean> {
  // TODO: Add logic to check:
  // - System Do Not Disturb status
  // - Full-screen applications
  // - Video calls (Zoom, Teams, etc.)
  // - Presentation mode
  
  // For now, always allow (can be enhanced later)
  return true;
}

/**
 * Automatic check-in system
 * Pops up randomly every 20-45 minutes
 */
function scheduleNextCheckIn(): void {
  if (checkInTimer) {
    clearTimeout(checkInTimer);
  }

  // Random interval between 20-45 minutes (in milliseconds)
  const minInterval = 20 * 60 * 1000; // 20 minutes
  const maxInterval = 45 * 60 * 1000; // 45 minutes
  const interval = Math.floor(Math.random() * (maxInterval - minInterval) + minInterval);

  checkInTimer = setTimeout(async () => {
    const canInterrupt = await shouldInterrupt();
    
    if (canInterrupt && !isWindowVisible) {
      showPopupWindow();
    }
    
    // Schedule next check-in
    scheduleNextCheckIn();
  }, interval);
}

/**
 * Create a programmatic tray icon (minion face)
 */
function createTrayIconBuffer() {
  const size = 22; // 22x22 for retina displays
  const buffer = Buffer.alloc(size * size * 4);
  
  // Yellow color (minion color) - RGB(255, 220, 0)
  const yellowR = 255;
  const yellowG = 220;
  const yellowB = 0;
  
  // Black for eyes
  const blackR = 0;
  const blackG = 0;
  const blackB = 0;
  
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 1;
  
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      const dx = x - centerX;
      const dy = y - centerY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      // Check if we're in the eye areas (two small circles)
      const leftEyeX = centerX - 4;
      const rightEyeX = centerX + 4;
      const eyeY = centerY - 2;
      const eyeRadius = 2.5;
      
      const leftEyeDist = Math.sqrt((x - leftEyeX) ** 2 + (y - eyeY) ** 2);
      const rightEyeDist = Math.sqrt((x - rightEyeX) ** 2 + (y - eyeY) ** 2);
      
      if (dist <= radius) {
        // Inside the main circle
        if (leftEyeDist <= eyeRadius || rightEyeDist <= eyeRadius) {
          // Draw eyes (black)
          buffer[idx] = blackR;
          buffer[idx + 1] = blackG;
          buffer[idx + 2] = blackB;
          buffer[idx + 3] = 255; // Alpha
        } else {
          // Draw yellow body
          buffer[idx] = yellowR;
          buffer[idx + 1] = yellowG;
          buffer[idx + 2] = yellowB;
          buffer[idx + 3] = 255; // Alpha
        }
      } else {
        // Transparent background
        buffer[idx] = 0;
        buffer[idx + 1] = 0;
        buffer[idx + 2] = 0;
        buffer[idx + 3] = 0; // Transparent
      }
    }
  }
  
  return nativeImage.createFromBuffer(buffer, { width: size, height: size });
}

/**
 * Create the menu bar tray icon
 */
function createTray(): void {
  // Try to load icon from file first
  const iconPath = isDev 
    ? join(process.cwd(), 'assets/icons/tray-icon.png')
    : join(__dirname, '../assets/icons/tray-icon.png');
  
  let trayIcon;
  
  try {
    const fileIcon = nativeImage.createFromPath(iconPath);
    if (!fileIcon.isEmpty()) {
      // Resize to appropriate tray size
      trayIcon = fileIcon.resize({ width: 22, height: 22 });
    } else {
      // Use programmatic icon
      trayIcon = createTrayIconBuffer();
    }
  } catch (error) {
    // Use programmatic icon as fallback
    console.log('Using programmatic tray icon');
    trayIcon = createTrayIconBuffer();
  }

  tray = new Tray(trayIcon);
  tray.setToolTip('Mini-Me Minion - Your adorable desktop companion');

  // Right-click menu
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show Minion',
      click: () => {
        showPopupWindow();
      },
    },
    {
      label: 'Settings',
      click: () => {
        // TODO: Open settings window
        console.log('Settings clicked');
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Take a Break',
      click: () => {
        hidePopupWindow();
        // Pause check-ins for 1 hour
        if (checkInTimer) {
          clearTimeout(checkInTimer);
          setTimeout(() => scheduleNextCheckIn(), 60 * 60 * 1000);
        }
      },
    },
    {
      type: 'separator',
    },
    {
      label: 'Quit',
      click: () => {
        isQuitting = true;
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);

  // Left-click to show/hide
  tray.on('click', () => {
    if (isWindowVisible) {
      hidePopupWindow();
    } else {
      showPopupWindow();
    }
  });
}

/**
 * IPC Handlers for renderer communication
 */
function setupIpcHandlers(): void {
  // Handle minion dismissal from renderer
  ipcMain.on('minion-dismiss', () => {
    hidePopupWindow();
  });

  // Handle minion state changes
  ipcMain.on('minion-state-change', (_event, state: string) => {
    console.log('Minion state changed:', state);
  });

  // Handle voice input
  ipcMain.on('voice-input', (_event, audioData: ArrayBuffer) => {
    // TODO: Process voice input and send to personality API
    console.log('Voice input received:', audioData.byteLength, 'bytes');
  });

  // Handle text input
  ipcMain.on('text-input', (_event, text: string) => {
    // TODO: Process text input and generate minion response
    console.log('Text input received:', text);
  });

  // Get app version
  ipcMain.handle('get-app-version', () => {
    return app.getVersion();
  });

  // Request microphone permission
  ipcMain.handle('request-microphone-permission', async () => {
    // On macOS, permissions are handled automatically
    // This is a placeholder for future permission checks
    return true;
  });

  // Handle wake word detection trigger
  ipcMain.on('wake-word-detected', () => {
    console.log('🎤 Wake word detected - showing minion');
    showPopupWindow();
  });
}

/**
 * Setup global keyboard shortcut
 */
function setupGlobalShortcut(): void {
  // ⌘⌥M to summon minion
  globalShortcut.register('CommandOrControl+Alt+M', () => {
    if (isWindowVisible) {
      hidePopupWindow();
    } else {
      showPopupWindow();
    }
  });
}

/**
 * App lifecycle management
 */
app.whenReady().then(() => {
  // Hide dock icon (menu bar only app)
  if (process.platform === 'darwin') {
    app.dock.hide();
  }

  // Create tray
  createTray();

  // Setup IPC handlers
  setupIpcHandlers();

  // Setup global shortcut
  setupGlobalShortcut();

  // Schedule first check-in after 5 minutes
  setTimeout(() => {
    scheduleNextCheckIn();
  }, 5 * 60 * 1000);

  // Show popup window on first launch (no message)
  setTimeout(() => {
    showPopupWindow();
  }, 2000);
});

app.on('window-all-closed', () => {
  // Don't quit when all windows are closed (menu bar app)
  // This is a menu bar app, so we don't quit
});

app.on('will-quit', () => {
  // Unregister global shortcuts
  globalShortcut.unregisterAll();
  
  // Clear timers
  if (checkInTimer) {
    clearTimeout(checkInTimer);
  }
});

app.on('activate', () => {
  // macOS specific: re-create window if needed
  if (!popupWindow || popupWindow.isDestroyed()) {
    showPopupWindow();
  }
});

// Handle app quit
app.on('before-quit', () => {
  isQuitting = true;
});

