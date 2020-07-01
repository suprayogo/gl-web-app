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
      schema: "sch_p000",
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
      schema: "sch_p000",
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
        "id_kategori_akun": "",
        "tipe_induk": "",
        "id_induk_akun": "",
        "tipe_akun": "",
        "input_by": "_$input_by"
      }
    }
  }

  files: File[] = [];

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(false, false)
    this.madeRequest()
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
  }

  onFileDropped(event) {
    this.files.push(...event.addedFiles);
  }

  onFileRemoved(event) {
		this.files.splice(this.files.indexOf(event), 1);
  }
  
  importExcelFile() {
    console.log(this.files)
    const reader = new FileReader();

    let workbook = null;

    reader.onload = (event) => {
      const data = reader.result;
      workbook = XLSX.read(data, { type: 'binary' });
      let jsonData = workbook.SheetNames.reduce((inital, name) => {
        const sheet = workbook.Sheets[name];
        inital[name] = XLSX.utils.sheet_to_json(sheet, { raw: true });
        return inital;
      }, {})

      let fn = this.files[0]['name'].split('.'), parsedData = {}

      if (fn[0] === 'perkiraan_akuntansi') {
        parsedData = this.processData(this.parseTemplate['akun'], jsonData)
      } else if (fn[0] === 'perkiraan_kasir') {
        parsedData = this.processData(this.parseTemplate['akun'], jsonData)
      } else if (fn[0] === 'kategori_akun') {
        parsedData = this.processData(this.parseTemplate['kat_akun'], jsonData['kat_akun'])
      }

      this.request.apiData('utilitas', 'i-data-upload', parsedData).subscribe(
        data => {
          if (data['RESULT'] === 'Y') {
            this.loading = false
            this.files.splice(0, this.files.length)
            this.ref.markForCheck()
            this.openSnackBar('Data berhasil diupload.', 'success')
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Data gagal diupload.', 'fail')
          }
        }
      )
      
    }

    this.loading = true
    this.ref.markForCheck()

    reader.readAsBinaryString(this.files[0])

  }

  processData(template, data) {
    let res = {}, pdt = [] // Parsed Data

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
          if (data[i][t[prop]] !== undefined) {
            t[prop] = data[i][t[prop]]
          } else {
            t[prop] = "#NOTFOUND"
          }
        }
      }
      pdt.push(t)
    }

    res['data'] = pdt

    return res
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
