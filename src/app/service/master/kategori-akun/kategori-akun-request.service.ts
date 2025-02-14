import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class KategoriAkunRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-kategori-akun') {
      httpBody.respondCode = 'GET-DATA-KATEGORI-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-kategori-akun') {
      httpBody.respondCode = 'SET-DATA-KATEGORI-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-kategori-akun') {
      httpBody.respondCode = 'UPT-DATA-KATEGORI-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-kategori-akun') {
      httpBody.respondCode = 'DEL-DATA-KATEGORI-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
