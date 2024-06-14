import { Injectable } from '@angular/core';

//Variables
import { HeaderSetterService } from './header-setter.service';
import { AuthSetterService } from './auth-setter.service';

//All services
import { ApiDataService } from './api-data.service';
import { AuthRequestService } from './authentication/auth-request.service';

@Injectable({
  providedIn: 'root'
})
export class RequestDataService {

  httpBody = {
    respondCode: '',
    requestParam: '{}',
    authParam: JSON.stringify(this.authParam.auth)
  }

  options = {
    headers: this.httpHeader.httpHeader
  }

  // PT. SSI
  // baseURL = 'https://gb01rywky8.execute-api.ap-southeast-1.amazonaws.com/dev/gl' // SSI - DEVELOP

  baseURL = 'https://500e-180-241-44-181.ngrok-free.app/gl/api' // SSI - DEVELOP
  // baseURL = 'https://9xgrbckunf.execute-api.ap-southeast-1.amazonaws.com/pro/gl' // SSI - PRODUCTION
  // baseURL = 'https://gb01rywky8.execute-api.ap-southeast-1.amazonaws.com/dev/gl/api' // SSI - DEVELOP-TESTING
//  baseURL = 'https://5432-103-154-148-151.ngrok-free.app/dev/gl' // SSI - TESTING UNTUK SPRINGBOOT


  // PT. MPS, PT. CMU, PT. LPM, PT. TWM
  // baseURL = 'https://1n0pooc7rf.execute-api.ap-southeast-1.amazonaws.com/dev/gl' // (MPS, CMU, LPM, TWM) - DEVELOP
  // baseURL = 'https://sz1nahtisg.execute-api.ap-southeast-1.amazonaws.com/pro/gl' // (MPS, CMU, LPM, TWM) - PRODUCTION

  constructor(
    //Variables
    private httpHeader: HeaderSetterService,
    private authParam: AuthSetterService,
    //Services
    private apiDataService: ApiDataService,
    private authService: AuthRequestService
  ) {
    this.apiDataService.baseURL = this.baseURL
    // this.authService.baseURL = this.baseURL
  }

  apiData(type, data, formData?: Object) {
    this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
    this.options.headers = this.httpHeader.getHeader()
    this.apiDataService.httpBody = this.httpBody
    this.apiDataService.options = this.options
    return this.apiDataService.apiData(type, data, formData)
  }

  authenticate(type, formData): any {
    if (type === 'login') {
      return this.authService.login(formData)
    } else if (type === 'validate') {
      return this.authService.validate()
    }
  }
}