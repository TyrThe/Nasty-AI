// global.d.ts
interface SpeechRecognition {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: SpeechRecognitionErrorEvent) => void;
  onend: () => void;
}

interface Window {
  SpeechRecognition: typeof SpeechRecognition | undefined;
  webkitSpeechRecognition: typeof SpeechRecognition | undefined;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string; // O tipo de erro, como 'no-speech', 'aborted', etc.
  message: string; // Mensagem de erro (opcional)
}
