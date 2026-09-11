import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Car } from '../../../core/models/car.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCarsService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/cars`;

  getAll(): Observable<Car[]> {
    return this.http.get<Car[]>(this.apiUrl);
  }

  getById(id: number): Observable<Car> {
    return this.http.get<Car>(
      `${this.apiUrl}/${id}`
    );
  }

  create(formData: FormData): Observable<Car> {
    return this.http.post<Car>(
      this.apiUrl,
      formData
    );
  }

  update(
    id: number,
    formData: FormData
  ): Observable<Car> {
    return this.http.put<Car>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }

  deleteImage(
    carId: number,
    imageId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${carId}/images/${imageId}`
    );
  }

  setPrimaryImage(
    carId: number,
    imageId: number
  ): Observable<void> {
    return this.http.put<void>(
      `${this.apiUrl}/${carId}/images/${imageId}/primary`,
      {}
    );
  }
}