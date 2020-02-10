import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services

//Master Services
import { PerusahaanRequestService } from './master/perusahaan/perusahaan-request.service';
import { DivisiRequestService } from './master/divisi/divisi-request.service';

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
    private divisiReq: DivisiRequestService,

    //Setting Services

  ) {
  }

  setUrl(){
    this.lookupReq.url = this.baseURL

    //Management Services

    //Master Services
    this.perusahaanReq.url = this.baseURL
    this.divisiReq.url = this.baseURL

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
    }else if(type === 'divisi') {
      return this.divisiReq.validate(data, this.httpBody, this.options, formData)
    }
    
    //Setting Services
  }
}