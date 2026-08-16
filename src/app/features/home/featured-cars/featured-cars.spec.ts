import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturedCars } from './featured-cars';

describe('FeaturedCars', () => {
  let component: FeaturedCars;
  let fixture: ComponentFixture<FeaturedCars>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturedCars]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturedCars);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
