import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { BookingStatus } from '../../../core/models/booking.model';
import { AdminBookingsService } from './admin-bookings';
import { AdminCarsService } from './admin-cars';
import { AdminCategoriesService } from './admin-categories';
import { AdminDashboardService } from './admin-dashboard';
import { AdminUsersService } from './admin-users';
import { Car } from '../../../core/models/car.model';
import { BookingResponse } from '../../../core/models/booking.model';
import { Category } from '../../../core/models/car-category.model';
import { User } from '../../../core/models/user.model';

describe('AdminDashboardService', () => {
  let service: AdminDashboardService;

  let carsService: jasmine.SpyObj<AdminCarsService>;
  let bookingsService: jasmine.SpyObj<AdminBookingsService>;
  let categoriesService: jasmine.SpyObj<AdminCategoriesService>;
  let usersService: jasmine.SpyObj<AdminUsersService>;

  beforeEach(() => {
    carsService = jasmine.createSpyObj(
      'AdminCarsService',
      ['getAll']
    );

    bookingsService = jasmine.createSpyObj(
      'AdminBookingsService',
      ['getAll']
    );

    categoriesService = jasmine.createSpyObj(
      'AdminCategoriesService',
      ['getAll']
    );

    usersService = jasmine.createSpyObj(
      'AdminUsersService',
      ['getAll']
    );

    TestBed.configureTestingModule({
      providers: [
        AdminDashboardService,
        {
          provide: AdminCarsService,
          useValue: carsService
        },
        {
          provide: AdminBookingsService,
          useValue: bookingsService
        },
        {
          provide: AdminCategoriesService,
          useValue: categoriesService
        },
        {
          provide: AdminUsersService,
          useValue: usersService
        }
      ]
    });

    service = TestBed.inject(AdminDashboardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load dashboard data without users', () => {
    const cars: Car[] = [];
    const bookings: BookingResponse[] = [];
    const categories: Category[] = [];

    carsService.getAll.and.returnValue(of(cars));
    bookingsService.getAll.and.returnValue(of(bookings));
    categoriesService.getAll.and.returnValue(of(categories));

    service.loadDashboard(false).subscribe(data => {
      expect(data.cars).toBe(cars);
      expect(data.bookings).toBe(bookings);
      expect(data.categories).toBe(categories);
      expect(data.users).toEqual([]);
    });

    expect(carsService.getAll).toHaveBeenCalled();
    expect(bookingsService.getAll).toHaveBeenCalled();
    expect(categoriesService.getAll).toHaveBeenCalled();
    expect(usersService.getAll).not.toHaveBeenCalled();
  });

  it('should load dashboard data including users', () => {
    const cars: Car[] = [];
    const bookings: BookingResponse[] = [];
    const categories: Category[] = [];
    const users: User[] = [];

    carsService.getAll.and.returnValue(of(cars));
    bookingsService.getAll.and.returnValue(of(bookings));
    categoriesService.getAll.and.returnValue(of(categories));
    usersService.getAll.and.returnValue(of(users));

    service.loadDashboard(true).subscribe(data => {
      expect(data.cars).toBe(cars);
      expect(data.bookings).toBe(bookings);
      expect(data.categories).toBe(categories);
      expect(data.users).toBe(users);
    });

    expect(usersService.getAll).toHaveBeenCalled();
  });

  it('should calculate revenue excluding cancelled bookings', () => {
    const bookings: BookingResponse[] = [
      {
        status: BookingStatus.Confirmed,
        grandTotal: 1000
      } as BookingResponse,
      {
        status: BookingStatus.Pending,
        grandTotal: 500
      } as BookingResponse,
      {
        status: BookingStatus.Cancelled,
        grandTotal: 300
      } as BookingResponse
    ];

    const revenue =
      AdminDashboardService.calculateRevenue(bookings);

    expect(revenue).toBe(1500);
  });

  it('should return zero revenue when all bookings are cancelled', () => {
    const bookings: BookingResponse[] = [
      {
        status: BookingStatus.Cancelled,
        grandTotal: 1000
      } as BookingResponse
    ];

    const revenue =
      AdminDashboardService.calculateRevenue(bookings);

    expect(revenue).toBe(0);
  });
});