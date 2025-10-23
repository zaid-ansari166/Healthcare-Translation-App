import { Component, OnInit, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet, Router, NavigationEnd } from "@angular/router";
import { Title, Meta } from "@angular/platform-browser";
import { filter, takeUntil } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../environments/environment";

// Services
import { ThemeService } from "./core/services/theme.service";
import { LoggerService } from "./core/services/logger.service";
import { ToastService } from "./core/services/toast.service";

// Components
import { HeaderComponent } from "./shared/components/header/header.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { ToastContainerComponent } from "./shared/components/toast-container/toast-container.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    FooterComponent,
    ToastContainerComponent,
  ],
  template: `
    <div class="app-container" [class.dark-mode]="isDarkMode">
      <!-- Skip to main content link for accessibility -->
      <a
        href="#main-content"
        class="skip-link sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-50 focus:p-4 focus:bg-primary focus:text-white focus:no-underline"
        (click)="focusMainContent()"
      >
        Skip to main content
      </a>

      <!-- Header -->
      <app-header></app-header>

      <!-- Main Content -->
      <main
        id="main-content"
        class="main-content flex-1 min-h-0"
        role="main"
        [attr.aria-label]="currentPageTitle"
      >
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <app-footer></app-footer>

      <!-- Toast Notifications -->
      <app-toast-container></app-toast-container>

      <!-- Loading Indicator -->
      <div
        *ngIf="isLoading"
        class="loading-overlay fixed inset-0 bg-black/50 flex items-center justify-center z-50"
        role="status"
        aria-label="Loading"
      >
        <div
          class="loading-spinner bg-white p-6 rounded-xl shadow-xl text-center"
        >
          <div
            class="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"
          ></div>
          <p class="text-gray-600">Loading...</p>
        </div>
      </div>

      <!-- Network Status Indicator -->
      <div
        *ngIf="!isOnline"
        class="network-status fixed top-0 left-0 right-0 bg-warning text-white p-2 text-center z-40"
        role="alert"
      >
        <i class="fas fa-wifi-slash mr-2"></i>
        You are currently offline. Some features may not be available.
      </div>
    </div>
  `,
  styles: [
    `
      .app-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: var(--bg-secondary);
      }

      .main-content {
        display: flex;
        flex-direction: column;
      }

      .skip-link {
        transform: translateY(-100%);
        transition: transform 0.3s;
      }

      .skip-link:focus {
        transform: translateY(0%);
      }

      .loading-overlay {
        backdrop-filter: blur(4px);
        animation: fadeIn 0.3s ease-out;
      }

      .network-status {
        animation: slideDown 0.3s ease-out;
      }

      @keyframes fadeIn {
        from {
          opacity: 0;
        }
        to {
          opacity: 1;
        }
      }

      @keyframes slideDown {
        from {
          transform: translateY(-100%);
        }
        to {
          transform: translateY(0);
        }
      }

      // Dark mode styles
      .dark-mode {
        --bg-primary: #0f172a;
        --bg-secondary: #1e293b;
        --bg-tertiary: #334155;
        --text-primary: #f8fafc;
        --text-secondary: #cbd5e1;
        --border-light: #334155;
      }

      // Reduced motion support
      @media (prefers-reduced-motion: reduce) {
        .loading-overlay,
        .network-status,
        .skip-link {
          animation: none;
          transition: none;
        }
      }
    `,
  ],
})
export class AppComponent implements OnInit, OnDestroy {
  title = environment.appName;
  currentPageTitle = "";
  isLoading = false;
  isDarkMode = false;
  isOnline = navigator.onLine;

