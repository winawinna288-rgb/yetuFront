import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { StoreChose } from './store-chose';

describe('StoreChose', () => {
  let component: StoreChose;
  let fixture: ComponentFixture<StoreChose>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreChose],
      providers: [provideRouter([]), provideHttpClient()],
    }).compileComponents();

    fixture = TestBed.createComponent(StoreChose);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
