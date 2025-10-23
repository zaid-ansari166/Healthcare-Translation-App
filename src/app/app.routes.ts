import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/translator',
    pathMatch: 'full'
  },
  {
    path: 'translator',
    loadComponent: () => import('./features/translator/translator.component').then(m => m.TranslatorComponent),
    title: 'Healthcare Translator - Real-time Medical Translation'
  },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help.component').then(m => m.HelpComponent),
    title: 'Help - Healthcare Translator'
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/privacy/privacy.component').then(m => m.PrivacyComponent),
    title: 'Privacy Policy - Healthcare Translator'
  },
  {
    path: 'settings',
    loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent),
    title: 'Settings - Healthcare Translator'
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'Page Not Found - Healthcare Translator'
  }
];
