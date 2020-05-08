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
  beforeCodeTitle: 'Jurnal Transaksi'
}

@Component({
  selector: 'kt-jurnal-transaksi',
  templateUrl: './jurnal-transaksi.component.html',
  styleUrls: ['./jurnal-transaksi.component.scss', '../transaksi.style.scss']
})
export class JurnalTransaksiComponent implements OnInit, AfterViewInit {

  // View child to call function
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  jenis_transaksi = [];
  bank = [];
  tipe_transaksi = [
    {
      label: 'Masuk',
      value: '0'
    },
    {
      label: 'Keluar',
      value: '1'
    }
  ];

  // Variables
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  enableCancel: boolean = true;
  enableEdit: boolean = false;
  enableDelete: boolean = false;
  disableForm: boolean = false;
  disableSubmit: boolean = true;
  browseNeedUpdate: boolean = true;
  subPerusahaan: any;
  kode_perusahaan: any;
  daftar_periode_kasir: any = [];
  periode_jurnal: any = {
    id_periode: '',
    tahun_periode: '',
    bulan_periode: ''
  };
  periode_kasir: any = {
    id_periode: '',
    tgl_periode: ''
  };
  requestMade: boolean = false;
  batal_alasan: any = "";
  id_kasir: any = "";
  dayLimit: any = 0;
  dialogRef: any;
  dialogType: string = null;

  // Input Name
  formValue = {
    id_tran: '',
    id_tran_jt: '',
    no_jurnal: '',
    no_tran: '',
    tgl_tran: '',
    kode_cabang: '',
    nama_cabang: '',
    id_jenis_transaksi: '',
    kode_jenis_transaksi: '',
    nilai_jenis_transaksi: '',
    tipe_transaksi: '0',
    saldo_transaksi: 0,
    keterangan: ''
  }

