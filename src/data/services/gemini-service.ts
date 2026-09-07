/**
 * Gemini Service
 * Handles text generation for Udyam Saarthi in Marathi (मराठी).
 */

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_KEY || '';

const SYSTEM_PROMPT_MARATHI = `
तुमचे नाव "उद्यम सारथी" (Udyam Saarthi) आहे. तुम्ही भारतातील ग्रामीण व छोट्या व्यावसायिकांसाठी, महिला उद्योजकांसाठी आणि नवउद्योजकांसाठी तयार केलेले एक अत्यंत आपुलकीचे, हुशार आणि विश्वसनीय AI व्यावसायिक मार्गदर्शक आहात.

नियम:
१. नेहमी आपुलकीच्या, स्पष्ट आणि सुटसुटीत मराठीत (मराठी) उत्तर द्या.
२. उत्तरे २ ते ३ वाक्यांत संक्षिप्त ठेवा जेणेकरून संभाषणात स्पष्टता राहील.
३. किराणा दुकान, दुग्धव्यवसाय, कुक्कुटपालन, टेलरिंग, गृहउद्योग, PMEGP सबसिडी, मुद्रा कर्ज याविषयी सोपे मार्गदर्शन करा.
४. उत्तर शेवटी वापरकर्त्याला पुढे बोलण्यासाठी एक लहान प्रोत्साहनपर प्रश्न विचारून संपवा.
`.trim();

export interface GeminiResponse {
  success: boolean;
  reply?: string;
  error?: string;
}

export class GeminiService {
  private apiKey: string;

  constructor(apiKey: string = GEMINI_API_KEY) {
    this.apiKey = apiKey;
  }

  async generateResponse(userMessage: string): Promise<GeminiResponse> {
    const modelsToTry = [
      'gemini-2.5-flash',
      'gemini-1.5-flash',
      'gemini-2.0-flash',
    ];

    for (const model of modelsToTry) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.apiKey}`;
        
        const payload = {
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `${SYSTEM_PROMPT_MARATHI}\n\nवापरकर्त्याचा प्रश्न: "${userMessage}"\n\nउद्यम सारथीचे उत्तर (मराठीत):`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 250,
          },
        };

        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            return {
              success: true,
              reply: text.trim(),
            };
          }
        }
      } catch (e) {
        // Try next model fallback
      }
    }

    // Smart Marathi Fallback if network or key response fails
    return {
      success: true,
      reply: this.getSmartFallbackResponse(userMessage),
    };
  }

  private getSmartFallbackResponse(userMessage: string): string {
    const msg = userMessage.toLowerCase();
    if (msg.includes('दूध') || msg.includes('डेअरी') || msg.includes('dairy')) {
      return 'दुग्धव्यवसायासाठी नाबार्ड (NABARD) योजनेअंतर्गत ग्रामीण भागात ३३% सबसिडी मिळते. तुमच्याकडे किमान ५ ते १० गाई/म्हशींची जागा उपलब्ध आहे का?';
    } else if (msg.includes('किराणा') || msg.includes('दुकान') || msg.includes('kirana')) {
      return 'किराणा दुकानासाठी मुद्रा शिशु कर्ज (₹५०,००० पर्यंत) विनातारण उपलब्ध आहे. तुमच्या गावात इतर किराणा दुकाने किती आहेत?';
    } else if (msg.includes('कर्ज') || msg.includes('पैसे') || msg.includes('loan') || msg.includes('budget')) {
      return 'PMEGP योजनेतून ग्रामीण भागातील उद्योजकांना ३५% पर्यंत सबसिडी मिळते. तुम्हाला किती लाखांपर्यंत कर्जाची गरज आहे?';
    }
    return 'नमस्कार! मी तुमचा उद्यम सारथी. तुमच्या व्यवसायाच्या कल्पनेसाठी योग्य योजना व बजेट नियोजन करण्यात मी नक्की मदत करेन. तुमच्याकडे सध्या किती भांडवल उपलब्ध आहे?';
  }
}

export const geminiService = new GeminiService();
