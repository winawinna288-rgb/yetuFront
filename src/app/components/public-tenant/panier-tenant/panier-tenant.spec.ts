import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PanierTenant } from './panier-tenant';

describe('PanierTenant', () => {
  let component: PanierTenant;
  let fixture: ComponentFixture<PanierTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PanierTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(PanierTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
