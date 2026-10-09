
import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';

import {
  RentalContract,
  CreateRentalContractRequest
} from '../../../core/models/rental-contract.model';

@Injectable({
  providedIn: 'root'
})
export class AdminRentalContractsService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/rentalcontracts`;

  getAll(): Observable<RentalContract[]> {
    return this.http.get<RentalContract[]>(this.apiUrl);
  }

  getById(id: string): Observable<RentalContract> {
    return this.http.get<RentalContract>(`${this.apiUrl}/${id}`);
  }

  create(
    request: CreateRentalContractRequest
  ): Observable<RentalContract> {
    return this.http.post<RentalContract>(this.apiUrl, request);
  }
}