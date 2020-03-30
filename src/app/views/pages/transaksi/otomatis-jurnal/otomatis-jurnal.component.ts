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
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Otomatis Jurnal'
}

@Component({
  selector: 'kt-otomatis-jurnal',
  templateUrl: './otomatis-jurnal.component.html',
  styleUrls: ['./otomatis-jurnal.component.scss', '../transaksi.style.scss']
})
export class OtomatisJurnalComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('rt', { static: false }) rt;
  @ViewChild('ht', { static: false }) ht;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Variables
  loading: boolean = true;
  detailJurnalLoad : boolean = false;
  tableLoadHT: boolean = false;
  tableLoadRT: boolean = false;
  loadingDataTextHT: string = "Loading Data Hasil Tarik Data.."
  loadingDataTextRT: string = "Loading Data Riwayat Tarik Data.."
  content: any;
  nama_tombol: any;
  onSub: boolean = false;
  onButton: boolean = true;
  detailLoad: boolean = false;
  enableDetail: boolean = false;
  enableCancel: boolean = false;
  noCancel: boolean = true;
  editable: boolean = false;
  selectedTab: number = 0;
  loadTab: boolean = false;
  onUpdate: boolean = false;
  enableDelete: boolean = false;
  browseNeedUpdate: boolean = true;
  search: string;

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // GLOBAL VARIABLE PERIODE AKTIF
  subsPA: any;
  periode_aktif: any;
  idPeriodeAktif: any;
  tahunPeriodeAktif: any;
  bulanPeriodeAktif: any;
  nama_bulan_aktif: any;

  // GLOBAL VARIABLE AKSES PERIODE
  //

  //CDialog
  c_buttonLayout = [
    {
      btnLabel: 'Simpan',
      btnClass: 'btn btn-primary',
      btnClick: (ht) => {
        this.onSubmit(ht)
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
      content: 'Yakin akan simpan data ?',
      style: {
        'color': 'red',
        'font-size': '16px',
        'font-weight': 'bold'
      }
    }
  ]

  c_inputLayout = []

  // Input Name
  formDetail = {
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    nama_cabang: '',
    nama_divisi: '',
    nama_departemen: '',
    keterangan: '',
  }

  detailData = []

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-transaksi',
      type: 'input',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'nama-cabang',
      type: 'input',
      valueOf: 'nama_cabang',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Divisi',
      id: 'nama-divisi',
      type: 'input',
      valueOf: 'nama_divisi',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Departemen',
      id: 'nama-departemen',
      type: 'input',
      valueOf: 'nama_departemen',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

  // Data Hasil Tarik
  displayedColumnsTableHT = [
    {
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Transaksi',
      value: 'tgl_tran',
      date: true
    },
    {
      label: 'Cabang',
      value: 'nama_cabang'
    },
    {
      label: 'Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status',
      value: 'batal_status_sub'
    },
    {
      label: 'Diinput oleh',
      value: 'nama_input_by',
    },
    {
      label: 'Diinput tanggal',
      value: 'input_dt',
      date: true
    },
    {
      label: 'Diupdate oleh',
      value: 'nama_update_by'
    },
    {
      label: 'Diupdate tanggal',
      value: 'update_dt',
      date: true
    }
  ];
  browseInterfaceHT = {}
  browseDataHT = []
  browseDataRulesHT = []

  // Data Riwayat Tarik
  displayedColumnsTableRT = [
    {
      label: 'Ditarik Oleh',
      value: 'input_by'
    },
    {
      label: 'Ditarik Tanggal',
      value: 'input_dt',
      date: true
    }
  ];
  browseInterfaceRT = {
    //STATIC
    input_by: 'string',
    input_dt: 'string'
  }
  browseDataRT = []
  browseDataRulesRT = []

  // Input Name
  formValue = {
    tgl_tarik: '',
    bulan_periode: '',
    tahun_periode: ''
  }

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-9',
      label: 'Tanggal Tarik Terakhir',
      id: 'tgl-tarik',
      type: 'input',
      valueOf: 'tgl_tarik',
      required: false,
      readOnly: true,
      disabled: true,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-9',
      label: 'Periode Aktif',
      id: 'bulan-periode',
      type: 'inputgroup',
      valueOf: 'bulan_periode',
      required: true,
      readOnly: true,
      noButton: true,
      disabled: true,
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
    this.nama_tombol = 'Tarik Data'
    this.gbl.need(true, false)
    this.reqActivePeriod()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    if (this.kode_perusahaan !== "") {
      this.reqActivePeriod()
    }
  }

  ngOnDestroy(): void {
    this.subscription === undefined ? null : this.subscription.unsubscribe()
    this.subsPA === undefined ? null : this.subsPA.unsubscribe()
  }

  reqActivePeriod() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.periode_aktif = data['RESULT'].filter(x => x.aktif === '1')[0] || {}
            this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'], '')
            this.idPeriodeAktif = this.gbl.getIdPeriodeAktif()
            this.tahunPeriodeAktif = this.gbl.getTahunPeriodeAktif()
            this.bulanPeriodeAktif = this.gbl.getBulanPeriodeAktif()
            this.nama_bulan_aktif = this.gbl.getNamaBulan(this.bulanPeriodeAktif)
            this.periode_aktif = this.gbl.getActive()
            this.madeRequest()
            this.ref.markForCheck()
          } else {
            this.ref.markForCheck()
            this.openSnackBar('Data Periode tidak ditemukan.')
          }
        }
      )
    }
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    this.formValue = {
      tgl_tarik: '2020-03-26',
      bulan_periode: this.nama_bulan_aktif,
      tahun_periode: this.tahunPeriodeAktif
    }
    this.loading = false
    this.sendRequestRiwayat()
  }

  sendRequestRiwayat() {
    this.tableLoadRT = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('jurnal', 'g-jurnal', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataRT = data['RESULT']
            this.tableLoadRT = false
            this.ref.markForCheck()
          } else {
            this.tableLoadRT = false
            this.ref.markForCheck()
            this.openSnackBar('Data Riwayat tidak ditemukan.')
          }
        }
      )
    }
  }

  sendRequestHasilTarik() {
    this.gbl.bottomPage()
    this.tableLoadHT = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('jurnal', 'g-jurnal', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataHT = data['RESULT']
            this.tableLoadHT = false
            this.ref.markForCheck()
          } else {
            this.tableLoadHT = false
            this.ref.markForCheck()
            this.openSnackBar('Data hasil tarik tidak ditemukan.')
          }
        }
      )
    }
  }

  openCDialog() { // Confirmation Dialog
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '580px' },
      data: {
        buttonLayout: this.c_buttonLayout,
        labelLayout: this.c_labelLayout,
        inputLayout: this.c_inputLayout
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

  refreshTab(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      id_tran: x['id_tran'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      nama_cabang: x['nama_cabang'],
      nama_divisi: x['nama_divisi'],
      nama_departemen: x['nama_departemen'],
      keterangan: x['keterangan'],
    }
    this.getDetail()
  }

  getDetail() {
    this.detailJurnalLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              keterangan: resp[i]['keterangan'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.openDialog()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailJurnalLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  openDialog() {
    this.gbl.topPage()
    this.ref.markForCheck()
    this.formInputCheckChangesJurnal()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '50px' },
      data: {
        width: '70vw',
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        detailLoad: this.detailData === [] ? this.detailJurnalLoad : false ,
        jurnalData: [],
        jurnalDataAkun: [],
        noButtonSave: true,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        // onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
      },
      error => null,
    );
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.dialog.closeAll()
    this.gbl.topPage()
    let u_id = localStorage.getItem('user_id')
    this.loading = true;
    this.ref.markForCheck()
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    /* this.formValue.id_posting = this.formValue.id_posting === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
      length: 8,
      numeric: true,
      letters: false,
      special: false
    }))}` : this.formValue.id_posting */
    let endRes = Object.assign(
      {
        user_id: u_id,
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.periode_aktif.id_periode
      },
      this.formValue)
    this.request.apiData('posting-jurnal', this.onUpdate ? '' : 'i-posting-jurnal', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.loading = false
          this.refreshTab(this.onUpdate ? "" : "BERHASIL DITAMBAH")
          this.resetForm()
          this.browseNeedUpdate = true
          this.ref.markForCheck()
          this.sendRequestRiwayat()
        } else {
          this.loading = false;
          this.ref.markForCheck()
          this.openSnackBar('DATA JURNAL GAGAL DI POSTING', 'fail')
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
    // this.formValue = {
    //   tgl_tarik: '2020-03-26',
    //   bulan_periode: this.nama_bulan_aktif,
    //   tahun_periode: this.tahunPeriodeAktif
    // }
    setTimeout(() => {
      this.tableLoadHT = true
      this.browseDataHT = []
      this.ref.markForCheck()
    }, 500)
    this.ref.markForCheck()
    setTimeout(() => {
      this.tableLoadHT = false
      this.ref.markForCheck()
    }, 500)
    // this.formInputCheckChanges()
  }

  onCancel() {
    this.resetForm()
    this.ht == undefined ? null : this.ht.reset()
    this.rt == undefined ? null : this.rt.reset()
  }

  openSnackBar(message, type?: any, onCloseFunc?: any) {
    const dialogRef = this.dialog.open(AlertdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        type: type === undefined || type == null ? '' : type,
        message: message === undefined || message == null ? '' : message.charAt(0).toUpperCase() + message.substr(1).toLowerCase(),
        onCloseFunc: onCloseFunc === undefined || onCloseFunc == null ? null : () => onCloseFunc()
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
    }, 10)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}
