import {
  Injectable,
  NgZone,
  PLATFORM_ID,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private readonly zone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly scriptUrl = 'https://accounts.google.com/gsi/client';
  private readonly maxAttempts = 50; // 50 * 100ms = 5s timeout
  private readonly pollInterval = 100;

  private scriptLoadPromise: Promise<void> | null = null;
  private initialized = false;

  /**
   * يحمّل الـ Google Identity Services script (لو لسه مش متحمّل)
   * وبيستنى لحد ما window.google.accounts.id يبقى جاهز فعلاً.
   */
  private loadScript(): Promise<void> {

    if (!isPlatformBrowser(this.platformId)) {
      return Promise.reject(
        new Error('Google Identity Services can only load in the browser.')
      );
    }

    if (this.scriptLoadPromise) {
      return this.scriptLoadPromise;
    }

    this.scriptLoadPromise = new Promise<void>((resolve, reject) => {

      // لو الـ API جاهز خلاص (مثلاً اتحط يدوي في index.html)
      if (typeof google !== 'undefined' && google?.accounts?.id) {
        resolve();
        return;
      }

      const existingScript = document.querySelector<HTMLScriptElement>(
        `script[src="${this.scriptUrl}"]`
      );

      if (!existingScript) {
        const script = document.createElement('script');
        script.src = this.scriptUrl;
        script.async = true;
        script.defer = true;
        script.onerror = () =>
          reject(new Error('Failed to load Google Identity Services script.'));

        document.head.appendChild(script);
      }

      this.pollForGoogleApi(resolve, reject);
    });

    return this.scriptLoadPromise;
  }

  private pollForGoogleApi(
    resolve: () => void,
    reject: (err: Error) => void,
    attempt = 0
  ): void {

    if (typeof google !== 'undefined' && google?.accounts?.id) {
      resolve();
      return;
    }

    if (attempt >= this.maxAttempts) {
      reject(new Error('Google Identity Services script load timed out.'));
      return;
    }

    setTimeout(
      () => this.pollForGoogleApi(resolve, reject, attempt + 1),
      this.pollInterval
    );
  }

  /**
   * بيتأكد إن الـ script متحمل، وبعدين بيعمل initialize لـ Google Identity.
   * لازم تتنادى قبل renderButton.
   */
  async initialize(
    onCredential: (idToken: string) => void
  ): Promise<void> {

    await this.loadScript();

    if (this.initialized) {
      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,

      callback: (response: any) => {
        this.zone.run(() => {
          const idToken = response.credential;
          onCredential(idToken);
        });
      }
    });

    this.initialized = true;
  }

  /**
   * بيرندر الزرار جوه العنصر المحدد.
   * لازم initialize() تكون خلصت (await) قبل ما تتنادى.
   */
  renderButton(
    element: HTMLElement,
    options?: Partial<{
      theme: 'outline' | 'filled_blue' | 'filled_black';
      size: 'large' | 'medium' | 'small';
      width: number;
      text: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
      shape: 'rectangular' | 'pill' | 'circle' | 'square';
    }>
  ): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof google === 'undefined' || !google?.accounts?.id) {
      console.error(
        'Google Identity Services is not initialized. Call initialize() first.'
      );
      return;
    }

    google.accounts.id.renderButton(element, {
      theme: 'outline',
      size: 'large',
      width: 300,
      text: 'continue_with',
      shape: 'rectangular',
      ...options
    });
  }

  /**
   * اختياري: بيقفل الـ One Tap prompt لو شغال.
   */
  cancel(): void {

    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (typeof google !== 'undefined' && google?.accounts?.id) {
      google.accounts.id.cancel();
    }
  }
}