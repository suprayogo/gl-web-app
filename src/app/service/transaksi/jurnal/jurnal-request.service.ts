import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JurnalRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-jurnal') {
      httpBody.respondCode = 'GET-DATA-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-jurnal-detail') {
      httpBody.respondCode = 'GET-DATA-JURNAL-DETAIL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-jurnal') {
      httpBody.respondCode = 'SET-DATA-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-jurnal') {
      httpBody.respondCode = 'UPT-DATA-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'c-jurnal') {
      httpBody.respondCode = 'CNL-DATA-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
