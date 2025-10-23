export const environment = {
  production: false,
  appName: 'Healthcare Translation Assistant',
  version: '1.0.0',

  // API Configuration
  api: {
    translation: {
      baseUrl: 'https://api.mymemory.translated.net/get',
      timeout: 10000,
      maxRequestsPerMinute: 10,
      retryAttempts: 3
    },
    // Alternative Google Translate API (requires API key)
    googleTranslate: {
      baseUrl: 'https://translation.googleapis.com/language/translate/v2',
      apiKey: '', // Set in environment.prod.ts or via environment variables
      enabled: false
    }
  },

  // Speech Recognition Configuration
  speechRecognition: {
    continuous: true,
    interimResults: true,
    maxAlternatives: 3,
    noSpeechTimeout: 5000,
    finalTimeout: 3000,
    minConfidence: 0.7
  },

  // Text-to-Speech Configuration
  textToSpeech: {
    rate: 0.9,
    pitch: 1.0,
    volume: 1.0
  },

  // UI Configuration
  ui: {
    transitionDuration: 250,
    toastDuration: 4000,
    loadingMinDuration: 500,
    maxTranscriptLength: 5000,
    maxTranslationLength: 5000,
    autoScroll: true,
    scrollBehavior: 'smooth' as ScrollBehavior
  },

  // Privacy and Security
  privacy: {
    clearTranscriptsOnReload: true,
    storeUserPreferences: true,
    forceHttps: false // Set to true in production
  },

  // Feature Flags
  features: {
    voiceRecognition: true,
    translation: true,
    textToSpeech: true,
    offlineMode: false,
    conversationHistory: false,
    userAccounts: false,
    analytics: false
  },

  // Debug Configuration
  debug: {
    enabled: true,
    logLevel: 'debug' as 'debug' | 'info' | 'warn' | 'error',
    logSpeechEvents: true,
    logTranslationEvents: true,
    logTtsEvents: true
  },

  // Supported Languages
  supportedLanguages: {
    'en-US': { name: 'English (US)', code: 'en', voice: 'en-US' },
    'es-ES': { name: 'Español (Spanish)', code: 'es', voice: 'es-ES' },
    'fr-FR': { name: 'Français (French)', code: 'fr', voice: 'fr-FR' },
    'de-DE': { name: 'Deutsch (German)', code: 'de', voice: 'de-DE' },
    'it-IT': { name: 'Italiano (Italian)', code: 'it', voice: 'it-IT' },
    'pt-PT': { name: 'Português (Portuguese)', code: 'pt', voice: 'pt-PT' },
    'ru-RU': { name: 'Русский (Russian)', code: 'ru', voice: 'ru-RU' },
    'zh-CN': { name: '中文 (Chinese)', code: 'zh', voice: 'zh-CN' },
    'ja-JP': { name: '日本語 (Japanese)', code: 'ja', voice: 'ja-JP' },
    'ko-KR': { name: '한국어 (Korean)', code: 'ko', voice: 'ko-KR' },
    'ar-SA': { name: 'العربية (Arabic)', code: 'ar', voice: 'ar-SA' },
    'hi-IN': { name: 'हिन्दी (Hindi)', code: 'hi', voice: 'hi-IN' }
  },

  // Emergency Phrases
  emergencyPhrases: {
    'en-US': [
      'Do you have any allergies?',
      'Where does it hurt?',
      'When did this start?',
      'Are you taking any medications?',
      'On a scale of 1-10, how severe is the pain?',
      'Please breathe slowly and deeply',
      'Can you describe your symptoms?',
      'Do you have insurance?',
      'I need to examine you',
      'We need to run some tests'
    ],
    'es-ES': [
      '¿Tiene alguna alergia?',
      '¿Dónde le duele?',
      '¿Cuándo comenzó esto?',
      '¿Está tomando algún medicamento?',
      'En una escala del 1 al 10, ¿qué tan severo es el dolor?',
      'Por favor respire lenta y profundamente',
      '¿Puede describir sus síntomas?',
      '¿Tiene seguro médico?',
      'Necesito examinarlo',
      'Necesitamos hacer algunas pruebas'
    ]
  },

  // Medical Terms (High Priority Recognition)
  medicalTerms: [
    'pain', 'allergy', 'medication', 'symptoms', 'diagnosis',
    'treatment', 'emergency', 'doctor', 'nurse', 'hospital',
    'breathing', 'chest pain', 'headache', 'fever', 'nausea',
    'dizzy', 'blood pressure', 'heart rate', 'infection',
    'prescription', 'dosage', 'surgery', 'appointment',
    'hypertension', 'diabetes', 'asthma', 'pneumonia'
  ],

  // Error Messages
  errorMessages: {
    speechNotSupported: 'Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.',
    microphoneDenied: 'Microphone access denied. Please allow microphone access and reload the page.',
    translationFailed: 'Translation failed. Please check your internet connection and try again.',
    speechSynthesisFailed: 'Text-to-speech failed. Please try again.',
    networkError: 'Network error. Please check your connection.',
    rateLimitExceeded: 'Too many requests. Please wait a moment before trying again.',
    unsupportedLanguage: 'This language is not currently supported.',
    genericError: 'An unexpected error occurred. Please try again.'
  },

  // Success Messages
  successMessages: {
    textCopied: 'Text copied to clipboard',
    translationComplete: 'Translation completed',
    voiceReady: 'Voice recognition ready',
    settingsSaved: 'Settings saved successfully'
  }
};
