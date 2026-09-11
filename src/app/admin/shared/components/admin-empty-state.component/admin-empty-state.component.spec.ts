import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEmptyStateComponent } from './admin-empty-state.component';

describe('AdminEmptyStateComponent', () => {
  let component: AdminEmptyStateComponent;
  let fixture: ComponentFixture<AdminEmptyStateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminEmptyStateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminEmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
