import { Injectable } from '@angular/core';
import { AuthSetterService } from '../auth-setter.service';
import { HeaderSetterService } from '../header-setter.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthRequestService {

  // baseURL: string = 'https://1eniubnlpk.execute-api.us-east-1.amazonaws.com/dev/gl' //aris
  baseURL: string = 'https://6txd2ktbz6.execute-api.ap-southeast-1.amazonaws.com/dev/dc' //billy

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
      this.httpBody.respondCode = "VALIDATE"
      this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
      this.http.post(this.baseURL, this.httpBody, { headers: this.httpHeader.getHeader() }).subscribe( //   <-- +'1'
        data => {
          if (data['STATUS'] === 'Y') { //   <-- Y'
            resolve(true)
          } else {
            resolve(false)
          }
        }
      )
    })

  }
}