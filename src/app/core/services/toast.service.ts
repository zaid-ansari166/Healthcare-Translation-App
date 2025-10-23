import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastMessage } from '../models';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts$ = new BehaviorSubject<ToastMessage[]>([]);
  private toastIdCounter = 0;
  private readonly defaultDuration = 4000;
  private readonly maxToasts = 5;

  constructor(private logger: LoggerService) {
    this.logger.info('Toast service initialized');
  }

  /**
   * Get observable of current toasts
   */
  getToasts(): Observable<ToastMessage[]> {
    return this.toasts$.asObservable();
  }

  /**
   * Show a toast message
   */
  showToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number,
    dismissible: boolean = true
  ): string {
    const toast: ToastMessage = {
      id: this.generateToastId(),
      message,
      type,
      duration: duration ?? this.defaultDuration,
      dismissible,
      timestamp: new Date()
    };

    const currentToasts = this.toasts$.value;

    // Remove oldest toast if at max capacity
    let newToasts = [...currentToasts];
    if (newToasts.length >= this.maxToasts) {
      newToasts = newToasts.slice(1);
    }

    newToasts.push(toast);
    this.toasts$.next(newToasts);

    // Auto-dismiss toast if duration is set and > 0
    if (toast.duration && toast.duration > 0) {
      timer(toast.duration).pipe(take(1)).subscribe(() => {
        this.dismissToast(toast.id);
      });
    }

    this.logger.debug('Toast displayed', {
      id: toast.id,
      type: toast.type,
      message: toast.message,
      duration: toast.duration
    });

    return toast.id;
  }

  /**
   * Show success toast
   */
  showSuccess(message: string, duration?: number): string {
    return this.showToast(message, 'success', duration);
  }

  /**
   * Show error toast
   */
  showError(message: string, duration?: number): string {
    return this.showToast(message, 'error', duration || 0); // Errors don't auto-dismiss by default
  }

  /**
   * Show warning toast
   */
  showWarning(message: string, duration?: number): string {
    return this.showToast(message, 'warning', duration);
  }

  /**
   * Show info toast
   */
  showInfo(message: string, duration?: number): string {
    return this.showToast(message, 'info', duration);
  }

  /**
   * Dismiss a specific toast
   */
  dismissToast(toastId: string): void {
    const currentToasts = this.toasts$.value;
    const newToasts = currentToasts.filter(toast => toast.id !== toastId);

    if (newToasts.length !== currentToasts.length) {
      this.toasts$.next(newToasts);
      this.logger.debug('Toast dismissed', { toastId });
    }
  }

  /**
   * Dismiss all toasts
   */
  dismissAllToasts(): void {
    this.toasts$.next([]);
    this.logger.debug('All toasts dismissed');
  }

  /**
   * Dismiss all toasts of a specific type
   */
  dismissToastsByType(type: 'success' | 'error' | 'warning' | 'info'): void {
    const currentToasts = this.toasts$.value;
    const newToasts = currentToasts.filter(toast => toast.type !== type);

    if (newToasts.length !== currentToasts.length) {
      this.toasts$.next(newToasts);
      this.logger.debug('Toasts dismissed by type', { type, count: currentToasts.length - newToasts.length });
    }
  }

  /**
   * Update an existing toast
   */
  updateToast(toastId: string, updates: Partial<Omit<ToastMessage, 'id' | 'timestamp'>>): boolean {
    const currentToasts = this.toasts$.value;
    const toastIndex = currentToasts.findIndex(toast => toast.id === toastId);

    if (toastIndex === -1) {
      return false;
    }

    const updatedToasts = [...currentToasts];
    updatedToasts[toastIndex] = {
      ...updatedToasts[toastIndex],
      ...updates
    };

    this.toasts$.next(updatedToasts);

    // If duration was updated, reset the auto-dismiss timer
    if (updates.duration !== undefined && updates.duration > 0) {
      timer(updates.duration).pipe(take(1)).subscribe(() => {
        this.dismissToast(toastId);
      });
    }

    this.logger.debug('Toast updated', { toastId, updates });
    return true;
  }

  /**
   * Get current toast count
   */
  getToastCount(): number {
    return this.toasts$.value.length;
  }

  /**
   * Get current toasts by type
   */
  getToastsByType(type: 'success' | 'error' | 'warning' | 'info'): ToastMessage[] {
    return this.toasts$.value.filter(toast => toast.type === type);
  }

  /**
   * Check if a toast with specific message already exists
   */
  hasToastWithMessage(message: string): boolean {
    return this.toasts$.value.some(toast => toast.message === message);
  }

  /**
   * Show toast only if message doesn't already exist
   */
  showUniqueToast(
    message: string,
    type: 'success' | 'error' | 'warning' | 'info' = 'info',
    duration?: number
  ): string | null {
    if (!this.hasToastWithMessage(message)) {
      return this.showToast(message, type, duration);
    }
    return null;
  }

  /**
   * Clear expired toasts (cleanup utility)
   */
  clearExpiredToasts(): void {
    const currentTime = Date.now();
    const currentToasts = this.toasts$.value;

    const validToasts = currentToasts.filter(toast => {
      if (!toast.duration || toast.duration === 0) {
        return true; // Keep permanent toasts
      }

      const elapsed = currentTime - toast.timestamp.getTime();
      return elapsed < toast.duration;
    });

    if (validToasts.length !== currentToasts.length) {
      this.toasts$.next(validToasts);
      this.logger.debug('Expired toasts cleared', {
        removed: currentToasts.length - validToasts.length
      });
    }
  }

  private generateToastId(): string {
    return `toast-${++this.toastIdCounter}-${Date.now()}`;
  }
}
