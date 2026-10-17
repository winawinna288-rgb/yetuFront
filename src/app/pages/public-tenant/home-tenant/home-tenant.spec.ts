import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeTenant } from './home-tenant';

describe('HomeTenant', () => {
  let component: HomeTenant;
  let fixture: ComponentFixture<HomeTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(HomeTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
