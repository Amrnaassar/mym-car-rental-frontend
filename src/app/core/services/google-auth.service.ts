import {
  Injectable,
  NgZone,
  inject
} from '@angular/core';

import { environment } from '../../../environments/environment';

declare const google: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleAuthService {

  private readonly zone = inject(NgZone);

  initialize(
    onCredential: (idToken: string) => void
  ): void {

    if (typeof google === 'undefined') {
      console.error(
        'Google Identity Services script is not loaded.'
      );

      return;
    }

    google.accounts.id.initialize({
      client_id: environment.googleClientId,

      callback: (response: any) => {

        this.zone.run(() => {

          const idToken =
            response.credential;

          onCredential(idToken);
        });
      }
    });
  }

  renderButton(
    element: HTMLElement
  ): void {

    if (typeof google === 'undefined') {
      console.error(
        'Google Identity Services script is not loaded.'
      );

      return;
    }

    google.accounts.id.renderButton(
      element,
      {
        theme: 'outline',
        size: 'large',
        width: 300,
        text: 'continue_with',
        shape: 'rectangular'
      }
    );
  }
}