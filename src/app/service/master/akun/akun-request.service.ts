import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AkunRequestService {

  url: string;

  constructor(private http: HttpClient) { }

  validate(data, httpBody, options, formData?: Object) {
    if (data === 'g-akun') {
      httpBody.respondCode = 'GET-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-akun-dc') {
      // this.url = 'https://cos140bjk1.execute-api.ap-southeast-1.amazonaws.com/dev/dc'
      this.url = 'https://cos140bjk1.execute-api.ap-southeast-1.amazonaws.com/test/dct'
      httpBody.respondCode = 'GET-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-akun-bisa-jadi-induk') {
      httpBody.respondCode = 'GET-DATA-AKUN-BISA-JADI-INDUK'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-saldo-akun') {
      httpBody.respondCode = 'GET-DATA-SALDO-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-saldo-awal-akun') {
      httpBody.respondCode = 'GET-DATA-SALDO-AWAL-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-saldo-awal-akun-cabang') {
      httpBody.respondCode = 'GET-DATA-SALDO-AWAL-AKUN-CABANG'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }else if (data === 'g-saldo-akun-aktif') {
      httpBody.respondCode = 'GET-DATA-AKUN-SALDO-SAAT-INI'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-akun') {
      httpBody.respondCode = 'SET-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-saldo-awal-akun') {
      httpBody.respondCode = 'SET-DATA-SALDO-AWAL-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-akun') {
      httpBody.respondCode = 'UPT-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-akun') {
      httpBody.respondCode = 'DEL-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
