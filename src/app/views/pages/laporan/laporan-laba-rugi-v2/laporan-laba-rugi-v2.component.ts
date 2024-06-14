import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Custom Service
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Custom Component
import { ForminputComponent } from '../../components/forminput/forminput.component';
import * as MD5 from 'crypto-js/md5';
import * as randomString from 'random-string';
import { bind } from 'lodash';

@Component({
  selector: 'kt-laba-rugi-v2',
  templateUrl: './laporan-laba-rugi-v2.component.html',
  styleUrls: ['./laporan-laba-rugi-v2.component.scss', '../laporan.style.scss']
})
export class LaporanLabaRugiV2Component implements OnInit, AfterViewInit {
  // View Child List
  @ViewChild(ForminputComponent, { static: false }) formInputVC

  // Others Variable
  urlReport: any = {
    pdf: '',
    sheets: ''
  }
  loading: boolean = true
  subsMenu: any; // Subscription Menu
  kodePerusahaan: string = '' // [Global Variable] Kode Perusahaan
  namaPerusahaan: string = '' // [Global Variable] Nama Perusahaan
  listInfoPerusahaan: any = []// [Request Data] Informasi Perusahaan
  listAksesCabang = [] // [Request Data] Akses Cabang
  listGroupAkunUser = [] // [Request Data] Akses Akun
  listPeriodeTran = [] // [Request Data] Periode Transaksi
  listSelectCabang = [] // Data Selected
  listAllBulanPeriode: any = []
  listAksesCabangDupl: any = []
  periodeFix: any // [Default Value] Periode Transaksi
  cabangUtama: any // [Default Value] Cabang Utama User
  rptRecycleId: any// [Value] Unique Key ID Laporan
  reportResultId = {} // [Value] Kumpulan ID Laporan yang pernah ditarik
  excelReportTypeId: any // [Value] ID Laporan Khusus untuk Format Excel
  infoLookupSts: boolean = false // Status Request Info Lookup

  // Form Input Value Variable
  formInputValFinal: any
  formInputVal = {
    ekstensi_laporan: 'xlsx',
    jenis_laporan: '0',
    bentuk_laporan: '0',
    tahun_periode: '',
    dari_bulan: '',
    sd_bulan: ''
  }


  // Combobox Variable
  ekstensiLaporanCbx = [ // Combobox Ekstensi Laporan
    {
      label: 'XLSX - Microsoft Excel 2007/2010',
      value: 'xlsx'
    },
    {
      label: 'XLS - Microsoft Excel 97/2000/XP/2003',
      value: 'xls'
    },
    {
      label: 'PDF - Portable Document Format',
      value: 'pdf'
    }
  ]
  jenisLaporanCbx = [
    {
      label: 'Rekap',
      value: '0'
    },
    {
      label: 'Rekap Analisa',
      value: '3'
    },
    {
      label: 'Perincian Perpertual',
      value: '4'
    },
    {
      label: 'Perincian Periodik',
      value: '2'
    }
  ]
  bentukLaporanCbx = [
    {
      label: 'Per Cabang',
      value: '0'
    },
    {
      label: 'ALL - Total Per Cabang',
      value: '1'
    },
    {
      label: 'ALL - Total Semua Cabang',
      value: '2'
    }
  ]
  tahunPeriodeCbx = [] // Combobox Tahun Periode
  bulanPeriodeCbx = [] // Combobox Bulan Periode

  // L.o.V (List of Values) Variable
  displayColCabangLov = [ // Tampil kolom di L.o.V Cabang 
    {
      label: 'Kode Cabang',
      value: 'kode_cabang',
      selectable: true
    },
    {
      label: 'Nama Cabang',
      value: 'nama_cabang'
    }
  ]

