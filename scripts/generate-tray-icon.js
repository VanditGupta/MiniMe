const fs = require('fs');
const path = require('path');

/**
 * Generate a simple tray icon PNG programmatically
 * Creates a yellow circle with two black eyes (minion face)
 */

function generateTrayIcon() {
  const size = 22; // 22x22 for retina displays
  const buffer = Buffer.alloc(size * size * 4);
  
  // Yellow color (minion color)
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
  
  // Note: This creates a raw RGBA buffer
  // For a proper PNG, we'd need a library like 'pngjs' or 'sharp'
  // For now, we'll use Electron's nativeImage which can create from buffer
  return { buffer, width: size, height: size };
}

// Export for use in Electron main process
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { generateTrayIcon };
}

