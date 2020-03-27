import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SettingLinkRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-setting-link-tarik-data') {
      httpBody.respondCode = 'GET-DATA-SETTING-LINK-PENARIKAN-DATA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-setting-link-tarik-data') {
      httpBody.respondCode = 'SET-DATA-SETTING-LINK-PENARIKAN-DATA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-setting-link-tarik-data') {
      httpBody.respondCode = 'UPT-DATA-SETTING-LINK-PENARIKAN-DATA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-setting-link-tarik-data') {
      httpBody.respondCode = 'DEL-DATA-SETTING-LINK-PENARIKAN-DATA'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}