  // Form Input Layout Variable
  formInputLyt = [
    {
      formWidth: 'col-4',
      label: 'Format Laporan',
      id: 'ekstensi-laporan',
      valueOf: 'ekstensi_laporan',
      type: 'combobox',
      options: this.ekstensiLaporanCbx,
      required: false,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-4',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      valueOf: 'jenis_laporan',
      type: 'combobox',
      options: this.jenisLaporanCbx,
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => {
        if (data === '2') {
          // Jika jenis laporan adalah 'Perincian Periodik', hapus opsi PDF jika ada
          const pdfOptionIndex = this.ekstensiLaporanCbx.findIndex(option => option.value === 'pdf');
          if (pdfOptionIndex !== -1) {
            this.ekstensiLaporanCbx.splice(pdfOptionIndex, 1);
          }
          this.formInputVC.updateFormValue('ekstensi_laporan', 'xlsx');
        } else {
          // Jika jenis laporan bukan 'Perincian Periodik', tambahkan opsi PDF jika belum ada
          const pdfOptionIndex = this.ekstensiLaporanCbx.findIndex(option => option.value === 'pdf');
          if (pdfOptionIndex === -1) {
            this.ekstensiLaporanCbx.push({
              label: 'PDF - Portable Document Format',
              value: 'pdf'
            });
          }
        }
      }
      
    },
    {
      formWidth: 'col-4',
      label: 'Bentuk Laporan',
      id: 'bentuk-laporan',
      valueOf: 'bentuk_laporan',
      type: 'combobox',
      options: this.bentukLaporanCbx,
      required: false,
      readOnly: false,
      onSelectFunc: (data) => {
        if (data !== '0') {
          this.restructureDetailData('cabang', [], 'default')
        } else {
          this.restructureDetailData('cabang', this.listAksesCabangDupl, 'default')
        }
      }
    },
    {
      formWidth: 'col-4',
      label: 'Cabang',
      type: 'detail',
      click: (type) => this.inputGroup(type),
      btnLabel: 'Data Cabang',
      btnIcon: 'flaticon-list-3',
      browseType: 'kode_cabang',
      valueOf: 'kode',
      required: false,
      readOnly: true,
      update: {
        disabled: false
      },
      hiddenOn: {
        valueOf: 'bentuk_laporan',
        matchValue: ["1", "2", ""]
      }
    },
    {
      formWidth: 'col-4',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.tahunPeriodeCbx,
      valueOf: 'tahun_periode',
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => null,
    },
    {
      formWidth: 'col-4',
      label: 'Bulan Periode',
      id: 'dari-bulan',
      valueOf: 'dari_bulan',
      type: 'combobox',
      options: this.bulanPeriodeCbx,
      required: false,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => null,

      // Combobox Option
      opt_input: true,
      opt_label: '',
      opt_id: 'sd-bulan',
      opt_valueOf: 'sd_bulan',
      opt_type: 'opt_combobox',
      opt_options: this.bulanPeriodeCbx,
      onSelectFuncOpt: (data) => null
    }
  ]

  constructor(
    private ref: ChangeDetectorRef,
    public dialog: MatDialog,

    // Custom Service
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.gbl.need(true, false) // Informasi Perusahaan Aktif & Periode Aktif
    this.setPreparation()
  }

  ngAfterViewInit(): void {
    this.kodePerusahaan = this.gbl.getKodePerusahaan()
    this.namaPerusahaan = this.gbl.getNamaPerusahaan()

    if (this.kodePerusahaan != '') {
      this.setPreparation()
    }
  }

  ngOnDestroy(): void {
    this.subsMenu === undefined ? null : this.subsMenu.unsubscribe()
  }

  setPreparation() {
    if (this.kodePerusahaan != '') {

      let cabangAksesSts = false, periodeTranSts = false, // Status Request Data
        reqData = Object.assign({ kode_perusahaan: this.kodePerusahaan }) // Set Request Parameter

      // Request Data Akses Cabang
      this.request.apiData('cabang', 'g-cabang-akses', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.listAksesCabang = data['RESULT']
            cabangAksesSts = true

            // Set List Cabang Utama
            this.listAksesCabangDupl = JSON.parse(JSON.stringify(this.listAksesCabang)) // Akses Cabang Duplicate
            this.cabangUtama = this.listAksesCabangDupl.filter(data => data.cabang_utama_user == 'true') // Cabang Utama User
            this.restructureDetailData('cabang', this.listAksesCabangDupl, 'default')

            if (cabangAksesSts && periodeTranSts) {
              this.setContent()
            }
          } else {
            this.gbl.openSnackBar('Data akses cabang tidak ditemukan.', 'fail')
          }
        }
      )

