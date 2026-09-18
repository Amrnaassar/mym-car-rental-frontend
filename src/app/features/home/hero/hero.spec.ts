import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { of } from 'rxjs';

import { Hero } from './hero';
import { CarCategoryService } from '../../../core/services/car-category.service';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('Hero', () => {
  let component: Hero;
  let fixture: ComponentFixture<Hero>;

  beforeEach(async () => {
    const carCategoryService = jasmine.createSpyObj(
      'CarCategoryService',
      ['getCategories']
    );

    carCategoryService.getCategories.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Hero],
      providers: [
        provideHttpClient(),
        provideTranslateService(),
        {
          provide: CarCategoryService,
          useValue: carCategoryService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Hero);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});