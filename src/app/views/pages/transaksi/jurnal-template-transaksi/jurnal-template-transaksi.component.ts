import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog } from '@angular/material';
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
import { Router } from '@angular/router';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { resetFakeAsyncZone } from '@angular/core/testing';

const content = {
  beforeCodeTitle: 'Jurnal Template Transaksi'
}

@Component({
  selector: 'kt-jurnal-template-transaksi',
  templateUrl: './jurnal-template-transaksi.component.html',
  styleUrls: ['./jurnal-template-transaksi.component.scss', '../transaksi.style.scss']
})
export class JurnalTemplateTransaksiComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
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

  // VARIABLES
  keyReportFormatExcel: any;
  loading: boolean = true;
  content: any;
  detailLoad: boolean = false;
  enableDetail: boolean = true;
  selectedTab: number = 0;
  tableLoad: boolean = false;
  onUpdate: boolean = false;
  namaTombolPrintDoc: any;
  namaTombolPrintDoc2: any;
  onSubPrintDoc: boolean = true;
  onSubPrintDoc2: boolean = true;
  enableCancel: boolean = true;
  enableEdit: boolean = false;
  enableDelete: boolean = false;
  disableForm: boolean = false;
  disableSubmit: boolean = true;
  disablePrintButton: boolean = true;
  disablePrintButton2: boolean = true;
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
  total_debit: any = 0;
  dialogRef: any;
  dialogType: string = null;

  id_periode = "";
  format_cetak = [
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    },
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    }
  ]

  // REPORT
  reportObj = {
    REPORT_COMPANY: "",
    REPORT_CODE: "DOK-DELIVERY-ORDER",
    REPORT_NAME: "Delivery Order",
    REPORT_FORMAT_CODE: "pdf",
    JASPER_FILE: "rptDokDeliveryOrder.jasper",
    REPORT_PARAMETERS: {
    },
    FIELD_NAME: [
      "noTran",
      "tglTran",
      "kodePengirim",
      "namaPengirim",
      "alamatPengirim",
      "kotaPengirim",
      "teleponPengirim",
      "kodePenerima",
      "namaPenerima",
      "alamatPenerima",
      "kotaPenerima",
      "teleponPenerima",
      "noResi",
      "namaBarang",
      "jumlahBarang"
    ],
    FIELD_TYPE: [
      "string",
      "date",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "string",
      "bigdecimal"
    ],
    FIELD_DATA: []
  }

  // INFO PERUSAHAAN
  info_company = {
    alamat: '',
    kota: '',
    telepon: ''
  }

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
    keterangan: '',
    tipe_laporan: '',
    kode_template: '',
    nama_template: '',
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
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      bobot_debit: 0,
      bobot_kredit: 0,
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
      keterangan_1: '',
      keterangan_2: '',
      saldo_debit: 0,
      saldo_kredit: 0,
      bobot_debit: 0,
      bobot_kredit: 0,
    }
  ]

  formDetail = {
    format_cetak: 'pdf'
  }

  reportDetail = [];

  detailInputLayout = [
    {

      formWidth: 'col-5',
      label: 'Format Cetak',
      id: 'format-cetak',
      type: 'combobox',
      options: this.format_cetak,
      valueOf: 'format_cetak',
      required: true,
      readOnly: false,
      disabled: false,
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
      label: 'No. Transaksi',
      value: 'no_tran'
    },
    {
      label: 'No. Jurnal',
      value: 'no_jurnal'
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
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Tipe Transaksi',
      value: 'tipe_transaksi_sub'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
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
    },
    {
      target: 'tipe_transaksi',
      replacement: {
        '0': 'Masuk',
        '1': 'Keluar'
      },
      redefined: 'tipe_transaksi_sub'
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

  inputTemplateDisplayColumns = [
    {
      label: 'Kode Template',
      value: 'kode_template'
    },
    {
      label: 'Nama Template',
      value: 'nama_template'
    }
  ]
  inputTemplateInterface = {
    kode_template: 'string',
    nama_template: 'string'
  }
  inputTemplateData = []
  inputTemplateDataRules = []

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
        onFound: () => {
          this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
          this.browseNeedUpdate = true
        }
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'No. Jurnal',
      id: 'nomor-jurnal',
      type: 'input',
      valueOf: 'no_jurnal',
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
        disabled: true
      },
      timepick: false,
      enableMin: true,
      enableMax: true,
      disabled: false,
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
      disabled: false,
      update: {
        disabled: true
      }
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
        valueOf: 'tipe_laporan',
        matchValue: ["k", "p", ""]
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Lembar Giro',
      id: 'lembar-giro',
      type: 'input',
      valueOf: 'lembar_giro',
      required: false,
      readOnly: false,
      hiddenOn: {
        valueOf: 'tipe_laporan',
        matchValue: ["k", "p", "b", ""]
      },
      numberOnly: true,
      update: {
        disabled: false
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
      disabled: false,
      update: {
        disabled: false
      }
    },
    {
      formWidth: 'col-5',
      label: 'Template',
      id: 'kode-template',
      type: 'inputgroup',
      click: (type) => this.openDialog(type),
      btnLabel: '',
      btnIcon: 'flaticon-search',
      browseType: 'kode_template',
      valueOf: 'kode_template',
      required: false,
      readOnly: false,
      inputInfo: {
        id: 'nama-template',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_template'
      },
      blurOption: {
        ind: 'kode_template',
        data: [],
        valueOf: ['kode_template', 'nama_template'],
        onFound: () => null
      },
      update: {
        disabled: true
      }
    },
    {
      formWidth: 'col-5',
      label: 'Nilai Transaksi',
      id: 'nilai-transaksi',
      type: 'input',
      valueOf: 'saldo_transaksi',
      currency: true,
      required: true,
      disabled: false,
      readOnly: false,
      leftAddon: 'Rp.',
      currencyOptions: {
        precision: 2
      },
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

  checkKeyReport = {}

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private router: Router,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.gbl.need(true, true)
    this.namaTombolPrintDoc = "Cetak Transaksi Jurnal Umum"
    this.namaTombolPrintDoc2 = "Cetak Transaksi Kasir"
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
    this.formValue = {
      id_tran: x['id_tran_jurnal'],
      id_tran_jt: x['id_tran'],
      no_jurnal: x['no_jurnal'],
      no_tran: x['no_tran'],
      tgl_tran: JSON.stringify(t_tran.getTime()),
      kode_cabang: x['kode_cabang'],
      nama_cabang: x['nama_cabang'],
      id_jenis_transaksi: x['id_jenis_transaksi'],
      kode_jenis_transaksi: x['kode_jenis_transaksi'],
      nilai_jenis_transaksi: x['nilai_jenis_transaksi'],
      tipe_transaksi: x['tipe_transaksi'],
      saldo_transaksi: parseFloat(x['saldo_transaksi']),
      keterangan: x['keterangan'],
      tipe_laporan: x['tipe_laporan'],
      kode_template: x['kode_template'],
      nama_template: x['nama_template']
    }
    this.id_periode = x['id_periode']
    this.onUpdate = true;
    if (this.onUpdate === true) {
      this.disablePrintButton = false
      this.disablePrintButton2 = false
    }
    this.enableCancel = x['boleh_batal'] === 'Y' ? true : false
    this.enableEdit = x['boleh_edit'] === 'Y' ? true : false
    this.getBackToInput();
  }

  getBackToInput() {
    this.selectedTab = 0;
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
        this.formValue.id_tran_jt = this.formValue.id_tran_jt === '' ? `${MD5(Date().toLocaleString() + Date.now() + randomString({
          length: 8,
          numeric: true,
          letters: false,
          special: false
        }))}` : this.formValue.id_tran_jt
        this.detailData = this.formValue['detail']['data']
        for(var i = 0; i < this.detailData.length; i++){
          if(this.detailData[i]['bobot_debit'] > 0 && this.detailData[i]['bobot_kredit'] === 0){
            this.detailData[i]['saldo_debit'] = this.forminput.getData().saldo_transaksi * (this.detailData[i]['bobot_debit'] / 100)
            this.detailData[i]['saldo_kredit'] = 0
          }

          if(this.detailData[i]['bobot_kredit'] > 0 && this.detailData[i]['bobot_debit'] === 0){
            this.detailData[i]['saldo_kredit'] = this.forminput.getData().saldo_transaksi * (this.detailData[i]['bobot_kredit'] / 100)
            this.detailData[i]['saldo_debit'] = 0
          }
        
        }
        this.formValue['detail'] = this.detailData
        let tgl = new Date(parseInt(this.formValue['tgl_tran'])), idp = ""
        if (!this.onUpdate) {
          for (var i = 0; i < this.daftar_periode_kasir.length; i++) {
            let dpk = new Date(this.daftar_periode_kasir[i]['tgl_periode'])
            if (tgl.getTime() == (dpk.getTime() - 25200000) && this.formValue['kode_cabang'] === this.daftar_periode_kasir[i]['kode_cabang']) {
              idp = this.daftar_periode_kasir[i]['id_periode']
              break
            }
          }
        }
        let endRes = Object.assign({ id_kasir: this.id_kasir, kode_perusahaan: this.kode_perusahaan, id_periode_kasir: this.onUpdate ? this.id_periode : idp, id_periode_jurnal: this.periode_jurnal['id_periode'] }, this.formValue)
        this.request.apiData('jurnal', this.onUpdate ? 'u-jurnal-transaksi' : 'i-jurnal-transaksi', endRes).subscribe(
          data => {
            this.total_debit = 0
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
            // if (this.total_debit !== this.forminput.getData().saldo_transaksi) {
            //   this.openSnackBar('Saldo transaksi tidak sesuai dengan nilai jurnal', 'info')
            // } else {
              this.openSnackBar('Ada akun yang tidak valid atau saldo debit dan kredit tidak seimbang.', 'info')
            // }
          }
        }
        this.total_debit = 0
      }
    }
  }

  printDoc(v) {
    if (this.forminput !== undefined) {
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValue['id_tran'] + this.formValue['id_tran_jt'] + this.formValue['no_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formDetail['format_cetak'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formDetail['format_cetak'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
          }
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        let data = []
        for (var i = 0; i < this.reportDetail.length; i++) {
          let t = []
          t.push(this.formValue['no_jurnal'])
          t.push(new Date(parseInt(this.formValue['tgl_tran'])).getTime())
          t.push(this.formValue.keterangan)
          t.push(this.formValue.nama_cabang)
          t.push(this.reportDetail[i]['kode_akun'])
          t.push(this.reportDetail[i]['nama_akun'])
          t.push(this.reportDetail[i]['saldo_debit'])
          t.push(this.reportDetail[i]['saldo_kredit'])

          data.push(t)
        }

        let rp = JSON.parse(JSON.stringify(this.reportObj))
        rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
        rp['REPORT_CODE'] = 'DOK-TRAN-JURNAL'
        rp['REPORT_NAME'] = 'Dokumen Transaksi Jurnal Umum'
        rp['REPORT_FORMAT_CODE'] = v['format_cetak']
        rp['JASPER_FILE'] = 'dokTransaksiJurnal.jasper'
        rp['REPORT_PARAMETERS'] = {
          USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
          REPORT_COMPANY_ADDRESS: this.info_company.alamat,
          REPORT_COMPANY_CITY: this.info_company.kota,
          REPORT_COMPANY_TLPN: this.info_company.telepon,
          REPORT_PERIODE: "Periode: " +
            this.gbl.getNamaBulan(this.periode_jurnal['bulan_periode']) + " " +
            this.periode_jurnal['tahun_periode']
        }

        rp['FIELD_TITLE'] = [
          "No. Transaksi",
          "Tgl. Transaksi",
          "Keterangan",
          "Nama Cabang",
          "Kode Akun",
          "Nama Akun",
          "Saldo Debit",
          "Saldo Kredit"
        ]
        rp['FIELD_NAME'] = [
          "noTran",
          "tglTran",
          "keterangan",
          "namaCabang",
          "kodeAkun",
          "namaAkun",
          "nilaiDebit",
          "nilaiKredit"
        ]
        rp['FIELD_TYPE'] = [
          "string",
          "date",
          "string",
          "string",
          "string",
          "string",
          "bigdecimal",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data
        this.sendGetPrintDoc(rp, this.formDetail['format_cetak'])
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  printDoc2(v) {
    if (this.forminput !== undefined) {
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValue['id_tran'] + this.formValue['id_tran_jt'] + this.formValue['no_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formDetail['format_cetak'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formDetail['format_cetak'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
          }
          setTimeout(() => {
            let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
            sbmBtn.click();
          }, 100)
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        let data = []
        for (var i = 0; i < this.reportDetail.length; i++) {
          let t = []
          t.push(this.formValue['no_tran'])
          t.push(new Date(parseInt(this.formValue['tgl_tran'])).getTime())
          t.push(this.formValue.keterangan)
          t.push(this.formValue.nama_cabang)
          t.push(this.reportDetail[i]['kode_akun'])
          t.push(this.reportDetail[i]['nama_akun'])
          t.push(this.reportDetail[i]['saldo_debit'])
          t.push(this.reportDetail[i]['saldo_kredit'])
          t.push(this.reportDetail[i]['keterangan_1'])
          t.push(this.formValue.saldo_transaksi)

          data.push(t)

        }

        let rp = JSON.parse(JSON.stringify(this.reportObj))
        let rt = (this.formValue.tipe_transaksi === '0' ? 'PEMASUKKAN' : 'PENGELUARAN') + " " + (this.formValue.tipe_laporan === 'k' ? 'KAS' : this.formValue.tipe_laporan === 'b' ? 'BANK' : this.formValue.tipe_laporan === 'g' ? 'GIRO' : 'KAS KECIL')
        rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
        rp['REPORT_CODE'] = 'DOK-JURNAL-TRANSAKSI'
        rp['REPORT_NAME'] = rt
        rp['REPORT_FORMAT_CODE'] = v['format_cetak']
        rp['JASPER_FILE'] = 'dokTransaksiJurnalTransaksi.jasper'
        rp['REPORT_PARAMETERS'] = {
          USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
          REPORT_COMPANY_ADDRESS: this.info_company.alamat,
          REPORT_COMPANY_CITY: this.info_company.kota,
          REPORT_COMPANY_TLPN: this.info_company.telepon,
          REPORT_PERIODE: "Periode: " +
            this.gbl.getNamaBulan(this.periode_jurnal['bulan_periode']) + " " +
            this.periode_jurnal['tahun_periode']
        }
        rp['FIELD_TITLE'] = [
          "No. Transaksi",
          "Tgl. Transaksi",
          "Keterangan",
          "Nama Cabang",
          "Kode Akun",
          "Nama Akun",
          "Saldo Debit",
          "Saldo Kredit",
          "Keterangan Akun",
          "Saldo Transaksi"
        ]
        rp['FIELD_NAME'] = [
          "noTran",
          "tglTran",
          "keterangan",
          "namaCabang",
          "kodeAkun",
          "namaAkun",
          "nilaiDebit",
          "nilaiKredit",
          "keteranganAkun",
          "saldoTransaksi"
        ]
        rp['FIELD_TYPE'] = [
          "string",
          "date",
          "string",
          "string",
          "string",
          "string",
          "bigdecimal",
          "bigdecimal",
          "string",
          "bigdecimal"
        ]
        rp['FIELD_DATA'] = data
        this.sendGetPrintDoc(rp, this.formDetail['format_cetak'])
      }
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.openSnackBar('Gagal memproses dokumen.', 'info')
    }
  }

  sendGetPrintDoc(p, type) {
    this.dialog.closeAll()
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
          } else {
            if (type === 'xlsx') {
              this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
            } else {
              this.keyReportFormatExcel = data['RESULT'] + '.xls'
            }
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          }
          let rk = this.formValue['id_tran'] + this.formValue['id_tran_jt'] + this.formValue['no_tran'] + this.formValue['no_jurnal'] + this.formDetail['format_cetak']
          this.checkKeyReport[rk] = data['RESULT']
          this.loading = false
          this.ref.markForCheck()

        } else {
          this.loading = false
          this.ref.markForCheck()
          this.gbl.topPage()
          this.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
        }
      }
    )
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

      // for (var i = 0; i < data['detail']['data'].length; i++) {
      //   this.total_debit = this.total_debit + parseFloat(data['detail']['data'][i]['saldo_debit'])
      //   if (data['detail']['data'][i]['id_akun'] === '') {
      //     valid = false
      //     break;
      //   }
      // }

      if (data['nama_departemen'] === '') valid = false
      if (data['nama_divisi'] === '') valid = false

      // if (this.total_debit != data['saldo_transaksi']) {
      //   valid = false
      // }
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
      keterangan: '',
      tipe_laporan: '',
      kode_template: '',
      nama_template: ''
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
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0,
        bobot_debit: 0,
        bobot_kredit: 0,
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
        keterangan_1: '',
        keterangan_2: '',
        saldo_debit: 0,
        saldo_kredit: 0,
        bobot_debit: 0,
        bobot_kredit: 0,
      }
    ]
    this.id_periode = ""
    this.disableSubmit = true
    this.disablePrintButton = true
    this.disablePrintButton2 = true
    this.formInputCheckChanges()
    this.formInputCheckChangesJurnal()
  }

  resetDetailForm() {
    this.formDetail = {
      format_cetak: 'pdf'
    }
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
        id_tran_jt: this.formValue.id_tran_jt,
        batal_alasan: this.batal_alasan
      }
      this.dialog.closeAll()
      this.request.apiData('jurnal', 'c-jurnal-transaksi', endRes).subscribe(
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
            type === "kode_template" ? this.inputTemplateInterface :
              {},
        displayedColumns:
          type === "kode_cabang" ? this.inputCabangDisplayColumns :
            type === "kode_template" ? this.inputTemplateDisplayColumns :
              [],
        tableData:
          type === "kode_cabang" ? this.inputCabangData :
            type === "kode_template" ? this.inputTemplateData :
              [],
        tableRules:
          type === "kode_cabang" ? this.inputCabangDataRules :
            type === "kode_template" ? this.inputTemplateDataRules :
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
            this.formValue.kode_cabang = this.forminput.getData()['kode_cabang']
            let lp = this.daftar_periode_kasir.filter(x => x['kode_cabang'] === result.kode_cabang && x['aktif'] === '1')[0]
            let dt = new Date(lp['tgl_periode'])
            if (dt.getFullYear() == this.periode_jurnal['tahun_periode'] && (dt.getMonth() + 1) == this.periode_jurnal['bulan_periode']) {
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
                  disabled: true
                },
                timepick: false,
                enableMin: true,
                enableMax: true,
                disabled: false,
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
              this.browseNeedUpdate = true
              this.disableSubmit = false
              this.ref.markForCheck()
            } else {
              this.disableSubmit = true
              this.ref.markForCheck()
              this.openSnackBar('Tanggal periode jurnal dan transaksi tidak sesuai.', 'info')
            }
          }
        } else if (type === "kode_template") {
          if (this.forminput !== undefined) {
            if (result.kode_template !== this.formValue.kode_template) {
              this.forminput.updateFormValue('kode_template', result.kode_template)
              this.forminput.updateFormValue('nama_template', result.nama_template)
              this.formValue.kode_template = this.forminput.getData()['kode_template']
              this.getDetail()
            }
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  inputDialog(type) {
    this.gbl.topPage()
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '150px' },
      data: {
        formValue: this.formDetail,
        inputLayout: this.detailInputLayout,
        buttonLayout: [],
        buttonName: 'Cetak',
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => this.resetDetailForm(),
        onSubmit: (x: NgForm) =>
          type === "cetakJurnalUmum" ? this.printDoc(this.formDetail) :
            type === "cetakTransKasir" ? this.printDoc2(this.formDetail) :
              {},
        deleteData: () => null,
      },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(
      result => {
      },
      error => null,
    );
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

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && !this.requestMade) {
      this.requestMade = true
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            for (var i = 0; i < data['RESULT'].length; i++) {
              if (data['RESULT'][i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN') {
                this.info_company.alamat = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'KOTA-PERUSAHAAN') {
                this.info_company.kota = data['RESULT'][i]['nilai1']
              }
              if (data['RESULT'][i]['kode_lookup'] === 'TELEPON-PERUSAHAAN') {
                this.info_company.telepon = data['RESULT'][i]['nilai1']
              }
            }
          } else {
            this.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

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

      this.request.apiData('template', 'g-template', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputTemplateData = data['RESULT']
            this.updateInputdata(data['RESULT'], 'kode_template')
          } else {
            this.openSnackBar('Gagal mendapatkan daftar template transaksi. Mohon coba lagi nanti.', 'fail')
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
      this.request.apiData('kasir', 'g-status-user-kasir', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let t = data['RESULT'][0]
            if (t['aktif'] !== 'Y') {
              this.loading = false
              this.disableForm = true
              this.ref.markForCheck()
              this.openSnackBar('User bukan merupakan kasir aktif.', 'info')
            } else {
              this.id_kasir = t['id_kasir']
              this.sendRequestPeriode()
            }
          } else {
            this.loading = false
            this.disableForm = true
            this.ref.markForCheck()
            this.openSnackBar('User tidak memiliki akses kasir.', 'info', () => this.router.navigateByUrl('/'))
          }
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
                this.forminput.updateFormValue('tipe_laporan', d[0]['tipe_laporan'])
              }
            },
            required: true,
            readOnly: false,
            disabled: false,
            update: {
              disabled: true
            }
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
              valueOf: 'tipe_laporan',
              matchValue: ["k", "p", ""]
            },
            update: {
              disabled: true
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
    this.request.apiData('template', 'g-template-detail', { kode_perusahaan: this.kode_perusahaan, kode_template: this.formValue.kode_template }).subscribe(
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
              keterangan_1: resp[i]['keterangan_1'],
              keterangan_2: resp[i]['keterangan_2'],
              saldo_debit: parseFloat(resp[i]['nilai_debit']),
              saldo_kredit: parseFloat(resp[i]['nilai_kredit']),
              bobot_debit: parseFloat(resp[i]['bobot_debit']),
              bobot_kredit: parseFloat(resp[i]['bobot_kredit'])
            }
            res.push(t)
          }
          this.detailData = res
          this.reportDetail = JSON.parse(JSON.stringify(res))
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
    if (this.periode_kasir['tgl_periode'] !== '') {
      this.tableLoad = true
      let tga = this.periode_kasir['tgl_periode'], tgk = new Date(this.periode_kasir['tgl_periode'])
      this.request.apiData(
        'jurnal',
        'g-jurnal-transaksi',
        {
          kode_perusahaan: this.kode_perusahaan,
          tgl_periode_awal: tga,
          tgl_periode_akhir: (JSON.stringify(tgk.getFullYear()) + "-" + (JSON.stringify(tgk.getMonth() + 1).length > 1 ? JSON.stringify(tgk.getMonth() + 1) : '0' + JSON.stringify(tgk.getMonth() + 1)) + "-" + JSON.stringify(tgk.getDate() + this.dayLimit))
        }
      ).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            if (message !== '') {
              this.browseData = data['RESULT']
              this.loading = false
              this.tableLoad = false
              this.browseNeedUpdate = false
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
    } else {
      this.openSnackBar('Pilih cabang terlebih dahulu.', 'info', () => {
        this.selectedTab = 0
        this.ref.markForCheck()
      })
    }
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
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailTemplate()
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
