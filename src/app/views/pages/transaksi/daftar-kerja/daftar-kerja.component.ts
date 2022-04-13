import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { NgForm } from '@angular/forms';

// Custom Service
import { RequestDataService } from '../../../../service/request-data.service';
import { GlobalVariableService } from '../../../../service/global-variable.service';

// Custom Component
import { DatatableAgGridComponent } from '../../components/datatable-ag-grid/datatable-ag-grid.component';
import { InputdialogComponent } from '../../components/inputdialog/inputdialog.component';
import { ConfirmationdialogComponent } from '../../components/confirmationdialog/confirmationdialog.component';

@Component({
  selector: 'kt-daftar-kerja',
  templateUrl: './daftar-kerja.component.html',
  styleUrls: ['./daftar-kerja.component.scss', '../transaksi.style.scss']
})
export class DaftarKerjaComponent implements OnInit, AfterViewInit {
  // View Child List
  @ViewChild(DatatableAgGridComponent, { static: false }) dataTableVC

  // Others Variable
  loading: boolean = true // Loading Menu
  subsMenu: any; // Subscription Menu
  kodePerusahaan: string = '' // [Global Variable] Kode Perusahaan
  namaPerusahaan: string = '' // [Global Variable] Nama Perusahaan
  listPBPK: any = [] // [Request Data] Pengajuan Buka Periode Kasir
  stsReqPBPK: boolean = false // [Status Request Data] Pengajuan Buka Periode Kasir
  listPBJ: any = [] // [Request Data] Pengajuan Batal Jurnal
  stsReqPBJ: boolean = false // [Status Request Data] Pengajuan Batal Jurnal
  kodeTranPBPK = 'TRAN-PBPK'
  kodeTranPBJ = 'TRAN-PBJ'

  // Form Input Value Variable
  formInputVal = {
    // Auto Set
    id_worklist: '',
    kode_approval: '',
    nama_approval: '',
    no_tran: '',
    keterangan: '',
    user_id: '',
    // Manual Set
    status_approval: '',
    catatan: '',
  }
  formViewVal: any = {}

  // Form Input Layout Variable
  formInputLyt: any = []

  // Data Table Variable
  tableColumn = [
    {
      label: 'Tanggal',
      value: 'tanggal',
      date: true
    },
    {
      label: 'Nama Approval',
      value: 'nama_wl'
    },
    {
      label: 'Deskripsi',
      value: 'keterangan'
    },
    {
      label: 'Dari User',
      value: 'dari_user_name'
    }
  ]
  tableContain = []
  tableRule = []

  detailTableColumn = [
    {
      label: 'Tanggal Periode',
      value: 'tgl_periode',
      date: true
    }
  ]
  detailTableContain = []

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

  setPreparation(pesan?: string) {
    if (this.kodePerusahaan != '') {
      this.request.apiData('worklist', 'g-worklist', { kode_perusahaan: this.kodePerusahaan }).subscribe(
        data => {
          if (data['STATUS'] == 'Y') {
            this.ref.markForCheck()
            this.tableContain = data['RESULT']
            this.loading = false
            if (pesan != undefined) {
              this.gbl.openSnackBar(pesan, 'success')
            }
          } else {
            this.ref.markForCheck()
            this.gbl.openSnackBar('Data worklist tidak ditemukan.', 'fail')
            this.loading = false
          }
        }
      )
    }
  }

