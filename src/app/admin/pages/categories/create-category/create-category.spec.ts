import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateCategory } from './create-category';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';

describe('CreateCategory', () => {
  let component: CreateCategory;
  let fixture: ComponentFixture<CreateCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateCategory],
      providers: [provideHttpClient(), provideTranslateService()]

    })
      .compileComponents();

    fixture = TestBed.createComponent(CreateCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
