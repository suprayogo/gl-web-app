import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material';
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

const content = {
  beforeCodeTitle: 'Chart of Account (COA)'
}

@Component({
  selector: 'kt-chart-of-account',
  templateUrl: './chart-of-account.component.html',
  styleUrls: ['./chart-of-account.component.scss', '../master.style.scss']
})
export class ChartOfAccountComponent implements OnInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  //Configuration
  tipe_akun: Object = [
    {
      label: 'Debit',
      value: 0
    },
    {
      label: 'Kredit',
      value: 1
    }
  ]

  // VARIABLES
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  editable: boolean = false;
  selectedTab: number = 0;
  onUpdate: boolean = false;
  enableDelete: boolean = true;
  loadingCOA: boolean = true;
  loadingDataText: string = "Loading Menu.."
  search: string;
  subscription: any;
  kode_perusahaan: string;
  dialogRef: any;
  dialogType: string = null;
  valTmp: any = ""

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
    id_akun: '',
    kode_akun: '',
    nama_akun: '',
    initKode_akun: '',
    initNama_akun: '',
    id_kategori_akun: '',
    kode_kategori_akun: '',
    nama_kategori_akun: '',
    tipe_induk: "1",
    id_induk_akun: '',
    kode_induk_akun: '',
    nama_induk_akun: '',
    tipe_akun: 0,
    keterangan: '',
    status_akun: 'G'
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Akun',
      id: 'kode-akun',
      type: 'input',
      valueOf: 'initKode_akun',
      required: true,
      readOnly: false,
      update: {
        disabled: true
      },
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Nama Akun',
      id: 'nama-akun',
      type: 'input',
      valueOf: 'initNama_akun',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    // {
    //   formWidth: 'col-5',
    //   label: 'Kategori Akun',
    //   id: 'kode-kategori-akun',
    //   type: 'inputgroup',
    //   click: (type) => this.openDialog(type),
    //   btnLabel: '',
    //   btnIcon: 'flaticon-search',
    //   browseType: 'kode_kategori_akun',
    //   valueOf: 'kode_kategori_akun',
    //   required: true,
    //   readOnly: false,
    //   inputInfo: {
    //     id: 'nama-kategori-akun',
    //     disabled: false,
    //     readOnly: true,
    //     required: false,
    //     valueOf: 'nama_kategori_akun'
    //   },
    //   blurOption: {
    //     ind: 'kode_kategori_akun',
    //     data: [],
    //     valueOf: ['kode_kategori_akun', 'nama_kategori_akun'],
    //     onFound: () => {
    //       if (this.onUpdate == true) {
    //         if (this.formValue.id_kategori_akun !== this.forminput.getData()['id_kategori_akun']) {
    //           this.forminput.getData()['id_induk_akun'] = ""
    //           this.forminput.getData()['kode_akun'] = ""
    //           this.forminput.getData()['nama_akun'] = ""
    //         }
    //       } else {
    //         this.valTmp === "" ? this.forminput.getData()['id_kategori_akun'] : this.valTmp
    //         if (this.forminput.getData()['id_kategori_akun'] !== this.valTmp) {
    //           this.forminput.getData()['id_induk_akun'] = ""
    //           this.forminput.getData()['kode_akun'] = ""
    //           this.forminput.getData()['nama_akun'] = ""
    //           this.valTmp = this.forminput.getData()['id_kategori_akun']
    //         }
    //       }
    //       this.filterDataOnBlur()
    //     }
    //   },
    //   update: {
    //     disabled: false
    //   }
    // },
    {
      formWidth: 'col-5',
      label: 'Induk Akun',
      id: 'kode-induk-akun',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_akun',
      valueOf: 'kode_akun',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-induk-akun',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_akun'
      },
      blurOption: {
        ind: 'kode_akun',
        data: [],
        valueOf: ['kode_akun', 'nama_akun'],
        onFound: () => null
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Akun',
      id: 'tipe-akun',
      type: 'combobox',
      options: this.tipe_akun,
      valueOf: 'tipe_akun',
      disabledOn: [
        {
          key: 'id_induk_akun',
          notEmpty: true
        },
        {
          key: 'kode_induk_akun',
          notEmpty: true
        },
        {
          key: 'nama_induk_akun',
          notEmpty: true
        }
      ],
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

  // Tree View Variable
  titleComponent = "Daftar Chart of Account (COA)"
  indicator = "kode_induk_akun"
  indicatorValue = ""
  subIndicator = "kode_akun"
  rowOf = 0
  headerView = [
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    },
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    // {
    //   label: 'Kategori akun',
    //   value: 'nama_kategori_akun'
    // },
    {
      label: 'Induk Akun',
      value: 'nama_induk_akun'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  sortBy = "kode_akun"

  // Kategori Akun Variable
  inputKategoriAkunDisplayColumns = [
    {
      label: 'Kode Kategori Akun',
      value: 'kode_kategori_akun'
    },
    {
      label: 'Nama Kategori Akun',
      value: 'nama_kategori_akun'
    }
  ]
  inputKategoriAkunInterface = {}
  inputKategoriAkunData = []
  inputKategoriAkunDataRules = []

  // Induk Akun Variable
  inputAkunDisplayColumns = [
    {
      label: 'Kode Akun',
      value: 'kode_akun'
    },
    {
      label: 'Nama Akun',
      value: 'nama_akun'
    },
    // {
    //   label: 'Kategori Akun',
    //   value: 'nama_kategori_akun'
    // },
    {
      label: 'Induk Akun',
      value: 'nama_induk_akun'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  inputAkunInterface = {}
  inputAkunData = []
  inputAkunDataRules = []

  // TAB MENU BROWSE 
  browseData = []
  browseDataRules = []

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, false)
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.madeRequest()
      }
    )
  }

  ngAfterViewInit(): void {
    if (this.kode_perusahaan === undefined) {
      this.kode_perusahaan = this.gbl.getKodePerusahaan()
      if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== '') {
        this.madeRequest()
      }
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
  }

  madeRequest() {
    this.request.apiData('akun', 'g-kat-akun-dc', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputKategoriAkunData = data['RESULT']
          this.gbl.updateInputdata(data['RESULT'], 'kode_kategori_akun', this.inputLayout)
        } else {
          this.inputKategoriAkunData = []
          this.gbl.openSnackBar('Gagal mendapatkan daftar kategori akun', 'fail')
          this.ref.markForCheck()
        }
      }
    )
    this.sendRequestAkunBisaJadiInduk()
    this.sendRequestAkun()
  }

  sendRequestAkunBisaJadiInduk() {
    this.request.apiData('akun', 'g-akun-bisa-jadi-induk', { kode_perusahaan: this.kode_perusahaan, level_induk: '3' }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.inputAkunData = []
          this.loading = false
          this.ref.markForCheck()
          this.gbl.openSnackBar('Gagal mendapatkan daftar induk akun.', 'fail')
        }
      }
    )
  }

  sendRequestAkun() {
    this.loadingCOA = true
    this.ref.markForCheck()
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          this.loadingCOA = false
          this.ref.markForCheck()
        } else {
          this.browseData = []
          this.loading = false
          this.loadingCOA = false
          this.ref.markForCheck()
          this.gbl.openSnackBar('Gagal mendapatkan daftar akun.', 'fail')
        }
      }
    )
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formValue = {
      id_akun: x['id_akun'],
      initKode_akun: x['kode_akun'],
      initNama_akun: x['nama_akun'],
      id_kategori_akun: x['id_kategori_akun'],
      kode_kategori_akun: x['kode_kategori_akun'],
      nama_kategori_akun: x['nama_kategori_akun'],
      tipe_induk: x['tipe_induk'],
      id_induk_akun: x['id_induk_akun'],
      kode_akun: x['kode_induk_akun'],
      nama_akun: x['nama_induk_akun'],
      kode_induk_akun: x['kode_induk_akun'],
      nama_induk_akun: x['nama_induk_akun'],
      tipe_akun: x['tipe_akun'],
      keterangan: x['keterangan'],
      status_akun: 'G'
    }
    this.enableDelete = x['boleh_hapus'] === 'Y' ? true : false
    let status_edit = parseInt(x['level_akun']) > 3 ? true : false
    this.inputLayout.splice(0, 6,
      {
        formWidth: 'col-5',
        label: 'Kode Akun',
        id: 'kode-akun',
        type: 'input',
        valueOf: 'initKode_akun',
        required: true,
        readOnly: false,
        update: {
          disabled: true
        },
        inputPipe: true
      },
      {
        formWidth: 'col-5',
        label: 'Nama Akun',
        id: 'nama-akun',
        type: 'input',
        valueOf: 'initNama_akun',
        required: true,
        readOnly: false,
        update: {
          disabled: status_edit == false ? true : false
        }
      },
      // {
      //   formWidth: 'col-5',
      //   label: 'Kategori Akun',
      //   id: 'kode-kategori-akun',
      //   type: 'inputgroup',
      //   click: (type) => this.openDialog(type),
      //   btnLabel: '',
      //   btnIcon: 'flaticon-search',
      //   browseType: 'kode_kategori_akun',
      //   valueOf: 'kode_kategori_akun',
      //   required: true,
      //   readOnly: false,
      //   inputInfo: {
      //     id: 'nama-kategori-akun',
      //     disabled: false,
      //     readOnly: true,
      //     required: false,
      //     valueOf: 'nama_kategori_akun'
      //   },
      //   blurOption: {
      //     ind: 'kode_kategori_akun',
      //     data: [],
      //     valueOf: ['kode_kategori_akun', 'nama_kategori_akun'],
      //     onFound: () => {
      //       if (this.onUpdate == true) {
      //         if (this.formValue.id_kategori_akun !== this.forminput.getData()['id_kategori_akun']) {
      //           this.forminput.getData()['id_induk_akun'] = ""
      //           this.forminput.getData()['kode_akun'] = ""
      //           this.forminput.getData()['nama_akun'] = ""
      //         }
      //       } else {
      //         this.valTmp === "" ? this.forminput.getData()['id_kategori_akun'] : this.valTmp
      //         if (this.forminput.getData()['id_kategori_akun'] !== this.valTmp) {
      //           this.forminput.getData()['id_induk_akun'] = ""
      //           this.forminput.getData()['kode_akun'] = ""
      //           this.forminput.getData()['nama_akun'] = ""
      //           this.valTmp = this.forminput.getData()['id_kategori_akun']
      //         }
      //       }
      //       this.filterDataOnBlur()
      //     }
      //   },
      //   update: {
      //     disabled: status_edit == false ? true : false
      //   }
      // },
      {
        formWidth: 'col-5',
        label: 'Induk Akun',
        id: 'kode-induk-akun',
        type: 'inputgroup',
        click: (type) => this.openDialog(type),
        btnLabel: '',
        btnIcon: 'flaticon-search',
        browseType: 'kode_akun',
        valueOf: 'kode_akun',
        required: false,
        readOnly: false,
        inputInfo: {
          id: 'nama-induk-akun',
          disabled: false,
          readOnly: true,
          required: false,
          valueOf: 'nama_akun'
        },
        blurOption: {
          ind: 'kode_akun',
          data: [],
          valueOf: ['kode_akun', 'nama_akun'],
          onFound: () => null
        },
        update: {
          disabled: status_edit == false ? true : false
        }
      },
      {
        formWidth: 'col-5',
        label: 'Tipe Akun',
        id: 'tipe-akun',
        type: 'combobox',
        options: this.tipe_akun,
        valueOf: 'tipe_akun',
        disabledOn: [
          {
            key: 'id_induk_akun',
            notEmpty: true
          },
          {
            key: 'kode_induk_akun',
            notEmpty: true
          },
          {
            key: 'nama_induk_akun',
            notEmpty: true
          }
        ],
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
    )
    this.onUpdate = true;
    // this.filterDataOnBlur()
    this.gbl.topPage()
    this.formInputCheckChanges()
  }

  // Dialog
  openDialog(type) {
    this.gbl.topPage()
    // if (type === 'kode_akun') {
    //   if (this.forminput.getData()['kode_kategori_akun'] === "" || this.forminput.getData()['nama_kategori_akun'] === "") {
    //     this.gbl.openSnackBar('Pilih kategori akun dahulu.', 'info', () => {
    //       setTimeout(() => {
    //         this.openDialog('kode_kategori_akun')
    //       }, 250)
    //     })
    //     return
    //   }
    // }
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: type === "kode_kategori_akun" ? '55vw' : '70vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '40px' },
      data: {
        type: type,
        tableInterface:
          type === "kode_kategori_akun" ? this.inputKategoriAkunInterface :
            type === "kode_akun" ? this.inputAkunInterface :
              {},
        displayedColumns:
          type === "kode_kategori_akun" ? this.inputKategoriAkunDisplayColumns :
            type === "kode_akun" ? this.inputAkunDisplayColumns :
              [],
        tableData:
          type === "kode_kategori_akun" ? this.inputKategoriAkunData :
            type === "kode_akun" ?
              /*  this.onUpdate == true ? */
              this.inputAkunData.filter(x => x.id_akun !== this.formValue.id_akun)
                // On Update = true
                /* this.inputAkunData.filter(x =>
                  x['id_kategori_akun'] === this.formValue.id_kategori_akun && x['id_akun'] !== this.formValue.id_akun) : */

                // On Update = false
                /* this.inputAkunData.filter(x =>
                  x['id_kategori_akun'] === (this.forminput === undefined || this.forminput === undefined || this.forminput === "" || this.forminput === null ?
                    this.formValue.id_kategori_akun :
                    this.forminput.getData()['id_kategori_akun'])) */ :
              [],
        tableRules:
          type === "kode_kategori_akun" ? this.inputKategoriAkunDataRules :
            type === "kode_akun" ? this.inputAkunDataRules :
              [],
        formValue: this.formValue,
        sizeCont: 360,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_kategori_akun") {
          if (this.forminput !== undefined) {
            if (this.onUpdate == true) {
              if (this.formValue.id_kategori_akun !== result.id_kategori_akun) {
                this.forminput.updateFormValue('id_induk_akun', "")
                this.forminput.updateFormValue('kode_akun', "")
                this.forminput.updateFormValue('nama_akun', "")
              }
            } else {
              if (this.forminput.getData()['id_kategori_akun'] !== result.id_kategori_akun) {
                this.forminput.updateFormValue('id_induk_akun', "")
                this.forminput.updateFormValue('kode_akun', "")
                this.forminput.updateFormValue('nama_akun', "")
                this.valTmp = result.id_kategori_akun
              }
            }
            this.forminput.updateFormValue('id_kategori_akun', result.id_kategori_akun)
            this.forminput.updateFormValue('kode_kategori_akun', result.kode_kategori_akun)
            this.forminput.updateFormValue('nama_kategori_akun', result.nama_kategori_akun)
            this.filterDataOnBlur()
          }
        } else if (type === "kode_akun") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('id_induk_akun', result.id_akun)
            this.forminput.updateFormValue('kode_akun', result.kode_akun)
            this.forminput.updateFormValue('nama_akun', result.nama_akun)
            this.forminput.updateFormValue('kode_induk_akun', result.kode_akun)
            this.forminput.updateFormValue('nama_induk_akun', result.nama_akun)
            this.forminput.updateFormValue('tipe_akun', result.tipe_akun)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: [
          {
            label: 'Kode Akun',
            id: 'kode-akun',
            type: 'input',
            valueOf: this.formValue.initKode_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Nama Akun',
            id: 'nama-akun',
            type: 'input',
            valueOf: this.formValue.initNama_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
         /*  {
            label: 'Nama Kategori Akun',
            id: 'nama-kategori-akun',
            type: 'input',
            valueOf: this.formValue.nama_kategori_akun,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          }, */
          {
            label: 'Induk Akun',
            id: 'induk-akun',
            type: 'input',
            valueOf: this.formValue.kode_induk_akun,
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

  filterDataOnBlur() {
    this.gbl.updateInputdata(this.onUpdate == true ?

      // On Update = true
      this.inputAkunData.filter(x =>
        x['id_kategori_akun'] === this.formValue.id_kategori_akun && x['id_akun'] !== this.formValue.id_akun) :

      // On Update = false
      this.inputAkunData.filter(x =>
        x['id_kategori_akun'] === (this.forminput === undefined || this.forminput === "" || this.forminput === null ?
          this.formValue.id_kategori_akun :
          this.forminput.getData()['id_kategori_akun'])), 'kode_akun', this.inputLayout)
  }

  refreshBrowse(message) {
    this.onUpdate = false
    this.sendRequestAkunBisaJadiInduk()
    this.sendRequestAkun()
    this.gbl.openSnackBar(message, 'success')
  }

  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        if (this.forminput.getData()['tipe_induk'] === '1' && this.forminput.getData()['kode_akun'] === '') {
          this.gbl.openSnackBar('Induk Akun Belum Diisi.', 'info')
        } else {
          this.saveData()
        }
      } else {
        if (this.forminput.getData()['initKode_akun'] === '') {
          this.gbl.openSnackBar('Kode Akun Belum Diisi.', 'info')
        } else if (this.forminput.getData()['initNama_akun'] === '') {
          this.gbl.openSnackBar('Nama Akun Belum Diisi.', 'info')
        }/*  else if (this.forminput.getData()['kode_kategori_akun'] === '') {
          this.gbl.openSnackBar('Kategori Akun Belum Diisi.', 'info', () => {
            setTimeout(() => {
              this.openDialog('kode_kategori_akun')
            }, 250)
          })
          return
        } */
      }
    }
  }

  //Form submit
  saveData() {
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    this.formValue.id_akun = this.formValue.id_akun === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_akun
    this.formValue.kode_akun = this.formValue.initKode_akun
    this.formValue.nama_akun = this.formValue.initNama_akun
    this.formValue['kode_perusahaan'] = this.kode_perusahaan

    this.request.apiData('akun', this.onUpdate ? 'u-akun' : 'i-akun', this.formValue).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.loading = false
          this.resetForm()
          this.ref.markForCheck()
          this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar(data['RESULT'])
        }
      },
      error => {
        this.loading = false;
        this.ref.markForCheck()
        this.gbl.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
      }
    )
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      initKode_akun: '',
      initNama_akun: '',
      id_kategori_akun: '',
      tipe_induk: '1',
      kode_kategori_akun: '',
      nama_kategori_akun: '',
      id_induk_akun: '',
      kode_induk_akun: '',
      nama_induk_akun: '',
      tipe_akun: 0,
      keterangan: '',
      status_akun: 'G'
    }
    //this.detailData = []
    this.formInputCheckChanges()
  }

  onCancel() {
    if (!this.onUpdate) {
      this.resetForm()
    } else {
      this.inputLayout = [
        {
          formWidth: 'col-5',
          label: 'Kode Akun',
          id: 'kode-akun',
          type: 'input',
          valueOf: 'initKode_akun',
          required: true,
          readOnly: false,
          update: {
            disabled: true
          },
          inputPipe: true
        },
        {
          formWidth: 'col-5',
          label: 'Nama Akun',
          id: 'nama-akun',
          type: 'input',
          valueOf: 'initNama_akun',
          required: true,
          readOnly: false,
          update: {
            disabled: false
          }
        },
        // {
        //   formWidth: 'col-5',
        //   label: 'Kategori Akun',
        //   id: 'kode-kategori-akun',
        //   type: 'inputgroup',
        //   click: (type) => this.openDialog(type),
        //   btnLabel: '',
        //   btnIcon: 'flaticon-search',
        //   browseType: 'kode_kategori_akun',
        //   valueOf: 'kode_kategori_akun',
        //   required: true,
        //   readOnly: false,
        //   inputInfo: {
        //     id: 'nama-kategori-akun',
        //     disabled: false,
        //     readOnly: true,
        //     required: false,
        //     valueOf: 'nama_kategori_akun'
        //   },
        //   blurOption: {
        //     ind: 'kode_kategori_akun',
        //     data: [],
        //     valueOf: ['kode_kategori_akun', 'nama_kategori_akun'],
        //     onFound: () => {
        //       if (this.onUpdate == true) {
        //         if (this.formValue.id_kategori_akun !== this.forminput.getData()['id_kategori_akun']) {
        //           this.forminput.getData()['id_induk_akun'] = ""
        //           this.forminput.getData()['kode_akun'] = ""
        //           this.forminput.getData()['nama_akun'] = ""
        //         }
        //       } else {
        //         this.valTmp === "" ? this.forminput.getData()['id_kategori_akun'] : this.valTmp
        //         if (this.forminput.getData()['id_kategori_akun'] !== this.valTmp) {
        //           this.forminput.getData()['id_induk_akun'] = ""
        //           this.forminput.getData()['kode_akun'] = ""
        //           this.forminput.getData()['nama_akun'] = ""
        //           this.valTmp = this.forminput.getData()['id_kategori_akun']
        //         }
        //       }
        //       this.filterDataOnBlur()
        //     }
        //   },
        //   update: {
        //     disabled: false
        //   }
        // },
        {
          formWidth: 'col-5',
          label: 'Induk Akun',
          id: 'kode-induk-akun',
          type: 'inputgroup',
          click: (type) => this.openDialog(type),
          btnLabel: '',
          btnIcon: 'flaticon-search',
          browseType: 'kode_akun',
          valueOf: 'kode_akun',
          required: false,
          readOnly: false,
          inputInfo: {
            id: 'nama-induk-akun',
            disabled: false,
            readOnly: true,
            required: false,
            valueOf: 'nama_akun'
          },
          blurOption: {
            ind: 'kode_akun',
            data: [],
            valueOf: ['kode_akun', 'nama_akun'],
            onFound: () => null
          },
          update: {
            disabled: false
          }
        },
        {
          formWidth: 'col-5',
          label: 'Tipe Akun',
          id: 'tipe-akun',
          type: 'combobox',
          options: this.tipe_akun,
          valueOf: 'tipe_akun',
          disabledOn: [
            {
              key: 'id_induk_akun',
              notEmpty: true
            },
            {
              key: 'kode_induk_akun',
              notEmpty: true
            },
            {
              key: 'nama_induk_akun',
              notEmpty: true
            }
          ],
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
      this.request.apiData('akun', 'd-akun', { kode_perusahaan: this.kode_perusahaan, id_akun: this.formValue.id_akun }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.refreshBrowse('BERHASIL DIHAPUS')
          } else {
            this.loading = false;
            this.ref.markForCheck()
            this.gbl.openSnackBar(data['RESULT'])
          }
        },
        error => {
          this.loading = false;
          this.ref.markForCheck()
          this.gbl.openSnackBar('GAGAL MELAKUKAN PENGHAPUSAN.')
        }
      )
    }
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

}
