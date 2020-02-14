import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Request Data API
import { RequestDataService } from '../../../../service/request-data.service';

// Components
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Daftar Menu'
}

@Component({
  selector: 'kt-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss', '../master.style.scss']
})
export class MenuComponent implements OnInit {

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
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingMenu: boolean = true;
  loadingDataText: string = "Loading Menu.."
  search: string;

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

  // Input Name
  formValue = {
    kode_menu: '',
    nama_menu: '',
    detail: 'Y',
    induk_menu: '',
    nama_induk_menu: '',
    type_menu: 'F',
    urutan: '',
    link_menu: '',
    img_menu: '',
    keterangan: ''
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
      inputPipe: true
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

  //Tree view Variables
  titleComponent = "Daftar Menu"
  indicator = "induk_menu"
  indicatorValue = ""
  subIndicator = "kode_menu"
  rowOf = 0
  headerView = [
    {
      label: 'Nama Menu',
      value: 'nama_menu'
    },
    {
      label: 'Kode Menu',
      value: 'kode_menu'
    },
    {
      label: 'Tipe Menu',
      value: 'type_menu'
    },
    {
      label: 'Detail',
      value: 'detail'
    },
    {
      label: 'Urutan',
      value: 'urutan'
    },
    {
      label: 'Link Menu',
      value: 'link_menu'
    },
    {
      label: 'Image / Icon Menu',
      value: 'img_menu'
    },
    {
      label: 'Induk Menu',
      value: 'induk_menu'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  sortBy = "urutan"

  inputMenuDisplayColumns = [
    {
      label: 'Kode Menu',
      value: 'kode_menu'
    },
    {
      label: 'Nama Menu',
      value: 'nama_menu'
    },
    {
      label: 'Induk Menu',
      value: 'induk_menu'
    }
  ]

  inputMenuInterface = {
    kode_menu: 'string',
    nama_menu: 'string',
    induk_menu: 'string'
  }
  inputMenuData = []
  inputMenuDataRules = []

  // TAB MENU BROWSE 
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
    this.loading = false
    this.sendRequestMenu()
  }

  sendRequestMenu() {
    this.loadingMenu = true
    this.ref.markForCheck()
    this.request.apiData('menu', 'g-menu').subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.inputMenuData = data['RESULT']
          this.loadingMenu = false
          this.ref.markForCheck()
        } else {
          this.loadingMenu = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan data.')
        }
      }
    )
  }

  // Dialog
  openDialog(type) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: type,
        tableInterface:
          type === "induk_menu" ? this.inputMenuInterface :
            {},
        displayedColumns:
          type === "induk_menu" ? this.inputMenuDisplayColumns :
            [],
        tableData:
          type === "induk_menu" ? this.inputMenuData.filter(x => x['detail'] === 'N') :
            [],
        tableRules:
          type === "induk_menu" ? this.inputMenuDataRules :
            [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "induk_menu") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('induk_menu', result.kode_menu)
            this.forminput.updateFormValue('nama_induk_menu', result.nama_menu)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.sendRequestMenu()
    this.openSnackBar(message)
  }

  //Browse binding event
  browseSelectRow(data) {
    this.formValue = data
    for (var i = 0; i < this.inputMenuData.length; i++) {
      if (this.inputMenuData[i]['kode_menu'] === this.formValue['induk_menu']) {
        this.formValue['nama_induk_menu'] = this.inputMenuData[i]['nama_menu']
        break
      }
    }
    this.onUpdate = true;
    window.scrollTo(0, 0)
    this.formInputCheckChanges()
  }

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.loading = true
    this.ref.markForCheck()
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.request.apiData('menu', this.onUpdate ? 'u-menu' : 'i-menu', this.formValue).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.loading = false
              this.resetForm()
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
      kode_menu: '',
      nama_menu: '',
      detail: 'Y',
      induk_menu: '',
      nama_induk_menu: '',
      type_menu: 'F',
      urutan: '',
      link_menu: '',
      img_menu: '',
      keterangan: ''
    }
    //this.detailData = []
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
      this.request.apiData('menu', 'd-menu', { kode_menu: this.formValue.kode_menu }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
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
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

}
