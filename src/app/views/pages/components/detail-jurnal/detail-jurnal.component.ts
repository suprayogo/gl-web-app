import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';

// Dialog Component
import { DialogComponent } from '../dialog/dialog.component';
import { AlertdialogComponent } from '../alertdialog/alertdialog.component';

@Component({
  selector: 'kt-detail-jurnal',
  templateUrl: './detail-jurnal.component.html',
  styleUrls: ['./detail-jurnal.component.scss']
})
export class DetailJurnalComponent implements OnInit {

  @Input() dataAkun: [];
  @Input() dataSetting: [];
  @Input() data: any;
  @Input() jurnalOtomatis: boolean;
  @Input() noEdit: boolean;

  currencyOptions = {
    align: "right",
    allowNegative: false,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ".",
    nullable: false
  }

  data_akun = [];
  data_setting = [];

  akunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    }
  ];
  settingDisplayColumns = [
    {
      label: 'Kode Setting',
      value: 'kode_setting'
    },
    {
      label: 'Nama Setting',
      value: 'nama_setting'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Tipe',
      value: 'tipe_setting_sub'
    }
  ]
  settingDataRules = [
    {
      target: 'tipe_setting',
      replacement: {
        '0': 'Per Periode',
        '1': 'Per Tanggal',
        '2': 'Per Transaksi'
      },
      redefined: 'tipe_setting_sub'
    }
  ]

  res_data = [
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      setting_debit: '',
      setting_kredit: ''
    },
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      setting_debit: '',
      setting_kredit: ''
    }
  ];
  total_debit = 0
  total_kredit = 0
  tipe_setting = ""

  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    let r_data_akun = []
    if (this.dataAkun !== undefined && this.dataAkun != null) {
      for (var i = 0; i < this.dataAkun.length; i++) {
        if (!this.checkChild(this.dataAkun[i]['id_akun'])) {
          r_data_akun.push(this.dataAkun[i])
        }
      }
    }
    this.data_akun = JSON.parse(JSON.stringify(r_data_akun))
    if (this.data !== undefined || this.data != null) {
      this.res_data = this.data
    }
    this.countDebit()
    this.countKredit()

    if (this.dataSetting !== undefined && this.dataSetting != null) {
      this.data_setting = JSON.parse(JSON.stringify(this.dataSetting))
    }
  }

  checkChanges() {
    if (this.data !== undefined || this.data != null) {
      this.res_data = this.data
      this.countDebit()
      this.countKredit()
    }
  }

  openDialog(ind, type, n?: any) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: 'induk_akun',
        tableInterface: {},
        displayedColumns:
          type === "kode_akun" ? this.akunDisplayColumns :
            type === "kode_setting" ? this.settingDisplayColumns :
              [],
        tableData:
          type === "kode_akun" ? this.data_akun :
            type === "kode_setting" ? this.data_setting :
              [],
        tableRules:
          type === "kode_setting" ? this.settingDataRules :
            [],
        formValue: {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_akun") {
          this.res_data[ind]['id_akun'] = result.id_akun
          this.res_data[ind]['kode_akun'] = result.kode_akun
          this.res_data[ind]['nama_akun'] = result.nama_akun
          this.res_data[ind]['keterangan_akun'] = this.res_data[ind]['nama_akun'] + " - " + this.res_data[ind]['kode_akun']
          this.ref.markForCheck();
        } else if (type === "kode_setting") {
          if (n !== undefined) {
            if (this.tipe_setting === result.tipe_setting) {
              if (n === "d") {
                this.res_data[ind]['setting_debit'] = result.kode_setting
                this.res_data[ind]['setting_kredit'] = ""
                this.tipe_setting = result.tipe_setting
              } else if (n === "k") {
                this.res_data[ind]['setting_debit'] = ""
                this.res_data[ind]['setting_kredit'] = result.kode_setting
                this.tipe_setting = result.tipe_setting
              }
            } else {
              if (this.tipe_setting !== "") {
                this.openSnackBar('Tipe setting berbeda dengan tipe setting sebelumnya', 'info')
              }
              for (var i = 0; i < this.res_data.length; i++) {
                this.res_data[i]['setting_debit'] = ""
                this.res_data[i]['setting_kredit'] = ""
              }
              if (n === "d") {
                this.res_data[ind]['setting_debit'] = result.kode_setting
                this.res_data[ind]['setting_kredit'] = ""
                this.tipe_setting = result.tipe_setting
              } else if (n === "k") {
                this.res_data[ind]['setting_debit'] = ""
                this.res_data[ind]['setting_kredit'] = result.kode_setting
                this.tipe_setting = result.tipe_setting
              }
            }

          }
          this.ref.markForCheck();
          console.log(this.res_data)
        }
      }
    });
  }

  onBlur(d, ind) {
    let fres = [], v = d.target.value.toUpperCase()
    fres = this.data_akun.filter(each => each['kode_akun'].toUpperCase() === v || (each['nama_akun'] + " - " + each['kode_akun']).toUpperCase() === v)
    if (fres.length > 0 && fres.length < 2) {
      this.res_data[ind]['id_akun'] = fres[0]['id_akun']
      this.res_data[ind]['kode_akun'] = fres[0]['kode_akun']
      this.res_data[ind]['nama_akun'] = fres[0]['nama_akun']
      this.res_data[ind]['keterangan_akun'] = fres[0]['nama_akun'] + " - " + fres[0]['kode_akun']
    } else {
      this.res_data[ind]['id_akun'] = ""
      this.res_data[ind]['kode_akun'] = ""
      this.res_data[ind]['nama_akun'] = ""
      this.res_data[ind]['keterangan_akun'] = ""
    }

  }

  inputPipe(ind, data) {
    this.res_data[ind] = data.toUpperCase()
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

  checkChild(id) {
    let hasChild = false

    for (var i = 0; i < this.dataAkun.length; i++) {
      if (this.dataAkun[i]['id_induk_akun'] === id) {
        hasChild = true
        break;
      }
    }

    return hasChild
  }

  countDebit(ind?) {
    let sum = 0
    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['saldo_debit']))
    }

    this.total_debit = sum
    if (ind) {
      if (parseFloat(JSON.stringify(this.res_data[ind]['saldo_debit'])) > 0) {
        this.res_data[ind]['saldo_kredit'] = 0
        this.countKredit(ind)
      }
    }
    this.ref.markForCheck()
  }

  countKredit(ind?) {
    let sum = 0
    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['saldo_kredit']))
    }

    this.total_kredit = sum
    if (ind) {
      if (parseFloat(JSON.stringify(this.res_data[ind]['saldo_kredit'])) > 0) {
        this.res_data[ind]['saldo_debit'] = 0
        this.countDebit(ind)
      }
    }
    this.ref.markForCheck()
  }

  addRow() {
    let r = {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      setting_debit: '',
      setting_kredit: ''
    }
    this.res_data.push(r)
  }

  deleteRow() {
    if (this.res_data.length > 2) {
      this.res_data.splice(this.res_data.length - 1, 1)
      this.countDebit()
      this.countKredit()
    }
  }

  clearJurnalOtomatisData(i) {
    this.res_data[i]['setting_debit'] = ""
    this.res_data[i]['setting_kredit'] = ""
  }

  getData() {
    let res = {
      valid: (this.total_debit == this.total_kredit) && (this.total_debit != 0 && this.total_kredit !== 0) ? true : false,
      data: this.res_data
    }
    return res
  }

  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: '90vw',
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