  detailData = [
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0
    },
    {
      id_akun: '',
      kode_akun: '',
      nama_akun: '',
      kode_divisi: '',
      nama_divisi: '',
      kode_departemen: '',
      nama_departemen: '',
      keterangan_akun: '',
      keterangan: '',
      saldo_debit: 0,
      saldo_kredit: 0
    }
  ]

  //Confirmation Variable
  c_buttonLayout = [
    {
      btnLabel: 'BATALKAN TRANSAKSI',
      btnClass: 'btn btn-primary',
      btnClick: () => {
        this.cancelData()
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
      content: 'Yakin akan membatalkan transaksi?',
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
      label: 'No. Jurnal',
      value: 'no_tran'
    },
    {
      label: 'Tgl. Jurnal',
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
  browseInterface = {
    kode_bank: 'string',
    nama_bank: 'string',
    keterangan: 'string',
    //STATIC
    input_by: 'string',
    input_dt: 'string',
    update_by: 'string',
    update_dt: 'string'
  }
  browseData = []
  browseDataRules = [
    {
      target: 'batal_status',
      replacement: {
        't': 'Batal',
        'f': ''
      },
      redefined: 'batal_status_sub'
    }
  ]
  inputDepartemenDisplayColumns = [
    {
      label: 'Kode Departemen',
      value: 'kode_departemen'
    },
    {
      label: 'Nama Departemen',
      value: 'nama_departemen'
    },
    {
      label: 'Nama Induk Departemen',
      value: 'nama_induk_departemen'
    }
  ]
  inputDepartemenInterface = {
    kode_departemen: 'string',
    nama_departemen: 'string',
    induk_departemen: 'string',
    nama_induk_departemen: 'string'
  }
  inputDepartemenData = []
  inputDepartemenDataRules = []
  inputDivisiDisplayColumns = [
    {
      label: 'Kode Divisi',
      value: 'kode_divisi'
    },
    {
      label: 'Nama Divisi',
      value: 'nama_divisi'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    }
  ]
  inputDivisiInterface = {
    kode_divisi: 'string',
    nama_divisi: 'string',
    keterangan: 'string'
  }
  inputDivisiData = []
  inputDivisiDataRules = []
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
  inputCabangInterface = {
    kode_cabang: 'string',
    nama_cabang: 'string'
  }
  inputCabangData = []
  inputCabangDataRules = []
  inputAkunData = []
  inputJenisTransaksiData = []
  inputRekeningPerusahaanData = []

  // Layout Form
  inputLayout = [
    {
      formWidth: 'col-5',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      blurOption: {
        ind: 'kode_cabang',
        data: [],
        valueOf: ['kode_cabang', 'nama_cabang'],
        onFound: () => null
      },
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Jurnal',
      id: 'nomor-jurnal',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Transaksi',
      id: 'nomor-transaksi',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: false,
      disabled: true,
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tgl. Transaksi',
      id: 'tgl-transaksi',
      type: 'datepicker',
      valueOf: 'tgl_tran',
      required: true,
      readOnly: false,
      update: {
        disabled: false
      },
      timepick: false,
      enableMin: true,
      enableMax: true,
      minDate: () => {
        let dt = new Date(Date.now())
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: dt.getDate()
        }
      },
      maxDate: () => {
        let dt = new Date(Date.now())
        return {
          year: dt.getFullYear(),
          month: dt.getMonth() + 1,
          day: dt.getDate()
        }
      },
      toolTip: 'Tgl. jurnal akan sama dengan tgl. transaksi'
    },
    {
      formWidth: 'col-5',
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'combobox',
      options: this.jenis_transaksi,
      valueOf: 'id_jenis_transaksi',
      onSelectFunc: (v) => {
        let d = this.inputJenisTransaksiData.filter(x => x['id_jenis_transaksi'] === v)
        if (d.length > 0) {
          this.forminput.updateFormValue('kode_jenis_transaksi', d[0]['kode_jenis_transaksi'])
        }
      },
      required: true,
      readOnly: false,
      disabled: false
    },
    {
      formWidth: 'col-5',
      label: 'Rekening Perusahaan',
      id: 'rekening-perusahaan',
      type: 'combobox',
      options: this.bank,
      valueOf: 'nilai_jenis_transaksi',
      required: true,
      readOnly: false,
      disabled: false,
      hiddenOn: {
        valueOf: 'kode_jenis_transaksi',
        matchValue: ["KAS", "PETTYCASH", ""]
      }
    },
    {
      formWidth: 'col-5',
      label: 'Tipe Transaksi',
      id: 'tipe-transaksi',
      type: 'combobox',
      options: this.tipe_transaksi,
      valueOf: 'tipe_transaksi',
      required: true,
      readOnly: false,
      disabled: false
    },
    {
      formWidth: 'col-5',
      label: 'Nilai Transaksi',
      id: 'nilai-transaksi',
      type: 'input',
      valueOf: 'saldo_transaksi',
      currency: true,
      required: true,
      readOnly: false,
      leftAddon: 'Rp.',
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
    this.gbl.need(true, false)
    this.sendRequestKasir()
  }

  ngAfterViewInit(): void {
    this.kode_perusahaan = this.gbl.getKodePerusahaan()
    if (this.kode_perusahaan !== "") {
      this.sendRequestKasir()
    }
  }

  ngOnDestroy(): void {
    this.subPerusahaan === undefined ? null : this.subPerusahaan.unsubscribe()
  }

  reqKodePerusahaan() {
    this.subPerusahaan = this.gbl.change.subscribe(
      value => {
        this.kode_perusahaan = value
        this.resetForm()
        this.browseData = []
        this.browseNeedUpdate = true
        this.ref.markForCheck()
        this.madeRequest()

        if (this.selectedTab == 1 && this.browseNeedUpdate) {
          this.refreshBrowse('')
        }
      }
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

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    let t_tran = new Date(x['tgl_tran'])
    // this.formValue = {
    //   id_tran: x['id_tran'],
    //   no_tran: x['no_tran'],
    //   tgl_tran: JSON.stringify(t_tran.getTime()),
    //   kode_cabang: x['kode_cabang'],
    //   nama_cabang: x['nama_cabang'],
    //   keterangan: x['keterangan']
    // }
    this.onUpdate = true;
    this.enableCancel = x['boleh_batal'] === 'Y' ? true : false
    this.enableEdit = x['boleh_edit'] === 'Y' ? true : false
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
    // this.sendRequestDepartemen(this.formValue.kode_divisi)
    this.getDetail()
    this.formInputCheckChanges()
  }

  //Form submit
  onSubmit(inputForm: NgForm) {
    this.gbl.topPage()
    if (this.forminput !== undefined) {
      if (inputForm.valid && this.validateSubmit()) {
        this.loading = true;
        this.ref.markForCheck()
        this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
        this.formValue.id_tran = this.formValue.id_tran === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValue.id_tran
        this.detailData = this.formValue['detail']['data']
        this.formValue['detail'] = this.detailData
        let tgl = new Date(parseInt(this.formValue['tgl_tran'])), idp = ""
        for (var i = 0; i < this.daftar_periode_kasir.length; i++) {
          let dpk = new Date(this.daftar_periode_kasir[i]['tgl_periode'])
          if (tgl.getTime() == (dpk.getTime() + 25200000)) {
            idp = this.daftar_periode_kasir[i]['id_periode']
            break
          }
        }
        let endRes = Object.assign({ kode_perusahaan: this.kode_perusahaan, id_periode_kasir: idp, id_periode_jurnal: this.periode_jurnal['id_periode'] }, this.formValue)
        this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal-transaksi' : 'i-jurnal-transaksi', endRes).subscribe(
          data => {
            if (data['STATUS'] === 'Y') {
              this.resetForm()
              this.browseNeedUpdate = true
              this.ref.markForCheck()
              this.refreshBrowse(this.onUpdate ? "BERHASIL DIUPDATE" : "BERHASIL DITAMBAH")
            } else {
              this.loading = false;
              this.ref.markForCheck()
              this.openSnackBar(data['RESULT'], 'fail')
            }
          },
          error => {
            this.loading = false;
            this.ref.markForCheck()
            this.openSnackBar('GAGAL MELAKUKAN PROSES.', 'fail')
          }
        )
      } else {
        if (this.forminput.getData().kode_cabang === '') {
          this.openSnackBar('Cabang tidak valid.', 'info')
        } else if (this.forminput.getData().kode_divisi === '') {
          this.openSnackBar('Divisi tidak valid.', 'info')
        } else if (this.forminput.getData().kode_departemen === '') {
          this.openSnackBar('Departemen tidak valid.', 'info')
        } else {
          if (this.onUpdate && !this.enableEdit) {
            this.openSnackBar('Tidak dapat diedit lagi.', 'info')
          } else {
            this.openSnackBar('Ada akun yang tidak valid atau saldo debit dan kredit tidak seimbang.', 'info')
          }
        }
      }
    }
  }

  validateSubmit() {
    let valid = true

    let data = this.forminput === undefined ? null : this.forminput.getData()

    if (data != null) {
      if (data['detail'] !== undefined || data['detail'] != null) {
        if (!data['detail']['valid']) {
          valid = false
        }
      }

      for (var i = 0; i < data['detail']['data'].length; i++) {
        if (data['detail']['data'][i]['id_akun'] === '') {
          valid = false
          break;
        }
      }

      if (data['nama_departemen'] === '') valid = false
      if (data['nama_divisi'] === '') valid = false
    }

    if (this.onUpdate) {
      if (!this.enableEdit) {
        valid = false
      }
    }

    return valid
  }

  //Reset Value
  resetForm() {
    this.formValue = {
      id_tran: '',
      id_tran_jt: '',
      no_jurnal: '',
      no_tran: '',
      tgl_tran: '',
      kode_cabang: '',
      nama_cabang: '',
      id_jenis_transaksi: '',
      kode_jenis_transaksi: '',
      nilai_jenis_transaksi: '',
      tipe_transaksi: '0',
      saldo_transaksi: 0,
      keterangan: ''
    }
    this.detailData = [
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan: '',
        saldo_debit: 0,
        saldo_kredit: 0
      },
      {
        id_akun: '',
        kode_akun: '',
        nama_akun: '',
        keterangan_akun: '',
        kode_divisi: '',
        nama_divisi: '',
        kode_departemen: '',
        nama_departemen: '',
        keterangan: '',
        saldo_debit: 0,
        saldo_kredit: 0
      }
    ]
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
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

  cancelData(val = null) {
    this.gbl.topPage()
    if (this.onUpdate) {
      this.loading = true;
      this.ref.markForCheck()
      let endRes = {
        kode_perusahaan: val ? val : this.kode_perusahaan,
        id_tran: this.formValue.id_tran,
        batal_alasan: this.batal_alasan
      }
      this.dialog.closeAll()
      this.request.apiData('jurnal', 'c-jurnal', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.onCancel()
            this.ref.markForCheck()
            this.browseNeedUpdate = true
            this.refreshBrowse('BERHASIL DIBATALKAN')
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
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '90vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      data: {
        type: type,
        tableInterface:
          type === "kode_cabang" ? this.inputCabangInterface :
            {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            [],
        formValue: this.formValue
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
            let lp = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === result.kode_cabang && x['aktif'] === '1')[0]
            let dt = new Date(lp['tgl_periode'])
            if (JSON.stringify(dt.getFullYear()) === this.periode_jurnal['tahun_periode'] && JSON.stringify(dt.getMonth() + 1) === this.periode_jurnal['bulan_periode']) {
              this.periode_kasir = {
                id_periode: lp['id_periode'],
                tgl_periode: lp['tgl_periode']
              }
              this.inputLayout.splice(3, 1, {
                formWidth: 'col-5',
                label: 'Tgl. Transaksi',
                id: 'tgl-transaksi',
                type: 'datepicker',
                valueOf: 'tgl_tran',
                required: true,
                readOnly: false,
                update: {
                  disabled: false
                },
                timepick: false,
                enableMin: true,
                enableMax: true,
                minDate: () => {
                  let dt = new Date(this.periode_kasir['tgl_periode'])
                  return {
                    year: dt.getFullYear(),
                    month: dt.getMonth() + 1,
                    day: dt.getDate()
                  }
                },
                maxDate: () => {
                  let dt = new Date(this.periode_kasir['tgl_periode'])
                  return {
                    year: dt.getFullYear(),
                    month: dt.getMonth() + 1,
                    day: dt.getDate() + this.dayLimit
                  }
                },
                toolTip: 'Tgl. jurnal akan sama dengan tgl. transaksi'
              })
              this.disableSubmit = false
              this.ref.markForCheck()
            } else {
              this.disableSubmit = true
              this.ref.markForCheck()
              this.openSnackBar('Tanggal periode jurnal dan transaksi tidak sesuai.', 'info')
            }
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  openCDialog() { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: 'auto',
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
            label: 'Nomor Transaksi',
            id: 'nomor-transaksi',
            type: 'input',
            valueOf: this.formValue.no_tran,
            changeOn: null,
            required: false,
            readOnly: true,
            disabled: true,
          },
          // {
          //   label: 'Tanggal Transaksi',
          //   id: 'tanggal-transaksi',
          //   type: 'input',
          //   valueOf: this.formValue.tgl_tran,
          //   changeOn: null,
          //   required: false,
          //   readOnly: true,
          //   disabled: true,
          // },
          {
            label: 'Alasan Batal',
            id: 'alasan-batal',
            type: 'input',
            valueOf: null,
            changeOn: (t) => this.batal_alasan = t.target.value,
            required: true,
            readOnly: false,
            disabled: false,
          }
        ]
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => {
        this.batal_alasan = ""
      },
      error => null
    )
  }

  // Request Data API (to : L.O.V or Table)
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && !this.requestMade) {
      this.requestMade = true
      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_cabang')
          } else {
            this.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('lookup', 'g-lookup', { kode_perusahaan: this.kode_perusahaan, kode_group_lookup: 'BATAS-HARI-TRANSAKSI', kode_lookup: 'BATAS-HARI-TRANSAKSI-KASIR' }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let l = parseInt(data['RESULT'][0]['nilai1'])
            this.dayLimit = l
          } else {
            this.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
            return
          }
        }
      )

      this.request.apiData('divisi', 'g-divisi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputDivisiData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_divisi')
            this.sendRequestAkun()
          } else {
            this.openSnackBar('Gagal mendapatkan daftar divisi. Mohon coba lagi nanti.', 'fail')
            this.loading = false
            this.ref.markForCheck()
          }
        }
      )
    }
  }

  sendRequestKasir() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('kasir', 'g-user-kasir').subscribe(
        data => {
          console.log(data)
        }
      )
    }
  }

  sendRequestPeriode() {
    if (this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") {
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        dp => {
          if (dp['STATUS'] === 'Y') {
            let pj_aktif = dp['RESULT'].filter(x => x['aktif'] === '1')[0]
            this.periode_jurnal = {
              id_periode: pj_aktif['id_periode'],
              tahun_periode: pj_aktif['tahun_periode'],
              bulan_periode: pj_aktif['bulan_periode']
            }
            this.request.apiData('periode', 'g-periode-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
              data => {
                if (data['STATUS'] === 'Y') {
                  this.daftar_periode_kasir = data['RESULT']
                  this.madeRequest()
                  this.ref.markForCheck()
                } else {
                  this.loading = false
                  this.ref.markForCheck()
                  this.openSnackBar('Data Periode tidak ditemukan.')
                }
              }
            )
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal mendapatkan periode jurnal atau periode belum tersedia.', 'fail')
          }
        }
      )
    }
  }

  sendRequestAkun() {
    this.request.apiData('akun', 'g-akun', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.inputAkunData = data['RESULT']
          this.sendRequestJenisTransaksi()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar departemen. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  sendRequestJenisTransaksi() {
    this.request.apiData('jenis-transaksi', 'g-jenis-transaksi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              label: data['RESULT'][i]['kode_jenis_transaksi'] + " - " + data['RESULT'][i]['nama_jenis_transaksi'],
              value: data['RESULT'][i]['id_jenis_transaksi']
            }
            res.push(t)
          }
          this.jenis_transaksi = res
          this.inputJenisTransaksiData = data['RESULT']
          this.inputLayout.splice(4, 1, {
            formWidth: 'col-5',
            label: 'Jenis Transaksi',
            id: 'jenis-transaksi',
            type: 'combobox',
            options: this.jenis_transaksi,
            valueOf: 'id_jenis_transaksi',
            onSelectFunc: (v) => {
              let d = this.inputJenisTransaksiData.filter(x => x['id_jenis_transaksi'] === v)
              if (d.length > 0) {
                this.forminput.updateFormValue('kode_jenis_transaksi', d[0]['kode_jenis_transaksi'])
              }
            },
            required: true,
            readOnly: false,
            disabled: false
          })
          this.sendRequestRekeningPerusahaan()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar jenis transaksi. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  sendRequestRekeningPerusahaan() {
    this.request.apiData('rekening-perusahaan', 'g-rekening-perusahaan', { kode_perusahaan: this.kode_perusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = []
          for (var i = 0; i < data['RESULT'].length; i++) {
            let t = {
              label: data['RESULT'][i]['no_rekening'] + " - " + data['RESULT'][i]['atas_nama'],
              value: data['RESULT'][i]['no_rekening']
            }
            res.push(t)
          }
          this.bank = res
          this.inputRekeningPerusahaanData = data['RESULT']
          this.inputLayout.splice(5, 1, {
            formWidth: 'col-5',
            label: 'Rekening Perusahaan',
            id: 'rekening-perusahaan',
            type: 'combobox',
            options: this.bank,
            valueOf: 'nilai_jenis_transaksi',
            required: true,
            readOnly: false,
            disabled: false,
            hiddenOn: {
              valueOf: 'kode_jenis_transaksi',
              matchValue: ["KAS", "PETTYCASH", ""]
            }
          })
          this.loading = false
          this.ref.markForCheck()
        } else {
          this.openSnackBar('Gagal mendapatkan daftar rekening perusahaan. Mohon coba lagi nanti.', 'fail')
          this.loading = false
          this.ref.markForCheck()
        }
      }
    )
  }

  getDetail() {
    this.detailLoad = true
    this.ref.markForCheck()
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kode_perusahaan, id_tran: this.formValue.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let res = [], resp = JSON.parse(JSON.stringify(data['RESULT']))
          for (var i = 0; i < resp.length; i++) {
            let t = {
              id_akun: resp[i]['id_akun'],
              kode_akun: resp[i]['kode_akun'],
              nama_akun: resp[i]['nama_akun'],
              keterangan_akun: resp[i]['keterangan_akun'],
              kode_divisi: resp[i]['kode_divisi'],
              nama_divisi: resp[i]['nama_divisi'],
              kode_departemen: resp[i]['kode_departemen'],
              nama_departemen: resp[i]['nama_departemen'],
              keterangan: resp[i]['keterangan'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.detailLoad = false
          this.ref.markForCheck()
          this.formInputCheckChangesJurnal()
        } else {
          this.openSnackBar('Gagal mendapatkan perincian transaksi. Mohon coba lagi nanti.', 'fail')
          this.detailLoad = false
          this.ref.markForCheck()
        }
      }
    )
  }

  refreshBrowse(message) {
    this.tableLoad = true
    this.request.apiData('jurnal', 'g-jurnal-transaksi', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_kasir['id_periode'] }).subscribe(
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
        } else {
          this.browseData = []
          this.loading = false
          this.tableLoad = false
          this.browseNeedUpdate = true
          this.ref.markForCheck()
        }
      }
    )
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
    }, 1)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

  updateInputdata(d, vOf) {
    let t = JSON.parse(JSON.stringify(d))
    for (var i = 0; i < this.inputLayout.length; i++) {
      if (this.inputLayout[i]['type'] === 'inputgroup' && this.inputLayout[i]['browseType'] === vOf) {
        this.inputLayout[i]['blurOption']['data'] = t
        break
      }
    }
  }

  //Date Functions
  getDateNow() {
    let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date(d).getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }
}
