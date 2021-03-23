import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { AlertdialogComponent } from '../views/pages/components/alertdialog/alertdialog.component';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../views/pages/components/dialog/dialog.component';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariableService {

  // Access Key
  access_key = "bcad52ed12a9176fdc653ca776293fc8";
  // REPORT URL
  report_url = "http://deva.darkotech.id:8702"
  // Token
  token: string = "";
  user_id: string = "";
  user_name: string = "";

  // PERUSAHAAN
  kode_perusahaan: string = "";
  nama_perusahaan: string = "";
  change: Subject<any> = new Subject<any>();

  // PERIODE
  id_periode: string = "";
  tahun_periode: string = "";
  bulan_periode: string = "";
  change_periode: Subject<any> = new Subject<any>();

  // PERIODE KASIR
  id_periode_kasir: string = "";
  tgl_periode: string = "";
  chPeriodeKasir: Subject<any> = new Subject<any>();

  id_periode_kasir_aktif: string = "";
  tgl_periode_aktif: string = "";
  chPeriodeKasirAktif: Subject<any> = new Subject<any>();

  id_periodeAktif: string = "";
  tahun_periodeAktif: string = "";
  bulan_periodeAktif: string = "";
  activePeriod: Subject<any> = new Subject<any>();

  dialogRef: any;
  dialogType: any;

  constructor(
    public dialog: MatDialog,
    // private ref: ChangeDetectorRef,
  ) { }

  // ACCESS KEY
  getAccessKey() {
    return this.access_key
  }

  // TOP PAGE
  topPage() {
    window.parent.postMessage({
      'type': 'TOP-PAGE',
      'res': true
    }, "*")
  }

  // TOP PAGE
  bottomPage() {
    window.parent.postMessage({
      'type': 'BOTTOM-PAGE',
      'res': true
    }, "*")
  }

  // Screen Position
  screenPosition(valBottom?) {
    window.parent.postMessage({
      'type': 'MOVE-SCREEN',
      'res': {
        status: true,
        setBottom: valBottom === undefined ? 500 : valBottom
      }
    }, "*")
  }


  // NEED COMPANY AND PERIOD
  need(Company, Period, isPeriodeKasir?: boolean) {
    window.parent.postMessage({
      'type': 'UTIL',
      'res': {
        perusahaan: Company,
        periode: isPeriodeKasir ? undefined : Period,
        periode_kasir: isPeriodeKasir ? Period : undefined,
        access_key: this.access_key
      }
    }, '*')
  }

  // TOKEN DC
  getTokenDarkoCenter(tokenDC, uid, uname) {
    this.token = tokenDC
    this.user_id = uid
    this.user_name = uname
    localStorage.setItem('token', this.token)
    localStorage.setItem('user_id', this.user_id)
    localStorage.setItem('user_name', this.user_name)
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
  getPeriodeState() {
    return localStorage.getItem('p') == null ? "p" : localStorage.getItem('p');
  }

  getIdPeriode() {
    return this.id_periode;
  }

  getTahunPeriode() {
    return this.tahun_periode;
  }

  getBulanPeriode() {
    return this.bulan_periode;
  }

  getAccessPeriod() {
    return {
      id_periode: this.getIdPeriode(),
      tahun_periode: this.getTahunPeriode(),
      bulan_periode: this.getBulanPeriode()
    }
  }

  setPeriodeState(v) {
    localStorage.setItem('p', v);
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

  // PERIODE KASIR
  getPeriodeKasir() {
    return {
      id_periode: this.id_periode_kasir,
      tgl_periode: this.tgl_periode
    }
  }

  getIdPeriodeKasir() {
    return this.id_periode_kasir
  }

  getIdPeriodeKasirAktif() {
    return this.id_periode_kasir_aktif
  }

  getTglPeriodeKasir() {
    return this.tgl_periode
  }

  getTglPeriodeKasirAktif() {
    return this.tgl_periode_aktif
  }

  setPeriodeKasir(ip, tgp?) {
    this.id_periode_kasir = ip
    this.tgl_periode = tgp
    let d = {
      id_periode: this.id_periode_kasir,
      tgl_periode: this.tgl_periode
    }
    this.chPeriodeKasir.next(d)
  }

  setPeriodeKasirAktif(pa_id, tgp) {
    this.id_periode_kasir_aktif = pa_id
    this.tgl_periode_aktif = tgp
    let res = {
      id_periode: pa_id,
      tgl_periode: tgp
    }
    this.chPeriodeKasirAktif.next(res)
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

  getNamaBulan(m) {
    let n = "" // NAMA BULAN
    if (m === '1' || m === '01' || m == 1) {
      n = 'Januari'
    } else if (m === '2' || m === '02' || m == 2) {
      n = 'Februari'
    } else if (m === '3' || m === '03' || m == 3) {
      n = 'Maret'
    } else if (m === '4' || m === '04' || m == 4) {
      n = 'April'
    } else if (m === '5' || m === '05' || m == 5) {
      n = 'Mei'
    } else if (m === '6' || m === '06' || m == 6) {
      n = 'Juni'
    } else if (m === '7' || m === '07' || m == 7) {
      n = 'Juli'
    } else if (m === '8' || m === '08' || m == 8) {
      n = 'Agustus'
    } else if (m === '9' || m === '09' || m == 9) {
      n = 'September'
    } else if (m === '10' || m == 10) {
      n = 'Oktober'
    } else if (m === '11' || m == 11) {
      n = 'November'
    } else if (m === '12' || m == 12) {
      n = 'Desember'
    }
    return n;
  }

  getBatasTanggal(m) {
    let day = m == 2 ? 29 :
      (
        m == 1 ||
        m == 3 ||
        m == 5 ||
        m == 7 ||
        m == 8 ||
        m == 10 ||
        m == 12
      ) ? 31 : 30
    return day
  }

  getActive() {
    return {
      id_periode: this.getIdPeriodeAktif(),
      tahun_periode: this.getTahunPeriodeAktif(),
      bulan_periode: this.getBulanPeriodeAktif(),
      nama_bulan_periode: this.getNamaBulan(this.bulan_periodeAktif)
    }
  }

  periodeAktif(pa_id, pa_tahun, pa_bulan) {
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

  //General Get Date Now
  getDateNow() {
    let p = new Date().getTime()
    return p
  }

  //onBlur L.O.V Layout Form
  updateInputdata(d, vOf, inputLayout) {
    let t = JSON.parse(JSON.stringify(d))
    for (var i = 0; i < inputLayout.length; i++) {
      if (inputLayout[i]['type'] === 'inputgroup' && inputLayout[i]['browseType'] === vOf) {
        inputLayout[i]['blurOption']['data'] = t
        break
      }
    }
  }

  // SPLIT DATE FROM MILISECOND TO FORMAT Y-M-D
  splitDate(date) {
    let getDate = new Date(date),
      years = getDate.getUTCFullYear(),
      months = (getDate.getUTCMonth() < 10) ? "0" + (getDate.getUTCMonth() + 1) : getDate.getUTCMonth() + 1,
      days = (getDate.getDate() < 10) ? "0" + getDate.getDate() : getDate.getDate(),
      formatYMD = `${years}-${months}-${days}`

    return formatYMD
  }

  leapYear(year) {
    return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0);
  }

  // Dialog
  // openDialog(type, need) {
  //   this.topPage()
  //   this.dialogType = JSON.parse(JSON.stringify(type))
  //   this.dialogRef = this.dialog.open(DialogComponent, {
  //     width: '55vw',
  //     height: 'auto',
  //     maxWidth: '95vw',
  //     maxHeight: '95vh',
  //     backdropClass: 'bg-dialog',
  //     position: { top: '20px' },
  //     data: {
  //       type: type,
  //       tableInterface:
  //         type === "kode_cabang" ? need.interface :
  //           {},
  //       displayedColumns:
  //         type === "kode_cabang" ? need.display :
  //           [],
  //       tableData:
  //         type === "kode_cabang" ? need.data :
  //           [],
  //       tableRules:
  //         type === "kode_cabang" ? need.rules :
  //           [],
  //       formValue: need.formValue,
  //       sizeCont: 380
  //     }
  //   });

  //   this.dialogRef.afterClosed().subscribe(result => {
  //     if (result) {
  //      if (type === "kode_cabang") {
  //         if (need.forminput !== undefined) {
  //           need.forminput.updateFormValue('kode_cabang', result.kode_cabang)
  //           need.forminput.updateFormValue('nama_cabang', result.nama_cabang)
  //         }
  //       }
  //     }
  //   });
  // }

  // Alert Dialog
  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase(),
        onCloseFunc: onCloseFunc === undefined || onCloseFunc == null ? null : () => onCloseFunc()
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
    })
  }
}
