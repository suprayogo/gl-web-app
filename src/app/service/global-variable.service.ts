import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  kode_perusahaan: string = "";
  nama_perusahaan: string = "";
  change: Subject<any> = new Subject<any>();

  constructor() { }

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

}
