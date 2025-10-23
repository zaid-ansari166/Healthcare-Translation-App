import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { ThemeService, ThemeConfig } from '../../../core/services/theme.service';
import { LoggerService } from '../../../core/services/logger.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="header" role="banner">
      <div class="container">
        <nav class="navbar" role="navigation" aria-label="Main navigation">
          <!-- Logo and Brand -->
          <div class="navbar-brand">
            <a routerLink="/" class="brand-link" [attr.aria-label]="appName">
              <div class="logo">
                <i class="fas fa-stethoscope" aria-hidden="true"></i>
              </div>
              <div class="brand-text">
                <h1 class="brand-title">{{ appName }}</h1>
                <p class="brand-subtitle">{{ appSubtitle }}</p>
              </div>
            </a>
          </div>

          <!-- Navigation Menu -->
          <div class="navbar-menu" [class.is-active]="isMobileMenuOpen">
            <!-- Main Navigation Links -->
            <ul class="navbar-nav" role="menubar">
              <li class="nav-item" role="none">
                <a
                  routerLink="/translator"
                  routerLinkActive="active"
                  class="nav-link"
                  role="menuitem"
                  (click)="closeMobileMenu()">
                  <i class="fas fa-language" aria-hidden="true"></i>
                  <span>Translator</span>
                </a>
              </li>
              <li class="nav-item" role="none">
                <a
                  routerLink="/help"
                  routerLinkActive="active"
                  class="nav-link"
                  role="menuitem"
                  (click)="closeMobileMenu()">
                  <i class="fas fa-question-circle" aria-hidden="true"></i>
                  <span>Help</span>
                </a>
              </li>
              <li class="nav-item" role="none">
                <a
                  routerLink="/settings"
                  routerLinkActive="active"
                  class="nav-link"
                  role="menuitem"
                  (click)="closeMobileMenu()">
                  <i class="fas fa-cog" aria-hidden="true"></i>
                  <span>Settings</span>
                </a>
              </li>
            </ul>

            <!-- Theme and Accessibility Controls -->
            <div class="navbar-controls">
              <!-- Theme Toggle -->
              <button
                type="button"
                class="control-btn theme-toggle"
                [attr.aria-label]="themeToggleLabel"
                [title]="themeToggleLabel"
                (click)="toggleTheme()">
                <i
                  [class]="themeIcon"
                  aria-hidden="true">
                </i>
                <span class="sr-only">{{ themeToggleLabel }}</span>
              </button>

              <!-- High Contrast Toggle -->
              <button
                type="button"
                class="control-btn contrast-toggle"
                [class.active]="currentTheme.highContrast"
                [attr.aria-pressed]="currentTheme.highContrast"
                aria-label="Toggle high contrast mode"
                title="Toggle high contrast mode"
                (click)="toggleHighContrast()">
                <i class="fas fa-adjust" aria-hidden="true"></i>
                <span class="sr-only">High contrast</span>
              </button>

              <!-- Font Size Control -->
              <div class="font-size-control" role="group" aria-label="Font size options">
                <button
                  type="button"
                  class="control-btn font-size-btn"
                  [class.active]="currentTheme.fontSize === 'small'"
                  aria-label="Small font size"
                  title="Small font"
                  (click)="setFontSize('small')">
                  <span class="font-size-indicator small">A</span>
                </button>
                <button
                  type="button"
                  class="control-btn font-size-btn"
                  [class.active]="currentTheme.fontSize === 'medium'"
                  aria-label="Medium font size"
                  title="Medium font"
                  (click)="setFontSize('medium')">
                  <span class="font-size-indicator medium">A</span>
                </button>
                <button
                  type="button"
                  class="control-btn font-size-btn"
                  [class.active]="currentTheme.fontSize === 'large'"
                  aria-label="Large font size"
                  title="Large font"
                  (click)="setFontSize('large')">
                  <span class="font-size-indicator large">A</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Mobile Menu Toggle -->
          <button
            type="button"
            class="mobile-menu-toggle"
            [class.is-active]="isMobileMenuOpen"
            [attr.aria-expanded]="isMobileMenuOpen"
            [attr.aria-label]="isMobileMenuOpen ? 'Close menu' : 'Open menu'"
            (click)="toggleMobileMenu()">
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
            <span class="hamburger-line"></span>
          </button>
        </nav>
      </div>

      <!-- Mobile Menu Overlay -->
      <div
        class="mobile-menu-overlay"
        [class.is-active]="isMobileMenuOpen"
        (click)="closeMobileMenu()"
        [attr.aria-hidden]="!isMobileMenuOpen">
      </div>
    </header>
  `,
  styles: [`
    .header {
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--accent-color) 100%);
      color: var(--text-inverse);
      box-shadow: var(--shadow-md);
      position: sticky;
      top: 0;
      z-index: var(--z-sticky);
    }

    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      min-height: 4rem;
      padding: var(--spacing-md) 0;
    }

    .navbar-brand {
      flex-shrink: 0;
    }

    .brand-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      color: inherit;
      text-decoration: none;
      transition: opacity var(--transition-normal);
    }

    .brand-link:hover {
      opacity: 0.9;
      text-decoration: none;
    }

    .logo {
      font-size: var(--text-3xl);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 48px;
      height: 48px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-xl);
      backdrop-filter: blur(4px);
    }

    .brand-text {
      display: flex;
      flex-direction: column;
      gap: var(--spacing-xs);
    }

    .brand-title {
      font-size: var(--text-xl);
      font-weight: 700;
      margin: 0;
      line-height: 1.2;
    }

    .brand-subtitle {
      font-size: var(--text-sm);
      font-weight: 300;
      margin: 0;
      opacity: 0.9;
      line-height: 1.3;
    }

    .navbar-menu {
      display: flex;
      align-items: center;
      gap: var(--spacing-xl);
    }

    .navbar-nav {
      display: flex;
      align-items: center;
      gap: var(--spacing-lg);
      list-style: none;
      margin: 0;
      padding: 0;
    }

    .nav-link {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      padding: var(--spacing-sm) var(--spacing-md);
      color: rgba(255, 255, 255, 0.9);
      text-decoration: none;
      border-radius: var(--radius-md);
      transition: all var(--transition-normal);
      font-weight: 500;
      white-space: nowrap;
    }

    .nav-link:hover {
      color: var(--text-inverse);
      background: rgba(255, 255, 255, 0.1);
      text-decoration: none;
    }

    .nav-link.active {
      color: var(--text-inverse);
      background: rgba(255, 255, 255, 0.15);
      font-weight: 600;
    }

    .navbar-controls {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
    }

    .control-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: var(--radius-md);
      color: rgba(255, 255, 255, 0.9);
      cursor: pointer;
      transition: all var(--transition-normal);
      backdrop-filter: blur(4px);
    }

    .control-btn:hover {
      background: rgba(255, 255, 255, 0.2);
      color: var(--text-inverse);
      transform: translateY(-1px);
    }

    .control-btn.active {
      background: rgba(255, 255, 255, 0.25);
      color: var(--text-inverse);
    }

    .font-size-control {
      display: flex;
      gap: 2px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: var(--radius-md);
      padding: 2px;
    }

    .font-size-btn {
      width: 32px;
      height: 32px;
      background: transparent;
    }

    .font-size-btn.active {
      background: rgba(255, 255, 255, 0.3);
    }

    .font-size-indicator.small {
      font-size: 12px;
    }

    .font-size-indicator.medium {
      font-size: 16px;
    }

    .font-size-indicator.large {
      font-size: 20px;
    }

    .mobile-menu-toggle {
      display: none;
      flex-direction: column;
      justify-content: space-around;
      width: 40px;
      height: 40px;
      background: rgba(255, 255, 255, 0.1);
      border: none;
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: all var(--transition-normal);
    }

    .hamburger-line {
      width: 20px;
      height: 2px;
      background: var(--text-inverse);
      border-radius: 1px;
      transition: all var(--transition-normal);
      transform-origin: center;
    }

    .mobile-menu-toggle.is-active .hamburger-line:nth-child(1) {
      transform: rotate(45deg) translate(5px, 5px);
    }

    .mobile-menu-toggle.is-active .hamburger-line:nth-child(2) {
      opacity: 0;
    }

    .mobile-menu-toggle.is-active .hamburger-line:nth-child(3) {
      transform: rotate(-45deg) translate(7px, -6px);
    }

    .mobile-menu-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: var(--z-modal-backdrop);
      opacity: 0;
      visibility: hidden;
      transition: all var(--transition-normal);
    }

    .mobile-menu-overlay.is-active {
      opacity: 1;
      visibility: visible;
    }

    /* Mobile Styles */
    @media (max-width: 768px) {
      .brand-text {
        display: none;
      }

      .navbar-menu {
        position: fixed;
        top: 100%;
        left: 0;
        right: 0;
        background: var(--bg-primary);
        box-shadow: var(--shadow-xl);
        transform: translateY(-100%);
        opacity: 0;
        visibility: hidden;
        transition: all var(--transition-normal);
        z-index: var(--z-modal);
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        max-height: calc(100vh - 4rem);
        overflow-y: auto;
      }

      .navbar-menu.is-active {
        transform: translateY(0);
        opacity: 1;
        visibility: visible;
      }

      .navbar-nav {
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: var(--spacing-lg);
      }

      .nav-link {
        padding: var(--spacing-lg);
        border-radius: 0;
        color: var(--text-primary);
        border-bottom: 1px solid var(--border-light);
      }

      .nav-link:hover {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .nav-link.active {
        background: var(--primary-color);
        color: var(--text-inverse);
      }

      .navbar-controls {
        padding: var(--spacing-lg);
        border-top: 1px solid var(--border-light);
        justify-content: space-around;
      }

      .control-btn {
        background: var(--bg-tertiary);
        color: var(--text-primary);
      }

      .control-btn:hover {
        background: var(--primary-color);
        color: var(--text-inverse);
      }

      .mobile-menu-toggle {
        display: flex;
      }
    }

    /* Tablet Styles */
    @media (max-width: 1024px) and (min-width: 769px) {
      .brand-subtitle {
        display: none;
      }

      .navbar-nav {
        gap: var(--spacing-md);
      }

      .navbar-controls {
        gap: var(--spacing-xs);
      }
    }

    /* Reduced Motion */
    @media (prefers-reduced-motion: reduce) {
      .brand-link,
      .nav-link,
      .control-btn,
      .mobile-menu-toggle,
      .hamburger-line,
      .mobile-menu-overlay,
      .navbar-menu {
        transition: none;
      }
    }

    /* High Contrast Mode */
    .high-contrast .header {
      background: var(--text-primary);
      border-bottom: 2px solid var(--text-inverse);
    }

    .high-contrast .nav-link,
    .high-contrast .control-btn {
      border: 1px solid var(--text-inverse);
    }

    /* Focus Styles */
    .brand-link:focus-visible,
    .nav-link:focus-visible,
    .control-btn:focus-visible,
    .mobile-menu-toggle:focus-visible {
      outline: 2px solid var(--text-inverse);
      outline-offset: 2px;
    }

    /* Screen Reader Only */
    .sr-only {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `]
})
export class HeaderComponent implements OnInit, OnDestroy {
  appName = environment.appName;
  appSubtitle = 'Real-time medical translation';
  currentTheme: ThemeConfig = {
    mode: 'system',
    highContrast: false,
    reducedMotion: false,
    fontSize: 'medium'
  };

  isMobileMenuOpen = false;
  private destroy$ = new Subject<void>();

  constructor(
    private themeService: ThemeService,
    private logger: LoggerService
  ) {}

  ngOnInit(): void {
    // Subscribe to theme changes
    this.themeService.getThemeConfig()
      .pipe(takeUntil(this.destroy$))
      .subscribe(theme => {
        this.currentTheme = theme;
      });

    // Close mobile menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    // Close mobile menu on escape key
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && this.isMobileMenuOpen) {
        this.closeMobileMenu();
      }
    });

    this.logger.debug('Header component initialized');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  get themeToggleLabel(): string {
    switch (this.currentTheme.mode) {
      case 'light':
        return 'Switch to dark mode';
      case 'dark':
        return 'Switch to light mode';
      case 'system':
        return 'Switch to manual theme';
      default:
        return 'Toggle theme';
    }
  }

  get themeIcon(): string {
    switch (this.currentTheme.mode) {
      case 'light':
        return 'fas fa-moon';
      case 'dark':
        return 'fas fa-sun';
      case 'system':
        return 'fas fa-circle-half-stroke';
      default:
        return 'fas fa-palette';
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
    this.logger.debug('Theme toggled from header');
  }

  toggleHighContrast(): void {
    this.themeService.setHighContrast(!this.currentTheme.highContrast);
    this.logger.debug('High contrast toggled from header', {
      enabled: !this.currentTheme.highContrast
    });
  }

  setFontSize(size: 'small' | 'medium' | 'large'): void {
    this.themeService.setFontSize(size);
    this.logger.debug('Font size changed from header', { size });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;

    // Prevent body scroll when menu is open
    if (this.isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    this.logger.debug('Mobile menu toggled', { isOpen: this.isMobileMenuOpen });
  }

  closeMobileMenu(): void {
    if (this.isMobileMenuOpen) {
      this.isMobileMenuOpen = false;
      document.body.style.overflow = '';
      this.logger.debug('Mobile menu closed');
    }
  }
}
