import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-not-found",
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <!-- Error Illustration -->
        <div class="error-illustration">
          <i class="fas fa-stethoscope error-icon" aria-hidden="true"></i>
          <div class="error-code">404</div>
        </div>

        <!-- Error Message -->
        <div class="error-message">
          <h1 class="error-title">Page Not Found</h1>
          <p class="error-description">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        <!-- Navigation Options -->
        <div class="navigation-options">
          <button
            type="button"
            class="btn btn-primary"
            (click)="goBack()"
            [attr.aria-label]="'Go back to previous page'"
          >
            <i class="fas fa-arrow-left" aria-hidden="true"></i>
            Go Back
          </button>

          <a
            routerLink="/translator"
            class="btn btn-secondary"
            role="button"
            [attr.aria-label]="'Go to main translator page'"
          >
            <i class="fas fa-language" aria-hidden="true"></i>
            Go to Translator
          </a>

          <a
            routerLink="/"
            class="btn btn-outline"
            role="button"
            [attr.aria-label]="'Go to home page'"
          >
            <i class="fas fa-home" aria-hidden="true"></i>
            Home
          </a>
        </div>

        <!-- Helpful Links -->
        <div class="helpful-links">
          <h2 class="links-title">You might be looking for:</h2>
          <ul class="links-list">
            <li>
              <a routerLink="/translator" class="helpful-link">
                <i class="fas fa-language" aria-hidden="true"></i>
                Translation Service
              </a>
            </li>
            <li>
              <a routerLink="/help" class="helpful-link">
                <i class="fas fa-question-circle" aria-hidden="true"></i>
                Help & Documentation
              </a>
            </li>
            <li>
              <a routerLink="/settings" class="helpful-link">
                <i class="fas fa-cog" aria-hidden="true"></i>
                Settings & Preferences
              </a>
            </li>
            <li>
              <a routerLink="/privacy" class="helpful-link">
                <i class="fas fa-shield-alt" aria-hidden="true"></i>
                Privacy Policy
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Information -->
        <div class="contact-info">
          <p class="contact-text">
            If you think this is an error, please contact our support team.
          </p>
          <div class="contact-details">
            <span class="contact-item">
              <i class="fas fa-envelope" aria-hidden="true"></i>
              support&#64;healthcaretranslator.app
            </span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .not-found-container {
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: var(--spacing-xl);
        background: linear-gradient(
          135deg,
          var(--bg-secondary) 0%,
          var(--bg-tertiary) 100%
        );
      }

      .not-found-content {
        max-width: 600px;
        width: 100%;
        text-align: center;
        background: var(--bg-primary);
        border-radius: var(--radius-2xl);
        padding: var(--spacing-3xl) var(--spacing-xl);
        box-shadow: var(--shadow-xl);
        border: 1px solid var(--border-light);
      }

      .error-illustration {
        margin-bottom: var(--spacing-xl);
        position: relative;
      }

      .error-icon {
        font-size: 4rem;
        color: var(--primary-color);
        margin-bottom: var(--spacing-md);
        opacity: 0.8;
      }

      .error-code {
        font-size: 6rem;
        font-weight: 900;
        color: var(--primary-color);
        line-height: 1;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        background: linear-gradient(
          135deg,
          var(--primary-color),
          var(--accent-color)
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .error-message {
        margin-bottom: var(--spacing-2xl);
      }

      .error-title {
        font-size: var(--text-3xl);
        font-weight: 700;
        color: var(--text-primary);
        margin-bottom: var(--spacing-md);
      }

      .error-description {
        font-size: var(--text-lg);
        color: var(--text-secondary);
        line-height: var(--leading-relaxed);
        margin: 0;
      }

      .navigation-options {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
        margin-bottom: var(--spacing-2xl);
        align-items: center;
      }

      .btn {
        display: inline-flex;
        align-items: center;
        gap: var(--spacing-sm);
        padding: var(--spacing-md) var(--spacing-xl);
        border-radius: var(--radius-lg);
        font-size: var(--text-base);
        font-weight: 500;
        text-decoration: none;
        transition: all var(--transition-normal);
        border: 2px solid transparent;
        cursor: pointer;
        min-width: 160px;
        justify-content: center;
      }

      .btn-primary {
        background: var(--primary-color);
        color: var(--text-inverse);
      }

      .btn-primary:hover {
        background: var(--primary-hover);
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .btn-secondary {
        background: var(--secondary-color);
        color: var(--text-inverse);
      }

      .btn-secondary:hover {
        background: #475569;
        transform: translateY(-2px);
        box-shadow: var(--shadow-lg);
      }

      .btn-outline {
        background: transparent;
        color: var(--text-primary);
        border-color: var(--border-medium);
      }

      .btn-outline:hover {
        background: var(--bg-tertiary);
        border-color: var(--primary-color);
        color: var(--primary-color);
      }

      .helpful-links {
        margin-bottom: var(--spacing-2xl);
        text-align: left;
      }

      .links-title {
        font-size: var(--text-lg);
        font-weight: 600;
        color: var(--text-primary);
        margin-bottom: var(--spacing-lg);
        text-align: center;
      }

      .links-list {
        list-style: none;
        padding: 0;
        margin: 0;
        display: grid;
        grid-template-columns: 1fr;
        gap: var(--spacing-sm);
      }

      .helpful-link {
        display: flex;
        align-items: center;
        gap: var(--spacing-md);
        padding: var(--spacing-md);
        color: var(--text-secondary);
        text-decoration: none;
        border-radius: var(--radius-md);
        transition: all var(--transition-normal);
        border: 1px solid transparent;
      }

      .helpful-link:hover {
        color: var(--primary-color);
        background: var(--bg-tertiary);
        border-color: var(--primary-color);
        text-decoration: none;
        transform: translateX(4px);
      }

      .helpful-link i {
        width: 20px;
        text-align: center;
        opacity: 0.8;
      }

      .contact-info {
        border-top: 1px solid var(--border-light);
        padding-top: var(--spacing-xl);
      }

      .contact-text {
        font-size: var(--text-sm);
        color: var(--text-muted);
        margin-bottom: var(--spacing-md);
      }

      .contact-details {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: var(--spacing-md);
      }

      .contact-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        font-size: var(--text-sm);
        color: var(--text-secondary);
      }

      /* Mobile Styles */
      @media (max-width: 768px) {
        .not-found-container {
          padding: var(--spacing-md);
          min-height: calc(100vh - var(--spacing-2xl));
        }

        .not-found-content {
          padding: var(--spacing-xl) var(--spacing-lg);
        }

        .error-code {
          font-size: 4rem;
        }

        .error-title {
          font-size: var(--text-2xl);
        }

        .error-description {
          font-size: var(--text-base);
        }

        .navigation-options {
          flex-direction: column;
          gap: var(--spacing-sm);
        }

        .btn {
          width: 100%;
          max-width: 280px;
        }

        .links-list {
          gap: var(--spacing-xs);
        }

        .helpful-link {
          padding: var(--spacing-sm) var(--spacing-md);
        }
      }

      /* Tablet Styles */
      @media (min-width: 769px) and (max-width: 1024px) {
        .navigation-options {
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
        }

        .links-list {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* Desktop Styles */
      @media (min-width: 1025px) {
        .navigation-options {
          flex-direction: row;
          justify-content: center;
        }

        .links-list {
          grid-template-columns: repeat(2, 1fr);
        }
      }

      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .not-found-content {
          border-width: 2px;
        }

        .btn,
        .helpful-link {
          border-width: 2px;
        }

        .error-code {
          text-shadow: none;
          background: none;
          -webkit-text-fill-color: var(--text-primary);
          color: var(--text-primary);
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .btn,
        .helpful-link {
          transition: none;
          transform: none;
        }

        .btn:hover,
        .helpful-link:hover {
          transform: none;
        }
      }

      /* Focus Styles */
      .btn:focus-visible,
      .helpful-link:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 2px;
      }

      /* Print Styles */
      @media print {
        .not-found-container {
          background: white;
          color: black;
        }

        .navigation-options,
        .contact-info {
          display: none;
        }
      }
    `,
  ],
})
export class NotFoundComponent {
  goBack(): void {
    if (typeof window !== "undefined" && window.history.length > 1) {
      window.history.back();
    } else {
      // Fallback to home page if no history
      window.location.href = "/";
    }
  }
}
