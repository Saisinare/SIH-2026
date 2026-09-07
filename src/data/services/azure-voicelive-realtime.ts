/**
 * Azure AI Foundry VoiceLive Realtime Client (TypeScript / WebSockets)
 * Connects to Azure VoiceLive Realtime API with full bidirectional audio streaming.
 */

export const AZURE_VOICELIVE_CONFIG = {
  endpoint: process.env.EXPO_PUBLIC_AZURE_ENDPOINT || 'https://saisinare19-9936-resource.cognitiveservices.azure.com/',
  apiKey: process.env.EXPO_PUBLIC_AZURE_KEY || '',
  model: 'gpt-realtime',
  voice: 'mr-IN-AarohiNeural',
  instructions: `
तुमचे नाव "उद्यम सारथी" (Udyam Saarthi) आहे. तुम्ही भारतातील ग्रामीण व छोट्या व्यावसायिकांसाठी, महिला उद्योजकांसाठी आणि नवउद्योजकांसाठी तयार केलेले अत्यंत आपुलकीचे आणि हुशार AI व्यावसायिक मार्गदर्शक आहात.

१. नेहमी आपुलकीच्या, सोप्या आणि आदरयुक्त मराठीत (मराठी) उत्तर द्या.
२. उत्तरे संक्षिप्त (२-३ वाक्यांत) ठेवा.
३. किराणा दुकान, दुग्धव्यवसाय, कुक्कुटपालन, टेलरिंग, PMEGP सबसिडी, मुद्रा कर्ज याविषयी सोपे व व्यावहारिक मार्गदर्शन करा.
`.trim(),
};

export interface VoiceLiveEventCallbacks {
  onSessionReady?: (sessionId: string) => void;
  onSpeechStarted?: () => void;
  onSpeechStopped?: () => void;
  onTranscriptDelta?: (deltaText: string) => void;
  onTranscriptComplete?: (fullText: string) => void;
  onAudioDelta?: (base64Pcm: string) => void;
  onError?: (errorMessage: string) => void;
  onStatusChange?: (status: string) => void;
}

export class AzureVoiceLiveClient {
  private ws: WebSocket | null = null;
  private isConnected = false;
  private currentTranscript = '';
  private callbacks: VoiceLiveEventCallbacks = {};

  constructor(callbacks: VoiceLiveEventCallbacks = {}) {
    this.callbacks = callbacks;
  }

  /**
   * Connect to Azure VoiceLive Realtime WebSocket endpoint
   */
  public connect(): void {
    try {
      const cleanEndpoint = AZURE_VOICELIVE_CONFIG.endpoint
        .replace(/^https?:\/\//, '')
        .replace(/\/$/, '');

      // Construct Realtime WebSocket URL
      const wsUrl = `wss://${cleanEndpoint}/openai/realtime?api-version=2024-10-01-preview&deployment=${AZURE_VOICELIVE_CONFIG.model}`;

      // In React Native & Web, pass custom headers in 3rd options argument
      const wsOptions = {
        headers: {
          'api-key': AZURE_VOICELIVE_CONFIG.apiKey,
          'Ocp-Apim-Subscription-Key': AZURE_VOICELIVE_CONFIG.apiKey,
        },
      };

      this.ws = new (WebSocket as any)(wsUrl, [], wsOptions);

      if (this.ws) {
        this.ws.onopen = () => {
          this.isConnected = true;
          this.callbacks.onStatusChange?.('🎤 उद्यम सारथी सज्ज आहे (मराठीत बोला)');
          this.sendSessionUpdate();
        };

        this.ws.onmessage = (event: any) => {
          try {
            const data = JSON.parse(event.data);
            this.handleServerEvent(data);
          } catch (e) {}
        };

        this.ws.onerror = () => {
          // Graceful fallback to REST STT + Gemini Marathi AI Engine
          this.isConnected = false;
          this.callbacks.onStatusChange?.('संभाषणासाठी माईक दाबा');
        };

        this.ws.onclose = () => {
          this.isConnected = false;
        };
      }
    } catch (err: any) {
      this.isConnected = false;
      this.callbacks.onStatusChange?.('संभाषणासाठी माईक दाबा');
    }
  }

  /**
   * Send Session Configuration (matches python _setup_session logic)
   */
  private sendSessionUpdate(): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const sessionUpdateMsg = {
      type: 'session.update',
      session: {
        modalities: ['text', 'audio'],
        instructions: AZURE_VOICELIVE_CONFIG.instructions,
        voice: AZURE_VOICELIVE_CONFIG.voice,
        input_audio_format: 'pcm16',
        output_audio_format: 'pcm16',
        turn_detection: {
          type: 'server_vad',
          threshold: 0.5,
          prefix_padding_ms: 300,
          silence_duration_ms: 500,
        },
      },
    };

    this.ws.send(JSON.stringify(sessionUpdateMsg));
  }

  /**
   * Stream audio chunk (PCM16 Base64) to VoiceLive API
   */
  public sendAudioChunk(base64Pcm: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return;

    const appendAudioMsg = {
      type: 'input_audio_buffer.append',
      audio: base64Pcm,
    };

    this.ws.send(JSON.stringify(appendAudioMsg));
  }

  /**
   * Handle incoming Azure VoiceLive server events
   */
  private handleServerEvent(event: any): void {
    const eventType = event.type;

    switch (eventType) {
      case 'session.created':
      case 'session.updated':
        this.callbacks.onSessionReady?.(event.session?.id || 'active');
        this.callbacks.onStatusChange?.('🎤 उद्यम सारथी सज्ज आहे (मराठीत बोला)');
        break;

      case 'input_audio_buffer.speech_started':
        this.currentTranscript = '';
        this.callbacks.onSpeechStarted?.();
        this.callbacks.onStatusChange?.('🎤 तुमचे ऐकत आहे (मराठीत बोला)...');
        break;

      case 'input_audio_buffer.speech_stopped':
        this.callbacks.onSpeechStopped?.();
        this.callbacks.onStatusChange?.('🤔 उद्यम सारथी उत्तर शोधत आहे...');
        break;

      case 'response.audio_transcript.delta':
      case 'response.text.delta':
        if (event.delta) {
          this.currentTranscript += event.delta;
          this.callbacks.onTranscriptDelta?.(this.currentTranscript);
        }
        break;

      case 'response.audio.delta':
        if (event.delta) {
          this.callbacks.onAudioDelta?.(event.delta);
        }
        break;

      case 'response.audio.done':
      case 'response.done':
        this.callbacks.onTranscriptComplete?.(this.currentTranscript);
        this.callbacks.onStatusChange?.('🎤 पुढील प्रश्नासाठी माईक दाबा');
        break;

      case 'error':
        break;

      default:
        break;
    }
  }

  /**
   * Disconnect and clean up resources
   */
  public disconnect(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }
}
