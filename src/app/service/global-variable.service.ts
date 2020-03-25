import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  //Access Key
  access_key = "bcad52ed12a9176fdc653ca776293fc8";
  //Token
  token: string = "";
  user_id: string = "";

  // PERUSAHAAN
  kode_perusahaan: string = "";
  nama_perusahaan: string = "";
  change: Subject<any> = new Subject<any>();

  // PERIODE
  id_periode: string = "";
  tahun_periode: string = "";
  bulan_periode: string = "";
  change_periode: Subject<any> = new Subject<any>();

  id_periodeAktif: string = "";
  tahun_periodeAktif: string = "";
  bulan_periodeAktif: string = "";
  activePeriod: Subject<any> = new Subject<any>();


  constructor() { }

  // ACCESS KEY
  getAccessKey() {
    return this.access_key
  }
  
  // TOP PAGE
  topPage(){
    window.parent.postMessage({
      'type': 'TOP-PAGE',
      'res': true
    }, "*")
  }

  // NEED PERUSAHAAN
  needCompany(need){
    window.parent.postMessage({
      'type': 'NEEDED-PERUSAHAAN',
      'res': need
    }, "*")
  }

  // TOKEN
  getTokenDarkoCenter(tokenDC, uid){
    this.token = tokenDC
    this.user_id = uid
    localStorage.setItem('token', this.token)
    localStorage.setItem('user_id', this.user_id)
  }

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
      bulan_periode: this.getBulanPeriodeAktif()
    }
  }

  

  periodeAktif(pa_id, pa_tahun, pa_bulan, pa_nama_bulan_aktif){
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
