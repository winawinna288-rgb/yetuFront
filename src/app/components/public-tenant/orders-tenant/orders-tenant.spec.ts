import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersTenant } from './orders-tenant';

describe('OrdersTenant', () => {
  let component: OrdersTenant;
  let fixture: ComponentFixture<OrdersTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
