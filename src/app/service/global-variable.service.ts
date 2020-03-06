import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  // PERUSAHAAN
  kode_perusahaan: string = "";
  nama_perusahaan: string = "";
  change: Subject<any> = new Subject<any>();

  // PERIODE
  id_periode: string = "";
  tahun_periode: string = "";
  bulan_periode: string = "";
  nama_bulan: string = "";
  change_periode: Subject<any> = new Subject<any>();

  id_periodeAktif: string = "";
  tahun_periodeAktif: string = "";
  bulan_periodeAktif: string = "";
  nama_bulan_aktif: string = "";
  activePeriod: Subject<any> = new Subject<any>();


  constructor() { }

  // PERUSAHAAN
  getNamaPerusahaan() {
    return this.nama_perusahaan;
  }

  getKodePerusahaan() {
    return this.kode_perusahaan;
  }

  setPerusahaan(k, v) {
    this.kode_perusahaan = k
    this.nama_perusahaan = v
    this.change.next(k)
  }

  // PERIODE
  getIdPeriode() {
    return this.id_periode;
  }

  getTahunPeriode() {
    return this.tahun_periode;
  }

  getBulanPeriode() {
    return this.bulan_periode;
  }

  getAccessPeriod(){
    return {
      id_periode: this.getIdPeriode(),
      tahun_periode: this.getTahunPeriode(),
      bulan_periode: this.getBulanPeriode()
    }
  }

  // PERIODE AKTIF
  getIdPeriodeAktif() {
    return this.id_periodeAktif;
  }

  getTahunPeriodeAktif() {
    return this.tahun_periodeAktif;
  }

  getBulanPeriodeAktif() {
    return this.bulan_periodeAktif;
  }

  getActive(){
    return {
      id_periode: this.getIdPeriodeAktif(),
      tahun_periode: this.getTahunPeriodeAktif(),
      bulan_periode: this.getBulanPeriodeAktif(),
      nama_bulan_periode: this.getNamaBulanAktif(this.nama_bulan_aktif)
    }
  }

  getNamaBulan(month_name) {
    if (month_name === '1') {
      this.nama_bulan = 'Januari'
    } else if (month_name === '2') {
      this.nama_bulan = 'Februari'
    } else if (month_name === '3') {
      this.nama_bulan = 'Maret'
    } else if (month_name === '4') {
      this.nama_bulan = 'April'
    } else if (month_name === '5') {
      this.nama_bulan = 'Mei'
    } else if (month_name === '6') {
      this.nama_bulan = 'Juni'
    } else if (month_name === '7') {
      this.nama_bulan = 'Juli'
    } else if (month_name === '8') {
      this.nama_bulan = 'Agustus'
    } else if (month_name === '9') {
      this.nama_bulan = 'September'
    } else if (month_name === '10') {
      this.nama_bulan = 'Oktober'
    } else if (month_name === '11') {
      this.nama_bulan = 'November'
    } else if (month_name === '12') {
      this.nama_bulan = 'Desember'
    }
    return this.nama_bulan;
  }

  getNamaBulanAktif(month_name_aktif) {
    if (month_name_aktif === '1') {
      this.nama_bulan_aktif = 'Januari'
    } else if (month_name_aktif === '2') {
      this.nama_bulan_aktif = 'Februari'
    } else if (month_name_aktif === '3') {
      this.nama_bulan_aktif = 'Maret'
    } else if (month_name_aktif === '4') {
      this.nama_bulan_aktif = 'April'
    } else if (month_name_aktif === '5') {
      this.nama_bulan_aktif = 'Mei'
    } else if (month_name_aktif === '6') {
      this.nama_bulan_aktif = 'Juni'
    } else if (month_name_aktif === '7') {
      this.nama_bulan_aktif = 'Juli'
    } else if (month_name_aktif === '8') {
      this.nama_bulan_aktif = 'Agustus'
    } else if (month_name_aktif === '9') {
      this.nama_bulan_aktif = 'September'
    } else if (month_name_aktif === '10') {
      this.nama_bulan_aktif = 'Oktober'
    } else if (month_name_aktif === '11') {
      this.nama_bulan_aktif = 'November'
    } else if (month_name_aktif === '12') {
      this.nama_bulan_aktif = 'Desember'
    }
    this.periodeAktif(this.id_periodeAktif,this.tahun_periodeAktif,this.bulan_periodeAktif,this.nama_bulan_aktif)
    return this.nama_bulan_aktif;
  }

  setPeriode(ip, tp, bp) {
    this.id_periode = ip
    this.tahun_periode = tp
    this.bulan_periode = bp
    let d = {
      id_periode: this.id_periode,
      tahun_periode: this.tahun_periode,
      bulan_periode: this.bulan_periode
    }
    this.change_periode.next(d)
  }

  periodeAktif(pa_id, pa_tahun, pa_bulan, pa_nama_bulan_aktif){
    this.id_periodeAktif = pa_id
    this.tahun_periodeAktif = pa_tahun
    this.bulan_periodeAktif = pa_bulan
    let res = {
      id_periode: pa_id,
      tahun_periode: pa_tahun,
      bulan_periode: pa_bulan,
      nama_bulan_periode: pa_nama_bulan_aktif
    }
    this.activePeriod.next(res)
  }
}
