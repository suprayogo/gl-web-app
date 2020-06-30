// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
// NGRX
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
// Translate
import { TranslateModule } from '@ngx-translate/core';
import { PartialsModule } from '../../partials/partials.module';
//Shared
import { SharedModule } from '../shared.module';
// Services
import { HttpUtilsService, TypesUtilsService, InterceptService, LayoutUtilsService } from '../../../core/_base/crud';
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
import {
  usersReducer,
  UserEffects
} from '../../../core/auth';

// COMPONENTS
import { JurnalComponent } from './jurnal/jurnal.component';
import { PostingJurnalComponent } from './posting-jurnal/posting-jurnal.component';
import { OtomatisJurnalComponent } from './otomatis-jurnal/otomatis-jurnal.component';
import { JurnalTransaksiComponent } from './jurnal-transaksi/jurnal-transaksi.component';
import { TutupHarianKasirComponent } from './tutup-harian-kasir/tutup-harian-kasir.component';
import { JurnalUmumTutupSementaraComponent } from './jurnal-umum-tutup-sementara/jurnal-umum-tutup-sementara.component';

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
  }
]

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    PartialsModule,
    SharedModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('users', usersReducer),
    EffectsModule.forFeature([UserEffects]),
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
    InterceptService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: InterceptService,
      multi: true
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
    HttpUtilsService,
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
    JurnalUmumTutupSementaraComponent
  ]
})
export class TransaksiModule { }
