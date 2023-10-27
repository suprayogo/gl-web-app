// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
//Shared
import { SharedModule } from '../shared.module';
// Services
import { TypesUtilsService, LayoutUtilsService } from '../../../core/_base/crud';
// Shared
import { ActionNotificationComponent } from '../../partials/content/crud';

// Material
import {
  MatInputModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatSortModule,
  MatTableModule,
  MatSelectModule,
  MatMenuModule,
  MatProgressBarModule,
  MatButtonModule,
  MatCheckboxModule,
  MatDialogModule,
  MatTabsModule,
  MatNativeDateModule,
  MatCardModule,
  MatRadioModule,
  MatIconModule,
  MatDatepickerModule,
  MatExpansionModule,
  MatAutocompleteModule,
  MAT_DIALOG_DEFAULT_OPTIONS,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { TimeoutInterceptorService, DEFAULT_TIMEOUT } from '../../../service/timeout-interceptor.service';
// COMPONENTS
import { JurnalComponent } from './jurnal/jurnal.component';
import { PostingJurnalComponent } from './posting-jurnal/posting-jurnal.component';
import { OtomatisJurnalComponent } from './otomatis-jurnal/otomatis-jurnal.component';
import { JurnalTransaksiComponent } from './jurnal-transaksi/jurnal-transaksi.component';
import { TutupHarianKasirComponent } from './tutup-harian-kasir/tutup-harian-kasir.component';
import { JurnalUmumTutupSementaraComponent } from './jurnal-umum-tutup-sementara/jurnal-umum-tutup-sementara.component';
import { JurnalTransaksiPeriodeSementaraComponent } from './jurnal-transaksi-periode-sementara/jurnal-transaksi-periode-sementara.component';
import { JurnalTemplateTransaksiComponent } from './jurnal-template-transaksi/jurnal-template-transaksi.component';
import { BatchComponent } from './batch/batch.component';
import { DaftarKerjaComponent } from './daftar-kerja/daftar-kerja.component';
import { JurnalBatchRevComponent } from './jurnal-batch-rev/jurnal-batch-rev.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'jurnal-umum',
    pathMatch: 'full'
  },
  {
    path: 'jurnal-umum',
    component: JurnalComponent,
  },
  {
    path: 'posting-jurnal-tutup-periode',
    component: PostingJurnalComponent
  },
  {
    path: 'otomatis-jurnal',
    component: OtomatisJurnalComponent
  },
  {
    path: 'jurnal-transaksi',
    component: JurnalTransaksiComponent,
  },
  {
    path: 'tutup-kasir',
    component: TutupHarianKasirComponent,
  },
  {
    path: 'jurnal-umum-tutup-sementara',
    component: JurnalUmumTutupSementaraComponent
  },
  {
    path: 'jurnal-transaksi-buka-kembali',
    component: JurnalTransaksiPeriodeSementaraComponent,
  },
  {
    path: 'jurnal-template-transaksi',
    component: JurnalTemplateTransaksiComponent,
  },
  {
    path: 'jurnal-batch',
    // component: JurnalBatchRevComponent
    component: BatchComponent
  },
  {
    path: 'jurnal-batch-rev',
    component: JurnalBatchRevComponent
    // component: BatchComponent
  },
  {
    path: 'daftar-kerja',
    component: DaftarKerjaComponent
  }
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    RouterModule.forChild(routes),
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forChild(),
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule
  ],
  providers: [
    TimeoutInterceptorService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TimeoutInterceptorService,
      multi: true
    },
    {
      provide: DEFAULT_TIMEOUT, useValue: 60000
    },
    {
      provide: MAT_DIALOG_DEFAULT_OPTIONS,
      useValue: {
        hasBackdrop: true,
        panelClass: 'kt-mat-dialog-container__wrapper',
        height: 'auto',
        width: '900px'
      }
    },
    TypesUtilsService,
    LayoutUtilsService
  ],
  entryComponents: [
    ActionNotificationComponent
  ],
  declarations: [
    JurnalComponent,
    PostingJurnalComponent,
    OtomatisJurnalComponent,
    JurnalTransaksiComponent,
    TutupHarianKasirComponent,
    JurnalUmumTutupSementaraComponent,
    JurnalTransaksiPeriodeSementaraComponent,
    JurnalTemplateTransaksiComponent,
    BatchComponent,
    DaftarKerjaComponent,
    JurnalBatchRevComponent
  ]
})
export class TransaksiModule { }
