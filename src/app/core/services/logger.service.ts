import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { LogLevel } from '../models';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  stack?: string;
  userAgent?: string;
  url?: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private logs: LogEntry[] = [];
  private readonly maxLogs = 1000;
  private readonly isDebugEnabled = environment.debug.enabled;
  private readonly logLevel = environment.debug.logLevel;

  constructor() {
    this.info('Logger service initialized', {
      debugEnabled: this.isDebugEnabled,
      logLevel: this.logLevel,
      maxLogs: this.maxLogs
    });
  }

  debug(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.DEBUG)) {
      this.log(LogLevel.DEBUG, message, data);
    }
  }

  info(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.INFO)) {
      this.log(LogLevel.INFO, message, data);
    }
  }

  warn(message: string, data?: any): void {
    if (this.shouldLog(LogLevel.WARN)) {
      this.log(LogLevel.WARN, message, data);
    }
  }

  error(message: string, error?: any, data?: any): void {
    if (this.shouldLog(LogLevel.ERROR)) {
      const errorData = this.formatError(error, data);
      this.log(LogLevel.ERROR, message, errorData);
    }
  }

  logSpeechEvent(event: string, data?: any): void {
    if (environment.debug.logSpeechEvents) {
      this.debug(`Speech Event: ${event}`, data);
    }
  }

  logTranslationEvent(event: string, data?: any): void {
    if (environment.debug.logTranslationEvents) {
      this.debug(`Translation Event: ${event}`, data);
    }
  }

  logTtsEvent(event: string, data?: any): void {
    if (environment.debug.logTtsEvents) {
      this.debug(`TTS Event: ${event}`, data);
    }
  }

  getLogs(level?: LogLevel, limit?: number): LogEntry[] {
    let filteredLogs = this.logs;

    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }

    if (limit) {
      filteredLogs = filteredLogs.slice(-limit);
    }

    return filteredLogs.map(log => ({ ...log })); // Return copies
  }

  clearLogs(): void {
    this.logs = [];
    this.info('Logs cleared');
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  getLogSummary(): { [key in LogLevel]: number } {
    const summary = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 0,
      [LogLevel.WARN]: 0,
      [LogLevel.ERROR]: 0
    };

    this.logs.forEach(log => {
      summary[log.level]++;
    });

    return summary;
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.isDebugEnabled && level === LogLevel.DEBUG) {
      return false;
    }

    const levelPriority = {
      [LogLevel.DEBUG]: 0,
      [LogLevel.INFO]: 1,
      [LogLevel.WARN]: 2,
      [LogLevel.ERROR]: 3
    };

    return levelPriority[level] >= levelPriority[this.logLevel];
  }

  private log(level: LogLevel, message: string, data?: any): void {
    const logEntry: LogEntry = {
      level,
      message,
      timestamp: new Date(),
      data,
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    // Add stack trace for errors
    if (level === LogLevel.ERROR && data?.stack) {
      logEntry.stack = data.stack;
    }

    // Add to logs array
    this.logs.push(logEntry);

    // Maintain max logs limit
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Console output
    this.outputToConsole(logEntry);

    // Send to external logging service in production
    if (environment.production && level === LogLevel.ERROR) {
      this.sendToExternalLogger(logEntry);
    }
  }

  private outputToConsole(entry: LogEntry): void {
    const timestamp = entry.timestamp.toISOString();
    const prefix = `[${timestamp}] [${entry.level.toUpperCase()}]`;

    switch (entry.level) {
      case LogLevel.DEBUG:
        console.debug(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.INFO:
        console.info(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.WARN:
        console.warn(prefix, entry.message, entry.data || '');
        break;
      case LogLevel.ERROR:
        console.error(prefix, entry.message, entry.data || '');
        if (entry.stack) {
          console.error('Stack trace:', entry.stack);
        }
        break;
    }
  }

  private formatError(error: any, additionalData?: any): any {
    if (!error) return additionalData;

    let errorData: any = { ...additionalData };

    if (error instanceof Error) {
      errorData = {
        ...errorData,
        name: error.name,
        message: error.message,
        stack: error.stack
      };
    } else if (typeof error === 'string') {
      errorData = {
        ...errorData,
        errorMessage: error
      };
    } else {
      errorData = {
        ...errorData,
        error: error
      };
    }

    return errorData;
  }

  private async sendToExternalLogger(entry: LogEntry): Promise<void> {
    try {
      // Implement external logging service integration here
      // Example: Sentry, LogRocket, or custom logging endpoint

      // For now, just store in localStorage as fallback
      const storedLogs = localStorage.getItem('healthcare-translator-errors');
      const errorLogs = storedLogs ? JSON.parse(storedLogs) : [];

      errorLogs.push({
        ...entry,
        sessionId: this.getSessionId(),
        buildVersion: environment.version
      });

      // Keep only last 50 errors
      if (errorLogs.length > 50) {
        errorLogs.splice(0, errorLogs.length - 50);
      }

      localStorage.setItem('healthcare-translator-errors', JSON.stringify(errorLogs));
    } catch (logError) {
      console.error('Failed to send log to external service:', logError);
    }
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('healthcare-translator-session-id');
    if (!sessionId) {
      sessionId = this.generateId();
      sessionStorage.setItem('healthcare-translator-session-id', sessionId);
    }
    return sessionId;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9) + Date.now().toString(36);
  }
}
