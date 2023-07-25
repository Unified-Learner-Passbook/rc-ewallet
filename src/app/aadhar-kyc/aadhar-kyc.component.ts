import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { error } from 'console';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-aadhar-kyc',
  templateUrl: './aadhar-kyc.component.html',
  styleUrls: ['./aadhar-kyc.component.scss']
})
export class AadharKycComponent implements OnInit {
  showForm = false;
  isGetOTPClicked = false
  showKYCStatus = false;
  isAadhaarVerified: boolean;
  state: any;


  aadhaarFormControl = new FormControl('', [Validators.required]);
  otpFormControl = new FormControl('', [Validators.required, Validators.pattern('^[0-9]{4}$')]);

  @ViewChild("otpModel") otpModel: ElementRef;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.state = { ...navigation.extras.state };

    if (!Object.keys(this.state).length) {
      if (this.authService.isLoggedIn) {
        this.router.navigate(['/home']);
      } else {
        this.router.navigate(['/login']);
      }
    }
  }

  ngOnInit(): void {
  }

  getOTP() {
    this.isGetOTPClicked = true;
  }

  submitOTP() {
    const payload = {
      "aadhaar_id": this.aadhaarFormControl.value.toString(),
      "aadhaar_name": this.state.name,
      "aadhaar_gender": this.state.gender,
      "aadhaar_dob": this.state.dob
    }
    this.authService.aadhaarKYC(payload).subscribe((res: any) => {
      this.showKYCStatus = true;
      this.isAadhaarVerified = true;
    }, (error) => {
      this.showKYCStatus = true;
      this.isAadhaarVerified = false;
    });
  }

  startKYC() {
    this.showForm = true;
  }

}
