
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import {
  Supplier,
  CreateSupplierRequest
} from '../../../core/models/supplier.model';

@Injectable({
  providedIn: 'root'
})
export class AdminSuppliersService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/suppliers`;

  getAll(): Observable<Supplier[]> {
    return this.http.get<Supplier[]>(this.apiUrl);
  }

  getById(id: number): Observable<Supplier> {
    return this.http.get<Supplier>(`${this.apiUrl}/${id}`);
  }

  create(request: CreateSupplierRequest): Observable<Supplier> {
    return this.http.post<Supplier>(this.apiUrl, request);
  }
}