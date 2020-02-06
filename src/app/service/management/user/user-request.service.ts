import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-user') {
      httpBody.respondCode = 'GET-DATA-USER'
      return this.get(httpBody, options)
    } else if (data === 'g-user-aplikasi') {
      httpBody.respondCode = 'GET-DATA-USER-APLIKASI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-user') {
      httpBody.respondCode = 'SET-DATA-USER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-user') {
      httpBody.respondCode = 'UPT-DATA-USER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-user') {
      httpBody.respondCode = 'DEL-DATA-USER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}