import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services
import { MenuRequestService } from './management/menu/menu-request.service';
import { OtoritasRequestService } from './management/otoritas/otoritas-request.service';
import { UserRequestService } from './management/user/user-request.service';
import { PerusahaanRequestService } from './management/perusahaan/perusahaan-request.service';

//Master Services
import { DivisiRequestService } from './master/divisi/divisi-request.service';
import { DepartemenRequestService } from './master/departemen/departemen-request.service';
import { KategoriAkunRequestService } from './master/kategori-akun/kategori-akun-request.service';
import { AkunRequestService } from './master/akun/akun-request.service';
import { BankRequestService } from './master/bank/bank-request.service';
import { JenisTransaksiRequestService } from './master/jenis-transaksi/jenis-transaksi-request.service';
import { KontakRequestService } from './master/kontak/kontak-request.service';

//Setting Services

//Transaksi Services
import { JurnalRequestService } from './transaksi/jurnal/jurnal-request.service';

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
    private menuReq: MenuRequestService,
    private otoritasReq: OtoritasRequestService,
    private perusahaanReq: PerusahaanRequestService,
    private userReq: UserRequestService,

    //Master Services
    private divisiReq: DivisiRequestService,
    private departemenReq: DepartemenRequestService,
    private akunReq: AkunRequestService,
    private bankReq: BankRequestService,
    private kategoriAkunReq: KategoriAkunRequestService,
    private jenisTransaksiReq: JenisTransaksiRequestService,
    private kontakReq: KontakRequestService,

    //Setting Services

    //Transaksi Services
    private jurnalReq: JurnalRequestService
  ) {
  }

  setUrl() {
    this.lookupReq.url = this.baseURL

    //Management Services
    this.menuReq.url = this.baseURL
    this.otoritasReq.url = this.baseURL
    this.perusahaanReq.url = this.baseURL
    this.userReq.url = this.baseURL

    //Master Services
    this.divisiReq.url = this.baseURL
    this.departemenReq.url = this.baseURL
    this.otoritasReq.url = this.baseURL
    this.akunReq.url = this.baseURL
    this.kategoriAkunReq.url = this.baseURL
    this.bankReq.url = this.baseURL
    this.kategoriAkunReq.url = this.baseURL
    this.jenisTransaksiReq.url = this.baseURL
    this.kontakReq.url = this.baseURL

    //Setting Services

    //Transaksi Services
    this.jurnalReq.url = this.baseURL
  }

  apiData(type, data, formData?: Object) {
    this.setUrl()

    if (type === 'lookup') {
      return this.lookupReq.validate(data, this.httpBody, this.options, formData)
    }

    //Management Services
    else if (type === 'menu') {
      return this.menuReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'otoritas') {
      return this.otoritasReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'user') {
      return this.userReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'perusahaan') {
      return this.perusahaanReq.validate(data, this.httpBody, this.options, formData)
    }

    //Master Services
    else if (type === 'divisi') {
      return this.divisiReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'departemen') {
      return this.departemenReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'user') {
      return this.userReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'akun') {
      return this.akunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kategori-akun') {
      return this.kategoriAkunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'bank') {
      return this.bankReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kategori-akun') {
      return this.kategoriAkunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'jenis-transaksi') {
      return this.jenisTransaksiReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kontak') {
      return this.kontakReq.validate(data, this.httpBody, this.options, formData)
    }

    //Setting Services

    //Transaksi Services
    else if (type === 'jurnal') {
      return this.jurnalReq.validate(data, this.httpBody, this.options, formData)
    }
  }
}