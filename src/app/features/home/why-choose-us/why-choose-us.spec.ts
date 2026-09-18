import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';

import { provideTranslateService } from '@ngx-translate/core';

import { WhyChooseUs } from './why-choose-us';

describe('WhyChooseUs', () => {
  let component: WhyChooseUs;
  let fixture: ComponentFixture<WhyChooseUs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChooseUs],
      providers: [
        provideTranslateService()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WhyChooseUs);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});