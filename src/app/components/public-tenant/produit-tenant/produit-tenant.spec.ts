import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProduitTenant } from './produit-tenant';

describe('ProduitTenant', () => {
  let component: ProduitTenant;
  let fixture: ComponentFixture<ProduitTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProduitTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(ProduitTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
