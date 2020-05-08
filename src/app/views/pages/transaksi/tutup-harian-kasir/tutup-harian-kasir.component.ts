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
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Tutup Harian Kasir'
}

@Component({
  selector: 'kt-tutup-harian-kasir',
  templateUrl: './tutup-harian-kasir.component.html',
  styleUrls: ['./tutup-harian-kasir.component.scss', '../transaksi.style.scss']
})
export class TutupHarianKasirComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('TP', { static: false }) forminputTP;
  @ViewChild('jbp', { static: false }) djbp;
  @ViewChild('rp', { static: false }) drp;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  tableLoad: boolean = false;
  detailJurnalLoad: boolean = false;
  tableLoadBP: boolean = false;
  loadingDataTextBP: string = "Loading Data Belum Posting.."
  content: any;
  button_name: any;
  nama_tombolPJ: any;
  onSub: boolean = false;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  enableCancel: boolean = false;
  noCancel: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  loadTab: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = false;
  browseNeedUpdate: boolean = true;
  search: string;
  a: any;
  b: any;
  c: any;

  dialogRef: any;
  dialogType: string = null;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsPA: any;
  periode_aktif: any;
  idPeriodeAktif: any;
  tahunPeriodeAktif: any;
  bulanPeriodeAktif: any;
  nama_bulan_aktif: any;

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
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayoutPJ = []

  // Input Name
  formDetail = {
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    nama_cabang: '',
    nama_divisi: '',
    nama_departemen: '',
    keterangan: '',
  }

  detailData = []

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-transaksi',
      type: 'input',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'nama-cabang',
      type: 'input',
      valueOf: 'nama_cabang',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Divisi',
      id: 'nama-divisi',
      type: 'input',
      valueOf: 'nama_divisi',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Departemen',
      id: 'nama-departemen',
      type: 'input',
      valueOf: 'nama_departemen',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

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
    kode_cabang: '',
    nama_cabang: '',
    tgl_tutup_akhir: '',
    sisa_hari_tutup: '',
    set_tgl_tutup: JSON.stringify(this.getDateNow())
  }

  // Layout Form POSTING JURNAL
  inputLayout = [
    {
      formWidth: 'col-9',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialogCabang(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      update: {
        disabled: false
      }
    },
   {
      formWidth: 'col-9',
      label: 'Tgl. Tutup Terakhir',
      id: 'tgl-tutup-akhir',
      type: 'datepicker',
      valueOf: 'tgl_tutup_akhir',
      required: true,
      readOnly: true,
      disabled: true,
      noButton: true,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
    },
    {
      formWidth: 'col-9',
      label: 'Sisa Hari Belum Tutup',
      id: 'sisa-hari-tutup',
      type: 'input',
      valueOf: 'sisa_hari_tutup',
      required: false,
      readOnly: true,
      numberOnly: false,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-9',
      label: 'Atur Tgl. Tutup',
      id: 'set-tgl-tutup',
      type: 'datepicker',
      valueOf: 'set_tgl_tutup',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: false,
      enableMax: false,
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
    this.nama_tombolPJ = 'Tutup Kasir'
    this.gbl.need(true, false)
    this.reqKodePerusahaan()
    // this.reqActivePeriod()
    // this.madeRequest()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      // this.madeRequest()
      this.reqActivePeriod()
      // this.tabTP()
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
        this.browseDataBP = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kode_perusahaan !== "") {
          // this.madeRequest()
          this.reqActivePeriod()
        }
      }
    )
  }

  reqActivePeriod() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
            this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
            this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
            this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
            this.nama_bulan_aktif = this.gbl.getNamaBulan(this.bulanPeriodeAktif)
            this.periode_aktif = this.gbl.getActive()
            this.madeRequest()
            this.ref.markForCheck()
          } else {
            this.ref.markForCheck()
            this.openSnackBar('Data Periode tidak ditemukan.')
          }
        }
      )
    }
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.inputCabangData = []
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar cabang. mohon coba lagi nanti.')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
    this.loading = false
    this.ref.markForCheck()
    // this.updateForm()
  }

  updateForm(kc, nc) {
    this.loading = true
    this.a = 1588266000000 
    this.b = JSON.stringify(this.getDateNow())
    var i = this.a / 86400000
    var j = this.b / 86400000
    this.c = Math.floor(j-i)
    this.formValue = {
      kode_cabang: kc,
      nama_cabang: nc,
      tgl_tutup_akhir: this.a,
      sisa_hari_tutup: this.c+' Hari',
      set_tgl_tutup: this.b
    }
    this.formInputCheckChanges()
    this.loading = false
    this.ref.markForCheck()
  }

  sendRequestRiwayatTutup(kc) {
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

  // Dialog
  openDialogCabang(type) {
    this.gbl.topPage()
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
            this.updateForm(result.kode_cabang, result.nama_cabang)
            this.sendRequestRiwayatTutup(result.kode_cabang)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog(type) { // Confirmation Dialog
    this.gbl.topPage()
    if (this.onSub === false) {
      const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
        width: 'auto',
        height: 'auto',
        maxWidth: '95vw',
        maxHeight: '95vh',
        backdropClass: 'bg-dialog',
        position: { top: '70px' },
        data: {
          type: type,
          buttonLayout:
            type === "posting_jurnal" ? this.c_buttonLayoutPJ :
              {},
          labelLayout:
            type === "posting_jurnal" ? this.c_labelLayoutPJ :
              {},
          inputLayout:
            type === "posting_jurnal" ? this.c_inputLayoutPJ :
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

    if (this.selectedTab == 0) {
      this.djbp == undefined ? null : this.djbp.checkColumnFit()
      this.drp == undefined ? null : this.drp.checkColumnFit()
    }
  }

  refreshTab(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  // browseSelectRow(data) {
  //   let x = this.formValue
  //   x.id_posting = data['id_posting']
  //   x.id_tran = data['id_tran']
  //   x.no_tran = data['no_tran']
  //   x.boleh_batal = data['boleh_batal']
  //   this.formValue = x
  //   this.enableCancel = data['boleh_batal'] === 'Y' ? true : false
  //   this.onSub = true;
  //   this.onUpdate = true;
  //   this.getBackToInput();
  // }

  browseSelectRowBP(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      nama_cabang: x['nama_cabang'],
      nama_divisi: x['nama_divisi'],
      nama_departemen: x['nama_departemen'],
      keterangan: x['keterangan'],
    }
    this.getDetail()
  }

  getDetail() {
    this.detailJurnalLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              keterangan: resp[i]['keterangan'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.openDialog()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailJurnalLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  openDialog() {
    this.gbl.topPage()
    this.ref.markForCheck()
    this.formInputCheckChangesJurnal()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '50px' },
      data: {
        width: '90vw',
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        detailLoad: this.detailData === [] ? this.detailJurnalLoad : false,
        jurnalData: this.detailData,
        jurnalDataAkun: [],
        noEditJurnal: true,
        noButtonSave: true,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        // onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
      },
      error => null,
    );
  }

  getBackToInput() {
    this.selectedTab = 0;
    this.gbl.topPage()
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.dialog.closeAll()
    this.gbl.topPage()
    let u_id = localStorage.getItem('user_id')
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    // this.formValue.id_posting = this.formValue.id_posting === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
    //   length: 8,
    //   numeric: true,
    //   letters: false,
    //   special: false
    // }))}` : this.formValue.id_posting
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
          // this.sendRequesBelumPosting()
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

  //Reset Value
  resetForm() {
    this.gbl.topPage()
    this.formValue = {
      kode_cabang: '',
      nama_cabang: '',
      tgl_tutup_akhir: '',
      sisa_hari_tutup: '',
      set_tgl_tutup: JSON.stringify(this.getDateNow())
    }
    this.enableCancel = false;
    this.onSub = false;
    this.formInputCheckChanges()
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
      this.drp == undefined ? null : this.drp.reset()
    } else {
      this.onUpdate = false;
      this.onSub = false;
      this.resetForm()
      this.djbp == undefined ? null : this.djbp.reset()
      this.drp == undefined ? null : this.drp.reset()
    }
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

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      this.forminputTP === undefined ? null : this.forminputTP.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 10)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
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
