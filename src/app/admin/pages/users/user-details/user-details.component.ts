import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpErrorResponse
} from '@angular/common/http';

import {
  User,
  UserRole
} from '../../../../core/models/user.model';

import {
  AdminUsersService
} from '../../../core/services/admin-users';
import { AlertService } from '../../../../shared/services/alert.service';
@Component({
  selector: 'app-user-details',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './user-details.component.html',
  styleUrl: './user-details.component.scss'
})
export class UserDetailsComponent implements OnInit {
  private readonly usersService = inject(AdminUsersService);

  private readonly alertService = inject(AlertService);

  private readonly route = inject(ActivatedRoute);

  private readonly router = inject(Router);

  readonly user = signal<User | null>(null);

  readonly loading = signal(true);

  readonly errorMessage = signal<string | null>(null);

  private userId = '';

  ngOnInit(): void {
    this.userId =
      this.route.snapshot.paramMap.get('id') ?? '';

    if (!this.userId) {
      this.router.navigate([
        '/admin/users'
      ]);

      return;
    }

    this.loadUser();
  }

  private loadUser(): void {
    this.usersService
      .getById(this.userId)
      .subscribe({
        next: (user) => {
          this.user.set(user);
          this.loading.set(false);
        },

        error: (error: HttpErrorResponse) => {
          console.error(
            'Failed to load user:',
            error
          );

          this.loading.set(false);

          const message =
            error.error?.message ??
            'Failed to load user.';

          this.errorMessage.set(message);

          this.alertService.error(
            'Unable to Load User',
            message
          );
        }
      });
  }

  roleLabel(role: UserRole): string {
    switch (role) {
      case UserRole.Manager:
        return 'Manager';

      case UserRole.Employee:
        return 'Employee';

      default:
        return 'Customer';
    }
  }

  back(): void {
    this.router.navigate([
      '/admin/users'
    ]);
  }
}