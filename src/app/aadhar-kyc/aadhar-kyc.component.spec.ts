import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AadharKycComponent } from './aadhar-kyc.component';

describe('AadharKycComponent', () => {
  let component: AadharKycComponent;
  let fixture: ComponentFixture<AadharKycComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AadharKycComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AadharKycComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
