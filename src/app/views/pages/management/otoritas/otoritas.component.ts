import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { DialogComponent } from '../../components/dialog/dialog.component';
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

const content = {
  beforeCodeTitle: 'Daftar Otoritas'
}

@Component({
  selector: 'kt-otoritas',
  templateUrl: './otoritas.component.html',
  styleUrls: ['./otoritas.component.scss', '../management.style.scss']
})
export class OtoritasComponent implements OnInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

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
  loadingMenu: boolean = true;
  browseNeedUpdate: boolean = true;
  dialogRef: any;
  dialogType: string = null;
  search: string;

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
        'font-size': '20px',
        'font-weight': 'bold'
      }
    }
  ]

  // Input Name
  formValue = {
    kode_otoritas: '',
    nama_otoritas: '',
    keterangan: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Otoritas',
      id: 'kode-otoritas',
      type: 'input',
      valueOf: 'kode_otoritas',
      required: false,
      readOnly: true,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nama Otoritas',
      id: 'nama-otoritas',
      type: 'input',
      valueOf: 'nama_otoritas',
      required: true,
      readOnly: false,
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

  buttonLayout = [
    {
      btnLabel: 'Tambah Detail',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.openDialog('kode_menu')
      },
      btnCondition: () => {
        return true
      }
    }
  ]

  // Otoritas List
  inputMenuDisplayColumns = [
    {
      label: 'Kode Menu',
      value: 'kode_menu',
      selectable: true
    },
    {
      label: 'Nama Menu',
      value: 'nama_menu'
    }
  ]
  inputMenuInterface = {
    kode_menu: 'string',
    nama_menu: 'string'
  }
  inputMenuData = []
  inputMenuDataRules = []

  // Otoritas-Menu List Detail
  detailDisplayColumns = [
    {
      label: 'Kode Menu',
      value: 'kode_menu'
    },
    {
      label: 'Nama Menu',
      value: 'nama_menu'
    }
  ]
  detailInterface = {
    kode_menu: 'string',
    nama_menu: 'string'
  }
  detailData = []
  detailRules = []

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Otoritas',
      value: 'kode_otoritas'
    },
    {
      label: 'Nama Otoritas',
      value: 'nama_otoritas'
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
    kode_otoritas: 'string',
    nama_otoritas: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.madeRequest()
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.sendRequestMenu()
  }

  sendRequestMenu() {
    this.request.apiData('menu', 'g-menu').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputMenuData = data['RESULT']
          this.loading = false
          this.loadingMenu = false
          this.ref.markForCheck()
          if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
            if (this.dialogType === "kode_menu") {
              this.dialog.closeAll()
              this.openDialog('kode_menu')
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
          type === "kode_menu" ? this.inputMenuInterface :
            {},
        displayedColumns:
          type === "kode_menu" ? this.inputMenuDisplayColumns :
            [],
        tableData:
          type === "kode_menu" ? this.inputMenuData.filter(x => x['detail'] !== 'N') :
            [],
        tableRules:
          type === "kode_menu" ? this.inputMenuDataRules :
            [],
        formValue: this.formValue,
        selectable: type === 'kode_menu' ? true : false,
        selected: this.detailData,
        selectIndicator: "kode_menu",
        loadingData: type === "kode_menu" ? this.loadingMenu : null
      }
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_menu") {
          let x = result
          for (var i = 0; i < x.length; i++) {
            for (var j = 0; j < this.detailData.length; j++) {
              if (this.detailData[j]['kode_menu'] === x[i]['kode_menu']) {
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
          this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
        }
        this.dialogRef = undefined
        this.dialogType = null
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'Kode Otoritas',
            id: 'kode-otoritas',
            type: 'input',
            valueOf: this.formValue.kode_otoritas,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Otoritas',
            id: 'nama-otoritas',
            type: 'input',
            valueOf: this.formValue.nama_otoritas,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
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

  getDetail() {
    this.detailLoad = true
    this.request.apiData('otoritas', 'g-detail-otoritas', this.formValue).subscribe(
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
      if (this.detailData[i]['kode_menu'] === data['kode_menu']) {
        let x = this.detailData[i]
        this.detailData.splice(i, 1)
        this.dialog.closeAll()
        this.ref.markForCheck()
        this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
        break;
      }
    }
  }

  restructureDetailData(data) {
    let endRes = []
    for (var i = 0; i < data.length; i++) {
      for (var j = 0; j < this.inputMenuData.length; j++) {
        if (data[i]['kode_menu'] === this.inputMenuData[j]['kode_menu']) {
          let x = {
            id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`,
            kode_menu: data[i]['kode_menu'],
            nama_menu: this.inputMenuData[j]['nama_menu']
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
    this.request.apiData('otoritas', 'g-otoritas').subscribe(
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
    x.kode_otoritas = data['kode_otoritas']
    x.nama_otoritas = data['nama_otoritas']
    x.keterangan = data['keterangan']
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
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        let endRes = Object.assign({ detail_otoritas: this.detailData }, this.formValue)
        this.request.apiData('otoritas', this.onUpdate ? 'u-otoritas' : 'i-otoritas', endRes).subscribe(
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
      kode_otoritas: '',
      nama_otoritas: '',
      keterangan: '',
    }
    this.detailData = []
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
      this.loading = true;
      this.ref.markForCheck()
      this.request.apiData('otoritas', 'd-otoritas', this.formValue).subscribe(
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
      this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }
}