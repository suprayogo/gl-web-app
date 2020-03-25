import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services
import { OtoritasRequestService } from './management/otoritas/otoritas-request.service';

//Master Services
import { BankRequestService } from './master/bank/bank-request.service';
import { RekeningPerusahaanRequestService } from './master/rekening-perusahaan/rekening-perusahaan-request.service';
import { KategoriAkunRequestService } from './master/kategori-akun/kategori-akun-request.service';
import { AkunRequestService } from './master/akun/akun-request.service';
import { JenisTransaksiRequestService } from './master/jenis-transaksi/jenis-transaksi-request.service';


//Transaksi Services
import { JurnalRequestService } from './transaksi/jurnal/jurnal-request.service';
import { PostingJurnalRequestService } from './transaksi/posting-jurnal/posting-jurnal-request.service';
import { PeriodeRequestService } from './transaksi/periode/periode-request.service';
import { UserRequestService } from './management/user/user-request.service';
import { SettingLaporanRequestService } from './master/setting-laporan/setting-laporan-request.service';

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
    private otoritasReq: OtoritasRequestService,
    private userReq: UserRequestService,

    //Master Services
    private bankReq: BankRequestService,
    private rekeningPerusahaanReq: RekeningPerusahaanRequestService,
    private kategoriAkunReq: KategoriAkunRequestService,
    private akunReq: AkunRequestService,
    private jenisTransaksiReq: JenisTransaksiRequestService,
    private settingLaporanReq: SettingLaporanRequestService,
    
    //Transaksi Services
    private postingJurnalReq: PostingJurnalRequestService,
    private periodeReq: PeriodeRequestService,


    //Transaksi Services
    private jurnalReq: JurnalRequestService
  ) {
  }

  setUrl() {
    this.lookupReq.url = this.baseURL

    //Management Services
    this.otoritasReq.url = this.baseURL
    this.userReq.url = this.baseURL

    //Master Services
    this.bankReq.url = this.baseURL
    this.rekeningPerusahaanReq.url = this.baseURL
    this.kategoriAkunReq.url = this.baseURL
    this.akunReq.url = this.baseURL
    this.jenisTransaksiReq.url = this.baseURL
    this.settingLaporanReq.url = this.baseURL

    //Setting Services

    //Transaksi Services
    this.jurnalReq.url = this.baseURL

    //Transaksi Services
    this.postingJurnalReq.url = this.baseURL
    this.periodeReq.url = this.baseURL
  }

  apiData(type, data, formData?: Object) {
    this.setUrl()

    if (type === 'lookup') {
      return this.lookupReq.validate(data, this.httpBody, this.options, formData)
    }

    //Management Services
    else if (type === 'otoritas') {
      return this.otoritasReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'user') {
      return this.userReq.validate(data, this.httpBody, this.options, formData)
    }

    //Master Services
    else if (type === 'bank') {
      return this.bankReq.validate(data, this.httpBody, this.options, formData)
    } else if(type === 'rekening-perusahaan') {
      return this.rekeningPerusahaanReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kategori-akun') {
      return this.kategoriAkunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'akun') {
      return this.akunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'jenis-transaksi') {
      return this.jenisTransaksiReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'setting-laporan') {
      return this.settingLaporanReq.validate(data, this.httpBody, this.options, formData)
    }

    //Setting Services

    //Transaksi Services
    else if (type === 'jurnal') {
      return this.jurnalReq.validate(data, this.httpBody, this.options, formData)
    } else if(type === 'posting-jurnal') {
      return this.postingJurnalReq.validate(data, this.httpBody, this.options, formData)
    } else if(type === 'periode') {
      return this.periodeReq.validate(data, this.httpBody, this.options, formData)
    }
  }
}