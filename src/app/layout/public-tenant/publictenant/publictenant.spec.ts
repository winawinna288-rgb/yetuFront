import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Publictenant } from './publictenant';

describe('Publictenant', () => {
  let component: Publictenant;
  let fixture: ComponentFixture<Publictenant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Publictenant],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Publictenant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
