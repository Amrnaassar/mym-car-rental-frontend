import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../core/models/car-category.model';


@Injectable({
  providedIn: 'root'
})
export class AdminCategoriesService {

  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/categories`;

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(
      this.apiUrl
    );
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/${id}`
    );
  }

  create(formData: FormData): Observable<Category> {
    return this.http.post<Category>(
      this.apiUrl,
      formData
    );
  }

  update(
    id: number,
    formData: FormData
  ): Observable<Category> {
    return this.http.put<Category>(
      `${this.apiUrl}/${id}`,
      formData
    );
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.apiUrl}/${id}`
    );
  }
}