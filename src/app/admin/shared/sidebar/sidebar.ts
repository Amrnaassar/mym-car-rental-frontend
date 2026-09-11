import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive
} from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser =
    this.authService.currentUser;

  readonly isManager = computed(
    () =>
      this.currentUser()?.role ===
      UserRole.Manager
  );

  logout(): void {

    this.authService.logout()
      .subscribe({

        next: () => {
          this.router.navigate(['/']);
        },

        error: () => {
          this.router.navigate(['/']);
        }

      });

  }
}