  setOptionalRequest(type, mandatoryData) {
    let reqData // Set Request Parameter
    if (type == this.kodeTranPBPK) { // Pengajuan Buka Periode Kasir
      if (!this.stsReqPBPK) { // Need Request or Not
        reqData = Object.assign({
          kode_perusahaan: this.kodePerusahaan,
          approval_status: 'IP'
        })
        this.request.apiData('worklist', 'g-wl-tran-pbpk', reqData).subscribe(
          data => {
            if (data['STATUS'] == 'Y') {
              this.ref.markForCheck()
              this.listPBPK = data['RESULT']
              this.stsReqPBPK = true
              if (this.stsReqPBPK) {
                this.setContent(type, mandatoryData)
              }
            } else {
              this.gbl.openSnackBar('Data pengajuan buka kasir tidak ditemukan.', 'fail')
            }
          }
        )
      } else {
        this.setContent(type, mandatoryData)
      }
    } else if (type == this.kodeTranPBJ) {
      if (!this.stsReqPBJ) { // Need Request or Not
        reqData = Object.assign({
          kode_perusahaan: this.kodePerusahaan,
          approval_status: 'IP'
        })
        this.request.apiData('worklist', 'g-wl-tran-pbj', reqData).subscribe(
          data => {
            if (data['STATUS'] == 'Y') {
              this.ref.markForCheck()
              this.listPBJ = data['RESULT']
              this.stsReqPBJ = true
              if (this.stsReqPBJ) {
                this.setContent(type, mandatoryData)
              }
            } else {
              this.gbl.openSnackBar('Data pengajuan buka kasir tidak ditemukan.', 'fail')
            }
          }
        )
      } else {
        this.setContent(type, mandatoryData)
      }
    }
  }

  selectRowData(data) {
    let get = JSON.parse(JSON.stringify(data))
    this.ref.markForCheck()
    if (get.kode_wl == 'APP-PENGAJUAN-BPK') {
      this.setOptionalRequest(this.kodeTranPBPK, get) // Pengajuan Buka Periode Kasir
    } else if (get.kode_wl == 'APP-PENGAJUAN-BTL-JURNAL') {
      this.setOptionalRequest(this.kodeTranPBJ, get) // Pengajuan Batal Jurnal
    }
  }

