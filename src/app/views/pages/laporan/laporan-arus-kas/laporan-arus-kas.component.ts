import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Laporan Arus Kas'
}

@Component({
  selector: 'kt-laporan-arus-kas',
  templateUrl: './laporan-arus-kas.component.html',
  styleUrls: ['./laporan-arus-kas.component.scss', '../laporan.style.scss']
})
export class LaporanArusKasComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  tipe = [
    {
      label: 'Tahunan',
      value: 't'
    },
    {
      label: 'Bulanan',
      value: 'b'
    }
  ]

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
    },
  ]

  jenis_laporan = [
    {
      label: 'Rekap',
      value: '0'
    },
    {
      label: 'Perincian',
      value: '1'
    }
  ]

  metode_laporan = [
    {
      label: 'Langsung',
      value: '1'
    },
    {
      label: 'Tidak Langsung',
      value: '0'
    }
  ]

  // VARIABLES
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingAK: boolean = false;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  browseNeedUpdate: boolean = true;
  search: string;
  dialogRef: any;
  dialogType: string = null;
  cabang_utama: any;

  // REPORT
  reportObj = {
    REPORT_COMPANY: "",
    REPORT_CODE: "DOK-DELIVERY-ORDER",
    REPORT_NAME: "Delivery Order",
    REPORT_FORMAT_CODE: "pdf",
    JASPER_FILE: "rptDokDeliveryOrder.jasper",
    REPORT_PARAMETERS: {
    },
    FIELD_NAME: [
      "noTran",
      "tglTran",
      "kodePengirim",
      "namaPengirim",
      "alamatPengirim",
      "kotaPengirim",
      "teleponPengirim",
      "kodePenerima",
      "namaPenerima",
      "alamatPenerima",
      "kotaPenerima",
      "teleponPenerima",
      "noResi",
      "namaBarang",
      "jumlahBarang"
    ],
    FIELD_TYPE: [
      "string",
      "date",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "bigdecimal"
    ],
    FIELD_DATA: []
  }

  // INFO PERUSAHAAN
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

  // PERIODE
  inputPeriodeData = [];
  submitPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  initBulan: any = [];
  bulanAK: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueAK = {
    format_laporan: 'xlsx',
    metode_laporan: '1',
    jenis_laporan: '0',
    kode_cabang: '',
    nama_cabang: '',
    tipe: 't',
    tahun: '',
    bulan: '',
    periode_berjarak: ''
  }

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
  inputCabangInterface = {
    kode_cabang: 'string',
    nama_cabang: 'string'
  }
  inputCabangData = []
  inputCabangDataRules = []

  // Layout Form
  inputLayoutAK = [
    {
      // labelWidth: 'col-4',
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
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporan,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Metode Laporan',
      id: 'metode-laporan',
      type: 'combobox',
      options: this.metode_laporan,
      valueOf: 'metode_laporan',
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
        onFound: () => null
      },
      update: {
        disabled: true
      }
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Tipe',
      id: 'tipe',
      type: 'combobox',
      options: this.tipe,
      valueOf: 'tipe',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.tahun,
      onSelectFunc: (filterBulan) => this.getBulan(filterBulan, ''),
      valueOf: 'tahun',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Bulan Periode',
      id: 'bulan-periode',
      type: 'combobox',
      options: this.bulanAK,
      valueOf: 'bulan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
      hiddenOn: {
        valueOf: 'tipe',
        matchValue: "t"
      },

      // Combobox Options
      opt_input: true,
      opt_label: 'Periode Berjarak',
      opt_id: 'periode-berjarak',
      opt_type: 'opt_combobox',
      opt_options: this.bulanAK,
      opt_valueOf: 'periode_berjarak',
      onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
    }
  ]

  checkKeyReport = {}

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
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  onSubmitAK(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValueAK = this.forminput.getData()
      if (this.formValueAK.tipe === 't') {
        if (this.formValueAK.tahun === '' || this.formValueAK.tahun == undefined) {
          this.gbl.openSnackBar("tahun periode belum diisi", 'info')
        } else {
          this.getRpt()
        }
      } else if (this.formValueAK.tipe === 'b') {
        if (
          (this.formValueAK.tahun === '' || this.formValueAK.tahun == undefined) &&
          (this.formValueAK.bulan === '' || this.formValueAK.bulan == undefined) &&
          (this.formValueAK.periode_berjarak === '' || this.formValueAK.periode_berjarak == undefined)) {
          this.gbl.openSnackBar("tahun atau bulan periode belum diisi", 'info')
        } else {
          this.getRpt()
        }
      }
    }
  }

  getRpt() {
    this.loading = true
    this.ref.markForCheck()
    let rk = this.formValueAK['metode_laporan'] + this.formValueAK['tahun'] + this.formValueAK['bulan'] + this.formValueAK['periode_berjarak'] + this.formValueAK['kode_cabang'] + this.formValueAK['format_laporan'] + this.formValueAK['jenis_laporan']
    if (this.checkKeyReport[rk] !== undefined) {
      if (this.formValueAK['format_laporan'] === 'pdf') {
        window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
      } else {
        if (this.formValueAK['format_laporan'] === 'xlsx') {
          this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        } else {
          this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
      }
      this.loading = false
      this.ref.markForCheck()
    } else {
      let p = {}
      // for (var i = 0; i < this.submitPeriodeData.length; i++) {
      //   if (
      //     (typeof this.formValueAK.bulan === "number" ? JSON.stringify(this.formValueAK.bulan) : this.formValueAK.bulan) === JSON.stringify(this.submitPeriodeData[i]['bulan_periode']) &&
      //     (typeof this.formValueAK.tahun === "number" ? JSON.stringify(this.formValueAK.tahun) : this.formValueAK.tahun) === JSON.stringify(this.submitPeriodeData[i]['tahun_periode'])
      //   ) {
      //     p = JSON.parse(JSON.stringify(this.submitPeriodeData[i]))
      //     break
      //   }
      // }

      // if (p['id_periode'] !== undefined) {
      p['format_laporan'] = this.formValueAK['format_laporan']
      p['jenis_laporan'] = this.formValueAK['jenis_laporan']
      p['kode_perusahaan'] = this.kode_perusahaan
      if (this.formValueAK['tipe'] === "t") {
        if (this.getTahunTerendah() == parseInt(p['tahun_periode'])) {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.openSnackBar('Tahun periode merupakan tahun terakhir yang terdaftar.', 'info')
          return
        }
        p['tahun_periode_sebelum'] = JSON.stringify(parseInt(p['tahun_periode']) - 1)
        p['bulan_periode'] = "12"
        p['bulan_periode_sebelum'] = this.getBulanTertinggi(p['tahun_periode_sebelum'])
        p['kode_cabang'] = this.formValueAK['kode_cabang'] === "" ? undefined : this.formValueAK['kode_cabang']
        p['id_akun'] = this.formValueAK['id_akun'] === "" ? undefined : this.formValueAK['id_akun']
      } else if (this.formValueAK['tipe'] === "b") {
        if (p['bulan_periode'] === "1") {
          if (this.getTahunTerendah() == parseInt(p['tahun_periode'])) {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Tahun periode merupakan tahun terakhir yang terdaftar.', 'info')
            return
          }
          p['tahun_periode_sebelum'] = JSON.stringify(parseInt(p['tahun_periode']) - 1)
          p['bulan_periode_sebelum'] = JSON.stringify(this.getBulanTertinggi(p['tahun_periode_sebelum']))
        } else {
          if (this.getBulanTerendah(p['tahun_periode']) == parseInt(p['bulan_periode']) && this.formValueAK.metode_laporan === '0') {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Bulan periode merupakan bulan terakhir yang terdaftar.', 'info')
            return
          }
          p['bulan_periode_sebelum'] = JSON.stringify(parseInt(p['bulan_periode']) - 1)
          p['tahun_periode_sebelum'] = p['tahun_periode']
        }
      }
      p['nama_perusahaan'] = this.gbl.getNamaPerusahaan()
      // p['report_format_code'] = this.formValueAK.format_laporan
      p['tipe_periode'] = this.formValueAK.tipe
      p['jenis_laporan'] = this.formValueAK.jenis_laporan
      p['periode_from'] = this.formValueAK.tipe === 'b' ? +this.formValueAK.bulan.length > 1 ? this.formValueAK.bulan : "0" + this.formValueAK.bulan : ''
      p['periode_to'] = this.formValueAK.tipe === 'b' ? +this.formValueAK.periode_berjarak.length > 1 ? this.formValueAK.periode_berjarak : "0" + this.formValueAK.periode_berjarak : ''
      p['tahun_periode'] = this.formValueAK['tahun'].toString()
      p['kode_cabang'] = this.formValueAK['kode_cabang'] === "" ? undefined : this.formValueAK['kode_cabang']
      p['nama_cabang'] = this.formValueAK['nama_cabang'] === "" ? undefined : this.formValueAK['nama_cabang']
      p['bulan_periode_sebelum'] = p['bulan_periode_sebelum'].length > 1 ? p['bulan_periode_sebelum'] : "0" + p['bulan_periode_sebelum']
      p['company_adress'] = this.info_company.alamat
      p['company_city'] = this.info_company.kota
      p['company_contact'] = this.info_company.telepon
      p['user_name'] = localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
      this.request.apiData('report', this.formValueAK.metode_laporan === '1' ? 'g-data-arus-kas-langsung' : 'g-data-arus-kas', p).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let z = data['RESULT']
            /*  if (this.formValueAK.metode_laporan === '1') {
               if (this.formValueAK.format_laporan === 'pdf') {
                 window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + data['RESULT'], "_blank");
               } else {
                 if (this.formValueAK.format_laporan === 'xlsx') {
                   this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
                   setTimeout(() => {
                     let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                     sbmBtn.click();
                   }, 100)
                 } else {
                   this.keyReportFormatExcel = data['RESULT'] + '.xls'
                   setTimeout(() => {
                     let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                     sbmBtn.click();
                   }, 100)
                 }
               }
               let rk = this.formValueAK['metode_laporan'] + this.formValueAK['tahun'] + this.formValueAK['bulan'] + this.formValueAK['periode_berjarak'] + this.formValueAK['kode_cabang'] + this.formValueAK['format_laporan'] + this.formValueAK['jenis_laporan']
               this.checkKeyReport[rk] = data['RESULT']
               this.distinctPeriode()
               this.ref.markForCheck()
             } else {
               r = JSON.parse(z['res']), res = [], nRes = [], dLR = {}, totalTipe = {}, totalAktivitasKas = 0, saldoAwalKas = 0, saldoAkhirKas = 0
               saldoAwalKas = parseFloat(z['saldo_awal'])
               for (var x = 0; x < r.length; x++) {
                 let d = r[x]['data']
                 for (var i = 0; i < d.length; i++) {
                   for (var j = 0; j < d.length; j++) {
                     if (
                       (
                         (parseInt(d[i]['tahun']) > parseInt(d[j]['tahun'])) ||
                         (d[i]['tahun'] === d[i]['tahun'] && parseInt(d[i]['bulan']) > parseInt(d[j]['bulan']))
                       ) &&
                       d[i]['id_akun'] === d[j]['id_akun'] &&
                       d[i]['group'] === d[j]['group']
                     ) {
                       let t = JSON.parse(JSON.stringify(d[i]))
                       if (d[i]['group'] === 'AKTIVA-LANCAR' || d[i]['group'] === 'AKTIVA-TETAP') {
                         t['saldo_akhir'] = (t['saldo_akhir'] - d[j]['saldo_akhir']) * -1
                       } else {
                         t['saldo_akhir'] = t['saldo_akhir'] - d[j]['saldo_akhir']
                       }
                       t['class'] = r[x]['value']
                       t['className'] = r[x]['label']
                       nRes.push(t)
                     }
                   }

                   if (d[i]['id_akun'] === 'LBRG') {
                     dLR = d[i]
                     dLR['class'] = r[x]['value']
                     dLR['className'] = r[x]['label']
                   }
                 }
               }

               nRes.splice(0, 0, dLR)

               for (var i = 0; i < nRes.length; i++) {
                 if (totalTipe[nRes[i]['class']]) {
                   totalTipe[nRes[i]['class']] = totalTipe[nRes[i]['class']] + parseFloat(nRes[i]['saldo_akhir'])
                 } else {
                   totalTipe[nRes[i]['class']] = parseFloat(nRes[i]['saldo_akhir'])
                 }
               }

               for (var prop in totalTipe) {
                 if (totalTipe.hasOwnProperty(prop)) {
                   totalAktivitasKas = totalAktivitasKas + totalTipe[prop]
                 }
               }

               for (var i = 0; i < nRes.length; i++) {
                 let t = []

                 t.push(nRes[i]['class'])
                 t.push(nRes[i]['className'])
                 t.push(nRes[i]['kode_akun'])
                 t.push(nRes[i]['kode_akun'] === "LBRG" ? nRes[i]['nama_akun'] : nRes[i]['saldo_akhir'] > 0 ? "Kenaikkan " + nRes[i]['nama_akun'] : "Penurunan " + nRes[i]['nama_akun'])
                 t.push(nRes[i]['saldo_akhir'])
                 t.push(totalTipe[nRes[i]['class']])

                 res.push(t)
               }

               Check range or not
               let repPeriod;

               if (p['bulan_periode'] === p['periode_berjarak']) {
                 repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
               } else {
                 repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode'] + " - " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['periode_berjarak']))) + " " + p['tahun_periode']
               }

               Set Report
               let rp = JSON.parse(JSON.stringify(this.reportObj))
               rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
               rp['REPORT_CODE'] = 'RPT-ARUS-KAS'
               rp['REPORT_NAME'] = 'Laporan Arus Kas'
               rp['REPORT_FORMAT_CODE'] = this.formValueAK['format_laporan']
               rp['JASPER_FILE'] = 'rptArusKas.jasper'
               rp['REPORT_PARAMETERS'] = {
                 USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
                 REPORT_COMPANY_ADDRESS: this.info_company.alamat,
                 REPORT_COMPANY_CITY: this.info_company.kota,
                 REPORT_COMPANY_TLPN: this.info_company.telepon,
                 REPORT_PERIODE: repPeriod,
                 TOTAL_AKTIVITAS_KAS: this.format(totalAktivitasKas, 2, 3, ".", ","),
                 SALDO_AWAL_KAS: this.format(saldoAwalKas, 2, 3, ".", ","),
                 SALDO_AKHIR_KAS: this.format(saldoAwalKas + totalAktivitasKas, 2, 3, ".", ",")
               }
               rp['FIELD_TITLE'] = [
                 "Tipe",
                 "Nama Tipe",
                 "Kode Akun",
                 "Nama Akun",
                 "Saldo",
                 "Total Tipe Saldo"
               ]
               rp['FIELD_NAME'] = [
                 "tipe",
                 "namaTipe",
                 "kodeAkun",
                 "namaAkun",
                 "saldo",
                 "totalTipeSaldo"
               ]
               rp['FIELD_TYPE'] = [
                 "string",
                 "string",
                 "string",
                 "string",
                 "bigdecimal",
                 "bigdecimal"
               ]
               rp['FIELD_DATA'] = res
               p['bulan_periode'] = +p['bulan_periode']
             } */
            this.sendGetReport(z, this.formValueAK['format_laporan'])
          } else {
            // p['bulan_periode'] = +p['bulan_periode']
            this.gbl.openSnackBar('Gagal mendapatkan data arus kas.', 'fail')
            this.distinctPeriode()
            this.ref.markForCheck()
          }
        }
      )
      // }
    }
  }

  //Reset Value
  resetFormAK() {
    this.formValueAK = {
      format_laporan: 'xlsx',
      jenis_laporan: '0',
      metode_laporan: this.formValueAK['metode_laporan'],
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tipe: 't',
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'],
      periode_berjarak: this.activePeriod['bulan_to']
    }

    this.bulanAK = this.initBulan[this.formValueAK['tahun']]
    this.inputLayoutAK.splice(6, 5,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanAK,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
        hiddenOn: {
          valueOf: 'tipe',
          matchValue: "t"
        },

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanAK,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }

    )

    this.loadingAK = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingAK = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel() {
    this.resetFormAK()
  }

  openDialog(type) {
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "kode_cabang" ? this.inputCabangInterface :
            {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            [],
        formValue: this.formValueAK
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            for (var i = 0; i < data['RESULT'].length; i++) {
              if (data['RESULT'][i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN') {
                this.info_company.alamat = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'KOTA-PERUSAHAAN') {
                this.info_company.kota = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'TELEPON-PERUSAHAAN') {
                this.info_company.telepon = data['RESULT'][i]['nilai1']
              }
            }
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            this.submitPeriodeData = Array.from(data['RESULT'])
            if (this.inputPeriodeData.length > 0) {
              // this.activePeriod = this.inputPeriodeData.filter(x => x.aktif === '1')[0] || {}

              this.activePeriod = {
                tahun_periode: this.getTahunTertinggi(),
                bulan_periode: this.getBulanTerendah(this.getTahunTertinggi()),
                bulan_to: this.getBulanTertinggi(this.getTahunTertinggi())
              }
            }
            this.distinctPeriode()
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
          }
        }
      )
    }
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.gbl.openSnackBar(message, 'success')
  }

  sendGetReport(p, type) {
    // this.request.apiData('report', 'g-report', p).subscribe(
    //   data => {
    //     if (data['STATUS'] === 'Y') {
    if (type === 'pdf') {
      window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + p, "_blank");
    } else {
      if (type === 'xlsx') {
        this.keyReportFormatExcel = p + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.keyReportFormatExcel = p + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
    }
    let rk = this.formValueAK['tahun'] + this.formValueAK['bulan'] + this.formValueAK['periode_berjarak'] + this.formValueAK['kode_cabang'] + this.formValueAK['format_laporan'] + this.formValueAK['jenis_laporan']
    this.checkKeyReport[rk] = p
    this.distinctPeriode()
    this.ref.markForCheck()
    //     } else {
    //       this.gbl.topPage()
    //       this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
    //       this.distinctPeriode()
    //       this.ref.markForCheck()
    //     }
    //   }
    // )
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  //Date Functions
  getDateNow() {
    // let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date().getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }

  distinctPeriode() {
    // Variable
    let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData)),
      x = [];

    // Cabang Utama User
    this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}

    var flags = [],
      outputTahun = [];

    for (var i = 0; i < this.inputPeriodeData.length; i++) {
      if (flags[this.inputPeriodeData[i]['tahun_periode']]) continue;
      flags[this.inputPeriodeData[i]['tahun_periode']] = true;
      x.push(this.inputPeriodeData[i]['tahun_periode'])
      outputTahun.push({
        label: this.inputPeriodeData[i]['tahun_periode'],
        value: this.inputPeriodeData[i]['tahun_periode']
      });
    }

    let tmp = {}
    for (var i = 0; i < x.length; i++) {
      tmp[x[i]] = []
      for (var j = 0; j < this.inputPeriodeData.length; j++) {

        if (this.inputPeriodeData[j]['tahun_periode'] === x[i]) {
          flags[this.inputPeriodeData[j]['bulan_periode']] = true;
          tmp[x[i]].push({
            label: this.inputPeriodeData[j]['bulan_periode'],
            value: this.inputPeriodeData[j]['bulan_periode']
          })
        }
      }

    }

    // Tahun Data
    this.tahun = outputTahun

    this.formValueAK = {
      format_laporan: this.formValueAK.format_laporan,
      jenis_laporan: this.formValueAK.jenis_laporan,
      metode_laporan: this.formValueAK.metode_laporan,
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tipe: this.formValueAK.tipe,
      tahun: this.formValueAK.tahun === "" ? this.activePeriod['tahun_periode']  : this.formValueAK.tahun,
      bulan: this.formValueAK.bulan === "" ? this.activePeriod['bulan_periode'] : this.formValueAK.bulan,
      periode_berjarak: this.formValueAK.periode_berjarak === "" ? this.activePeriod['bulan_to'] : this.formValueAK.periode_berjarak
    }
    this.initBulan = tmp
    this.bulanAK = tmp[this.formValueAK.tahun]
    this.inputLayoutAK.splice(5, 6,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanAK,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
        hiddenOn: {
          valueOf: 'tipe',
          matchValue: "t"
        },

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanAK,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    if (this.loading === true) {
      //Check On Blur Data
      this.ref.markForCheck()
      this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayoutAK)
      // this.gbl.updateInputdata(this.inputAkunData, 'kode_akun', this.inputLayoutAK)

      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan) {
    this.formValueAK = {
      format_laporan: this.formValueAK['format_laporan'],
      jenis_laporan: this.formValueAK['jenis_laporan'],
      metode_laporan: this.formValueAK['metode_laporan'],
      kode_cabang: this.formValueAK['kode_cabang'],
      nama_cabang: this.formValueAK['nama_cabang'],
      tipe: this.formValueAK['tipe'],
      tahun: filterBulan,
      bulan: "",
      periode_berjarak: ""
    }
    this.bulanAK = loopBulan[filterBulan]
    this.inputLayoutAK.splice(6, 5,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanAK,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
        hiddenOn: {
          valueOf: 'tipe',
          matchValue: "t"
        },

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanAK,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    setTimeout(() => {
      this.ref.markForCheck()
      // this.forminputAK.checkChanges()
    }, 1)
  }

  checkRangeFirstPeriod(data) {
    if (+data > +this.forminput.getData()['periode_berjarak']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueAK.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutAK.splice(6, 5,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanAK,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
          hiddenOn: {
            valueOf: 'tipe',
            matchValue: "t"
          },

          // Combobox Options
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanAK,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }

  checkRangeLastPeriod(data) {
    if (+data < +this.forminput.getData()['bulan']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueAK.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutAK.splice(6, 5,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanAK,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),
          hiddenOn: {
            valueOf: 'tipe',
            matchValue: "t"
          },

          // Combobox Options
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanAK,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }

  getTahunTertinggi() {
    return Math.max.apply(Math, this.inputPeriodeData.map(function (o) { return parseInt(o['tahun_periode']) }))
  }

  getTahunTerendah() {
    return Math.min.apply(Math, this.inputPeriodeData.map(function (o) { return parseInt(o['tahun_periode']) }))
  }

  getBulanTertinggi(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.max.apply(Math, array.map(function (o) { return parseInt(o['bulan_periode']) }))
  }

  getBulanTerendah(t) {
    let array = this.inputPeriodeData.filter(x => x['tahun_periode'] === t)
    return Math.min.apply(Math, array.map(function (o) { return parseInt(o['bulan_periode']) }))
  }

  format(v, n, x, s, c) {
    var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
      num = v.toFixed(Math.max(0, ~~n));

    return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
  }
}
