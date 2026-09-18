import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { CarCategoryService } from './car-category.service';
import { environment } from '../../../environments/environment';
import { Category } from '../models/car-category.model';

describe('CarCategoryService', () => {
  let service: CarCategoryService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CarCategoryService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(CarCategoryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return only active categories', () => {
    const categories = [
      {
        id: 1,
        isActive: true
      },
      {
        id: 2,
        isActive: false
      },
      {
        id: 3,
        isActive: true
      }
    ] as Category[];

    service.getCategories().subscribe(result => {
      expect(result).toEqual([
        categories[0],
        categories[2]
      ]);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush(categories);
  });
});