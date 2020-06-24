import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PengajuanBukaPeriodeKasirRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-pengajuan-buka') {
      httpBody.respondCode = 'GET-PENGAJUAN-BUKA-PERIODE-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
     } else if (data === 'g-detail-pengajuan-buka') {
      httpBody.respondCode = 'GET-DETAIL-PENGAJUAN-BUKA-PERIODE-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-pengajuan-buka') {
      httpBody.respondCode = 'SET-PENGAJUAN-BUKA-PERIODE-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-pengajuan-buka') {
      httpBody.respondCode = 'UPT-PENGAJUAN-BUKA-PERIODE-KASIR'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}