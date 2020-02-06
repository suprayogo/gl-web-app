import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services
import { AplikasiRequestService } from './management/aplikasi/aplikasi-request.service';
import { UserRequestService } from './management/user/user-request.service';

//Master Services

//Setting Services

//Transaksi Services

@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  baseURL: string = null;
  httpBody: any = null;
  options: any = null;

  constructor(
    private lookupReq: LookupRequestService,

    //Management Service
    private aplikasiReq: AplikasiRequestService,
    private UserReq: UserRequestService,

    //Master Services

    //Setting Services

  ) {
  }

  setUrl(){
    this.lookupReq.url = this.baseURL

    //Managerment Services
    this.aplikasiReq.url = this.baseURL
    this.UserReq.url = this.baseURL

    //Master Services

    //Setting Services
  }

  apiData(type, data, formData?: Object) {
    this.setUrl()

    if (type === 'lookup') {
      return this.lookupReq.validate(data, this.httpBody, this.options, formData)
    }

    //Management Services
    else if (type === 'aplikasi') {
      return this.aplikasiReq.validate(data, this.httpBody, this.options, formData)
    }else if(type === 'user') {
      return this.UserReq.validate(data, this.httpBody, this.options, formData)
    }

    //Master Services
    
    //Setting Services
  }
}