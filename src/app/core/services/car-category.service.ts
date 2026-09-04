import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable,
  map
} from 'rxjs';


import {
  environment
} from '../../../environments/environment';
import { Category } from '../models/car-category.model';

@Injectable({
  providedIn: 'root'
})
export class CarCategoryService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/categories`;

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl)
      .pipe(
        map(categories =>
          categories.filter(
            category => category.isActive
          )
        )
      );
  }

  getCategoryById(
    id: number
  ): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/${id}`
    );
  }

  getCategoryBySlug(
    slug: string
  ): Observable<Category> {
    return this.http.get<Category>(
      `${this.apiUrl}/slug/${slug}`
    );
  }
}