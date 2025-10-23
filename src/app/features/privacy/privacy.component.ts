import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-privacy",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="privacy-container">
      <div class="privacy-header">
        <h1 class="privacy-title">
          <i class="fas fa-shield-alt" aria-hidden="true"></i>
          Privacy Policy
        </h1>
        <p class="privacy-subtitle">
          Your privacy and data security are our top priorities
        </p>
        <div class="last-updated">
          Last updated: <time datetime="2024-01-01">January 1, 2024</time>
        </div>
      </div>

      <div class="privacy-content">
        <!-- Overview -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-info-circle" aria-hidden="true"></i>
            Overview
          </h2>
          <div class="section-content">
            <p class="highlight-text">
              The Healthcare Translation Assistant is designed with
              privacy-first principles. We do not store, collect, or transmit
              any personal health information or conversation data.
            </p>
            <div class="key-points">
              <div class="key-point">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>No permanent data storage</span>
              </div>
              <div class="key-point">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>HIPAA-compliant design principles</span>
              </div>
              <div class="key-point">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>Local browser processing</span>
              </div>
              <div class="key-point">
                <i class="fas fa-check-circle" aria-hidden="true"></i>
                <span>Secure HTTPS connections</span>
              </div>
            </div>
          </div>
        </section>

        <!-- Data Collection -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-database" aria-hidden="true"></i>
            Data Collection and Usage
          </h2>
          <div class="section-content">
            <h3>What We Do NOT Collect</h3>
            <ul class="privacy-list">
              <li>Personal health information (PHI)</li>
              <li>Patient names, medical record numbers, or identifiers</li>
              <li>Conversation transcripts or translations</li>
              <li>Audio recordings</li>
              <li>Location data</li>
              <li>Contact information</li>
            </ul>

            <h3>What We May Collect</h3>
            <ul class="privacy-list">
              <li>
                <strong>Technical Information:</strong> Browser type, version,
                and basic device information for compatibility
              </li>
              <li>
                <strong>Usage Analytics:</strong> Anonymous feature usage
                statistics (only if enabled by user)
              </li>
              <li>
                <strong>Error Reports:</strong> Crash reports and error logs (no
                personal data included)
              </li>
              <li>
                <strong>Preferences:</strong> Language settings and
                accessibility preferences (stored locally in your browser)
              </li>
            </ul>

            <div class="important-notice">
              <i class="fas fa-exclamation-triangle" aria-hidden="true"></i>
              <div>
                <strong>Important:</strong> All speech recognition and
                translation processing occurs in real-time. No conversation data
                is stored on our servers or transmitted for storage purposes.
              </div>
            </div>
          </div>
        </section>

        <!-- Data Processing -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-cogs" aria-hidden="true"></i>
            How We Process Data
          </h2>
          <div class="section-content">
            <div class="process-steps">
              <div class="process-step">
                <div class="step-number">1</div>
                <div class="step-content">
                  <h4>Speech Recognition</h4>
                  <p>
                    Voice input is processed locally using your browser's
                    built-in Web Speech API. Audio data never leaves your
                    device.
                  </p>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">2</div>
                <div class="step-content">
                  <h4>Translation</h4>
                  <p>
                    Text is sent to translation services (MyMemory or Google
                    Translate) via encrypted HTTPS connections. Only the text to
                    be translated is transmitted.
                  </p>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">3</div>
                <div class="step-content">
                  <h4>Text-to-Speech</h4>
                  <p>
                    Translation output is converted to speech locally using your
                    browser's Speech Synthesis API. No audio data is
                    transmitted.
                  </p>
                </div>
              </div>
              <div class="process-step">
                <div class="step-number">4</div>
                <div class="step-content">
                  <h4>Session End</h4>
                  <p>
                    When you close or refresh the application, all conversation
                    data is automatically cleared from memory.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- HIPAA Compliance -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-certificate" aria-hidden="true"></i>
            HIPAA Compliance
          </h2>
          <div class="section-content">
            <p>
              While this application is not a covered entity under HIPAA, we've
              designed it with HIPAA compliance principles in mind:
            </p>
            <div class="compliance-grid">
              <div class="compliance-item">
                <i class="fas fa-user-shield" aria-hidden="true"></i>
                <h4>Data Minimization</h4>
                <p>
                  We only process the minimum data necessary for translation
                  functionality.
                </p>
              </div>
              <div class="compliance-item">
                <i class="fas fa-lock" aria-hidden="true"></i>
                <h4>Encryption</h4>
                <p>
                  All data transmission uses industry-standard HTTPS encryption.
                </p>
              </div>
              <div class="compliance-item">
                <i class="fas fa-clock" aria-hidden="true"></i>
                <h4>No Retention</h4>
                <p>
                  Conversation data is never stored permanently or beyond the
                  active session.
                </p>
              </div>
              <div class="compliance-item">
                <i class="fas fa-eye-slash" aria-hidden="true"></i>
                <h4>Access Control</h4>
                <p>
                  Only you have access to your conversation data during the
                  session.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Third-Party Services -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-external-link-alt" aria-hidden="true"></i>
            Third-Party Services
          </h2>
          <div class="section-content">
            <h3>Translation Services</h3>
            <div class="service-info">
              <div class="service-item">
                <h4>MyMemory Translation API (Default)</h4>
                <ul>
                  <li>Processes text for translation purposes only</li>
                  <li>Does not store conversation data</li>
                  <li>Subject to their privacy policy and terms of service</li>
                </ul>
              </div>
              <div class="service-item">
                <h4>Google Translate API (Optional)</h4>
                <ul>
                  <li>Available as an alternative translation provider</li>
                  <li>Requires API key configuration</li>
                  <li>
                    Subject to Google's privacy policy and data processing terms
                  </li>
                </ul>
              </div>
            </div>

            <div class="important-notice">
              <i class="fas fa-info-circle" aria-hidden="true"></i>
              <div>
                <strong>Note:</strong> While we use secure, reputable
                translation services, we recommend against including sensitive
                patient identifiers in translations.
              </div>
            </div>
          </div>
        </section>

        <!-- Data Security -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-shield-virus" aria-hidden="true"></i>
            Data Security
          </h2>
          <div class="section-content">
            <h3>Security Measures</h3>
            <ul class="security-list">
              <li>
                <strong>HTTPS Encryption:</strong> All communications use TLS
                1.3 encryption
              </li>
              <li>
                <strong>No Server Storage:</strong> Conversation data is never
                stored on our servers
              </li>
              <li>
                <strong>Local Processing:</strong> Speech recognition and
                synthesis happen locally
              </li>
              <li>
                <strong>Secure Headers:</strong> Content Security Policy and
                other security headers
              </li>
              <li>
                <strong>Regular Updates:</strong> Dependencies and security
                patches updated regularly
              </li>
            </ul>

            <h3>User Responsibilities</h3>
            <ul class="privacy-list">
              <li>Use the application in secure, private environments</li>
              <li>Clear transcripts manually if sharing device with others</li>
              <li>
                Don't include sensitive patient identifiers in translations
              </li>
              <li>
                Use professional interpretation services for critical medical
                situations
              </li>
              <li>
                Ensure your device and browser are updated with latest security
                patches
              </li>
            </ul>
          </div>
        </section>

        <!-- User Rights -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-gavel" aria-hidden="true"></i>
            Your Rights and Controls
          </h2>
          <div class="section-content">
            <div class="rights-grid">
              <div class="rights-item">
                <h4>
                  <i class="fas fa-toggle-on" aria-hidden="true"></i> Control
                  Your Data
                </h4>
                <p>
                  You can clear all conversation data at any time using the
                  "Clear" button or by refreshing the page.
                </p>
              </div>
              <div class="rights-item">
                <h4>
                  <i class="fas fa-cog" aria-hidden="true"></i> Manage
                  Preferences
                </h4>
                <p>
                  Language and accessibility preferences are stored locally in
                  your browser and can be cleared at any time.
                </p>
              </div>
              <div class="rights-item">
                <h4>
                  <i class="fas fa-microphone-slash" aria-hidden="true"></i>
                  Microphone Control
                </h4>
                <p>
                  You have full control over microphone access and can revoke
                  permissions at any time through your browser settings.
                </p>
              </div>
              <div class="rights-item">
                <h4>
                  <i class="fas fa-ban" aria-hidden="true"></i> Opt-Out Options
                </h4>
                <p>
                  You can disable analytics and error reporting in the
                  application settings.
                </p>
              </div>
            </div>
          </div>
        </section>

        <!-- Changes to Privacy Policy -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-edit" aria-hidden="true"></i>
            Changes to This Privacy Policy
          </h2>
          <div class="section-content">
            <p>
              We may update this privacy policy from time to time to reflect
              changes in our practices or for other operational, legal, or
              regulatory reasons. We will notify users of any material changes
              by updating the "Last updated" date at the top of this policy.
            </p>
            <p>
              Your continued use of the Healthcare Translation Assistant after
              any changes indicates your acceptance of the updated privacy
              policy.
            </p>
          </div>
        </section>

        <!-- Contact Information -->
        <section class="privacy-section">
          <h2 class="section-title">
            <i class="fas fa-envelope" aria-hidden="true"></i>
            Contact Us
          </h2>
          <div class="section-content">
            <p>
              If you have questions about this privacy policy or our data
              practices, please contact us:
            </p>
            <div class="contact-info">
              <div class="contact-item">
                <i class="fas fa-envelope" aria-hidden="true"></i>
                <span>Email: privacy&#64;healthcaretranslator.app</span>
              </div>
              <div class="contact-item">
                <i class="fas fa-cog" aria-hidden="true"></i>
                <a routerLink="/settings">Application Settings</a>
              </div>
              <div class="contact-item">
                <i class="fas fa-question-circle" aria-hidden="true"></i>
                <a routerLink="/help">Help & Support</a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  `,
  styles: [
    `
      .privacy-container {
        max-width: 900px;
        margin: 0 auto;
        padding: var(--spacing-xl);
        line-height: var(--leading-relaxed);
      }

      .privacy-header {
        text-align: center;
        margin-bottom: var(--spacing-3xl);
        padding-bottom: var(--spacing-xl);
        border-bottom: 2px solid var(--border-light);
      }

      .privacy-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-md);
        font-size: var(--text-4xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .privacy-title i {
        color: var(--success-color);
      }

      .privacy-subtitle {
        font-size: var(--text-xl);
        color: var(--text-secondary);
        font-weight: 300;
        margin-bottom: var(--spacing-lg);
      }

      .last-updated {
        font-size: var(--text-sm);
        color: var(--text-muted);
        background: var(--bg-tertiary);
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-md);
        display: inline-block;
      }

      .privacy-content {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-3xl);
      }

      .privacy-section {
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

      .section-content h3 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin: var(--spacing-lg) 0 var(--spacing-md) 0;
      }

      .section-content h4 {
        font-size: var(--text-base);
        font-weight: 600;
        color: var(--text-primary);
        margin: var(--spacing-md) 0 var(--spacing-sm) 0;
      }

      .section-content p {
        margin-bottom: var(--spacing-md);
      }

      .highlight-text {
        font-size: var(--text-lg);
        font-weight: 500;
        color: var(--text-primary);
        background: var(--bg-secondary);
        padding: var(--spacing-lg);
        border-radius: var(--radius-lg);
        border-left: 4px solid var(--success-color);
        margin-bottom: var(--spacing-xl);
      }

      .key-points {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
      }

      .key-point {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md);
        background: var(--bg-secondary);
        border-radius: var(--radius-md);
        border: 1px solid var(--border-light);
      }

      .key-point i {
        color: var(--success-color);
        font-size: var(--text-lg);
      }

      .key-point span {
        font-weight: 500;
        color: var(--text-primary);
      }

      .privacy-list {
        margin: var(--spacing-md) 0;
        padding-left: var(--spacing-xl);
      }

      .privacy-list li {
        margin-bottom: var(--spacing-sm);
        color: var(--text-secondary);
      }

      .security-list {
        margin: var(--spacing-md) 0;
        padding-left: var(--spacing-xl);
      }

      .security-list li {
        margin-bottom: var(--spacing-sm);
        color: var(--text-secondary);
      }

      .important-notice {
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        background: rgba(245, 158, 11, 0.1);
        border: 1px solid rgba(245, 158, 11, 0.3);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        margin: var(--spacing-lg) 0;
      }

      .important-notice i {
        color: var(--warning-color);
        font-size: var(--text-lg);
        margin-top: 2px;
        flex-shrink: 0;
      }

      .important-notice div {
        color: var(--text-primary);
        line-height: var(--leading-relaxed);
      }

      .process-steps {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xl);
      }

      .process-step {
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

      .step-content h4 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .step-content p {
        margin: 0;
        color: var(--text-secondary);
      }

      .compliance-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-xl);
        margin-top: var(--spacing-lg);
      }

      .compliance-item {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-xl);
        border: 1px solid var(--border-light);
        text-align: center;
      }

      .compliance-item i {
        font-size: var(--text-2xl);
        color: var(--success-color);
        margin-bottom: var(--spacing-md);
      }

      .compliance-item h4 {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-sm);
      }

      .compliance-item p {
        margin: 0;
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .service-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-lg);
        margin-top: var(--spacing-lg);
      }

      .service-item {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        border: 1px solid var(--border-light);
      }

      .service-item h4 {
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .service-item ul {
        margin: 0;
        padding-left: var(--spacing-lg);
      }

      .service-item li {
        margin-bottom: var(--spacing-xs);
        color: var(--text-secondary);
        font-size: var(--text-sm);
      }

      .rights-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: var(--spacing-xl);
        margin-top: var(--spacing-lg);
      }

      .rights-item {
        background: var(--bg-secondary);
        border-radius: var(--radius-lg);
        padding: var(--spacing-lg);
        border: 1px solid var(--border-light);
      }

      .rights-item h4 {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .rights-item h4 i {
        color: var(--primary-color);
      }

      .rights-item p {
        margin: 0;
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      .contact-info {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-top: var(--spacing-lg);
        max-width: 400px;
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
        .privacy-container {
          padding: var(--spacing-md);
        }

        .privacy-title {
          font-size: var(--text-3xl);
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .privacy-subtitle {
          font-size: var(--text-lg);
        }

        .privacy-section {
          padding: var(--spacing-lg);
        }

        .section-title {
          font-size: var(--text-xl);
          flex-direction: column;
          text-align: center;
          gap: var(--spacing-sm);
        }

        .process-step {
          flex-direction: column;
          text-align: center;
        }

        .key-points,
        .compliance-grid,
        .rights-grid {
          grid-template-columns: 1fr;
        }

        .contact-info {
          max-width: none;
        }
      }

      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .privacy-section,
        .key-point,
        .compliance-item,
        .service-item,
        .rights-item,
        .contact-item,
        .important-notice {
          border-width: 2px;
        }
      }

      /* Print Styles */
      @media print {
        .privacy-container {
          max-width: none;
          padding: 1rem;
        }

        .privacy-section {
          break-inside: avoid;
          box-shadow: none;
          border: 1px solid #000;
          margin-bottom: 2rem;
        }

        .section-title i,
        .privacy-title i {
          display: none;
        }
      }
    `,
  ],
})
export class PrivacyComponent {}
