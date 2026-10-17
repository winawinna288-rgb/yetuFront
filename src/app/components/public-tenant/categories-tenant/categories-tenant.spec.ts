import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesTenant } from './categories-tenant';

describe('CategoriesTenant', () => {
  let component: CategoriesTenant;
  let fixture: ComponentFixture<CategoriesTenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoriesTenant],
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesTenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
