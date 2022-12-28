import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NorequestComponentComponent } from './components/norequest-component/norequest-component.component';
import { LoadingComponentComponent } from './components/loading-component/loading-component.component';
import { OtpComponentComponent } from './components/otp-component/otp-component.component';
import { CaptchaComponentComponent } from './components/captcha-component/captcha-component.component';

const routes: Routes = [
  { path: '', component: LoadingComponentComponent },
  { path: 'captcha', component: CaptchaComponentComponent },
  { path: 'norequest', component: NorequestComponentComponent },
  { path: 'otp', component: OtpComponentComponent },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
