import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  BookingResponse,
  BookingStatus,
  UpdateBookingStatusDto
} from '../../../core/models/booking.model';
@Injectable({
  providedIn: 'root'
})
export class AdminBookingsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/bookings`;

  getAll(): Observable<BookingResponse[]> {
    return this.http.get<BookingResponse[]>(
      this.apiUrl
    );
  }

  getById(id: string): Observable<BookingResponse> {
    return this.http.get<BookingResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  updateStatus(
    id: string,
    status: BookingStatus
  ): Observable<void> {
    const dto: UpdateBookingStatusDto = {
      status
    };

    return this.http.put<void>(
      `${this.apiUrl}/${id}/status`,
      dto
    );
  }

  cancel(id: string): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}/cancel`
    );
  }
}