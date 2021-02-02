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


// COMPONENTS
import { TransaksiJurnalComponent } from './transaksi-jurnal/transaksi-jurnal.component';
import { SaldoAkunComponent } from './saldo-akun/saldo-akun.component';
import { BukuBesarComponent } from './buku-besar/buku-besar.component';
import { TransaksiKasirComponent } from './transaksi-kasir/transaksi-kasir.component';
import { HistoriEditKasirComponent } from './histori-edit-kasir/histori-edit-kasir.component';
import { TransaksiJurnalOtomatisComponent } from './transaksi-jurnal-otomatis/transaksi-jurnal-otomatis.component';
import { TransaksiBatchComponent } from './transaksi-batch/transaksi-batch.component';


const routes: Routes = [
  {
    path: 'transaksi-jurnal-per-periode',
    component: TransaksiJurnalComponent
  },
  {
    path: 'saldo-akun-periode-aktif',
    component: SaldoAkunComponent
  },
  {
    path: 'transaksi-kasir',
    component: TransaksiKasirComponent
  },
  {
    path: 'transaksi-jurnal-otomatis',
    component: TransaksiJurnalOtomatisComponent
  },
  {
    path: 'histori-edit-kasir',
    component: HistoriEditKasirComponent
  }
];

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
    TransaksiJurnalComponent,
    SaldoAkunComponent,
    BukuBesarComponent,
    TransaksiKasirComponent,
    HistoriEditKasirComponent,
    TransaksiJurnalOtomatisComponent,
    TransaksiBatchComponent
  ]
})
export class MonitoringModule { }