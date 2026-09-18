import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';

import { FeaturedCars } from './featured-cars';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('FeaturedCars', () => {
  let component: FeaturedCars;
  let fixture: ComponentFixture<FeaturedCars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCars],
      providers: [ provideHttpClient(), provideTranslateService() ,
        provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedCars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});