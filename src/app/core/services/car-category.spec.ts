import { TestBed } from '@angular/core/testing';

import { CarCategory } from './car-category';

describe('CarCategory', () => {
  let service: CarCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CarCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
