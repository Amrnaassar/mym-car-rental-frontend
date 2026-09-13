import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  PLATFORM_ID,
  ViewChild,
  inject
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { UserRole } from '../../core/models/user.model';
import { TranslatePipe } from '@ngx-translate/core';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent implements AfterViewInit {

  @ViewChild('googleButton', { static: true })
  googleButton!: ElementRef<HTMLDivElement>;

  private readonly languageService = inject(LanguageService);
  private readonly googleAuthService = inject(GoogleAuthService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly platformId = inject(PLATFORM_ID);

  async ngAfterViewInit(): Promise<void> {

    // منع أي محاولة تنفيذ وقت الـ SSR (مفيش window/document على السيرفر)
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    try {
      await this.googleAuthService.initialize(
        (idToken: string) => this.loginWithGoogle(idToken)
      );

      this.googleAuthService.renderButton(
        this.googleButton.nativeElement
      );

    } catch (error) {
      console.error('Failed to initialize Google Sign-In:', error);
    }
  }

  private loginWithGoogle(idToken: string): void {

    this.authService
      .googleLogin(idToken)
      .subscribe({

        next: (res) => {

          const returnUrl =
            this.activatedRoute
              .snapshot
              .queryParamMap
              .get('returnUrl');

          const user = res.user;

          if (
            user.role == UserRole.Employee ||
            user.role == UserRole.Manager
          ) {
            this.router.navigate([
              '/admin/dashboard'
            ]);

            return;
          }

          this.router.navigate(['/']);
          this.router.navigateByUrl(returnUrl || '/');

        },

        error: error => {
          console.error('Google login failed:', error);
        }
      });
  }
}