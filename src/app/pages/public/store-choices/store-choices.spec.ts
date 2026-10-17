import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { StoreChoices } from './store-choices';

describe('StoreChoices', () => {
  let component: StoreChoices;
  let fixture: ComponentFixture<StoreChoices>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreChoices],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreChoices);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