  private destroy$ = new Subject<void>();
  private loadingTimeout: number | null = null;

  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private themeService: ThemeService,
    private logger: LoggerService,
    private toastService: ToastService,
  ) {
    this.initializeApp();
  }

  ngOnInit(): void {
    this.setupRouterEvents();
    this.setupNetworkMonitoring();
    this.setupThemeMonitoring();
    this.setupErrorHandling();
    this.setupPerformanceMonitoring();

    this.logger.info("Healthcare Translation App initialized", {
      version: environment.version,
      production: environment.production,
      userAgent: navigator.userAgent,
      onlineStatus: navigator.onLine,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.loadingTimeout) {
      clearTimeout(this.loadingTimeout);
    }
  }

  private initializeApp(): void {
    // Set initial meta tags
    this.setMetaTags();

    // Check browser compatibility
    this.checkBrowserCompatibility();

    // Initialize theme
    this.themeService.initializeTheme();
  }

  private setupRouterEvents(): void {
    this.router.events
      .pipe(
        filter(
          (event): event is NavigationEnd => event instanceof NavigationEnd,
        ),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.handleRouteChange(event);
      });
  }

  private setupNetworkMonitoring(): void {
    window.addEventListener("online", () => {
      this.isOnline = true;
      this.toastService.showToast("Connection restored", "success");
      this.logger.info("Network connection restored");
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      this.toastService.showToast(
        "Connection lost - some features may not work",
        "warning",
        0,
      );
      this.logger.warn("Network connection lost");
    });
  }

  private setupThemeMonitoring(): void {
    this.themeService.isDarkMode$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isDark: boolean) => {
        this.isDarkMode = isDark;
        this.logger.debug("Theme changed", { isDarkMode: isDark });
      });
  }

  private setupErrorHandling(): void {
    // Global error handling
    window.addEventListener("error", (event) => {
      this.logger.error("Global JavaScript error", {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    });

    // Unhandled promise rejection handling
    window.addEventListener("unhandledrejection", (event) => {
      this.logger.error("Unhandled promise rejection", {
        reason: event.reason,
      });
    });
  }

  private setupPerformanceMonitoring(): void {
    if (environment.debug.enabled) {
      // Monitor performance
      if ("performance" in window && "measure" in performance) {
        setTimeout(() => {
          const navigation = performance.getEntriesByType(
            "navigation",
          )[0] as PerformanceNavigationTiming;
          if (navigation) {
            this.logger.debug("App performance metrics", {
              domContentLoaded:
                navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart,
              loadComplete: navigation.loadEventEnd - navigation.loadEventStart,
              totalLoadTime: navigation.loadEventEnd - navigation.fetchStart,
            });
          }
        }, 1000);
      }
    }
  }

  private handleRouteChange(event: NavigationEnd): void {
    // Update current page title for accessibility
    this.currentPageTitle = this.titleService.getTitle();

    // Scroll to top on route change
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Analytics tracking (if enabled)
    if (environment.features.analytics) {
      this.trackPageView(event.urlAfterRedirects);
    }

    this.logger.debug("Route changed", {
      url: event.urlAfterRedirects,
      title: this.currentPageTitle,
    });
  }

  private setMetaTags(): void {
    // Set basic meta tags
    this.metaService.updateTag({
      name: "description",
      content:
        "Real-time multilingual translation for healthcare environments. Improve patient communication with voice recognition and instant translation.",
    });

    this.metaService.updateTag({
      name: "keywords",
      content:
        "healthcare translation, medical interpreter, patient communication, speech recognition, multilingual, hospital translation",
    });

    this.metaService.updateTag({
      name: "author",
      content: "Healthcare Translation Team",
    });

    this.metaService.updateTag({
      name: "robots",
      content: "index, follow",
    });

    // Open Graph tags
    this.metaService.updateTag({
      property: "og:title",
      content: this.title,
    });

    this.metaService.updateTag({
      property: "og:description",
      content: "Real-time multilingual translation for healthcare environments",
    });

    this.metaService.updateTag({
      property: "og:type",
      content: "website",
    });

    // Twitter Card tags
    this.metaService.updateTag({
      name: "twitter:card",
      content: "summary_large_image",
    });

    this.metaService.updateTag({
      name: "twitter:title",
      content: this.title,
    });
  }

  private checkBrowserCompatibility(): void {
    const issues: string[] = [];

    // Check for required APIs
    if (!("speechSynthesis" in window)) {
      issues.push("Speech Synthesis API not supported");
    }

    if (
      !("SpeechRecognition" in window) &&
      !("webkitSpeechRecognition" in window)
    ) {
      issues.push("Speech Recognition API not supported");
    }

    if (!("fetch" in window)) {
      issues.push("Fetch API not supported");
    }

    if (issues.length > 0) {
      this.logger.warn("Browser compatibility issues detected", { issues });

      const isModernBrowser = issues.length <= 1; // Allow some flexibility
      if (!isModernBrowser) {
        this.toastService.showToast(
          "Your browser may not support all features. Please use Chrome, Safari, or Edge for the best experience.",
          "warning",
          10000,
        );
      }
    }
  }

  private trackPageView(url: string): void {
    // Implement analytics tracking here
    this.logger.debug("Page view tracked", { url });
  }

  public focusMainContent(): void {
    const mainContent = document.getElementById("main-content");
    if (mainContent) {
      mainContent.focus();
    }
  }

  public showLoading(show: boolean = true): void {
    if (show) {
      this.isLoading = true;
      // Auto-hide loading after reasonable timeout
      this.loadingTimeout = window.setTimeout(() => {
        this.isLoading = false;
        this.logger.warn("Loading timeout exceeded");
      }, 30000); // 30 seconds max
    } else {
      this.isLoading = false;
      if (this.loadingTimeout) {
        clearTimeout(this.loadingTimeout);
        this.loadingTimeout = null;
      }
    }
  }
}
