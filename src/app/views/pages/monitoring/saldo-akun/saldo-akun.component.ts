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
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Saldo Akun Periode Aktif'
}

@Component({
  selector: 'kt-saldo-akun',
  templateUrl: './saldo-akun.component.html',
  styleUrls: ['./saldo-akun.component.scss', '../monitoring.style.scss']
})
export class SaldoAkunComponent implements OnInit {

  // Variables
  loading: boolean = true;
  content: any;
  subscription: any;
  kode_perusahaan: string;
  noSubmitSave: boolean = true;

  data_akun = []
  res_data = []
  total_debit = 0
  total_kredit = 0

  formDetail = {
    id_akun:  '', 
    kode_akun: '',
    nama_akun : '',
    nama_tipe_akun: '',
    saldo_debit: 0,
    saldo_kredit: 0
  }

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Akun',
      id: 'kode-akun',
      type: 'input',
      valueOf: 'kode_akun',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nama Akun',
      id: 'nama-akun',
      type: 'input',
      valueOf: 'nama_akun',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Akun',
      id: 'tipe-akun',
      type: 'input',
      valueOf: 'nama_tipe_akun',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Saldo Awal Debit ',
      id: 'saldo-awal-debit',
      type: 'input',
      valueOf: 'saldo_debit',
      required: false,
      readOnly: false,
      numberOnly: true,
      disabled: true,
      currencyOptions: {
        precision: 2
      },
      resetOption: {
        type: 'saldo_kredit',
        value: 0
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Saldo Awal Kredit ',
      id: 'saldo-awal-kredit',
      type: 'input',
      valueOf: 'saldo_kredit',
      required: false,
      readOnly: false,
      numberOnly: true,
      disabled: true,
      currencyOptions: {
        precision: 2
      },
      resetOption: {
        type: 'saldo_debit',
        value: 0
      },
      update: {
        disabled: false
      }
    }
  ]

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, false)
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
  onSubmit() {
    if (this.validateSaldo()) {
      this.loading = true
      this.ref.markForCheck()
      let res = []
      for (var i = 0; i < this.data_akun.length; i++) {
        if (this.data_akun[i]['edited']) {
          let t = {
            id_akun: this.data_akun[i]['id_akun'],
            saldo: parseFloat(this.data_akun[i]['saldo_debit']) > parseFloat(this.data_akun[i]['saldo_kredit']) ? parseFloat(this.data_akun[i]['saldo_debit']) : parseFloat(this.data_akun[i]['saldo_kredit']),
            tipe: parseFloat(this.data_akun[i]['saldo_debit']) > parseFloat(this.data_akun[i]['saldo_kredit']) ? 0 : 1
          }
          res.push(t)
        }
      }
  
      this.request.apiData('akun', 'i-saldo-awal-akun', { kode_perusahaan: this.kode_perusahaan, detail: res }).subscribe(
        data =>  {
          if (data['STATUS'] === 'Y') {
            this.data_akun = []
            this.res_data = []
            this.total_debit = 0
            this.total_kredit = 0
            this.openSnackBar('Berhasil memperbaharui saldo awal akun', 'success')
            this.madeRequest()
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('Gagal memperbaharui saldo awal akun.', 'fail')
          }
        }
      )
    } else {
      this.openSnackBar('Saldo debit dan kredit tidak seimbang.', 'info')
    }
  }

  validateSaldo() {
    let valid = false;

    if (this.total_debit == this.total_kredit) {
      valid = true;
    }

    return valid
  }

  //Reset Value
  resetForm() {
  }

  resetDetailForm() {
    this.formDetail = {
      id_akun:  '', 
      kode_akun: '',
      nama_akun : '',
      nama_tipe_akun: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  }

  onCancel() {
  }

  deleteData() {

  }

  openDialog(v) {
    let x = JSON.parse(JSON.stringify(v))
    this.formDetail = {
      id_akun: x['id_akun'],
      kode_akun: x['kode_akun'],
      nama_akun: x['nama_akun'],
      nama_tipe_akun: x['nama_tipe_akun'],
      saldo_debit: x['saldo_debit'],
      saldo_kredit: x['saldo_kredit']
    }
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        noButtonSave: true,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => this.resetDetailForm(),
        onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
      },
      error => null,
    );
  }

  submitDetailData(v) {
    for (var i = 0; i < this.data_akun.length; i++) {
      if (this.data_akun[i]['id_akun'] === v['id_akun']) {
        let t = JSON.parse(JSON.stringify(this.data_akun[i]))
        t['saldo_debit'] = v['saldo_debit']
        t['saldo_kredit'] = v['saldo_kredit']
        t['edited'] = true
        this.data_akun[i] = t
        break
      }
    }
    this.dialog.closeAll()
    this.restructureData(this.data_akun)
  } 

  madeRequest() {
    this.loading = true
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-saldo-akun-aktif', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_akun = data['RESULT']
          this.restructureData(data['RESULT'])
        } else {
          this.loading = false
          this.data_akun = []
          this.res_data = []
          this.total_debit = 0
          this.total_kredit = 0
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar saldo akun.', 'fail')
        }
      }
    )
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '90vw',
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
    this.loading = true
    this.ref.markForCheck()
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

    // for (var i = 0; i < output.length; i++) {
    //   res.push(output[i])
    //   for (var j = 0; j < data.length; j++) {
    //     if (data[j]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_induk_akun'] === "") {
    //       res.push(data[j])
    //       for (var k = 0; k < data.length; k++) {
    //         if (data[k]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_akun'] === data[k]['id_induk_akun']) {
    //           res.push(data[k])
    //         }
    //       }
    //     }
    //   }
    // }

    for (var i = 0; i < output.length; i++) {
      res.push(output[i])
      for (var j = 0; j < data.length; j++) {
        if (data[j]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_induk_akun'] === "") {
          res.push(data[j])
          for (var k = 0; k < data.length; k++) {
            if (data[k]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[j]['id_akun'] === data[k]['id_induk_akun']) {
              res.push(data[k])
              for (var l = 0; l < data.length; l++) {
                if (data[l]['id_kategori_akun'] === output[i]['id_kategori_akun'] && data[k]['id_akun'] === data[l]['id_induk_akun']) {
                  res.push(data[l])
                }
              }
            }
          }
        }
      }
    }

    this.res_data = res
    this.countDebit()
    this.countKredit()
    this.loading = false
    this.ref.markForCheck()
    setTimeout(() => {
      this.checkHeight()
    }, 1)
  }

  checkParent(id_parent, nu?) {
    let data = null, mul = nu === undefined ? 1 : nu

    if (id_parent === "" || id_parent === undefined) return mul * 10

    for (var i = 0; i < this.data_akun.length; i++) {
      if (id_parent === this.data_akun[i]['id_akun']) {
        data = this.data_akun[i]
        break
      }
    }

    if (data != null) {
      mul = mul + 1
      return this.checkParent(data['id_induk_akun'], mul)
    } else {
      return mul
    }
    
  }

  checkChild(id) {
    let hasChild = false

    for (var i = 0; i < this.data_akun.length; i++) {
      if (this.data_akun[i]['id_induk_akun'] === id) {
        hasChild = true
        break;
      }
    }

    return hasChild
  }

  countDebit() {
    let sum = 0
    for (var i = 0; i < this.data_akun.length; i++) {
      if (!this.checkChild(this.data_akun[i]['id_akun']) && this.data_akun[i]['tipe_akun'] === "0") {
        sum = sum + parseFloat(this.data_akun[i]['saldo_saat_ini_buku_besar'])
      }
    }

    this.total_debit = sum
  }

  countKredit() {
    let sum = 0
    for (var i = 0; i < this.data_akun.length; i++) {
      if (!this.checkChild(this.data_akun[i]['id_akun']) && this.data_akun[i]['tipe_akun'] === "1") {
        sum = sum + parseFloat(this.data_akun[i]['saldo_saat_ini_buku_besar'])
      }
    }

    this.total_kredit = sum
  }
}

