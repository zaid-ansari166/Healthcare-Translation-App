import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="footer" role="contentinfo">
      <div class="container">
        <div class="footer-content">
          <!-- Privacy Notice -->
          <div class="privacy-notice">
            <i class="fas fa-shield-alt" aria-hidden="true"></i>
            <span>Patient privacy protected - No data stored permanently</span>
          </div>

          <!-- Footer Links -->
          <div class="footer-links">
            <a routerLink="/help" class="footer-link">
              <i class="fas fa-question-circle" aria-hidden="true"></i>
              Help
            </a>
            <span class="separator" aria-hidden="true">•</span>
            <a routerLink="/privacy" class="footer-link">
              <i class="fas fa-user-shield" aria-hidden="true"></i>
              Privacy Policy
            </a>
            <span class="separator" aria-hidden="true">•</span>
            <a routerLink="/settings" class="footer-link">
              <i class="fas fa-cog" aria-hidden="true"></i>
              Settings
            </a>
          </div>

          <!-- App Info -->
          <div class="app-info">
            <div class="app-version">
              <span class="version-label">Version:</span>
              <span class="version-number">{{ appVersion }}</span>
            </div>
            <div class="copyright">
              <span>&copy; {{ currentYear }} Healthcare Translation Team</span>
            </div>
          </div>

          <!-- Emergency Notice -->
          <div class="emergency-notice">
            <i class="fas fa-exclamation-triangle warning-icon" aria-hidden="true"></i>
            <span class="notice-text">
              This tool is for communication assistance only.
              In emergencies, always call emergency services directly.
            </span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      background-color: var(--bg-primary);
      border-top: 1px solid var(--border-light);
      margin-top: auto;
      padding: var(--spacing-xl) 0;
      color: var(--text-secondary);
      font-size: var(--text-sm);
    }

    .footer-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: var(--spacing-lg);
      text-align: center;
    }

    .privacy-notice {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      font-weight: 500;
      color: var(--success-color);
      padding: var(--spacing-sm) var(--spacing-md);
      background: rgba(16, 185, 129, 0.1);
      border-radius: var(--radius-lg);
      border: 1px solid rgba(16, 185, 129, 0.2);
    }

    .privacy-notice i {
      font-size: var(--text-base);
    }

    .footer-links {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      flex-wrap: wrap;
      justify-content: center;
    }

    .footer-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
      color: var(--text-secondary);
      text-decoration: none;
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      font-weight: 500;
    }

    .footer-link:hover {
      color: var(--primary-color);
      background: var(--bg-tertiary);
      text-decoration: none;
      transform: translateY(-1px);
    }

    .footer-link:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }

    .separator {
      color: var(--text-muted);
      font-weight: bold;
    }

    .app-info {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-sm);
      align-items: center;
    }

    .app-version {
      display: flex;
      align-items: center;
      gap: var(--spacing-xs);
    }

    .version-label {
      color: var(--text-muted);
    }

    .version-number {
      font-weight: 600;
      color: var(--text-secondary);
      background: var(--bg-tertiary);
      padding: var(--spacing-xs) var(--spacing-sm);
      border-radius: var(--radius-sm);
      font-size: var(--text-xs);
    }

    .copyright {
      color: var(--text-muted);
      font-size: var(--text-xs);
    }

    .emergency-notice {
      display: flex;
      align-items: flex-start;
      gap: var(--spacing-sm);
      padding: var(--spacing-md);
      background: rgba(245, 158, 11, 0.1);
      border: 1px solid rgba(245, 158, 11, 0.2);
      border-radius: var(--radius-lg);
      max-width: 600px;
      text-align: left;
    }

    .warning-icon {
      color: var(--warning-color);
      font-size: var(--text-base);
      margin-top: 2px;
      flex-shrink: 0;
    }

    .notice-text {
      line-height: var(--leading-relaxed);
      color: var(--text-secondary);
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .footer {
        padding: var(--spacing-lg) 0;
      }

      .footer-content {
        gap: var(--spacing-md);
      }

      .footer-links {
        flex-direction: column;
        gap: var(--spacing-sm);
      }

      .separator {
        display: none;
      }

      .app-info {
        order: -1;
      }

      .emergency-notice {
        padding: var(--spacing-sm);
        font-size: var(--text-xs);
      }

      .privacy-notice {
        padding: var(--spacing-sm);
        font-size: var(--text-xs);
      }
    }

    /* Tablet Styles */
    @media (max-width: 1024px) and (min-width: 769px) {
      .footer-links {
        gap: var(--spacing-sm);
      }

      .emergency-notice {
        max-width: 500px;
      }
    }

    /* High Contrast Mode */
    @media (prefers-contrast: high) {
      .footer {
        border-top-width: 2px;
      }

      .footer-link,
      .privacy-notice,
      .emergency-notice {
        border-width: 2px;
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .footer-link {
        transition: none;
        transform: none;
      }

      .footer-link:hover {
        transform: none;
      }
    }

    /* Dark Mode Adjustments */
    @media (prefers-color-scheme: dark) {
      .footer {
        border-top-color: var(--border-medium);
      }
    }

    /* Print Styles */
    @media print {
      .footer {
        display: none;
      }
    }
  `]
})
export class FooterComponent {
  appVersion = environment.version;
  currentYear = new Date().getFullYear();
}