  setContent(type, get) {
    // Set Mandatory Value
    this.formInputVal.id_worklist = get.id
    this.formInputVal.kode_approval = get.kode_wl
    this.formInputVal.nama_approval = get.nama_wl
    this.formInputVal.no_tran = get.no_tran
    this.formInputVal.keterangan = get.keterangan
    this.formInputVal.user_id = localStorage.getItem('user_id')

    // Set View Data Value
    this.formViewVal = {}
    this.detailTableContain = []
    let duplDataWL, // Duplicate Data Worklist (Daftar Kerja)
      dataDetail = []
    if (type == this.kodeTranPBPK) {
      duplDataWL = JSON.parse(JSON.stringify(this.listPBPK))
      for (var i = 0; i < duplDataWL.length; i++) {
        if (this.formInputVal.no_tran == duplDataWL[i]['no_tran']) {
          this.formViewVal['id_tran'] = duplDataWL[i]['id_tran']
          this.formViewVal['no_tran'] = duplDataWL[i]['no_tran']
          this.formViewVal['tgl_tran'] = this.gbl.splitDate(duplDataWL[i]['tgl_tran'], 'D-M-Y')
          this.formViewVal['kode_cabang'] = duplDataWL[i]['kode_cabang']
          this.formViewVal['nama_cabang'] = duplDataWL[i]['nama_cabang']
          this.formViewVal['info_cabang'] = duplDataWL[i]['kode_cabang'] + ' - ' + duplDataWL[i]['nama_cabang']
          this.formViewVal['keterangan'] = this.formInputVal.keterangan
          this.formViewVal['catatan'] = ''
          let x = {
            id_periode: duplDataWL[i]['id_periode'],
            tgl_periode: duplDataWL[i]['tgl_periode'],
          }
          dataDetail.push(x)
          this.formViewVal['detail'] = dataDetail
        }
        this.detailTableContain = this.formViewVal['detail']
      }
      this.setLayout(type)
    } else if (type == this.kodeTranPBJ) {
      duplDataWL = JSON.parse(JSON.stringify(this.listPBJ))
      for (var i = 0; i < duplDataWL.length; i++) {
        if (this.formInputVal.no_tran == duplDataWL[i]['no_tran']) {
          this.formViewVal['id_tran'] = duplDataWL[i]['id_tran']
          this.formViewVal['no_tran'] = duplDataWL[i]['no_tran']
          this.formViewVal['tgl_tran'] = this.gbl.splitDate(duplDataWL[i]['tgl_tran'], 'D-M-Y')
          this.formViewVal['kode_cabang'] = duplDataWL[i]['kode_cabang']
          this.formViewVal['nama_cabang'] = duplDataWL[i]['nama_cabang']
          this.formViewVal['info_cabang'] = duplDataWL[i]['kode_cabang'] + ' - ' + duplDataWL[i]['nama_cabang']
          this.formViewVal['keterangan'] = this.formInputVal.keterangan
          this.formViewVal['catatan'] = ''
          // Secondary Variable
          // Kasir
          this.formViewVal['nama_jenis_transaksi'] = duplDataWL[i]['nama_jenis_transaksi']
          this.formViewVal['nama_tipe_transaksi'] = duplDataWL[i]['nama_tipe_transaksi']
          // Status
          this.formViewVal['jenis_jurnal'] = duplDataWL[i]['jurnal_kasir'] === '1' ? '2' : '0'
          this.formViewVal['tipe_transaksi'] = duplDataWL[i]['tipe_transaksi']
          this.formViewVal['tipe_laporan'] = duplDataWL[i]['tipe_laporan']
          this.formViewVal['rekening'] = duplDataWL[i]['no_rekening'] + ' (' + duplDataWL[i]['nama_bank'] + ')'
          // Others
          this.formViewVal['saldo_transaksi'] = duplDataWL[i]['saldo_transaksi']

          let x = {
            id_akun: duplDataWL[i]['id_akun'],
            kode_akun: duplDataWL[i]['kode_akun'],
            nama_akun: duplDataWL[i]['nama_akun'],
            keterangan_akun: duplDataWL[i]['nama_akun'] + ' - ' + duplDataWL[i]['kode_akun'],
            kode_divisi: duplDataWL[i]['kode_divisi'],
            nama_divisi: duplDataWL[i]['nama_divisi'],
            kode_departemen: duplDataWL[i]['kode_departemen'],
            nama_departemen: duplDataWL[i]['nama_departemen'],
            keterangan_1: duplDataWL[i]['keterangan_1'],
            keterangan_2: duplDataWL[i]['keterangan_2'],
            saldo_debit: duplDataWL[i]['nilai_debit'],
            saldo_kredit: duplDataWL[i]['nilai_kredit'],
            lembar_giro: duplDataWL[i]['lbr_giro']
          }
          dataDetail.push(x)
          this.formViewVal['detail'] = dataDetail
        }
        // Check Jurnal Type
        if (this.formViewVal.jenis_jurnal === '2') {
          if (this.formViewVal.tipe_transaksi === '0') {
            this.detailTableContain = this.formViewVal['detail'].filter(x => x['saldo_kredit'] != 0)
          } else {
            this.detailTableContain = this.formViewVal['detail'].filter(x => x['saldo_debit'] != 0)
          }
        } else {
          this.detailTableContain = this.formViewVal['detail']
        }
      }
      this.ref.markForCheck()
      this.setLayout(type)
      if (this.formViewVal.jenis_jurnal !== '2') {
        this.formInputLyt.splice(3, 3)
      } else {
        if (this.formViewVal.tipe_laporan !== 'b') {
          this.formInputLyt.splice(4, 1)
        }
      }
    }
  }

