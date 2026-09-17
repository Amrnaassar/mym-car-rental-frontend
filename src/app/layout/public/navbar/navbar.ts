import {
  ChangeDetectionStrategy,
  Component,
  inject
} from '@angular/core';

import {
  RouterLink,
  RouterLinkActive
} from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../shared/services/language.service';
import { TranslatePipe } from '@ngx-translate/core';
import { AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    TranslatePipe
  ],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Navbar {

  readonly authService = inject(AuthService);
  readonly alertService = inject(AlertService);
  readonly languageService = inject(LanguageService);

  toggleLanguage(): void {
    this.languageService.toggleLanguage();
  }

  isMobileMenuOpen = false;

  toggleMobileMenu(): void {
    this.isMobileMenuOpen =
      !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

 logout(): void {
  this.authService
    .logout()
    .subscribe({
      next: () => {
        this.closeMobileMenu();

        this.alertService.success(
          'Logged Out',
          'You have been logged out successfully.'
        );
      },

      error: () => {
        // حتى لو حصل error نخلي الـ UI يرجع Logged Out
        this.authService.clearAuthentication();
        this.closeMobileMenu();

        this.alertService.success(
          'Logged Out',
          'You have been logged out successfully.'
        );
      }
    });
}
}