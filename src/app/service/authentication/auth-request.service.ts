import { Injectable } from '@angular/core';
import { AuthSetterService } from '../auth-setter.service';
import { HeaderSetterService } from '../header-setter.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthRequestService {

  // baseURL: string = 'https://1eniubnlpk.execute-api.us-east-1.amazonaws.com/dev/gl'
  baseURL: string = 'https://5kon67neqa.execute-api.us-east-1.amazonaws.com/dev/gl'

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

  validate(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      // this.httpBody.respondCode = "VALIDATE1"
      // this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
      // this.http.post(this.baseURL, this.httpBody, { headers: this.httpHeader.getHeader() }).subscribe( //   <-- +'1'
      //   data => {
      //     if (data['STATUS'] === 'N') { //   <-- Y'

      //       /* this.httpBody.respondCode = "VALIDATE"
      //       this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
      //       this.httpBody.requestParam = JSON.stringify({ kode_aplikasi: '001' })
      //       this.http.post(this.baseURL, this.httpBody, { headers: this.httpHeader.getHeader() }).subscribe(
      //         vdata => {
      //           if (vdata['STATUS'] === 'Y') {
      //             resolve(true)
      //           } else {
      //             resolve(false)
      //           }
      //         }
      //       ) */
      //       resolve(true)
      //     } else {
      //       resolve(false)
      //     }
      //   }
      // )
      resolve(true)
    })

  }
}