import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ServerService {

  private MAX_REQUEST_TIME = 10000;

  constructor(
    private http: HttpClient,
  ) { }

  public async closeServer(): Promise<void> {
    return new Promise((resolve, reject) => {
      const requestTimeout = setTimeout(() => { reject('unsuccessful request: close server'); }, this.MAX_REQUEST_TIME);

      this.http.get<any>('/closeServer').subscribe(result => {
        if (requestTimeout) {
          clearTimeout(requestTimeout);
        }
        resolve();
      });
    });
  }

  public async getCaptchaData(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const requestTimeout = setTimeout(() => { reject('unsuccessful request: get captcha data'); }, this.MAX_REQUEST_TIME);

      this.http.get<any>('/captchaData').subscribe(result => {
        if (requestTimeout) {
          clearTimeout(requestTimeout);
        }

        resolve(result.data);
      });
    });
  }

  public async getRequestType(): Promise<string | undefined> {
    return new Promise((resolve, reject) => {
      const requestTimeout = setTimeout(() => { reject('unsuccessful request: get request type'); }, this.MAX_REQUEST_TIME);

      this.http.get<any>('/requestType').subscribe(result => {
        if (requestTimeout) {
          clearTimeout(requestTimeout);
        }

        resolve(result.type);
      });
    });
  }
}
