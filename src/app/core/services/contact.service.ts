import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ContactResponse,
  SendContactMessage
} from '../models/contact.model';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/contact`;

  sendMessage(
    data: SendContactMessage
  ): Observable<ContactResponse> {
    return this.http.post<ContactResponse>(
      this.apiUrl,
      data
    );
  }
}