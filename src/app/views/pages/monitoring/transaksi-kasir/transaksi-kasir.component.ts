import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { AlertdialogComponent } from '../../components/alertdialog/alertdialog.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';

const content = {
  beforeCodeTitle: 'Monitoring Transaksi Jurnal Batch'
}

@Component({
  selector: 'kt-transaksi-kasir',
  templateUrl: './transaksi-kasir.component.html',
  styleUrls: ['./transaksi-kasir.component.scss', '../monitoring.style.scss']
})
export class TransaksiKasirComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // VARIABLES
  // OTHERS
  content: any;
  dialogRef: any;
  dialogType: string = null;
  // BUTTON
  noSaveButton: boolean = true;
  noCancel: boolean = true;
  // LOADING
  loading: boolean = true;
  tableLoad: boolean = false;
  loadingDataText: string = "Loading Data Transaksi Jurnal.."
  // GLOBAL VARIABLE PERUSAHAAN
  subsPerusahaan: any;
  kode_perusahaan: any;
  // GLOBAL VARIABLE PERIODE AKTIF
  subsPeriode: any;
  periode_akses: any;

  formValue = {
    id_periode: '',
    bulan_periode: '',
    tahun_periode: '',
    kode_cabang: '',
    nama_cabang: ''
  }

  // Input Name
  formDetail = {
    // General
    nama_cabang: '',
    jenis_jurnal: '2',
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    keterangan: '',

    // Kasir
    tipe_laporan: '',
    nama_jenis_transaksi: '',
    nama_bank: '',
    no_rekening: '',
    atas_nama: '',
    rekening_perusahaan: '',
    lembar_giro: 0,
    tipe_transaksi: '',
    nama_tipe_transaksi: '',
    saldo_transaksi: 0
  }

  inputPeriodeDisplayColumns = [
    {
      label: 'Bulan Periode',
      value: 'bulan_periode'
    },
    {
      label: 'Tahun Periode',
      value: 'tahun_periode'
    }
  ]
  inputPeriodeInterface = {}
  inputPeriodeData = []
  inputPeriodeDataRules = []

  inputCabangDisplayColumns = [
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  inputCabangInterface = {}
  inputCabangData = []
  inputCabangDataRules = []

  detailData = []

  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Periode',
      id: 'periode',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'periode',
      valueOf: 'bulan_periode',
      required: false,
      readOnly: true,
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
      label: 'Cabang',
      id: 'cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama_cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      blurOption: {
        ind: 'kode_cabang',
        data: [],
        valueOf: ['kode_cabang', 'nama_cabang'],
        onFound: () => {
          this.getDataJurnal(this.forminput.getData()['id_periode'], this.forminput.getData()['kode_cabang'])
        }
      },
      update: {
        disabled: false
      }
    },
  ]

  detailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
      type: 'input',
      valueOf: 'tgl_tran',
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

  rightDetailInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'input',
      valueOf: 'nama_jenis_transaksi',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Rekening & Bank',
      id: 'rekening',
      type: 'input',
      valueOf: 'rekening_perusahaan',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Atas Nama',
      id: 'atas-nama',
      type: 'input',
      valueOf: 'atas_nama',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Lembar Giro',
      id: 'lembar-giro',
      type: 'input',
      valueOf: 'lembar_giro',
      required: true,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Transaksi',
      id: 'tipe-transaksi',
      type: 'input',
      valueOf: 'nama_tipe_transaksi',
      required: true,
      readOnly: true,
      disabled: true
    }
  ]

  // TAB MENU BROWSE 
  displayedColumnsTable = [
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    },
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
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Jenis Transaksi',
      value: 'jenis_transaksi_sub'
    },
    {
      label: 'Tipe Transaksi',
      value: 'tipe_transaksi_sub'
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
  browseInterface = {}
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
    this.gbl.need(true, true)
    this.madeRequest()
  }

  ngAfterViewInit(): void {
    // PERUSAHAAN AKTIF
    this.kode_perusahaan = this.gbl.getKodePerusahaan()

    // PERIODE AKTIF
    this.periode_akses = this.gbl.getAccessPeriod()

    if (this.kode_perusahaan !== "") {
      this.madeRequest()
    }
  }

  ngOnDestroy(): void {
    this.subsPerusahaan === undefined ? null : this.subsPerusahaan.unsubscribe()
    this.subsPeriode === undefined ? null : this.subsPeriode.unsubscribe()
  }

  madeRequest() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.inputPeriodeData = data['RESULT']
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.inputCabangData = data['RESULT']
            this.loading = false
            this.gbl.updateInputdata(data['RESULT'], 'kode_cabang', this.inputLayout)
            if (this.dialog.openDialogs || this.dialog.openDialogs.length) {
              if (this.dialogType === "kode_cabang") {
                this.dialog.closeAll()
                this.openDialog('kode_cabang')
              }
            }
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan data cabang. Mohon coba lagi nanti.', 'fail')
            this.loading = false
          }
        }
      )
    }
  }

  getDataJurnal(id_periode, kode_cabang) {
    this.tableLoad = true
    this.request.apiData('kasir', 'g-transaksi-kasir', { kode_perusahaan: this.kode_perusahaan, id_periode: id_periode }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (kode_cabang === "") {
            this.browseData = data['RESULT']
          } else {
            this.browseData = data['RESULT'].filter(x => x['kode_cabang'] === kode_cabang)
          }
          this.ref.markForCheck()
          this.tableLoad = false
        } else {
          this.ref.markForCheck()
          this.gbl.openSnackBar('Gagal mendapatkan data jurnal. Mohon coba lagi nanti.', 'fail')
          this.tableLoad = false
        }
      }
    )
  }

  getDetail() {
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let result = [], temp = JSON.parse(JSON.stringify(data['RESULT']))

          // Init Result Detail
          result = temp.map(detail => {
            const container = detail
            // Add Important Object
            container['saldo_debit'] = parseFloat(detail.nilai_debit)
            container['saldo_kredit'] = parseFloat(detail.nilai_kredit)
            // Delete Useless Object
            delete container.nilai_debit
            delete container.nilai_kredit
            return container
          })

          if (this.formDetail.tipe_transaksi === "0") {
            this.detailData = result.filter(x => x['saldo_kredit'] != 0)
          } else {
            this.detailData = result.filter(x => x['saldo_debit'] != 0)
          }
          this.formInputCheckChangesJurnal()
          this.inputDialog()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan rincian data. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  openDialog(type) {
    if (type === 'cabang') {
      if (this.forminput.getData()['bulan_periode'] === "") {
        this.gbl.openSnackBar('Pilih Periode Terlebih Dahulu.', 'info', () => {
          setTimeout(() => {
            this.openDialog('periode')
          }, 250)
        })
        return
      }
    }
    this.dialogType = JSON.parse(JSON.stringify(type))
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '50vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "periode" ? this.inputPeriodeInterface :
            type === "cabang" ? this.inputCabangInterface :
              {},
        displayedColumns:
          type === "periode" ? this.inputPeriodeDisplayColumns :
            type === "cabang" ? this.inputCabangDisplayColumns :
              [],
        tableData:
          type === "periode" ? this.inputPeriodeData :
            type === "cabang" ? this.inputCabangData :
              [],
        tableRules:
          type === "periode" ? this.inputPeriodeDataRules :
            type === "cabang" ? this.inputCabangDataRules :
              [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "periode") {
          if (this.forminput !== undefined) {
            var nama_bulan = result.bulan_periode.toString()
            nama_bulan = this.gbl.getNamaBulan(nama_bulan)
            if (this.forminput.getData()['bulan_periode'] !== nama_bulan) {
              // PERIODE
              this.forminput.updateFormValue('id_periode', result.id_periode)
              this.forminput.updateFormValue('bulan_periode', nama_bulan)
              this.forminput.updateFormValue('tahun_periode', result.tahun_periode)
              this.formValue.id_periode = result.id_periode
              this.formValue.bulan_periode = nama_bulan
              this.formValue.tahun_periode = result.tahun_periode
              this.getDataJurnal(result.id_periode, this.formValue.kode_cabang)
            }
          }
        } else if (type === "cabang") {
          if (this.forminput !== undefined) {
            if (this.forminput.getData()['kode_cabang'] !== result.kode_cabang) {
              this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
              this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
              this.formValue.kode_cabang = result.kode_cabang
              this.formValue.nama_cabang = result.nama_cabang
              this.getDataJurnal(this.formValue.id_periode, result.kode_cabang)
            }
          }
        }
      }
      this.ref.markForCheck()
      this.dialogRef = undefined
      this.dialogType = null

    }
    )
  }

  inputDialog() {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '10px' },
      data: {
        width: '85vw',
        title: this.formDetail.nama_cabang,
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        rightLayout: true,
        rightInputLayout: this.rightDetailInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        jurnalData: this.detailData,
        noEditJurnal: true,
        noButtonSave: true,
        resetForm: () => null
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
        this.setDetailLayout('reset-rightSide')
      },
      error => null,
    );
  }

  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      // General
      nama_cabang: x['nama_cabang'],
      jenis_jurnal: '2',
      id_tran: x['id_tran_jurnal'],
      no_tran: x['no_tran'],
      tgl_tran: x['tgl_tran'],
      keterangan: x['keterangan'],

      // Kasir
      tipe_laporan: x['tipe_laporan'],
      nama_jenis_transaksi: x['nama_jenis_transaksi'],
      nama_bank: x['nama_bank'],
      no_rekening: x['no_rekening'],
      atas_nama: x['atas_nama'],
      rekening_perusahaan: '',
      lembar_giro: parseFloat(x['lembar_giro']),
      tipe_transaksi: x['tipe_transaksi'],
      nama_tipe_transaksi: x['tipe_transaksi'] === '0' ? 'Masuk' : x['tipe_transaksi'] === '1' ? 'Keluar' : '',
      saldo_transaksi: parseFloat(x['saldo_transaksi'])
    }
    this.formDetail.rekening_perusahaan = this.formDetail.no_rekening + '(' + this.formDetail.nama_bank + ')'
    this.viewDetailLayout()
  }

  viewDetailLayout() {
    if (this.formDetail.jenis_jurnal === '2') {
      if (this.formDetail.tipe_laporan === 'b') {
        this.setDetailLayout('bank-rightSide')
      } else if (this.formDetail.tipe_laporan === 'g') {
        this.setDetailLayout('giro-rightSide')
      } else {
        this.setDetailLayout('others')
      }
    }
    this.getDetail()
  }

  setDetailLayout(type) {
    if (type === 'reset-rightSide') {
      this.rightDetailInputLayout = [
        {
          formWidth: 'col-5',
          label: 'Jenis Transaksi',
          id: 'jenis-transaksi',
          type: 'input',
          valueOf: 'nama_jenis_transaksi',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Rekening & Bank',
          id: 'rekening',
          type: 'input',
          valueOf: 'rekening_perusahaan',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Atas Nama',
          id: 'atas-nama',
          type: 'input',
          valueOf: 'atas_nama',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Lembar Giro',
          id: 'lembar-giro',
          type: 'input',
          valueOf: 'lembar_giro',
          required: true,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Tipe Transaksi',
          id: 'tipe-transaksi',
          type: 'input',
          valueOf: 'nama_tipe_transaksi',
          required: true,
          readOnly: true,
          disabled: true
        }
      ]
    } else if (type === 'bank-rightSide') {
      this.rightDetailInputLayout.splice(3, 1)
    } else if (type === 'giro-rightSide') {
      this.rightDetailInputLayout.splice(1, 2)
    } else if (type === 'others') {
      this.rightDetailInputLayout.splice(1, 3)
    }
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}
