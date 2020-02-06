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

  baseURL = "https://1eniubnlpk.execute-api.us-east-1.amazonaws.com/dev/gl"

  constructor(
    //Variables
    private httpHeader: HeaderSetterService,
    private authParam: AuthSetterService,
    //Services
    private apiDataService: ApiDataService,
    private authService: AuthRequestService
  ) {
    this.apiDataService.baseURL = this.baseURL
    this.authService.baseURL = this.baseURL
  }

  apiData(type, data, formData?: Object) {
    this.httpBody.authParam = JSON.stringify(this.authParam.getAuth())
    this.options.headers = this.httpHeader.getHeader()
    this.apiDataService.httpBody = this.httpBody
    this.apiDataService.options = this.options
    return this.apiDataService.apiData(type, data, formData)
  }

  authenticate(type, formData): any{
    if(type === 'login'){
      return this.authService.login(formData)
    }else if(type === 'validate'){
      return this.authService.validate()
    }
  }
}