import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';

// Dialog Component
import { DialogComponent } from '../dialog/dialog.component';
import { AlertdialogComponent } from '../alertdialog/alertdialog.component';
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';
import { CurrencyMaskInputMode } from 'ngx-currency';

@Component({
  selector: 'kt-detail-jurnal',
  templateUrl: './detail-jurnal.component.html',
  styleUrls: ['./detail-jurnal.component.scss']
})
export class DetailJurnalComponent implements OnInit {

  @Input() dataAkun: [];
  @Input() dataDivisi: [];
  @Input() dataSetting: [];
  @Input() data: any;
  @Input() jurnalOtomatis: boolean;
  @Input() templateTransaksi: boolean;
  @Input() noEdit: boolean;
  @Input() tipe: any;

  currencyOptions = {
    align: "right",
    allowNegative: true,
    allowZero: true,
    decimal: ",",
    precision: 2,
    prefix: "",
    suffix: "",
    thousands: ".",
    nullable: false,
    inputMode: CurrencyMaskInputMode.NATURAL
  }

  setValueNewRows = {}
  jurnalType: any
  transaksiJurnalType: any
  disabled = [
    {
      debit: false,
      kredit: false,
    },
    {
      debit: false,
      kredit: false,
    }
  ]

  loadingDepartemen = true;
  dialogRef: any;
  dialogType: any;

