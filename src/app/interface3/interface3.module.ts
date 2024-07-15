import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Interface3Component} from "./interface3.component";
import {RouterModule, Routes} from "@angular/router";
import {MatInputModule} from "@angular/material/input";
import {ReactiveFormsModule} from "@angular/forms";
import {MatSelectModule} from "@angular/material/select";
import {MatTabsModule} from "@angular/material/tabs";
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {Interface2Component} from "../interface2/interface2.component";
import {ClientFormComponent} from "../interface2/client-form/client-form.component";
import {EmployeeFormComponent} from "./employee-form/employee-form.component";
import { AgenceFormComponent } from './agence-form/agence-form.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";

const routes: Routes = [
  {path: '', component: Interface3Component},
  {path: 'form', component: EmployeeFormComponent}
]

@NgModule({
  declarations: [
      Interface3Component,
    EmployeeFormComponent,
    AgenceFormComponent
  ],
    imports: [
        RouterModule.forChild(routes),
        CommonModule,
        MatInputModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatTabsModule,
        MatPaginatorModule,
        MatTableModule,
        MatSortModule,
        MatIconModule,
        MatButtonModule,
        MatProgressBarModule,
    ]
})
export class Interface3Module { }
