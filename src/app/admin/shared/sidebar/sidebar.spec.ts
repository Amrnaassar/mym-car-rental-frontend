import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import {
  signal,
  WritableSignal
} from '@angular/core';

import {
  provideRouter,
  Router
} from '@angular/router';

import { Sidebar } from './sidebar';
import { AuthService } from '../../../core/services/auth.service';
import { UserRole } from '../../../core/models/user.model';

describe('Sidebar', () => {
  let component: Sidebar;
  let fixture: ComponentFixture<Sidebar>;
  let authService: jasmine.SpyObj<AuthService>;
  let currentUserSignal: WritableSignal<any>;
  let router: Router;

  beforeEach(async () => {
    currentUserSignal = signal(null);

    authService = jasmine.createSpyObj(
      'AuthService',
      ['logout'],
      {
        currentUser: currentUserSignal,
        isLoggedIn: signal(false)
      }
    );

    await TestBed.configureTestingModule({
      imports: [Sidebar],
      providers: [
        {
          provide: AuthService,
          useValue: authService
        },
        provideRouter([])
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Sidebar);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    spyOn(router, 'navigate');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should identify a manager user', () => {
    currentUserSignal.set({
      role: UserRole.Manager
    });

    expect(component.isManager()).toBeTrue();
  });

  it('should navigate to home after successful logout', () => {
    authService.logout.and.returnValue({
      subscribe: (observer: any) => observer.next()
    } as any);

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should navigate to home when logout fails', () => {
    authService.logout.and.returnValue({
      subscribe: (observer: any) => observer.error()
    } as any);

    component.logout();

    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });
});
