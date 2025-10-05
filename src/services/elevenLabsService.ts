// elevenLabsService.ts
import { translateText } from './translationService'; // 👈 make sure this file exists

export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', voice: 'Rachel' },
  { code: 'es', name: 'Spanish', voice: 'Antoni' },
  { code: 'zh', name: 'Chinese', voice: 'Bella' },
  { code: 'hi', name: 'Hindi', voice: 'Rachel' },
  { code: 'ar', name: 'Arabic', voice: 'Adam' },
  { code: 'fr', name: 'French', voice: 'Charlotte' },
  { code: 'pt', name: 'Portuguese', voice: 'Matilda' },
  { code: 'ko', name: 'Korean', voice: 'Sam' },
];

export async function textToSpeech(
  text: string,
  languageCode: string = 'en'
): Promise<string | null> {
  const ELEVENLABS_API_KEY = import.meta.env.VITE_ELEVENLABS_API_KEY;

  if (!ELEVENLABS_API_KEY) {
    return null;
  }

  try {
    const finalText =
      languageCode !== 'en' ? await translateText(text, languageCode) : text;

    const voiceId = getVoiceIdForLanguage(languageCode);

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        Accept: 'audio/mpeg',
        'Content-Type': 'application/json',
        'xi-api-key': ELEVENLABS_API_KEY,
      },
      body: JSON.stringify({
        text: finalText,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`ElevenLabs API error: ${response.status}`);
    }

    // ✅ STEP 4: Convert to playable audio
    const audioBlob = await response.blob();
    console.log('🎧 Audio blob size:', audioBlob.size);
    return URL.createObjectURL(audioBlob);
  } catch (error) {
    console.error('⚠️ Text-to-speech error:', error);
    return null;
  }
}

// Voice ID map
function getVoiceIdForLanguage(languageCode: string): string {
  const voiceIds: Record<string, string> = {
    en: '21m00Tcm4TlvDq8ikWAM', // English
    es: 'ErXwobaYiN019PkySvjV', // Spanish
    zh: 'XrExE9yKIg1WjnnlVkGX', // Chinese
    hi: '21m00Tcm4TlvDq8ikWAM', // Hindi
    ar: 'EXAVITQu4vr4xnSDxMaL', // Arabic
    fr: 'XB0fDUnXU5powFXDhCwa', // French
    pt: 'EXAVITQu4vr4xnSDxMaL', // Portuguese
    ko: 'yoZ06aMxZJJ28mfd3POQ', // Korean
  };
  return voiceIds[languageCode] || voiceIds.en;
}


// Create audio player utility
export function createAudioPlayer(audioUrl: string): HTMLAudioElement {
  const audio = new Audio(audioUrl);
  audio.preload = 'auto';
  return audio;
}
