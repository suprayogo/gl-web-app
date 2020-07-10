import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { HeaderSetterService } from '../../header-setter.service';

@Injectable({
  providedIn: 'root'
})
export class UtilitasRequestService {

  url: string;

  constructor(
    private http: HttpClient,
    private httpHeader: HeaderSetterService
  ) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'i-data-upload') {
      httpBody.respondCode = 'SET-DATA-UPLOAD'
      httpBody.requestParam = JSON.stringify(formData)
      let opt = {
        headers: this.httpHeader.getHeader()
      }
      opt.headers.set('timeout', `${300000}`)
      return this.get(httpBody, opt)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
