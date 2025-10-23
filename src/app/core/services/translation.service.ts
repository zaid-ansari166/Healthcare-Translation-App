import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError, of, timer } from "rxjs";
import {
  map,
  catchError,
  retry,
  timeout,
  tap,
  switchMap,
} from "rxjs/operators";
import { environment } from "../../../environments/environment";
import {
  TranslationRequest,
  TranslationResponse,
  ApiError,
  TranslationErrorType,
} from "../models";
import { LoggerService } from "./logger.service";

interface MyMemoryResponse {
  responseData: {
    translatedText: string;
    match: number;
  };
  responseStatus: number;
  responseDetails: string;
}

interface CacheEntry {
  response: TranslationResponse;
  timestamp: number;
  accessCount: number;
}

@Injectable({
  providedIn: "root",
})
export class TranslationService {
  private readonly apiUrl = environment.api.translation.baseUrl;
  private readonly timeout = environment.api.translation.timeout;
  private readonly maxRetries = environment.api.translation.retryAttempts;
  private readonly maxRequestsPerMinute =
    environment.api.translation.maxRequestsPerMinute;

  private translationCache = new Map<string, CacheEntry>();
  private requestCount = 0;
  private lastRequestTime = 0;
  private readonly cacheDuration = 300000; // 5 minutes
  private readonly maxCacheSize = 1000;

  // Subject to track translation status
  private translationStatus$ = new BehaviorSubject<{
    isTranslating: boolean;
    progress?: number;
    currentRequest?: TranslationRequest;
  }>({ isTranslating: false });

  // Subject to track API health
  private apiHealth$ = new BehaviorSubject<{
    isHealthy: boolean;
    lastError?: ApiError;
    responseTime?: number;
  }>({ isHealthy: true });

  constructor(
    private http: HttpClient,
    private logger: LoggerService,
  ) {
    this.initializeService();
  }

  /**
   * Translate text from one language to another
   */
  translate(request: TranslationRequest): Observable<TranslationResponse> {
    this.logger.logTranslationEvent("Translation requested", {
      fromLanguage: request.fromLanguage,
      toLanguage: request.toLanguage,
      textLength: request.text.length,
    });

    // Validate request
    const validationError = this.validateRequest(request);
    if (validationError) {
      return throwError(() => validationError);
    }

    // Check rate limiting
    if (!this.checkRateLimit()) {
      const error = this.createApiError(
        TranslationErrorType.RATE_LIMIT,
        "Rate limit exceeded. Please wait before making more requests.",
        true,
      );
      return throwError(() => error);
    }

    // Check cache first
    const cacheKey = this.getCacheKey(request);
    const cachedResult = this.getFromCache(cacheKey);
    if (cachedResult) {
      this.logger.logTranslationEvent("Translation served from cache", {
        cacheKey,
      });
      return of(cachedResult);
    }

    // Update status
    this.translationStatus$.next({
      isTranslating: true,
      currentRequest: request,
    });

    // If same language, return original text
    if (request.fromLanguage === request.toLanguage) {
      const response: TranslationResponse = {
        originalText: request.text,
        translatedText: request.text,
        fromLanguage: request.fromLanguage,
        toLanguage: request.toLanguage,
        confidence: 1.0,
        timestamp: new Date(),
      };

      this.translationStatus$.next({ isTranslating: false });
      return of(response);
    }

    // Make API request
    return this.makeTranslationRequest(request).pipe(
      tap((response) => {
        // Cache successful response
        this.addToCache(cacheKey, response);

        // Update status
        this.translationStatus$.next({ isTranslating: false });

        // Log success
        this.logger.logTranslationEvent("Translation completed", {
          fromLanguage: request.fromLanguage,
          toLanguage: request.toLanguage,
          originalLength: request.text.length,
          translatedLength: response.translatedText.length,
          confidence: response.confidence,
        });
      }),
      catchError((error) => {
        this.translationStatus$.next({ isTranslating: false });
        this.logger.error("Translation failed", error, { request });
        return throwError(() => error);
      }),
    );
  }

  /**
   * Batch translate multiple texts
   */
  translateBatch(
    requests: TranslationRequest[],
  ): Observable<TranslationResponse[]> {
    this.logger.logTranslationEvent("Batch translation requested", {
      count: requests.length,
    });

    const translations$ = requests.map((request) =>
      this.translate(request).pipe(
        catchError((error) => {
          // Continue with other translations even if one fails
          this.logger.warn("Batch translation item failed", error);
          return of(null);
        }),
      ),
    );

    return timer(0).pipe(
      switchMap(() => Promise.all(translations$.map((t$) => t$.toPromise()))),
      map(
        (results) =>
          results.filter((result) => result !== null) as TranslationResponse[],
      ),
    );
  }

  /**
   * Get translation status observable
   */
  getTranslationStatus(): Observable<{
    isTranslating: boolean;
    progress?: number;
    currentRequest?: TranslationRequest;
  }> {
    return this.translationStatus$.asObservable();
  }

