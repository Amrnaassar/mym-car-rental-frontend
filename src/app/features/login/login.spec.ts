import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  ActivatedRoute,
  provideRouter,
  Router
} from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { LanguageService } from '../../shared/services/language.service';
import { AlertService } from '../../shared/services/alert.service';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  let googleAuthService: jasmine.SpyObj<GoogleAuthService>;

  beforeEach(async () => {
    googleAuthService = jasmine.createSpyObj(
      'GoogleAuthService',
      [
        'initialize',
        'renderButton'
      ]
    );

    googleAuthService.initialize.and.returnValue(
      Promise.resolve()
    );

    const authService = jasmine.createSpyObj(
      'AuthService',
      ['googleLogin']
    );

    const languageService = {};


    const alertService = jasmine.createSpyObj(
      'AlertService',
      [
        'success',
        'error'
      ]
    );

    const router = jasmine.createSpyObj(
      'Router',
      [
        'navigate',
        'navigateByUrl'
      ]
    );

    const activatedRoute = {
      snapshot: {
        queryParamMap: {
          get: () => null
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
         provideTranslateService(),
        
        {
          provide: GoogleAuthService,
          useValue: googleAuthService
        },
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
        {
          provide: Router,
          useValue: router
        },
        {
          provide: ActivatedRoute,
          useValue: activatedRoute
        },
        {
          provide: 'PLATFORM_ID',
          useValue: 'browser'
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});