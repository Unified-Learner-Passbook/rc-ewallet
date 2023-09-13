import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';
import { AuthConfigService } from '../authentication/auth-config.service';
import { AuthService } from '../services/auth/auth.service';
import { DataService } from '../services/data/data-request.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { UtilService } from '../services/util/util.service';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  otp: any;
  today: string;
  isAadhaarVerified: boolean = false;
  aadhaarUUID: string;
  aadhaarToken: string;
  bsConfig: Partial<BsDatepickerConfig>;
  isDigilockerUser = false;

  registerModalRef: NgbModalRef;
  otpModalRef: NgbModalRef;
  @ViewChild('registerModal') registerModal: TemplateRef<any>;
  @ViewChild('otpModal') otpModal: TemplateRef<any>;

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'),]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    aadhaarId: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]),
    username: new FormControl('', [Validators.required]),
    recoveryPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')]),
  });
  constructor(
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService,
    private readonly toasterService: ToastMessageService,
    private readonly router: Router,
    private readonly modalService: NgbModal,
    private readonly authService: AuthService,
    private readonly utilService: UtilService,
    private readonly activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().slice(0, 10);
    this.bsConfig = {
      dateInputFormat: 'DD/MM/YYYY',
      showWeekNumbers: true,
      containerClass: 'theme-dark-blue',
      isAnimated: true,
      adaptivePosition: true,
      maxDate: new Date()
    };
    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.name) {
        this.isDigilockerUser = true;
      }
      this.registerForm.patchValue({
        name: params['name'],
        dob: params['dob'],
        gender: params['gender'],
        username: params['username'],
      });
      // Object.keys(params).forEach(field => {
      //   this.registerForm.get(field).readonly();
      // });
    });
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  verifyAadhaar() {
    if (!this.registerForm.value.aadhaarId || this.registerFormControl.aadhaarId.errors?.length) {
      this.toasterService.warning('', this.utilService.translateString('ENTER_VALID_AADHAAR_AND_REVERIFY'));
      return;
    }
    const payload = {
      aadhaar_id: this.registerForm.value.aadhaarId
    }

    this.authService.aadhaarKYC(payload).subscribe((res: any) => {
      if (res.success) {
        this.otpModalRef = this.modalService.open(this.otpModal, { size: 'sm' });
        this.aadhaarUUID = res.result.uuid;
      } else {
        this.isAadhaarVerified = false;
        this.aadhaarUUID = undefined;
        this.toasterService.warning('', this.utilService.translateString('ENTER_VALID_AADHAAR_AND_REVERIFY'));
      }
    });
  }

  closeOtpPopup() {
    this.otpModalRef.close();
  }

  submitOtp() {
    if (!this.otp) {
      this.toasterService.warning('', this.utilService.translateString('ENTER_VALID_OTP'));
      return;
    }
    this.otpModalRef.close();
    this.aadhaarToken = this.aadhaarUUID;
    this.isAadhaarVerified = true;
    this.registerForm.get('aadhaarId').disable();
  }

  onDOBValueChange(event) {
    if (dayjs(event).isValid()) {
      const formattedDate = dayjs(event).format('DD/MM/YYYY');
      this.registerForm.get('dob').setValue(formattedDate, { emitEvent: false });
      this.registerForm.patchValue({
        dob: formattedDate
      });
      console.log(this.registerForm);
    }
  }

  onSubmit() {
    if (!this.isAadhaarVerified || !this.aadhaarToken) {
      this.toasterService.warning('', this.utilService.translateString('VERIFY_AADHAAR_FIRST'));
      return;
    }

    if (this.registerForm.valid) {
      this.isLoading = true;
      const payload =
      {
        url: this.authConfigService.config.bffUrl + '/v1/learner/q1/register',
        data: {
          "name": this.registerForm.value.name,
          "dob": this.registerForm.value.dob,
          "gender": this.registerForm.value.gender,
          "recoveryphone": this.registerForm.value.recoveryPhone.toString(),
          "username": this.registerForm.value.username,
          "kyc_aadhaar_token": this.aadhaarToken
        }
      }

      this.dataService.post(payload).subscribe((result: any) => {
        console.log("User registered successfully");
        this.isLoading = false;
        const options: NgbModalOptions = {
          backdrop: 'static',
          animation: true,
          centered: true,
        };
        this.registerModalRef = this.modalService.open(this.registerModal, options);

        // setTimeout(() => {
        //   if (this.registerModalRef) {
        //     this.registerModalRef.dismiss();
        //   }
        // }, 2000);

        // this.registerModalRef.dismissed.subscribe((reason) => {
        //   console.log("reason", reason);

        //   const navigationExtras: NavigationExtras = {
        //     state: {
        //       name: this.registerForm.value.name,
        //       dob: dayjs(this.registerForm.value.dob).format('DD/MM/YYYY'),
        //       gender: this.registerForm.value.gender,
        //     }
        //   }
        //   this.router.navigate(['/aadhaar-kyc'], navigationExtras);
        // });
      }, (error: any) => {
        console.log("error", error);
        this.isLoading = false;
        const message = error?.error?.message ? error?.error?.message : this.utilService.translateString('REGISTRATION_FAILED_TRY_AGAIN');
        this.toasterService.error("", message);
      })
    }
  }

  gotoLoginPage() {
    this.registerModalRef.dismiss();
    this.router.navigate(['/login']);
  }
}
