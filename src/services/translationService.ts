// translationService.ts
export async function translateText(text: string, targetLang: string): Promise<string> {
    const apiKey = import.meta.env.VITE_DEEPL_API_KEY;
  
    if (!apiKey) {
      console.error('❌ DeepL API key not found.');
      return text;
    }
  
    try {
      const response = await fetch('https://api-free.deepl.com/v2/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `DeepL-Auth-Key ${apiKey}`,
        },
        body: new URLSearchParams({
          text,
          target_lang: targetLang.toUpperCase(),
        }),
      });
  
      const data = await response.json();
      if (data.message) throw new Error(data.message);
  
      return data.translations[0].text;
    } catch (error) {
      console.error('⚠️ DeepL Translation error:', error);
      return text;
    }
  }
  