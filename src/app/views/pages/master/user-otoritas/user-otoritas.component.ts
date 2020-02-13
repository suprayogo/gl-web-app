import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
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

const content = {
  beforeCodeTitle: 'Otoritas & Perusahaan User'
}

@Component({
  selector: 'kt-user-otoritas',
  templateUrl: './user-otoritas.component.html',
  styleUrls: ['./user-otoritas.component.scss', '../master.style.scss']
})
export class UserOtoritasComponent implements OnInit {

  //Configuration
  otoritas = [
    {
      label: 'DEFAULT',
      value: 'default'
    }
  ]

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  loadingUser: boolean = true;
  loadingPerusahaan: boolean = true;
  selectedTab: number = 0;
  browseNeedUpdate: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  editable: boolean = false;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = false;
  dialogRef: any;
  dialogType: string = null;
  subscription: any;

  //Button Layout 
  buttonLayout = [
    {
      btnLabel: 'Tambah Akses Perusahaan',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('kode_perusahaan')
      },
      btnCondition: () => {
        return true
      }
    }
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'ID User',
      value: 'user_id'
    },
    {
      label: 'Nama User',
      value: 'user_name'
    },
    {
      label: 'Kode Otoritas',
      value: 'kode_otoritas'
    },
    {
      label: 'Nama Otoritas',
      value: 'nama_otoritas'
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
    kode_perusahaan: 'string',
    nama_perusahaan: 'string',
    kode_schema: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []
  inputUserDisplayColumns = [
    {
      label: 'User ID',
      value: 'user_id'
    },
    {
      label: 'User Name',
      value: 'user_name'
    }
  ];
  inputUserInterface = {
    user_id: 'string',
    user_name: 'string'
  }
  inputUserData = []
  inputUserDataRules = []
  inputPerusahaanDisplayColumns = [
    {
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan',
      selectable: true
    },
    {
      label: 'Nama Perusahaan',
      value: 'nama_perusahaan'
    }
  ];
  inputPerusahaanInterface = {
    kode_perusahaan: 'string',
    nama_perusahaan: 'string'
  }
  inputPerusahaanData = []
  inputPerusahaanDataRules = []
  inputOtoritasData = []

  // User-Aplikasi List Detail
  detailDisplayColumns = [
    {
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan'
    },
    {
      label: 'Nama Perusahaan',
      value: 'nama_perusahaan'
    }
  ]
  detailInterface = {
    kode_perusahaan: 'string',
    nama_perusahaan: 'string'
  }
  detailData = []
  detailRules = []

  // Input Name
  formValue = {
    user_id: '',
    user_name: '',
    kode_otoritas: ''
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'ID User',
      id: 'user-id',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'user_id',
      valueOf: 'user_id',
      required: true,
      readOnly: false,
      inputInfo: false,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nama User',
      id: 'nama-user',
      type: 'input',
      valueOf: 'user_name',
      required: false,
      readOnly: true,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Otoritas',
      id: 'otoritas',
      type: 'combobox',
      options: this.otoritas,
      valueOf: 'kode_otoritas',
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
    this.madeRequest()
    // console.log(this.gbl.getKodePerusahaan())
    // this.subscription = this.gbl.change.subscribe(
    //   value => {
    //     console.log('subs: ' + value)
    //   }
    // )
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe()
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
    let x = JSON.parse(JSON.stringify(this.formValue))
    x.user_id = data['user_id']
    x.user_name = data['user_name']
    x.kode_otoritas = data['kode_otoritas']
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

    if (this.forminput !== undefined) {
      this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
      if (!inputForm.invalid && this.validateSubmit() == true) {
        this.loading = true;
        this.ref.markForCheck()
        let endRes = Object.assign({ detail_perusahaan: this.detailData }, this.formValue)
        this.request.apiData('user', this.onUpdate ? 'u-user-otoritas' : 'i-user-otoritas', endRes).subscribe(
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
        this.openSnackBar('DATA TIDAK LENGKAP.', 'info')
      }
    }
  }

  validateSubmit() {
    let valid = false

    if (
      (this.formValue.user_id !== '' && this.formValue.user_id != null && this.formValue.user_id !== undefined) &&
      (this.formValue.user_name !== '' && this.formValue.user_name != null && this.formValue.user_name !== undefined) &&
      (this.formValue.kode_otoritas !== '' && this.formValue.kode_otoritas != null && this.formValue.kode_otoritas !== undefined) &&
      this.detailData.length > 0
    ) valid = true

    return valid
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      user_id: '',
      user_name: '',
      kode_otoritas: this.otoritas.length > 0 ? this.otoritas[0]['value'] : ''
    }
    this.detailData = []
    this.formInputCheckChanges()
    this.formInputCheckDetailChanges()
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
      this.request.apiData('perusahaan', 'd-perusahaan', this.formValue).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.browseNeedUpdate = true
            this.ref.markForCheck()
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
          type === "user_id" ? this.inputUserInterface :
            type === "kode_perusahaan" ? this.inputPerusahaanInterface :
              {},
        displayedColumns:
          type === "user_id" ? this.inputUserDisplayColumns :
            type === "kode_perusahaan" ? this.inputPerusahaanDisplayColumns :
              [],
        tableData:
          type === "user_id" ? this.inputUserData :
            type === "kode_perusahaan" ? this.inputPerusahaanData :
              [],
        tableRules:
          type === "user_id" ? this.inputUserDataRules :
            type === "kode_perusahaan" ? this.inputPerusahaanDataRules :
              [],
        formValue: this.formValue,
        selectable: type === 'kode_perusahaan' ? true : false,
        selected: this.detailData,
        selectIndicator: "kode_perusahaan",
        loadingData: type === "user_id" ? this.loadingUser :
          type === "kode_perusahaan" ? this.loadingPerusahaan :
            null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "user_id") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('user_id', result.user_id)
            this.forminput.updateFormValue('user_name', result.user_name)
          }
        } else if (type === "kode_perusahaan") {
          if (this.forminput !== undefined) {
            let x = result
            for (var i = 0; i < x.length; i++) {
              for (var j = 0; j < this.detailData.length; j++) {
                if (this.detailData[j]['kode_perusahaan'] === x[i]['kode_perusahaan']) {
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
            this.formInputCheckDetailChanges()
          }
        }
        this.dialogRef = undefined
        this.dialogType = null
        this.ref.markForCheck();
      }
    });
  }

  deleteDetailData(data) {
    for (var i = 0; i < this.detailData.length; i++) {
      if (this.detailData[i]['kode_perusahaan'] === data['kode_perusahaan']) {
        this.detailData.splice(i, 1)
        this.formInputCheckDetailChanges()
        break;
      }
    }
  }

  madeRequest() {
    this.request.apiData('otoritas', 'g-otoritas').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let x = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              label: data['RESULT'][i]['nama_otoritas'] + " (" + data['RESULT'][i]['keterangan'] + ")",
              value: data['RESULT'][i]['kode_otoritas']
            }
            x.push(t)
          }
          this.otoritas = x
          this.formValue.kode_otoritas = this.otoritas.length > 0 ? this.otoritas[0]['value'] : ''
          this.inputLayout.splice(this.inputLayout.length - 1, 1, {
            formWidth: 'col-5',
            label: 'Otoritas',
            id: 'otoritas',
            type: 'combobox',
            options: this.otoritas,
            valueOf: 'kode_otoritas',
            update: {
              disabled: false
            }
          })
          this.loading = false
          this.ref.markForCheck()
          this.sendRequestDaftarUser()
          this.sendRequestDaftarPerusahaan()
        } else {
          this.loading = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan daftar otoritas, mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  sendRequestDaftarUser() {
    this.request.apiData('user', 'g-user-belum-ada-otoritas').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputUserData = data['RESULT']
          this.loadingUser = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "user_id") {
              this.dialog.closeAll()
              this.openDialog('user_id')
            }
          }
        } else {
          this.loadingUser = false
          this.ref.markForCheck()
          this.dialog.closeAll()
          this.openSnackBar("Gagal mendapatkan daftar user.", "fail")
        }
      }
    )
  }

  sendRequestDaftarPerusahaan() {
    this.request.apiData('perusahaan', 'g-perusahaan').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputPerusahaanData = data['RESULT']
          this.loadingPerusahaan = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_perusahaan") {
              this.dialog.closeAll()
              this.openDialog('kode_perusahaan')
            }
          }
        } else {
          this.loadingPerusahaan = false
          this.ref.markForCheck()
          this.dialog.closeAll()
          this.openSnackBar("Gagal mendapatkan daftar perusahaan.", "fail")
        }
      }
    )
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('user', 'g-user-otoritas').subscribe(
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
            this.browseNeedUpdate = false
            this.tableLoad = false
            this.ref.markForCheck()
          }
        }
      }
    )
  }

  getDetail() {
    this.detailLoad = true;
    this.ref.markForCheck()
    this.request.apiData('user', 'g-user-perusahaan', { user_id: this.formValue.user_id }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
                length: 8,
                numeric: true,
                letters: false,
                special: false
              }))}`,
              kode_perusahaan: data['RESULT'][i]['kode_perusahaan'],
              nama_perusahaan: data['RESULT'][i]['nama_perusahaan']
            }
            res.push(t)
          }
          this.detailData = res
          this.detailLoad = false
          this.formInputCheckDetailChanges()
        } else {
          this.detailLoad = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan akses perusahaan, mohon coba lagi nanti.', 'fail')
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

  formInputCheckDetailChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }
}