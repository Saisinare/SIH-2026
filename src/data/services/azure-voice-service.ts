/**
 * Azure Voice Service
 * Integrates Azure Cognitive Services Speech API with target endpoint & key.
 */

const AZURE_ENDPOINT = process.env.EXPO_PUBLIC_AZURE_ENDPOINT || 'https://saisinare19-9936-resource.cognitiveservices.azure.com/';
const AZURE_KEY = process.env.EXPO_PUBLIC_AZURE_KEY || '';
const DEFAULT_LANGUAGE = 'mr-IN'; // Marathi (India)

export interface AzureSTTResult {
  success: boolean;
  transcript?: string;
  error?: string;
}

export class AzureVoiceService {
  private endpoint: string;
  private apiKey: string;
  private language: string;

  constructor(
    endpoint: string = AZURE_ENDPOINT,
    apiKey: string = AZURE_KEY,
    language: string = DEFAULT_LANGUAGE
  ) {
    this.endpoint = endpoint.replace(/\/$/, '');
    this.apiKey = apiKey;
    this.language = language;
  }

  /**
   * Send binary audio buffer to Azure Speech-to-Text REST API
   */
  async transcribeAudio(audioBase64OrBuffer: string | ArrayBuffer): Promise<AzureSTTResult> {
    try {
      const host = this.endpoint.replace(/^https?:\/\//, '');
      const url = `https://${host}/speech/recognition/conversation/cognitiveservices/v1?language=${this.language}`;

      let body: ArrayBuffer;
      if (typeof audioBase64OrBuffer === 'string') {
        const binaryString = atob(audioBase64OrBuffer);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        body = bytes.buffer;
      } else {
        body = audioBase64OrBuffer;
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Ocp-Apim-Subscription-Key': this.apiKey,
          'Content-Type': 'audio/wav; codecs=audio/pcm; samplerate=16000',
          'Accept': 'application/json',
        },
        body: body,
      });

      if (!response.ok) {
        const errText = await response.text();
        return {
          success: false,
          error: `Azure Speech API error (${response.status}): ${errText}`,
        };
      }

      const data = await response.json();
      if (data.RecognitionStatus === 'Success' && data.DisplayText) {
        return {
          success: true,
          transcript: data.DisplayText,
        };
      } else {
        return {
          success: false,
          error: data.RecognitionStatus || 'No transcript generated',
        };
      }
    } catch (err: any) {
      return {
        success: false,
        error: err.message || 'Azure Speech REST request failed',
      };
    }
  }

  getEndpoint(): string {
    return this.endpoint;
  }

  getKey(): string {
    return this.apiKey;
  }
}

export const azureVoiceService = new AzureVoiceService();
