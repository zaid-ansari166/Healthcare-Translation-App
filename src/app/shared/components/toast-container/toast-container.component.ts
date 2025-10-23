import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Observable, Subject } from "rxjs";
import { ToastMessage } from "../../../core/models";
import { ToastService } from "../../../core/services/toast.service";
import { slideInOut } from "../../animations/animations";

@Component({
  selector: "app-toast-container",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="toast-container"
      role="region"
      aria-label="Notifications"
      [attr.aria-live]="'polite'"
    >
      <div
        *ngFor="let toast of toasts$ | async; trackBy: trackByToastId"
        class="toast"
        [class.toast-success]="toast.type === 'success'"
        [class.toast-error]="toast.type === 'error'"
        [class.toast-warning]="toast.type === 'warning'"
        [class.toast-info]="toast.type === 'info'"
        [attr.role]="toast.type === 'error' ? 'alert' : 'status'"
        [attr.aria-live]="toast.type === 'error' ? 'assertive' : 'polite'"
        [@slideInOut]
      >
        <!-- Toast Icon -->
        <div class="toast-icon">
          <i [class]="getToastIcon(toast.type)" [attr.aria-hidden]="true"> </i>
        </div>

        <!-- Toast Content -->
        <div class="toast-content">
          <div class="toast-message">{{ toast.message }}</div>
          <div class="toast-timestamp" *ngIf="showTimestamp">
            {{ formatTime(toast.timestamp) }}
          </div>
        </div>

        <!-- Dismiss Button -->
        <button
          *ngIf="toast.dismissible"
          type="button"
          class="toast-dismiss"
          [attr.aria-label]="'Dismiss notification: ' + toast.message"
          (click)="dismissToast(toast.id)"
        >
          <i class="fas fa-times" aria-hidden="true"></i>
        </button>

        <!-- Progress Bar for Timed Toasts -->
        <div
          *ngIf="toast.duration && toast.duration > 0"
          class="toast-progress"
          [style.animation-duration]="toast.duration + 'ms'"
        ></div>
      </div>
    </div>
  `,
  styles: [
    `
      .toast-container {
        position: fixed;
        top: var(--spacing-lg);
        right: var(--spacing-lg);
        z-index: var(--z-toast);
        display: flex;
        flex-direction: column;
        gap: var(--spacing-sm);
        max-width: 400px;
        pointer-events: none;
      }

      .toast {
        background: var(--bg-primary);
        border: 1px solid var(--border-light);
        border-radius: var(--radius-lg);
        box-shadow: var(--shadow-xl);
        padding: var(--spacing-md);
        display: flex;
        align-items: flex-start;
        gap: var(--spacing-md);
        min-width: 300px;
        pointer-events: auto;
        position: relative;
        overflow: hidden;
        backdrop-filter: blur(8px);
      }

      .toast-icon {
        flex-shrink: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 50%;
        font-size: var(--text-base);
      }

      .toast-success {
        border-left: 4px solid var(--success-color);
        background: rgba(16, 185, 129, 0.05);
      }

      .toast-success .toast-icon {
        color: var(--success-color);
        background: rgba(16, 185, 129, 0.1);
      }

      .toast-error {
        border-left: 4px solid var(--error-color);
        background: rgba(239, 68, 68, 0.05);
      }

      .toast-error .toast-icon {
        color: var(--error-color);
        background: rgba(239, 68, 68, 0.1);
      }

      .toast-warning {
        border-left: 4px solid var(--warning-color);
        background: rgba(245, 158, 11, 0.05);
      }

      .toast-warning .toast-icon {
        color: var(--warning-color);
        background: rgba(245, 158, 11, 0.1);
      }

      .toast-info {
        border-left: 4px solid var(--info-color);
        background: rgba(59, 130, 246, 0.05);
      }

      .toast-info .toast-icon {
        color: var(--info-color);
        background: rgba(59, 130, 246, 0.1);
      }

      .toast-content {
        flex: 1;
        min-width: 0;
      }

      .toast-message {
        font-size: var(--text-sm);
        font-weight: 500;
        color: var(--text-primary);
        line-height: var(--leading-normal);
        word-wrap: break-word;
      }

      .toast-timestamp {
        font-size: var(--text-xs);
        color: var(--text-muted);
        margin-top: var(--spacing-xs);
      }

      .toast-dismiss {
        flex-shrink: 0;
        background: none;
        border: none;
        color: var(--text-muted);
        cursor: pointer;
        padding: var(--spacing-xs);
        border-radius: var(--radius-sm);
        transition: all var(--transition-fast);
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        margin: -4px -4px -4px 0;
      }

      .toast-dismiss:hover {
        color: var(--text-primary);
        background: var(--bg-tertiary);
      }

      .toast-dismiss:focus-visible {
        outline: 2px solid var(--primary-color);
        outline-offset: 1px;
      }

      .toast-progress {
        position: absolute;
        bottom: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          var(--primary-color) 100%
        );
        animation: progressShrink linear forwards;
        transform-origin: left;
      }

      @keyframes progressShrink {
        from {
          transform: scaleX(1);
        }
        to {
          transform: scaleX(0);
        }
      }

      /* Mobile Styles */
      @media (max-width: 768px) {
        .toast-container {
          top: var(--spacing-sm);
          right: var(--spacing-sm);
          left: var(--spacing-sm);
          max-width: none;
        }

        .toast {
          min-width: auto;
          padding: var(--spacing-sm) var(--spacing-md);
        }

        .toast-message {
          font-size: var(--text-xs);
        }
      }

      /* High Contrast Mode */
      @media (prefers-contrast: high) {
        .toast {
          border-width: 2px;
          border-left-width: 6px;
        }

        .toast-dismiss {
          border: 1px solid var(--text-muted);
        }
      }

      /* Reduced Motion */
      @media (prefers-reduced-motion: reduce) {
        .toast-progress {
          animation: none;
          display: none;
        }
      }

      /* Dark Mode Adjustments */
      @media (prefers-color-scheme: dark) {
        .toast {
          background: var(--bg-secondary);
          border-color: var(--border-medium);
        }
      }
    `,
  ],
  animations: [slideInOut],
})
export class ToastContainerComponent implements OnInit, OnDestroy {
  toasts$: Observable<ToastMessage[]>;
  showTimestamp = false;

  private destroy$ = new Subject<void>();

  constructor(private toastService: ToastService) {
    this.toasts$ = this.toastService.getToasts();
  }

  ngOnInit(): void {
    // Auto-cleanup expired toasts periodically
    setInterval(() => {
      this.toastService.clearExpiredToasts();
    }, 5000);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  dismissToast(toastId: string): void {
    this.toastService.dismissToast(toastId);
  }

  getToastIcon(type: "success" | "error" | "warning" | "info"): string {
    const icons = {
      success: "fas fa-check-circle",
      error: "fas fa-exclamation-circle",
      warning: "fas fa-exclamation-triangle",
      info: "fas fa-info-circle",
    };
    return icons[type];
  }

  formatTime(timestamp: Date): string {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(timestamp);
  }

  trackByToastId(_index: number, toast: ToastMessage): string {
    return toast.id;
  }

  toggleTimestamp(): void {
    this.showTimestamp = !this.showTimestamp;
  }
}
