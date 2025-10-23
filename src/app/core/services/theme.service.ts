import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { LoggerService } from "./logger.service";

export type ThemeMode = "light" | "dark" | "system";

export interface ThemeConfig {
  mode: ThemeMode;
  highContrast: boolean;
  reducedMotion: boolean;
  fontSize: "small" | "medium" | "large";
}

@Injectable({
  providedIn: "root",
})
export class ThemeService {
  private readonly THEME_STORAGE_KEY = "healthcare-translator-theme";
  private readonly DEFAULT_THEME: ThemeConfig = {
    mode: "system",
    highContrast: false,
    reducedMotion: false,
    fontSize: "medium",
  };

  private themeConfig$ = new BehaviorSubject<ThemeConfig>(this.DEFAULT_THEME);

  private systemPrefersDark = false;

  private mediaQueryList!: MediaQueryList;
  private motionMediaQuery!: MediaQueryList;
  private contrastMediaQuery!: MediaQueryList;

  constructor(private logger: LoggerService) {
    this.initializeMediaQueries();
  }

  /**
   * Initialize the theme service
   */
  initializeTheme(): void {
    // Load saved theme or use default
    const savedTheme = this.loadThemeFromStorage();
    const theme = { ...this.DEFAULT_THEME, ...savedTheme };

    // Check system preferences
    this.updateSystemPreferences();

    // Apply theme
    this.updateTheme(theme);

    this.logger.info("Theme service initialized", {
      currentTheme: theme,
      systemPrefersDark: this.systemPrefersDark,
    });
  }

  /**
   * Get current theme configuration
   */
  getThemeConfig(): Observable<ThemeConfig> {
    return this.themeConfig$.asObservable();
  }

  private _isDarkMode$ = new BehaviorSubject<boolean>(false);

  /**
   * Get current dark mode state observable
   */
  get isDarkMode$(): Observable<boolean> {
    return this._isDarkMode$.asObservable();
  }

  /**
   * Get current theme configuration value
   */
  getCurrentTheme(): ThemeConfig {
    return this.themeConfig$.value;
  }

  /**
   * Get current dark mode state value
   */
  getCurrentDarkMode(): boolean {
    return this._isDarkMode$.value;
  }

  /**
   * Set theme mode (light, dark, or system)
   */
  setThemeMode(mode: ThemeMode): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: ThemeConfig = {
      ...currentTheme,
      mode,
    };

    this.updateTheme(newTheme);
    this.saveThemeToStorage(newTheme);

