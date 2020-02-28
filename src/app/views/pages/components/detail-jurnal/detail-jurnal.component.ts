import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'kt-detail-jurnal',
  templateUrl: './detail-jurnal.component.html',
  styleUrls: ['./detail-jurnal.component.scss']
})
export class DetailJurnalComponent implements OnInit {

  @Input() dataAkun: [];
  @Input() data: any;

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

  res_data = [
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0
    },
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  ];
  total_debit = 0
  total_kredit = 0

  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    let r_data_akun = []
    for (var i = 0; i < this.dataAkun.length; i++) {
      if (!this.checkChild(this.dataAkun[i]['id_akun'])) {
        r_data_akun.push(this.dataAkun[i])
      }
    }
    this.data_akun = JSON.parse(JSON.stringify(r_data_akun))
    if (this.data !== undefined || this.data != null) {
      this.res_data = this.data
    }
    this.countDebit()
    this.countKredit()
  }

  checkChanges() {
    if (this.data !== undefined || this.data != null) {
      this.res_data = this.data
      this.countDebit()
      this.countKredit()
    }
  }

  openDialog(ind) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: 'induk_akun',
        tableInterface: {},
        displayedColumns: this.akunDisplayColumns,
        tableData: this.data_akun,
        tableRules: [],
        formValue: {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.res_data[ind]['id_akun'] = result.id_akun
        this.res_data[ind]['kode_akun'] = result.kode_akun
        this.res_data[ind]['nama_akun'] = result.nama_akun
        this.res_data[ind]['keterangan_akun'] = this.res_data[ind]['nama_akun'] + " - " + this.res_data[ind]['kode_akun']
        this.ref.markForCheck();
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
      saldo_kredit: 0
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

  getData() {
    let res = {
      valid: (this.total_debit == this.total_kredit) && (this.total_debit != 0 && this.total_kredit !== 0) ? true : false,
      data: this.res_data
    }
    return res
  }
}
