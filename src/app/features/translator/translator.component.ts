import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { Subject, BehaviorSubject } from "rxjs";
import { takeUntil, debounceTime, distinctUntilChanged } from "rxjs/operators";
import { environment } from "../../../environments/environment";

// Services
import { TranslationService } from "../../core/services/translation.service";
import { LoggerService } from "../../core/services/logger.service";
import { ToastService } from "../../core/services/toast.service";

// Models
import {
  TranslationRequest,
  VoiceControlState,
  EmergencyPhrase,
} from "../../core/models";

@Component({
  selector: "app-translator",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="translator-container">
      <!-- Language Selection Panel -->
      <div class="language-panel card">
        <h2 class="panel-title">
          <i class="fas fa-globe" aria-hidden="true"></i>
          Language Settings
        </h2>

        <div class="language-selector">
          <div class="language-group">
            <label for="input-language" class="language-label">
              <i class="fas fa-user" aria-hidden="true"></i>
              Patient Language
            </label>
            <select
              id="input-language"
              class="language-select"
              [(ngModel)]="inputLanguage"
              (change)="onInputLanguageChange($event)"
              [attr.aria-describedby]="'input-lang-help'"
            >
              <option
                *ngFor="let lang of availableLanguages"
                [value]="lang.key"
              >
                {{ lang.value.name }}
              </option>
            </select>
            <small id="input-lang-help" class="language-help">
              Language for voice input
            </small>
          </div>

          <button
            type="button"
            class="swap-btn"
            (click)="swapLanguages()"
            [attr.aria-label]="'Swap input and output languages'"
            title="Swap languages"
          >
            <i class="fas fa-exchange-alt" aria-hidden="true"></i>
          </button>

          <div class="language-group">
            <label for="output-language" class="language-label">
              <i class="fas fa-user-md" aria-hidden="true"></i>
              Provider Language
            </label>
            <select
              id="output-language"
              class="language-select"
              [(ngModel)]="outputLanguage"
              (change)="onOutputLanguageChange($event)"
              [attr.aria-describedby]="'output-lang-help'"
            >
              <option
                *ngFor="let lang of availableLanguages"
                [value]="lang.key"
              >
                {{ lang.value.name }}
              </option>
            </select>
            <small id="output-lang-help" class="language-help">
              Language for translation output
            </small>
          </div>
        </div>
      </div>

      <!-- Voice Controls -->
      <div class="voice-controls card">
        <div class="controls-header">
          <h2 class="panel-title">
            <i class="fas fa-microphone" aria-hidden="true"></i>
            Voice Recognition
          </h2>
          <div class="voice-status" [class.listening]="voiceState.isListening">
            <span
              class="status-indicator"
              [attr.aria-label]="voiceStatusLabel"
            ></span>
            <span class="status-text">{{ voiceStatusText }}</span>
          </div>
        </div>

        <div class="control-buttons">
          <button
            type="button"
            class="btn btn-primary btn-lg voice-btn"
            [class.listening]="voiceState.isListening"
            [disabled]="voiceState.isProcessing"
            (click)="toggleListening()"
            [attr.aria-label]="
              voiceState.isListening ? 'Stop listening' : 'Start listening'
            "
          >
            <i
              [class]="
                voiceState.isListening ? 'fas fa-stop' : 'fas fa-microphone'
              "
              aria-hidden="true"
            ></i>
            <span>{{
              voiceState.isListening ? "Stop Listening" : "Start Listening"
            }}</span>
          </button>

          <button
            type="button"
            class="btn btn-outline"
            (click)="clearTranscripts()"
            [attr.aria-label]="'Clear all transcripts'"
          >
            <i class="fas fa-trash" aria-hidden="true"></i>
            Clear
          </button>

          <button
            type="button"
            class="btn btn-info"
            (click)="testMicrophone()"
            [attr.aria-label]="'Test microphone access'"
          >
            <i class="fas fa-microphone-alt" aria-hidden="true"></i>
            Test Mic
          </button>
        </div>

        <div class="recognition-info" *ngIf="lastConfidence">
          <div class="confidence-meter">
            <label class="confidence-label">Recognition Confidence:</label>
            <div class="confidence-bar">
              <div
                class="confidence-fill"
                [style.width.%]="lastConfidence"
                [class.high-confidence]="lastConfidence >= 80"
                [class.medium-confidence]="
                  lastConfidence >= 60 && lastConfidence < 80
                "
                [class.low-confidence]="lastConfidence < 60"
              ></div>
            </div>
            <span class="confidence-value">{{ lastConfidence }}%</span>
          </div>
        </div>
      </div>

      <!-- Transcript Display -->
      <div class="transcript-container">
        <!-- Original Transcript -->
        <div class="transcript-panel card">
          <div class="panel-header">
            <h3 class="transcript-title">
              <i class="fas fa-user" aria-hidden="true"></i>
              Original Text
              <span class="language-tag">{{
                getLanguageCode(inputLanguage)
              }}</span>
            </h3>
            <div class="panel-controls">
              <button
                type="button"
                class="control-btn"
                (click)="copyOriginalText()"
                [attr.aria-label]="'Copy original text'"
                title="Copy text"
              >
                <i class="fas fa-copy" aria-hidden="true"></i>
              </button>
              <button
                type="button"
                class="control-btn"
                (click)="clearOriginalText()"
                [attr.aria-label]="'Clear original text'"
                title="Clear text"
              >
                <i class="fas fa-trash" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="transcript-content">
            <textarea
              class="transcript-text original-text"
              [(ngModel)]="originalText"
              (input)="onOriginalTextChange()"
              [placeholder]="'Speak or type here...'"
              [attr.aria-label]="'Original text input'"
              rows="10"
            >
            </textarea>
            <div class="transcript-info" *ngIf="originalText">
              <span class="char-count"
                >{{ originalText.length }} / {{ maxTextLength }}</span
              >
            </div>
          </div>
        </div>

        <!-- Translation Transcript -->
        <div class="transcript-panel card">
          <div class="panel-header">
            <h3 class="transcript-title">
              <i class="fas fa-language" aria-hidden="true"></i>
              Translation
              <span class="language-tag">{{
                getLanguageCode(outputLanguage)
              }}</span>
            </h3>
            <div class="panel-controls">
              <button
                type="button"
                class="control-btn"
                (click)="speakTranslation()"
                [disabled]="!translatedText || voiceState.isSpeaking"
                [attr.aria-label]="'Speak translation'"
                title="Speak translation"
              >
                <i
                  [class]="
                    voiceState.isSpeaking ? 'fas fa-pause' : 'fas fa-volume-up'
                  "
                  aria-hidden="true"
                ></i>
              </button>
              <button
                type="button"
                class="control-btn"
                (click)="copyTranslation()"
                [disabled]="!translatedText"
                [attr.aria-label]="'Copy translation'"
                title="Copy translation"
              >
                <i class="fas fa-copy" aria-hidden="true"></i>
              </button>
            </div>
          </div>
          <div class="transcript-content">
            <div
              class="transcript-text translated-text"
              [class.empty]="!translatedText"
              [attr.aria-label]="'Translation output'"
            >
              {{ translatedText || "Translation will appear here..." }}
            </div>
            <div
              class="translation-status"
              [class.translating]="isTranslating"
              *ngIf="isTranslating || translationError"
            >
              <i
                class="fas fa-spinner fa-spin"
                *ngIf="isTranslating"
                aria-hidden="true"
              ></i>
              <i
                class="fas fa-exclamation-triangle"
                *ngIf="translationError"
                aria-hidden="true"
              ></i>
              <span>{{
                isTranslating ? "Translating..." : translationError
              }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Emergency Phrases -->
      <div class="emergency-section card">
        <h2 class="panel-title">
          <i class="fas fa-plus-circle" aria-hidden="true"></i>
          Quick Medical Phrases
        </h2>
        <div class="emergency-phrases">
          <button
            *ngFor="let phrase of emergencyPhrases"
            type="button"
            class="phrase-btn"
            (click)="useEmergencyPhrase(phrase.text)"
            [attr.aria-label]="'Use phrase: ' + phrase.text"
          >
            <i [class]="phrase.icon" aria-hidden="true"></i>
            <span class="phrase-text">{{ phrase.text }}</span>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .translator-container {
        max-width: 1400px;
        margin: 0 auto;
        padding: var(--spacing-xl);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
        min-height: calc(100vh - 200px);
        width: 100%;
        box-sizing: border-box;
        overflow-x: hidden;
      }

      .card {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: var(--spacing-xl);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-light);
      }

      .panel-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        font-size: var(--text-xl);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 var(--spacing-lg) 0;
      }

      /* Language Selection */
      .language-selector {
        display: grid;
        grid-template-columns: 1fr auto 1fr;
        gap: var(--spacing-xl);
        align-items: end;
      }

      .language-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
        width: 100%;
        min-width: 0;
      }

      .language-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: 500;
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .language-select {
        padding: var(--spacing-md);
        border: 2px solid var(--border-light);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: all var(--transition-normal);
        width: 100%;
        box-sizing: border-box;
        min-height: 44px;
      }

      .language-select:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        outline: none;
      }

      .language-help {
        color: var(--text-muted);
        font-size: var(--text-xs);
      }

      .swap-btn {
        background: var(--bg-tertiary);
        border: 2px solid var(--border-light);
        border-radius: 50%;
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all var(--transition-normal);
        color: var(--text-secondary);
      }

      .swap-btn:hover {
        background: var(--primary-color);
        color: white;
        transform: rotate(180deg);
        border-color: var(--primary-color);
      }

      /* Voice Controls */
      .controls-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: var(--spacing-lg);
      }

      .voice-status {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
      }

      .status-indicator {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: var(--text-muted);
        transition: all var(--transition-normal);
      }

      .voice-status.listening .status-indicator {
        background: var(--success-color);
        animation: pulse 2s infinite;
      }

      .status-text {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-secondary);
      }

      .voice-status.listening .status-text {
        color: var(--success-color);
      }

      .control-buttons {
        display: flex;
        gap: var(--spacing-lg);
        justify-content: center;
        align-items: center;
        margin-bottom: var(--spacing-lg);
      }

      .voice-btn {
        min-width: 200px;
        position: relative;
      }

      .voice-btn.listening {
        background: var(--error-color);
        border-color: var(--error-color);
        animation: pulseButton 2s infinite;
      }

      .voice-btn.listening:hover {
        background: #dc2626;
      }

      .btn-info {
        background: var(--info-color);
        border-color: var(--info-color);
        color: white;
      }

      .btn-info:hover {
        background: #2563eb;
        border-color: #2563eb;
      }

      .confidence-meter {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .confidence-label {
        font-size: var(--text-sm);
        color: var(--text-secondary);
        min-width: 140px;
      }

      .confidence-bar {
        flex: 1;
        height: 8px;
        background: var(--bg-tertiary);
        border-radius: var(--radius-full);
        overflow: hidden;
        position: relative;
      }

      .confidence-fill {
        height: 100%;
        transition: width 0.3s ease;
        border-radius: var(--radius-full);
      }

      .confidence-fill.high-confidence {
        background: var(--success-color);
      }

      .confidence-fill.medium-confidence {
        background: var(--warning-color);
      }

      .confidence-fill.low-confidence {
        background: var(--error-color);
      }

      .confidence-value {
        font-size: var(--text-sm);
        font-weight: 600;
        color: var(--text-primary);
        min-width: 40px;
      }

      /* Transcript Panels */
      .transcript-container {
        display: grid;
        gap: var(--spacing-xl);
        grid-template-columns: 1fr;
      }

      .transcript-panel {
        min-height: 350px;
        display: flex;
        flex-direction: column;
      }

      .panel-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--border-light);
        margin-bottom: var(--spacing-lg);
      }

      .transcript-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin: 0;
      }

      .language-tag {
        background: var(--primary-color);
        color: white;
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: var(--text-xs);
        font-weight: 700;
      }

      .panel-controls {
        display: flex;
        gap: var(--spacing-sm);
      }

      .control-btn {
        background: none;
        border: 1px solid var(--border-medium);
        border-radius: var(--radius-md);
        padding: var(--spacing-sm);
        cursor: pointer;
        transition: all var(--transition-normal);
        color: var(--text-secondary);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .control-btn:hover:not(:disabled) {
        background: var(--primary-color);
        color: white;
        border-color: var(--primary-color);
      }

      .control-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }

      .transcript-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        min-height: 0;
        overflow: hidden;
      }

      .transcript-text {
        flex: 1;
        font-size: var(--text-lg);
        line-height: 1.7;
        color: var(--text-primary);
        background: transparent;
        border: none;
        outline: none;
        resize: none;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        min-height: 200px;
        width: 100%;
        box-sizing: border-box;
        word-wrap: break-word;
        overflow-wrap: break-word;
      }

      .original-text:focus {
        background: rgba(37, 99, 235, 0.05);
        box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
      }

      .translated-text {
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        min-height: 200px;
        white-space: pre-wrap;
        word-wrap: break-word;
      }

      .translated-text.empty {
        color: var(--text-muted);
        font-style: italic;
      }

      .transcript-info {
        display: flex;
        justify-content: flex-end;
        margin-top: var(--spacing-sm);
      }

      .char-count {
        font-size: var(--text-xs);
        color: var(--text-muted);
      }

      .translation-status {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-md);
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-tertiary);
        border-radius: var(--radius-md);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .translation-status.translating {
        color: var(--primary-color);
        background: rgba(37, 99, 235, 0.1);
      }

      /* Emergency Phrases */
      .emergency-phrases {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap: var(--spacing-md);
      }

      .phrase-btn {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-lg);
        background: var(--bg-secondary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        cursor: pointer;
        transition: all var(--transition-normal);
        font-size: var(--text-base);
        text-align: left;
        color: var(--text-primary);
      }

      .phrase-btn:hover {
        background: var(--primary-color);
        color: white;
        transform: translateY(-2px);
        box-shadow: var(--shadow-md);
      }

      .phrase-btn i {
        color: var(--primary-color);
        width: 20px;
        text-align: center;
      }

      .phrase-btn:hover i {
        color: white;
      }

      .phrase-text {
        flex: 1;
      }

      /* Animations */
      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }

      @keyframes pulseButton {
        0%,
        100% {
          box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4);
        }
        50% {
          box-shadow: 0 0 0 10px rgba(239, 68, 68, 0);
        }
      }

      /* Responsive Design */
      @media (min-width: 768px) {
        .transcript-container {
          grid-template-columns: 1fr 1fr;
        }
      }

      /* Tablet styles */
      @media (max-width: 1024px) {
        .translator-container {
          padding: var(--spacing-sm);
          gap: var(--spacing-md);
          min-height: calc(100vh - 120px);
        }

        .transcript-container {
          grid-template-columns: 1fr;
          gap: var(--spacing-md);
          margin-top: var(--spacing-md);
        }

        .emergency-phrases {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Mobile styles */
      @media (max-width: 768px) {
        .translator-container {
          padding: var(--spacing-sm);
          gap: var(--spacing-md);
        }

        .card {
          padding: var(--spacing-md);
        }

        .panel-title {
          font-size: var(--text-lg);
        }

        .language-selector {
          grid-template-columns: 1fr;
          gap: var(--spacing-sm);
          text-align: center;
        }

        .language-group {
          width: 100%;
        }

        .swap-btn {
          justify-self: center;
          order: 3;
          margin: var(--spacing-sm) 0;
          width: 48px;
          height: 48px;
          min-width: auto;
        }

        .control-buttons {
          flex-direction: column;
          align-items: stretch;
          gap: var(--spacing-sm);
        }

        .voice-btn {
          min-width: auto;
          padding: var(--spacing-md);
          font-size: var(--text-base);
        }

        .btn {
          padding: var(--spacing-sm) var(--spacing-md);
          font-size: var(--text-sm);
        }

        .emergency-phrases {
          grid-template-columns: 1fr;
          gap: var(--spacing-sm);
        }

        .phrase-btn {
          padding: var(--spacing-sm);
          font-size: var(--text-sm);
        }

        .controls-header {
          flex-direction: column;
          gap: var(--spacing-sm);
          align-items: stretch;
        }

        .transcript-text {
          min-height: 150px;
          padding: var(--spacing-sm);
          font-size: var(--text-base);
          resize: vertical;
          max-height: 300px;
        }

        .confidence-meter {
          flex-direction: column;
          align-items: flex-start;
          gap: var(--spacing-xs);
        }

        .confidence-label {
          min-width: auto;
          font-size: var(--text-xs);
        }

        .voice-status {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-xs);
        }

        .translation-text {
          font-size: var(--text-base);
          padding: var(--spacing-sm);
          min-height: 120px;
          max-height: 250px;
          overflow-y: auto;
        }
      }

      /* Small mobile styles */
      @media (max-width: 480px) {
        .translator-container {
          padding: var(--spacing-xs);
          gap: var(--spacing-sm);
          min-height: calc(100vh - 80px);
        }

        .card {
          padding: var(--spacing-sm);
          margin-bottom: var(--spacing-sm);
        }

        .panel-title {
          font-size: var(--text-base);
          text-align: center;
        }

        .language-selector {
          gap: var(--spacing-xs);
        }

        .language-select {
          padding: var(--spacing-sm);
          font-size: var(--text-sm);
          min-height: 48px;
        }

        .control-buttons {
          gap: var(--spacing-xs);
        }

        .voice-btn {
          padding: var(--spacing-sm);
          font-size: var(--text-sm);
        }

        .voice-btn span {
          display: none;
        }

        .voice-btn i {
          margin-right: 0;
        }

        .btn {
          padding: var(--spacing-xs) var(--spacing-sm);
          font-size: var(--text-xs);
        }

        .transcript-text {
          min-height: 120px;
          font-size: var(--text-sm);
        }

        .translation-text {
          min-height: 100px;
          font-size: var(--text-sm);
        }

        .phrase-btn {
          padding: var(--spacing-xs);
          font-size: var(--text-xs);
        }
      }

      /* Accessibility */
      @media (prefers-reduced-motion: reduce) {
        .swap-btn:hover {
          transform: none;
        }

        .phrase-btn:hover {
          transform: none;
        }

        .voice-btn.listening,
        .status-indicator {
          animation: none;
        }
      }
    `,
  ],
})
export class TranslatorComponent implements OnInit, OnDestroy {
  // Language settings
  inputLanguage = "en-US";
  outputLanguage = "es-ES";
  availableLanguages: Array<{ key: string; value: any }> = [];

  // Text content
  originalText = "";
  translatedText = "";
  maxTextLength = environment.ui.maxTranscriptLength;

  // Voice control state
  voiceState: VoiceControlState = {
    isListening: false,
    isProcessing: false,
    isTranslating: false,
    isSpeaking: false,
    currentLanguage: "en-US",
  };

  // Recognition and translation
  lastConfidence = 0;
  isTranslating = false;
  translationError = "";

  // Emergency phrases
  emergencyPhrases: EmergencyPhrase[] = [
    {
      id: "1",
      text: "Do you have any allergies?",
      category: "allergy",
      icon: "fas fa-exclamation-triangle",
      priority: 1,
    },
    {
      id: "2",
      text: "Where does it hurt?",
      category: "pain",
      icon: "fas fa-hand-point-right",
      priority: 2,
    },
    {
      id: "3",
      text: "When did this start?",
      category: "symptoms",
      icon: "fas fa-clock",
      priority: 3,
    },
    {
      id: "4",
      text: "Are you taking any medications?",
      category: "medication",
      icon: "fas fa-pills",
      priority: 4,
    },
    {
      id: "5",
      text: "On a scale of 1-10, how severe is the pain?",
      category: "pain",
      icon: "fas fa-thermometer-half",
      priority: 5,
    },
    {
      id: "6",
      text: "Please breathe slowly and deeply",
      category: "examination",
      icon: "fas fa-lungs",
      priority: 6,
    },
  ];

  // Speech recognition
  private recognition: any = null;
  private speechSynthesis = window.speechSynthesis;
  private currentUtterance: SpeechSynthesisUtterance | null = null;

  // Observables and subjects
  private destroy$ = new Subject<void>();
  private textChangeSubject = new BehaviorSubject<string>("");

  constructor(
    private translationService: TranslationService,
    private logger: LoggerService,
    private toastService: ToastService,
  ) {
    this.initializeLanguages();
    this.initializeSpeechRecognition();
  }

  ngOnInit(): void {
    // Setup text change debouncing for auto-translation
    this.textChangeSubject
      .pipe(
        takeUntil(this.destroy$),
        debounceTime(1000),
        distinctUntilChanged(),
      )
      .subscribe((text) => {
        if (text.trim() && text !== this.translatedText) {
          this.translateText(text);
        }
      });

    // Load user preferences if available
    this.loadUserPreferences();

    // Check microphone permissions
    this.checkMicrophonePermissions();

    this.logger.debug("Translator component initialized");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    // Clean up speech recognition
    if (this.recognition) {
      this.recognition.stop();
    }

    // Clean up speech synthesis
    if (this.currentUtterance) {
      this.speechSynthesis.cancel();
    }
  }

  private initializeLanguages(): void {
    this.availableLanguages = Object.entries(
      environment.supportedLanguages,
    ).map(([key, value]) => ({ key, value }));
  }

  private initializeSpeechRecognition(): void {
    // Check if speech recognition is supported
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      this.logger.warn("Speech recognition not supported in this browser");
      this.toastService.showError(
        "Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge for voice recognition features.",
      );
      return;
    }

    // Check if we're on a secure context (HTTPS or localhost)
    if (!this.isSecureContext()) {
      this.logger.warn("Speech recognition requires secure context (HTTPS)");
      this.toastService.showError(
        "Speech recognition requires a secure connection (HTTPS). Voice recognition may not work properly.",
      );
    }

    try {
      this.recognition = new SpeechRecognition();

      // Configure recognition settings
      this.recognition.continuous = environment.speechRecognition.continuous;
      this.recognition.interimResults =
        environment.speechRecognition.interimResults;
      this.recognition.maxAlternatives =
        environment.speechRecognition.maxAlternatives;
      this.recognition.lang = this.inputLanguage;

      // Set event handlers
      this.recognition.onstart = () => this.handleRecognitionStart();
      this.recognition.onresult = (event: any) =>
        this.handleRecognitionResult(event);
      this.recognition.onerror = (event: any) =>
        this.handleRecognitionError(event);
      this.recognition.onend = () => this.handleRecognitionEnd();

      this.logger.debug("Speech recognition initialized successfully");
    } catch (error) {
      this.logger.error("Failed to initialize speech recognition", error);
    }
  }

  // Language methods
  onInputLanguageChange(event: any): void {
    this.inputLanguage = event.target.value;
    if (this.recognition) {
      this.recognition.lang = this.inputLanguage;
    }
    this.saveUserPreferences();
    this.logger.debug("Input language changed", {
      language: this.inputLanguage,
    });
  }

  onOutputLanguageChange(event: any): void {
    this.outputLanguage = event.target.value;
    if (this.originalText) {
      this.translateText(this.originalText);
    }
    this.saveUserPreferences();
    this.logger.debug("Output language changed", {
      language: this.outputLanguage,
    });
  }

  swapLanguages(): void {
    const temp = this.inputLanguage;
    this.inputLanguage = this.outputLanguage;
    this.outputLanguage = temp;

    if (this.recognition) {
      this.recognition.lang = this.inputLanguage;
    }

    // Swap text content
    const tempText = this.originalText;
    this.originalText = this.translatedText;
    this.translatedText = tempText;

    this.saveUserPreferences();
    this.logger.debug("Languages swapped", {
      input: this.inputLanguage,
      output: this.outputLanguage,
    });
  }

  getLanguageCode(languageKey: string): string {
    const lang = (environment.supportedLanguages as any)[languageKey];
    return lang ? lang.code.toUpperCase() : "EN";
  }

  // Voice recognition methods
  toggleListening(): void {
    if (this.voiceState.isListening) {
      this.stopListening();
    } else {
      this.startListening();
    }
  }

  private async startListening(): Promise<void> {
    if (!this.recognition) {
      this.toastService.showError(environment.errorMessages.speechNotSupported);
      return;
    }

    try {
      // Request microphone permission explicitly
      await this.requestMicrophonePermission();

      this.voiceState.isListening = true;
      this.voiceState.isProcessing = false;
      this.recognition.start();
      this.logger.debug("Started speech recognition");
    } catch (error: any) {
      this.logger.error("Failed to start speech recognition", error);
      this.voiceState.isListening = false;

      if (error.name === "NotAllowedError") {
        this.toastService.showError(
          "Microphone access denied. Please allow microphone access in your browser settings and try again.",
        );
      } else if (error.name === "NotFoundError") {
        this.toastService.showError(
          "No microphone found. Please connect a microphone and try again.",
        );
      } else {
        this.toastService.showError(
          "Failed to start voice recognition. Please try again.",
        );
      }
    }
  }

  private async requestMicrophonePermission(): Promise<void> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Close the stream immediately as we only need permission
      stream.getTracks().forEach((track) => track.stop());
    } catch (error: any) {
      throw error;
    }
  }

  private stopListening(): void {
    if (this.recognition && this.voiceState.isListening) {
      this.recognition.stop();
      this.logger.debug("Stopped speech recognition");
    }
  }

  private handleRecognitionStart(): void {
    this.voiceState.isListening = true;
    this.voiceState.isProcessing = false;
    this.logger.debug("Speech recognition started");
  }

  private handleRecognitionResult(event: any): void {
    let interimTranscript = "";
    let finalTranscript = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      const confidence = event.results[i][0].confidence;

      if (event.results[i].isFinal) {
        finalTranscript += transcript;
        this.lastConfidence = Math.round(confidence * 100);
      } else {
        interimTranscript += transcript;
      }
    }

    if (finalTranscript) {
      this.originalText += finalTranscript;
      this.textChangeSubject.next(this.originalText);
      this.logger.debug("Final transcript received", {
        text: finalTranscript,
        confidence: this.lastConfidence,
      });
    } else if (interimTranscript) {
      // Show interim results
      this.logger.debug("Interim transcript", { text: interimTranscript });
    }
  }

  private handleRecognitionError(event: any): void {
    this.logger.error("Speech recognition error", { error: event.error });

    let errorMessage = "";
    switch (event.error) {
      case "not-allowed":
        errorMessage =
          "Microphone access denied. Please allow microphone access in your browser settings and refresh the page.";
        break;
      case "no-speech":
        errorMessage =
          "No speech detected. Please speak closer to your microphone and try again.";
        break;
      case "audio-capture":
        errorMessage =
          "Microphone not available. Please check your microphone connection.";
        break;
      case "network":
        errorMessage =
          "Network error occurred during speech recognition. Please check your internet connection.";
        break;
      case "service-not-allowed":
        errorMessage =
          "Speech recognition service is not allowed. Please check your browser settings.";
        break;
      case "bad-grammar":
        errorMessage = "Speech recognition grammar error. Please try again.";
        break;
      case "language-not-supported":
        errorMessage =
          "The selected language is not supported for speech recognition.";
        break;
      case "aborted":
        errorMessage = "Speech recognition was aborted. Please try again.";
        break;
      default:
        errorMessage = `Speech recognition error: ${event.error}. Please try again.`;
    }

    this.voiceState.isListening = false;
    this.voiceState.isProcessing = false;
    this.toastService.showError(errorMessage);
  }

  private handleRecognitionEnd(): void {
    this.voiceState.isListening = false;
    this.voiceState.isProcessing = false;
    this.logger.debug("Speech recognition ended");
  }

  private async checkMicrophonePermissions(): Promise<void> {
    try {
      // Check if permissions API is supported
      if (!navigator.permissions) {
        this.logger.warn("Permissions API not supported");
        this.toastService.showToast(
          "To use voice recognition, please allow microphone access when prompted.",
          "info",
          5000,
        );
        return;
      }

      const permissions = await navigator.permissions.query({
        name: "microphone" as PermissionName,
      });

      this.logger.debug("Microphone permission status:", permissions.state);

      if (permissions.state === "denied") {
        this.toastService.showToast(
          "Microphone access is blocked. Please enable microphone permissions in your browser settings to use voice recognition.",
          "warning",
          10000,
        );
      } else if (permissions.state === "prompt") {
        this.toastService.showToast(
          "Voice recognition ready. Click 'Start Listening' to begin.",
          "info",
          5000,
        );
      }

      // Listen for permission changes
      permissions.addEventListener("change", () => {
        this.logger.debug("Microphone permission changed:", permissions.state);
        if (permissions.state === "denied") {
          this.stopListening();
          this.toastService.showError(
            "Microphone access was revoked. Voice recognition has been stopped.",
          );
        }
      });
    } catch (error) {
      this.logger.warn("Could not check microphone permissions:", error);
      // Fallback for browsers that don't support permissions API
      this.toastService.showToast(
        "To use voice recognition, please ensure microphone access is allowed when prompted.",
        "info",
        5000,
      );
    }
  }

  private isSecureContext(): boolean {
    return (
      window.isSecureContext ||
      location.protocol === "https:" ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1"
    );
  }

  public async testMicrophone(): Promise<void> {
    try {
      this.toastService.showToast("Testing microphone access...", "info", 2000);

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      // Test successful
      stream.getTracks().forEach((track) => track.stop());

      this.toastService.showToast(
        "Microphone access granted! Voice recognition should work properly.",
        "success",
        5000,
      );

      this.logger.info("Microphone test successful");
    } catch (error: any) {
      this.logger.error("Microphone test failed", error);

      let errorMessage = "Microphone test failed. ";
      if (error.name === "NotAllowedError") {
        errorMessage +=
          "Please allow microphone access in your browser settings.";
      } else if (error.name === "NotFoundError") {
        errorMessage += "No microphone found. Please connect a microphone.";
      } else if (error.name === "NotReadableError") {
        errorMessage += "Microphone is already in use by another application.";
      } else {
        errorMessage += "Please check your microphone connection.";
      }

      this.toastService.showError(errorMessage);
    }
  }

  // Text methods
  onOriginalTextChange(): void {
    this.textChangeSubject.next(this.originalText);
  }

  clearTranscripts(): void {
    this.originalText = "";
    this.translatedText = "";
    this.lastConfidence = 0;
    this.translationError = "";
    this.toastService.showSuccess("Transcripts cleared");
    this.logger.debug("Transcripts cleared");
  }

  clearOriginalText(): void {
    this.originalText = "";
    this.translatedText = "";
    this.lastConfidence = 0;
  }

  async copyOriginalText(): Promise<void> {
    await this.copyToClipboard(this.originalText, "Original text copied");
  }

  async copyTranslation(): Promise<void> {
    await this.copyToClipboard(this.translatedText, "Translation copied");
  }

  private async copyToClipboard(
    text: string,
    successMessage: string,
  ): Promise<void> {
    if (!text.trim()) {
      this.toastService.showWarning("No text to copy");
      return;
    }

    try {
      await navigator.clipboard.writeText(text);
      this.toastService.showSuccess(successMessage);
      this.logger.debug("Text copied to clipboard");
    } catch (error) {
      this.logger.error("Failed to copy to clipboard", error);

      // Fallback method
      const textArea = document.createElement("textarea");
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();

      try {
        document.execCommand("copy");
        this.toastService.showSuccess(successMessage);
      } catch (fallbackError) {
        this.toastService.showError("Failed to copy text");
      }

      document.body.removeChild(textArea);
    }
  }

  // Translation methods
  private async translateText(text: string): Promise<void> {
    if (!text.trim() || this.inputLanguage === this.outputLanguage) {
      this.translatedText = text;
      return;
    }

    this.isTranslating = true;
    this.translationError = "";

    const request: TranslationRequest = {
      text,
      fromLanguage: this.getLanguageCode(this.inputLanguage).toLowerCase(),
      toLanguage: this.getLanguageCode(this.outputLanguage).toLowerCase(),
      context: "medical",
    };

    try {
      const response = await this.translationService
        .translate(request)
        .toPromise();
      if (response) {
        this.translatedText = response.translatedText;
        this.logger.debug("Translation completed", response);
      }
    } catch (error: any) {
      this.logger.error("Translation failed", error);

      // Provide more specific error messages based on error type
      let errorMessage = "Translation failed. Please try again.";

      if (!navigator.onLine) {
        errorMessage =
          "You are offline. Please check your internet connection.";
      } else if (error?.code === "RATE_LIMIT") {
        errorMessage = "Too many translation requests. Please wait a moment.";
      } else if (error?.code === "API_ERROR") {
        errorMessage = "Translation service is temporarily unavailable.";
      } else if (error?.code === "NETWORK_ERROR") {
        errorMessage = "Network error. Please check your connection.";
      } else if (error?.message?.includes("timeout")) {
        errorMessage = "Translation request timed out. Please try again.";
      } else if (error?.message?.includes("CORS")) {
        errorMessage = "Service configuration issue. Using offline mode.";
      }

      this.translationError = errorMessage;
      this.toastService.showError(this.translationError);
    } finally {
      this.isTranslating = false;
    }
  }

  // Speech synthesis methods
  speakTranslation(): void {
    if (!this.translatedText.trim()) {
      this.toastService.showWarning("No translation to speak");
      return;
    }

    if (this.voiceState.isSpeaking) {
      this.stopSpeaking();
      return;
    }

    try {
      this.currentUtterance = new SpeechSynthesisUtterance(this.translatedText);
      this.currentUtterance.lang = this.outputLanguage;
      this.currentUtterance.rate = environment.textToSpeech.rate;
      this.currentUtterance.pitch = environment.textToSpeech.pitch;
      this.currentUtterance.volume = environment.textToSpeech.volume;

      this.currentUtterance.onstart = () => {
        this.voiceState.isSpeaking = true;
        this.logger.debug("Started speaking translation");
      };

      this.currentUtterance.onend = () => {
        this.voiceState.isSpeaking = false;
        this.currentUtterance = null;
        this.logger.debug("Finished speaking translation");
      };

      this.currentUtterance.onerror = (event) => {
        this.voiceState.isSpeaking = false;
        this.currentUtterance = null;
        this.logger.error("Speech synthesis error", event);
        this.toastService.showError("Failed to speak translation");
      };

      this.speechSynthesis.speak(this.currentUtterance);
      this.logger.debug("Speaking translation", {
        text: this.translatedText,
        language: this.outputLanguage,
      });
    } catch (error) {
      this.logger.error("Failed to start speech synthesis", error);
      this.toastService.showError("Failed to speak translation");
    }
  }

  private stopSpeaking(): void {
    if (this.speechSynthesis.speaking) {
      this.speechSynthesis.cancel();
      this.voiceState.isSpeaking = false;
      this.currentUtterance = null;
      this.logger.debug("Stopped speaking");
    }
  }

  // Emergency phrases
  useEmergencyPhrase(phrase: string): void {
    this.originalText = phrase;
    this.translateText(phrase);
    this.toastService.showInfo(`Using phrase: "${phrase}"`);
    this.logger.debug("Emergency phrase used", { phrase });
  }

  // Utility methods
  get voiceStatusText(): string {
    if (this.voiceState.isListening) {
      return "Listening...";
    } else if (this.voiceState.isProcessing) {
      return "Processing...";
    } else {
      return "Ready";
    }
  }

  get voiceStatusLabel(): string {
    if (this.voiceState.isListening) {
      return "Currently listening for speech input";
    } else if (this.voiceState.isProcessing) {
      return "Processing speech input";
    } else {
      return "Ready to start listening";
    }
  }

  private loadUserPreferences(): void {
    try {
      const saved = localStorage.getItem("translator-preferences");
      if (saved) {
        const prefs = JSON.parse(saved);
        this.inputLanguage = prefs.inputLanguage || this.inputLanguage;
        this.outputLanguage = prefs.outputLanguage || this.outputLanguage;

        if (this.recognition) {
          this.recognition.lang = this.inputLanguage;
        }
      }
    } catch (error) {
      this.logger.warn("Failed to load user preferences", error);
    }
  }

  private saveUserPreferences(): void {
    try {
      const prefs = {
        inputLanguage: this.inputLanguage,
        outputLanguage: this.outputLanguage,
      };
      localStorage.setItem("translator-preferences", JSON.stringify(prefs));
    } catch (error) {
      this.logger.warn("Failed to save user preferences", error);
    }
  }
}
