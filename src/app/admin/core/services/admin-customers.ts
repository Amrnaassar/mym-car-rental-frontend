import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  Customer,
  CreateCustomerRequest
} from '../../../core/models/customer.model';

@Injectable({
  providedIn: 'root'
})
export class AdminCustomersService {
  private readonly http = inject(HttpClient);

  private readonly apiUrl =
    `${environment.apiUrl}/customers`;

  getAll(): Observable<Customer[]> {
    return this.http.get<Customer[]>(
      this.apiUrl
    );
  }

  search(query: string): Observable<Customer[]> {
    const params = new HttpParams()
      .set('search', query);


    return this.http.get<Customer[]>(
      this.apiUrl,
      { params }
    );


  }

  getById(id: number): Observable<Customer> {
    return this.http.get<Customer>(
      `${this.apiUrl}/${id}`
    );
  }

  create(
    request: CreateCustomerRequest
  ): Observable<Customer> {
    return this.http.post<Customer>(
      this.apiUrl,
      request
    );
  }
}
