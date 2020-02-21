import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Pengaturan Saldo Awal'
}

@Component({
  selector: 'kt-pengaturan-saldo-awal',
  templateUrl: './pengaturan-saldo-awal.component.html',
  styleUrls: ['./pengaturan-saldo-awal.component.scss', '../master.style.scss']
})
export class PengaturanSaldoAwalComponent implements OnInit {

  // Variables
  loading: boolean = true;
  content: any;
  subscription: any;
  kode_perusahaan: string;

  data_akun = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.madeRequest()
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.kode_perusahaan === undefined) {
      this.kode_perusahaan = this.gbl.getKodePerusahaan()
      if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') {
        this.madeRequest()
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    window.scrollTo(0, 0)
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.openSnackBar(message, 'success')
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
  }

  //Reset Value
  resetForm() {
  }

  onCancel() {
  }

  deleteData() {

  }

  madeRequest() {
    this.loading = true
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-saldo-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_akun = this.restructureData(data['RESULT'])
          this.loading = false
          this.ref.markForCheck()
          setTimeout(() => {
            this.checkHeight()
          }, 1)
        } else {
          this.loading = false
          this.data_akun = []
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar saldo akun.', 'fail')
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

  numberFormatter(amount, decimalCount = 0, decimal = ",", thousands = ".") {
    try {
      decimalCount = Math.abs(decimalCount);
      decimalCount = isNaN(decimalCount) ? 2 : decimalCount;

      const negativeSign = amount < 0 ? "-" : "";

      let i: any = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
      let j = (i.length > 3) ? i.length % 3 : 0;

      return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
    } catch (e) {

    }
  }

  checkHeight() {
    let ctr = document.getElementById('c-container').offsetHeight,
      ctn = document.getElementById('content') == null ? 0 : document.getElementById('content').offsetHeight
    if (ctn * this.data_akun.length > ctr) {
      document.getElementById('h-akun').style.width = '59%'
      document.getElementById('h-debit').style.width = '19.6%'
      document.getElementById('h-kredit').style.width = '21.4%'
    }
  }

  restructureData(data) {
    var flags = [],
      output = [],
      res = [];

    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['id_kategori_akun']]) continue;
      flags[data[i]['id_kategori_akun']] = true;
      output.push({
        id_kategori_akun: data[i]['id_kategori_akun'],
        nama_kategori_akun: data[i]['nama_kategori_akun'],
        type: 'cat'
      });
    }

    for (var i = 0; i < output.length; i++) {
      res.push(output[i])
      for (var j = 0; j < data.length; j++) {
        if (data[j]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_induk_akun'] === "") {
          res.push(data[j])
          for (var k = 0; k < data.length; k++) {
            if (data[k]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_akun'] === data[k]['id_induk_akun']) {
              res.push(data[k])
            }
          }
        }
      }
    }

    console.log(res)

    return res
  }
}
