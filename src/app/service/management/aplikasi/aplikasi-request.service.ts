import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AplikasiRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-aplikasi') {
      httpBody.respondCode = 'GET-DATA-APLIKASI'
      return this.get(httpBody, options)
    } else if (data === 'i-aplikasi') {
      httpBody.respondCode = 'SET-DATA-APLIKASI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-aplikasi') {
      httpBody.respondCode = 'UPT-DATA-APLIKASI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-aplikasi') {
      httpBody.respondCode = 'DEL-DATA-APLIKASI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}