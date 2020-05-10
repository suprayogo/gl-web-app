import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { ReportdialogComponent } from '../../components/reportdialog/reportdialog.component';

const content = {
  beforeCodeTitle: 'Laporan Rekapitulasi Kas'
}

@Component({
  selector: 'kt-rekap-kas',
  templateUrl: './rekap-kas.component.html',
  styleUrls: ['./rekap-kas.component.scss', '../laporan.style.scss']
})
export class RekapKasComponent implements OnInit, AfterViewInit {

  // View child to call function
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
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    },
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    }
  ]

  // Variables
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingJL: boolean = false;
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

  // PERIODE
  inputPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  initBulan: any = [];
  bulanJL: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValue = {
    format_laporan: 'pdf',
    periode: ''
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
  inputLayout = [
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
      // minDate: () => {
      //   let dt = new Date(Date.now())
      //   return {
      //     year: dt.getFullYear(),
      //     month: dt.getMonth() + 1,
      //     day: dt.getDate()
      //   }
      // },
      // maxDate: () => {
      //   let dt = new Date(Date.now())
      //   return {
      //     year: dt.getFullYear(),
      //     month: dt.getMonth() + 1,
      //     day: dt.getDate()
      //   }
      // }
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

  //Form submit
  onSubmitJL(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
    if (this.forminput !== undefined) {
      this.formValue = this.forminput.getData()
      let p = {}
        p['kode_perusahaan'] = this.kode_perusahaan
        p['tgl_periode_awal'] = "2020-05-08"
        p['tgl_periode_akhir'] = "2020-05-10"
        this.request.apiData('report', 'g-data-rekapitulasi-kas', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              console.log(data['RESULT'])
              // for (var i = 0; i < d.length; i++) {
              //   let t = [], tgl_tran = d[i]['tgl_tran'].split("-")

              //   t.push(d[i]['no_tran'])
              //   t.push(new Date(d[i]['tgl_tran']).getTime())
              //   t.push(d[i]['nama_akun'])
              //   t.push(parseFloat(d[i]['nilai_debit']))
              //   t.push(parseFloat(d[i]['nilai_kredit']))

              //   res.push(t)
              // }

              // let rp = JSON.parse(JSON.stringify(this.reportObj))
              // rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              // rp['REPORT_CODE'] = 'RPT-JURNAL'
              // rp['REPORT_NAME'] = 'Laporan Transaksi Jurnal'
              // rp['REPORT_FORMAT_CODE'] = 'pdf'
              // rp['JASPER_FILE'] = 'rptJurnal.jasper'
              // rp['REPORT_PARAMETERS'] = {
              //   USER_NAME: "",
              //   REPORT_COMPANY_ADDRESS: "",
              //   REPORT_COMPANY_CITY: "",
              //   REPORT_COMPANY_TLPN: "",
              //   REPORT_PERIODE: "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
              // }
              // rp['FIELD_NAME'] = [
              //   "noTran",
              //   "tglTran",
              //   "namaAkun",
              //   "nilaiDebit",
              //   "nilaiKredit"
              // ]
              // rp['FIELD_TYPE'] = [
              //   "string",
              //   "date",
              //   "string",
              //   "bigdecimal",
              //   "bigdecimal"
              // ]
              // rp['FIELD_DATA'] = res

              // this.sendGetReport(rp, 'jl')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            }
          }
        )
    }
  }

  //Reset Value
  resetFormJL() {
    this.gbl.topPage()
    this.formValue = {
      format_laporan: 'pdf',
      periode: ''
    }
    /*  this.bulanJL = this.initBulan[this.formValueJL['tahun']]
     this.inputLayoutJL.splice(2, 2,
       {
         // labelWidth: 'col-4',
         formWidth: 'col-5',
         label: 'Bulan Periode',
         id: 'bulan-periode',
         type: 'combobox',
         options: this.bulanJL,
         valueOf: 'bulan',
         required: true,
         readOnly: false,
         disabled: false,
       }
     ) */

    this.loadingJL = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingJL = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel(type) {
    this.resetFormJL()
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
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            this.sendRequestPeriodeKasir(result.kode_cabang)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.loading = false
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  sendRequestPeriodeKasir(kc) {
    this.request.apiData('periode', 'g-periode-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        console.log(data['RESULT'])
        if (data['STATUS'] === 'Y') {
          // this.inputLayout.splice(2, 1, {
          //   formWidth: 'col-5',
          //   label: 'Periode',
          //   id: 'periode',
          //   type: 'datepicker-range',
          //   valueOf: 'periode',
          //   required: true,
          //   readOnly: false,
          //   update: {
          //     disabled: false
          //   },
          //   timepick: false,
          //   enableMin: true,
          //   enableMax: true,
          //   minDate: () => {
          //     let dt = new Date(Date.now())
          //     return {
          //       year: dt.getFullYear(),
          //       month: dt.getMonth() + 1,
          //       day: dt.getDate()
          //     }
          //   },
          //   maxDate: () => {
          //     let dt = new Date(Date.now())
          //     return {
          //       year: dt.getFullYear(),
          //       month: dt.getMonth() + 1,
          //       day: dt.getDate()
          //     }
          //   }
          // })
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
        }
      }
    )
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  sendGetReport(p, type) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.topPage()
          this.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
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
    let x = []

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

    this.tahun = outputTahun
    /* this.formValueJL = {
      format_laporan: this.formValueJL['format_laporan'],
      tahun: this.activePeriod['tahun_periode'] === undefined ? "" : this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'] === undefined ? "" : this.activePeriod['bulan_periode']
    }
    this.initBulan = tmp
    this.bulanJL = tmp[this.formValueJL.tahun]
    this.inputLayoutJL.splice(0, 3,
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
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp, "jl"),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanJL,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      },
    )*/
  }

  getBulan(filterBulan, loopBulan, type) {
    /* this.formValueJL = {
      format_laporan: this.formValueJL['format_laporan'],
      tahun: filterBulan,
      bulan: ""
    } */
    this.bulanJL = loopBulan[filterBulan]
    this.inputLayout.splice(2, 2,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanJL,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
      }
    )
    setTimeout(() => {
      this.forminput.checkChanges()
    }, 1)
  }
}
