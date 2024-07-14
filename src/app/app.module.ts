import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import { MatBadgeModule } from "@angular/material/badge";
import { MatBottomSheetModule } from "@angular/material/bottom-sheet";
import { MatButtonToggleModule } from "@angular/material/button-toggle";
import { MatCardModule } from "@angular/material/card";
import { MatChipsModule } from "@angular/material/chips";
import { MatRippleModule, MatNativeDateModule } from "@angular/material/core";
import { MatDialogModule } from "@angular/material/dialog";
import { MatDividerModule } from "@angular/material/divider";
import { MatExpansionModule } from "@angular/material/expansion";
import { MatIconModule } from "@angular/material/icon";
import { MatPaginatorModule } from "@angular/material/paginator";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { MatSnackBarModule } from "@angular/material/snack-bar";
import { MatSortModule } from "@angular/material/sort";
import { MatStepperModule } from "@angular/material/stepper";
import { MatTableModule } from "@angular/material/table";
import { MatTabsModule } from "@angular/material/tabs";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatTreeModule } from "@angular/material/tree";
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatButtonModule } from "@angular/material/button";
import { MatCheckboxModule } from "@angular/material/checkbox";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatGridListModule } from "@angular/material/grid-list";
import { MatInputModule } from "@angular/material/input";
import { MatListModule } from "@angular/material/list";
import { MatMenuModule } from "@angular/material/menu";
import { MatRadioModule } from "@angular/material/radio";
import { MatSelectModule } from "@angular/material/select";
import { MatSidenavModule } from "@angular/material/sidenav";
import { MatSlideToggleModule } from "@angular/material/slide-toggle";
import { MatSliderModule } from "@angular/material/slider";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatMomentDateModule } from "@angular/material-moment-adapter";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticateComponent } from './authenticate/authenticate.component';
import {AppLoaderComponent} from "./authenticate/app-loader/app-loader.component";
import {AppLoaderService} from "./authenticate/app-loader/app-loader.service";
import {CookieService} from "ngx-cookie-service";
import { Interface1Component } from './interface1/interface1.component';
import {Interface1Module} from "./interface1/interface1.module";
import {NotFoundComponent} from "./not-found/not-found.component";
import {WalletDashboardService} from "./mayssem/WalletDashboard/wallet-dashboard.service";
import { ResetpasswordComponent } from './authenticate/resetpassword/resetpassword.component';
import { Interface2Component } from './interface2/interface2.component';
import {Interface2Module} from "./interface2/interface2.module";
import { FicheClientComponent } from './Fiches/fiche-client/fiche-client.component';
import { SendEmailDialogComponent } from './authenticate/send-email-dialog/send-email-dialog.component';
import { Interface3Component } from './interface3/interface3.component';
import {Interface3Module} from "./interface3/interface3.module";
import {FicheEmployeeComponent} from "./Fiches/fiche-employee/fiche-employee.component";
import { ProfilComponent } from './profil/profil.component';
import { SignatureComponent } from './tools/signature/signature.component';

import SignaturePad from "signature_pad";
import { CreationComponent } from './authenticate/creation/creation.component';
import { SupprimerComponent } from './profil/supprimer/supprimer.component';
import { QrcodeComponent } from './tools/qrcode/qrcode.component';
import {NgxQRCodeModule} from "ngx-qrcode2";

@NgModule({
  declarations: [
    AppComponent,
    AuthenticateComponent,
    AppLoaderComponent,
    NotFoundComponent,
    ResetpasswordComponent,
    FicheClientComponent,
    SendEmailDialogComponent,
    FicheEmployeeComponent,
    ProfilComponent,
    SignatureComponent,
    CreationComponent,
    SupprimerComponent,
    QrcodeComponent,






  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MatCheckboxModule,
    MatButtonModule,
    MatInputModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatRadioModule,
    MatSelectModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatStepperModule,
    MatTabsModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatChipsModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatDialogModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatNativeDateModule,
    MatMomentDateModule,
    MatTreeModule,
    MatRippleModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatDividerModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatIconModule,
    FormsModule,
    NgxQRCodeModule,


  ],
  exports: [
    Interface1Module,
    Interface2Module,
    Interface3Module,


  ],

  providers: [AppLoaderService,CookieService,WalletDashboardService],
  bootstrap: [AppComponent]
})
export class AppModule { }
