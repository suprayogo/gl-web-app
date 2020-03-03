import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
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
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

const content = {
  beforeCodeTitle: 'Posting Jurnal & Tutup Periode'
}

@Component({
  selector: 'kt-posting-jurnal',
  templateUrl: './posting-jurnal.component.html',
  styleUrls: ['./posting-jurnal.component.scss', '../transaksi.style.scss']
})
export class PostingJurnalComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('TP', { static: false }) forminputTP;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  tableLoad: boolean = false;
  tableLoadBP: boolean = false;
  loadingDataText: string = "Loading Data Riwayat.."
  loadingDataTextBP: string = "Loading Data Belum Posting.."
  content: any;
  button_name: any;
  nama_tombolPJ: any;
  nama_tombolUP: any;
  nama_tombolTP: any;
  onSub: boolean = false;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  noCancel: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  loadTab: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = false;
  browseNeedUpdate: boolean = true;
  search: string;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsPA: any;
  periode_aktif: any;

  // GLOBAL VARIABLE AKSES PERIODE
  //

  //CDialog Posting Jurnal
  c_buttonLayoutPJ = [
    {
      btnLabel: 'Posting Jurnal',
      btnClass: 'btn btn-primary',
      btnClick: (pj) => {
        this.onSubmit(pj)
      },
      btnCondition: () => {
        return true
      }
    },
    {
      btnLabel: 'Tutup',
      btnClass: 'btn btn-secondary',
      btnClick: () => this.dialog.closeAll(),
      btnCondition: () => {
        return true
      }
    }
  ]
  c_labelLayoutPJ = [
    {
      content: 'Yakin akan memposting data jurnal ?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutPJ = []

  //CDialog Un-Posting Jurnal
  c_buttonLayoutUP = [
    {
      btnLabel: 'Un-Posting Jurnal',
      btnClass: 'btn btn-primary',
      btnClick: (up) => {
        this.onSubmitUP(up)
      },
      btnCondition: () => {
        return true
      }
    },
    {
      btnLabel: 'Tutup',
      btnClass: 'btn btn-secondary',
      btnClick: () => this.dialog.closeAll(),
      btnCondition: () => {
        return true
      }
    }
  ]
  c_labelLayoutUP = [
    {
      content: 'Yakin akan Un-Posting data jurnal ini ?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutUP = []

  // CDialog Tutup Periode
  c_buttonLayoutTP = [
    {
      btnLabel: 'Tutup Periode',
      btnClass: 'btn btn-primary',
      btnClick: (e) => {
        this.onSubmitTP(e)
      },
      btnCondition: () => {
        return true
      }
    },
    {
      btnLabel: 'Tutup',
      btnClass: 'btn btn-secondary',
      btnClick: () => this.dialog.closeAll(),
      btnCondition: () => {
        return true
      }
    }
  ]
  c_labelLayoutTP = [
    {
      content: 'Yakin akan menutup periode ini ?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutTP = []
  

  // RIWAYAT TABLE
  displayedColumnsTable = [
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by'
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt'
    },
    {
      label: 'Di Un-Posting oleh',
      value: 'update_by'
    },
    {
      label: 'Di Un-Posting tanggal',
      value: 'update_dt'
    }
  ];
  browseInterface = {
    no_tran: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  // DATA BELUM POSTING
  displayedColumnsTableBP = [
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tanggal Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by'
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt'
    },
    {
      label: 'Di Update oleh',
      value: 'update_by'
    },
    {
      label: 'Di Update tanggal',
      value: 'update_dt'
    }
  ];
  browseInterfaceBP = {
    no_tran: 'string',
    tgl_tran: 'string',
    keterangan: 'string',
    nama_divisi: 'string',
    nama_departemen: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseDataBP = []
  browseDataRulesBP = []

  // Input Name POSTING JURNAL
  formValue = {
    bulan_periode: '',
    tahun_periode: '',
    id_posting: '',
    id_tran: '',
    no_tran: '',
    boleh_batal: '',
  }

  // Input Name TUTUP PERIODE
  formValueTP = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: '',
  }

  // Layout Form POSTING JURNAL
  inputLayout = [
    {
      formWidth: 'col-9',
      label: 'Periode Aktif',
      id: 'bulan-periode',
      type: 'inputgroup',
      valueOf: 'bulan_periode',
      required: true,
      readOnly: true,
      noButton: true,
      inputInfo: {
        id: 'tahun-periode',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'tahun_periode'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-9',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: true,
      update: {
        disabled: false
      }
    }
  ]

  // Layout Form TUTUP PERIODE
  inputLayoutTP = [
    {
      formWidth: 'col-5',
      label: 'Tahun',
      id: 'tahun-periode',
      type: 'input',
      valueOf: 'tahun_periode',
      required: false,
      readOnly: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'input',
      valueOf: 'bulan_periode',
      required: false,
      readOnly: true,
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
    this.nama_tombolPJ = 'Posting'
    this.nama_tombolUP = 'Un-Posting'
    this.nama_tombolTP = 'Tutup Periode'
    this.reqKodePerusahaan()
    this.reqActivePeriod()
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    // PERIODE AKTIF
    this.periode_aktif = this.gbl.getActive()

    // AKSES PERIODE
    // this.akses_periode

    if (this.kode_perusahaan !== "" && this.periode_aktif !== "") {
      this.madeRequest()
      this.tabTP()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsPA === undefined ? null : this.subsPA.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          this.madeRequest()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate && this.kode_perusahaan !== "") {
          this.tabTP()
        }
      }
    )
  }

  reqActivePeriod() {
    this.subsPA = this.gbl.activePeriod.subscribe(
      value => {
        this.periode_aktif = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.periode_aktif !== "") {
          this.madeRequest()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate && this.periode_aktif !== "") {
          this.tabTP()
        }
      }
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.formValue = {
        bulan_periode: this.periode_aktif.bulan_periode,
        tahun_periode: this.periode_aktif.tahun_periode,
        id_posting: '',
        id_tran: '',
        no_tran: '',
        boleh_batal: '',
      }
      this.c_inputLayoutPJ = [
        {
          formWidth: 'col-5',
          label: 'Tahun Periode Aktif',
          id: 'tahun-periode',
          type: 'input',
          valueOf: this.formValue.tahun_periode,
          required: false,
          readOnly: true,
          update: {
            disabled: false
          }
        },
        {
          formWidth: 'col-5',
          label: 'Bulan Periode Aktif',
          id: 'bulan-periode',
          type: 'input',
          valueOf: this.formValue.bulan_periode,
          required: false,
          readOnly: true,
          update: {
            disabled: false
          }
        },
        {
          formWidth: 'col-5',
          label: 'No. Transaksi',
          id: 'no-tran',
          type: 'input',
          valueOf: '',
          required: false,
          readOnly: true,
          update: {
            disabled: false
          }
        }
      ]
      this.loading = false
      this.ref.markForCheck()
      this.sendRequestRiwayat()
      this.sendRequesBelumPosting()
    }
  }

  sendRequestRiwayat() {
    this.tableLoad = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('posting-jurnal', 'g-posting', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseData = data['RESULT']
            this.tableLoad = false
            this.ref.markForCheck()
          } else {
            this.tableLoad = false
            this.ref.markForCheck()
            this.openSnackBar('Data Riwayat tidak ditemukan.')
          }
        }
      )
    }
  }

  sendRequesBelumPosting() {
    this.tableLoadBP = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('posting-jurnal', 'g-jurnal-belum-posting', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataBP = data['RESULT']
            this.tableLoadBP = false
            this.ref.markForCheck()
          } else {
            this.tableLoadBP = false
            this.ref.markForCheck()
            this.openSnackBar('Data belum posting tidak ditemukan.')
          }
        }
      )
    }
  }

  tabTP() {
    this.loadTab = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.formValueTP = {
        id_periode: '',
        bulan_periode: this.periode_aktif.bulan_periode,
        tahun_periode: this.periode_aktif.tahun_periode
      }
      this.c_inputLayoutTP = [
        {
          formWidth: 'col-5',
          label: 'Tahun',
          id: 'tahun-periode',
          type: 'input',
          valueOf: this.formValueTP.tahun_periode,
          required: false,
          readOnly: true,
          update: {
            disabled: false
          }
        },
        {
          formWidth: 'col-5',
          label: 'Bulan',
          id: 'bulan-periode',
          type: 'input',
          valueOf: this.formValueTP.bulan_periode,
          required: false,
          readOnly: true,
          update: {
            disabled: false
          }
        }
      ]
      this.loadTab = false
      this.ref.markForCheck()
    }
  }

  openCDialog(type) { // Confirmation Dialog
    if (this.onSub === false) {
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '95vh',
        data: {
          type: type,
          buttonLayout:
            type === "posting_jurnal" ? this.c_buttonLayoutPJ :
              type === "tutup_periode" ? this.c_buttonLayoutTP :
                {},
          labelLayout:
            type === "posting_jurnal" ? this.c_labelLayoutPJ :
              type === "tutup_periode" ? this.c_labelLayoutTP :
                {},
          inputLayout:
            type === "posting_jurnal" ? this.c_inputLayoutPJ :
              type === "tutup_periode" ? this.c_inputLayoutTP :
                {},
        },
        disableClose: true
      })


      dialogRef.afterClosed().subscribe(
        result => {
          // this.batal_alasan = ""
        },
        // error => null
      )
    } else {
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '95vh',
        data: {
          type: type,
          buttonLayout:
            type === "posting_jurnal" ? this.c_buttonLayoutUP :
              {},
          labelLayout:
            type === "posting_jurnal" ? this.c_labelLayoutUP :
              {},
          inputLayout:
            type === "posting_jurnal" ? this.c_inputLayoutUP :
              {},
        },
        disableClose: true
      })


      dialogRef.afterClosed().subscribe(
        result => {
          // this.batal_alasan = ""
        },
        // error => null
      )
    }
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1) {
      this.tabTP()
      this.formInputCheckChanges()
    }

    // if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  refreshTab(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = this.formValue
    x.id_posting = data['id_posting']
    x.id_tran = data['id_tran']
    x.no_tran = data['no_tran']
    x.boleh_batal = data['boleh_batal']
    this.formValue = x
    this.onSub = true;
    this.onUpdate = true;
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    this.c_inputLayoutUP = [
      {
        formWidth: 'col-5',
        label: 'Tahun Periode Aktif',
        id: 'tahun-periode',
        type: 'input',
        valueOf: this.formValue.tahun_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode Aktif',
        id: 'bulan-periode',
        type: 'input',
        valueOf: this.formValue.bulan_periode,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      },
      {
        formWidth: 'col-5',
        label: 'No. Transaksi',
        id: 'no-tran',
        type: 'input',
        valueOf: this.formValue.no_tran,
        required: false,
        readOnly: true,
        update: {
          disabled: false
        }
      }
    ]
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.dialog.closeAll()
    let u_id = localStorage.getItem('user_id')
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    this.formValue.id_posting = this.formValue.id_posting === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_posting
    let endRes = Object.assign(
      {
        user_id: u_id,
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.periode_aktif.id_periode
      },
      this.formValue)
    this.request.apiData('posting-jurnal', this.onUpdate ? '' : 'i-posting-jurnal', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.loading = false
          this.refreshTab(this.onUpdate ? "" : "BERHASIL DITAMBAH")
          this.resetForm()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.sendRequestRiwayat()
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('DATA JURNAL GAGAL DI POSTING', 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.openSnackBar('GAGAL MELAKUKAN PROSES.')
      }
    )
  }

  //Form submit
  onSubmitTP(inputForm: NgForm) {
    this.dialog.closeAll()
    this.loading = true;
    this.ref.markForCheck()
    this.formValueTP.id_periode = this.formValueTP.id_periode === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValueTP.id_periode
    let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValueTP)
    this.request.apiData('periode', this.onUpdate ? '' : 'i-tutup-periode', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.resetForm()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.openSnackBar("PERIODE TELAH DITUTUP", 'success')
          window.location.href = "/"
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN TUTUP PERIODE', 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.openSnackBar('GAGAL MELAKUKAN PROSES.')
      }
    )
  }

  // Form Submit
  onSubmitUP(inputForm: NgForm) {
    this.dialog.closeAll()
    let u_id = localStorage.getItem('user_id')
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    let endRes = Object.assign(
      {
        user_id: u_id,
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.periode_aktif.id_periode
      },
      this.formValue)
    this.request.apiData('posting-jurnal', this.onUpdate ? 'i-unposting-jurnal' : '', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (this.formValue.boleh_batal === "Y") {
            this.loading = false
            this.refreshTab(this.onUpdate ? "DATA JURNAL TELAH DI UNPOSTING" : "")
            this.resetForm()
            this.browseNeedUpdate = true
            this.ref.markForCheck()
            this.sendRequestRiwayat()
          }
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('DATA JURNAL GAGAL DI UN-POSTING', 'fail')
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.openSnackBar('GAGAL MELAKUKAN PROSES.')
      }
    )
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      bulan_periode: this.periode_aktif.bulan_periode,
      tahun_periode: this.periode_aktif.tahun_periode,
      id_posting: '',
      id_tran: '',
      no_tran: '',
      boleh_batal: '',
    }
    this.onSub = false;
    this.formInputCheckChanges()
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.onSub = false;
      this.resetForm()
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
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

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      this.forminputTP === undefined ? null : this.forminputTP.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 10)
  }

}
