import { Component, OnInit } from '@angular/core';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-captcha-component',
  templateUrl: './captcha-component.component.html',
  styles: [
  ]
})
export class CaptchaComponentComponent implements OnInit {

  captchaImageData = "";

  constructor(
    private serverService: ServerService,
  ) { }

  ngOnInit(): void {
    this.loadCaptchaData();  
  }

  private async loadCaptchaData() {
    const captchaData = await this.serverService.getCaptchaData();

    if (captchaData) {
      this.captchaImageData = captchaData;
    }
  }
}