  data_akun = [];
  data_divisi = [];
  data_departemen = [];
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
  divisiDisplayColumns = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    }
  ];
  departemenDisplayColumns = [
    {
      label: 'Kode Departemen',
      value: 'kode_departemen'
    },
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    }
  ]
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
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      setting_debit: '',
      setting_kredit: '',
      bobot_debit: 0,
      bobot_kredit: 0
    },
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      setting_debit: '',
      setting_kredit: '',
      bobot_debit: 0,
      bobot_kredit: 0
    }
  ];
  total_debit = 0
  total_kredit = 0
  tipe_setting = ""

  loading = false;

  constructor(
    private ref: ChangeDetectorRef,
    private dialog: MatDialog,
    private request: RequestDataService,
    private gbl: GlobalVariableService
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
    if (this.templateTransaksi) {
      this.countPercentDebit()
      this.countPercentKredit()
    } else {
      this.countDebit()
      this.countKredit()
    }

    if (this.dataSetting !== undefined && this.dataSetting != null) {
      this.data_setting = JSON.parse(JSON.stringify(this.dataSetting))
    }

    if ((this.res_data[0]['setting_debit'] !== '' && this.res_data[0]['setting_debit'] !== undefined) ||
      (this.res_data[0]['setting_kredit'] !== '' && this.res_data[0]['setting_kredit'] !== undefined)
    ) {
      for (var i = 0; i < this.data_setting.length; i++) {
        if (
          (this.data_setting[i]['kode_setting'] === this.res_data[0]['setting_debit']) ||
          (this.data_setting[i]['kode_setting'] === this.res_data[0]['setting_kredit'])
        ) {
          this.tipe_setting = this.data_setting[i]['tipe_setting']
          break;
        }
      }
    }

    this.data_divisi = this.dataDivisi
    this.jurnalType = this.tipe['jenis_jurnal'] === undefined ? "0" : this.tipe['jenis_jurnal']
    this.transaksiJurnalType = this.tipe['tipe_transaksi'] === undefined ? "0" : this.tipe['tipe_transaksi']
    let x = []
    if (this.jurnalType === "0" || this.jurnalType === "1") {
      for (var i = 0; i < this.res_data.length; i++) {
        x.push({
          debit: false,
          kredit: false
        })
      }
      this.disabled = x
    } else if (this.jurnalType === "2") {
      if (this.transaksiJurnalType === "0") {
        for (var i = 0; i < this.res_data.length; i++) {
          x.push({
            debit: true,
            kredit: false
          })
        }
        this.disabled = x
        this.disabled.splice(0, 1, {
          debit: false,
          kredit: true
        })
      } else if (this.transaksiJurnalType === "1") {
        for (var i = 0; i < this.res_data.length; i++) {
          x.push({
            debit: false,
            kredit: true
          })
        }
        this.disabled = x
        this.disabled.splice(0, 1, {
          debit: true,
          kredit: false
        })
      }
    }
  }

  checkChanges() {
    this.jurnalType = this.tipe['jenis_jurnal'] === undefined ? "0" : this.tipe['jenis_jurnal']
    this.transaksiJurnalType = this.tipe['tipe_transaksi'] === undefined ? "0" : this.tipe['tipe_transaksi']
    let x = []
    if (this.data !== undefined || this.data != null) {
      if (this.data[0]['kode_divisi'] === '' && this.data[1]['kode_divisi'] === '' && this.data.length == 2) {
        this.setValueNewRows = {}
      }
      this.res_data = this.data
      if (this.jurnalType === "0" || this.jurnalType === "1") {
        for (var i = 0; i < this.res_data.length; i++) {
          x.push({
            debit: false,
            kredit: false
          })
        }
        this.disabled = x
      } else if (this.jurnalType === "2") {
        if (this.transaksiJurnalType === "0") {
          for (var i = 0; i < this.res_data.length; i++) {
            x.push({
              debit: true,
              kredit: false
            })
          }
          this.disabled = x
          this.disabled.splice(0, 1, {
            debit: false,
            kredit: true
          })
        } else if (this.transaksiJurnalType === "1") {
          for (var i = 0; i < this.res_data.length; i++) {
            x.push({
              debit: false,
              kredit: true
            })
          }
          this.disabled = x
          this.disabled.splice(0, 1, {
            debit: true,
            kredit: false
          })
        }
      }
      this.countDebit()
      this.countKredit()
    }
    this.ref.markForCheck()
  }

  checkChangesTemplate() {
    if (this.data !== undefined || this.data != null) {
      this.res_data = this.data
      this.countPercentDebit()
      this.countPercentKredit()
    }
  }

  openDialog(ind, type, n?: any) {
    if (type === "kode_departemen") {
      if (this.res_data[ind]['kode_divisi'] === '' || this.res_data[ind]['nama_divisi'] === '') {
        this.openSnackBar("Pilih divisi terlebih dahulu.", 'info', () => {
          setTimeout(() => {
            this.openDialog(ind, 'kode_divisi', n)
          }, 100)
        })
        return
      } else {
        if (n === undefined) {
          this.loadingDepartemen = true
          this.sendRequestDepartemen(this.gbl.getKodePerusahaan(), this.res_data[ind]['kode_divisi'], ind)
        } else if (n == false) {
          this.sendRequestDepartemen(this.gbl.getKodePerusahaan(), this.res_data[ind]['kode_divisi'], ind)
        }
      }
    }

    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
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
              type === "kode_divisi" ? this.divisiDisplayColumns :
                type === "kode_departemen" ? this.departemenDisplayColumns :
                  [],
        tableData:
          type === "kode_akun" ? this.data_akun :
            type === "kode_setting" ? this.data_setting :
              type === "kode_divisi" ? this.data_divisi :
                type === "kode_departemen" ? this.data_departemen :
                  [],
        tableRules:
          type === "kode_setting" ? this.settingDataRules :
            [],
        formValue: {},
        loadingData: type === "kode_departemen" ? this.loadingDepartemen : false
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_akun") {

          this.res_data[ind]['id_akun'] = result.id_akun
          this.res_data[ind]['kode_akun'] = result.kode_akun
          this.res_data[ind]['nama_akun'] = result.nama_akun
          this.res_data[ind]['keterangan_akun'] = this.res_data[ind]['nama_akun'] + " - " + this.res_data[ind]['kode_akun']
          this.ref.markForCheck()

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
        } else if (type === "kode_divisi") {

          if (this.res_data[ind]['kode_divisi'] !== result.kode_divisi) {
            this.res_data[ind]['kode_departemen'] = ""
            this.res_data[ind]['nama_departemen'] = ""
          }

          this.res_data[ind]['kode_divisi'] = result.kode_divisi
          this.res_data[ind]['nama_divisi'] = result.nama_divisi

          let a = this.res_data.length - 1
          for (var i = 1; i < this.res_data.length; i++) {
            if (this.res_data[0]['kode_divisi'] !== '' && this.res_data[i]['kode_divisi'] === '') {
              this.res_data[i]['kode_divisi'] = this.res_data[0]['kode_divisi']
              this.res_data[i]['nama_divisi'] = this.res_data[0]['nama_divisi']
            } else if (this.res_data[0]['kode_divisi'] === '' && this.res_data[i]['kode_divisi'] !== '') {
              for (var j = 0; j < a; j++) {
                this.res_data[j]['kode_divisi'] = this.res_data[i]['kode_divisi']
                this.res_data[j]['nama_divisi'] = this.res_data[i]['nama_divisi']
              }
            }
          }

          if (this.res_data[0]['kode_divisi'] !== '') {
            this.setValueNewRows['kode_divisi'] = this.res_data[0]['kode_divisi']
            this.setValueNewRows['nama_divisi'] = this.res_data[0]['nama_divisi']
          } else {
            this.setValueNewRows['kode_divisi'] = undefined
            this.setValueNewRows['nama_divisi'] = undefined
          }
          this.ref.markForCheck()

        } else if (type === "kode_departemen") {

          this.res_data[ind]['kode_departemen'] = result.kode_departemen
          this.res_data[ind]['nama_departemen'] = result.nama_departemen

          let a = this.res_data.length - 1
          for (var i = 1; i < this.res_data.length; i++) {
            if (this.res_data[0]['kode_departemen'] !== '' && this.res_data[i]['kode_departemen'] === '') {
              this.res_data[i]['kode_departemen'] = this.res_data[0]['kode_departemen']
              this.res_data[i]['nama_departemen'] = this.res_data[0]['nama_departemen']
            } else if (this.res_data[0]['kode_departemen'] === '' && this.res_data[i]['kode_departemen'] !== '') {
              for (var j = 0; j < a; j++) {
                this.res_data[j]['kode_departemen'] = this.res_data[i]['kode_departemen']
                this.res_data[j]['nama_departemen'] = this.res_data[i]['nama_departemen']
              }
            }
          }

          if (this.res_data[0]['kode_departemen'] !== '') {
            this.setValueNewRows['kode_departemen'] = this.res_data[0]['kode_departemen']
            this.setValueNewRows['nama_departemen'] = this.res_data[0]['nama_departemen']
          } else {
            this.setValueNewRows['kode_departemen'] = undefined
            this.setValueNewRows['nama_departemen'] = undefined
          }
          this.ref.markForCheck()

        }
      }
      this.dialogRef = undefined;
      this.dialogType = undefined;
    });
  }

  onBlur(d, ind, type?: any) {
    let fres = [], v = d.target.value.toUpperCase()
    if (type === "kode_departemen" && v !== "") {
      if (this.res_data[ind]['kode_divisi'] === '' || this.res_data[ind]['nama_divisi'] === '') {
        this.res_data[ind]['kode_departemen'] = ""
        this.res_data[ind]['nama_departemen'] = ""
        this.ref.markForCheck()
        this.openSnackBar("Pilih divisi terlebih dahulu.", 'info', () => {
          setTimeout(() => {
            this.openDialog(ind, 'kode_divisi')
          }, 100)
        })
        return
      } else {
        if (this.loadingDepartemen) {
          this.sendRequestDepartemen(this.gbl.getKodePerusahaan(), this.res_data[ind]['kode_divisi'], ind)
        }
      }
    }
    fres = type === "kode_akun" ? this.data_akun.filter(each => each['kode_akun'].toUpperCase() === v || (each['nama_akun'] + " - " + each['kode_akun']).toUpperCase() === v) :
      type === "kode_divisi" ? this.data_divisi.filter(each => each['kode_divisi'].toUpperCase() === v || each['nama_divisi'].toUpperCase() === v) :
        type === "kode_departemen" ? this.data_departemen.filter(each => each['kode_departemen'].toUpperCase() === v || each['nama_departemen'].toUpperCase() === v) :
          []
    if (fres.length > 0 && fres.length < 2) {
      if (type === "kode_akun") {

        this.res_data[ind]['id_akun'] = fres[0]['id_akun']
        this.res_data[ind]['kode_akun'] = fres[0]['kode_akun']
        this.res_data[ind]['nama_akun'] = fres[0]['nama_akun']
        this.res_data[ind]['keterangan_akun'] = fres[0]['nama_akun'] + " - " + fres[0]['kode_akun']

      } else if (type === "kode_divisi") {

        if (this.res_data[ind]['kode_divisi'] !== fres[0]['kode_divisi']) {
          this.res_data[ind]['kode_departemen'] = ""
          this.res_data[ind]['nama_departemen'] = ""
        }

        this.res_data[ind]['kode_divisi'] = fres[0]['kode_divisi']
        this.res_data[ind]['nama_divisi'] = fres[0]['nama_divisi']

        let a = this.res_data.length - 1
        for (var i = 1; i < this.res_data.length; i++) {
          if (this.res_data[0]['kode_divisi'] !== '' && this.res_data[i]['kode_divisi'] === '') {
            this.res_data[i]['kode_divisi'] = this.res_data[0]['kode_divisi']
            this.res_data[i]['nama_divisi'] = this.res_data[0]['nama_divisi']
          } else if (this.res_data[0]['kode_divisi'] === '' && this.res_data[i]['kode_divisi'] !== '') {
            for (var j = 0; j < a; j++) {
              this.res_data[j]['kode_divisi'] = this.res_data[i]['kode_divisi']
              this.res_data[j]['nama_divisi'] = this.res_data[i]['nama_divisi']
            }
          }
        }

        if (this.res_data[0]['kode_divisi'] !== '') {
          this.setValueNewRows['kode_divisi'] = this.res_data[0]['kode_divisi']
          this.setValueNewRows['nama_divisi'] = this.res_data[0]['nama_divisi']
        } else {
          this.setValueNewRows['kode_divisi'] = undefined
          this.setValueNewRows['nama_divisi'] = undefined
        }

      } else if (type === "kode_departemen") {

        this.res_data[ind]['kode_departemen'] = fres[0]['kode_departemen']
        this.res_data[ind]['nama_departemen'] = fres[0]['nama_departemen']

        let a = this.res_data.length - 1
        for (var i = 1; i < this.res_data.length; i++) {
          if (this.res_data[0]['kode_departemen'] !== '' && this.res_data[i]['kode_departemen'] === '') {
            this.res_data[i]['kode_departemen'] = this.res_data[0]['kode_departemen']
            this.res_data[i]['nama_departemen'] = this.res_data[0]['nama_departemen']
          } else if (this.res_data[0]['kode_departemen'] === '' && this.res_data[i]['kode_departemen'] !== '') {
            for (var j = 0; j < a; j++) {
              this.res_data[j]['kode_departemen'] = this.res_data[i]['kode_departemen']
              this.res_data[j]['nama_departemen'] = this.res_data[i]['nama_departemen']
            }
          }
        }

        if (this.res_data[0]['kode_departemen'] !== '') {
          this.setValueNewRows['kode_departemen'] = this.res_data[0]['kode_departemen']
          this.setValueNewRows['nama_departemen'] = this.res_data[0]['nama_departemen']
        } else {
          this.setValueNewRows['kode_departemen'] = undefined
          this.setValueNewRows['nama_departemen'] = undefined
        }
      }
    } else {
      if (type === "kode_akun") {
        this.res_data[ind]['id_akun'] = ""
        this.res_data[ind]['kode_akun'] = ""
        this.res_data[ind]['nama_akun'] = ""
        this.res_data[ind]['keterangan_akun'] = ""
      } else if (type === "kode_divisi") {
        this.res_data[ind]['kode_divisi'] = ""
        this.res_data[ind]['nama_divisi'] = ""
      } else if (type === "kode_departemen") {
        this.res_data[ind]['kode_departemen'] = ""
        this.res_data[ind]['nama_departemen'] = ""
      }
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

  ket(ind?, type?: any) {
    let a = this.res_data.length - 1
    if (ind !== undefined) {
      if (type === '1') {
        for (var i = 1; i < this.res_data.length; i++) {
          if (this.res_data[ind]['keterangan_1'] !== '' && this.res_data[i]['keterangan_1'] === '') {
            if (i == ind) {
              // NOT SET
            } else if (i != ind && ind != 0) {
              // NOT SET
            } else {
              this.res_data[i]['keterangan_1'] = this.res_data[0]['keterangan_1']
            }
          } else if (this.res_data[ind]['keterangan_1'] === '' && this.res_data[i]['keterangan_1'] !== '') {
            // NOT SET
          }
        }
        if (this.res_data[0]['keterangan_1'] !== '') {
          this.setValueNewRows['keterangan_1'] = this.res_data[a]['keterangan_1']
        }
      } else if (type === '2') {
        for (var i = 1; i < this.res_data.length; i++) {
          if (this.res_data[0]['keterangan_2'] !== '' && this.res_data[i]['keterangan_2'] === '') {
            if (i == ind) {
              // NOT SET
            } else if (i != ind && ind != 0) {
              // NOT SET
            } else {
              this.res_data[i]['keterangan_2'] = this.res_data[0]['keterangan_2']
            }
          } else if (this.res_data[ind]['keterangan_1'] === '' && this.res_data[i]['keterangan_1'] !== '') {
            // NOT SET
          }
        }
        if (this.res_data[0]['keterangan_2'] !== '') {
          this.setValueNewRows['keterangan_2'] = this.res_data[a]['keterangan_2']
        }
      }
    }

    this.ref.markForCheck()
  }

  countDebit(ind?) {
    let sum = 0,
      a = this.res_data.length - 1

    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['saldo_debit']))
    }

    this.total_debit = parseFloat(sum.toFixed(5))
    if (ind !== undefined) {

      if (this.jurnalType === "2") {
        // NOT SET
      } else {
        for (var i = 1; i < this.res_data.length; i++) {
          if (parseFloat(JSON.stringify(this.res_data[ind]['saldo_debit'])) > 0 && parseFloat(JSON.stringify(this.res_data[i]['saldo_debit'])) <= 0) {
            if (i == ind) {
              // NOT SET
            } else if (i != ind && ind != 0) {
              // NOT SET
            } else {
              this.res_data[i]['saldo_debit'] = this.res_data[0]['saldo_debit']
            }
          } else if (this.res_data[ind]['saldo_debit'] <= 0 && this.res_data[i]['saldo_debit'] >= 0) {

          }
        }
      }


      if (parseFloat(JSON.stringify(this.res_data[ind]['saldo_debit'])) > 0) {
        this.res_data[ind]['saldo_kredit'] = 0
        if (this.jurnalType === "0" || this.jurnalType === "1") {
          if (parseFloat(JSON.stringify(this.res_data[a]['saldo_debit'])) > 0) {
            this.setValueNewRows['saldo_debit'] = this.res_data[a]['saldo_debit']
            delete this.setValueNewRows['saldo_kredit']
            this.countDebit()
          } else {
            this.setValueNewRows['saldo_kredit'] = this.res_data[a]['saldo_kredit']
            delete this.setValueNewRows['saldo_debit']
            this.countKredit()
          }
        }
        this.countKredit(ind)
      }
    }
    this.ref.markForCheck()
  }

  countKredit(ind?) {
    let sum = 0,
      a = this.res_data.length - 1

    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['saldo_kredit']))
    }

    this.total_kredit = parseFloat(sum.toFixed(5))
    if (ind !== undefined) {

      if (this.jurnalType === "2") {
        // NOT SET
      } else {
        for (var i = 1; i < this.res_data.length; i++) {
          if (parseFloat(JSON.stringify(this.res_data[i]['saldo_kredit'])) <= 0) {
            if (i == ind) {
              // NOT SET
            } else if (i != ind && ind != 0) {
              // NOT SET
            } else {
              this.res_data[i]['saldo_kredit'] = this.res_data[0]['saldo_kredit']
            }
          } else if (this.res_data[ind]['saldo_kredit'] <= 0 && this.res_data[i]['saldo_kredit'] >= 0) {

          }
        }
      }

      if (parseFloat(JSON.stringify(this.res_data[ind]['saldo_kredit'])) > 0) {
        this.res_data[ind]['saldo_debit'] = 0
        if (this.jurnalType === "0" || this.jurnalType === "1") {
          if (parseFloat(JSON.stringify(this.res_data[a]['saldo_kredit'])) > 0) {
            this.setValueNewRows['saldo_kredit'] = this.res_data[a]['saldo_kredit']
            delete this.setValueNewRows['saldo_debit']
            this.countKredit()
          } else {
            this.setValueNewRows['saldo_debit'] = this.res_data[a]['saldo_debit']
            delete this.setValueNewRows['saldo_kredit']
            this.countDebit()
          }
        }
        this.countDebit(ind)
      }
    }
    this.ref.markForCheck()
  }

  countPercentDebit(ind?) {
    let sum = 0
    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['bobot_debit']))
    }

    this.total_debit = sum

    if (ind !== undefined) {
      if (parseFloat(JSON.stringify(this.res_data[ind]['bobot_debit'])) > 0) {
        if (this.total_debit > 100) {
          this.openSnackBar('Maksimal Total Bobot Debit adalah 100%', 'info')
          this.res_data[ind]['bobot_debit'] = 0
          this.countPercentDebit(ind)
        }

        this.res_data[ind]['bobot_kredit'] = 0
        this.countPercentKredit(ind)
      }
    }
    this.ref.markForCheck()
  }

  countPercentKredit(ind?) {
    let sum = 0
    for (var i = 0; i < this.res_data.length; i++) {
      sum = sum + parseFloat(JSON.stringify(this.res_data[i]['bobot_kredit']))
    }

    this.total_kredit = sum
    if (ind !== undefined) {
      if (parseFloat(JSON.stringify(this.res_data[ind]['bobot_kredit'])) > 0) {

        if (this.total_kredit > 100) {
          this.openSnackBar('Maksimal Total Bobot Kredit adalah 100%', 'info')
          this.res_data[ind]['bobot_kredit'] = 0
          this.countPercentKredit(ind)
        }

        this.res_data[ind]['bobot_debit'] = 0
        this.countPercentDebit(ind)
      }
    }
    this.ref.markForCheck()
  }


  addRow() {
    let d = {
      debit: this.disabled[1]['debit'],
      kredit: this.disabled[1]['kredit']
    },
      r = {
        id_akun: /* this.setValueNewRows['id_akun'] === undefined ? "" : this.setValueNewRows['id_akun'] */'',
        kode_akun: /* this.setValueNewRows['kode_akun'] === undefined ? "" : this.setValueNewRows['kode_akun'] */'',
        nama_akun: /* this.setValueNewRows['nama_akun'] === undefined ? "" : this.setValueNewRows['nama_akun'] */'',
        keterangan_akun: /* this.setValueNewRows['keterangan_akun'] === undefined ? "" : this.setValueNewRows['keterangan_akun'] */'',
        kode_divisi: this.setValueNewRows['kode_divisi'] === undefined ? "" : this.setValueNewRows['kode_divisi'],
        nama_divisi: this.setValueNewRows['nama_divisi'] === undefined ? "" : this.setValueNewRows['nama_divisi'],
        kode_departemen: this.setValueNewRows['kode_departemen'] === undefined ? "" : this.setValueNewRows['kode_departemen'],
        nama_departemen: this.setValueNewRows['nama_departemen'] === undefined ? "" : this.setValueNewRows['nama_departemen'],
        keterangan_1: this.setValueNewRows['keterangan_1'] === undefined ? "" : this.setValueNewRows['keterangan_1'],
        keterangan_2: this.setValueNewRows['keterangan_2'] === undefined ? "" : this.setValueNewRows['keterangan_2'],
        saldo_debit: this.setValueNewRows['saldo_debit'] === undefined ? 0 : this.setValueNewRows['saldo_debit'],
        saldo_kredit: this.setValueNewRows['saldo_kredit'] === undefined ? 0 : this.setValueNewRows['saldo_kredit'],
        setting_debit: '',
        setting_kredit: '',
        bobot_debit: 0,
        bobot_kredit: 0
      }
    this.res_data.push(r)
    this.disabled.push(d)
    setTimeout(() => {
      if (this.templateTransaksi) {
        this.countPercentDebit()
        this.countPercentKredit()
      } else {
        this.countDebit()
        this.countKredit()
      }
    }, 100)
  }

  deleteRow() {
    if (this.res_data.length > 2) {
      this.res_data.splice(this.res_data.length - 1, 1)
      setTimeout(() => {
        if (this.templateTransaksi) {
          this.countPercentDebit()
          this.countPercentKredit()
        } else {
          this.countDebit()
          this.countKredit()
        }
      }, 100)
    }
    if (this.disabled.length > 2) {
      this.disabled.splice(this.disabled.length - 1, 1)
    }
  }

  clearJurnalOtomatisData(i) {
    this.res_data[i]['setting_debit'] = ""
    this.res_data[i]['setting_kredit'] = ""
  }

  getData() {
    let res = {
      valid: (this.total_debit == this.total_kredit) && (this.total_debit != 0 && this.total_kredit != 0) ? true : false,
      validBobot: (this.total_debit == this.total_kredit) && (this.total_debit != 0 && this.total_kredit != 0 && this.total_debit == 100 && this.total_kredit == 100) ? true : false,
      data: this.res_data
    }
    return res
  }

  sendRequestDepartemen(kPer, kDiv, ind) {
    this.request.apiData('departemen', 'g-departemen-divisi', { kode_perusahaan: kPer, kode_divisi: kDiv }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.data_departemen = data['RESULT']
          this.loadingDepartemen = false
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_departemen") {
              this.dialog.closeAll()
              this.openDialog(ind, 'kode_departemen', false)
            }
          }
        } else {
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
          this.loadingDepartemen = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_departemen") {
              this.dialog.closeAll()
              this.openDialog(ind, 'kode_departemen')
            }
          }
        }
      }
    )
  }

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
