import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

const content = {
  beforeCodeTitle: 'Rekapitulasi Transaksi'
}

@Component({
  selector: 'kt-rekap-tran',
  templateUrl: './rekap-tran.component.html',
  styleUrls: ['./rekap-tran.component.scss', '../laporan.style.scss']
})
export class RekapTranComponent implements OnInit, AfterViewInit {

  // VIEW CHILD
  @ViewChild(ForminputComponent, { static: false }) forminput;

  // =========================================VARIABLE=============================
  // AKSES PERUSAHAAN
  kode_perusahaan: any // Get Kode Perusahaan
  nama_perusahaan: any // Get Nama Perusahaan
  subs_perusahaan: any // Subscription Perusahaan
  // SELECT JENIS TRANSAKSI
  tipe_laporan = [
    {
      label: 'KAS',
      value: 'k'
    },
    {
      label: 'GIRO',
      value: 'g'
    },
    {
      label: 'KAS & GIRO',
      value: 'kg'
    },
    {
      label: 'BANK',
      value: 'b'
    },
    {
      label: 'PETTY CASH',
      value: 'pc'
    },

  ]
  // SELECT FORMAT LAPORAN
  format_laporan = [
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    },
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    }
  ]
  // TEMPLATE REPORT
  lookupComp: any
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }
  reportObj = {}
  // KEY REPORT
  keyReportFormatExcel: any
  checkKeyReport = {}
  // OTHERS
  content: any
  loading: boolean = true
  loadingReport: boolean = false
  cabang_utama: any
  periode_kasir: any
  nama_tombol: any;
  dialogRef: any;
  dialogType: string = null
  listAkunTransaksi: any = []
  listSelectAkun: any = []


  // CABANG DIALOG
  inputCabangDisplayColumns = [
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  inputCabangInterface = {}
  inputCabangData = []
  inputCabangDataRules = []

  // BANK DIALOG
  inputBankDisplayColumns = [
    {
      label: 'Kode Bank',
      value: 'kode_bank'
    },
    {
      label: 'Nama Bank',
      value: 'nama_bank'
    }
  ]
  inputBankInterface = {}
  inputBankData = []
  inputBankDataRules = []

  // REKENING DIALOG
  inputRekeningDisplayColumns = [
    {
      label: 'Cabang Perusahaan',
      value: 'nama_cabang'
    },
    {
      label: 'No Rekening',
      value: 'no_rekening'
    },
    {
      label: 'Atas Nama',
      value: 'atas_nama'
    },
    {
      label: 'Nama Kantor Cabang',
      value: 'nama_kantor_cabang'
    }
  ]
  inputRekeningInterface = {}
  inputRekeningData = []
  inputRekeningDataRules = []

  // INPUT VALUE DEFAULT
  formValue = {
    tipe_laporan: 'k',
    format_laporan: 'xlsx',
    kode_cabang: '',
    nama_cabang: '',
    kode_bank: '',
    nama_bank: '',
    no_rekening: '',
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    periode: [
      {
        year: new Date(Date.now()).getFullYear(),
        month: new Date(Date.now()).getMonth() + 1,
        day: new Date(Date.now()).getDate()
      },
      {
        year: new Date(Date.now()).getFullYear(),
        month: new Date(Date.now()).getMonth() + 1,
        day: new Date(Date.now()).getDate()
      }
    ]
  }

  // FORM LAYOUT
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Tipe Laporan',
      id: 'tipe-laporan',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'tipe_laporan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (value) => {
        if (value !== 'b') {
          this.forminput.updateFormValue('kode_bank', '')
          this.forminput.updateFormValue('nama_bank', '')
          this.forminput.updateFormValue('no_rekening', '')
        }
      },
    },
    {
      formWidth: 'col-5',
      label: 'Format Laporan',
      id: 'format-laporan',
      type: 'combobox',
      options: this.format_laporan,
      valueOf: 'format_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: true,
      readOnly: false,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      blurOption: {
        ind: 'kode_cabang',
        data: [],
        valueOf: ['kode_cabang', 'nama_cabang'],
        onFound: () => {
          if (this.formValue.kode_cabang !== '') {
            if (this.formValue.kode_cabang !== this.forminput.getData()['kode_cabang']) {
              this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
              this.formValue.nama_cabang = this.forminput.getData()['nama_cabang']
              // CHANGES PERIODE KASIR
              this.filterPeriodeKasir(this.formValue.kode_cabang)
              // CHANGES REKENING
              this.forminput.updateFormValue('no_rekening', '')
            }
          }
        }
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Bank',
      id: 'kode-bank',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_bank',
      valueOf: 'kode_bank',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-bank',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_bank'
      },
      blurOption: {
        ind: 'kode_bank',
        data: [],
        valueOf: ['kode_bank', 'nama_bank'],
        onFound: () => {
          if (this.formValue.kode_bank !== this.forminput.getData()['kode_bank']) {
            this.formValue.kode_bank = this.forminput.getData()['kode_bank']
            this.formValue.nama_bank = this.forminput.getData()['nama_bank']
            // CHANGES REKENING
            this.forminput.updateFormValue('no_rekening', '')
          }
        }
      },
      hiddenOn: {
        valueOf: 'tipe_laporan',
        matchValue: ['k', 'g', 'kg', 'pc']
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Rekening',
      id: 'no-rekening',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'no_rekening',
      valueOf: 'no_rekening',
      required: false,
      readOnly: true,
      blurOption: {
        ind: 'no_rekening',
        data: [],
        valueOf: ['no_rekening'],
        onFound: () => null
      },
      hiddenOn: {
        valueOf: 'tipe_laporan',
        matchValue: ['k', 'g', 'kg', 'pc']
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker-range',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
      minDate: () => {
        let dt = new Date(Date.now())
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: dt.getDate()
        }
      },
      maxDate: () => {
        let dt = new Date(Date.now())
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: dt.getDate()
        }
      }
    }
  ]

  // L.o.V (List of Values) Variable
  displayColAkunLov = [ // Tampil kolom di L.o.V Akun
    {
      label: 'Kode Akun',
      value: 'kode_akun',
      selectable: true
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
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
    this.nama_tombol = 'Lihat Laporan'
    this.gbl.need(true, false)
    this.getImpData()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()
    this.nama_perusahaan = this.gbl.getNamaPerusahaan()

    if (this.kode_perusahaan !== '') {
      this.getImpData()
    }
  }

  ngOnDestroy(): void {
    this.subs_perusahaan === undefined ? null : this.subs_perusahaan.unsubscribe()
  }

  // IMPORTANT DATA
  getImpData() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.lookupComp = data['RESULT']
            // for (var i = 0; i < data['RESULT'].length; i++) {
            //   if (data['RESULT'][i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN') {
            //     this.info_company.alamat = data['RESULT'][i]['nilai1']
            //   }
            //   if (data['RESULT'][i]['kode_lookup'] === 'KOTA-PERUSAHAAN') {
            //     this.info_company.kota = data['RESULT'][i]['nilai1']
            //   }
            //   if (data['RESULT'][i]['kode_lookup'] === 'TELEPON-PERUSAHAAN') {
            //     this.info_company.telepon = data['RESULT'][i]['nilai1']
            //   }
            // }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

      this.request.apiData('bank', 'g-bank', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputBankData = data['RESULT']
            this.gbl.updateInputdata(data['RESULT'], 'kode_bank', this.inputLayout)
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar bank. Mohon coba lagi nanti.', 'fail')
          }
        }
      )

      this.request.apiData('rekening-perusahaan', 'g-rekening-perusahaan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputRekeningData = data['RESULT']
            this.gbl.updateInputdata(data['RESULT'], 'no_rekening', this.inputLayout)
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar rekening perusahaan. Mohon coba lagi nanti.', 'fail')
          }
        }
      )

      // this.request.apiData('akun', 'g-jenis-tran-by-tipe', { kode_perusahaan: this.kode_perusahaan, tipe_laporan: 'p' }).subscribe(
      //   data => {
      //     if (data['STATUS'] === 'Y') {
      //       this.listAkunTransaksi = data['RESULT']
      //       this.ref.markForCheck()
      //     } else {
      //       this.gbl.openSnackBar('Gagal mendapatkan daftar akun. Mohon coba lagi nanti.', 'fail')
      //       this.ref.markForCheck()
      //     }
      //   }
      // )

      this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayout)

            // DUPLICATE DATA CABANG
            let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData))

            // SET CABANG UTAMA
            this.ref.markForCheck()
            this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}
            this.formValue.kode_cabang = this.cabang_utama.kode_cabang
            this.formValue.nama_cabang = this.cabang_utama.nama_cabang
            this.getPeriodeKasir()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
          }
        }
      )
    }
  }

  getPeriodeKasir() {
    this.request.apiData('periode', 'g-periode-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.periode_kasir = data['RESULT']
          this.ref.markForCheck()
          this.filterPeriodeKasir(this.formValue.kode_cabang)
          this.loading = false
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar periode kasir. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  filterPeriodeKasir(cabang) {
    let filter_data = JSON.parse(JSON.stringify(this.periode_kasir)),
      periode = filter_data.filter(x => x['kode_cabang'] === cabang), perMin = '', perMax = ''
    for (var i = 0; i < periode.length; i++) {
      if (perMin === '') {
        perMin = periode[i]['tgl_periode']
      }

      if (perMax === '') {
        perMax = periode[i]['tgl_periode']
      }

      if (new Date(periode[i]['tgl_periode']).getTime() < new Date(perMin).getTime()) {
        perMin = periode[i]['tgl_periode']
      }

      if (new Date(periode[i]['tgl_periode']).getTime() > new Date(perMax).getTime()) {
        perMax = periode[i]['tgl_periode']
      }
    }

    this.ref.markForCheck()
    this.inputLayout.splice(5, 1, {
      formWidth: 'col-5',
      label: 'Periode',
      id: 'periode',
      type: 'datepicker-range',
      valueOf: 'periode',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: true,
      enableMax: true,
      minDate: () => {
        let dt = new Date(perMin)
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: 1
        }
      },
      maxDate: () => {
        let dt = new Date(perMax)
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: (dt.getMonth() + 1) == 2 ? this.gbl.leapYear(dt.getFullYear()) == false ? 28 : 29 :
            (
              (dt.getMonth() + 1) == 1 ||
              (dt.getMonth() + 1) == 3 ||
              (dt.getMonth() + 1) == 5 ||
              (dt.getMonth() + 1) == 7 ||
              (dt.getMonth() + 1) == 8 ||
              (dt.getMonth() + 1) == 10 ||
              (dt.getMonth() + 1) == 12
            ) ? 31 : 30
        }
      }
    })
  }

  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValue = this.forminput.getData()

      let
        // TANGGAL PERIODE AWAL
        tgl_periode_awal =
          JSON.stringify(this.formValue['periode'][0]['year']) + '-' + (JSON.stringify(this.formValue['periode'][0]['month']).length > 1 ?
            JSON.stringify(this.formValue['periode'][0]['month']) :
            '0' + JSON.stringify(this.formValue['periode'][0]['month'])) + '-' + (JSON.stringify(this.formValue['periode'][0]['day']).length > 1 ?
              JSON.stringify(this.formValue['periode'][0]['day']) :
              '0' + JSON.stringify(this.formValue['periode'][0]['day'])),
        // TANGGAL PERIODE AKHIR
        tgl_periode_akhir =
          JSON.stringify(this.formValue['periode'][1]['year']) + '-' + (JSON.stringify(this.formValue['periode'][1]['month']).length > 1 ?
            JSON.stringify(this.formValue['periode'][1]['month']) :
            '0' + JSON.stringify(this.formValue['periode'][1]['month'])) + '-' + (JSON.stringify(this.formValue['periode'][1]['day']).length > 1 ?
              JSON.stringify(this.formValue['periode'][1]['day']) : '0' + JSON.stringify(this.formValue['periode'][1]['day'])),
        // KEY REPORT
        rk = this.formValue['tipe_laporan'] + this.formValue['kode_cabang'] + this.formValue['kode_bank'] + this.formValue['no_rekening'] + tgl_periode_awal + tgl_periode_akhir + this.formValue['format_laporan']
      this.getReport(rk, tgl_periode_awal, tgl_periode_akhir)
    }
  }

  getReport(repKey, fPeriod, lPeriod) {
    this.loading = true
    if (this.checkKeyReport[repKey] !== undefined) {
      if (this.formValue['format_laporan'] === 'pdf') {
        window.open('http://deva.darkotech.id:8704/report/viewer.html?repId=' + this.checkKeyReport[repKey], '_blank')
      } else {
        if (this.formValue['format_laporan'] === 'xlsx') {
          this.keyReportFormatExcel = this.checkKeyReport[repKey] + '.xlsx'
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        } else {
          this.keyReportFormatExcel = this.checkKeyReport[repKey] + '.xls'
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
      }
      this.ref.markForCheck()
      this.loading = false
    } else {
      for (var i = 0; i < this.lookupComp.length; i++) {
        if (this.lookupComp[i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValue['kode_cabang']) {
          this.info_company.alamat = this.formValue['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
        }
        if (this.lookupComp[i]['kode_lookup'] === 'KOTA-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValue['kode_cabang']) {
          this.info_company.kota = this.formValue['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
        }
        if (this.lookupComp[i]['kode_lookup'] === 'TELEPON-PERUSAHAAN' && this.lookupComp[i]['kode_cabang'] === this.formValue['kode_cabang']) {
          this.info_company.telepon = this.formValue['kode_cabang'] !== "" ? this.lookupComp[i]['nilai1'] : ""
        }
      }

      
      
      let endRes = Object.assign(
        {
          kode_perusahaan: this.kode_perusahaan,
          nama_perusahaan: this.nama_perusahaan,
          tgl_periode_awal: fPeriod,
          tgl_periode_akhir: lPeriod,
          user_name: localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name'),
          company_adress: this.info_company.alamat,
          company_city: this.info_company.kota,
          company_contact: this.info_company.telepon
        },
        this.formValue)
      this.request.apiData('report', 'g-data-rekapitulasi', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (this.formValue.format_laporan === 'pdf') {
              window.open('http://deva.darkotech.id:8704/report/viewer.html?repId=' + data['RESULT'], '_blank')
            } else {
              if (this.formValue.format_laporan === 'xlsx') {
                this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
                setTimeout(() => {
                  let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement
                  sbmBtn.click();
                }, 100)
              } else {
                this.keyReportFormatExcel = data['RESULT'] + '.xls'
                setTimeout(() => {
                  let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement
                  sbmBtn.click();
                }, 100)
              }
            }
            this.ref.markForCheck()
            let rk = this.formValue['tipe_laporan'] + this.formValue['kode_cabang'] + this.formValue['kode_bank'] + this.formValue['no_rekening'] + fPeriod + lPeriod + this.formValue['format_laporan']
            this.checkKeyReport[rk] = data['RESULT']
            this.loading = false
          } else {
            this.ref.markForCheck()
            this.loading = false
            this.gbl.openSnackBar('Gagal mendapatkan laporan.', 'fail')
          }
        }
      )
    }
  }

  openDialog(type) {
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '65vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === 'kode_cabang' ? this.inputCabangInterface :
            type === 'kode_bank' ? this.inputBankInterface :
              type === 'no_rekening' ? this.inputRekeningInterface :
                {},
        displayedColumns:
          type === 'kode_cabang' ? this.inputCabangDisplayColumns :
            type === 'kode_bank' ? this.inputBankDisplayColumns :
              type === 'no_rekening' ? this.inputRekeningDisplayColumns :
                [],
        tableData:
          type === 'kode_cabang' ? this.inputCabangData :
            type === 'kode_bank' ? this.inputBankData :
              type === 'no_rekening' ?
                this.formValue.kode_cabang === '' ?
                  this.inputRekeningData.filter(x => x['kode_bank'] === this.formValue.kode_bank) :
                  this.inputRekeningData.filter(x => x['kode_cabang'] === this.formValue.kode_cabang && x['kode_bank'] === this.formValue.kode_bank) :
                [],
        tableRules:
          type === 'kode_cabang' ? this.inputCabangDataRules :
            type === 'kode_bank' ? this.inputBankDataRules :
              type === 'no_rekening' ? this.inputRekeningDataRules :
                [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'kode_cabang') {
          if (this.forminput !== undefined) {
            if (this.formValue.kode_cabang !== result.kode_cabang) {
              if (this.formValue.kode_cabang !== '') {
                // CHANGES REKENING
                this.forminput.updateFormValue('no_rekening', '')
              }
              this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
              this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
              this.formValue.kode_cabang = result.kode_cabang
              this.formValue.nama_cabang = result.nama_cabang
              // CHANGES PERIODE KASIR
              this.filterPeriodeKasir(result.kode_cabang)
            }
          }
        } else if (type === "kode_bank") {
          if (this.forminput !== undefined) {
            if (this.formValue.kode_bank !== result.kode_bank) {
              this.forminput.updateFormValue('kode_bank', result.kode_bank)
              this.forminput.updateFormValue('nama_bank', result.nama_bank)
              this.formValue.kode_bank = result.kode_bank
              this.formValue.nama_bank = result.nama_bank
              // CHANGES REKENING
              this.forminput.updateFormValue('no_rekening', '')
            }
          }
        } else if (type === "no_rekening") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('no_rekening', result.no_rekening)
          }
        }
        this.ref.markForCheck()
      }
    })
  }

  inputGroup(type?: any) {
    let input,
      data = [
        {
          type: type,
          title: type === 'kode_akun' ? 'Data Akun'
            : '',
          columns: type === 'kode_akun' ? this.displayColAkunLov
            : '',
          contain: type === 'kode_akun' ? this.listAkunTransaksi
            : '',
          rules: [],
          interface: {},
          statusSelectable: true,
          listSelectBox: type === 'kode_akun' ? this.listSelectAkun :
            [],
          selectIndicator: type === 'kode_akun' ? 'kode_akun'
            : ''
        },
      ], setting = {
        width: '50vw',
        posTop: '30px'
      }
    input = this.gbl.openDialog(type, data, this.forminput, setting)

    input.afterClosed().subscribe(
      result => {
        if (result) {
          this.ref.markForCheck()
          if (type === 'kode_akun') {
            this.restructureDetailData('akun', result, 'change')
          }
        }
      }
    )
  }

  restructureDetailData(type, data, dataConf) {
    this.ref.markForCheck()
    let endRes = [],
      bindData = []

    if (dataConf === 'default') {
      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < bindData.length; j++) {
          if (data[i]['id_akun'] === bindData[j]['id_akun']) {
            let x = {
              id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`,
              id_akun: data[i]['id_akun'],
              kode_akun: bindData[j]['kode_akun'],
              nama_akun: bindData[j]['nama_akun'],
            }
            endRes.push(x)
            break;
          }
        }
      }
      this.listSelectAkun = endRes
    } else {
      bindData = this.listSelectAkun

      for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < bindData.length; j++) {
          if (data[i]['id_akun'] === bindData[j]['id_akun']) {
            data[i] = bindData[j]
          }
        }
      }
      bindData.splice(0, bindData.length)
      for (var i = 0; i < data.length; i++) {
        if (data[i]['id'] === '' || data[i]['id'] == null || data[i]['id'] === undefined) {
          data[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
            length: 8,
            numeric: true,
            letters: false,
            special: false
          }))}`
        }
        bindData.push(data[i])
      }
      this.listSelectAkun = bindData
    }

  }
}