    this.logger.info("Theme mode changed", { mode, newTheme });
  }

  /**
   * Toggle between light and dark mode
   */
  toggleTheme(): void {
    const currentMode = this.getCurrentTheme().mode;

    if (currentMode === "system") {
      // If system, switch to opposite of current system preference
      this.setThemeMode(this.systemPrefersDark ? "light" : "dark");
    } else {
      // Toggle between light and dark
      this.setThemeMode(currentMode === "light" ? "dark" : "light");
    }
  }

  /**
   * Set high contrast mode
   */
  setHighContrast(enabled: boolean): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: ThemeConfig = {
      ...currentTheme,
      highContrast: enabled,
    };

    this.updateTheme(newTheme);
    this.saveThemeToStorage(newTheme);

    this.logger.info("High contrast mode changed", { enabled });
  }

  /**
   * Set reduced motion preference
   */
  setReducedMotion(enabled: boolean): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: ThemeConfig = {
      ...currentTheme,
      reducedMotion: enabled,
    };

    this.updateTheme(newTheme);
    this.saveThemeToStorage(newTheme);

    this.logger.info("Reduced motion changed", { enabled });
  }

  /**
   * Set font size
   */
  setFontSize(size: "small" | "medium" | "large"): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: ThemeConfig = {
      ...currentTheme,
      fontSize: size,
    };

    this.updateTheme(newTheme);
    this.saveThemeToStorage(newTheme);

    this.logger.info("Font size changed", { size });
  }

  /**
   * Reset theme to defaults
   */
  resetTheme(): void {
    this.updateTheme(this.DEFAULT_THEME);
    this.saveThemeToStorage(this.DEFAULT_THEME);

    this.logger.info("Theme reset to defaults");
  }

  /**
   * Get available theme options
   */
  getThemeOptions(): {
    modes: Array<{ value: ThemeMode; label: string }>;
    fontSizes: Array<{ value: string; label: string }>;
  } {
    return {
      modes: [
        { value: "light", label: "Light" },
        { value: "dark", label: "Dark" },
        { value: "system", label: "System" },
      ],
      fontSizes: [
        { value: "small", label: "Small" },
        { value: "medium", label: "Medium" },
        { value: "large", label: "Large" },
      ],
    };
  }

  private initializeMediaQueries(): void {
    // Dark mode media query
    this.mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    this.mediaQueryList.addEventListener("change", (e) => {
      this.systemPrefersDark = e.matches;
      this.handleSystemThemeChange();
    });

    // Reduced motion media query
    this.motionMediaQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    this.motionMediaQuery.addEventListener("change", (e) => {
      this.handleSystemMotionChange(e.matches);
    });

    // High contrast media query
    this.contrastMediaQuery = window.matchMedia("(prefers-contrast: high)");
    this.contrastMediaQuery.addEventListener("change", (e) => {
      this.handleSystemContrastChange(e.matches);
    });
  }

  private updateSystemPreferences(): void {
    this.systemPrefersDark = this.mediaQueryList.matches;

    // Auto-apply system preferences if not overridden
    const currentTheme = this.getCurrentTheme();
    if (!this.hasStoredPreference("reducedMotion")) {
      currentTheme.reducedMotion = this.motionMediaQuery.matches;
    }
    if (!this.hasStoredPreference("highContrast")) {
      currentTheme.highContrast = this.contrastMediaQuery.matches;
    }
  }

  private updateTheme(theme: ThemeConfig): void {
    // Determine if dark mode should be active
    const isDark = this.shouldUseDarkMode(theme);

    // Apply theme to document
    this.applyThemeToDocument(theme, isDark);

    // Update observables
    this.themeConfig$.next(theme);
    this._isDarkMode$.next(isDark);
  }

  private shouldUseDarkMode(theme: ThemeConfig): boolean {
    switch (theme.mode) {
      case "dark":
        return true;
      case "light":
        return false;
      case "system":
        return this.systemPrefersDark;
      default:
        return false;
    }
  }

  private applyThemeToDocument(theme: ThemeConfig, isDark: boolean): void {
    const root = document.documentElement;

    // Remove existing theme classes
    root.classList.remove(
      "light-theme",
      "dark-theme",
      "high-contrast",
      "reduced-motion",
    );
    root.classList.remove("font-small", "font-medium", "font-large");

    // Apply theme classes
    root.classList.add(isDark ? "dark-theme" : "light-theme");

    if (theme.highContrast) {
      root.classList.add("high-contrast");
    }

    if (theme.reducedMotion) {
      root.classList.add("reduced-motion");
    }

    root.classList.add(`font-${theme.fontSize}`);

    // Apply CSS custom properties
    this.applyCSSVariables(theme, isDark);

    // Update meta theme-color for mobile browsers
    this.updateThemeColor(isDark);
  }

  private applyCSSVariables(theme: ThemeConfig, isDark: boolean): void {
    const root = document.documentElement;

    if (isDark) {
      root.style.setProperty("--color-scheme", "dark");
      root.style.setProperty("--bg-primary", "#0f172a");
      root.style.setProperty("--bg-secondary", "#1e293b");
      root.style.setProperty("--bg-tertiary", "#334155");
      root.style.setProperty("--text-primary", "#f8fafc");
      root.style.setProperty("--text-secondary", "#cbd5e1");
      root.style.setProperty("--text-muted", "#64748b");
      root.style.setProperty("--border-light", "#334155");
      root.style.setProperty("--border-medium", "#475569");
    } else {
      root.style.setProperty("--color-scheme", "light");
      root.style.setProperty("--bg-primary", "#ffffff");
      root.style.setProperty("--bg-secondary", "#f8fafc");
      root.style.setProperty("--bg-tertiary", "#f1f5f9");
      root.style.setProperty("--text-primary", "#1e293b");
      root.style.setProperty("--text-secondary", "#64748b");
      root.style.setProperty("--text-muted", "#94a3b8");
      root.style.setProperty("--border-light", "#e2e8f0");
      root.style.setProperty("--border-medium", "#cbd5e1");
    }

    // Font size variables
    const fontSizeMap = {
      small: { base: "14px", scale: 0.875 },
      medium: { base: "16px", scale: 1 },
      large: { base: "18px", scale: 1.125 },
    };

    const fontConfig = fontSizeMap[theme.fontSize];
    root.style.setProperty("--font-size-base", fontConfig.base);
    root.style.setProperty("--font-scale", fontConfig.scale.toString());

    // High contrast adjustments
    if (theme.highContrast) {
      root.style.setProperty("--border-light", isDark ? "#ffffff" : "#000000");
      root.style.setProperty("--border-medium", isDark ? "#ffffff" : "#000000");
      root.style.setProperty("--text-muted", isDark ? "#ffffff" : "#000000");
    }

    // Reduced motion adjustments
    if (theme.reducedMotion) {
      root.style.setProperty("--transition-duration", "0.01ms");
      root.style.setProperty("--animation-duration", "0.01ms");
    } else {
      root.style.setProperty("--transition-duration", "0.25s");
      root.style.setProperty("--animation-duration", "0.3s");
    }
  }

  private updateThemeColor(isDark: boolean): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute("content", isDark ? "#1e293b" : "#2563eb");
    }
  }

  private handleSystemThemeChange(): void {
    const currentTheme = this.getCurrentTheme();
    if (currentTheme.mode === "system") {
      this.updateTheme(currentTheme);
      this.logger.debug("System theme preference changed", {
        systemPrefersDark: this.systemPrefersDark,
      });
    }
  }

  private handleSystemMotionChange(prefersReduced: boolean): void {
    const currentTheme = this.getCurrentTheme();
    if (!this.hasStoredPreference("reducedMotion")) {
      const newTheme = { ...currentTheme, reducedMotion: prefersReduced };
      this.updateTheme(newTheme);
      this.logger.debug("System motion preference changed", { prefersReduced });
    }
  }

  private handleSystemContrastChange(prefersHigh: boolean): void {
    const currentTheme = this.getCurrentTheme();
    if (!this.hasStoredPreference("highContrast")) {
      const newTheme = { ...currentTheme, highContrast: prefersHigh };
      this.updateTheme(newTheme);
      this.logger.debug("System contrast preference changed", { prefersHigh });
    }
  }

  private loadThemeFromStorage(): Partial<ThemeConfig> {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      this.logger.warn("Failed to load theme from storage", error);
    }
    return {};
  }

  private saveThemeToStorage(theme: ThemeConfig): void {
    try {
      localStorage.setItem(this.THEME_STORAGE_KEY, JSON.stringify(theme));
    } catch (error) {
      this.logger.warn("Failed to save theme to storage", error);
    }
  }

  private hasStoredPreference(key: keyof ThemeConfig): boolean {
    try {
      const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
      if (stored) {
        const theme = JSON.parse(stored);
        return key in theme;
      }
    } catch (error) {
      // Ignore error
    }
    return false;
  }
}
