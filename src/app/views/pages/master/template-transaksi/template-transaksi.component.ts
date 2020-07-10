import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Template Transaksi'
}

@Component({
  selector: 'kt-template-transaksi',
  templateUrl: './template-transaksi.component.html',
  styleUrls: ['./template-transaksi.component.scss', '../master.style.scss']
})
export class TemplateTransaksiComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  disableSubmit: boolean = false;
  browseNeedUpdate: boolean = true;
  subscription: any;
  subPeriode: any;
  subPeriodeAktif: any;
  kode_perusahaan: any;
  periode_akses: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };
  periode_aktif: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };
  requestMade: boolean = false;
  dialogRef: any;
  dialogType: string = null;

  // Input Name
  formValue = {
    kode_template: '',
    nama_template: '',
    keterangan: ''
  }

  detailData = [
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
      keterangan_akun: '',
      keterangan_1: '',
      keterangan_2: '',
      bobot_debit: 0,
      bobot_kredit: 0
    }
  ]

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'Hapus Template',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.deleteData()
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
  c_labelLayout = [
    {
      content: 'Yakin akan menghapus template?',
      style: {
        'color': 'red',
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Template',
      value: 'kode_template'
    },
    {
      label: 'Nama Template',
      value: 'nama_template'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Diinput oleh',
      value: 'input_by',
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate oleh',
      value: 'nama_update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterface = {
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  inputDepartemenDisplayColumns = [
    {
      label: 'Kode Departemen',
      value: 'kode_departemen'
    },
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Nama Induk Departemen',
      value: 'nama_induk_departemen'
    }
  ]
  inputDepartemenInterface = {
    kode_departemen: 'string',
    nama_departemen: 'string',
    induk_departemen: 'string',
    nama_induk_departemen: 'string'
  }
  inputDepartemenData = []
  inputDepartemenDataRules = []

  inputDivisiDisplayColumns = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  inputDivisiInterface = {
    kode_divisi: 'string',
    nama_divisi: 'string',
    keterangan: 'string'
  }
  inputDivisiData = []
  inputDivisiDataRules = []

  inputAkunData = []

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Template',
      id: 'kode-template',
      type: 'input',
      valueOf: 'kode_template',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nama Template',
      id: 'nama-template',
      type: 'input',
      valueOf: 'nama_template',
      required: true,
      readOnly: false,
      disabled: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: false,
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

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formValue = {
      kode_template: x['kode_template'],
      nama_template: x['nama_template'],
      keterangan: x['keterangan']
    }
    this.onUpdate = true;
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid && this.validateSubmit()) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.detailData = this.formValue['detail']['data']
        this.formValue['detail'] = this.detailData
        let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, id_periode: this.formValue['id_akses_periode'] }, this.formValue)
        this.request.apiData('template', this.onUpdate ? 'u-template' : 'i-template', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar(data['RESULT'], 'fail')
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
          }
        )
      } else {
        if (this.forminput.getData().kode_template === "") {
          this.openSnackBar('Kode Template Belum Diisi.', 'info')
        } else if (this.forminput.getData().nama_template === '') {
          this.openSnackBar('Nama Template belum Diisi.', 'info')
        } else {
          this.openSnackBar('Data Informasi Akun belum lengkap atau Saldo Debit & Kredit belum balance.', 'info')
        }
      }
    }
  }

  validateSubmit() {
    let validBobot = true

    let data = this.forminput === undefined ? null : this.forminput.getData()

    if (data != null) {
      if (data['detail'] !== undefined || data['detail'] != null) {
        if (!data['detail']['validBobot']) {
          validBobot = false
        }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['id_akun'] === '' || data['detail']['data'][i]['nama_departemen'] === '' || data['detail']['data'][i]['nama_divisi'] === '') {
          validBobot = false
          break;
        }
      }
    }

    return validBobot
  }

  deleteData() {
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.gbl.topPage()
      this.loading = true;
      this.ref.markForCheck()
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
      this.request.apiData('template', 'd-template', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.browseNeedUpdate = true
            this.refreshBrowse('BERHASIL DIHAPUS')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar(data['RESULT'])
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
        }
      )
    }
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      kode_template: '',
      nama_template: '',
      keterangan: ''
    }
    this.detailData = [
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan_1: '',
        keterangan_2: '',
        bobot_debit: 0,
        bobot_kredit: 0
      },
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan_1: '',
        keterangan_2: '',
        bobot_debit: 0,
        bobot_kredit: 0
      }
    ]
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.onUpdate = false;
      this.resetForm()
      this.datatable == undefined ? null : this.datatable.reset()
    }
  }

  cancelData(val = null) {
    this.gbl.topPage()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      let endRes = {
        kode_perusahaan: val ? val : this.kode_perusahaan,
      }
      this.dialog.closeAll()
      this.request.apiData('jurnal', 'c-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.browseNeedUpdate = true
            this.refreshBrowse('BERHASIL DIBATALKAN')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar(data['RESULT'])
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
        }
      )
    }
  }

  // Dialog
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
          type === "kode_divisi" ? this.inputDivisiInterface :
            type === "kode_departemen" ? this.inputDepartemenInterface :
              {},
        displayedColumns:
          type === "kode_divisi" ? this.inputDivisiDisplayColumns :
            type === "kode_departemen" ? this.inputDepartemenDisplayColumns :
              [],
        tableData:
          type === "kode_divisi" ? this.inputDivisiData :
            type === "kode_departemen" ? this.inputDepartemenData/* .filter(x => x['kode_divisi'] === (this.forminput === undefined ? null : this.forminput.getData()['kode_divisi'])) */ :
              [],
        tableRules:
          type === "kode_divisi" ? this.inputDivisiDataRules :
            type === "kode_departemen" ? this.inputDepartemenDataRules :
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
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '90px' },
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'Kode Template',
            id: 'kode-template',
            type: 'input',
            valueOf: this.formValue.kode_template,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Template',
            id: 'nama-template',
            type: 'input',
            valueOf: this.formValue.nama_template,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          }
        ]
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => {
        // this.batal_alasan = ""
      },
      error => null
    )
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && !this.requestMade) {
      this.requestMade = true

      this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputDivisiData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_divisi')
            this.sendRequestAkun()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  sendRequestAkun() {
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  getDetail() {
    this.detailLoad = true
    this.ref.markForCheck()
    this.request.apiData('template', 'g-template-detail', { kode_perusahaan: this.kode_perusahaan, kode_template: this.formValue.kode_template }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              kode_divisi: resp[i]['kode_divisi'],
              nama_divisi: resp[i]['nama_divisi'],
              kode_departemen: resp[i]['kode_departemen'],
              nama_departemen: resp[i]['nama_departemen'],
              keterangan_1: resp[i]['keterangan_1'],
              keterangan_2: resp[i]['keterangan_2'],
              bobot_debit: parseFloat(resp[i]['bobot_debit']),
              bobot_kredit: parseFloat(resp[i]['bobot_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.detailLoad = false
          this.ref.markForCheck()
          this.formInputCheckChangesJurnal()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('template', 'g-template', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (message !== '') {
            this.browseData = data['RESULT']
            this.loading = false
            this.tableLoad = false
            this.ref.markForCheck()
            this.openSnackBar(message, 'success')
            this.onUpdate = false
          } else {
            this.browseData = data['RESULT']
            this.loading = false
            this.tableLoad = false
            this.browseNeedUpdate = false
            this.ref.markForCheck()
          }
        } else {
          this.browseData = []
          this.loading = false
          this.tableLoad = false
          this.browseNeedUpdate = true
          this.ref.markForCheck()
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

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailTemplate()
    }, 1)
  }

  updateInputdata(d, vOf) {
    let t = JSON.parse(JSON.stringify(d))
    for (var i = 0; i < this.inputLayout.length; i++) {
      if (this.inputLayout[i]['type'] === 'inputgroup' && this.inputLayout[i]['browseType'] === vOf) {
        this.inputLayout[i]['blurOption']['data'] = t
        break
      }
    }
  }
}
