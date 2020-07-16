import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

import * as XLSX from 'xlsx';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

const content = {
  beforeCodeTitle: 'Upload Data'
}

@Component({
  selector: 'kt-upload-data',
  templateUrl: './upload-data.component.html',
  styleUrls: ['./upload-data.component.scss', '../utilitas.style.scss']
})
export class UploadDataComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  loading: boolean = true;
  content: any;

  parseTemplate = {
    kat_akun: {
      batch: "",
      schema: "sch_p001",
      table: 'mhs_kategori_akun',
      column: [
        "id_kategori_akun",
        "kode_kategori_akun",
        "nama_kategori_akun",
        "input_by",
        "input_dt"
      ],
      date: [],
      indicator: {
        "id_kategori_akun": "_$id",
        "kode_kategori_akun": "kd_kat_coa",
        "nama_kategori_akun": "nm_kat_coa",
        "input_by": "_$input_by"
      }
    },
    akun: {
      batch: "",
      schema: "sch_p001",
      table: 'mhs_akun',
      column: [
        "id_akun",
        "kode_akun",
        "nama_akun",
        "id_kategori_akun",
        "tipe_induk",
        "id_induk_akun",
        "tipe_akun",
        "input_by"
      ],
      date: [],
      indicator: {
        "id_akun": "_$id",
        "kode_akun": "kd_perk",
        "nama_akun": "nm_perk",
        "id_kategori_akun": "_$v{kode_kategori_akun}_$p{kd_klp}",
        "tipe_induk": "_$i{kd_gen, '', 0},{1}",
        "id_induk_akun": "_$r{id_akun}_$p{kode_induk_akun}",
        "kode_induk_akun": "kd_gen",
        "tipe_akun": "tp_perk",
        "input_by": "_$input_by"
      },
      store: {
        "kode_akun": "id_akun"
      }
    },
    jenis_transaksi: {
      batch: "",
      schema: "sch_p001",
      table: 'mhs_jenis_transaksi',
      column: [
        "id_jenis_transaksi",
        "kode_jenis_transaksi",
        "nama_jenis_transaksi",
        "tipe_laporan",
        "input_by"
      ],
      date: [],
      indicator: {
        "id_jenis_transaksi": "_$id",
        "kode_jenis_transaksi": "kd_perk",
        "nama_jenis_transaksi": "ket",
        "tipe_laporan": "tp_perk",
        "input_by": "_$input_by"
      }
    }
  }

  data_kategori_akun = {};

  data_akun = {};

  files: File[] = [];

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, false)
    this.madeRequest()
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    this.sendKategoriAkun()
  }

  onFileDropped(event) {
    this.files.push(...event.addedFiles);
  }

  onFileRemoved(event) {
    this.files.splice(this.files.indexOf(event), 1);
  }

  importExcelFile() {
    const reader = new FileReader();

    let workbook = null;

    reader.onload = (event) => {
      const data = reader.result;
      workbook = XLSX.read(data, { type: 'binary', cellDates: true, dateNF: 'yyyy-mm-dd' });
      let jsonData = workbook.SheetNames.reduce((inital, name) => {
        const sheet = workbook.Sheets[name];
        inital[name] = XLSX.utils.sheet_to_json(sheet, { raw: true });
        return inital;
      }, {})

      let fn = this.files[0]['name'].split('.'), parsedData = {}

      if (fn[0] === 'perkiraan_akuntansi') {
        parsedData = this.processData(this.parseTemplate['akun'], jsonData['akun'])
      } else if (fn[0] === 'perkiraan_kasir') {
        parsedData = this.processData(this.parseTemplate['jenis_transaksi'], jsonData['perk_ksr'])
      } else if (fn[0] === 'kategori_akun') {
        parsedData = this.processData(this.parseTemplate['kat_akun'], jsonData['kat_akun'])
      } else if (fn[0] === 'transaksi_mdn') {
        parsedData = this.processTransaction(jsonData['bb_01'])
      }

      this.request.apiData('utilitas', 'i-data-upload-batch', parsedData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.loading = false
            this.files.splice(0, this.files.length)
            this.ref.markForCheck()
            this.openSnackBar('Data berhasil diupload.', 'success')
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Data gagal diupload.', 'fail')
          }
        },
        error => {
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Request Gagal.', 'fail')
        }
      )

    }

    this.loading = true
    this.ref.markForCheck()

    reader.readAsBinaryString(this.files[0])

  }

  processData(template, data) {
    console.clear()
    let res = {}, pdt = [], // Parsed Data
        sdt = {}

    res = JSON.parse(JSON.stringify(template))

    let indicator = res['indicator'], uid = localStorage.getItem('user_id')

    for (var i = 0; i < data.length; i++) {
      let t = JSON.parse(JSON.stringify(indicator))
      for (var prop in t) {
        if (t[prop] === '_$id') {
          t[prop] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
            length: 8,
            numeric: true,
            letters: false,
            special: false
          }))}`
        } else if (t[prop] === '_$input_by') {
          t[prop] = uid
        } else {
          if (t[prop].includes('_$v')) {
            let v = t[prop].indexOf('_$v'), l = t[prop].indexOf('_$p'),
              k = t[prop].substring(v, l).replace('_$v{', '').replace('}', ''),
              p = t[prop].substring(l).replace('_$p{', '').replace('}', ''),
              d = data[i][p] === undefined ? '' : data[i][p]

              if (k === 'kode_kategori_akun') {
                let r = this.data_kategori_akun[d] === undefined ? '' : this.data_kategori_akun[d][prop]
                t[prop] = r
              }
          } else if (t[prop].includes('_$r')) {

          } else if (t[prop].includes('_$i')) {
            let s = t[prop].replace('_$i', '').replace('{', '').replace('}', '').replace(' ', '').split(','),
                k = s[0].replace('{', '').replace('}', '').replace(' ', ''),
                c = s[1].replace('{', '').replace('}', '').replace(' ', ''),
                tr = s[2].replace('{', '').replace('}', '').replace(' ', ''),
                els = s[3].replace('{', '').replace('}', '').replace(' ', '')
            if (data[i][k] === c || data[i][k] == c) {
              t[prop] = isNaN(parseInt(tr)) ? tr : parseInt(tr)
            } else {
              t[prop] = isNaN(parseInt(els)) ? els : parseInt(els)
            }
          } else {
            if (data[i][t[prop]] !== undefined) {
              t[prop] = data[i][t[prop]]
            } else {
              t[prop] = "#NOTFOUND"
            }
          }
        }
      }

      if (res['store']) {
        for (var prop in res['store']) {
          sdt[t[prop]] = t[res['store'][prop]]
        }
      }

      pdt.push(t)
    }

    for (var i = 0; i < pdt.length; i++) {
      for (var prop in pdt[i]) {
        if (isNaN(pdt[i][prop])) {
          if (pdt[i][prop].includes('_$r')) {
            let v = pdt[i][prop].indexOf('_$r'), l = pdt[i][prop].indexOf('_$p'),
              k = pdt[i][prop].substring(v, l).replace('_$r{', '').replace('}', ''),
              p = pdt[i][prop].substring(l).replace('_$p{', '').replace('}', ''),
              d = sdt[pdt[i][p]] === undefined ? '' : sdt[pdt[i][p]]

              pdt[i][prop] = d

          }
        }
      }
    }

    res['data'] = pdt

    return res
  }

  processTransaction(data) {
    console.clear()
    let res = {
      schema: "sch_p001",
      table: '',
      column: [],
      date: [],
      "detail_indicator": "detail",
      data: []
    },
    resData = [],
    d = {}

    for (var i = 0; i < data.length; i++) {
      if (d[data[i]['no_tran']] === undefined) {
        d[data[i]['no_tran']] = []
        d[data[i]['no_tran']].push(data[i])
      } else {
        d[data[i]['no_tran']].push(data[i])
      }
    }

    var key;
    for (key in d) {
      // if (d.hasOwnProperty(key)) size++;
      if (key.includes("MGJ")) {
        let id_tran = `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}`,
        t = {
          "id_tran": id_tran,
          "tgl_tran": new Date(d[key][0]['tgl_tran']).getTime(),
          "kode_cabang": "CAB001",
          "keterangan": key,
          "jurnal_penyesuaian": 0,
          "input_by": "ADMIN",
          "input_dt": Date.now(),
          "id_periode": "db1ebd3caf033e68c22c240c2edda7c8",
          "detail": {
            "schema": "sch_p001",
            "table": "trd_jurnal",
            "column": [
              "id_tran",
              "id_akun",
              "kode_divisi",
              "kode_departemen",
              "nilai_debit",
              "nilai_kredit",
              "keterangan_1",
              "input_by",
              "input_dt"
            ],
            "date": [
              "input_dt"
            ],
            "data": []
          }
        },
        td = []

        for (var i = 0; i < d[key].length; i++) {
          let tt = {
            id_tran: id_tran,
            id_akun: this.data_akun[d[key][i]['kd_perk']]['id_akun'],
            kode_divisi: "FINMPS",
            kode_departemen: "FIN",
            nilai_debit: d[key][i]['debet'],
            nilai_kredit: d[key][i]['kredit'],
            keterangan_1: d[key][i]['no_tran'],
            input_by: "ADMIN",
            input_dt: Date.now()
          }

          td.push(tt)
        }

        t['detail']['data'] = td

        resData.push(t)
      }
      
    }

    res['table'] = "trh_jurnal"
    res['column'] = [
      "id_tran",
      "tgl_tran",
      "kode_cabang",
      "keterangan",
      "jurnal_penyesuaian",
      "input_by",
      "input_dt",
      "id_periode"
    ]
    res['date'] = [
      "tgl_tran",
      "input_dt"
    ]
    res['data'] = resData

    return res
  }

  sendKategoriAkun() {
    this.request.apiData('kategori-akun', 'g-kategori-akun', { kode_perusahaan: 'P001' }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          for (var i = 0; i < data['RESULT'].length; i++) {
            this.data_kategori_akun[data['RESULT'][i]['kode_kategori_akun']] = data['RESULT'][i]
          }
          this.sendAkun()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Kategori Akun gagal didapatkan.', 'info')
        }
      }
    )
  }

  sendAkun() {
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: 'P001' }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.loading = false
          for (var i = 0; i < data['RESULT'].length; i++) {
            this.data_akun[data['RESULT'][i]['kode_akun']] = data['RESULT'][i]
          }
          this.ref.markForCheck()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Akun gagal didapatkan.', 'info')
        }
      }
    )
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase()
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(result => {
      this.dialog.closeAll()
    })
  }

}
