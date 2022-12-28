import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { ServerService } from '../../server.service';

@Component({
  selector: 'app-loading-component',
  templateUrl: './loading-component.component.html',
  styles: [
  ]
})
export class LoadingComponentComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private router: Router,
    private serverService: ServerService
  ) {}

  ngOnInit(): void {
    this.loadRequest();
  }

  private async loadRequest() {
    const type = await this.serverService.getRequestType();
    switch (type) {
      case 'otp':
        this.router.navigate(['/otp']);
        break;
      case 'captcha':
        this.router.navigate(['/captcha']);
        break;
      default:
        this.router.navigate(['/norequest']);
        break;
    }
  }
}
