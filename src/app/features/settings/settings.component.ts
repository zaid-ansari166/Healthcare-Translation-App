import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
} from "@angular/forms";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { environment } from "../../../environments/environment";

// Services
import { ThemeService } from "../../core/services/theme.service";
import { LoggerService } from "../../core/services/logger.service";
import { ToastService } from "../../core/services/toast.service";

@Component({
  selector: "app-settings",
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <h1 class="settings-title">
          <i class="fas fa-cog" aria-hidden="true"></i>
          Application Settings
        </h1>
        <p class="settings-subtitle">
          Customize your experience and preferences
        </p>
      </div>

      <form
        [formGroup]="settingsForm"
        (ngSubmit)="saveSettings()"
        class="settings-form"
      >
        <!-- Theme and Appearance -->
        <section class="settings-section">
          <h2 class="section-title">
            <i class="fas fa-palette" aria-hidden="true"></i>
            Theme & Appearance
          </h2>
          <div class="section-content">
            <div class="setting-group">
              <label for="theme-mode" class="setting-label">
                <i class="fas fa-moon" aria-hidden="true"></i>
                Theme Mode
              </label>
              <select
                id="theme-mode"
                class="setting-select"
                formControlName="themeMode"
                (change)="onThemeModeChange($event)"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
              <small class="setting-help">
                Choose between light, dark, or follow system preference
              </small>
            </div>

            <div class="setting-group">
              <label for="font-size" class="setting-label">
                <i class="fas fa-font" aria-hidden="true"></i>
                Font Size
              </label>
              <select
                id="font-size"
                class="setting-select"
                formControlName="fontSize"
                (change)="onFontSizeChange($event)"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
              <small class="setting-help">
                Adjust text size for better readability
              </small>
            </div>

            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="high-contrast"
                  class="toggle-input"
                  formControlName="highContrast"
                  (change)="onHighContrastChange($event)"
                />
                <label for="high-contrast" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-adjust" aria-hidden="true"></i>
                    <span>High Contrast Mode</span>
                  </div>
                </label>
                <small class="setting-help">
                  Increase contrast for better visibility
                </small>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="reduced-motion"
                  class="toggle-input"
                  formControlName="reducedMotion"
                  (change)="onReducedMotionChange($event)"
                />
                <label for="reduced-motion" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-pause" aria-hidden="true"></i>
                    <span>Reduce Motion</span>
                  </div>
                </label>
                <small class="setting-help">
                  Minimize animations and transitions
                </small>
              </div>
            </div>
          </div>
        </section>

        <!-- Language Settings -->
        <section class="settings-section">
          <h2 class="section-title">
            <i class="fas fa-globe" aria-hidden="true"></i>
            Language Settings
          </h2>
          <div class="section-content">
            <div class="setting-group">
              <label for="default-input-lang" class="setting-label">
                <i class="fas fa-user" aria-hidden="true"></i>
                Default Patient Language
              </label>
              <select
                id="default-input-lang"
                class="setting-select"
                formControlName="defaultInputLanguage"
              >
                <option
                  *ngFor="let lang of availableLanguages"
                  [value]="lang.key"
                >
                  {{ lang.value.name }}
                </option>
              </select>
              <small class="setting-help">
                Default language for voice input
              </small>
            </div>

            <div class="setting-group">
              <label for="default-output-lang" class="setting-label">
                <i class="fas fa-user-md" aria-hidden="true"></i>
                Default Provider Language
              </label>
              <select
                id="default-output-lang"
                class="setting-select"
                formControlName="defaultOutputLanguage"
              >
                <option
                  *ngFor="let lang of availableLanguages"
                  [value]="lang.key"
                >
                  {{ lang.value.name }}
                </option>
              </select>
              <small class="setting-help">
                Default language for translation output
              </small>
            </div>
          </div>
        </section>

        <!-- Speech Settings -->
        <section class="settings-section">
          <h2 class="section-title">
            <i class="fas fa-microphone" aria-hidden="true"></i>
            Speech Settings
          </h2>
          <div class="section-content">
            <div class="setting-group">
              <label for="speech-rate" class="setting-label">
                <i class="fas fa-tachometer-alt" aria-hidden="true"></i>
                Speech Rate
              </label>
              <div class="range-container">
                <input
                  type="range"
                  id="speech-rate"
                  class="setting-range"
                  formControlName="speechRate"
                  min="0.5"
                  max="2"
                  step="0.1"
                  (input)="onSpeechRateChange($event)"
                />
                <span class="range-value">{{ speechRateDisplay }}x</span>
              </div>
              <small class="setting-help">
                Adjust text-to-speech playback speed
              </small>
            </div>

            <div class="setting-group">
              <label for="confidence-threshold" class="setting-label">
                <i class="fas fa-chart-line" aria-hidden="true"></i>
                Recognition Confidence Threshold
              </label>
              <div class="range-container">
                <input
                  type="range"
                  id="confidence-threshold"
                  class="setting-range"
                  formControlName="confidenceThreshold"
                  min="0.5"
                  max="1"
                  step="0.05"
                />
                <span class="range-value"
                  >{{ confidenceThresholdDisplay }}%</span
                >
              </div>
              <small class="setting-help">
                Minimum confidence level for accepting speech recognition
              </small>
            </div>

            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="auto-translate"
                  class="toggle-input"
                  formControlName="autoTranslate"
                />
                <label for="auto-translate" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-magic" aria-hidden="true"></i>
                    <span>Auto-translate</span>
                  </div>
                </label>
                <small class="setting-help">
                  Automatically translate text as you type or speak
                </small>
              </div>
            </div>
          </div>
        </section>

        <!-- Privacy Settings -->
        <section class="settings-section">
          <h2 class="section-title">
            <i class="fas fa-shield-alt" aria-hidden="true"></i>
            Privacy & Data
          </h2>
          <div class="section-content">
            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="save-preferences"
                  class="toggle-input"
                  formControlName="savePreferences"
                />
                <label for="save-preferences" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-save" aria-hidden="true"></i>
                    <span>Save Preferences</span>
                  </div>
                </label>
                <small class="setting-help">
                  Remember your settings between sessions
                </small>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="clear-on-refresh"
                  class="toggle-input"
                  formControlName="clearOnRefresh"
                />
                <label for="clear-on-refresh" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-broom" aria-hidden="true"></i>
                    <span>Clear Data on Refresh</span>
                  </div>
                </label>
                <small class="setting-help">
                  Automatically clear transcripts when page is refreshed
                </small>
              </div>
            </div>

            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="anonymous-analytics"
                  class="toggle-input"
                  formControlName="anonymousAnalytics"
                />
                <label for="anonymous-analytics" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-chart-bar" aria-hidden="true"></i>
                    <span>Anonymous Analytics</span>
                  </div>
                </label>
                <small class="setting-help">
                  Help improve the app by sharing anonymous usage data
                </small>
              </div>
            </div>
          </div>
        </section>

        <!-- Advanced Settings -->
        <section class="settings-section">
          <h2 class="section-title">
            <i class="fas fa-cogs" aria-hidden="true"></i>
            Advanced Settings
          </h2>
          <div class="section-content">
            <div class="setting-group">
              <div class="setting-toggle">
                <input
                  type="checkbox"
                  id="debug-mode"
                  class="toggle-input"
                  formControlName="debugMode"
                />
                <label for="debug-mode" class="toggle-label">
                  <span class="toggle-slider"></span>
                  <div class="toggle-content">
                    <i class="fas fa-bug" aria-hidden="true"></i>
                    <span>Debug Mode</span>
                  </div>
                </label>
                <small class="setting-help">
                  Enable detailed logging for troubleshooting
                </small>
              </div>
            </div>

            <div class="setting-group">
              <label for="api-timeout" class="setting-label">
                <i class="fas fa-clock" aria-hidden="true"></i>
                API Timeout (seconds)
              </label>
              <input
                type="number"
                id="api-timeout"
                class="setting-input"
                formControlName="apiTimeout"
                min="5"
                max="60"
                step="5"
              />
              <small class="setting-help">
                Maximum time to wait for translation responses
              </small>
            </div>

            <div class="setting-group">
              <label for="cache-duration" class="setting-label">
                <i class="fas fa-memory" aria-hidden="true"></i>
                Cache Duration (minutes)
              </label>
              <input
                type="number"
                id="cache-duration"
                class="setting-input"
                formControlName="cacheDuration"
                min="1"
                max="60"
                step="1"
              />
              <small class="setting-help">
                How long to cache translation results
              </small>
            </div>
          </div>
        </section>

        <!-- Action Buttons -->
        <div class="settings-actions">
          <button
            type="submit"
            class="btn btn-primary"
            [disabled]="!settingsForm.dirty"
          >
            <i class="fas fa-save" aria-hidden="true"></i>
            Save Settings
          </button>

          <button
            type="button"
            class="btn btn-outline"
            (click)="resetToDefaults()"
          >
            <i class="fas fa-undo" aria-hidden="true"></i>
            Reset to Defaults
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            (click)="exportSettings()"
          >
            <i class="fas fa-download" aria-hidden="true"></i>
            Export Settings
          </button>

          <button
            type="button"
            class="btn btn-secondary"
            (click)="importSettings()"
          >
            <i class="fas fa-upload" aria-hidden="true"></i>
            Import Settings
          </button>
        </div>
      </form>

      <!-- File input for import (hidden) -->
      <input
        #fileInput
        type="file"
        accept=".json"
        style="display: none"
        (change)="onFileSelected($event)"
      />

      <!-- Settings Information -->
      <div class="settings-info">
        <div class="info-card">
          <h3>
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            About Settings
          </h3>
          <p>
            Your preferences are stored locally in your browser and are not
            transmitted to our servers. Changes take effect immediately and are
            automatically saved (if enabled).
          </p>
          <div class="info-stats">
            <div class="stat-item">
              <span class="stat-label">Settings Version:</span>
              <span class="stat-value">{{ settingsVersion }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Last Modified:</span>
              <span class="stat-value">{{
                lastModified | date: "medium"
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .settings-container {
        max-width: 900px;
        margin: 0 auto;
        padding: var(--spacing-xl);
      }

      .settings-header {
        text-align: center;
        margin-bottom: var(--spacing-3xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 2px solid var(--border-light);
      }

      .settings-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        font-size: var(--text-4xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .settings-title i {
        color: var(--primary-color);
      }

      .settings-subtitle {
        font-size: var(--text-xl);
        color: var(--text-secondary);
        font-weight: 300;
      }

      .settings-form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3xl);
      }

      .settings-section {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: var(--spacing-2xl);
        box-shadow: var(--shadow-sm);
        border: 1px solid var(--border-light);
      }

      .section-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        font-size: var(--text-2xl);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-xl);
        padding-bottom: var(--spacing-md);
        border-bottom: 1px solid var(--border-light);
      }

      .section-title i {
        color: var(--primary-color);
        font-size: var(--text-xl);
      }

      .section-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .setting-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .setting-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: 500;
        color: var(--text-primary);
        font-size: var(--text-base);
      }

      .setting-label i {
        color: var(--primary-color);
        width: 20px;
      }

      .setting-select,
      .setting-input {
        padding: var(--spacing-md);
        border: 2px solid var(--border-light);
        border-radius: var(--radius-md);
        font-size: var(--text-base);
        background: var(--bg-primary);
        color: var(--text-primary);
        transition: all var(--transition-normal);
      }

      .setting-select:focus,
      .setting-input:focus {
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        outline: none;
      }

      .setting-help {
        color: var(--text-muted);
        font-size: var(--text-sm);
        line-height: var(--leading-normal);
      }

      .setting-toggle {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .toggle-input {
        display: none;
      }

      .toggle-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        cursor: pointer;
        padding: var(--spacing-md);
        border-radius: var(--radius-md);
        transition: background-color var(--transition-normal);
      }

      .toggle-label:hover {
        background: var(--bg-tertiary);
      }

      .toggle-slider {
        position: relative;
        width: 48px;
        height: 24px;
        background: var(--border-medium);
        border-radius: var(--radius-full);
        transition: all var(--transition-normal);
      }

      .toggle-slider::after {
        content: "";
        position: absolute;
        top: 2px;
        left: 2px;
        width: 20px;
        height: 20px;
        background: white;
        border-radius: 50%;
        transition: all var(--transition-normal);
        box-shadow: var(--shadow-sm);
      }

      .toggle-input:checked + .toggle-label .toggle-slider {
        background: var(--primary-color);
      }

      .toggle-input:checked + .toggle-label .toggle-slider::after {
        left: 26px;
      }

      .toggle-content {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-weight: 500;
        color: var(--text-primary);
      }

      .toggle-content i {
        color: var(--primary-color);
        width: 20px;
      }

      .range-container {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
      }

      .setting-range {
        flex: 1;
        height: 6px;
        border-radius: var(--radius-full);
        background: var(--bg-tertiary);
        outline: none;
        -webkit-appearance: none;
      }

      .setting-range::-webkit-slider-thumb {
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        box-shadow: var(--shadow-md);
      }

      .setting-range::-moz-range-thumb {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: var(--primary-color);
        cursor: pointer;
        border: none;
        box-shadow: var(--shadow-md);
      }

      .range-value {
        font-weight: 600;
        color: var(--primary-color);
        min-width: 50px;
        text-align: right;
        font-size: var(--text-sm);
      }

      .settings-actions {
        display: flex;
        gap: var(--spacing-md);
        justify-content: center;
        flex-wrap: wrap;
        padding: var(--spacing-xl) 0;
        border-top: 1px solid var(--border-light);
        margin-top: var(--spacing-xl);
      }

      .settings-info {
        margin-top: var(--spacing-2xl);
      }

      .info-card {
        background: var(--bg-primary);
        border-radius: var(--radius-xl);
        padding: var(--spacing-2xl);
        border: 1px solid var(--border-light);
        box-shadow: var(--shadow-sm);
      }

      .info-card h3 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .info-card h3 i {
        color: var(--info-color);
      }

      .info-card p {
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
        margin-bottom: var(--spacing-lg);
      }

      .info-stats {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-md);
      }

      .stat-item {
        display: flex;
        justify-content: space-between;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
      }

      .stat-label {
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .stat-value {
        color: var(--text-primary);
        font-weight: 500;
        font-size: var(--text-sm);
      }

      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .settings-container {
          padding: var(--spacing-md);
        }

        .settings-title {
          font-size: var(--text-3xl);
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .settings-subtitle {
          font-size: var(--text-lg);
        }

        .settings-section {
          padding: var(--spacing-lg);
        }

        .section-title {
          font-size: var(--text-xl);
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-sm);
        }

        .settings-actions {
          flex-direction: column;
          align-items: stretch;
        }

        .info-stats {
          grid-template-columns: 1fr;
        }
      }

      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .settings-section,
        .info-card,
        .setting-select,
        .setting-input,
        .stat-item {
          border-width: 2px;
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .setting-select,
        .setting-input,
        .toggle-slider,
        .toggle-slider::after {
          transition: none;
        }
      }
    `,
  ],
})
export class SettingsComponent implements OnInit, OnDestroy {
  settingsForm: FormGroup;
  availableLanguages: Array<{ key: string; value: any }> = [];
  settingsVersion = "1.0.0";
  lastModified = new Date();

  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private themeService: ThemeService,
    private logger: LoggerService,
    private toastService: ToastService,
  ) {
    this.settingsForm = this.fb.group({});
    this.initializeForm();
    this.initializeLanguages();
  }

  ngOnInit(): void {
    this.loadCurrentSettings();
    this.setupFormSubscriptions();
    this.logger.debug("Settings component initialized");
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeForm(): void {
    this.settingsForm = this.fb.group({
      // Theme settings
      themeMode: ["system"],
      fontSize: ["medium"],
      highContrast: [false],
      reducedMotion: [false],

      // Language settings
      defaultInputLanguage: ["en-US"],
      defaultOutputLanguage: ["es-ES"],

      // Speech settings
      speechRate: [0.9],
      confidenceThreshold: [0.7],
      autoTranslate: [true],

      // Privacy settings
      savePreferences: [true],
      clearOnRefresh: [true],
      anonymousAnalytics: [false],

      // Advanced settings
      debugMode: [false],
      apiTimeout: [10],
      cacheDuration: [5],
    });
  }

  private initializeLanguages(): void {
    this.availableLanguages = Object.entries(
      environment.supportedLanguages,
    ).map(([key, value]) => ({ key, value }));
  }

  private loadCurrentSettings(): void {
    try {
      // Load theme settings
      this.themeService
        .getThemeConfig()
        .pipe(takeUntil(this.destroy$))
        .subscribe((theme) => {
          this.settingsForm.patchValue(
            {
              themeMode: theme.mode,
              fontSize: theme.fontSize,
              highContrast: theme.highContrast,
              reducedMotion: theme.reducedMotion,
            },
            { emitEvent: false },
          );
        });

      // Load other settings from localStorage
      const saved = localStorage.getItem("healthcare-translator-settings");
      if (saved) {
        const settings = JSON.parse(saved);
        this.settingsForm.patchValue(settings, { emitEvent: false });
        this.lastModified = new Date(settings.lastModified || Date.now());
      }
    } catch (error) {
      this.logger.warn("Failed to load settings", error);
    }
  }

  private setupFormSubscriptions(): void {
    this.settingsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.settingsForm.get("savePreferences")?.value) {
          this.saveSettingsToStorage();
        }
      });
  }

  // Event handlers
  onThemeModeChange(event: any): void {
    const mode = event.target.value;
    this.themeService.setThemeMode(mode);
    this.logger.debug("Theme mode changed", { mode });
  }

  onFontSizeChange(event: any): void {
    const size = event.target.value;
    this.themeService.setFontSize(size);
    this.logger.debug("Font size changed", { size });
  }

  onHighContrastChange(event: any): void {
    const enabled = event.target.checked;
    this.themeService.setHighContrast(enabled);
    this.logger.debug("High contrast changed", { enabled });
  }

  onReducedMotionChange(event: any): void {
    const enabled = event.target.checked;
    this.themeService.setReducedMotion(enabled);
    this.logger.debug("Reduced motion changed", { enabled });
  }

  onSpeechRateChange(event: any): void {
    const rate = parseFloat(event.target.value);
    this.logger.debug("Speech rate changed", { rate });
  }

  get speechRateDisplay(): string {
    const rate = this.settingsForm.get("speechRate")?.value || 0.9;
    return rate.toFixed(1);
  }

  get confidenceThresholdDisplay(): string {
    const threshold =
      this.settingsForm.get("confidenceThreshold")?.value || 0.7;
    return Math.round(threshold * 100).toString();
  }

  saveSettings(): void {
    if (this.settingsForm.valid) {
      this.saveSettingsToStorage();
      this.toastService.showSuccess("Settings saved successfully");
      this.settingsForm.markAsPristine();
    }
  }

  private saveSettingsToStorage(): void {
    try {
      const settings = {
        ...this.settingsForm.value,
        lastModified: new Date().toISOString(),
        version: this.settingsVersion,
      };

      localStorage.setItem(
        "healthcare-translator-settings",
        JSON.stringify(settings),
      );
      this.lastModified = new Date();
      this.logger.debug("Settings saved to storage");
    } catch (error) {
      this.logger.error("Failed to save settings", error);
      this.toastService.showError("Failed to save settings");
    }
  }

  resetToDefaults(): void {
    if (
      confirm(
        "Are you sure you want to reset all settings to their default values? This cannot be undone.",
      )
    ) {
      this.settingsForm.reset({
        themeMode: "system",
        fontSize: "medium",
        highContrast: false,
        reducedMotion: false,
        defaultInputLanguage: "en-US",
        defaultOutputLanguage: "es-ES",
        speechRate: 0.9,
        confidenceThreshold: 0.7,
        autoTranslate: true,
        savePreferences: true,
        clearOnRefresh: true,
        anonymousAnalytics: false,
        debugMode: false,
        apiTimeout: 10,
        cacheDuration: 5,
      });

      // Apply theme defaults
      this.themeService.resetTheme();

      this.toastService.showSuccess("Settings reset to defaults");
      this.logger.info("Settings reset to defaults");
    }
  }

  exportSettings(): void {
    try {
      const settings = {
        ...this.settingsForm.value,
        exportedAt: new Date().toISOString(),
        version: this.settingsVersion,
        appName: environment.appName,
      };

      const blob = new Blob([JSON.stringify(settings, null, 2)], {
        type: "application/json",
      });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `healthcare-translator-settings-${new Date().toISOString().split("T")[0]}.json`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      this.toastService.showSuccess("Settings exported successfully");
      this.logger.info("Settings exported");
    } catch (error) {
      this.logger.error("Failed to export settings", error);
      this.toastService.showError("Failed to export settings");
    }
  }

  importSettings(): void {
    const fileInput = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const settings = JSON.parse(e.target?.result as string);

        // Validate settings structure
        if (!this.validateImportedSettings(settings)) {
          this.toastService.showError("Invalid settings file format");
          return;
        }

        // Apply imported settings
        this.settingsForm.patchValue(settings);

        // Apply theme settings immediately
        if (settings.themeMode)
          this.themeService.setThemeMode(settings.themeMode);
        if (settings.fontSize) this.themeService.setFontSize(settings.fontSize);
        if (settings.hasOwnProperty("highContrast"))
          this.themeService.setHighContrast(settings.highContrast);
        if (settings.hasOwnProperty("reducedMotion"))
          this.themeService.setReducedMotion(settings.reducedMotion);

        this.toastService.showSuccess("Settings imported successfully");
        this.logger.info("Settings imported", { version: settings.version });
      } catch (error) {
        this.logger.error("Failed to import settings", error);
        this.toastService.showError("Failed to import settings - invalid file");
      }
    };

    reader.readAsText(file);

    // Clear the input
    event.target.value = "";
  }

  private validateImportedSettings(settings: any): boolean {
    // Basic validation - check if it contains expected properties
    const requiredFields = ["themeMode", "fontSize"];
    return requiredFields.every((field) => field in settings);
  }
}
