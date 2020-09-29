import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderSetterService } from '../../header-setter.service';

@Injectable({
  providedIn: 'root'
})
export class JurnalOtomatisRequestService {

  url: string;

  constructor(
    private http: HttpClient,
    private httpHeader: HeaderSetterService
  ) { }

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
    } else if (data === 'g-tarik-data-terakhir') {
      httpBody.respondCode = 'GET-DATA-RIWAYAT-TARIK-JURNAL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-data-jurnal-otomatis') {
      httpBody.respondCode = 'GET-DATA-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      let opt = {
        headers: this.httpHeader.getHeader()
      }
      opt.headers.set('timeout', `${10000}`)
      return this.get(httpBody, options)
    } else if (data === 'i-jurnal-otomatis') {
      httpBody.respondCode = 'SET-DATA-JURNAL-OTOMATIS'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
