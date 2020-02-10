import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { DialogComponent } from '../../components/dialog/dialog.component';
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { DetailinputAgGridComponent } from '../../components/detailinput-ag-grid/detailinput-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';

const content = {
  beforeCodeTitle: 'Daftar Menu'
}

@Component({
  selector: 'kt-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', '../master.style.scss']
})
export class MenuComponent implements OnInit {

  //Configuration
  tipe_menu: Object = [
    {
      label: 'Form',
      value: 'F'
    },
    {
      label: 'Report',
      value: 'R'
    }
  ]
  tipe_detail: Object = [
    {
      label: 'Ya',
      value: 'Y'
    },
    {
      label: 'Tidak',
      value: 'N'
    }
  ]

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
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

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Perusahaan',
      value: 'kode_perusahaan'
    },
    {
      label: 'Nama Perusahaan',
      value: 'nama_perusahaan'
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

    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  // Input Name
  formValue = {
    kode_perusahaan: '',
    nama_perusahaan: '',
    kode_schema: ''
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Menu',
      id: 'kode-menu',
      type: 'input',
      valueOf: 'kode_menu',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      },
      inputPipe: (type, v) => this.inputPipe(type, v)
    },
    {
      formWidth: 'col-5',
      label: 'Nama Menu',
      id: 'nama-menu',
      type: 'input',
      valueOf: 'nama_menu',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Menu',
      id: 'tipe-menu',
      type: 'combobox',
      options: this.tipe_menu,
      change: (e) => this.selection(e, 'type_menu'),
      valueOf: 'type_menu',
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Detail',
      id: 'detail',
      type: 'combobox',
      options: this.tipe_detail,
      change: (e) => this.selection(e, 'detail'),
      valueOf: 'detail',
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Induk Menu',
      id: 'kode-induk-menu',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'induk_menu',
      valueOf: 'induk_menu',
      required: false,
      readOnly: false,
      hiddenOn: {
        valueOf: 'detail',
        matchValue: 'N'
      },
      inputInfo: {
        id: 'nama-induk-menu',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_induk_menu'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Urutan',
      id: 'urutan',
      type: 'input',
      valueOf: 'urutan',
      required: true,
      readOnly: false,
      numberOnly: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Link Menu',
      id: 'link-menu',
      type: 'input',
      valueOf: 'link_menu',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Image / Icon Menu',
      id: 'image-menu',
      type: 'input',
      valueOf: 'img_menu',
      required: false,
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

  constructor(
    public dialog: MatDialog,
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

  onBlur(type) {

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
    let x = this.formValue
    x.kode_perusahaan = data['kode_perusahaan']
    x.nama_perusahaan = data['nama_perusahaan']
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
        this.request.apiData('perusahaan', this.onUpdate ? 'u-perusahaan' : 'i-perusahaan', this.formValue).subscribe(
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
      kode_perusahaan: '',
      nama_perusahaan: '',
      kode_schema: ''
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
      this.request.apiData('perusahaan', 'd-perusahaan', this.formValue).subscribe(
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

  // Dialog
  openDialog(type) {

  }

  inputPipe(valueOf, data) {
    this.formValue[valueOf] = data.toUpperCase()
  }

  sendUserRequest() {
    
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.loading = false
  }

  refreshBrowse(message) {
    // this.tableLoad = true
    // this.request.apiData('aplikasi', 'g-aplikasi').subscribe(
    //   data => {
    //     if (data['STATUS'] === 'Y') {
    //       if (message !== '') {
    //         this.browseData = data['RESULT']
    //         this.loading = false
    //         this.tableLoad = false
    //         this.ref.markForCheck()
    //         this.openSnackBar(message, 'success')
    //         this.onUpdate = false
    //       } else {
    //         this.browseData = data['RESULT']
    //         this.loading = false
    //         this.tableLoad = false
    //         this.browseNeedUpdate = false
    //         this.ref.markForCheck()
    //       }
    //     }
    //   }
    // )
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
