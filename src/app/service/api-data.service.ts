import { Injectable } from '@angular/core';

import { LookupRequestService } from './master/lookup/lookup-request.service';

//Management Services
import { OtoritasRequestService } from './management/otoritas/otoritas-request.service';

//Master Services
import { BankRequestService } from './master/bank/bank-request.service';
import { CabangRequestService } from './master/cabang/cabang-request.service';
import { DivisiRequestService } from './master/divisi/divisi-request.service';
import { DepartemenRequestService } from './master/departemen/departemen-request.service';
import { RekeningPerusahaanRequestService } from './master/rekening-perusahaan/rekening-perusahaan-request.service';
import { KategoriAkunRequestService } from './master/kategori-akun/kategori-akun-request.service';
import { AkunRequestService } from './master/akun/akun-request.service';
import { JenisTransaksiRequestService } from './master/jenis-transaksi/jenis-transaksi-request.service';
import { SettingLaporanRequestService } from './master/setting-laporan/setting-laporan-request.service';
import { JurnalOtomatisRequestService } from './master/jurnal-otomatis/jurnal-otomatis-request.service';
import { SettingLinkRequestService } from './master/setting-link/setting-link-request.service';
import { WorklistRequestService } from './master/worklist/worklist-request.service';

//Transaksi Services
import { JurnalRequestService } from './transaksi/jurnal/jurnal-request.service';
import { PostingJurnalRequestService } from './transaksi/posting-jurnal/posting-jurnal-request.service';
import { PeriodeRequestService } from './transaksi/periode/periode-request.service';
import { UserRequestService } from './management/user/user-request.service';
import { ReportRequestService } from './master/report/report-request.service';
import { KasirRequestService } from './master/kasir/kasir-request.service';
import { PengajuanBukaPeriodeKasirRequestService } from './transaksi/pengajuan-buka-periode-kasir/pengajuan-buka-periode-kasir-request.service';
import { UtilitasRequestService } from './master/utilitas/utilitas-request.service';
import { TemplateTransaksiRequestService } from './master/template-transaksi/template-transaksi-request.service';

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
    private cabangReq: CabangRequestService,
    private divisiReq: DivisiRequestService,
    private departemenReq: DepartemenRequestService,
    private rekeningPerusahaanReq: RekeningPerusahaanRequestService,
    private kategoriAkunReq: KategoriAkunRequestService,
    private akunReq: AkunRequestService,
    private jenisTransaksiReq: JenisTransaksiRequestService,
    private settingLaporanReq: SettingLaporanRequestService,
    private jurnalOtomatisReq: JurnalOtomatisRequestService,
    private settingLinkReq: SettingLinkRequestService,
    private reportReq: ReportRequestService,
    private kasirReq: KasirRequestService,
    private utilitasReq: UtilitasRequestService,
    private worklistReq: WorklistRequestService,
    private templateReq: TemplateTransaksiRequestService,

    //Transaksi Services
    private postingJurnalReq: PostingJurnalRequestService,
    private periodeReq: PeriodeRequestService,
    private jurnalReq: JurnalRequestService,
    private pengajuanBukaReq: PengajuanBukaPeriodeKasirRequestService
  ) {
  }


  setUrl() {
    this.lookupReq.url = this.baseURL

    //Management Services
    this.otoritasReq.url = this.baseURL
    this.userReq.url = this.baseURL

    //Master Services
    this.bankReq.url = this.baseURL
    this.cabangReq.url = this.baseURL
    this.divisiReq.url = this.baseURL
    this.departemenReq.url = this.baseURL
    this.rekeningPerusahaanReq.url = this.baseURL
    this.kategoriAkunReq.url = this.baseURL
    this.akunReq.url = this.baseURL
    this.jenisTransaksiReq.url = this.baseURL
    this.settingLinkReq.url = this.baseURL
    this.reportReq.url = this.baseURL
    this.kasirReq.url = this.baseURL
    this.worklistReq.url = this.baseURL
    this.templateReq.url = this.baseURL

    //Setting Services
    this.settingLaporanReq.url = this.baseURL
    this.jurnalOtomatisReq.url = this.baseURL
    this.utilitasReq.url = this.baseURL


    //Transaksi Services
    this.jurnalReq.url = this.baseURL

    //Transaksi Services
    this.postingJurnalReq.url = this.baseURL
    this.periodeReq.url = this.baseURL
    this.pengajuanBukaReq.url = this.baseURL
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
    } else if (type === 'cabang') {
      return this.cabangReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'divisi') {
      return this.divisiReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'departemen') {
      return this.departemenReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'rekening-perusahaan') {
      return this.rekeningPerusahaanReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kategori-akun') {
      return this.kategoriAkunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'akun') {
      return this.akunReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'jenis-transaksi') {
      return this.jenisTransaksiReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'setting-link') {
      return this.settingLinkReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'report') {
      return this.reportReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'kasir') {
      return this.kasirReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'utilitas') {
      return this.utilitasReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'worklist') {
      return this.worklistReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'template') {
      return this.templateReq.validate(data, this.httpBody, this.options, formData)
    }

    //Setting Services 
    else if (type === 'setting-laporan') {
      return this.settingLaporanReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'jurnal-otomatis') {
      return this.jurnalOtomatisReq.validate(data, this.httpBody, this.options, formData)
    }

    //Transaksi Services
    else if (type === 'jurnal') {
      return this.jurnalReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'posting-jurnal') {
      return this.postingJurnalReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'periode') {
      return this.periodeReq.validate(data, this.httpBody, this.options, formData)
    } else if (type === 'pengajuan') {
      return this.pengajuanBukaReq.validate(data, this.httpBody, this.options, formData)
    }
  }
}