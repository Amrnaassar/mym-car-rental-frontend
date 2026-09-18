import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import {
  ActivatedRoute,
  Router
} from '@angular/router';
import { of } from 'rxjs';

import { LoginComponent } from './login';
import { AuthService } from '../../core/services/auth.service';
import { GoogleAuthService } from '../../core/services/google-auth.service';
import { LanguageService } from '../../shared/services/language.service';
import { AlertService } from '../../shared/services/alert.service';

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

    const languageService = jasmine.createSpyObj(
      'LanguageService',
      []
    );

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