import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import {
  BookingResponse,
  BookingStatus,
  CreateBookingDto,
  UpdateBookingStatusDto
} from '../models/booking.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BookingService {

  private readonly http = inject(HttpClient);

 private readonly apiUrl =
    `${environment.apiUrl}/bookings`;
  // ============================================================
  // CREATE BOOKING
  // POST: /api/bookings
  // ============================================================

  createBooking(
    dto: CreateBookingDto
  ): Observable<BookingResponse> {

    return this.http.post<BookingResponse>(
      this.apiUrl,
      dto
    );
  }


  // ============================================================
  // GET MY BOOKINGS
  // GET: /api/bookings/my
  // Customer
  // ============================================================

  getMyBookings(): Observable<BookingResponse[]> {

    return this.http.get<BookingResponse[]>(
      `${this.apiUrl}/my`
    );
  }


  // ============================================================
  // CANCEL BOOKING
  // DELETE: /api/bookings/{id}/cancel
  // Customer / Employee / Manager
  // ============================================================

  cancelBooking(
    id: string
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${id}/cancel`
    );
  }
}