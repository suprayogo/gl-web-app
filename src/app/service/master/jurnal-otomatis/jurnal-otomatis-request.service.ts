import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class JurnalOtomatisRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-setting-jurnal-otomatis') {
      httpBody.respondCode = 'GET-DATA-SETTING-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-setting-jurnal-otomatis-detail') {
      httpBody.respondCode = 'GET-DATA-SETTING-JURNAL-OTOMATIS-DETAIL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-setting-jurnal-otomatis') {
      httpBody.respondCode = 'SET-DATA-SETTING-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-setting-jurnal-otomatis') {
      httpBody.respondCode = 'UPT-DATA-SETTING-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-setting-jurnal-otomatis') {
      httpBody.respondCode = 'DEL-DATA-SETTING-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
