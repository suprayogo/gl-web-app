import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class LookupRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object){
    if (data === 'g-lookup') {
      httpBody.respondCode = 'GET-DATA-LOOKUP'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-info-company') {
      httpBody.respondCode = 'GET-DATA-LOOKUP-INFO-COMPANY'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-setting-keterangan') {
      httpBody.respondCode = 'GET-DATA-LOOKUP-STATUS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-start-set-saldo') {
      httpBody.respondCode = 'GET-DATA-START-PENGGUNAAN-APP'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}