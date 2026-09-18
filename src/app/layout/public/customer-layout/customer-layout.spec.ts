import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerLayout } from './customer-layout';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('CustomerLayout', () => {
  let component: CustomerLayout;
  let fixture: ComponentFixture<CustomerLayout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerLayout],
           providers: [ provideHttpClient(), provideTranslateService(),
        provideRouter([]) ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerLayout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
