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

const content = {
  beforeCodeTitle: 'Laporan Rekapitulasi Giro'
}

@Component({
  selector: 'kt-rekap-giro',
  templateUrl: './rekap-giro.component.html',
  styleUrls: ['./rekap-giro.component.scss', '../laporan.style.scss']
})
export class RekapGiroComponent implements OnInit, AfterViewInit {

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
    kode_cabang: '',
    nama_cabang: '',
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
        p['kode_cabang'] = this.formValue['kode_cabang']
        p['tgl_periode_awal'] = JSON.stringify(this.formValue['periode'][0]['year']) + "-" + (JSON.stringify(this.formValue['periode'][0]['month']).length > 1 ? JSON.stringify(this.formValue['periode'][0]['month']) : "0" + JSON.stringify(this.formValue['periode'][0]['month'])) + "-" + (JSON.stringify(this.formValue['periode'][0]['day']).length > 1 ? JSON.stringify(this.formValue['periode'][0]['day']) : "0" + JSON.stringify(this.formValue['periode'][0]['day']))
        p['tgl_periode_akhir'] = JSON.stringify(this.formValue['periode'][1]['year']) + "-" + (JSON.stringify(this.formValue['periode'][1]['month']).length > 1 ? JSON.stringify(this.formValue['periode'][1]['month']) : "0" + JSON.stringify(this.formValue['periode'][1]['month'])) + "-" + (JSON.stringify(this.formValue['periode'][1]['day']).length > 1 ? JSON.stringify(this.formValue['periode'][1]['day']) : "0" + JSON.stringify(this.formValue['periode'][1]['day']))
        this.request.apiData('report', 'g-data-rekapitulasi-bank', p).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              let d = data['RESULT'], res = []
              for (var i = 0; i < d.length; i++) {
                let t = []

                t.push(d[i]['kode_cabang'])
                t.push(d[i]['nama_cabang'])
                t.push(d[i]['id_kasir'])
                t.push(d[i]['nama_kasir'])
                t.push(d[i]['kode_bank'])
                t.push(d[i]['nama_bank'])
                t.push(d[i]['no_rekening'])
                t.push(d[i]['atas_nama'])
                t.push(d[i]['no_tran'])
                t.push(d[i]['no_jurnal'])
                t.push(new Date(d[i]['tgl_tran']).getTime())
                t.push(d[i]['keterangan'])
                t.push(parseFloat(d[i]['saldo_masuk']))
                t.push(parseFloat(d[i]['saldo_keluar']))
                t.push(parseFloat(d[i]['saldo_akhir']))
                t.push(parseFloat(d[i]['saldo_awal']))

                res.push(t)
              }

              let rp = JSON.parse(JSON.stringify(this.reportObj))
              rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
              rp['REPORT_CODE'] = 'RPT-REKAPITULASI-GIRO'
              rp['REPORT_NAME'] = 'Laporan Rekapitulasi Giro'
              rp['REPORT_FORMAT_CODE'] = 'pdf'
              rp['JASPER_FILE'] = 'rptRekapitulasiBank.jasper'
              rp['REPORT_PARAMETERS'] = {
                USER_NAME: "",
                REPORT_COMPANY_ADDRESS: "",
                REPORT_COMPANY_CITY: "",
                REPORT_COMPANY_TLPN: "",
                REPORT_PERIODE: "Periode: " + 
                                  JSON.stringify(this.formValue['periode'][0]['year']) + " " + 
                                    this.gbl.getNamaBulan((JSON.stringify(this.formValue['periode'][0]['month']))) + " " +
                                    (JSON.stringify(this.formValue['periode'][0]['day']).length > 1 ? JSON.stringify(this.formValue['periode'][0]['day']) : "0" + JSON.stringify(this.formValue['periode'][0]['day'])) + " - " +
                                      JSON.stringify(this.formValue['periode'][1]['year']) + " " +
                                        this.gbl.getNamaBulan((JSON.stringify(this.formValue['periode'][1]['month']))) + " " +
                                          (JSON.stringify(this.formValue['periode'][1]['day']).length > 1 ? JSON.stringify(this.formValue['periode'][1]['day']) : "0" + JSON.stringify(this.formValue['periode'][1]['day']))
                                      
              }
              rp['FIELD_NAME'] = [
                "kodeCabang",
                "namaCabang",
                "idKasir",
                "namaKasir",
                "kodeBank",
                "namaBank",
                "noRekening",
                "atasNama",
                "noTran",
                "noJurnal",
                "tglTran",
                "keterangan",
                "saldoMasuk",
                "saldoKeluar",
                "saldoAkhir",
                "saldoAwal"
              ]
              rp['FIELD_TYPE'] = [
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
                "date",
                "string",
                "bigdecimal",
                "bigdecimal",
                "bigdecimal",
                "bigdecimal"
              ]
              rp['FIELD_DATA'] = res

              this.sendGetReport(rp, 'jl')
            } else {
              this.loading = false
              this.ref.markForCheck()
              this.openSnackBar('Gagal mendapatkan data transaksi jurnal.', 'fail')
            }
          }
        )
    }
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
            // this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            // this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            this.formValue.kode_cabang = result.kode_cabang
            this.formValue.nama_cabang = result.nama_cabang
            this.loading = true
            this.ref.markForCheck()
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
        if (data['STATUS'] === 'Y') {
          let periode = data['RESULT'].filter(x => x['kode_cabang'] === kc), perMin = "", perMax = ""
          for (var i = 0; i < periode.length; i++) {
            if (perMin === "") {
              perMin = periode[i]['tgl_periode']
            }

            if (perMax === "") {
              perMax = periode[i]['tgl_periode']
            }

            if (new Date(periode[i]['tgl_periode']).getTime() < new Date(perMin).getTime()) {
              perMin = periode[i]['tgl_periode']
            }

            if (new Date(periode[i]['tgl_periode']).getTime() > new Date(perMax).getTime()) {
              perMax = periode[i]['tgl_periode']
            }
          }
          this.inputLayout.splice(2, 1, {
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
                day: dt.getDate()
              }
            },
            maxDate: () => {
              let dt = new Date(perMax)
              return {
                year: dt.getFullYear(),
                month: dt.getMonth() + 1,
                day: dt.getDate()
              }
            }
          })
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
}