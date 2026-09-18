import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { AdminCarsService } from './admin-cars';
import { environment } from '../../../../environments/environment';
import { Car } from '../../../core/models/car.model';

describe('AdminCarsService', () => {
  let service: AdminCarsService;
  let httpMock: HttpTestingController;

  const apiUrl = `${environment.apiUrl}/cars`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdminCarsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AdminCarsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all cars', () => {
    const mockCars: Car[] = [];

    service.getAll().subscribe(cars => {
      expect(cars).toEqual(mockCars);
    });

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('GET');

    request.flush(mockCars);
  });

  it('should get a car by id', () => {
    const carId = 1;
    const mockCar = {
      id: carId
    } as Car;

    service.getById(carId).subscribe(car => {
      expect(car).toEqual(mockCar);
    });

    const request = httpMock.expectOne(
      `${apiUrl}/${carId}`
    );

    expect(request.request.method).toBe('GET');

    request.flush(mockCar);
  });

  it('should create a car', () => {
    const formData = new FormData();

    formData.append('name', 'BMW');

    service.create(formData).subscribe();

    const request = httpMock.expectOne(apiUrl);

    expect(request.request.method).toBe('POST');
    expect(request.request.body).toBe(formData);

    request.flush({} as Car);
  });

  it('should update a car', () => {
    const carId = 1;
    const formData = new FormData();

    formData.append('name', 'BMW Updated');

    service.update(carId, formData).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${carId}`
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toBe(formData);

    request.flush({} as Car);
  });

  it('should delete a car', () => {
    const carId = 1;

    service.delete(carId).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${carId}`
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('should delete a car image', () => {
    const carId = 1;
    const imageId = 10;

    service.deleteImage(carId, imageId).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${carId}/images/${imageId}`
    );

    expect(request.request.method).toBe('DELETE');

    request.flush(null);
  });

  it('should set a primary car image', () => {
    const carId = 1;
    const imageId = 10;

    service.setPrimaryImage(carId, imageId).subscribe();

    const request = httpMock.expectOne(
      `${apiUrl}/${carId}/images/${imageId}/primary`
    );

    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({});

    request.flush(null);
  });
});