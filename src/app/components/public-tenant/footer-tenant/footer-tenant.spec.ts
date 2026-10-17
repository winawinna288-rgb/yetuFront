import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FooterTenant } from './footer-tenant';

describe('FooterTenant', () => {
  let component: FooterTenant;
  let fixture: ComponentFixture<FooterTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FooterTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
