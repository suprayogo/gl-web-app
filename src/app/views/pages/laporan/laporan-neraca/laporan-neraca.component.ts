import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// REQUEST DATA FROM API
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// COMPONENTS
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { ForminputComponent } from '../../components/forminput/forminput.component';
import { DialogComponent } from '../../components/dialog/dialog.component';

const content = {
  beforeCodeTitle: 'Laporan Neraca'
}

@Component({
  selector: 'kt-laporan-neraca',
  templateUrl: './laporan-neraca.component.html',
  styleUrls: ['./laporan-neraca.component.scss', '../laporan.style.scss']
})
export class LaporanNeracaComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  tipe = [
    {
      label: 'Tahunan',
      value: 't'
    },
    {
      label: 'Bulanan',
      value: 'b'
    }
  ]

  format_laporan = [
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

  jenis_laporan = [
    {
      label: 'Rekap',
      value: '0'
    },
    {
      label: 'Perincian',
      value: '1'
    }
  ]

  // VARIABLES
  keyReportFormatExcel: any;
  nama_tombol: any;
  onSub: boolean = false;
  loading: boolean = true;
  loadingNR: boolean = false;
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
  dialogRef: any;
  dialogType: string = null;
  cabang_utama: any;

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

  // PERIODE
  inputPeriodeData = [];
  submitPeriodeData = [];
  activePeriod = {};
  tahun: any = [];
  initBulan: any = [];
  bulanNR: any = [];

  // GLOBAL VARIABLE PERUSAHAAN
  subscription: any;
  kode_perusahaan: any;

  // Input Name
  formValueNR = {
    format_laporan: 'xlsx',
    jenis_laporan: '0',
    kode_cabang: '',
    nama_cabang: '',
    tahun: '',
    bulan: '',
    periode_berjarak: ''
  }

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

  // Layout Form
  inputLayoutNR = [
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Format Laporan',
      id: 'format-laporan',
      type: 'combobox',
      options: this.format_laporan,
      valueOf: 'format_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Jenis Laporan',
      id: 'jenis-laporan',
      type: 'combobox',
      options: this.jenis_laporan,
      valueOf: 'jenis_laporan',
      required: true,
      readOnly: false,
      disabled: false,
    },
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
      required: true,
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
        disabled: true
      }
    },
    {
      // labelWidth: 'col-4',
      formWidth: 'col-5',
      label: 'Tahun Periode',
      id: 'tahun-periode',
      type: 'combobox',
      options: this.tahun,
      onSelectFunc: (filterBulan) => this.getBulan(filterBulan, ''),
      valueOf: 'tahun',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      formWidth: 'col-5',
      label: 'Bulan Periode',
      id: 'bulan-periode',
      type: 'combobox',
      options: this.bulanNR,
      valueOf: 'bulan',
      required: true,
      readOnly: false,
      disabled: false,
      onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

      // Combobox Options
      opt_input: true,
      opt_label: 'Periode Berjarak',
      opt_id: 'periode-berjarak',
      opt_type: 'opt_combobox',
      opt_options: this.bulanNR,
      opt_valueOf: 'periode_berjarak',
      onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
    }
  ]
  
  checkKeyReport = {}

  constructor(
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
    private request: RequestDataService,
    private gbl: GlobalVariableService
  ) { }

  ngOnInit() {
    this.content = content // <-- Init the content
    this.nama_tombol = 'Lihat Laporan'
    this.gbl.need(true, true)
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

  //Form submit
  onSubmitNR(inputForm: NgForm) {
    if (this.forminput !== undefined) {
      this.formValueNR = this.forminput.getData()
      this.loading = true
      this.ref.markForCheck()
      let rk = this.formValueNR['tahun'] + this.formValueNR['bulan'] + this.formValueNR['periode_berjarak'] + this.formValueNR['kode_cabang'] + this.formValueNR['format_laporan'] + this.formValueNR['jenis_laporan']
      if (this.checkKeyReport[rk] !== undefined) {
        if (this.formValueNR['format_laporan'] === 'pdf') {
          window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + this.checkKeyReport[rk], "_blank")
        } else {
          if (this.formValueNR['format_laporan'] === 'xlsx') {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xlsx'
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          } else {
            this.keyReportFormatExcel = this.checkKeyReport[rk] + '.xls'
            setTimeout(() => {
              let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
              sbmBtn.click();
            }, 100)
          }
        }
        this.loading = false
        this.ref.markForCheck()
      } else {
        let p = {}
        for (var i = 0; i < this.submitPeriodeData.length; i++) {
          if (
            (typeof this.formValueNR.bulan === "number" ? JSON.stringify(this.formValueNR.bulan) : this.formValueNR.bulan) === JSON.stringify(this.submitPeriodeData[i]['bulan_periode']) && 
            (typeof this.formValueNR.tahun === "number" ? JSON.stringify(this.formValueNR.tahun) : this.formValueNR.tahun) === JSON.stringify(this.submitPeriodeData[i]['tahun_periode'])
          ) {
            p = JSON.parse(JSON.stringify(this.submitPeriodeData[i]))
            break
          }
        }

        if (p['id_periode'] !== undefined) {
          p['kode_report'] = this.formValueNR['format_laporan']
          p['jenis_laporan'] = this.formValueNR['jenis_laporan']
          p['kode_perusahaan'] = this.kode_perusahaan
          p['bulan_periode'] = p['bulan_periode'].length > 1 ? p['bulan_periode'] : "0" + p['bulan_periode']
          p['periode_berjarak'] = +this.formValueNR.periode_berjarak.length > 1 ? this.formValueNR.periode_berjarak : "0" + this.formValueNR.periode_berjarak
          p['tahun_periode'] = JSON.stringify(p['tahun_periode'])
          p['kode_cabang'] = this.formValueNR['kode_cabang'] === "" ? undefined : this.formValueNR['kode_cabang']
          p['id_akun'] = this.formValueNR['id_akun'] === "" ? undefined : this.formValueNR['id_akun']
          this.request.apiData('report', 'g-data-neraca', p).subscribe(
            data => {
              if (data['STATUS'] === 'Y') {
                let idata = data['RESULT'], d = [], res = [], totalTipe = {}, totalKategori = {}
                // let nd = JSON.parse(idata['NR']), ld = JSON.parse(idata['LBRG']), saldo_lr = 0
                // for (var i = 0; i < ld.length; i++) {
                //   if (ld[i]['tipe_laporan'] === 'p') {
                //     saldo_lr = saldo_lr + parseFloat(ld[i]['saldo'])
                //   }

                //   if (ld[i]['tipe_laporan'] === 'b') {
                //     saldo_lr = saldo_lr - parseFloat(ld[i]['saldo'])
                //   }
                // }
                // d = d.concat(nd)
                // d.push({
                //   tahun: nd.length > 0 ? nd[0]['tahun'] : "",
                //   bulan: nd.length > 0 ? nd[0]['bulan'] : "",
                //   group_besar: "ke",
                //   nama_group_besar: "Kewajiban & Ekuitas",
                //   group: "EKUITAS",
                //   nama_group: "Ekuitas",
                //   id_akun: "",
                //   kode_akun: "LBRG",
                //   nama_akun: "Laba Rugi",
                //   tipe_akun: "0",
                //   id_kategori_akun: "lbrg",
                //   nama_kategori_akun: "Laba Rugi",
                //   saldo_akhir: JSON.stringify(saldo_lr)
                // })
                // for (var i = 0; i < d.length; i++) {
                //   if (totalTipe[d[i]['group']]) {
                //     totalTipe[d[i]['group']] = totalTipe[d[i]['group']] + parseFloat(d[i]['saldo_akhir'])
                //   } else {
                //     totalTipe[d[i]['group']] = parseFloat(d[i]['saldo_akhir'])
                //   }

                //   if (totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']]) {
                //     totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] = totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] + parseFloat(d[i]['saldo_akhir'])
                //   } else {
                //     totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']] = parseFloat(d[i]['saldo_akhir'])
                //   }

                //   if (d[i]['group'] === "AKTIVA-LANCAR" || d[i]['group'] === "AKTIVA-TETAP") {
                //     if (d[i]['group'] === "AKTIVA-LANCAR") {
                //       d[i]['nama_group'] = "Aktiva Lancar"
                //     } else if (d[i]['group'] === "AKTIVA-TETAP") {
                //       d[i]['nama_group'] = "Aktiva Tetap"
                //     }
                //     d[i]['group_besar'] = "ak"
                //     d[i]['nama_group_besar'] = "Aktiva"
                //   }

                //   if (d[i]['group'] === "KEWAJIBAN" || d[i]['group'] === "EKUITAS") {
                //     if (d[i]['group'] === "KEWAJIBAN") {
                //       d[i]['nama_group'] = "Kewajiban"
                //     } else if (d[i]['group'] === "EKUITAS") {
                //       d[i]['nama_group'] = "Ekuitas"
                //     }
                //     d[i]['group_besar'] = "ke"
                //     d[i]['nama_group_besar'] = "Kewajiban & Ekuitas"
                //   }

                //   if (d[i]['group'] === "AKTIVA-LANCAR") {
                //     d[i]['urutan'] = 1
                //   }

                //   if (d[i]['group'] === "AKTIVA-TETAP") {
                //     d[i]['urutan'] = 2
                //   }

                //   if (d[i]['group'] === "KEWAJIBAN") {
                //     d[i]['urutan'] = 3
                //   }

                //   if (d[i]['group'] === "EKUITAS") {
                //     d[i]['urutan'] = 4
                //   }
                // }

                // for (var i = 1; i < d.length; i++) {
                //   if (d[i - 1]['group'] === 'KEWAJIBAN' && d[i]['group'] === 'EKUITAS') {
                //     d.splice(i, 0, {
                //       tahun: nd.length > 0 ? nd[0]['tahun'] : "",
                //       bulan: nd.length > 0 ? nd[0]['bulan'] : "",
                //       group_besar: "ke",
                //       nama_group_besar: "Kewajiban & Ekuitas",
                //       group: "EKUITAS",
                //       nama_group: "Ekuitas",
                //       id_akun: "",
                //       kode_akun: "LBRG",
                //       nama_akun: "Laba Rugi",
                //       tipe_akun: "0",
                //       id_kategori_akun: "lbrg",
                //       nama_kategori_akun: "Laba Rugi",
                //       saldo_akhir: JSON.stringify(saldo_lr),
                //       urutan: 4
                //     })
                //     totalKategori["lbrg-EKUITAS"] = parseFloat(JSON.stringify(saldo_lr))
                //   }
                // }
                // let totalAktiva = totalTipe['AKTIVA-LANCAR'] + totalTipe['AKTIVA-TETAP'],
                //   totalKE = totalTipe['KEWAJIBAN'] + totalTipe['EKUITAS'] + saldo_lr
                
                // d.sort(function(a, b) {
                //   return a['urutan'] - b['urutan']
                // })

                // for (var i = 0; i < d.length; i++) {
                //   let t = []

                //   t.push(d[i]['group_besar'])
                //   t.push(d[i]['nama_group_besar'])
                //   t.push(d[i]['group'])
                //   t.push(d[i]['nama_group'])
                //   t.push(d[i]['id_kategori_akun'])
                //   t.push(d[i]['nama_kategori_akun'])
                //   t.push(d[i]['kode_akun'])
                //   t.push(d[i]['nama_akun'])
                //   t.push(parseFloat(d[i]['saldo_akhir']))
                //   t.push(totalKategori[d[i]['id_kategori_akun'] + "-" + d[i]['group']])
                //   t.push(totalTipe[d[i]['group']])
                //   t.push(d[i]['group_besar'] === "ak" ? (totalAktiva == null || totalAktiva === undefined || isNaN(totalAktiva) ? 0 : totalAktiva) : (totalKE == null || totalKE === undefined || isNaN(totalKE) ? 0 : totalKE))

                //   res.push(t)
                // }

                // res.sort(function (a, b) {
                //   if (a[0] < b[0] || a[2] < b[2]) {
                //     return -1;
                //   }

                //   if (a[0] > b[0] || a[2] > b[2]) {
                //     return 1;
                //   }

                //   return 0;
                // })

                // Check range or not
                // let repPeriod;

                // if(p['bulan_periode'] === p['periode_berjarak']){
                //   repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode']
                // }else{
                //   repPeriod = "Periode: " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['bulan_periode']))) + " " + p['tahun_periode'] + " - " + this.gbl.getNamaBulan(JSON.stringify(parseInt(p['periode_berjarak']))) + " " + p['tahun_periode'] 
                // }

                // // Set Report
                // let rp = JSON.parse(JSON.stringify(this.reportObj))
                // rp['REPORT_COMPANY'] = this.gbl.getNamaPerusahaan()
                // rp['REPORT_CODE'] = 'RPT-NERACA'
                // rp['REPORT_NAME'] = 'Laporan Neraca'
                // rp['REPORT_FORMAT_CODE'] = this.formValueNR['format_laporan']
                // rp['JASPER_FILE'] = 'rptNeraca.jasper'
                // rp['REPORT_PARAMETERS'] = {
                //   USER_NAME: localStorage.getItem('user_name') === undefined ? "" : localStorage.getItem('user_name'),
                //   REPORT_COMPANY_ADDRESS: this.info_company.alamat,
                //   REPORT_COMPANY_CITY: this.info_company.kota,
                //   REPORT_COMPANY_TLPN: this.info_company.telepon,
                //   REPORT_PERIODE: repPeriod
                // }
                // rp['FIELD_TITLE'] = [
                //   "Tipe Besar",
                //   "Nama Tipe Besar",
                //   "Tipe",
                //   "Nama Tipe",
                //   "Kategori Akun",
                //   "Nama Kategori Akun",
                //   "Kode Akun",
                //   "Nama Akun",
                //   "Saldo",
                //   "Total Kategori",
                //   "Total Tipe",
                //   "Total Tipe Besar"
                // ]
                // rp['FIELD_NAME'] = [
                //   "tipeBesar",
                //   "namaTipeBesar",
                //   "tipe",
                //   "namaTipe",
                //   "kategoriAkun",
                //   "namaKategoriAkun",
                //   "kodeAkun",
                //   "namaAkun",
                //   "saldo",
                //   "totalKategori",
                //   "totalTipe",
                //   "totalTipeBesar"
                // ]
                // rp['FIELD_TYPE'] = [
                //   "string",
                //   "string",
                //   "string",
                //   "string",
                //   "string",
                //   "string",
                //   "string",
                //   "string",
                //   "bigdecimal",
                //   "bigdecimal",
                //   "bigdecimal",
                //   "bigdecimal"
                // ]
                // rp['FIELD_DATA'] = res
                // p['bulan_periode'] = +p['bulan_periode']
                // p['periode_berjarak'] = +p['periode_berjarak']

                this.sendGetReport(idata, this.formValueNR['format_laporan'])
              } else {
                p['bulan_periode'] = +p['bulan_periode']
                p['periode_berjarak'] = +p['periode_berjarak']
                this.gbl.openSnackBar('Gagal mendapatkan data neraca.', 'fail')
                this.distinctPeriode()
                this.ref.markForCheck()
              }
            }
          )
        }
      }

    }
  }

  //Reset Value
  resetFormNR() {
    this.formValueNR = {
      format_laporan: 'xlsx',
      jenis_laporan: '0',
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tahun: this.activePeriod['tahun_periode'],
      bulan: this.activePeriod['bulan_periode'],
      periode_berjarak: this.activePeriod['bulan_periode']
    }

    this.bulanNR = this.initBulan[this.formValueNR['tahun']]
    this.inputLayoutNR.splice(4, 2,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNR,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanNR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )

    this.loadingNR = true
    this.ref.markForCheck()

    setTimeout(() => {
      this.loadingNR = false
      this.ref.markForCheck()
    }, 1000)
  }

  onCancel() {
    this.resetFormNR()
  }

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
        formValue: this.formValueNR
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (type === "kode_cabang") {
          if (this.forminput !== undefined) {
            this.forminput.updateFormValue('kode_cabang', result.kode_cabang)
            this.forminput.updateFormValue('nama_cabang', result.nama_cabang)
          }
        }
        this.ref.markForCheck();
      }
    });
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    if (this.kode_perusahaan !== '' && this.kode_perusahaan != null && this.kode_perusahaan !== undefined) {
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
            this.gbl.openSnackBar('Gagal mendapatkan informasi perusahaan.', 'success')
          }
        }
      )

      this.request.apiData('cabang', 'g-cabang-akses').subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputCabangData = data['RESULT']
            this.ref.markForCheck()
          } else {
            this.gbl.openSnackBar('Gagal mendapatkan daftar cabang. Mohon coba lagi nanti.', 'fail')
            this.ref.markForCheck()
          }
        }
      )

      this.request.apiData('periode', 'g-periode', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.inputPeriodeData = data['RESULT']
            this.submitPeriodeData = Array.from(data['RESULT'])
            if (this.inputPeriodeData.length > 0) {
              this.activePeriod = this.inputPeriodeData.filter(x => x.aktif === '1')[0] || {}
            }
            this.distinctPeriode()
            this.ref.markForCheck()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.openSnackBar('Gagal mendapatkan periode. Mohon coba lagi nanti', 'fail')
          }
        }
      )
    }
  }

  refreshBrowse(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.gbl.openSnackBar(message, 'success')
  }

  sendGetReport(p, type) {
    this.request.apiData('report', 'g-report', p).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          if (type === 'pdf') {
            window.open("http://deva.darkotech.id:8702/logis/viewer.html?repId=" + data['RESULT'], "_blank");
          } else {
            if (type === 'xlsx') {
              this.keyReportFormatExcel = data['RESULT'] + '.xlsx'
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            } else {
              this.keyReportFormatExcel = data['RESULT'] + '.xls'
              setTimeout(() => {
                let sbmBtn: HTMLElement = document.getElementById('fsubmit') as HTMLElement;
                sbmBtn.click();
              }, 100)
            }
          }
          let rk = this.formValueNR['tahun'] + this.formValueNR['bulan'] + this.formValueNR['periode_berjarak'] + this.formValueNR['kode_cabang'] + this.formValueNR['format_laporan'] + this.formValueNR['jenis_laporan']
          this.checkKeyReport[rk] = data['RESULT']
          this.distinctPeriode()
          this.ref.markForCheck()
        } else {
          this.gbl.topPage()
          this.gbl.openSnackBar('Gagal mendapatkan laporan. Mohon dicoba lagi nanti.', 'fail')
          this.distinctPeriode()
          this.ref.markForCheck()
        }
      }
    )
  }

  formInputCheckChanges() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChanges()
      // this.forminput === undefined ? null : this.forminput.checkChangesDetailInput()
    }, 1)
  }

  //Date Functions
  getDateNow() {
    // let d = this.gbl.getTahunPeriode() + "-" + this.gbl.getBulanPeriode() + "-01"
    let p = new Date().getTime()
    return p
  }

  reverseConvertTime(data) {
    let date = new Date(data)

    return JSON.stringify(date.getTime())
  }

  distinctPeriode() {
    // Variable
    let akses_cabang = JSON.parse(JSON.stringify(this.inputCabangData)),
      x = [];

    // Cabang Utama User
    this.cabang_utama = akses_cabang.filter(x => x.cabang_utama_user === 'true')[0] || {}

    var flags = [],
      outputTahun = [];

    for (var i = 0; i < this.inputPeriodeData.length; i++) {
      if (flags[this.inputPeriodeData[i]['tahun_periode']]) continue;
      flags[this.inputPeriodeData[i]['tahun_periode']] = true;
      x.push(this.inputPeriodeData[i]['tahun_periode'])
      outputTahun.push({
        label: this.inputPeriodeData[i]['tahun_periode'],
        value: this.inputPeriodeData[i]['tahun_periode']
      });
    }

    let tmp = {}
    for (var i = 0; i < x.length; i++) {
      tmp[x[i]] = []
      for (var j = 0; j < this.inputPeriodeData.length; j++) {

        if (this.inputPeriodeData[j]['tahun_periode'] === x[i]) {
          flags[this.inputPeriodeData[j]['bulan_periode']] = true;
          tmp[x[i]].push({
            label: this.inputPeriodeData[j]['bulan_periode'],
            value: this.inputPeriodeData[j]['bulan_periode']
          })
        }
      }

    }

    // Tahun Data
    this.tahun = outputTahun

    this.formValueNR = {
      format_laporan: this.formValueNR.format_laporan,
      jenis_laporan: this.formValueNR.jenis_laporan,
      kode_cabang: this.cabang_utama.kode_cabang,
      nama_cabang: this.cabang_utama.nama_cabang,
      tahun: this.formValueNR.tahun === "" ? this.activePeriod['tahun_periode'] : this.formValueNR.tahun,
      bulan: this.formValueNR.bulan === "" ? this.activePeriod['bulan_periode'] : this.formValueNR.bulan,
      periode_berjarak: this.formValueNR.periode_berjarak === "" ? this.activePeriod['bulan_periode'] : this.formValueNR.periode_berjarak
    }
    this.initBulan = tmp
    this.bulanNR = tmp[this.formValueNR.tahun]
    this.inputLayoutNR.splice(0, 5,
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Format Laporan',
        id: 'format-laporan',
        type: 'combobox',
        options: this.format_laporan,
        valueOf: 'format_laporan',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Jenis Laporan',
        id: 'jenis-laporan',
        type: 'combobox',
        options: this.jenis_laporan,
        valueOf: 'jenis_laporan',
        required: true,
        readOnly: false,
        disabled: false,
      },
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
        required: true,
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
          disabled: true
        }
      },
      {
        // labelWidth: 'col-4',
        formWidth: 'col-5',
        label: 'Tahun Periode',
        id: 'tahun-periode',
        type: 'combobox',
        options: this.tahun,
        onSelectFunc: (filterBulan) => this.getBulan(filterBulan, tmp),
        valueOf: 'tahun',
        required: true,
        readOnly: false,
        disabled: false,
      },
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNR,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanNR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      },
    )
    if (this.loading === true) {
      //Check On Blur Data
      this.ref.markForCheck()
      this.gbl.updateInputdata(this.inputCabangData, 'kode_cabang', this.inputLayoutNR)
      // this.gbl.updateInputdata(this.inputAkunData, 'kode_akun', this.inputLayoutNR)

      this.loading = false
    }
  }

  getBulan(filterBulan, loopBulan) {
    this.formValueNR = {
      format_laporan: this.formValueNR['format_laporan'],
      jenis_laporan: this.formValueNR['jenis_laporan'],
      kode_cabang: this.formValueNR['kode_cabang'],
      nama_cabang: this.formValueNR['nama_cabang'],
      tahun: filterBulan,
      bulan: "",
      periode_berjarak: ""
    }
    this.bulanNR = loopBulan[filterBulan]
    this.inputLayoutNR.splice(4, 2,
      {
        formWidth: 'col-5',
        label: 'Bulan Periode',
        id: 'bulan-periode',
        type: 'combobox',
        options: this.bulanNR,
        valueOf: 'bulan',
        required: true,
        readOnly: false,
        disabled: false,
        onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

        // Combobox Options
        opt_input: true,
        opt_label: 'Periode Berjarak',
        opt_id: 'periode-berjarak',
        opt_type: 'opt_combobox',
        opt_options: this.bulanNR,
        opt_valueOf: 'periode_berjarak',
        onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
      }
    )
    setTimeout(() => {
      this.ref.markForCheck()
      // this.forminputNR.checkChanges()
    }, 1)
  }

  checkRangeFirstPeriod(data) {
    if (+data > +this.forminput.getData()['periode_berjarak']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueNR.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutNR.splice(4, 2,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNR,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

          // Combobox Options
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanNR,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }

  checkRangeLastPeriod(data) {
    if (+data < +this.forminput.getData()['bulan']) {
      this.gbl.openSnackBar('Atur batas atas periode lebih besar dari batas bawah periode !', 'info')
      this.formValueNR.periode_berjarak = this.forminput.getData()['bulan']
      this.forminput.getData()['periode_berjarak'] = this.forminput.getData()['bulan']

      this.inputLayoutNR.splice(4, 2,
        {
          formWidth: 'col-5',
          label: 'Bulan Periode',
          id: 'bulan-periode',
          type: 'combobox',
          options: this.bulanNR,
          valueOf: 'bulan',
          required: true,
          readOnly: false,
          disabled: false,
          onSelectFunc: (data) => this.checkRangeFirstPeriod(data),

          // Checkbox
          opt_input: true,
          opt_label: 'Periode Berjarak',
          opt_id: 'periode-berjarak',
          opt_type: 'opt_combobox',
          opt_options: this.bulanNR,
          opt_valueOf: 'periode_berjarak',
          onSelectFuncOpt: (data) => this.checkRangeLastPeriod(data),
        }
      )

      this.ref.markForCheck()
    }
  }
}
