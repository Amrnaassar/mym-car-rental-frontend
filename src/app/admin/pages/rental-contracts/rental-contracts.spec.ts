import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentalContracts } from './rental-contracts';

describe('RentalContracts', () => {
  let component: RentalContracts;
  let fixture: ComponentFixture<RentalContracts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RentalContracts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RentalContracts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
