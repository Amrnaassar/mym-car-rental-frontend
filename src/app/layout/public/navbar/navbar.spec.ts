import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { NavigationEnd, provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Navbar } from './navbar';
import { AuthService } from '../../../core/services/auth.service';
import { LanguageService } from '../../../shared/services/language.service';
import { AlertService } from '../../../shared/services/alert.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translate',
  standalone: true
})
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

describe('Navbar', () => {
  let component: Navbar;
  let fixture: ComponentFixture<Navbar>;

  beforeEach(async () => {
    const authService = {
      isLoggedIn: () => false,
      logout: () => of(undefined),
      clearAuthentication: () => {}
    };

    const languageService = {
      isArabic: () => false,
      toggleLanguage: () => {}
    };

    const alertService = {
      success: () => {},
      error: () => {}
    };

    await TestBed.configureTestingModule({
      imports: [Navbar],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        {
          provide: LanguageService,
          useValue: languageService
        },
        {
          provide: AlertService,
          useValue: alertService
        },
        provideRouter([])
      ]
    })
      .overrideComponent(Navbar, {
        remove: {
          imports: [TranslatePipe]
        },
        add: {
          imports: [MockTranslatePipe]
        }
      })
      .compileComponents();

    fixture = TestBed.createComponent(Navbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});