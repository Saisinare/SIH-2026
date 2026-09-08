import { useState, useEffect, useRef, useCallback } from 'react';
import { Platform } from 'react-native';

// @react-native-voice/voice requires a development build (not available in Expo Go)
let Voice: typeof import('@react-native-voice/voice').default | null = null;
try {
  Voice = require('@react-native-voice/voice').default;
} catch (_) {
  // Expo Go: voice recognition unavailable — UI falls back gracefully
}
import { geminiService } from '../../data/services/gemini-service';

export interface UseAzureLiveVoiceReturn {
  isListening: boolean;
  isProcessing: boolean;
  transcript: string;
  aiResponse: string;
  statusText: string;
  error: string | null;
  toggleListening: () => void;
  sendCustomPrompt: (text: string) => Promise<void>;
  resetConversation: () => void;
}

export function useAzureLiveVoice(): UseAzureLiveVoiceReturn {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState(
    'नमस्कार! मी तुमचा उद्यम सारथी. आज तुमच्या मनात व्यवसायाची कोणती कल्पना आहे?'
  );
  const [statusText, setStatusText] = useState('संभाषणासाठी माईक दाबा');
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const latestTranscriptRef = useRef('');

  // ── 1. Native Mobile Speech Recognition (@react-native-voice/voice) ────────
  useEffect(() => {
    if (Platform.OS !== 'web') {
      try {
        const onSpeechStart = () => {
          setIsListening(true);
          setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
          setError(null);
        };

        const onSpeechResults = (e: any) => {
          if (e.value && e.value[0]) {
            const text = e.value[0];
            setTranscript(text);
            latestTranscriptRef.current = text;
          }
        };

        const onSpeechError = (e: any) => {
          setIsListening(false);
          setStatusText('संभाषणासाठी माईक दाबा');
        };

        const onSpeechEnd = async () => {
          setIsListening(false);
          const finalQuery = latestTranscriptRef.current || 'मला व्यवसायाविषयी माहिती हवी आहे';
          await handleProcessText(finalQuery);
        };

        if (Voice) {
          Voice.onSpeechStart = onSpeechStart;
          Voice.onSpeechResults = onSpeechResults;
          Voice.onSpeechError = onSpeechError;
          Voice.onSpeechEnd = onSpeechEnd;
        }

        return () => {
          try {
            if (Voice && typeof Voice.destroy === 'function') {
              Voice.destroy().then(() => {
                Voice.removeAllListeners?.();
              }).catch(() => {});
            }
          } catch (_) {}
        };
      } catch (_) {}
    }
  }, []);

  // ── 2. Web Speech API for Browser / Expo Web ───────────────────────────────
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'mr-IN'; // Marathi (India)

        recognition.onstart = () => {
          setIsListening(true);
          setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
          setError(null);
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          setTranscript(currentTranscript);
          latestTranscriptRef.current = currentTranscript;
        };

        recognition.onerror = () => {
          setIsListening(false);
          setStatusText('संभाषणासाठी माईक दाबा');
        };

        recognition.onend = async () => {
          setIsListening(false);
          const text = latestTranscriptRef.current;
          if (text.trim()) {
            await handleProcessText(text.trim());
          } else {
            setStatusText('संभाषणासाठी माईक दाबा');
          }
        };

        recognitionRef.current = recognition;
      }
    }
  }, []);

  // ── 3. Gemini Marathi AI Response Engine ───────────────────────────────────
  const handleProcessText = async (text: string) => {
    setIsProcessing(true);
    setStatusText('उद्यम सारथी उत्तर शोधत आहे...');

    const res = await geminiService.generateResponse(text);
    setIsProcessing(false);

    if (res.success && res.reply) {
      setAiResponse(res.reply);
      setStatusText('उद्यम सारथीने उत्तर दिले (मराठीत)');
    } else {
      setError(res.error || 'उत्तर मिळवण्यात त्रुटी आली');
      setStatusText('संभाषणासाठी माईक दाबा');
    }
  };

  // ── 4. Toggle Mic Listener ────────────────────────────────────────────────
  const toggleListening = useCallback(async () => {
    if (isListening) {
      // STOP Listening and process query
      setIsListening(false);
      if (Platform.OS !== 'web') {
        try {
          if (Voice && typeof Voice.stop === 'function') {
            await Voice.stop();
          }
        } catch (_) {}
      } else if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (_) {}
      }

      const queryToProcess = latestTranscriptRef.current || 'माझ्या व्यवसायासाठी मला सोपे मार्गदर्शन हवे आहे';
      await handleProcessText(queryToProcess);
    } else {
      // START Listening
      setTranscript('');
      latestTranscriptRef.current = '';
      setError(null);

      if (Platform.OS !== 'web') {
        try {
          if (Voice && typeof Voice.start === 'function') {
            await Voice.start('mr-IN');
          } else {
            setIsListening(true);
            setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
          }
        } catch (err) {
          setIsListening(true);
          setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
        }
      } else if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          setIsListening(true);
          setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
        }
      } else {
        setIsListening(true);
        setStatusText('तुमचे ऐकत आहे (मराठीत बोला)...');
      }
    }
  }, [isListening]);

  // ── 5. Send Direct Sample Prompt ───────────────────────────────────────────
  const sendCustomPrompt = async (text: string) => {
    setTranscript(text);
    latestTranscriptRef.current = text;
    await handleProcessText(text);
  };

  const resetConversation = () => {
    setTranscript('');
    latestTranscriptRef.current = '';
    setAiResponse('नमस्कार! मी तुमचा उद्यम सारथी. आज तुमच्या मनात व्यवसायाची कोणती कल्पना आहे?');
    setStatusText('संभाषणासाठी माईक दाबा');
    setError(null);
  };

  return {
    isListening,
    isProcessing,
    transcript,
    aiResponse,
    statusText,
    error,
    toggleListening,
    sendCustomPrompt,
    resetConversation,
  };
}