  setLayout(type) {
    if (type == this.kodeTranPBPK) {
      this.formInputLyt = [
        {
          label: 'No.Transaksi',
          id: 'no-tran',
          type: 'input',
          valueOf: 'no_tran',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Tgl.Transaksi',
          id: 'tgl-tran',
          type: 'input',
          valueOf: 'tgl_tran',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Cabang',
          id: 'info-cabang',
          type: 'input',
          valueOf: 'info_cabang',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Keterangan',
          id: 'keterangan',
          type: 'input',
          valueOf: 'keterangan',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Catatan',
          id: 'catatan',
          type: 'input',
          valueOf: 'catatan',
          required: false,
          readOnly: false,
          disabled: false
        }
      ]
    } else if (type == this.kodeTranPBJ) {
      this.formInputLyt = [
        {
          label: 'No. Transaksi',
          id: 'no-tran',
          type: 'input',
          valueOf: 'no_tran',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Tgl. Transaksi',
          id: 'tgl-tran',
          type: 'input',
          valueOf: 'tgl_tran',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Cabang',
          id: 'info-cabang',
          type: 'input',
          valueOf: 'info_cabang',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Jenis Transaksi',
          id: 'nama-jenis-transaksi',
          type: 'input',
          valueOf: 'nama_jenis_transaksi',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Rekening Bank',
          id: 'rekening',
          type: 'input',
          valueOf: 'rekening',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Tipe Transaksi',
          id: 'nama-tipe-transaksi',
          type: 'input',
          valueOf: 'nama_tipe_transaksi',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          label: 'Keterangan',
          id: 'keterangan',
          type: 'input',
          valueOf: 'keterangan',
          required: false,
          readOnly: true,
          disabled: true
        },
        {
          formWidth: 'col-5',
          label: 'Catatan',
          id: 'catatan',
          type: 'input',
          valueOf: 'catatan',
          required: false,
          readOnly: false,
          disabled: false
        }
      ]
    }
    this.inputDialog(type)
  }

  onSubmit(inputForm: NgForm) {
    this.loading = true
    this.stsReqPBPK = false // Reset request Pengajuan Buka Periode Kasir
    this.stsReqPBJ = false // Reset request Pengajuan Batal Jurnal
    this.setPreparation()
  }

  actionData(type) {
    this.formInputVal.catatan = this.formViewVal.catatan
    if (this.formInputVal.catatan != '') {
      this.confirmDialog(type)
    } else {
      let alertSetting = {}
      alertSetting['closeAlert'] = 'spesific'
      this.gbl.openSnackBar('Catatan perlu diisi.', 'info', null, alertSetting)
    }
  }

  endData(type) {
    this.ref.markForCheck()
    this.loading = true
    this.dialog.closeAll()
    this.formInputVal.status_approval = type === 'APPROVE' ? '1' : type === 'REVISION' ? '2' : '3'
    let endRes = Object.assign({ kode_perusahaan: this.kodePerusahaan }, this.formInputVal)
    this.request.apiData('worklist', 'u-worklist', endRes).subscribe(
      data => {
        if (data['STATUS'] === 'Y') {
          this.ref.markForCheck()
          let message = type === 'APPROVE' ? 'Status data: Disetujui' : type === 'REVISION' ? 'Status data: Perlu Direvisi' : 'Status data: Ditolak'
          this.setPreparation(message)
        } else {
          this.ref.markForCheck()
          this.loading = false
          this.gbl.openSnackBar(data['RESULT'], 'fail')
        }
      },
      error => {
        this.ref.markForCheck()
        this.loading = false;
        this.gbl.openSnackBar('Gagal melakukan proses approval.', 'fail')
      }
    )
  }

