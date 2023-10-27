import { Injectable } from '@angular/core';
import { AuthSetterService } from '../auth-setter.service';
import { HeaderSetterService } from '../header-setter.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthRequestService {

  // PT. SSI
  // baseURL = 'https://0556hoi3ob.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // SSI - DEVELOP
  baseURL = 'https://9idk4s2sjd.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // SSI - PRODUCTION

  // PT. MPS
  // baseURL = 'https://a2zynpc7te.execute-api.ap-southeast-1.amazonaws.com/dev/dctax' // MPS - DEVELOPMENT
  // baseURL = 'https://kv9zhs3sn6.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // MPS - PRODUCTION

  // PT. CMU
  // baseURL = 'https://sdscakc9e5.execute-api.ap-southeast-1.amazonaws.com/dev/dc' // CMU - DEVELOPMENT
  // baseURL = 'https://m46ps086ih.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // CMU - PRODUCTION

  // PT. LPM
  // baseURL = '' // LPM - DEVELOPMENT
  // baseURL = 'https://slcz3vdne7.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // LPM - PRODUCTION

  // PT. TWM
  // baseURL = '' // TWM - DEVELOPMENT
  // baseURL = 'https://9cmf80rbtk.execute-api.ap-southeast-1.amazonaws.com/pro/dc' // TWM - PRODUCTION

  httpBody = {
    respondCode: '',
    requestParam: '{}',
    authParam: JSON.stringify(this.authParam.auth)
  }

  options = {
    headers: this.httpHeader.httpHeader
  }

  constructor(
    private httpHeader: HeaderSetterService,
    private authParam: AuthSetterService,
    private http: HttpClient
  ) { }

  login(formData) {
    this.httpBody.respondCode = "LOGIN-ADMIN"
    this.httpBody.requestParam = JSON.stringify(formData)
    return this.http.post(this.baseURL + '1', this.httpBody, this.options)
  }

  //Temporary unused due to dynamic app
  validate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpBody.respondCode = "VALIDATE"
      this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
      this.http.post(this.baseURL, this.httpBody, { headers: this.httpHeader.getHeader() }).subscribe( //   <-- +'1'
        data => {
          if (data['STATUS'] === 'Y') { //   <-- Y'
            resolve(true)
          } else {
            window.parent.postMessage({
              'type': 'VALIDATE',
              'res': false
            }, '*')
            resolve(false)
          }
        }
      )
    })
  }

  manualValidation(token): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.httpBody.respondCode = "VALIDATE"
      this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
      this.http.post(this.baseURL, this.httpBody, { headers: this.httpHeader.getHeader(token) }).subscribe( //   <-- +'1'
        data => {
          if (data['STATUS'] === 'Y') { //   <-- Y'
            resolve(true)
          } else {
            window.parent.postMessage({
              'type': 'VALIDATE',
              'res': false
            }, '*')
            resolve(false)
          }
        }
      )
    })
  }
}