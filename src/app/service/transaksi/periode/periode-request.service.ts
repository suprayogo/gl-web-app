import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PeriodeRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-periode') {
      httpBody.respondCode = 'GET-DATA-PERIODE'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-tutup-periode') {
      httpBody.respondCode = 'SET-TUTUP-PERIODE'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}