import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services

//Master Services
import { PerusahaanRequestService } from './master/perusahaan/perusahaan-request.service';
import { MenuRequestService } from './master/menu/menu-request.service';
import { UserRequestService } from './master/user/user-request.service';

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

    //Master Services
    private perusahaanReq: PerusahaanRequestService,
    private menuReq: MenuRequestService,
    private userReq: UserRequestService

    //Setting Services

  ) {
  }

  setUrl(){
    this.lookupReq.url = this.baseURL

    //Management Services

    //Master Services
    this.perusahaanReq.url = this.baseURL
    this.menuReq.url = this.baseURL
    this.userReq.url = this.baseURL

    //Setting Services
  }

  apiData(type, data, formData?: Object) {
    this.setUrl()

    if (type === 'lookup') {
      return this.lookupReq.validate(data, this.httpBody, this.options, formData)
    }

    //Management Services

    //Master Services
    else if(type === 'perusahaan') {
      return this.perusahaanReq.validate(data, this.httpBody, this.options, formData)
    }else if(type === 'menu') {
      return this.menuReq.validate(data, this.httpBody, this.options, formData)
    }else if(type === 'user') {
      return this.userReq.validate(data, this.httpBody, this.options, formData)
    }
    
    //Setting Services
  }
}