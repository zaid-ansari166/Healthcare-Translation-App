// Core models and interfaces for Healthcare Translation Web App

export interface Language {
  code: string;
  name: string;
  voice: string;
  nativeName?: string;
  rtl?: boolean;
}

export interface SupportedLanguages {
  [key: string]: Language;
}

export interface TranscriptResult {
  text: string;
  confidence: number;
  isFinal: boolean;
  timestamp: Date;
  language: string;
}

export interface TranslationRequest {
  text: string;
  fromLanguage: string;
  toLanguage: string;
  context?: 'medical' | 'general';
}

export interface TranslationResponse {
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  confidence?: number;
  timestamp: Date;
  cached?: boolean;
}

export interface SpeechRecognitionConfig {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  language: string;
  noSpeechTimeout: number;
  finalTimeout: number;
  minConfidence: number;
}

export interface TextToSpeechConfig {
  rate: number;
  pitch: number;
  volume: number;
  voice?: SpeechSynthesisVoice;
  language: string;
}

export interface EmergencyPhrase {
  id: string;
  text: string;
  category: 'allergy' | 'pain' | 'medication' | 'symptoms' | 'examination' | 'emergency';
  icon: string;
  priority: number;
}

export interface VoiceControlState {
  isListening: boolean;
  isProcessing: boolean;
  isTranslating: boolean;
  isSpeaking: boolean;
  currentLanguage: string;
  lastError?: string;
}

export interface TranslationSettings {
  inputLanguage: string;
  outputLanguage: string;
  autoTranslate: boolean;
  voiceEnabled: boolean;
  confidenceThreshold: number;
  maxTranscriptLength: number;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  highContrast: boolean;
  reducedMotion: boolean;
  voiceRate: number;
  voicePitch: number;
  autoSave: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  retryable: boolean;
}

export interface ConversationEntry {
  id: string;
  originalText: string;
  translatedText: string;
  fromLanguage: string;
  toLanguage: string;
  confidence: number;
  timestamp: Date;
  speaker: 'patient' | 'provider';
  isEmergencyPhrase: boolean;
}

export interface SessionData {
  id: string;
  startTime: Date;
  endTime?: Date;
  entries: ConversationEntry[];
  languages: {
    patient: string;
    provider: string;
  };
  totalTranslations: number;
  averageConfidence: number;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
  dismissible?: boolean;
  timestamp: Date;
}

export interface AudioContextState {
  isSupported: boolean;
  sampleRate: number;
  state: 'suspended' | 'running' | 'closed';
}

export interface DeviceCapabilities {
  speechRecognition: boolean;
  speechSynthesis: boolean;
  microphone: boolean;
  speakers: boolean;
  touchSupport: boolean;
  webGL: boolean;
  localStorage: boolean;
  indexedDB: boolean;
}

export interface NetworkStatus {
  isOnline: boolean;
  connectionType?: string;
  downlink?: number;
  rtt?: number;
  saveData?: boolean;
}

export interface PerformanceMetrics {
  speechRecognitionLatency: number;
  translationLatency: number;
  textToSpeechLatency: number;
  totalProcessingTime: number;
  apiResponseTime: number;
  errorRate: number;
}

export interface AnalyticsEvent {
  name: string;
  category: 'user_action' | 'system_event' | 'error' | 'performance';
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
  userId?: string;
}

// Enums
export enum SpeechRecognitionErrorType {
  NOT_SUPPORTED = 'not-supported',
  NO_SPEECH = 'no-speech',
  ABORTED = 'aborted',
  AUDIO_CAPTURE = 'audio-capture',
  NETWORK = 'network',
  NOT_ALLOWED = 'not-allowed',
  SERVICE_NOT_ALLOWED = 'service-not-allowed',
  BAD_GRAMMAR = 'bad-grammar',
  LANGUAGE_NOT_SUPPORTED = 'language-not-supported'
}

export enum TranslationErrorType {
  NETWORK_ERROR = 'network-error',
  API_ERROR = 'api-error',
  RATE_LIMIT = 'rate-limit',
  INVALID_LANGUAGE = 'invalid-language',
  TEXT_TOO_LONG = 'text-too-long',
  TRANSLATION_FAILED = 'translation-failed'
}

export enum VoiceControlAction {
  START_LISTENING = 'start-listening',
  STOP_LISTENING = 'stop-listening',
  TRANSLATE = 'translate',
  SPEAK = 'speak',
  CLEAR = 'clear',
  SWAP_LANGUAGES = 'swap-languages'
}

export enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error'
}

// Type Guards
export const isTranscriptResult = (obj: any): obj is TranscriptResult => {
  return obj &&
         typeof obj.text === 'string' &&
         typeof obj.confidence === 'number' &&
         typeof obj.isFinal === 'boolean' &&
         obj.timestamp instanceof Date;
};

export const isTranslationResponse = (obj: any): obj is TranslationResponse => {
  return obj &&
         typeof obj.originalText === 'string' &&
         typeof obj.translatedText === 'string' &&
         typeof obj.fromLanguage === 'string' &&
         typeof obj.toLanguage === 'string';
};

export const isApiError = (obj: any): obj is ApiError => {
  return obj &&
         typeof obj.code === 'string' &&
         typeof obj.message === 'string' &&
         obj.timestamp instanceof Date &&
         typeof obj.retryable === 'boolean';
};

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OmitTimestamp<T> = Omit<T, 'timestamp'>;

export type CreateRequest<T> = Omit<T, 'id' | 'timestamp'>;

export type UpdateRequest<T> = Partial<Omit<T, 'id' | 'timestamp'>>;

// Constants
export const DEFAULT_LANGUAGE = 'en-US';
export const MAX_TRANSCRIPT_LENGTH = 5000;
export const MAX_TRANSLATION_LENGTH = 5000;
export const DEFAULT_CONFIDENCE_THRESHOLD = 0.7;
export const API_TIMEOUT = 10000;
export const CACHE_DURATION = 300000; // 5 minutes
export const MAX_RETRY_ATTEMPTS = 3;
export const DEBOUNCE_DELAY = 1000;

// Default configurations
export const DEFAULT_SPEECH_CONFIG: SpeechRecognitionConfig = {
  continuous: true,
  interimResults: true,
  maxAlternatives: 3,
  language: DEFAULT_LANGUAGE,
  noSpeechTimeout: 5000,
  finalTimeout: 3000,
  minConfidence: DEFAULT_CONFIDENCE_THRESHOLD
};

export const DEFAULT_TTS_CONFIG: TextToSpeechConfig = {
  rate: 0.9,
  pitch: 1.0,
  volume: 1.0,
  language: DEFAULT_LANGUAGE
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'system',
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  voiceRate: 0.9,
  voicePitch: 1.0,
  autoSave: true
};
