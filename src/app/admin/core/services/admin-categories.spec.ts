import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AdminCategoriesService } from './admin-categories';
import { environment } from '../../../../environments/environment';
import { Category } from '../../../core/models/car-category.model';

describe('AdminCategoriesService', () => {
  let service: AdminCategoriesService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/categories`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminCategoriesService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AdminCategoriesService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all categories', () => {
    const mockCategories: Category[] = [];

    service.getAll().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush(mockCategories);
  });

  it('should get a category by id', () => {
    const categoryId = 1;

    const mockCategory = {
      id: categoryId
    } as Category;

    service.getById(categoryId).subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const request = httpMock.expectOne(
      `${apiUrl}/${categoryId}`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockCategory);
  });

  it('should create a category', () => {
    const formData = new FormData();

    formData.append('name', 'SUV');

    service.create(formData).subscribe();

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);

    request.flush({} as Category);
  });

  it('should update a category', () => {
    const categoryId = 1;
    const formData = new FormData();

    formData.append('name', 'SUV Updated');

    service.update(categoryId, formData).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${categoryId}`
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBe(formData);

    request.flush({} as Category);
  });

  it('should delete a category', () => {
    const categoryId = 1;

    service.delete(categoryId).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${categoryId}`
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });
});