  /**
   * Get API health status observable
   */
  getApiHealth(): Observable<{
    isHealthy: boolean;
    lastError?: ApiError;
    responseTime?: number;
  }> {
    return this.apiHealth$.asObservable();
  }

  /**
   * Clear translation cache
   */
  clearCache(): void {
    this.translationCache.clear();
    this.logger.info("Translation cache cleared");
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; hitRate: number; totalRequests: number } {
    const totalAccess = Array.from(this.translationCache.values()).reduce(
      (sum, entry) => sum + entry.accessCount,
      0,
    );

    return {
      size: this.translationCache.size,
      hitRate:
        totalAccess > 0
          ? (totalAccess / (totalAccess + this.requestCount)) * 100
          : 0,
      totalRequests: this.requestCount,
    };
  }

  /**
   * Test API connectivity
   */
  testConnectivity(): Observable<boolean> {
    const testRequest: TranslationRequest = {
      text: "Hello",
      fromLanguage: "en",
      toLanguage: "es",
    };

    const startTime = Date.now();

    return this.makeTranslationRequest(testRequest).pipe(
      map(() => {
        const responseTime = Date.now() - startTime;
        this.apiHealth$.next({
          isHealthy: true,
          responseTime,
        });
        return true;
      }),
      catchError((error) => {
        this.apiHealth$.next({
          isHealthy: false,
          lastError: error,
        });
        return of(false);
      }),
    );
  }

  private initializeService(): void {
    // Periodic cache cleanup
    setInterval(() => {
      this.cleanupCache();
    }, 60000); // Clean every minute

    // Periodic API health check
    if (environment.production) {
      setInterval(() => {
        this.testConnectivity().subscribe();
      }, 300000); // Check every 5 minutes
    }

    this.logger.info("Translation service initialized", {
      apiUrl: this.apiUrl,
      timeout: this.timeout,
      maxRetries: this.maxRetries,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
    });
  }

  private makeTranslationRequest(
    request: TranslationRequest,
  ): Observable<TranslationResponse> {
    // Check if we're online
    if (!navigator.onLine) {
      return this.getOfflineTranslation(request);
    }

    const params = {
      q: request.text,
      langpair: `${request.fromLanguage}|${request.toLanguage}`,
    };

    return this.http.get<MyMemoryResponse>(this.apiUrl, { params }).pipe(
      timeout(this.timeout),
      retry({
        count: this.maxRetries,
        delay: (error, retryCount) => {
          this.logger.warn(`Translation retry ${retryCount}`, {
            error,
            request,
          });
          return timer(Math.min(1000 * Math.pow(2, retryCount - 1), 10000));
        },
      }),
      map((response) => this.mapApiResponse(response, request)),
      catchError((error) => {
        this.logger.error("Translation API request failed", error, {
          status: error?.status,
          message: error?.message,
          url: error?.url,
        });

        // Fallback to offline translation on API failure
        return this.getOfflineTranslation(request);
      }),
    );
  }

  private mapApiResponse(
    apiResponse: MyMemoryResponse,
    request: TranslationRequest,
  ): TranslationResponse {
    if (!apiResponse || apiResponse.responseStatus !== 200) {
      throw this.createApiError(
        TranslationErrorType.API_ERROR,
        apiResponse?.responseDetails || "Translation API error",
        false,
      );
    }

    if (!apiResponse.responseData || !apiResponse.responseData.translatedText) {
      throw this.createApiError(
        TranslationErrorType.API_ERROR,
        "Invalid response from translation API",
        false,
      );
    }

    const result = {
      originalText: request.text,
      translatedText: apiResponse.responseData.translatedText,
      fromLanguage: request.fromLanguage,
      toLanguage: request.toLanguage,
      confidence: (apiResponse.responseData.match || 50) / 100, // Convert to 0-1 range, default to 0.5
      timestamp: new Date(),
    };

    return result;
  }

  private validateRequest(request: TranslationRequest): ApiError | null {
    if (!request.text || request.text.trim().length === 0) {
      return this.createApiError(
        TranslationErrorType.TRANSLATION_FAILED,
        "Text cannot be empty",
        false,
      );
    }

    if (request.text.length > environment.ui.maxTranslationLength) {
      return this.createApiError(
        TranslationErrorType.TEXT_TOO_LONG,
        `Text too long. Maximum length is ${environment.ui.maxTranslationLength} characters.`,
        false,
      );
    }

    if (!request.fromLanguage || !request.toLanguage) {
      return this.createApiError(
        TranslationErrorType.INVALID_LANGUAGE,
        "Source and target languages must be specified",
        false,
      );
    }

    // Check if languages are supported
    const supportedLanguageCodes = Object.values(
      environment.supportedLanguages,
    ).map((lang: any) => lang.code);

    if (!supportedLanguageCodes.includes(request.fromLanguage)) {
      return this.createApiError(
        TranslationErrorType.INVALID_LANGUAGE,
        `Source language ${request.fromLanguage} is not supported`,
        false,
      );
    }

    if (!supportedLanguageCodes.includes(request.toLanguage)) {
      return this.createApiError(
        TranslationErrorType.INVALID_LANGUAGE,
        `Target language ${request.toLanguage} is not supported`,
        false,
      );
    }

    return null;
  }

