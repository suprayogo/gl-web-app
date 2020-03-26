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
  beforeCodeTitle: 'Daftar Rekening Perusahaan'
}

@Component({
  selector: 'kt-rekening-perusahaan',
  templateUrl: './rekening-perusahaan.component.html',
  styleUrls: ['./rekening-perusahaan.component.scss', '../master.style.scss']
})
export class RekeningPerusahaanComponent implements OnInit, AfterViewInit {

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

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

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

  inputBankDisplayColumns = [
    {
      label: 'Kode Bank',
      value: 'kode_bank'
    },
    {
      label: 'Nama Bank',
      value: 'nama_bank'
    }
  ]
  inputBankInterface = {
    kode_bank: 'string',
    nama_bank: 'string'
  }
  inputBankData = []
  inputBankDataRules = []

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Kode Bank',
      value: 'kode_bank'
    },
    {
      label: 'No. Rekening',
      value: 'no_rekening'
    },
    {
      label: 'Atas Nama',
      value: 'atas_nama'
    },
    {
      label: 'Kantor Cabang',
      value: 'nama_kantor_cabang'
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
    kode_bank: 'string',
    no_rekening: 'string',
    atas_nama: 'string',
    nama_kantor_cabang: 'string',
    keterangan: 'string',
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
    kode_bank: '',
    no_rekening: '',
    atas_nama: '',
    nama_kantor_cabang: '',
    keterangan: '',
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Kode Bank',
      id: 'kode-bank',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_bank',
      valueOf: 'kode_bank',
      required: true,
      readOnly: false,
      hiddenOn: false,
      inputInfo: {
        id: 'nama-bank',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_bank'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Rekening',
      id: 'no-rekening',
      type: 'input',
      valueOf: 'no_rekening',
      required: false,
      readOnly: false,
      numberOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Atas Nama',
      id: 'atas-nama',
      type: 'input',
      valueOf: 'atas_nama',
      required: false,
      readOnly: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Kantor Cabang',
      id: 'nama-kantor-cabang',
      type: 'input',
      valueOf: 'nama_kantor_cabang',
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
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.needCompany(true) 
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
    this.inputBankData = []
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('bank', 'g-bank', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputBankData = data['RESULT']
            this.loading = false
            this.ref.markForCheck()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar bank. mohon coba lagi nanti.')
            this.loading = false
            this.loadingBank = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  // Dialog
  openDialog(type) {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      data: {
        type: type,
        tableInterface:
          type === "kode_bank" ? this.inputBankInterface :
            {},
        displayedColumns:
          type === "kode_bank" ? this.inputBankDisplayColumns :
            [],
        tableData:
          type === "kode_bank" ? this.inputBankData :
            [],
        tableRules:
          type === "kode_bank" ? this.inputBankDataRules :
            [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_bank") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_bank', result.kode_bank)
            this.forminput.updateFormValue('nama_bank', result.nama_bank)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '90vw',
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
            valueOf: this.formValue.kode_bank,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'No. Rekening',
            id: 'no-rekening',
            type: 'input',
            valueOf: this.formValue.no_rekening,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Atas Nama',
            id: 'atas-nama',
            type: 'input',
            valueOf: this.formValue.atas_nama,
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
    let x = this.formValue
    x.kode_bank = data['kode_bank']
    x.no_rekening = data['no_rekening']
    x.atas_nama = data['atas_nama']
    x.nama_kantor_cabang = data['nama_kantor_cabang']
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
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
      if (inputForm.valid && this.formValue.kode_bank !== undefined) {
        if (this.formValue.no_rekening === "") {
          this.openSnackBar('Nomor Rekening Belum Diisi.', 'info')
        } else if(this.formValue.atas_nama === "") {
          this.openSnackBar('Atas Nama Nasabah Belum Diisi.', 'info')  
        } else if(this.formValue.nama_kantor_cabang === "") {
          this.openSnackBar('Nama Kantor Cabang Belum Diisi.', 'info')  
        } else {
          this.addNewData()
        }
      } else {
        this.openSnackBar('Kode Bank Belum Diisi.', 'info')
      }
    }
  }

  addNewData() {
    this.loading = true;
    this.ref.markForCheck()
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
      kode_bank: '',
      no_rekening: '',
      atas_nama: '',
      nama_kantor_cabang: '',
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
      width: '90vw',
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
}