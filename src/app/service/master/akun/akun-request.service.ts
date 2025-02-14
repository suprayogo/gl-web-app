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
    } else if (data === 'g-akun-level') {
      httpBody.respondCode = 'GET-DATA-AKUN-BY-LEVEL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-akun-dc') {
      // PT. SSI
      this.url = 'https://0556hoi3ob.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // SSI - DEVELOP
      // this.url = 'https://9idk4s2sjd.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // SSI - PRODUCTION

      // PT. MPS
      // this.url = 'https://a2zynpc7te.execute-api.ap-southeast-1.amazonaws.com/dev/dctax' // MPS - DEVELOPMENT
      // this.url = 'https://kv9zhs3sn6.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // MPS - PRODUCTION

      // PT. CMU
      // this.url = 'https://sdscakc9e5.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // CMU - DEVELOPMENT
      // this.url = 'https://m46ps086ih.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // CMU - PRODUCTION

      // PT. LPM
      // this.url = '' // LPM - DEVELOPMENT
      // this.url = 'https://slcz3vdne7.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // LPM - PRODUCTION

      // PT. TWM
      // this.url = '' // TWM - DEVELOPMENT
      // this.url = 'https://9cmf80rbtk.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // TWM - PRODUCTION
      httpBody.respondCode = 'GET-DATA-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-kat-akun-dc') {
      // PT. SSI
      this.url = 'https://0556hoi3ob.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // SSI - DEVELOP
      // this.url = 'https://9idk4s2sjd.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // SSI - PRODUCTION

      // PT. MPS
      // this.url = 'https://a2zynpc7te.execute-api.ap-southeast-1.amazonaws.com/dev/dctax' // MPS - DEVELOPMENT
      // this.url = 'https://kv9zhs3sn6.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // MPS - PRODUCTION

      // PT. CMU
      // this.url = 'https://sdscakc9e5.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // CMU - DEVELOPMENT
      // this.url = 'https://m46ps086ih.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // CMU - PRODUCTION

      // PT. LPM
      // this.url = '' // LPM - DEVELOPMENT
      // this.url = 'https://slcz3vdne7.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // LPM - PRODUCTION

      // PT. TWM
      // this.url = '' // TWM - DEVELOPMENT
      // this.url = 'https://9cmf80rbtk.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // TWM - PRODUCTION
      httpBody.respondCode = 'GET-DATA-KATEGORI-AKUN'
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
    } else if (data === 'g-saldo-akun-aktif') {
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
    } else if (data === 'g-group-akun-user') {
      httpBody.respondCode = 'GET-DATA-GROUP-AKUN-BY-USER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-group-akun-header') {
      httpBody.respondCode = 'GET-DATA-GROUP-AKUN-HEADER'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-group-akun-detail') {
      httpBody.respondCode = 'GET-DATA-GROUP-AKUN-DETAIL'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'i-group-akun') {
      httpBody.respondCode = 'SET-DATA-GROUP-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'u-group-akun') {
      httpBody.respondCode = 'UPT-DATA-GROUP-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'd-group-akun') {
      httpBody.respondCode = 'DEL-DATA-GROUP-AKUN'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    } else if (data === 'g-jenis-tran-by-tipe') {
      httpBody.respondCode = 'GET-DATA-JENIS-TRANSAKSI-BY-TIPE'
      httpBody.requestParam = JSON.stringify(formData)
      return this.get(httpBody, options)
    }
  }

  get(httpBody, options) {
    return this.http.post(this.url, httpBody, options);
  }
}
