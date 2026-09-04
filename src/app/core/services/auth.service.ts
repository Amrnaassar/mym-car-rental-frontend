import {
  Injectable,
  inject,
  signal
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  Observable,
  catchError,
  of,
  tap
} from 'rxjs';

import { environment } from '../../../environments/environment';

import {
  AuthResponse,
  GoogleLoginRequest
} from '../models/auth.model';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/auth`;

  private readonly currentUserSignal =
    signal<User | null>(null);

  private readonly initializedSignal =
    signal(false);

  readonly currentUser =
    this.currentUserSignal.asReadonly();

  readonly initialized =
    this.initializedSignal.asReadonly();

  readonly isLoggedIn =
    signal(false);

  // =========================================
  // Google Login
  // =========================================

  googleLogin(
    idToken: string
  ): Observable<AuthResponse> {

    const request: GoogleLoginRequest = {
      idToken
    };

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/google`,
      request
    ).pipe(

      tap(response => {

        this.currentUserSignal.set(
          response.user
        );

        this.isLoggedIn.set(true);
      })
    );
  }

  // =========================================
  // Get Current User
  // =========================================

  getCurrentUser(): Observable<User> {

    return this.http.get<User>(
      `${this.apiUrl}/me`
    ).pipe(

      tap(user => {

        this.currentUserSignal.set(user);

        this.isLoggedIn.set(true);
      })
    );
  }

  // =========================================
  // Initialize Authentication
  // =========================================

  initialize(): Observable<User | null> {

    return this.getCurrentUser().pipe(

      catchError(() => {

        this.clearAuthentication();

        return of(null);
      }),

      tap(() => {

        this.initializedSignal.set(true);
      })
    );
  }

  // =========================================
  // Refresh Token
  // =========================================

  refreshToken(): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/refresh-token`,
      {}
    ).pipe(

      tap(response => {

        this.currentUserSignal.set(
          response.user
        );

        this.isLoggedIn.set(true);
      })
    );
  }

  // =========================================
  // Logout
  // =========================================

  logout(): Observable<void> {

    return this.http.post<void>(
      `${this.apiUrl}/logout`,
      {}
    ).pipe(

      tap(() => {

        this.clearAuthentication();
      })
    );
  }

  // =========================================
  // Clear Authentication
  // =========================================

  clearAuthentication(): void {

    this.currentUserSignal.set(null);

    this.isLoggedIn.set(false);
  }
}