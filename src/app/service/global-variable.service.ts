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

  getIdPeriodeAktif() {
    return this.id_periodeAktif;
  }

  getTahunPeriode() {
    return this.tahun_periode;
  }

  getTahunPeriodeAktif() {
    return this.tahun_periodeAktif;
    
  }

  getBulanPeriode() {
    return this.bulan_periode;
  }

  getBulanPeriodeAktif() {
    return this.bulan_periodeAktif;
  }

  getNamaBulan() {
    if (this.bulan_periode === '1' || this.bulan_periodeAktif === '1') {
      this.nama_bulan = 'Januari'
    } else if (this.bulan_periode === '2' || this.bulan_periodeAktif === '2') {
      this.nama_bulan = 'Februari'
    } else if (this.bulan_periode === '3' || this.bulan_periodeAktif === '3') {
      this.nama_bulan = 'Maret'
    } else if (this.bulan_periode === '4' || this.bulan_periodeAktif === '4') {
      this.nama_bulan = 'April'
    } else if (this.bulan_periode === '5' || this.bulan_periodeAktif === '5') {
      this.nama_bulan = 'Mei'
    } else if (this.bulan_periode === '6' || this.bulan_periodeAktif === '6') {
      this.nama_bulan = 'Juni'
    } else if (this.bulan_periode === '7' || this.bulan_periodeAktif === '7') {
      this.nama_bulan = 'Juli'
    } else if (this.bulan_periode === '8' || this.bulan_periodeAktif === '8') {
      this.nama_bulan = 'Agustus'
    } else if (this.bulan_periode === '9' || this.bulan_periodeAktif === '9') {
      this.nama_bulan = 'September'
    } else if (this.bulan_periode === '10' || this.bulan_periodeAktif === '10') {
      this.nama_bulan = 'Oktober'
    } else if (this.bulan_periode === '11' || this.bulan_periodeAktif === '11') {
      this.nama_bulan = 'November'
    } else if (this.bulan_periode === '12' || this.bulan_periodeAktif === '12') {
      this.nama_bulan = 'Desember'
    }
    return this.nama_bulan;
  }

  setPeriode(ip, tp, bp) {
    this.id_periode = ip
    this.tahun_periode = tp
    this.bulan_periode = bp
    this.change_periode.next(ip)
  }

  periodeAktif(pa_id, pa_tahun, pa_bulan){
    this.id_periodeAktif = pa_id
    this.tahun_periodeAktif = pa_tahun
    this.bulan_periodeAktif = pa_bulan
    let res = {
      id_periode: pa_id,
      tahun_periode: pa_tahun,
      bulan_periode: pa_bulan
    }
    this.activePeriod.next(res)
  }
}