  inputDialog(type?: any) {
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
        formValue: dataSetting['formDetail'],
        inputLayout: dataSetting['detailInputLayout'],
        selectableDatatable: dataSetting['showDtTable'],
        sizeCont: dataSetting['heightTable'],
        noButton: true,
        selectableDisplayColumns: dataSetting['selectableDisplayColumns'],
        selectableData: dataSetting['selectableData'],
        selectableDataRules: [],
        inputPipe: (t, d) => null,
        onBlur: (t, v) => null,
        openDialog: (t) => null,
        resetForm: () => null,
        buttonName: dataSetting['btnName'],
        onSubmit: (x: NgForm) => this.actionData('APPROVE'),
        btnOptionBottom: dataSetting['btnOptionBottom'],
        deleteData: () => null,
        detailJurnal: dataSetting['showDtJurnal'],
        noEditJurnal: true,
        jurnalData: dataSetting['jurnalData'],
        jurnalDataAkun: []
      },
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(
      result => {
        this.dataTableVC == undefined ? null : this.dataTableVC.reset()
        this.ref.markForCheck()
        this.formInputLyt = []
      },
      error => null,
    );
  }

  dataSetting(type) {
    let tmpData = {}
    if (type === this.kodeTranPBPK) {
      tmpData['position'] = '45px'
      tmpData['height'] = '70vh'
      tmpData['widthContent'] = '65vw'
      tmpData['showDtTable'] = true
      tmpData['heightTable'] = 330
      tmpData['selectableDisplayColumns'] = this.detailTableColumn
      tmpData['selectableData'] = this.detailTableContain
      tmpData['showDtJurnal'] = false
      tmpData['btnOptionBottom'] = [
        {
          btnLabel: 'Tolak',
          btnClass: 'btn btn-danger',
          btnStyle: {
            'margin-left': '10px'
          },
          btnCond: false,
          btnClick: () => this.actionData('REJECT')
        },
        {
          btnLabel: 'Revisi',
          btnClass: 'btn',
          btnStyle: {
            'margin-left': '10px',
            'background-color': '#309dc2',
            'color': '#ffffff'
          },
          btnCond: false,
          btnClick: () => this.actionData('REVISION')
        }
      ]
    } else if (type === this.kodeTranPBJ) {
      tmpData['position'] = '45px'
      tmpData['height'] = '75vh'
      tmpData['widthContent'] = '85vw'
      tmpData['showDtTable'] = false
      tmpData['selectableDisplayColumns'] = []
      tmpData['selectableData'] = []
      tmpData['showDtJurnal'] = true
      tmpData['jurnalData'] = this.detailTableContain
      tmpData['btnOptionBottom'] = [
        {
          btnLabel: 'Tolak',
          btnClass: 'btn btn-danger',
          btnStyle: {
            'margin-left': '10px'
          },
          btnCond: false,
          btnClick: () => this.actionData('REJECT')
        }
      ]
    }
    tmpData['titleName'] = this.formInputVal.nama_approval
    tmpData['formDetail'] = this.formViewVal
    tmpData['detailInputLayout'] = this.formInputLyt
    tmpData['btnName'] = 'Setuju'

    return tmpData
  }

  confirmDialog(type) { // Confirmation Dialog
    this.gbl.topPage()
    const dialogRef = this.dialog.open(ConfirmationdialogComponent, {
      width: '30vw',
      height: 'auto',
      maxWidth: '95vw',
      maxHeight: '95vh',
      backdropClass: 'bg-dialog',
      position: { top: '120px' },
      data: {
        title: 'Konfirmasi data',
        buttonLayout: [
          {
            btnLabel: 'Submit',
            btnClass: 'btn btn-primary',
            btnClick: () => {
              this.endData(type)
            },
            btnCondition: () => {
              return true
            }
          },
          {
            btnLabel: 'Tutup',
            btnClass: 'btn btn-secondary',
            btnClick: () => null,
            btnCondition: () => {
              return true
            },
            clickCondition: 'close'
          }
        ],
        labelLayout: [
          {
            content: type === 'APPROVE' ? 'Approve data transaksi ?' : type === 'REVISION' ? 'Revisi data transaksi ?' : 'Tolak data transaksi ?',
            style: {
              'color': '#6A99D5',
              'font-size': '15px',
              'font-weight': 'bold'
            }
          }
        ],
        inputLayout: []
      },
      disableClose: true
    })

    dialogRef.afterClosed().subscribe(
      result => null,
      error => null
    )
  }

}
