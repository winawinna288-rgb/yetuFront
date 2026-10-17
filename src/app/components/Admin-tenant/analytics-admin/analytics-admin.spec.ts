import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsAdmin } from './analytics-admin';

describe('AnalyticsAdmin', () => {
  let component: AnalyticsAdmin;
  let fixture: ComponentFixture<AnalyticsAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(AnalyticsAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
