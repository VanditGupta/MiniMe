/**
 * Voice Processing System
 * Handles microphone input, audio processing, and TTS integration
 */

/**
 * Request microphone permission and start recording
 */
export async function startVoiceRecording(
  onAudioData: (audioBlob: Blob) => void,
  onError?: (error: Error) => void
): Promise<MediaRecorder | null> {
  try {
    // Request microphone permission
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // Create MediaRecorder
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'audio/webm;codecs=opus',
    });

    const audioChunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      onAudioData(audioBlob);
      
      // Stop all tracks
      stream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.onerror = (event) => {
      if (onError) {
        onError(new Error('MediaRecorder error'));
      }
    };

    return mediaRecorder;
  } catch (error) {
    console.error('Error accessing microphone:', error);
    if (onError) {
      onError(error as Error);
    }
    return null;
  }
}

/**
 * Convert audio blob to ArrayBuffer for IPC
 */
export async function audioBlobToArrayBuffer(audioBlob: Blob): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to convert audio to ArrayBuffer'));
      }
    };
    reader.onerror = reject;
    reader.readAsArrayBuffer(audioBlob);
  });
}

/**
 * Play audio response (TTS)
 */
export function playAudioResponse(audioUrl: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const audio = new Audio(audioUrl);
    audio.onended = () => resolve();
    audio.onerror = reject;
    audio.play().catch(reject);
  });
}

/**
 * Generate TTS audio using ElevenLabs API
 * TODO: Integrate with actual ElevenLabs API
 */
export async function generateTTS(
  text: string,
  voiceId: string,
  apiKey: string
): Promise<string> {
  // This is a placeholder - replace with actual ElevenLabs API call
  const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Accept': 'audio/mpeg',
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: 'eleven_monolingual_v1',
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    throw new Error(`TTS API error: ${response.statusText}`);
  }

  const audioBlob = await response.blob();
  const audioUrl = URL.createObjectURL(audioBlob);
  return audioUrl;
}

/**
 * Speech-to-text conversion
 * TODO: Integrate with actual STT service
 */
export async function speechToText(audioBlob: Blob): Promise<string> {
  // Placeholder - replace with actual STT API (e.g., OpenAI Whisper, Google Speech-to-Text)
  // For now, return empty string
  return '';
}