  private checkRateLimit(): boolean {
    const now = Date.now();
    const oneMinute = 60000;

    if (now - this.lastRequestTime > oneMinute) {
      this.requestCount = 0;
      this.lastRequestTime = now;
    }

    if (this.requestCount >= this.maxRequestsPerMinute) {
      return false;
    }

    this.requestCount++;
    return true;
  }

  private getCacheKey(request: TranslationRequest): string {
    return `${request.fromLanguage}-${request.toLanguage}-${request.text}`;
  }

  private getFromCache(cacheKey: string): TranslationResponse | null {
    const entry = this.translationCache.get(cacheKey);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.cacheDuration) {
      this.translationCache.delete(cacheKey);
      return null;
    }

    // Update access count and timestamp
    entry.accessCount++;
    entry.timestamp = now;

    return { ...entry.response, cached: true };
  }

  private addToCache(cacheKey: string, response: TranslationResponse): void {
    // Check cache size limit
    if (this.translationCache.size >= this.maxCacheSize) {
      this.cleanupCache();
    }

    const entry: CacheEntry = {
      response: { ...response },
      timestamp: Date.now(),
      accessCount: 1,
    };

    this.translationCache.set(cacheKey, entry);
  }

  private cleanupCache(): void {
    const now = Date.now();
    const entries = Array.from(this.translationCache.entries());

    // Remove expired entries
    entries.forEach(([key, entry]) => {
      if (now - entry.timestamp > this.cacheDuration) {
        this.translationCache.delete(key);
      }
    });

    // If still over limit, remove least accessed entries
    if (this.translationCache.size >= this.maxCacheSize) {
      const sortedEntries = entries
        .filter(([key]) => this.translationCache.has(key))
        .sort((a, b) => a[1].accessCount - b[1].accessCount);

      const removeCount =
        this.translationCache.size - Math.floor(this.maxCacheSize * 0.8);
      for (let i = 0; i < removeCount; i++) {
        this.translationCache.delete(sortedEntries[i][0]);
      }
    }

    this.logger.debug("Translation cache cleaned", {
      currentSize: this.translationCache.size,
      maxSize: this.maxCacheSize,
    });
  }

  private getOfflineTranslation(
    request: TranslationRequest,
  ): Observable<TranslationResponse> {
    this.logger.info("Using offline translation fallback", {
      fromLanguage: request.fromLanguage,
      toLanguage: request.toLanguage,
      textLength: request.text.length,
    });

    // Check if we have common medical phrases first
    const commonTranslations = this.getCommonMedicalTranslation(request);
    if (commonTranslations) {
      const response: TranslationResponse = {
        originalText: request.text,
        translatedText: commonTranslations,
        fromLanguage: request.fromLanguage,
        toLanguage: request.toLanguage,
        confidence: 0.8, // High confidence for known phrases
        timestamp: new Date(),
      };
      return of(response);
    }

    // Simple offline fallback - return original text with notice
    const response: TranslationResponse = {
      originalText: request.text,
      translatedText: `${request.text} [Translation unavailable]`,
      fromLanguage: request.fromLanguage,
      toLanguage: request.toLanguage,
      confidence: 0.1, // Low confidence for offline mode
      timestamp: new Date(),
    };

    return of(response);
  }

  private getCommonMedicalTranslation(
    request: TranslationRequest,
  ): string | null {
    // Basic offline translations for common medical phrases
    const medicalPhrases: { [key: string]: { [lang: string]: string } } = {
      hello: {
        es: "hola",
        fr: "bonjour",
        de: "hallo",
        it: "ciao",
        pt: "olá",
      },
      "how are you": {
        es: "¿cómo estás?",
        fr: "comment allez-vous?",
        de: "wie geht es dir?",
        it: "come stai?",
        pt: "como está?",
      },
      help: {
        es: "ayuda",
        fr: "aide",
        de: "hilfe",
        it: "aiuto",
        pt: "ajuda",
      },
      pain: {
        es: "dolor",
        fr: "douleur",
        de: "schmerz",
        it: "dolore",
        pt: "dor",
      },
      "where does it hurt": {
        es: "¿dónde te duele?",
        fr: "où avez-vous mal?",
        de: "wo tut es weh?",
        it: "dove ti fa male?",
        pt: "onde dói?",
      },
    };

    const text = request.text.toLowerCase().trim();
    const targetLang = request.toLanguage;

    if (medicalPhrases[text] && medicalPhrases[text][targetLang]) {
      return medicalPhrases[text][targetLang];
    }

    return null;
  }

  private createApiError(
    code: TranslationErrorType,
    message: string,
    retryable: boolean,
  ): ApiError {
    return {
      code,
      message,
      timestamp: new Date(),
      retryable,
    };
  }
}
