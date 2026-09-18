import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingStep1 } from './booking-step-1';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../../../shared/services/language.service';

describe('BookingStep1', () => {
  let component: BookingStep1;
  let fixture: ComponentFixture<BookingStep1>;

  beforeEach(async () => {
    const languageService = {
      currentLanguage: () => 'en'
    };

    await TestBed.configureTestingModule({
      imports: [BookingStep1],
      providers: [
        provideHttpClient(),
        provideTranslateService(),
        {
          provide: LanguageService,
          useValue: languageService
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BookingStep1);
    component = fixture.componentInstance;

    component.booking = {
      pickupDate: '',
      returnDate: '',
      pickupLocation: ''
    } as any;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});