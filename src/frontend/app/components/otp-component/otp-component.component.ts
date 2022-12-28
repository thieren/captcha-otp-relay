import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-otp-component',
  templateUrl: './otp-component.component.html',
  styles: [
  ]
})
export class OtpComponentComponent implements OnInit {

  constructor(
  ) {}

  ngOnInit(): void {

  }

  otpIsValid = true;
  otp = "";
}
