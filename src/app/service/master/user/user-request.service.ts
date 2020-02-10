import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-perusahaan') {
      httpBody.respondCode = 'GET-DATA-PERUSAHAAN'
      return this.get(httpBody, options)
    } else if (data === 'i-perusahaan') {
      httpBody.respondCode = 'SET-DATA-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-perusahaan') {
      httpBody.respondCode = 'UPT-DATA-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-perusahaan') {
      httpBody.respondCode = 'DEL-DATA-PERUSAHAAN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
