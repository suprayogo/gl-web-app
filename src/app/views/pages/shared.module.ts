import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

//Angular Material Module
import {
  MatPaginatorModule, // Table Pagination module -- datatable
  MatTableModule,     // Table Module -- datatable
  MatSortModule,      // Table Sort module -- datatable
  MatTabsModule,      // Material Tab module
  MatInputModule,     // Material Input module -- datatable
  MatListModule,      // Material List module
  MatSelectModule,    // Table Select module -- datable
  MatToolbarModule,   // Material Toolbar module -- unused yet
  MatCheckboxModule,  // Table Material Checkbox -- datatable
  MatDialogModule,     // Mateial dialog (Modal)
  MatProgressSpinnerModule,
  MatSnackBarModule,
  MatIconModule,
  MatTooltipModule
} from '@angular/material';

//Currency mask module
import { NgxCurrencyModule } from 'ngx-currency';

//Ag Grid Module
import { AgGridModule } from 'ag-grid-angular';

// Component Call
import { DialogComponent } from './components/dialog/dialog.component';
import { TreeviewComponent } from './components/treeview/treeview.component';
import { ReportdialogComponent } from './components/reportdialog/reportdialog.component';
import { DatatableAgGridComponent } from './components/datatable-ag-grid/datatable-ag-grid.component';
import { DetailinputAgGridComponent } from './components/detailinput-ag-grid/detailinput-ag-grid.component';
import { DeleteRowButtonComponent } from './components/cell-renderer/delete-row-button/delete-row-button.component';
import { EditRowButtonComponent } from './components/cell-renderer/edit-row-button/edit-row-button.component';
import { LoadingComponent } from './components/loading/loading.component';
import { AlertdialogComponent } from './components/alertdialog/alertdialog.component';
import { ForminputComponent } from './components/forminput/forminput.component';

// import { InputdialogComponent } from './components/inputdialog/inputdialog.component';
// import { LoadingComponent } from './components/loading/loading.component';
// import { DatatableComponent } from './components/datatable/datatable.component';
// import { DetailinputComponent } from './components/detailinput/detailinput.component';
// import { ConfirmationdialogComponent } from './components/confirmationdialog/confirmationdialog.component';
// import { ViewdialogComponent } from './components/viewdialog/viewdialog.component';

const currencyOptions = {
  align: "left",
  allowNegative: false,
  allowZero: true,
  decimal: ",",
  precision: 0,
  prefix: "",
  suffix: "",
  thousands: ".",
  nullable: false
}

@NgModule({
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule,
    NgxCurrencyModule.forRoot(currencyOptions),
    AgGridModule.withComponents([
      DeleteRowButtonComponent,
      EditRowButtonComponent
    ])
  ],
  exports: [
    //Detail 
    // DetailinputComponent, DELETE
    DetailinputAgGridComponent,

    //Datatable
    // DatatableComponent, DELETE
    DatatableAgGridComponent,

    //Dialog
    DialogComponent,
    // InputdialogComponent, DELETE
    // ConfirmationdialogComponent, DELETE
    ReportdialogComponent,
    AlertdialogComponent,

    //Treeview
    TreeviewComponent,

    //Loading Screen,
    LoadingComponent,

    //Form Input Layout
    ForminputComponent,

    //Angular Material Module
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatInputModule,
    MatListModule,
    MatSelectModule,
    MatToolbarModule,
    MatCheckboxModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatIconModule,
    MatTooltipModule
  ],
  declarations: [
    //Detail 
    // DetailinputComponent, DELETE
    DetailinputAgGridComponent,

    //Datatable
    // DatatableComponent, DELETE
    DatatableAgGridComponent,

    //Dialog
    DialogComponent,
    // InputdialogComponent, DELETE
    // ConfirmationdialogComponent, DELETE
    // ViewdialogComponent, DELETE
    ReportdialogComponent,
    AlertdialogComponent,

    //Treeview
    TreeviewComponent,

    //Loading Screen,
    LoadingComponent,

    //Form Input Layout
    ForminputComponent,

    //Renderer
    DeleteRowButtonComponent,
    EditRowButtonComponent
  ],
  entryComponents: [
    //List of mini component
    DialogComponent,
    AlertdialogComponent,
    // InputdialogComponent, DELETE
    // ConfirmationdialogComponent, DELETE
    ReportdialogComponent,
    // ViewdialogComponent DELETE
  ],
})
export class SharedModule { }
