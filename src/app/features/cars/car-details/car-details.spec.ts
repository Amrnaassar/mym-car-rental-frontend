import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarDetails } from './car-details';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';

describe('CarDetails', () => {
  let component: CarDetails;
  let fixture: ComponentFixture<CarDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarDetails],
      providers: [provideHttpClient(), provideTranslateService(),
        provideRouter([])]

    })
    .compileComponents();

    fixture = TestBed.createComponent(CarDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
