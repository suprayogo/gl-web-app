import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TemplateTransaksiRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-template') {
      httpBody.respondCode = 'GET-DATA-TEMPLATE-TRANSAKSI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-template-detail') {
      httpBody.respondCode = 'GET-DATA-DETAIL-TEMPLATE-TRANSAKSI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-template') {
      httpBody.respondCode = 'SET-DATA-TEMPLATE-TRANSAKSI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-template') {
      httpBody.respondCode = 'UPT-DATA-TEMPLATE-TRANSAKSI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-template') {
      httpBody.respondCode = 'DEL-DATA-TEMPLATE-TRANSAKSI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}