import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog, MatSnackBar } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { DialogComponent } from '../../components/dialog/dialog.component';
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { DetailinputAgGridComponent } from '../../components/detailinput-ag-grid/detailinput-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';

const content = {
  beforeCodeTitle: 'Daftar Aplikasi'
}

@Component({
  selector: 'kt-daftar-aplikasi',
  templateUrl: './daftar-aplikasi.component.html',
  styleUrls: ['./daftar-aplikasi.component.scss', '../master.style.scss']
})
export class DaftarAplikasiComponent implements OnInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;
  // @ViewChild(DetailinputAgGridComponent, {static: false}) detailinput;

  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = true;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  // loadingAplikasi: boolean = true;
  browseNeedUpdate: boolean = true;
  // dialogRef: any;
  // dialogType: string = null;
  search: string;

  // Configuration Select box
  tipe_aktif: Object = [
    {
      label: 'Aktif',
      value: 'Y'
    },
    {
      label: 'Non Aktif',
      value: 'N'
    }
  ]

  // Input Name
  formValue = {
    kode_aplikasi: '',
    nama_aplikasi: '',
    aktif: 'Y',
    setting: '',
    access_key: '',
    keterangan: ''
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Aplikasi',
      id: 'kode-aplikasi',
      type: 'input',
      valueOf: 'kode_aplikasi',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nama Aplikasi',
      id: 'nama-aplikasi',
      type: 'input',
      valueOf: 'nama_aplikasi',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'User Status',
      id: 'user-status',
      type: 'combobox',
      options: this.tipe_aktif,
      change: (e) => this.selection(e, 'aktif'),
      valueOf: 'aktif',
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Setting',
      id: 'setting',
      type: 'input',
      valueOf: 'setting',
      required: false,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Access Key',
      id: 'access-key',
      type: 'input',
      valueOf: 'access_key',
      required: false,
      readOnly: true,
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
    },
  ]

  /* buttonLayout = [
    {
      btnLabel: 'Tambah Akses',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('kode_aplikasi')
      },
      btnCondition: () => {
        return true
      }
    }
  ] */

  // Aplikasi List
  /* inputAplikasiDisplayColumns = [
    {
      label: 'Kode Aplikasi',
      value: 'kode_aplikasi',
      selectable: true
    },
    {
      label: 'Nama Aplikasi',
      value: 'nama_aplikasi'
    }
  ]
  inputAplikasiInterface = {
    kode_aplikasi: 'string',
    nama_aplikasi: 'string'
  }
  inputAplikasiData = []
  inputAplikasiDataRules = [] */

  // User-Aplikasi List Detail
  /* detailDisplayColumns = [
    {
      label: 'Kode Aplikasi',
      value: 'kode_aplikasi',
      selectable: true
    },
    {
      label: 'Nama Aplikasi',
      value: 'nama_aplikasi'
    }
  ]
  detailInterface = {
    kode_aplikasi: 'string',
    nama_aplikasi: 'string'
  }
  detailData = []
  detailRules = [] */

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Aplikasi',
      value: 'kode_aplikasi'
    },
    {
      label: 'Nama Aplikasi',
      value: 'nama_aplikasi'
    },
    {
      label: 'Aktif',
      value: 'aktif'
    },
    {
      label: 'Setting',
      value: 'setting'
    },
    {
      label: 'Access Key',
      value: 'access_key'
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
    kode_aplikasi: 'string',
    nama_aplikasi: 'string',
    aktif: 'string',
    setting: 'string',
    access_key: 'string',
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
      target: 'aktif',
      replacement: {
        'Y': 'Aktif',
        'N': 'Non Aktif'
      }
    }
  ]

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private ref: ChangeDetectorRef,
    private request: RequestDataService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.madeRequest()
  }

  //Selection event (Select Box)
  selection(data, type) {
    this.formValue[type] = data.target.value
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
  }

  // Dialog
  openDialog(type) {

  }

  onBlur(type) {

  }

  getDetail() {

  }

  editDetailData(data) {
  }

  deleteDetailData(data) {

  }

  restructureDetailData(data) {

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
    this.request.apiData('aplikasi', 'g-aplikasi').subscribe(
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
    let x = this.formValue
    x.kode_aplikasi = data['kode_aplikasi']
    x.nama_aplikasi = data['nama_aplikasi']
    x.aktif = data['aktif']
    x.setting = data['setting']
    x.access_key = data['access_key']
    x.keterangan = data['keterangan']
    this.formValue = x
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

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.request.apiData('aplikasi', this.onUpdate ? 'u-aplikasi' : 'i-aplikasi', this.formValue).subscribe(
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
      } else {
        this.openSnackBar('DATA TIDAK LENGKAP.')
      }
    }
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      kode_aplikasi: '',
      nama_aplikasi: '',
      aktif: 'Y',
      setting: '',
      access_key: '',
      keterangan: ''
    }
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
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('aplikasi', 'd-aplikasi', this.formValue).subscribe(
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

  inputPipe(valueOf, data) {
    this.formValue[valueOf] = data.toUpperCase()
  }

  sendUserRequest() {
    
  }

  openSnackBar(message, type?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
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
    }, 1)
  }
}