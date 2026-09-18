import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { of } from 'rxjs';

import { Cars } from './cars';
import { CarService } from '../../core/services/car.service';
import { CarCategoryService } from '../../core/services/car-category.service';
import { LanguageService } from '../../shared/services/language.service';
import { AdminCarsService } from '../../admin/core/services/admin-cars';

describe('Cars', () => {
  let component: Cars;
  let fixture: ComponentFixture<Cars>;

  beforeEach(async () => {
    const carService = jasmine.createSpyObj(
      'CarService',
      ['getAvailableCars', 'getPrice']
    );

    carService.getAvailableCars.and.returnValue(of([]));
    carService.getPrice.and.returnValue(0);

    const carCategoryService = jasmine.createSpyObj(
      'CarCategoryService',
      ['getCategories']
    );

    carCategoryService.getCategories.and.returnValue(of([]));

    const languageService = jasmine.createSpyObj(
      'LanguageService',
      ['isArabic']
    );

    languageService.isArabic.and.returnValue(false);

    const router = jasmine.createSpyObj(
      'Router',
      ['navigate']
    );

    await TestBed.configureTestingModule({
      imports: [Cars],
      providers: [
        {
          provide: CarService,
          useValue: carService
        },
        {
          provide: CarCategoryService,
          useValue: carCategoryService
        },
        {
          provide: LanguageService,
          useValue: languageService
        },
        {
          provide: AdminCarsService,
          useValue: {}
        },
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({})
          }
        },
        {
          provide: Router,
          useValue: router
        },
        provideTranslateService()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Cars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});