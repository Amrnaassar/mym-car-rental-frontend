import { User } from './user.model';

export interface GoogleLoginRequest {
  idToken: string;
}

export interface AuthResponse {
  user: User;
  accessTokenExpiresAt: string;
  refreshTokenExpiresAt: string;
}