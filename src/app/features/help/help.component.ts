import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-help",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="help-container">
      <div class="help-header">
        <h1 class="help-title">
          <i class="fas fa-question-circle" aria-hidden="true"></i>
          Help & Documentation
        </h1>
        <p class="help-subtitle">
          Learn how to use the Healthcare Translation Assistant effectively
        </p>
      </div>

      <div class="help-content">
        <!-- Quick Start -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-rocket" aria-hidden="true"></i>
            Quick Start Guide
          </h2>
          <div class="section-content">
            <ol class="step-list">
              <li class="step-item">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h3>Select Languages</h3>
                  <p>
                    Choose the patient's language (input) and the healthcare
                    provider's language (output) from the dropdown menus.
                  </p>
                </div>
              </li>
              <li class="step-item">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h3>Start Voice Recognition</h3>
                  <p>
                    Click "Start Listening" or press Ctrl+Space to begin voice
                    recognition. Speak clearly into your device's microphone.
                  </p>
                </div>
              </li>
              <li class="step-item">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h3>View Translation</h3>
                  <p>
                    Your speech will be transcribed and automatically
                    translated. Use the "Speak" button to hear the translation
                    aloud.
                  </p>
                </div>
              </li>
              <li class="step-item">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h3>Use Emergency Phrases</h3>
                  <p>
                    Click on pre-loaded medical phrases for quick access to
                    common healthcare questions.
                  </p>
                </div>
              </li>
            </ol>
          </div>
        </section>

        <!-- Features -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-star" aria-hidden="true"></i>
            Key Features
          </h2>
          <div class="section-content">
            <div class="features-grid">
              <div class="feature-card">
                <i
                  class="fas fa-microphone feature-icon"
                  aria-hidden="true"
                ></i>
                <h3>Voice Recognition</h3>
                <p>
                  Advanced speech-to-text technology optimized for medical
                  terminology with real-time confidence scoring.
                </p>
              </div>
              <div class="feature-card">
                <i class="fas fa-language feature-icon" aria-hidden="true"></i>
                <h3>Real-time Translation</h3>
                <p>
                  Instant translation between 12+ languages using AI-powered
                  translation services with medical context awareness.
                </p>
              </div>
              <div class="feature-card">
                <i class="fas fa-volume-up feature-icon" aria-hidden="true"></i>
                <h3>Text-to-Speech</h3>
                <p>
                  Natural-sounding voice synthesis in multiple languages with
                  adjustable speed and pronunciation.
                </p>
              </div>
              <div class="feature-card">
                <i
                  class="fas fa-mobile-alt feature-icon"
                  aria-hidden="true"
                ></i>
                <h3>Mobile Optimized</h3>
                <p>
                  Responsive design works perfectly on tablets, smartphones, and
                  desktop computers.
                </p>
              </div>
              <div class="feature-card">
                <i
                  class="fas fa-shield-alt feature-icon"
                  aria-hidden="true"
                ></i>
                <h3>Privacy Protected</h3>
                <p>
                  No data is stored permanently. All conversations are processed
                  locally with HIPAA-compliant privacy measures.
                </p>
              </div>
              <div class="feature-card">
                <i
                  class="fas fa-universal-access feature-icon"
                  aria-hidden="true"
                ></i>
                <h3>Accessibility</h3>
                <p>
                  Full keyboard navigation, screen reader support, high contrast
                  mode, and adjustable font sizes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Keyboard Shortcuts -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-keyboard" aria-hidden="true"></i>
            Keyboard Shortcuts
          </h2>
          <div class="section-content">
            <div class="shortcuts-grid">
              <div class="shortcut-item">
                <kbd class="shortcut-key">Ctrl + Space</kbd>
                <span class="shortcut-description"
                  >Start/Stop voice recognition</span
                >
              </div>
              <div class="shortcut-item">
                <kbd class="shortcut-key">Escape</kbd>
                <span class="shortcut-description">Stop listening</span>
              </div>
              <div class="shortcut-item">
                <kbd class="shortcut-key">Ctrl + Enter</kbd>
                <span class="shortcut-description"
                  >Speak current translation</span
                >
              </div>
              <div class="shortcut-item">
                <kbd class="shortcut-key">Tab</kbd>
                <span class="shortcut-description"
                  >Navigate between elements</span
                >
              </div>
            </div>
          </div>
        </section>

        <!-- Supported Languages -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-globe-americas" aria-hidden="true"></i>
            Supported Languages
          </h2>
          <div class="section-content">
            <div class="languages-grid">
              <div class="language-item">🇺🇸 English (US)</div>
              <div class="language-item">🇪🇸 Español (Spanish)</div>
              <div class="language-item">🇫🇷 Français (French)</div>
              <div class="language-item">🇩🇪 Deutsch (German)</div>
              <div class="language-item">🇮🇹 Italiano (Italian)</div>
              <div class="language-item">🇵🇹 Português (Portuguese)</div>
              <div class="language-item">🇷🇺 Русский (Russian)</div>
              <div class="language-item">🇨🇳 中文 (Chinese)</div>
              <div class="language-item">🇯🇵 日本語 (Japanese)</div>
              <div class="language-item">🇰🇷 한국어 (Korean)</div>
              <div class="language-item">🇸🇦 العربية (Arabic)</div>
              <div class="language-item">🇮🇳 हिन्दी (Hindi)</div>
            </div>
          </div>
        </section>

        <!-- Troubleshooting -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-tools" aria-hidden="true"></i>
            Troubleshooting
          </h2>
          <div class="section-content">
            <div class="faq-list">
              <div class="faq-item">
                <h3 class="faq-question">
                  <i class="fas fa-microphone-slash" aria-hidden="true"></i>
                  Microphone not working?
                </h3>
                <div class="faq-answer">
                  <ul>
                    <li>Ensure you're using HTTPS (secure connection)</li>
                    <li>Check browser permissions for microphone access</li>
                    <li>
                      Try refreshing the page and allowing permissions again
                    </li>
                    <li>
                      Make sure no other applications are using the microphone
                    </li>
                    <li>Use Chrome, Safari, or Edge for best compatibility</li>
                  </ul>
                </div>
              </div>

              <div class="faq-item">
                <h3 class="faq-question">
                  <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
                  Translation not working?
                </h3>
                <div class="faq-answer">
                  <ul>
                    <li>Check your internet connection</li>
                    <li>
                      Verify you haven't exceeded rate limits (10
                      requests/minute)
                    </li>
                    <li>Try a different language pair</li>
                    <li>
                      Make sure the text isn't too long (max 5000 characters)
                    </li>
                    <li>Refresh the page if problems persist</li>
                  </ul>
                </div>
              </div>

              <div class="faq-item">
                <h3 class="faq-question">
                  <i class="fas fa-volume-mute" aria-hidden="true"></i>
                  No sound from text-to-speech?
                </h3>
                <div class="faq-answer">
                  <ul>
                    <li>Check your device volume settings</li>
                    <li>Ensure the browser isn't muted</li>
                    <li>Try a different voice or language</li>
                    <li>Clear browser cache and cookies</li>
                    <li>Test with a different browser</li>
                  </ul>
                </div>
              </div>

              <div class="faq-item">
                <h3 class="faq-question">
                  <i class="fas fa-mobile-alt" aria-hidden="true"></i>
                  Issues on mobile devices?
                </h3>
                <div class="faq-answer">
                  <ul>
                    <li>Use Chrome, Safari, or Samsung Internet browser</li>
                    <li>Ensure microphone permissions are granted</li>
                    <li>Close other apps that might be using the microphone</li>
                    <li>Try landscape orientation for better layout</li>
                    <li>Make sure you have a stable internet connection</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Best Practices -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-thumbs-up" aria-hidden="true"></i>
            Best Practices
          </h2>
          <div class="section-content">
            <div class="tips-grid">
              <div class="tip-card">
                <i class="fas fa-microphone tip-icon" aria-hidden="true"></i>
                <h3>Speaking Tips</h3>
                <ul>
                  <li>Speak clearly and at a moderate pace</li>
                  <li>Position microphone 6-12 inches from your mouth</li>
                  <li>Minimize background noise</li>
                  <li>Pause between sentences for better recognition</li>
                </ul>
              </div>
              <div class="tip-card">
                <i class="fas fa-language tip-icon" aria-hidden="true"></i>
                <h3>Translation Tips</h3>
                <ul>
                  <li>Use simple, clear sentences</li>
                  <li>Avoid medical jargon when possible</li>
                  <li>Verify important translations</li>
                  <li>Edit text manually if needed</li>
                </ul>
              </div>
              <div class="tip-card">
                <i class="fas fa-shield-alt tip-icon" aria-hidden="true"></i>
                <h3>Privacy Tips</h3>
                <ul>
                  <li>Use in secure, private environments</li>
                  <li>Don't include sensitive patient identifiers</li>
                  <li>Clear transcripts after each session</li>
                  <li>
                    Use professional interpretation for critical situations
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- Contact Support -->
        <section class="help-section">
          <h2 class="section-title">
            <i class="fas fa-headset" aria-hidden="true"></i>
            Contact Support
          </h2>
          <div class="section-content">
            <div class="support-info">
              <p>
                If you need additional help or have questions not covered in
                this guide:
              </p>
              <div class="contact-options">
                <div class="contact-item">
                  <i class="fas fa-envelope" aria-hidden="true"></i>
                  <span>Email: support&#64;healthcaretranslator.app</span>
                </div>
                <div class="contact-item">
                  <i class="fas fa-book" aria-hidden="true"></i>
                  <a routerLink="/privacy">Privacy Policy & Terms</a>
                </div>
                <div class="contact-item">
                  <i class="fas fa-cog" aria-hidden="true"></i>
                  <a routerLink="/settings">Application Settings</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .help-container {
        max-width: 1000px;
        margin: 0 auto;
        padding: var(--spacing-xl);
        line-height: var(--leading-relaxed);
      }

      .help-header {
        text-align: center;
        margin-bottom: var(--spacing-3xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 2px solid var(--border-light);
      }

      .help-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        font-size: var(--text-4xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .help-title i {
        color: var(--primary-color);
      }

      .help-subtitle {
        font-size: var(--text-xl);
        color: var(--text-secondary);
        font-weight: 300;
        max-width: 600px;
        margin: 0 auto;
      }

      .help-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3xl);
      }

      .help-section {
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
        color: var(--text-secondary);
      }

      /* Quick Start Steps */
      .step-list {
        list-style: none;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .step-item {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-lg);
      }

      .step-number {
        background: var(--primary-color);
        color: white;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: var(--text-lg);
        font-weight: 700;
        flex-shrink: 0;
      }

      .step-content h3 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .step-content p {
        margin: 0;
        line-height: var(--leading-relaxed);
      }

      /* Features Grid */
      .features-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-xl);
      }

      .feature-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        text-align: center;
        border: 1px solid var(--border-light);
        transition: all var(--transition-normal);
      }

      .feature-card:hover {
        transform: translateY(-4px);
        box-shadow: var(--shadow-lg);
      }

      .feature-icon {
        font-size: var(--text-3xl);
        color: var(--primary-color);
        margin-bottom: var(--spacing-md);
      }

      .feature-card h3 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .feature-card p {
        margin: 0;
        font-size: var(--text-sm);
      }

      /* Shortcuts */
      .shortcuts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-md);
      }

      .shortcut-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
      }

      .shortcut-key {
        background: var(--text-primary);
        color: var(--text-inverse);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        font-size: var(--text-sm);
        font-weight: 600;
        font-family: monospace;
      }

      .shortcut-description {
        font-size: var(--text-sm);
        color: var(--text-primary);
      }

      /* Languages Grid */
      .languages-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: var(--spacing-sm);
      }

      .language-item {
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        padding: var(--spacing-md);
        text-align: center;
        font-weight: 500;
        border: 1px solid var(--border-light);
      }

      /* FAQ */
      .faq-list {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
      }

      .faq-item {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        overflow: hidden;
        border: 1px solid var(--border-light);
      }

      .faq-question {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        background: var(--bg-tertiary);
        padding: var(--spacing-lg);
        margin: 0;
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-light);
      }

      .faq-question i {
        color: var(--primary-color);
      }

      .faq-answer {
        padding: var(--spacing-lg);
      }

      .faq-answer ul {
        margin: 0;
        padding-left: var(--spacing-lg);
      }

      .faq-answer li {
        margin-bottom: var(--spacing-sm);
        color: var(--text-secondary);
      }

      .faq-answer li:last-child {
        margin-bottom: 0;
      }

      /* Tips Grid */
      .tips-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: var(--spacing-xl);
      }

      .tip-card {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        border: 1px solid var(--border-light);
      }

      .tip-icon {
        font-size: var(--text-2xl);
        color: var(--primary-color);
        margin-bottom: var(--spacing-md);
      }

      .tip-card h3 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .tip-card ul {
        margin: 0;
        padding-left: var(--spacing-lg);
      }

      .tip-card li {
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      /* Support Info */
      .support-info {
        text-align: center;
      }

      .support-info p {
        font-size: var(--text-lg);
        margin-bottom: var(--spacing-xl);
      }

      .contact-options {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        max-width: 400px;
        margin: 0 auto;
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
      }

      .contact-item i {
        color: var(--primary-color);
        width: 20px;
      }

      .contact-item a {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
      }

      .contact-item a:hover {
        text-decoration: underline;
      }

      /* Mobile Responsiveness */
      @media (max-width: 768px) {
        .help-container {
          padding: var(--spacing-md);
        }

        .help-title {
          font-size: var(--text-3xl);
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .help-subtitle {
          font-size: var(--text-lg);
        }

        .help-section {
          padding: var(--spacing-lg);
        }

        .section-title {
          font-size: var(--text-xl);
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-sm);
        }

        .step-item {
          flex-direction: column;
          text-align: center;
        }

        .features-grid,
        .tips-grid {
          grid-template-columns: 1fr;
        }

        .shortcuts-grid,
        .languages-grid {
          grid-template-columns: 1fr;
        }

        .contact-options {
          max-width: none;
        }
      }

      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .help-section,
        .feature-card,
        .tip-card,
        .faq-item,
        .shortcut-item,
        .language-item,
        .contact-item {
          border-width: 2px;
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .feature-card:hover {
          transform: none;
        }
      }
    `,
  ],
})
export class HelpComponent {}
