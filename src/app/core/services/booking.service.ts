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
  // GET BOOKING BY ID
  // GET: /api/bookings/{id}
  // Employee + Manager
  // ============================================================

  getBookingById(
    id: string
  ): Observable<BookingResponse> {

    return this.http.get<BookingResponse>(
      `${this.apiUrl}/${id}`
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
  // GET ALL BOOKINGS
  // GET: /api/bookings
  // Employee + Manager
  // ============================================================

  getAllBookings(): Observable<BookingResponse[]> {

    return this.http.get<BookingResponse[]>(
      this.apiUrl
    );
  }

  // ============================================================
  // UPDATE STATUS
  // PUT: /api/bookings/{id}/status
  // Employee + Manager
  // ============================================================

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