import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DataService } from '../services/data/data-request.service';
import { AuthConfigService } from '../authentication/auth-config.service';
import { ToastMessageService } from '../services/toast-message/toast-message.service';
import { NavigationExtras, Router } from '@angular/router';
import { NgbModal, NgbModalOptions, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import * as dayjs from 'dayjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  isLoading: boolean = false;
  registerModalRef: NgbModalRef;
  @ViewChild('registerModal') registerModal: TemplateRef<any>;
  today: string;



  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z ]*'),]),
    dob: new FormControl('', [Validators.required]),
    gender: new FormControl('', [Validators.required]),
    // aadharId: new FormControl('', [Validators.required, Validators.minLength(12), Validators.maxLength(12), Validators.pattern('^[0-9]*$')]),
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    recoveryPhone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{10}$')])
  });
  constructor(
    private readonly dataService: DataService,
    private readonly authConfigService: AuthConfigService,
    private readonly toasterService: ToastMessageService,
    private readonly router: Router,
    private readonly modalService: NgbModal
  ) { }

  ngOnInit(): void {
    this.today = new Date().toISOString().slice(0, 10);

      // setTimeout(() => {
      //   this.registerModalRef = this.modalService.open(this.registerModal);
      // }, 200);
  }

  get registerFormControl() {
    return this.registerForm.controls;
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading = true;

      const payload =
      {
        url: this.authConfigService.config.bffUrl + '/v1/sso/learner/register',
        data: {
          // "aadhar_id": this.registerForm.value.aadharId,
          "name": this.registerForm.value.name,
          "gender": this.registerForm.value.gender,
          "dob": dayjs(this.registerForm.value.dob).format('DD/MM/YYYY'),
          "username": this.registerForm.value.username,
          "password": this.registerForm.value.password,
          "recoveryphone": this.registerForm.value.recoveryPhone.toString()
        }
      }

      this.dataService.post(payload).subscribe((result: any) => {
        console.log("User registered successfully");
        this.isLoading = false;
        const options: NgbModalOptions = {
          // backdrop: 'static',
          animation: true,
          centered: true,
        };
        this.registerModalRef = this.modalService.open(this.registerModal, options);

        setTimeout(() => {
          if (this.registerModalRef) {
            this.registerModalRef.dismiss();
          }
        }, 2000);

        this.registerModalRef.dismissed.subscribe((reason) => {
          console.log("reason", reason);

          const navigationExtras: NavigationExtras = {
            state: {
              name: this.registerForm.value.name,
              dob: dayjs(this.registerForm.value.dob).format('DD/MM/YYYY'),
              gender: this.registerForm.value.gender,
            }
          }
          this.router.navigate(['/aadhaar-kyc'], navigationExtras);
        });
        // this.toasterService.success("", "User registered successfully");
      }, (error: any) => {
        console.log("error", error);
        this.isLoading = false;
        const message = error?.error?.message ? error?.error?.message : "User registration failed! Please try again";
        this.toasterService.error("", message);
      })
    }
  }

  gotoLoginPage() {
    this.registerModalRef.dismiss();
    this.router.navigate(['/login']);
  }
}
