import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StepperTenant } from './stepper-tenant';

describe('StepperTenant', () => {
  let component: StepperTenant;
  let fixture: ComponentFixture<StepperTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(StepperTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
