import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopularCategories } from './popular-categories';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('PopularCategories', () => {
  let component: PopularCategories;
  let fixture: ComponentFixture<PopularCategories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopularCategories],
            providers: [ provideHttpClient(), provideTranslateService() ,
        provideRouter([])]

    })
    .compileComponents();

    fixture = TestBed.createComponent(PopularCategories);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
