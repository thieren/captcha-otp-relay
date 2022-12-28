import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NorequestComponentComponent } from './components/norequest-component/norequest-component.component';
import { LoadingComponentComponent } from './components/loading-component/loading-component.component';
import { OtpComponentComponent } from './components/otp-component/otp-component.component';
import { CaptchaComponentComponent } from './components/captcha-component/captcha-component.component';

@NgModule({
  declarations: [
    AppComponent,
    NorequestComponentComponent,
    LoadingComponentComponent,
    OtpComponentComponent,
    CaptchaComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
