import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  User,
  UserRole,
  UserUpdateRoleRequest
} from '../../../core/models/user.model';

import { AdminUsersService } from '../../core/services/admin-users';
import { AlertService } from '../../../shared/services/alert.service';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})

export class Users implements OnInit {

  private readonly usersService = inject(AdminUsersService);

  private readonly alertService = inject(AlertService);
  
  private readonly router = inject(Router);

  readonly userRole = UserRole;

  readonly users = signal<User[]>([]);

  readonly loading = signal(true);

  readonly search =
    signal('');

  readonly roleFilter =
    signal<'all' | UserRole>('all');

  readonly filteredUsers =
    computed(() => {
      const query =
        this.search()
          .trim()
          .toLowerCase();

      const role =
        this.roleFilter();

      return this.users().filter(user => {
        const matchesSearch =
          !query ||
          user.fullName
            .toLowerCase()
            .includes(query) ||
          user.email
            .toLowerCase()
            .includes(query) ||
          (user.phone ?? '')
            .toLowerCase()
            .includes(query);

        const matchesRole =
          role == 'all' ||
          user.role == role;
        return (
          matchesSearch &&
          matchesRole
        );
      });
    });

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
  this.loading.set(true);

  this.usersService
    .getAll()
    .subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },

      error: (error) => {
        console.error(
          'Failed to load users:',
          error
        );

        this.loading.set(false);

        this.alertService.error(
          'Unable to Load Users',
          'Please try again later.'
        );
      }
    });
}

changeUserRole(
  id: string,
  role: UserRole
): void {
  this.usersService
    .updateRole(id, { role })
    .subscribe({
      next: () => {
        this.alertService.success(
          'Role Updated',
          'The user role has been updated successfully.'
        );

        this.loadUsers();
      },

      error: (error) => {
        console.error(
          'Failed to update user role.',
          error
        );

        this.alertService.error(
          'Update Failed',
          'Unable to update the user role. Please try again.'
        );
      }
    });
}

deleteUser(user: User): void {
  const confirmed = window.confirm(
    `Delete "${user.fullName}"?`
  );

  if (!confirmed) {
    return;
  }

  this.usersService
    .delete(user.id)
    .subscribe({
      next: () => {
        this.users.update(
          (current) =>
            current.filter(
              (item) => item.id !== user.id
            )
        );

        this.alertService.success(
          'User Deleted',
          `"${user.fullName}" has been deleted successfully.`
        );
      },

      error: (error) => {
        console.error(
          'Failed to delete user:',
          error
        );

        this.alertService.error(
          'Delete Failed',
          'Unable to delete the user. Please try again.'
        );
      }
    });
}

  viewUser(id: string): void {
    this.router.navigate([
      '/admin/users',
      id
    ]);
  }

  roleClass(role: UserRole): string {
    switch (role) {
      case UserRole.Manager:
        return 'manager';

      case UserRole.Employee:
        return 'employee';

      default:
        return 'customer';
    }
  }
}