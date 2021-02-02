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
  beforeCodeTitle: 'Pengaturan Saldo Kasir'
}

@Component({
  selector: 'kt-pengaturan-saldo-kasir',
  templateUrl: './pengaturan-saldo-kasir.component.html',
  styleUrls: ['./pengaturan-saldo-kasir.component.scss', '../master.style.scss']
})
export class PengaturanSaldoKasirComponent implements OnInit {

  // VARIABLES
  loading: boolean = true;
  content: any;
  sub_perusahaan: any;
  kode_perusahaan: string;
  enableCancel: boolean = false
  disabled: boolean = false

  data_akun = []
  res_data = []
  default_data = []
  total_saldo_awal_kasir = 0

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
    id_kasir: '',
    nama_kasir: '',
    id_jenis_transaksi: '',
    kode_jenis_transaksi: '',
    saldo_awal: 0
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
      label: 'Kasir',
      id: 'nama-kasir',
      type: 'input',
      valueOf: 'nama_kasir',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Jenis Transaksi',
      id: 'kode-jenis-transaksi',
      type: 'input',
      valueOf: 'kode_jenis_transaksi',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Saldo',
      id: 'saldo-awal',
      type: 'input',
      valueOf: 'saldo_awal',
      required: false,
      readOnly: false,
      numberOnly: true,
      disabled: false,
      currencyOptions: {
        precision: 2,
        allowNegative: true
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
    this.gbl.topPage()
    this.loading = true
    this.ref.markForCheck()
    let res = []
    for (var i = 0; i < this.data_akun.length; i++) {
      if (this.data_akun[i]['edited']) {
        let t = {
          kode_cabang: this.data_akun[i]['kode_cabang'],
          id_kasir: this.data_akun[i]['id_kasir'],
          id_jenis_transaksi: this.data_akun[i]['id_jenis_transaksi'],
          saldo: parseFloat(this.data_akun[i]['saldo_awal'])
        }
        res.push(t)
      }
    }

    this.request.apiData('kasir', 'i-saldo-awal-kasir', { kode_perusahaan: this.kode_perusahaan, detail: res }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_akun = []
          this.res_data = []
          this.total_saldo_awal_kasir = 0
          this.openSnackBar('Berhasil memperbaharui saldo awal kasir', 'success')
          this.madeRequest()
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('Gagal memperbaharui saldo awal kasir.', 'fail')
        }
      }
    )
  }

  resetDetailForm() {
    this.formDetail = {
      kode_cabang: '',
      nama_cabang: '',
      id_kasir: '',
      nama_kasir: '',
      id_jenis_transaksi: '',
      kode_jenis_transaksi: '',
      saldo_awal: 0
    }
  }

  openDialog(v) {
    this.gbl.topPage()
    let x = JSON.parse(JSON.stringify(v))
    this.formDetail = {
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      id_kasir: x['id_kasir'],
      nama_kasir: x['nama_kasir'],
      id_jenis_transaksi: x['id_jenis_transaksi'],
      kode_jenis_transaksi: x['kode_jenis_transaksi'],
      saldo_awal: x['saldo_awal']
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
      if (this.data_akun[i]['kode_cabang'] === v['kode_cabang'] && this.data_akun[i]['id_kasir'] === v['id_kasir'] && this.data_akun[i]['id_jenis_transaksi'] === v['id_jenis_transaksi']) {
        let t = JSON.parse(JSON.stringify(this.data_akun[i]))
        if (t['edited'] !== undefined) {
          delete t['edited']
        }
        t['saldo_awal'] = v['saldo_awal']
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
    this.restructureData(this.data_akun)
  }

  madeRequest() {
    this.loading = true
    this.ref.markForCheck()
    this.request.apiData('lookup', 'g-start-set-saldo', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let x = data['RESULT']
          if (x == false) {
            this.disabled = true
            this.detailInputLayout.splice(3, 1,
              {
                formWidth: 'col-5',
                label: 'Saldo',
                id: 'saldo-awal',
                type: 'input',
                valueOf: 'saldo_awal',
                required: false,
                readOnly: false,
                numberOnly: true,
                disabled: true,
                currencyOptions: {
                  precision: 2,
                  allowNegative: true
                },
                update: {
                  disabled: false
                }
              }
            )
          }
        }
      }
    )
    this.request.apiData('kasir', 'g-saldo-awal-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_akun = data['RESULT']
          this.default_data = JSON.parse(JSON.stringify(data['RESULT']))
          this.loading = false
          this.ref.markForCheck()
          this.restructureData(data['RESULT'])
        } else {
          this.loading = false
          this.data_akun = []
          this.res_data = []
          this.total_saldo_awal_kasir = 0
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar saldo kasir.', 'fail')
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

  restructureData(data) {
    // Variable Kolom Jenis Kasir
    var flags = [],
      outputCabang = [],
      outputKasir = [],
      outputJTrans = [],
      res = [];

    // Looping Data Cabang
    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['kode_cabang']]) continue;
      flags[data[i]['kode_cabang']] = true;
      outputCabang.push({
        kode_cabang: data[i]['kode_cabang'],
        nama_cabang: data[i]['nama_cabang'],
        type: 'cat'
      });
    }

    // Looping Data Kasir
    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['id_kasir']]) continue;
      flags[data[i]['id_kasir']] = true;
      outputKasir.push({
        id_kasir: data[i]['id_kasir'],
        nama_kasir: data[i]['nama_kasir'],
        keterangan: data[i]['keterangan'],
        type: 'cat'
      });
    }

    // Looping Data Jenis Transaksi
    for (var i = 0; i < data.length; i++) {
      if (flags[data[i]['id_jenis_transaksi']]) continue;
      flags[data[i]['id_jenis_transaksi']] = true;
      outputJTrans.push({
        id_jenis_transaksi: data[i]['id_jenis_transaksi'],
        kode_jenis_transaksi: data[i]['kode_jenis_transaksi'],
        nama_jenis_transaksi: data[i]['nama_jenis_transaksi']
      });
    }
    // Looping Kolom Kasir
    for (var i = 0; i < outputCabang.length; i++) {
      res.push(outputCabang[i])
      for (var j = 0; j < outputKasir.length; j++) {
        res.push(outputKasir[j])
        for (var k = 0; k < outputJTrans.length; k++) {
          outputJTrans[k]
          for (var l = 0; l < data.length; l++) {
            if (outputCabang[i]['kode_cabang'] === data[l]['kode_cabang'] && outputKasir[j]['id_kasir'] === data[l]['id_kasir'] && outputJTrans[k]['id_jenis_transaksi'] === data[l]['id_jenis_transaksi']) {
              res.push({
                kode_cabang: data[l]['kode_cabang'],
                nama_cabang: data[l]['nama_cabang'],
                id_kasir: data[l]['id_kasir'],
                nama_kasir: data[l]['nama_kasir'],
                id_jenis_transaksi: data[l]['id_jenis_transaksi'],
                kode_jenis_transaksi: data[l]['kode_jenis_transaksi'],
                nama_jenis_transaksi: data[l]['nama_jenis_transaksi'],
                saldo_awal: data[l]['saldo_awal']
              }
              )
            }
          }
        }
      }
    }
    this.res_data = res
    this.ref.markForCheck()
    this.countSaldoAwalKasir()
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
    this.restructureData(this.default_data)
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

  checkParent(id_parent, nu?) {
    let data = null, mul = nu === undefined ? 1 : nu

    if (id_parent === "" || id_parent === undefined) return mul * 10

    for (var i = 0; i < this.data_akun.length; i++) {
      if (id_parent === this.data_akun[i]['id_jenis_transaksi']) {
        data = this.data_akun[i]
        break
      }
    }

    if (data != null) {
      mul = mul + 1
      return this.checkParent(data['id_kasir'], mul)
    } else {
      return mul
    }

  }

  checkChild(id) {
    let hasChild = false

    for (var i = 0; i < this.data_akun.length; i++) {
      if (this.data_akun[i]['id_kasir'] === id) {
        hasChild = true
        break;
      }
    }

    return hasChild
  }

  countSaldoAwalKasir() {
    let sum = 0
    for (var i = 0; i < this.data_akun.length; i++) {
      if (!this.checkChild(this.data_akun[i]['id_jenis_transaksi'])) {
        sum = sum + parseFloat(this.data_akun[i]['saldo_awal'])
      }
    }

    this.total_saldo_awal_kasir = sum
  }
}

