import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-aadhaar-kyc-status',
  templateUrl: './aadhaar-kyc-status.component.html',
  styleUrls: ['./aadhaar-kyc-status.component.scss']
})
export class AadhaarKycStatusComponent implements OnInit {

  @Input() isVerified: boolean;
  @Output() tryAgain = new EventEmitter();
  constructor(
    private readonly router: Router
  ) { }

  ngOnInit(): void { }

  emitTryAgain() {
    this.tryAgain.emit();
  }
}
