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
  beforeCodeTitle: 'Daftar Kasir'
}

@Component({
  selector: 'kt-kasir',
  templateUrl: './kasir.component.html',
  styleUrls: ['./kasir.component.scss', '../master.style.scss']
})
export class KasirComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  loadingBank: boolean = false
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

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  status_aktif: Object = [
    {
      label: 'Aktif',
      value: 'Y'
    },
    {
      label: 'Non-Aktif',
      value: 'N'
    }
  ]

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'Hapus Data',
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
      content: 'Yakin akan menghapus data ?',
      style: {
        'color': 'red',
        'font-size': '18px',
        'font-weight': 'bold'
      }
    }
  ]

  inputUserDisplayColumns = [
    {
      label: 'User ID',
      value: 'user_id'
    },
    {
      label: 'Username',
      value: 'user_id'
    }
  ]
  inputUserInterface = {
    user_id: 'string',
    user_name: 'string'
  }
  inputUserData = []
  inputUserDataRules = []

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Nama Kasir',
      value: 'nama_kasir'
    },
    {
      label: 'User Kasir',
      value: 'user_kasir'
    },
    {
      label: 'Kepala Kasir',
      value: 'user_kepala_kasir'
    },
    {
      label: 'Status Kasir',
      value: 'status_aktif_sub'
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
      value: 'input_dt'
    },
    {
      label: 'Diupdate oleh',
      value: 'update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt'
    }
  ];
  browseInterface = {
    nama_kasir: 'string',
    user_kasir: 'string',
    user_kepala_kasir: 'string',
    status_aktif: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = [
    {
      target: 'status_aktif',
      replacement: {
        'Y': 'Aktif',
        'N': 'Non-Aktif'
      },
      redefined: 'status_aktif_sub'
    }
  ]

  // Input Name
  formValue = {
    id_kasir: '',
    nama_kasir: '',
    user_kasir: '',
    user_kepala_kasir: '',
    status_aktif: 'Y',
    keterangan: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Nama Kasir',
      id: 'nama-kasir',
      type: 'input',
      valueOf: 'nama_kasir',
      required: false,
      readOnly: false,
      numberOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'User Kasir',
      id: 'user-kasir',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'user_kasir',
      valueOf: 'user_kasir',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'user-name-kasir',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'user_name_kasir'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Kepala Kasir',
      id: 'user-kepala-kasir',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'user_kepala_kasir',
      valueOf: 'user_kepala_kasir',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'user-name-kepala-kasir',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'user_name_kepala_kasir'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Status Kasir',
      id: 'status-aktif',
      type: 'combobox',
      options: this.status_aktif,
      valueOf: 'status_aktif',
      update: {
        disabled: true
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
    this.gbl.need(true, false)
    this.reqKodePerusahaan()
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
          this.refreshBrowse('')
        }
      }
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.inputUserData = []
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('user', 'g-user', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputUserData = data['RESULT']
            this.loading = false
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar user. mohon coba lagi nanti.')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // Dialog
  openDialog(type) {
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
          type === "user_kasir" ? this.inputUserInterface :
            type === "user_kepala_kasir" ? this.inputUserInterface :
              {},
        displayedColumns:
          type === "user_kasir" ? this.inputUserDisplayColumns :
            type === "user_kepala_kasir" ? this.inputUserDisplayColumns :
              [],
        tableData:
          type === "user_kasir" ? this.inputUserData :
            type === "user_kepala_kasir" ? this.inputUserData :
              [],
        tableRules:
          type === "user_kasir" ? this.inputUserDataRules :
            type === "user_kepala_kasir" ? this.inputUserDataRules :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "user_kasir") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('user_kasir', result.user_id)
            this.forminput.updateFormValue('user_name_kasir', result.user_name)
          }
        } else if (type === "user_kepala_kasir") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('user_kepala_kasir', result.user_id)
            this.forminput.updateFormValue('user_name_kepala_kasir', result.user_name)
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
            label: 'Kode Bank',
            id: 'kode-bank',
            type: 'input',
            valueOf: this.formValue.nama_kasir,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'No. Rekening',
            id: 'no-rekening',
            type: 'input',
            valueOf: this.formValue.user_kasir,
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
      // error => null
    )
  }

  //Tab change event
  onTabSelect(event: MatTabChangeEvent) {
    this.selectedTab = event.index
    if (this.selectedTab == 1 && this.browseNeedUpdate) {
      this.refreshBrowse('')
    }

    if (this.selectedTab == 1) this.datatable == undefined ? null : this.datatable.checkColumnFit()
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('rekening-perusahaan', 'g-rekening-perusahaan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
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
        }
      }
    )
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formValue = {
      id_kasir: x['id_kasir'],
      nama_kasir: x['nama_kasir'],
      user_kasir: x['user_kasir'],
      user_kepala_kasir: x['user_kepala_kasir'],
      status_aktif: x['status_aktif'],
      keterangan: x['keterangan']
    }
    this.onUpdate = true;
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
      if (inputForm.valid && this.formValue.nama_kasir !== undefined) {
        if (this.formValue.user_kasir === "") {
          this.openSnackBar('User Kasir Belum Diisi.', 'info')
        } else if (this.formValue.user_kepala_kasir === "") {
          this.openSnackBar('User Kepala Kasir Belum Diisi.', 'info')
        } else {
          this.addNewData()
        }
      } else {
        this.openSnackBar('Nama Kasir Belum Diisi.', 'info')
      }
    }
  }

  addNewData() {
    this.loading = true;
    this.ref.markForCheck()
    this.formValue.id_kasir = this.formValue.id_kasir === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_kasir
    let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
    this.request.apiData('rekening-perusahaan', this.onUpdate ? 'u-rekening-perusahaan' : 'i-rekening-perusahaan', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.resetForm()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar(data['RESULT'])
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
      id_kasir: '',
      nama_kasir: '',
      user_kasir: '',
      user_kepala_kasir: '',
      status_aktif: '',
      keterangan: '',
    }
    // this.detailData = []
    this.formInputCheckChanges()
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

  deleteData() {
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.gbl.topPage()
      this.loading = true;
      this.ref.markForCheck()
      let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan }, this.formValue)
      this.request.apiData('rekening-perusahaan', 'd-rekening-perusahaan', endRes).subscribe(
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