import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

const content = {
  beforeCodeTitle: 'Pengaturan Saldo Awal Akun'
}

@Component({
  selector: 'kt-pengaturan-saldo-awal',
  templateUrl: './pengaturan-saldo-awal.component.html',
  styleUrls: ['./pengaturan-saldo-awal.component.scss', '../master.style.scss']
})
export class PengaturanSaldoAwalComponent implements OnInit {

  // VARIABLES
  loading: boolean = true;
  content: any;
  sub_perusahaan: any;
  kode_perusahaan: string;
  enableCancel: boolean = false

  data_akun = []
  res_data = []
  default_data = []
  total_debit = 0
  total_kredit = 0

  c_buttonLayout = [
    {
      btnLabel: 'Batal Input',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.resetDefault()
      },
      btnCondition: () => {
        return true
      }
    },
    {
      btnLabel: 'Tidak',
      btnClass: 'btn btn-secondary',
      btnClick: () => this.dialog.closeAll(),
      btnCondition: () => {
        return true
      }
    }
  ]
  c_labelLayout = [
    {
      content: 'Yakin membatalkan input?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  formDetail = {
    kode_cabang: '',
    nama_cabang: '',
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    nama_tipe_akun: '',
    saldo_debit: 0,
    saldo_kredit: 0
  }

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'nama-cabang',
      type: 'input',
      valueOf: 'nama_cabang',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
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
    this.gbl.need(true, true)
    this.sub_perusahaan = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
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
    this.sub_perusahaan === undefined ? null : this.sub_perusahaan.unsubscribe()
  }

  //Form submit
  onSubmit() {
    if (this.validateSaldo()) {
      this.gbl.topPage()
      this.loading = true
      this.ref.markForCheck()
      let res = []
      for (var i = 0; i < this.data_akun.length; i++) {
        if (this.data_akun[i]['edited']) {
          let t = {
            kode_cabang: this.data_akun[i]['kode_cabang'],
            id_akun: this.data_akun[i]['id_akun'],
            saldo: parseFloat(this.data_akun[i]['saldo_debit']) > parseFloat(this.data_akun[i]['saldo_kredit']) ? parseFloat(this.data_akun[i]['saldo_debit']) : parseFloat(this.data_akun[i]['saldo_kredit']),
            tipe: parseFloat(this.data_akun[i]['saldo_debit']) > parseFloat(this.data_akun[i]['saldo_kredit']) ? 0 : 1
          }
          res.push(t)
        }
      }

      this.request.apiData('akun', 'i-saldo-awal-akun', { kode_perusahaan: this.kode_perusahaan, detail: res }).subscribe(
        data => {
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

  resetDetailForm() {
    this.formDetail = {
      kode_cabang: '',
      nama_cabang: '',
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      nama_tipe_akun: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  }

  openDialog(v) {
    this.gbl.topPage()
    let x = JSON.parse(JSON.stringify(v))
    this.formDetail = {
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      id_akun: x['id_akun'],
      kode_akun: x['kode_akun'],
      nama_akun: x['nama_akun'],
      nama_tipe_akun: x['nama_tipe_akun'],
      saldo_debit: x['saldo_debit'],
      saldo_kredit: x['saldo_kredit']
    }
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '20px' },
      data: {
        title: 'Nilai Saldo',
        showClose: false,
        noButtonSave: true,
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => this.resetDetailForm(),
        onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.submitDetailData(this.formDetail)
      },
      error => null,
    );
  }

  submitDetailData(v) {
    for (var i = 0; i < this.data_akun.length; i++) {
      if (this.data_akun[i]['kode_cabang'] === v['kode_cabang'] && this.data_akun[i]['id_akun'] === v['id_akun']) {
        let t = JSON.parse(JSON.stringify(this.data_akun[i]))
        if (t['edited'] !== undefined) {
          delete t['edited']
        }
        t['saldo_debit'] = v['saldo_debit']
        t['saldo_kredit'] = v['saldo_kredit']
        this.data_akun[i] = t
        let y = true
        if (JSON.stringify(this.data_akun) === JSON.stringify(this.default_data) == false) {
          y = false
        }
        if (y == false) {
          t['edited'] = true
          this.enableCancel = true
        } else {
          this.enableCancel = false
        }
        this.ref.markForCheck()
        this.data_akun[i] = t
        break
      }
    }
    this.dialog.closeAll()
    this.restructureData(this.data_akun, false)
  }

  madeRequest() {
    this.loading = true
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-saldo-awal-akun-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_akun = data['RESULT']
          this.default_data = JSON.parse(JSON.stringify(data['RESULT']))
          this.loading = false
          this.ref.markForCheck()
          this.restructureData(data['RESULT'], true)
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
      // document.getElementById('h-akun').style.width = '59%'
      // document.getElementById('h-debit').style.width = '19.6%'
      // document.getElementById('h-kredit').style.width = '21.4%'
      document.getElementById('h-akun').style.width = '60%'
      document.getElementById('h-debit').style.width = '20%'
      document.getElementById('h-kredit').style.width = '20%'
    }
  }

  restructureData(data, needSort) {
    var flags = [],
      outputCabang = [],
      output = [],
      res = [];

    // Looping Data Cabang
    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['kode_cabang']]) continue;
      flags[data[i]['kode_cabang']] = true;
      outputCabang.push({
        kode_cabang: data[i]['kode_cabang'],
        nama_cabang: data[i]['nama_cabang'],
        type: 'cat'
      })
    }

    // Looping Kategori Akun
    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['id_kategori_akun']]) continue;
      flags[data[i]['id_kategori_akun']] = true;
      output.push({
        id_kategori_akun: data[i]['id_kategori_akun'],
        nama_kategori_akun: data[i]['nama_kategori_akun'],
        type: 'cat'
      })
    }

    if (needSort == true) {
      // Sort A-Z/0-1 Kode Akun
      for (var z = 0; z < data.length; z++) {
        data.sort((a: any, b: any) => a.kode_akun - b.kode_akun)
      }
    }

    for (var h = 0; h < outputCabang.length; h++) {
      res.push(outputCabang[h])
      for (var i = 0; i < output.length; i++) {
        res.push(output[i])
        res = this.parseData(res, data, "", output[i]['id_kategori_akun'], outputCabang[h]['kode_cabang'])
      }
    }

    this.res_data = res
    this.ref.markForCheck()
    this.countDebit()
    this.countKredit()
    setTimeout(() => {
      this.checkHeight()
    }, 1)
  }

  onReset() {
    this.openCDialog()
  }

  resetDefault() {
    this.dialog.closeAll()
    this.data_akun = JSON.parse(JSON.stringify(this.default_data))
    this.enableCancel = false
    this.ref.markForCheck()
    this.restructureData(this.default_data, false)
  }

  openCDialog() { // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '150px' },
      data: {
        title: "Konfirmasi Batal Input",
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: []
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => {
      },
      error => null
    )
  }

  parseData(p, data, id_akun, id_kategori_akun, kode_cabang) {
    let res = p
    for (var i = 0; i < data.length; i++) {
      if (data[i]['kode_cabang'] === kode_cabang && data[i]['id_kategori_akun'] === id_kategori_akun && data[i]['id_induk_akun'] === id_akun) {
        res.push(data[i])
        res = this.parseData(res, data, data[i]['id_akun'], data[i]['id_kategori_akun'], data[i]['kode_cabang'])
      }
    }

    return res
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
      if (!this.checkChild(this.data_akun[i]['id_akun'])) {
        sum = sum + parseFloat(this.data_akun[i]['saldo_debit'])
      }
    }

    this.total_debit = sum
  }

  countKredit() {
    let sum = 0
    for (var i = 0; i < this.data_akun.length; i++) {
      if (!this.checkChild(this.data_akun[i]['id_akun'])) {
        sum = sum + parseFloat(this.data_akun[i]['saldo_kredit'])
      }
    }

    this.total_kredit = sum
  }
}
