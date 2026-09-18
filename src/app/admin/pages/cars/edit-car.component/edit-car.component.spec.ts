import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCarComponent } from './edit-car.component';
import { provideHttpClient } from '@angular/common/http';
import { provideTranslateService } from '@ngx-translate/core';
import { provideRouter } from '@angular/router';

describe('EditCarComponent', () => {
  let component: EditCarComponent;
  let fixture: ComponentFixture<EditCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCarComponent],
            providers: [ provideHttpClient(), provideTranslateService(),
        provideRouter([]) ]

    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
