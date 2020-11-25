import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent, MatDialog, throwMatDialogContentAlreadyAttachedError } from '@angular/material';
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
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { isInteger } from 'lodash';

const content = {
  beforeCodeTitle: 'Otomatis Jurnal'
}

@Component({
  selector: 'kt-otomatis-jurnal',
  templateUrl: './otomatis-jurnal.component.html',
  styleUrls: ['./otomatis-jurnal.component.scss', '../transaksi.style.scss']
})
export class OtomatisJurnalComponent implements OnInit, AfterViewInit {

  // VIEW CHILD TO CALL FUNCTION
  @ViewChild(ForminputComponent, { static: false }) forminput;
  @ViewChild('rt', { static: false }) rt;
  @ViewChild('ht', { static: false }) ht;
  @ViewChild(DatatableAgGridComponent, { static: false }) datatable;

  tipe_laporan = [
    {
      label: 'Ya',
      value: '1'
    },
    {
      label: 'Tidak',
      value: '0'
    }
  ]

  // VARIABLES
  loading: boolean = true;
  detailJurnalLoad: boolean = false;
  tableLoadHT: boolean = false;
  tableLoadRT: boolean = false;
  loadingDataTextHT: string = "Loading Data Hasil Tarik Data.."
  loadingDataTextRT: string = "Loading Data Riwayat Tarik Data.."
  content: any;
  nama_tombol: any;
  onSub: boolean = false;
  // onButton: boolean = true;
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
      btnClick: () => {
        this.onSubmit()
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
    id: '',
    nama_setting: '',
    no_referensi: '',
    tgl_tran: '',
    nama_cabang: '',
    keterangan: '',
    jenis_transaksi: '0',
    jenis_jurnal: '',
    id_jenis_transaksi: '',
    nama_jenis_transaksi: '',
    nilai_jenis_transaksi: '',
    tipe_transaksi: '',
    saldo_transaksi: 0,
    tipe_laporan: '',
    lmbr_giro: 1
  }

  detailData = []

  umumInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'input',
      valueOf: 'jenis_transaksi',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: false
    },
    {
      formWidth: 'col-5',
      label: 'Nama Jurnal',
      id: 'nama-jurnal',
      type: 'input',
      valueOf: 'nama_setting',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: false
    },
    {
      formWidth: 'col-5',
      label: 'Referensi',
      id: 'no-referensi',
      type: 'input',
      valueOf: 'no_referensi',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true,
      hiddenOn: {
        valueOf: 'no_referensi',
        matchValue: ""
      }
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
      label: 'Keterangan',
      id: 'keterangan',
      type: 'input',
      valueOf: 'keterangan',
      required: false,
      readOnly: true,
      disabled: true
    }
  ]

  kasirInputLayout = [
    {
      formWidth: 'col-5',
      label: 'Jenis Jurnal',
      id: 'jenis-jurnal',
      type: 'input',
      valueOf: 'nama_setting',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: false
    },
    {
      formWidth: 'col-5',
      label: 'Referensi',
      id: 'no-referensi',
      type: 'input',
      valueOf: 'no_referensi',
      required: true,
      readOnly: true,
      disabled: true,
      inputPipe: true,
      hiddenOn: {
        valueOf: 'no_referensi',
        matchValue: ""
      }
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
      label: 'Jenis Transaksi',
      id: 'jenis-transaksi',
      type: 'inputgroup',
      valueOf: 'nama_jenis_transaksi',
      required: false,
      readOnly: true,
      disabled: true,
      inputInfo: {
        id: 'tipe-jenis-transaksi',
        disabled: true,
        readOnly: true,
        required: false,
        valueOf: 'nama_tipe_transaksi'
      },
    },
    {
      formWidth: 'col-5',
      label: 'Nilai Jenis Transaksi',
      id: 'nilai-jenis-transaksi',
      type: 'input',
      valueOf: 'nilai_jenis_transaksi',
      required: false,
      readOnly: true,
      disabled: true
    },
    {
      formWidth: 'col-5',
      label: 'Nilai Transaksi',
      id: 'nilai-transaksi',
      type: 'input',
      valueOf: 'saldo_transaksi',
      currency: true,
      required: false,
      disabled: true,
      readOnly: true,
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
      readOnly: true,
      disabled: true
    }
  ]

  // Data Hasil Tarik
  displayedColumnsTableHT = [
    {
      label: 'Jenis Jurnal',
      value: 'jenis_jurnal_sub'
    },
    {
      label: 'Nama Jurnal',
      value: 'nama_setting'
    },
    {
      label: 'No. Referensi',
      value: 'no_referensi'
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
      label: 'Keterangan',
      value: 'keterangan'
    }
  ];
  browseInterfaceHT = {}
  browseDataHT = []
  browseDataRulesHT = [
    {
      target: 'jenis_jurnal',
      replacement: {
        '0': 'Jurnal Umum',
        '1': 'Jurnal Kasir'
      },
      redefined: 'jenis_jurnal_sub'
    }
  ]
  jenisTransaksiData = {}

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
    tahun_periode: '',
    rekap_harian: '1',
    rekap_bulanan: '1',
    rekap_transaksi: '1'
  }

  // Layout Form
  inputLayout = [
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
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
      labelWidth: 'col-4',
      formWidth: 'col-7',
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
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Harian',
      id: 'rekap-harian',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_harian',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Bulanan',
      id: 'rekap-bulanan',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_bulanan',
      required: true,
      readOnly: false,
      disabled: false,
    },
    {
      labelWidth: 'col-4',
      formWidth: 'col-7',
      label: 'Rekap Transaksi',
      id: 'rekap-transaksi',
      type: 'combobox',
      options: this.tipe_laporan,
      valueOf: 'rekap_transaksi',
      required: true,
      readOnly: false,
      disabled: false,
    },
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
    this.gbl.need(true, true)
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
            this.gbl.periodeAktif(this.periode_aktif['id_periode'], this.periode_aktif['tahun_periode'], this.periode_aktif['bulan_periode'])
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

  //Browse binding event
  browseSelectRow(data) {
    let x = JSON.parse(JSON.stringify(data))
    this.formDetail = {
      id: x['id'],
      nama_setting: x['nama_setting'],      
      no_referensi: x['no_referensi'],
      tgl_tran: x['tgl_tran'],
      nama_cabang: x['nama_cabang'],
      keterangan: x['keterangan'],
      jenis_transaksi: x['jenis_jurnal'] === '0' ? "Jurnal Umum" : "Jurnal Kasir",
      jenis_jurnal: x['jenis_jurnal'] === '1' ? '2' : '0',
      id_jenis_transaksi: x['id_jenis_transaksi'],
      nama_jenis_transaksi: this.jenisTransaksiData[x['id_jenis_transaksi']] === undefined ? '' : this.jenisTransaksiData[x['id_jenis_transaksi']]['nama_jenis_transaksi'],
      nilai_jenis_transaksi: x['nilai_jenis_transaksi'],
      tipe_transaksi: x['tipe_transaksi'],
      saldo_transaksi: x['saldo_transaksi'],
      tipe_laporan: this.jenisTransaksiData[x['id_jenis_transaksi']] === undefined ? '' : this.jenisTransaksiData[x['id_jenis_transaksi']]['tipe_laporan'],
      lmbr_giro: x['lmbr_giro'] === undefined ? 1 : x['lmbr_giro']
    }
    this.openDialog()
  }

  refreshTab(message) {
    this.loading = false
    this.ref.markForCheck()
    this.onUpdate = false
    this.openSnackBar(message, 'success')
  }

  //Form submit
  onSubmit() {
    let valid = this.validateSubmit()
    if (valid === true) {
      this.loading = true
      this.ref.markForCheck()
      let endRes = {
        batch: "",
        kode_perusahaan: this.kode_perusahaan,
        id_periode: this.idPeriodeAktif,
        detail: this.browseDataHT
      }
      this.request.apiData('jurnal-otomatis', 'i-jurnal-otomatis', endRes).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.loading = false
            this.tableLoadRT = true
            this.browseDataHT = []
            this.browseDataRT = []
            this.ref.markForCheck()
            this.sendRequestRiwayat()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.gbl.topPage()
            this.openSnackBar('Gagal menyimpan jurnal. Mohon dicoba beberapa saat lagi.', 'fail')
          }
        }
      )
    } else {
      this.gbl.topPage()
      if (valid === 'nodata') {
        this.openSnackBar('Tidak ada hasil tarik data jurnal. Mohon tarik data terlebih dahulu', 'info')
      } else if (valid === 'nobalance') {
        this.openSnackBar('Nilai saldo jurnal ada yang tidak seimbang.', 'fail')
      }
    }
  }

  validateSubmit() {
    let valid: any = true

    for (var i = 0; i < this.browseDataHT.length; i++) {
      let dataI = this.browseDataHT[i],
        debit = 0,
        kredit = 0
      // for (var j = 0; j < dataI['detail'].length; j++) {
      //   if (dataI['detail'][j]['debit'] === true) {
      //     debit = debit + parseFloat(dataI['detail'][j]['saldo'])
      //   } else if (dataI['detail'][j]['debit'] === false) {
      //     kredit = kredit + parseFloat(dataI['detail'][j]['saldo'])
      //   }
      // }

      if (debit !== kredit) {
        valid = 'nobalance'
        break
      }
    }

    if (this.browseDataHT.length < 1) {
      valid = 'nodata'
    }

    return valid
  }

  //Reset Value
  resetForm() {
    this.gbl.topPage()
    this.tableLoadHT = true
    this.browseDataHT = []
    this.ref.markForCheck()
    setTimeout(() => {
      this.tableLoadHT = false
      this.ref.markForCheck()
    }, 500)
  }

  onCancel() {
    this.resetForm()
    this.ht == undefined ? null : this.ht.reset()
    this.rt == undefined ? null : this.rt.reset()
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

  openDialog() {
    let jres = [], temp = []
    for (var i = 0; i < this.browseDataHT.length; i++) {
      if (this.browseDataHT[i]['id'] === this.formDetail['id']) {
        for (var j = 0; j < this.browseDataHT[i]['detail'].length; j++) {
          let t = {
            id_akun: this.browseDataHT[i]['detail'][j]['id_akun'],
            kode_akun: this.browseDataHT[i]['detail'][j]['kode_akun'],
            nama_akun: this.browseDataHT[i]['detail'][j]['nama_akun'],
            keterangan_akun: this.browseDataHT[i]['detail'][j]['keterangan'],
            kode_divisi: this.browseDataHT[i]['detail'][j]['kode_divisi'],
            nama_divisi: this.browseDataHT[i]['detail'][j]['nama_divisi'],
            kode_departemen: this.browseDataHT[i]['detail'][j]['kode_departemen'],
            nama_departemen: this.browseDataHT[i]['detail'][j]['nama_departemen'],
            keterangan_1: this.browseDataHT[i]['detail'][j]['keterangan_1'],
            keterangan_2: this.browseDataHT[i]['detail'][j]['keterangan_2'],
            saldo_debit: parseFloat(this.browseDataHT[i]['detail'][j]['nilai_debit']),
            saldo_kredit: parseFloat(this.browseDataHT[i]['detail'][j]['nilai_kredit'])
          }
          temp.push(t)
        }
        break;
      }
    }
    if (this.formDetail.jenis_jurnal === "2") {
      if (this.formDetail.tipe_transaksi === "0") {
        jres = temp.filter(x => x['saldo_kredit'] > 0)
      } else {
        jres = temp.filter(x => x['saldo_debit'] > 0)
      }
    }else{
      jres = temp
    }
   
    this.gbl.screenPosition(340)
    this.ref.markForCheck()
    this.formInputCheckChangesJurnal()
    let kil = JSON.parse(JSON.stringify(this.kasirInputLayout))
    if (this.formDetail['jenis_transaksi'] === '1' && this.formDetail['tipe_laporan'] === 'g') {
      kil.splice(5, 0, {
        formWidth: 'col-5',
        label: 'Lembar Giro',
        id: 'lembar-giro',
        type: 'input',
        valueOf: 'lmbr_giro',
        currency: true,
        required: false,
        disabled: true,
        readOnly: true,
        update: {
          disabled: false
        }
      })
    }
    const dialogRef = this.dialog.open(InputdialogComponent, {
      width: 'auto',
      height: '60vh',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '330px' },
      data: {
        width: '90vw',
        formValue: this.formDetail,
        // inputLayout: this.formDetail['jenis_transaksi'] === '0' ? this.umumInputLayout : kil,
        inputLayout: this.umumInputLayout,
        buttonLayout: [],
        detailJurnal: true,
        detailLoad: false,
        jurnalData: jres,
        jurnalDataAkun: [],
        noEditJurnal: true,
        noButtonSave: true,
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        // onSubmit: (x: NgForm) => this.submitDetailData(this.formDetail),
        deleteData: () => null,
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.ht == undefined ? null : this.ht.reset()
      },
      error => null,
    );
  }

  // REQUEST DATA FROM API (to : L.O.V or Table)
  madeRequest() {
    this.formValue = {
      tgl_tarik: '',
      bulan_periode: this.nama_bulan_aktif,
      tahun_periode: this.tahunPeriodeAktif,
      rekap_harian: this.formValue.rekap_harian,
      rekap_bulanan: this.formValue.rekap_bulanan,
      rekap_transaksi: this.formValue.rekap_transaksi
    }
    this.loading = false
    this.sendRequestJenisTransaksi()
  }

  sendRequestJenisTransaksi() {
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('jenis-transaksi', 'g-jenis-transaksi', { kode_perusahaan: this.kode_perusahaan }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let res = {}
            for (var i = 0; i < data['RESULT'].length; i++) {
              res[data['RESULT'][i]['id_jenis_transaksi']] = data['RESULT'][i]
            }
            this.jenisTransaksiData = res

            this.sendRequestRiwayat()
          } else {
            this.loading = false
            this.ref.markForCheck()
            this.openSnackBar('Gagal mendapatkan data.', 'fail')
          }
        }
      )
    } else {
      this.loading = false
      this.ref.markForCheck()
      this.openSnackBar('Gagal mendapatkan data.', 'fail')
    }
  }

  sendRequestRiwayat() {
    this.tableLoadRT = true
    if ((this.kode_perusahaan !== undefined && this.kode_perusahaan !== "") && (this.periode_aktif.id_periode !== undefined && this.periode_aktif.id_periode !== "")) {
      this.request.apiData('jurnal-otomatis', 'g-tarik-data-terakhir', { kode_perusahaan: this.kode_perusahaan, id_periode: this.periode_aktif.id_periode }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            this.browseDataRT = data['RESULT']
            if (data['RESULT'].length > 0) {
              let dt = data['RESULT'][0]['input_dt'].split(" ")[0],
                st = dt.split("-"),
                y = st[0],
                m = st[1].replace("0", ""),
                d = st[2],
                edt = d + " " + this.gbl.getNamaBulan(m) + " " + y
              this.formValue.tgl_tarik = edt
              this.forminput.updateFormValue('tgl_tarik', edt)
            } else {
              this.formValue.tgl_tarik = "Belum pernah tarik"
              this.forminput.updateFormValue('tgl_tarik', "Belum pernah tarik")
            }
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
      this.formValue = this.forminput.getData()
      let periode = this.gbl.getTahunPeriodeAktif() + "-" + (this.gbl.getBulanPeriodeAktif().length > 1 ? this.gbl.getBulanPeriodeAktif() : "0" + this.gbl.getBulanPeriodeAktif())
      let tipe_setting = []
      if (this.formValue.rekap_transaksi === '1') {
        tipe_setting.push('2')
      }
      if (this.formValue.rekap_harian === '1') {
        tipe_setting.push('1')
      }
      if (this.formValue.rekap_bulanan === '1') {
        tipe_setting.push('0')
      }
      this.request.apiData('jurnal-otomatis', 'g-data-jurnal-otomatis', { kode_perusahaan: this.kode_perusahaan, periode: periode, tipe_setting: tipe_setting }).subscribe(
        data => {
          if (data['STATUS'] === 'Y') {
            let t = JSON.parse(JSON.stringify(data['RESULT'])),
                res = []
            if (data['RESULT'].length < 1) {
              this.openSnackBar('Semua transaksi pada periode aktif sudah tersimpan.', 'info')
            } else {
              for (var i = 0; i < t.length; i++) {
                let dt
                if (isInteger(t[i]['tgl_tran'])) {
                  let tdt = new Date(t[i]['tgl_tran'])
                  dt = tdt.getFullYear() + "-" + (JSON.stringify(tdt.getMonth() + 1).length < 2 ? ("0" + (JSON.stringify(tdt.getMonth() + 1))) : JSON.stringify(tdt.getMonth() + 1)) + "-" + (JSON.stringify(tdt.getDate()).length < 2 ? ("0" + (JSON.stringify(tdt.getDate()))) : JSON.stringify(tdt.getDate()))
                } else {
                  dt = t[i]['tgl_tran']
                }
                let d = {
                  id: `${MD5(Date().toLocaleString() + Date.now() + randomString({
                    length: 8,
                    numeric: true,
                    letters: false,
                    special: false
                  }))}`,
                  jenis_jurnal: t[i]['jenis_transaksi'],
                  tipe_transaksi: t[i]['tipe_transaksi'],
                  kode_setting: t[i]['kode_setting'],
                  nama_setting: t[i]['nama_setting'],
                  keterangan_setting: t[i]['keterangan_setting'],
                  no_referensi: t[i]['no_referensi'],
                  tgl_tran: dt,
                  kode_cabang: t[i]['kode_cabang'],
                  nama_cabang: t[i]['nama_cabang'],
                  keterangan: t[i]['keterangan'],
                  detail: JSON.parse(t[i]['detail'])
                }
                res.push(d)
              }
            }
            this.browseDataHT = res
            this.tableLoadHT = false
            this.ref.markForCheck()
          } else {
            this.tableLoadHT = false
            this.ref.markForCheck()
            this.openSnackBar('Data hasil tarik tidak ditemukan.', 'fail')
          }
        },
        err => {
          this.tableLoadHT = false
          this.ref.markForCheck()
          this.openSnackBar('Gagal mendapatkan hasil tarik data.', 'fail')
        }
      )
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
    }, 10)
  }

  formInputCheckChangesJurnal() {
    setTimeout(() => {
      this.ref.markForCheck()
      this.forminput === undefined ? null : this.forminput.checkChangesDetailJurnal()
    }, 1)
  }

}
