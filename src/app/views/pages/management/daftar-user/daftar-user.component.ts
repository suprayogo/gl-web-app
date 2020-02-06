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
   beforeCodeTitle: 'Daftar User'
}

@Component({
  selector: 'kt-daftar-user',
  templateUrl: './daftar-user.component.html',
  styleUrls: ['./daftar-user.component.scss', '../management.style.scss']
})
export class DaftarUserComponent implements OnInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;
  @ViewChild(DetailinputAgGridComponent, { static: false }) detailinput;
 
  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  tableLoad: boolean = true;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingAplikasi: boolean = true;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;
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
    user_id: '',
    user_name: '',
    user_password: '',
    aktif: 'Y'
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'User ID',
      id: 'user-id',
      type: 'input',
      valueOf: 'user_id',
      required: false,
      readOnly: false,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Username',
      id: 'user-name',
      type: 'input',
      valueOf: 'user_name',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Kata Sandi',
      id: 'password',
      type: 'input',
      valueOf: 'user_password',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      toolTip: "Kata sandi harus diatas atau sama dengan 4 karakter"
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
    }
  ]

  buttonLayout = [
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
  ]

  // Aplikasi List
  inputAplikasiDisplayColumns = [
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
  inputAplikasiDataRules = []

  // User-Aplikasi List Detail
  detailDisplayColumns = [
    {
      label: 'Kode Aplikasi',
      value: 'kode_aplikasi'
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
  detailRules = []

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'User ID',
      value: 'user_id'
    },
    {
      label: 'Username',
      value: 'user_name'
    },
    {
      label: 'Aktif',
      value: 'aktif'
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
    user_id: 'string',
    user_name: 'string',
    aktif: 'string',
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
    this.request.apiData('aplikasi', 'g-aplikasi').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAplikasiData = data['RESULT']
          this.loading = false
          this.loadingAplikasi = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_aplikasi") {
              this.dialog.closeAll()
              this.openDialog('kode_aplikasi')
            }
          }
        }
      }
    )
  }

  // Dialog
  openDialog(type) {
    this.dialogType = JSON.parse(JSON.stringify(type))
    this.dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: type,
        tableInterface:
          type === "kode_aplikasi" ? this.inputAplikasiInterface :
            {},
        displayedColumns:
          type === "kode_aplikasi" ? this.inputAplikasiDisplayColumns :
            [],
        tableData:
          type === "kode_aplikasi" ? this.inputAplikasiData :
            [],
        tableRules:
          type === "kode_aplikasi" ? this.inputAplikasiDataRules :
            [],
        formValue: this.formValue,
        selectable: type === 'kode_aplikasi' ? true : false,
        selected: this.detailData,
        selectIndicator: "kode_aplikasi",
        loadingData: type === "kode_aplikasi" ? this.loadingAplikasi : null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_aplikasi") {
          let x = result
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < this.detailData.length; j++) {
              if (this.detailData[j]['kode_aplikasi'] === x[i]['kode_aplikasi']) {
                x[i] = this.detailData[j]
              }
            }
          }
          this.detailData.splice(0, this.detailData.length)
          for (var i = 0; i < x.length; i++) {
            if (x[i]['id'] === "" || x[i]['id'] == null || x[i]['id'] === undefined) {
              x[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`
            }
            this.detailData.push(x[i])
          }
          this.ref.markForCheck()
          this.detailinput.checkChanges()
        }
        //this.ref.markForCheck();
        this.dialogRef = undefined
        this.dialogType = null
      }
    });
  }

  onBlur(type) {

  }

  getDetail() {
    this.detailLoad = true
    this.request.apiData('user', 'g-user-aplikasi', this.formValue).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.restructureDetailData(data['RESULT'])
          this.detailLoad = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Failed to load detail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  editDetailData(data) {
  }

  deleteDetailData(data) {
    for (var i = 0; i < this.detailData.length; i++) {
      if (this.detailData[i]['kode_aplikasi'] === data['kode_aplikasi']) {
        let x = this.detailData[i]
        this.detailData.splice(i, 1)
        this.dialog.closeAll()
        this.ref.markForCheck()
        this.detailinput.checkChanges()
        break;
      }
    }
  }

  restructureDetailData(data) {
    let endRes = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < this.inputAplikasiData.length; j++) {
        if (data[i]['kode_aplikasi'] === this.inputAplikasiData[j]['kode_aplikasi']) {
          let x = {
            id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`,
            kode_aplikasi: data[i]['kode_aplikasi'],
            nama_aplikasi: this.inputAplikasiData[j]['nama_aplikasi']
          }
          endRes.push(x)
          break;
        }
      }
    }
    this.detailData = endRes
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
    this.request.apiData('user', 'g-user').subscribe(
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
    x.user_id = data['user_id']
    x.user_name = data['user_name']
    x.aktif = data['aktif']
    this.formValue = x
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
  if(this.forminput !== undefined){
    if (inputForm.valid && this.formValue.user_password.length > 3 == true) {
      this.sendUserRequest()
    } else if (this.onUpdate) {
      if (this.formValue.user_password.length < 1)
        this.sendUserRequest()
      else if (this.formValue.user_password.length > 3)
        this.sendUserRequest()
      else
        this.openSnackBar('DATA TIDAK LENGKAP.')
    } else {
      this.openSnackBar('DATA TIDAK LENGKAP.')
    }
  }
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      user_id: '',
      user_name: '',
      user_password: '',
      aktif: 'Y'
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
      this.request.apiData('user', 'd-user', this.formValue).subscribe(
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
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    let endRes = Object.assign({ detail_aplikasi: this.detailData }, this.formValue)
    this.request.apiData('user', this.onUpdate ? 'u-user' : 'i-user', endRes).subscribe(
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