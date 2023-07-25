import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadhaarKycStatusComponent } from './aadhaar-kyc-status.component';

describe('AadhaarKycStatusComponent', () => {
  let component: AadhaarKycStatusComponent;
  let fixture: ComponentFixture<AadhaarKycStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadhaarKycStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadhaarKycStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
