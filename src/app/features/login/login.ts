import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

import {
  GoogleAuthService
} from '../../core/services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrl: './login.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginComponent
  implements AfterViewInit {

  @ViewChild(
    'googleButton',
    { static: true }
  )
  googleButton!: ElementRef<HTMLDivElement>;

  private readonly googleAuthService =
    inject(GoogleAuthService);

  private readonly authService =
    inject(AuthService);

  private readonly router =
    inject(Router);

  private readonly activatedRoute =
    inject(ActivatedRoute);

  ngAfterViewInit(): void {

    this.googleAuthService.initialize(
      (idToken: string) => {

        this.loginWithGoogle(idToken);
      }
    );

    this.googleAuthService.renderButton(
      this.googleButton.nativeElement
    );
  }

  private loginWithGoogle(
    idToken: string
  ): void {

    this.authService
      .googleLogin(idToken)
      .subscribe({

        next: () => {

          const returnUrl =
            this.activatedRoute
              .snapshot
              .queryParamMap
              .get('returnUrl');

          this.router.navigateByUrl(
            returnUrl || '/'
          );
        },

        error: error => {

          console.error(
            'Google login failed:',
            error
          );
        }
      });
  }
}