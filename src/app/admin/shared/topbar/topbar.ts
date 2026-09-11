import {
  Component,
  computed,
  inject
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import { filter } from 'rxjs';

import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.html',
  styleUrl: './topbar.scss'
})
export class Topbar {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly currentUser =
    this.authService.currentUser;

  pageTitle = 'Dashboard';

  constructor() {

    this.updateTitle(
      this.router.url
    );

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe(event => {

        this.updateTitle(
          (event as NavigationEnd).urlAfterRedirects
        );

      });

  }

  readonly roleLabel = computed(() => {

    const role =
      this.currentUser()?.role;

    switch (role) {

      case UserRole.Manager:
        return 'Manager';

      case UserRole.Employee:
        return 'Employee';

      default:
        return 'Customer';

    }

  });

  readonly initials = computed(() => {

    const fullName =
      this.currentUser()?.fullName;

    if (!fullName) {
      return 'U';
    }

    return fullName
      .split(' ')
      .slice(0, 2)
      .map(name => name[0])
      .join('')
      .toUpperCase();

  });

  private updateTitle(
    url: string
  ): void {

    if (url.includes('bookings')) {
      this.pageTitle = 'Bookings';
      return;
    }

    if (url.includes('cars')) {
      this.pageTitle = 'Cars';
      return;
    }

    if (url.includes('categories')) {
      this.pageTitle = 'Categories';
      return;
    }

    if (url.includes('users')) {
      this.pageTitle = 'Users';
      return;
    }

    this.pageTitle = 'Dashboard';
  }
}