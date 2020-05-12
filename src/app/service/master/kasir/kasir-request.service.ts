import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KasirRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-kasir') {
      httpBody.respondCode = 'GET-DATA-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-kasir') {
      httpBody.respondCode = 'SET-DATA-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-kasir') {
      httpBody.respondCode = 'UPT-DATA-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-kasir') {
      httpBody.respondCode = 'DEL-DATA-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-saldo-kasir') {
      httpBody.respondCode = 'GET-DATA-SALDO-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-saldo-awal-kasir') {
      httpBody.respondCode = 'GET-DATA-SALDO-AWAL-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-saldo-awal-kasir') {
      httpBody.respondCode = 'SET-DATA-SALDO-AWAL-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
