import {
  DOCUMENT,
  isPlatformBrowser
} from '@angular/common';

import {
  computed,
  inject,
  Injectable,
  PLATFORM_ID,
  signal
} from '@angular/core';

import { TranslateService } from '@ngx-translate/core';

export type Language = 'ar' | 'en';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly translate = inject(TranslateService);
  readonly currentLanguage = () => this.languageSignal();
  private readonly languageSignal =
    signal<Language>(this.getInitialLanguage());

  readonly language =
    this.languageSignal.asReadonly();

  readonly isArabic = computed(
    () => this.languageSignal() === 'ar'
  );

  constructor() {
    const language = this.languageSignal();

   // this.translate.setDefaultLang('en');
    this.translate.use(language);

    this.applyLanguage(language);
  }

  setLanguage(language: Language): void {
    if (this.languageSignal() === language) {
      return;
    }

    this.languageSignal.set(language);

    this.translate.use(language);

    this.applyLanguage(language);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'language',
        language
      );
    }
  }

  toggleLanguage(): void {
    this.setLanguage(
      this.languageSignal() === 'ar'
        ? 'en'
        : 'ar'
    );
  }

  private getInitialLanguage(): Language {
    if (!isPlatformBrowser(this.platformId)) {
      return 'en';
    }

    const savedLanguage =
      localStorage.getItem('language');

    return savedLanguage === 'ar'
      ? 'ar'
      : 'en';
  }

  private applyLanguage(
    language: Language
  ): void {
    const html =
      this.document.documentElement;

    html.lang = language;

    html.dir =
      language === 'ar'
        ? 'rtl'
        : 'ltr';
  }
}