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
  beforeCodeTitle: 'Posting Jurnal & Tutup Periode'
}

@Component({
  selector: 'kt-posting-jurnal',
  templateUrl: './posting-jurnal.component.html',
  styleUrls: ['./posting-jurnal.component.scss', '../transaksi.style.scss']
})
export class PostingJurnalComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  content: any;
  button_name: any;
  nama_tombolPJ: any;
  nama_tombolTP: any;
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
  kp_V1: any;
  kp_V2: any;

  // GLOBAL VARIABLE PERIODE
  subsPA: any;
  pa_Res: any;
  pa_id: any;
  pa_tahun: any;
  pa_bulan: any;

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

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Tahun',
      value: 'tahun_periode'
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
    tahun_periode: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = []

  // Input Name POSTING JURNAL
  formValue = {
    bulan_periode: '',
    tahun_periode: '',
    id_posting: '',
    no_tran: '',
  }

  // Input Name TUTUP PERIODE
  formValueTP = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: '',
  }

  // Layout Form POSTING JURNAL
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Periode Aktif',
      id: 'bulan-periode',
      type: 'inputgroup',
      valueOf: 'bulan_periode',
      required: true,
      readOnly: true,
      noButton: true,
      inputInfo: {
        id: 'tahun-periode',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'tahun_periode'
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      update: {
        disabled: false
      }
    }
  ]

  // Layout Form TUTUP PERIODE
  inputLayoutTP = [
    {
      formWidth: 'col-5',
      label: 'Tahun',
      id: 'tahun-periode',
      type: 'input',
      valueOf: 'tahun_periode',
      required: true,
      readOnly: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Bulan',
      id: 'bulan-periode',
      type: 'input',
      valueOf: 'bulan_periode',
      required: true,
      readOnly: true,
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
    this.reqKodePerusahaan()
    this.nama_tombolPJ = 'Posting'
    this.nama_tombolTP = 'Tutup Periode'
  }

  ngAfterViewInit(): void {
    // KODE PERUSAHAAN
    this.kp_V2 = this.gbl.getKodePerusahaan()

    // ID PERIODE AKTIF
    this.pa_id = this.gbl.getIdPeriodeAktif()

    // BULAN PERIODE AKTIF
    this.pa_bulan = this.gbl.getBulanPeriodeAktif()

    // TAHUN PERIODE AKTIF
    this.pa_tahun = this.gbl.getTahunPeriodeAktif()

    if (
      this.kp_V2 !== "" ||
      this.pa_id !== "" ||
      this.pa_bulan !== "" ||
      this.pa_tahun !== ""
    ) {
      
      console.log(this.kp_V2)
      console.log(this.pa_id)
      console.log(this.pa_bulan)
      console.log(this.pa_tahun)
      this.madeRequest()
    }

  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsPA === undefined ? null : this.subsPA.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subscription = this.gbl.change.subscribe(
      value => {
        this.kp_V1 = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.kp_V1 !== "") {
          this.reqActivePeriod()
        }

        if (this.selectedTab == 1 && this.browseNeedUpdate) {
          this.refreshBrowse('', value)
        }
      }
    )
  }

  reqActivePeriod() {
    this.subsPA = this.gbl.activePeriod.subscribe(
      value => {
        this.pa_Res = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()

        if (this.pa_Res !== "") {
          this.madeRequest()
        }

        /* if (this.selectedTab == 1 && this.browseNeedUpdate) {
          this.refreshBrowse('', value)
        } */
      }
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.formValue = {
      bulan_periode: this.pa_Res.bulan_periode === undefined ? this.pa_bulan : this.pa_Res.bulan_periode,
      tahun_periode: this.pa_Res.tahun_periode === undefined ? this.pa_tahun : this.pa_Res.tahun_periode,
      id_posting: '',
      no_tran: '',
    }
    this.loading = false
    this.ref.markForCheck()
    this.tabTP()
  }

  tabTP(){
    this.loading = true
    this.formValueTP = {
      id_periode: '',
      bulan_periode: this.pa_Res.bulan_periode === undefined ? this.pa_bulan : this.pa_Res.bulan_periode,
      tahun_periode: this.pa_Res.tahun_periode === undefined ? this.pa_tahun : this.pa_Res.tahun_periode,
    }
    this.loading = false
    this.ref.markForCheck()
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
            label: 'Kode Bank',
            id: 'kode-bank',
            type: 'input',
            valueOf: '',
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'No. Rekening',
            id: 'no-rekening',
            type: 'input',
            valueOf: '',
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          {
            label: 'Atas Nama',
            id: 'atas-nama',
            type: 'input',
            valueOf: '',
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

  refreshBrowse(message, val = null) {
    this.tableLoad = true
    this.request.apiData('rekening-perusahaan', 'g-rekening-perusahaan', { kode_perusahaan: val ? val : this.kp_V1 }).subscribe(
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

  /* //Browse binding event
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
  } */

  getBackToInput() {
    this.selectedTab = 0;
    //this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        let u_id = localStorage.getItem('user_id')
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.formValue.id_posting = this.formValue.id_posting === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValue.id_posting
        let endRes = Object.assign(
          {
            user_id: u_id,
            kode_perusahaan: this.kp_V1 == undefined ? this.kp_V2 : this.kp_V1,
            id_periode: ''
          },
          this.formValue)
        this.request.apiData('posting-jurnal', this.onUpdate ? '' : 'i-posting-jurnal', endRes).subscribe(
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

  //Form submit
  onSubmitTP(inputForm: NgForm) {

    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        this.loading = true;
        this.ref.markForCheck()
        // this.formValue = this.forminput === undefined ? this.formValueTP : this.forminput.getData()
        this.formValueTP.id_periode = this.formValueTP.id_periode === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValueTP.id_periode
        let endRes = Object.assign({ kode_perusahaan: this.kp_V1 == undefined ? this.kp_V2 : this.kp_V1, id_periode: this.formValueTP.id_periode})
        this.request.apiData('periode', this.onUpdate ? '' : 'i-tutup-periode', endRes).subscribe(
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
    /* this.formValue = {
      tahun_periode: '',
    } */
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

  deleteData(val = null) {
    this.dialog.closeAll()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      let endRes = Object.assign({ kode_perusahaan: val ? val : this.kp_V1 }, this.formValue)
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
