// Add Library
import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
// Add Service
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';
// Add Component
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'kt-data-jurnal-batch',
  templateUrl: './data-jurnal-batch.component.html',
  styleUrls: ['./data-jurnal-batch.component.scss', '../monitoring.style.scss']
})
export class DataJurnalBatchComponent implements OnInit, AfterViewInit {

  // View Child
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  // Global Service Variable
  subsCompany: any // Subscription for Akses Perusahaan 
  kodePerusahaan: any // Contain Data Perusahaan Aktif

  // Load Variable
  menuload: boolean = true
  tableLoad: boolean = false

  // Contain Data Variable
  lastYears: any // Contain Data Tahun Tertinggi
  lastMonths: any // Contain Data Bulan Tertinggi
  dataCompany: any // Contain Data Company
  chkKeyReqRpt = {} // Contain Data Check Key Request Report 
  keyRptExcel: any; // Contain Data Key Report Excel 
  inputCabangData = []
  inputPeriodeData = []
  browseData = [] // Contain Data Result (Jurnal)
  detailData = []
  infoCompany = {
    alamat: '',
    kota: '',
    telepon: ''
  }
  formValue = { // Input Value
    jenis_jurnal: '01',
    kode_cabang: '',
    nama_cabang: '',
    tahun_periode: '',
    bulan_periode: '',
    filter_jurnal: '2'
  }
  formDetail = { // Input Value
    id_tran: '',
    no_tran: '',
    tgl_tran: '',
    keterangan: '',

    // Kasir
    nama_jenis_transaksi: '',
    nama_tipe_transaksi: '',
    rekening: '',

    // Status
    jenis_jurnal: '0',
    tipe_transaksi: '0',
    tipe_laporan: '',
    batal_status: ''
  }
  formPrint = { // Input Value
    tipe_format: 'pdf'
  }

  // Display Select Box Variable
  filTipeJurnal = [
    {
      label: 'All',
      value: '2'
    },
    {
      label: 'Jurnal Kasir',
      value: '1'
    },
    {
      label: 'Jurnal Umum',
      value: '0'
    }
  ]
  tipeJurnal = [
    {
      label: 'Jurnal Kasir',
      value: '01'
    },
    {
      label: 'Jurnal Umum',
      value: '04'
    },
    {
      label: 'Jurnal Penyesuaian',
      value: '02'
    },
    {
      label: 'Jurnal Otomatis',
      value: '03'
    }
  ]
  tipeFormatPrint = [
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
  listTahun = []
  listBulan = []

  // Display Columns Table Variable
  inputCabangDisplayColumns = [ // Display For Input Data Cabang
    {
      label: 'Kode Cabang',
      value: 'kode_cabang'
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]
  displayColumnsDefault = [ // Display Columns (Default Jurnal)
    {
      label: 'Data Jurnal',
      value: ''
    }
  ]
  displayColumnsJU = [
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
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ] // Display Columns (Jurnal Umum)
  displayColumnsJT = [ // Display Columns (Jurnal Kasir/Transaksi)
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
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Tipe Transaksi',
      value: 'nama_tipe_transaksi'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ]
  displayColumnsJO = [ // Display Columns (Jurnal Otomatis)
    {
      label: 'Jenis Jurnal',
      value: 'jenis_jurnal_name'
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
      label: 'Jenis Transaksi',
      value: 'nama_jenis_transaksi'
    },
    {
      label: 'Tipe Transaksi',
      value: 'nama_tipe_transaksi'
    },
    {
      label: 'Saldo Transaksi',
      value: 'saldo_transaksi',
      number: true
    },
    {
      label: 'Keterangan',
      value: 'keterangan'
    },
    {
      label: 'Status Batal',
      value: 'batal_status_name'
    }
  ]
  displayColumns = JSON.parse(JSON.stringify(this.displayColumnsDefault))

  // Display Layout Form Variable
  inputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'combobox',
      options: this.tipeJurnal,
      valueOf: 'jenis_jurnal',
      required: false,
      readOnly: true,
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Cabang',
      id: 'kode-cabang',
      type: 'inputgroup',
      click: (type) => this.inputGroup(type),
      btnIcon: 'flaticon-search',
      browseType: 'cabang',
      valueOf: 'kode_cabang',
      required: false,
      readOnly: true,
      inputInfo: {
        id: 'nama-cabang',
        disabled: false,
        readOnly: true,
        required: false,
        valueOf: 'nama_cabang'
      },
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.listTahun,
      onSelectFunc: (filterVal) => this.filterMonth(filterVal, ''),
      valueOf: 'tahun_periode',
      required: false,
      readOnly: true,
      disabled: false
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Bulan Periode',
      id: 'bulan-periode',
      type: 'combobox',
      options: this.listBulan,
      valueOf: 'bulan_periode',
      required: false,
      readOnly: true,
      disabled: false
    }
  ]

  rightInputLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Filter Jurnal',
      id: 'filter-jurnal',
      type: 'combobox',
      options: this.filTipeJurnal,
      valueOf: 'filter_jurnal',
      required: false,
      readOnly: true,
      disabled: false,
      hiddenOn: {
        valueOf: 'jenis_jurnal',
        matchValue: ['', '01', '02', '04']
      }
    }
  ]

  detailDefaultLayout = [
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'No. Transaksi',
      id: 'no-tran',
      type: 'input',
      valueOf: 'no_tran',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tgl. Transaksi',
      id: 'tgl-tran',
      type: 'input',
      valueOf: 'tgl_tran',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Jenis Transaksi',
      id: 'nama-jenis-transaksi',
      type: 'input',
      valueOf: 'nama_jenis_transaksi',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Rekening Bank',
      id: 'rekening',
      type: 'input',
      valueOf: 'rekening',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Tipe Transaksi',
      id: 'nama-tipe-transaksi',
      type: 'input',
      valueOf: 'nama_tipe_transaksi',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      labelWidth: 'col-3',
      formWidth: 'col-9',
      label: 'Status Transaksi',
      id: 'batal-status',
      type: 'input',
      valueOf: 'batal_status',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

  detailInputLayout = JSON.parse(JSON.stringify(this.detailDefaultLayout))

  printInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Format Cetak',
      id: 'tipe-format',
      type: 'combobox',
      options: this.tipeFormatPrint,
      valueOf: 'tipe_format',
      required: true,
      readOnly: false,
      disabled: false,
    }
  ]

  // Columns Table Rules Variable
  browseDataRules = [
    {
      target: 'jurnal_kasir',
      replacement: {
        '0': 'Jurnal Umum',
        '1': 'Jurnal Kasir'
      },
      redefined: 'jenis_jurnal_name'
    },
    {
      target: 'batal_status',
      replacement: {
        true: 'Y',
        false: '',
        '': ''
      },
      redefined: 'batal_status_name'
    }
  ]

  constructor(
    // Library
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,
    // Service
    private request: RequestDataService,
    private gbl: GlobalVariableService,
  ) { }

  ngOnInit() {
    this.gbl.need(true, false) // Show-Hide Perusahaan & Periode
    this.getCompany() // Subs Company Active
    this.reqData() // Request Mandatory Data
  }

  ngAfterViewInit(): void {
    this.kodePerusahaan = this.gbl.getKodePerusahaan()

    if (this.kodePerusahaan !== '') {
      this.reqData() // Request Mandatory Data
    }
  }

  ngOnDestroy(): void {
    this.subsCompany === undefined ? null : this.subsCompany.unsubscribe()
  }

  // Subs Company Active
  getCompany() {
    this.subsCompany = this.gbl.change.subscribe(
      value => {
        this.kodePerusahaan = value
        this.ref.markForCheck()

        if (this.kodePerusahaan !== '') {
          this.reqData()
        }
      }
    )
  }

  // Request Mandatory Data
  reqData() {
    if (this.kodePerusahaan != undefined &&
      this.kodePerusahaan != null &&
      this.kodePerusahaan !== '') {
      this.request.apiData('lookup', 'g-info-company', { kode_perusahaan: this.kodePerusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.dataCompany = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'fail')
          }
        }
      )
      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kodePerusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            if (this.inputPeriodeData.length > 0) {
              this.lastYears = this.gbl.getTahunTertinggi(this.inputPeriodeData)
              this.lastMonths = this.gbl.getBulanTertinggi(this.inputPeriodeData, this.lastYears)
            }
            this.ref.markForCheck()
            this.reqDataCabang()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan data periode. Mohon coba lagi nanti.', 'fail')
          }
        }
      )
    }
  }

  // Request Data Cabang Akses
  reqDataCabang() {
    this.request.apiData('cabang', 'g-cabang-akses', { kode_perusahaan: this.kodePerusahaan }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.ref.markForCheck()
          this.inputCabangData = data['RESULT']
          let cabangAcs = JSON.parse(JSON.stringify(data['RESULT'])), // Duplicate Result
            cabangUtama = cabangAcs.filter(x => x.cabang_utama_user === 'true')[0] || {}
          this.ref.markForCheck()
          this.formValue.kode_cabang = cabangUtama.kode_cabang
          this.formValue.nama_cabang = cabangUtama.nama_cabang
          this.setValPeriod()
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
        }
      }
    )
  }

  // Set Display Select Box Data (Periode)
  setValPeriod() {
    let temp = [], flags = [], yearsList = [], monthList = {}
    // Set Tahun
    for (var i = 0; i < this.inputPeriodeData.length; i++) {
      if (flags[this.inputPeriodeData[i]['tahun_periode']]) continue;
      flags[this.inputPeriodeData[i]['tahun_periode']] = true;
      temp.push(this.inputPeriodeData[i]['tahun_periode'])
      yearsList.push({
        label: this.inputPeriodeData[i]['tahun_periode'],
        value: this.inputPeriodeData[i]['tahun_periode']
      });
    }
    this.listTahun = yearsList
    this.formValue.tahun_periode = this.lastYears.toString()
    // Set Bulan
    for (var i = 0; i < temp.length; i++) {
      monthList[temp[i]] = []
      for (var j = 0; j < this.inputPeriodeData.length; j++) {
        if (this.inputPeriodeData[j]['tahun_periode'] === temp[i]) {
          flags[this.inputPeriodeData[j]['bulan_periode']] = true;
          monthList[temp[i]].push({
            label: this.inputPeriodeData[j]['bulan_periode'],
            value: this.inputPeriodeData[j]['bulan_periode']
          })
        }
      }
    }
    this.listBulan = monthList[this.formValue.tahun_periode]
    this.formValue.bulan_periode = this.lastMonths.toString()
    this.ref.markForCheck()
    this.inputLayout.splice(2, 2,
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.listTahun,
        onSelectFunc: (filterVal) => this.filterMonth(filterVal, monthList),
        valueOf: 'tahun_periode',
        required: false,
        readOnly: true,
        disabled: false
      },
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.listBulan,
        valueOf: 'bulan_periode',
        required: false,
        readOnly: true,
        disabled: false
      }
    )
    this.menuload = false
  }

  filterMonth(filterVal, monthList) {
    this.forminput.updateFormValue('tahun_periode', filterVal)
    this.forminput.updateFormValue('bulan_periode', this.gbl.getBulanTertinggi(this.inputPeriodeData, parseInt(filterVal)).toString())
    this.listBulan = monthList[filterVal]
    this.inputLayout.splice(3, 1,
      {
        labelWidth: 'col-3',
        formWidth: 'col-9',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.listBulan,
        valueOf: 'bulan_periode',
        required: false,
        readOnly: true,
        disabled: false
      }
    )
  }

  onSubmit(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      if (inputForm.valid) {
        if (JSON.stringify(this.formValue) === JSON.stringify(this.forminput.getData()) == false) {
          this.tableLoad = true
          this.reqDataJurnal() // Get Data Report
        } else {
          this.tableLoad = true
          setTimeout(() => {
            this.ref.markForCheck()
            this.tableLoad = false
          }, 750);
        }
      }
    }
  }

  reqDataJurnal() {
    this.formValue = this.forminput === undefined ? this.formValue : this.forminput.getData()
    // Request Params Mandatory
    let reqParams = {
      kode_perusahaan: this.kodePerusahaan,
      kode_cabang: this.formValue.kode_cabang,
      jenis_jurnal: this.formValue.jenis_jurnal
    },
      initMonth = this.formValue.bulan_periode.length > 1 ? this.formValue.bulan_periode : '0' + this.formValue.bulan_periode
    if (this.formValue.jenis_jurnal === '01') { // Kasir
      this.displayColumns = this.displayColumnsJT
      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
      reqParams['tgl_periode_awal'] = this.formValue.tahun_periode + '-' + initMonth + '-' + '01'
      reqParams['tgl_periode_akhir'] = this.formValue.tahun_periode + '-' + initMonth + '-' + this.gbl.maxDate(this.formValue.bulan_periode, this.formValue.tahun_periode)
    } else if (this.formValue.jenis_jurnal === '02' || this.formValue.jenis_jurnal === '04') { // Penyesuaian atau Umum
      this.displayColumns = this.displayColumnsJU
      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
    } else if (this.formValue.jenis_jurnal === '03') { // Otomatis
      if (this.formValue.filter_jurnal === '2') {
        this.displayColumns = this.displayColumnsJO
      } else if (this.formValue.filter_jurnal === '1') {
        this.displayColumns = this.displayColumnsJT
      } else {
        this.displayColumns = this.displayColumnsJU
      }

      // Request Params Optional
      reqParams['periode'] = this.formValue.tahun_periode + '-' + initMonth
    }
    this.request.apiData('jurnal', 'g-jurnal', reqParams).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.browseData = data['RESULT']
          if (data['RESULT'].length < 1) {
            this.gbl.openSnackBar('Data jurnal tidak ditemukan', 'info')
          } else {
            if (this.formValue.jenis_jurnal === '03') {
              if (this.formValue.filter_jurnal !== '2') {
                let res = [], dataDupl = JSON.parse(JSON.stringify(data['RESULT']))
                for (var i = 0; i < dataDupl.length; i++) {
                  if (dataDupl[i]['jurnal_kasir'] === this.formValue.filter_jurnal) {
                    res[i] = dataDupl[i]
                  }
                }
                if (res.length < 1) {
                  this.gbl.openSnackBar('Data jurnal tidak ditemukan', 'info')
                }
                this.browseData = res
              }
            }
          }
          this.ref.markForCheck()
          this.tableLoad = false
          if (this.browseData.length > 0) {
            setTimeout(() => {
              this.ref.markForCheck()
              this.gbl.screenPosition()
            }, 450);
          }
        } else {
          this.gbl.openSnackBar('Gagal mendapatkan data jurnal. Mohon coba lagi nanti.', 'fail')
          this.ref.markForCheck()
          this.tableLoad = false
        }
      }
    )
    this.formInputCheckChanges()
  }

  selectRow(data) {
    let x = JSON.parse(JSON.stringify(data)), dateValue, cancStat
    dateValue = new Date(x['tgl_tran'])
    this.formDetail.id_tran = x['id_tran']
    this.formDetail.no_tran = x['no_tran']
    this.formDetail.tgl_tran = this.gbl.splitDate(x['tgl_tran'], 'D-M-Y')
    this.formDetail.keterangan = x['keterangan']
    // Kasir
    this.formDetail.nama_jenis_transaksi = x['nama_jenis_transaksi']
    this.formDetail.nama_tipe_transaksi = x['nama_tipe_transaksi']
    // Status
    this.formDetail.jenis_jurnal = x['jurnal_kasir'] === '1' ? '2' : '0'
    this.formDetail.tipe_transaksi = x['tipe_transaksi']
    this.formDetail.tipe_laporan = x['tipe_laporan']
    this.formDetail.rekening = x['no_rekening'] + ' (' + x['nama_bank'] + ')'
    cancStat = x['batal_status'] === '' || !x['batal_status'] ? false : true

    if (this.formDetail.jenis_jurnal !== '2') {
      this.detailInputLayout.splice(2, 3)
    } else {
      if (this.formDetail.tipe_laporan !== 'b') {
        this.detailInputLayout.splice(3, 1)
      }
    }

    if (!cancStat) {
      this.detailInputLayout.splice(6, 1)
      if (this.formDetail.jenis_jurnal !== '2') {
        this.detailInputLayout.splice(3, 1)
      } else {
        if (this.formDetail.tipe_laporan !== 'b') {
          this.detailInputLayout.splice(5, 1)
        } else {
          this.detailInputLayout.splice(6, 1)
        }
      }
      this.formDetail.batal_status = ''
    } else {
      this.formDetail.batal_status = 'Batal'
    }

    // Others
    this.formDetail['milisec_date'] = JSON.stringify(dateValue.getTime()) // Date Value in milisecond
    this.formDetail['saldo_transaksi'] = x['saldo_transaksi']

    this.getDetail()
  }

  getDetail() {
    this.request.apiData('jurnal', 'g-jurnal-detail', { kode_perusahaan: this.kodePerusahaan, id_tran: this.formDetail.id_tran }).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          let detail = [], temp = JSON.parse(JSON.stringify(data['RESULT']))

          detail = temp.map(detail => {
            const container = detail
            // Add Important Object
            container['saldo_debit'] = parseFloat(detail.nilai_debit)
            container['saldo_kredit'] = parseFloat(detail.nilai_kredit)
            container['lembar_giro'] = parseFloat(detail.lbr_giro)
            // Delete Useless Object
            delete container.nilai_debit
            delete container.nilai_kredit
            delete container.lbr_giro
            return container
          }
          )
          // Check Jurnal Type
          if (this.formDetail.jenis_jurnal === '2') {
            if (this.formDetail.tipe_transaksi === '0') {
              this.detailData = detail.filter(x => x['saldo_kredit'] != 0)
            } else {
              this.detailData = detail.filter(x => x['saldo_debit'] != 0)
            }
          } else {
            this.detailData = detail
          }
          this.formInputCheckChangesJurnal()
          this.inputDialog('view-data')
        }
      }
    )
  }

  inputGroup(type?: any) {
    let data = [
      {
        type: type,
        title: 'Data Cabang',
        columns: this.inputCabangDisplayColumns,
        contain: this.inputCabangData,
        rules: [],
        interface: {}
      }
    ], setting = {
      width: '50vw',
      posTop: '30px'
    },

      input = this.gbl.openDialog(type, data, this.formValue, setting)
    input.afterClosed().subscribe(result => {
      if (result) {
        if (type === 'cabang') {
          this.forminput.updateFormValue('kode_cabang', result['kode_cabang'])
          this.forminput.updateFormValue('nama_cabang', result['nama_cabang'])
        }
      }
      this.ref.markForCheck()
    }
    )
  }

  inputDialog(type?: any) {
    this.gbl.screenPosition()
    let dataSetting = this.dataSetting(type)
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: dataSetting['height'],
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: dataSetting['position'] },
      data: {
        width: dataSetting['widthContent'],
        title: dataSetting['titleName'],
        btnOption: dataSetting['btnOption'],
        noButtonSave: true,
        detailJurnal: dataSetting['showDtJurnal'],
        noEditJurnal: true,
        formValue: dataSetting['formDetail'],
        jurnalData: this.detailData,
        jurnalDataAkun: [],
        inputLayout: dataSetting['detailInputLayout'],
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        onSubmit: (x: NgForm) => null,
        deleteData: () => null
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.datatable == undefined ? null : this.datatable.reset()
        this.ref.markForCheck()
        this.detailInputLayout = JSON.parse(JSON.stringify(this.detailDefaultLayout))
      },
      error => null,
    );
  }

  printData(printType, header, detail) {
    let rk = header['jenis_jurnal'] + header['id_tran'] + printType
    if (this.chkKeyReqRpt[rk] !== undefined) {
      if (printType === 'pdf') {
        window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + this.chkKeyReqRpt[rk], "_blank")
      } else {
        if (printType === 'xlsx') {
          this.keyRptExcel = this.chkKeyReqRpt[rk] + '.xlsx'
        } else {
          this.keyRptExcel = this.chkKeyReqRpt[rk] + '.xls'
        }
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
      this.ref.markForCheck()
    } else {
      for (var i = 0; i < this.dataCompany.length; i++) {
        if (this.dataCompany[i]['kode_lookup'] === 'ALAMAT-PERUSAHAAN' && this.dataCompany[i]['kode_cabang'] === this.formValue.kode_cabang) {
          this.infoCompany.alamat = this.dataCompany[i]['nilai1']
        }
        if (this.dataCompany[i]['kode_lookup'] === 'KOTA-PERUSAHAAN' && this.dataCompany[i]['kode_cabang'] === this.formValue.kode_cabang) {
          this.infoCompany.kota = this.dataCompany[i]['nilai1']
        }
        if (this.dataCompany[i]['kode_lookup'] === 'TELEPON-PERUSAHAAN' && this.dataCompany[i]['kode_cabang'] === this.formValue.kode_cabang) {
          this.infoCompany.telepon = this.dataCompany[i]['nilai1']
        }
      }
      let data = [], rptData = {}
      for (var i = 0; i < detail.length; i++) {
        let tmp = []
        tmp.push(header['no_tran'])
        tmp.push(new Date(parseInt(header['milisec_date'])).getTime())
        tmp.push(header['keterangan'])
        tmp.push(this.formValue.nama_cabang)
        tmp.push(detail[i]['kode_akun'])
        tmp.push(detail[i]['nama_akun'])
        tmp.push(detail[i]['kode_divisi'])
        tmp.push(detail[i]['nama_divisi'])
        tmp.push(detail[i]['kode_departemen'])
        tmp.push(detail[i]['nama_departemen'])
        tmp.push(detail[i]['keterangan_1'])
        tmp.push(detail[i]['keterangan_2'])
        tmp.push(detail[i]['saldo_debit'])
        tmp.push(detail[i]['saldo_kredit'])
        if (header['jenis_jurnal'] === '2') {
          tmp.push(detail[i]['keterangan_akun'])
          tmp.push(header['saldo_transaksi'])
        }

        data.push(tmp)
      }

      let rptSetting = this.rptSetting(header)

      rptData['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
      rptData['REPORT_CODE'] = rptSetting['rptCode']
      rptData['REPORT_NAME'] = rptSetting['rptName']
      rptData['REPORT_FORMAT_CODE'] = printType
      rptData['JASPER_FILE'] = rptSetting['jasperFile']
      rptData['REPORT_PARAMETERS'] = {
        USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
        REPORT_COMPANY_ADDRESS: this.infoCompany.alamat,
        REPORT_COMPANY_CITY: this.infoCompany.kota,
        REPORT_COMPANY_TLPN: this.infoCompany.telepon,
        REPORT_PERIODE: rptSetting['periode']
      }
      rptData['FIELD_TITLE'] = rptSetting['fieldTitle']
      rptData['FIELD_NAME'] = rptSetting['fieldName']
      rptData['FIELD_TYPE'] = rptSetting['fieldType']
      rptData['FIELD_DATA'] = data
      this.reqRpt(rptData, printType)
    }
  }

  reqRpt(data, type) {
    let endRes = Object.assign({ kode_perusahaan: this.kodePerusahaan, kode_cabang: this.formValue.kode_cabang, jenis_jurnal: this.formDetail['jenis_jurnal'] === '2' ? '1' : '0' }, data)
    this.request.apiData('report', 'g-report', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open("http://deva.darkotech.id:8704/report/viewer.html?repId=" + data['RESULT'], "_blank");
          } else {
            if (type === 'xlsx') {
              this.keyRptExcel = data['RESULT'] + '.xlsx'
            } else {
              this.keyRptExcel = data['RESULT'] + '.xls'
            }
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          }
          let rk = this.formDetail['jenis_jurnal'] + this.formDetail['id_tran'] + type
          this.chkKeyReqRpt[rk] = data['RESULT']
          this.ref.markForCheck()
        } else {
          let alertSetting = {}
          alertSetting['position'] = '370px'
          alertSetting['closeAlert'] = 'spesific'
          this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail', null, alertSetting)
        }
      }
    )
  }

  dataSetting(type) {
    let tmpData = {}
    if (type === 'view-data') {
      tmpData['position'] = '320px'
      tmpData['height'] = '50vh'
      tmpData['widthContent'] = '85vw'
      tmpData['titleName'] = 'Informasi Data Jurnal'
      tmpData['btnOption'] = this.formDetail.batal_status === 'Batal' ? [] :
        [
          {
            btnLabel: 'Cetak Transaksi',
            btnClass: 'btn btn-primary',
            btnStyle: {
              'margin': '5px 0 5px 5px'
            },
            btnClick: () => this.inputDialog('print-data')
          }
        ]
      tmpData['showDtJurnal'] = true
      tmpData['formDetail'] = this.formDetail
      tmpData['detailInputLayout'] = this.detailInputLayout
    } else if (type === 'print-data') {
      tmpData['position'] = '400px'
      tmpData['height'] = 'auto'
      tmpData['titleName'] = 'Cetak Transaksi'
      tmpData['btnOption'] = [
        {
          btnLabel: 'Cetak',
          btnClass: 'btn btn-primary',
          btnStyle: {},
          btnCond: true,
          btnClick: () => this.printData(tmpData['formDetail']['tipe_format'], this.formDetail, this.detailData)
        }
      ]
      tmpData['showDtJurnal'] = false
      tmpData['formDetail'] = this.formPrint
      tmpData['detailInputLayout'] = this.printInputLayout
    }
    return tmpData
  }

  rptSetting(data) {
    let tmpData = {},
      x = this.gbl.splitDate(parseInt(data['milisec_date']), 'M-Y'), // Change format date to M-Y
      y = x.split('-'), // Split date chacracter
      z = this.gbl.getNamaBulan(y[0]), // Get Month Name
      periode = z + ' ' + y[1]
    tmpData['periode'] = "Periode: " + periode
    if (data['jenis_jurnal'] === '2') {
      let rptName = (data['tipe_transaksi'] === '0' ? 'PEMASUKKAN' : 'PENGELUARAN') + " " +
        (
          data['tipe_laporan'] === 'k' ? 'KAS' :
            data['tipe_laporan'] === 'b' ? 'BANK' :
              data['tipe_laporan'] === 'g' ? 'GIRO' : 'KAS KECIL'
        )
      tmpData['rptCode'] = 'DOK-JURNAL-TRANSAKSI'
      tmpData['rptName'] = rptName
      tmpData['jasperFile'] = 'dokTransaksiJurnalTransaksi.jasper'
      tmpData['fieldTitle'] = [
        "No. Transaksi",
        "Tgl. Transaksi",
        "Keterangan",
        "Nama Cabang",
        "Kode Akun",
        "Nama Akun",
        "Kode Divisi",
        "Nama Divisi",
        "Kode Departemen",
        "Nama Departemen",
        "Keterangan 1",
        "Keterangan 2",
        "Saldo Debit",
        "Saldo Kredit",
        "Keterangan Akun",
        "Saldo Transaksi"
      ]
      tmpData['fieldName'] = [
        "noTran",
        "tglTran",
        "keterangan",
        "namaCabang",
        "kodeAkun",
        "namaAkun",
        "kodeDivisi",
        "namaDivisi",
        "kodeDepartemen",
        "namaDepartemen",
        "keterangan_1",
        "keterangan_2",
        "nilaiDebit",
        "nilaiKredit",
        "keteranganAkun",
        "saldoTransaksi"
      ]
      tmpData['fieldType'] = [
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
        "bigdecimal",
        "bigdecimal",
        "string",
        "bigdecimal"
      ]
    } else {
      tmpData['rptCode'] = 'DOK-TRAN-JURNAL'
      tmpData['rptName'] = 'Dokumen Transaksi Jurnal Umum'
      tmpData['jasperFile'] = 'dokTransaksiJurnal.jasper'
      tmpData['fieldTitle'] = [
        "No. Transaksi",
        "Tgl. Transaksi",
        "Keterangan",
        "Nama Cabang",
        "Kode Akun",
        "Nama Akun",
        "Kode Divisi",
        "Nama Divisi",
        "Kode Departemen",
        "Nama Departemen",
        "Keterangan 1",
        "Keterangan 2",
        "Saldo Debit",
        "Saldo Kredit",
      ]
      tmpData['fieldName'] = [
        "noTran",
        "tglTran",
        "keterangan",
        "namaCabang",
        "kodeAkun",
        "namaAkun",
        "kodeDivisi",
        "namaDivisi",
        "kodeDepartemen",
        "namaDepartemen",
        "keterangan_1",
        "keterangan_2",
        "nilaiDebit",
        "nilaiKredit"
      ]
      tmpData['fieldType'] = [
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
        "bigdecimal",
        "bigdecimal"
      ]
    }

    return tmpData
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