      // Request Data Periode Transaksi
      this.request.apiData('periode', 'g-periode', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            this.listPeriodeTran = data['RESULT']
            periodeTranSts = true

            // Set Periode Transaksi Fix
            if (this.listPeriodeTran.length > 0) {
              this.periodeFix = {
                tahunPeriodeMaks: this.gbl.getTahunTertinggi(this.listPeriodeTran),
                bulanPeriodeMin: this.gbl.getBulanTerendah(this.listPeriodeTran, this.gbl.getTahunTertinggi(this.listPeriodeTran)),
                bulanPeriodeMaks: this.gbl.getBulanTertinggi(this.listPeriodeTran, this.gbl.getTahunTertinggi(this.listPeriodeTran))
              }

              // Set Default Form Input (Periode)
              this.formInputVal.tahun_periode = this.periodeFix.tahunPeriodeMaks
              this.formInputVal.dari_bulan = this.periodeFix.bulanPeriodeMin
              this.formInputVal.sd_bulan = this.periodeFix.bulanPeriodeMaks
              this.dataSetFunc('data-periode', this.listPeriodeTran)
            }

            if (cabangAksesSts && periodeTranSts) {
              this.setContent()
            }
          } else {
            this.gbl.openSnackBar('Data periode transaksi tidak ditemukan.', 'fail')
          }
        }
      )

      if (cabangAksesSts && periodeTranSts) {
        this.setContent()
      }
    }
  }

  setContent() {
    this.changeFormLayout('first')
    this.ref.markForCheck()
    this.loading = false
  }

  onSubmit(inputForm: NgForm) {
    if (this.formInputVC != undefined) {
      this.formInputVal = this.formInputVC.getData()
      if (inputForm.valid) {
        this.loading = true
        if (this.listInfoPerusahaan.length < 1) {
          this.setOptionalRequest()
        } else {
          this.actionData()
        }

      }
    }
  }

  actionData() {
    this.ref.markForCheck()
    this.formInputValFinal = {
      format_laporan: this.formInputVal.ekstensi_laporan,
      jenis_laporan: this.formInputVal.jenis_laporan,
      bentuk_laporan: this.formInputVal.bentuk_laporan,
      tahun_periode: this.formInputVal.tahun_periode.toString(),
      periode_from: this.formInputVal.dari_bulan.toString().padStart(2, "0"),
      periode_to: this.formInputVal.sd_bulan.toString().padStart(2, "0")
    }

    let xCabang = []
    for (var i = 0; i < this.listSelectCabang.length; i++) {
      xCabang.push(this.listSelectCabang[i]['kode_cabang'])
    }
    this.formInputValFinal['list_cabang'] = xCabang

    for (var i = 0; i < this.listInfoPerusahaan.length; i++) {
      if (xCabang.length == 1) {
        if (this.listInfoPerusahaan[i].kode_lookup === 'ALAMAT-PERUSAHAAN' && this.listInfoPerusahaan[i].kode_cabang === xCabang[0]) {
          this.formInputValFinal['company_adress'] = this.listInfoPerusahaan[i]['nilai1']
        }
        if (this.listInfoPerusahaan[i].kode_lookup === 'KOTA-PERUSAHAAN' && this.listInfoPerusahaan[i].kode_cabang === xCabang[0]) {
          this.formInputValFinal['company_city'] = this.listInfoPerusahaan[i]['nilai1']
        }
        if (this.listInfoPerusahaan[i].kode_lookup === 'TELEPON-PERUSAHAAN' && this.listInfoPerusahaan[i].kode_cabang === xCabang[0]) {
          this.formInputValFinal['company_contact'] = this.listInfoPerusahaan[i]['nilai1']
        }
      } else {
        this.formInputValFinal['company_adress'] = ''
        this.formInputValFinal['company_city'] = ''
        this.formInputValFinal['company_contact'] = ''
      }

    }

    this.rptRecycleId = this.formInputValFinal.format_laporan
      + this.formInputValFinal.jenis_laporan
      + this.formInputValFinal.bentuk_laporan
      + this.formInputValFinal.tahun_periode
      + this.formInputValFinal.periode_from
      + this.formInputValFinal.periode_to
      + xCabang.toString()

    if (this.reportResultId[this.rptRecycleId] == undefined) {
      let reqData = Object.assign({
        kode_perusahaan: this.kodePerusahaan,
        nama_perusahaan: this.namaPerusahaan,
        user_name: localStorage.getItem('user_name') === undefined ? '' : localStorage.getItem('user_name')
      }, this.formInputValFinal)
      this.request.apiData('report', 'g-data-laba-rugi', reqData).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.ref.markForCheck()
            let reportResult = data['RESULT']
            if (this.formInputValFinal.format_laporan === 'pdf') {
              this.urlReport['pdf'] = reportResult['rep_url']
            } else {
              this.urlReport['sheets'] = reportResult['rep_url']
            }
            this.getReport('01', reportResult, this.urlReport)
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Data laporan tidak ditemukan.', 'fail')
            this.loading = false
          }
        }
      )
    } else {
      this.getReport('02', this.rptRecycleId, this.urlReport)
    }
  }

  getReport(type, res?, urlRpt?) {
    let useReportId = type == '01' ? res['rep_id'] : this.reportResultId[res]
    this.ref.markForCheck()
    if (this.formInputValFinal['format_laporan'] === 'pdf') {
      window.open(urlRpt['pdf'] + '?repId=' + useReportId, '_blank')
    } else {
      if (this.formInputValFinal['format_laporan'] === 'xlsx') {
        this.excelReportTypeId = useReportId + '.xlsx'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      } else {
        this.excelReportTypeId = useReportId + '.xls'
        setTimeout(() => {
          let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
          sbmBtn.click();
        }, 100)
      }
    }

    this.rptRecycleId = this.formInputValFinal.format_laporan
      + this.formInputValFinal.jenis_laporan
      + this.formInputValFinal.bentuk_laporan
      + this.formInputValFinal.tahun_periode
      + this.formInputValFinal.periode_from
      + this.formInputValFinal.periode_to
      + this.formInputValFinal['list_cabang'].toString()
    this.reportResultId[this.rptRecycleId] = res['rep_id']
    this.loading = false
  }

  onCancel() {
    this.formInputVal = {
      ekstensi_laporan: 'xlsx',
      jenis_laporan: '0',
      bentuk_laporan: '0',
      tahun_periode: this.periodeFix.tahunPeriodeMaks,
      dari_bulan: this.periodeFix.bulanPeriodeMin,
      sd_bulan: this.periodeFix.bulanPeriodeMaks
    }
    this.formInputCheckChanges()
    this.restructureDetailData('cabang', this.listAksesCabangDupl, 'default')
  }
  // ========== Custom Function ========== //
  dataSetFunc(datatype, dataContain) {

    if (datatype === 'data-periode') {
      let listTmp = [],
        unique = [],
        listDataUnique = []

      // List Unique 'Tahun Periode' 
      for (var i = 0; i < dataContain.length; i++) {
        if (unique[dataContain[i]['tahun_periode']]) continue;
        unique[dataContain[i]['tahun_periode']] = true;
        listTmp.push(dataContain[i]['tahun_periode'])
        listDataUnique.push({
          label: dataContain[i]['tahun_periode'],
          value: dataContain[i]['tahun_periode']
        });
      }
      this.tahunPeriodeCbx = listDataUnique

      // List Unique 'Bulan Periode'
      let listBulanTmp = {}
      for (var i = 0; i < listTmp.length; i++) {
        listBulanTmp[listTmp[i]] = []
        for (var j = 0; j < dataContain.length; j++) {
          if (dataContain[j]['tahun_periode'] === listTmp[i]) {
            unique[dataContain[j]['bulan_periode']] = true;
            listBulanTmp[listTmp[i]].push({
              label: dataContain[j]['bulan_periode'],
              value: dataContain[j]['bulan_periode']
            })
          }
        }
      }
      this.listAllBulanPeriode = listBulanTmp
      this.bulanPeriodeCbx = listBulanTmp[this.formInputVal.tahun_periode]
    } else if (datatype === 'change-data-periode') {
      this.bulanPeriodeCbx = dataContain
      let fromMonth = this.gbl.getBulanTerendah(this.listPeriodeTran, this.formInputVC.getData()['tahun_periode']),
        toMonth = this.gbl.getBulanTertinggi(this.listPeriodeTran, this.formInputVC.getData()['tahun_periode'])

      if (parseInt(this.formInputVC.getData()['dari_bulan']) < parseInt(fromMonth)) {
        this.formInputVC.updateFormValue('dari_bulan', fromMonth)
      }

      if (parseInt(this.formInputVC.getData()['sd_bulan']) < parseInt(toMonth)) {
        this.formInputVC.updateFormValue('sd_bulan', toMonth)
      }
    }

  }

  inputGroup(type?: any) {
    let input,
      data = [
        {
          type: type,
          title: type === 'kode_cabang' ? 'Data Cabang'
            : '',
          columns: type === 'kode_cabang' ? this.displayColCabangLov
            : '',
          contain: type === 'kode_cabang' ? this.listAksesCabang
            : '',
          rules: [],
          interface: {},
          statusSelectable: true,
          listSelectBox: type === 'kode_cabang' ? this.listSelectCabang :
            [],
          selectIndicator: type === 'kode_cabang' ? 'kode_cabang'
            : ''
        },
      ], setting = {
        width: '50vw',
        posTop: '30px'
      }
    input = this.gbl.openDialog(type, data, this.formInputVal, setting)

    input.afterClosed().subscribe(
      result => {
        if (result) {
          this.ref.markForCheck()
          if (type === 'kode_cabang') {
            this.restructureDetailData('cabang', result, 'change')
          }
        }
      }
    )
  }

  restructureDetailData(type, data, dataConf) {
    this.ref.markForCheck()
    let endRes = [],
      bindData = []

    if (type === 'cabang') {
      if (dataConf === 'default') {
        bindData = this.cabangUtama

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < bindData.length; j++) {
            if (data[i]['kode_cabang'] === bindData[j]['kode_cabang']) {
              let x = {
                id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
                  length: 8,
                  numeric: true,
                  letters: false,
                  special: false
                }))}`,
                kode_cabang: data[i]['kode_cabang'],
                nama_cabang: bindData[j]['nama_cabang']
              }
              endRes.push(x)
              break;
            }
          }
        }
        this.listSelectCabang = endRes
      } else {
        bindData = this.listSelectCabang

        for (var i = 0; i < data.length; i++) {
          for (var j = 0; j < bindData.length; j++) {
            if (data[i]['kode_cabang'] === bindData[j]['kode_cabang']) {
              data[i] = bindData[j]
            }
          }
        }
        bindData.splice(0, bindData.length)
        for (var i = 0; i < data.length; i++) {
          if (data[i]['id'] === '' || data[i]['id'] == null || data[i]['id'] === undefined) {
            data[i]['id'] = `${MD5(Date().toLocaleString() + Date.now() + randomString({
              length: 8,
              numeric: true,
              letters: false,
              special: false
            }))}`
          }
          bindData.push(data[i])
        }
        this.listSelectCabang = bindData
      }
    }
  }

  changeFormLayout(type, data?) {
    if (type === 'first') {
      this.formInputLyt.splice(4, 2,
        {
          formWidth: 'col-4',
          label: 'Tahun Periode',
          id: 'tahun-periode',
          type: 'combobox',
          options: this.tahunPeriodeCbx,
          valueOf: 'tahun_periode',
          required: false,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => {
            this.formInputVC.updateFormValue('tahun_periode', data)
            this.dataSetFunc('change-data-periode', this.listAllBulanPeriode[data])
          }
        },
        {
          formWidth: 'col-4',
          label: 'Bulan Periode',
          id: 'dari-bulan',
          valueOf: 'dari_bulan',
          type: 'combobox',
          options: this.bulanPeriodeCbx,
          required: false,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => {
            this.formInputVC.updateFormValue('dari_bulan', data)
            this.changeFormLayout('change-from-month', data)
          },

          // Combobox Option
          opt_input: true,
          opt_label: '',
          opt_id: 'sd-bulan',
          opt_valueOf: 'sd_bulan',
          opt_type: 'opt_combobox',
          opt_options: this.bulanPeriodeCbx,
          onSelectFuncOpt: (data) => {
            this.formInputVC.updateFormValue('sd_bulan', data)
            this.changeFormLayout('change-to-month', data)
          }
        }
      )
    } else if (type === 'change-from-month') {
      if (parseInt(data) > parseInt(this.formInputVC.getData().sd_bulan)) {
        this.formInputVC.updateFormValue('sd_bulan', this.formInputVC.getData().dari_bulan)
        this.gbl.openSnackBar('Periode Awal <= Periode Akhir', 'info')

        this.formInputLyt.splice(5, 1,
          {
            formWidth: 'col-4',
            label: 'Bulan Periode',
            id: 'dari-bulan',
            valueOf: 'dari_bulan',
            type: 'combobox',
            options: this.bulanPeriodeCbx,
            required: false,
            readOnly: false,
            disabled: false,
            onSelectFunc: (data) => {
              this.formInputVC.updateFormValue('dari_bulan', data)
              this.changeFormLayout('change-from-month', data)
            },

            // Combobox Option
            opt_input: true,
            opt_label: '',
            opt_id: 'sd-bulan',
            opt_valueOf: 'sd_bulan',
            opt_type: 'opt_combobox',
            opt_options: this.bulanPeriodeCbx,
            onSelectFuncOpt: (data) => {
              this.formInputVC.updateFormValue('sd_bulan', data)
              this.changeFormLayout('change-to-month', data)
            }
          }
        )
      }
    } else if (type === 'change-to-month') {
      if (parseInt(data) < parseInt(this.formInputVC.getData().dari_bulan)) {
        this.formInputVC.updateFormValue('sd_bulan', this.formInputVC.getData().dari_bulan)
        this.gbl.openSnackBar('Periode Akhir >= Periode Awal', 'info')

        this.formInputLyt.splice(5, 1,
          {
            formWidth: 'col-4',
            label: 'Bulan Periode',
            id: 'dari-bulan',
            valueOf: 'dari_bulan',
            type: 'combobox',
            options: this.bulanPeriodeCbx,
            required: false,
            readOnly: false,
            disabled: false,
            onSelectFunc: (data) => {
              this.formInputVC.updateFormValue('dari_bulan', data)
              this.changeFormLayout('change-from-month', data)
            },

            // Combobox Option
            opt_input: true,
            opt_label: '',
            opt_id: 'sd-bulan',
            opt_valueOf: 'sd_bulan',
            opt_type: 'opt_combobox',
            opt_options: this.bulanPeriodeCbx,
            onSelectFuncOpt: (data) => {
              this.formInputVC.updateFormValue('sd_bulan', data)
              this.changeFormLayout('change-to-month', data)
            }
          }
        )
      }
    }
  }

  setOptionalRequest() {
    let infoCompanySts = false, // Status Request Data
      reqData = Object.assign({ kode_perusahaan: this.kodePerusahaan }) // Set Request Parameter
    this.request.apiData('lookup', 'g-info-company', reqData).subscribe( // Request Informasi Perusahaan
      data => {
        if (data['STATUS'] == 'Y') {
          this.ref.markForCheck()
          this.listInfoPerusahaan = data['RESULT']
          infoCompanySts = true

          if (infoCompanySts) {
            this.actionData()
          }
        } else {
          this.gbl.openSnackBar('Data informasi perusahaan tidak ditemukan.', 'fail')
        }
      }
    )

    if (infoCompanySts) {
      this.actionData()
    }
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.formInputVC === undefined ? null : this.formInputVC.checkChanges()
    }, 1)
  }

}
