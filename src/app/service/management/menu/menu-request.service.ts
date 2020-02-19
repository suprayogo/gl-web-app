import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class MenuRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-menu') {
      httpBody.respondCode = 'GET-DATA-MENU'
      return this.get(httpBody, options)
    } else if (data === 'i-menu') {
      httpBody.respondCode = 'SET-DATA-MENU'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-menu') {
      httpBody.respondCode = 'UPT-DATA-MENU'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-menu') {
      httpBody.respondCode = 'DEL-DATA-MENU'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
