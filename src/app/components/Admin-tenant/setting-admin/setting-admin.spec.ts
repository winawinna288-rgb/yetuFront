import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SettingAdmin } from './setting-admin';

describe('SettingAdmin', () => {
  let component: SettingAdmin;
  let fixture: ComponentFixture<SettingAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingAdmin],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingAdmin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
